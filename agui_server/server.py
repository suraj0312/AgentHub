from calendar import c
import json
import os
from threading import local
import uuid
import logging
from pathlib import Path
from typing import Dict, Literal
import uvicorn
import asyncio
from fastapi import FastAPI, Request, routing
from fastapi.responses import JSONResponse, StreamingResponse
from a2a.client import A2ACardResolver, A2AClient
from a2a.types import AgentCard, MessageSendParams, SendStreamingMessageRequest
import httpx
from asyncio import gather
from sqlalchemy.future import select
from orchestrator.orchestrator_builder import get_orchestrator
from local_agent import get_local_agent
from google.adk.artifacts import InMemoryArtifactService
from google.adk.memory.in_memory_memory_service import InMemoryMemoryService
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from collections.abc import AsyncIterator
from fastapi import Depends

from agent_db import (
    get_db,
    init_db,
    insert_agent,
    fetch_all_agents,
    AgentType,
    delete_agent,
    update_agent
)

from google.adk.events import Event
from dotenv import load_dotenv
load_dotenv()

# --- AG-UI event format ---
from ag_ui.core import (
    RunAgentInput,
    EventType,
    RunStartedEvent,
    RunFinishedEvent,
    RunErrorEvent,
    TextMessageContentEvent,
    TextMessageStartEvent,
    TextMessageEndEvent,
    CustomEvent
)
from ag_ui.encoder import EventEncoder
from fastapi.middleware.cors import CORSMiddleware
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AG-UI A2A Server")

origins = [
    "http://localhost:3000",  # Next.js dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

a2a_client: A2AClient | None = None
httpx_client: httpx.AsyncClient | None = None
runner: Runner | None = None
agent_type: Literal["a2a_agent", "orchestrator","local_agent"] | None = None
# DB_PATH = Path(os.getenv("DB_PATH"))
base_url = "http://localhost:10000"  # Make this global and mutable
current_active_orchestrator_or_agent: str | None = None

class TaskContextManager:
    """Manages task and context IDs per (user, agent)."""

    def __init__(self):
        # (user_key, agent_url) → context
        self._data: Dict[tuple[str, str], Dict[str, str | bool]] = {}

    def set(self, user_key: str, agent_url: str, task_id: str, context_id: str, active: bool = True):
        self._data[(user_key, agent_url)] = {
            "taskId": task_id,
            "contextId": context_id,
            "active": active,
        }

    def get(self, user_key: str, agent_url: str) -> Dict[str, str] | None:
        return self._data.get((user_key, agent_url))

    def is_active(self, user_key: str, agent_url: str) -> bool:
        return bool(self._data.get((user_key, agent_url), {}).get("active", False))

    def deactivate(self, user_key: str, agent_url: str):
        if (user_key, agent_url) in self._data:
            self._data[(user_key, agent_url)]["active"] = False

    def clear(self, user_key: str, agent_url: str):
        self._data.pop((user_key, agent_url), None)

    def log(self, user_key: str, agent_url: str, logger: logging.Logger):
        if (user_key, agent_url) in self._data:
            ctx = self._data[(user_key, agent_url)]
            logger.info(
                f"Context for ({user_key}, {agent_url}): "
                f"taskId={ctx['taskId']} contextId={ctx['contextId']} active={ctx['active']}"
            )
        else:
            logger.info(f"No context found for ({user_key}, {agent_url})")

context_manager = TaskContextManager()

@app.get("/get-agents")
async def get_agents(db= Depends(get_db)):
    agents = await fetch_all_agents(db)
    return JSONResponse(content=agents)

@app.post("/set-agent-url")
async def set_agent_url(request: Request, db=Depends(get_db)):
    """Set the agent base URL dynamically from frontend."""
    global base_url, a2a_client, httpx_client, agent_type, current_active_orchestrator_or_agent

    data = await request.json()
    logging.info(f"Data Received: {data}")

    agent_type = data.get("type")
    new_name = data.get("name")
    new_url = data.get("url")
    current_active_orchestrator_or_agent = new_name

    if not agent_type or not new_name or (agent_type != "local_agent" and not new_url):
        return JSONResponse({"error": "Missing required fields"}, status_code=400)

    # Handle A2A agent initialization
    if agent_type == AgentType.a2a_agent:
        base_url = new_url
        resolver = A2ACardResolver(httpx_client=httpx_client, base_url=base_url)
        try:
            card: AgentCard = await resolver.get_agent_card()
            a2a_client = A2AClient(httpx_client=httpx_client, agent_card=card)
            data['description'] = card.description
            data['framework'] = card.capabilities.extensions[0].params["framework"]
            logging.info(f"Fetched agent card: {card.description}")
        except Exception as e:
            logging.error(f"Failed to fetch agent card: {e}")
            return JSONResponse({"error": str(e)}, status_code=500)

    # Insert into DB (handles duplicate check internally)
    result = await insert_agent(data, db)
    return JSONResponse(content=result)


@app.post("/delete-agent")
async def delete_agent_endpoint(request: Request, db=Depends(get_db)):
    data = await request.json()
    result = await delete_agent(data, db)
    return JSONResponse(content=result)

@app.post("/update-agent")
async def update_agent_endpoint(request: Request, db=Depends(get_db)):
    data = await request.json()
    result = await update_agent(data, db)
    return JSONResponse(content=result)


@app.on_event("startup")
async def startup_event():
    """Initialize A2A client on startup"""

    global a2a_client
    global httpx_client
    global base_url
    # base_url = "http://localhost:9999"
    logger.info(f"Connecting to A2A server at {base_url}")
    await init_db()

    # Create global AsyncClient
    httpx_client = httpx.AsyncClient(timeout=httpx.Timeout(30))

    # Resolve AgentCard
    resolver = A2ACardResolver(httpx_client=httpx_client, base_url=base_url)
    try:
        card: AgentCard = await resolver.get_agent_card()
        logger.info("Fetched public agent card successfully.")
        a2a_client = A2AClient(httpx_client=httpx_client, agent_card=card)
    except Exception as e:
        logger.error(f"Failed to fetch agent card: {e}", exc_info=True)
        raise

# context_id_data: Dict[str, Dict[str, str]] = {}


@app.post("/")
async def agentic_chat_endpoint(input_data: RunAgentInput, request: Request):
    """A2A agentic chat endpoint"""
    accept_header = request.headers.get("accept")
    encoder = EventEncoder(accept=accept_header)
    async def event_generator():
        agent_url = base_url
        user_key = input_data.thread_id
        try:
            if agent_type == "a2a_agent":
                async for ev in process_a2a_agent_stream(input_data, encoder):
                    yield ev
            elif agent_type == "orchestrator" or agent_type == "local_agent":
                async for ev in process_orchestrator_stream(input_data, encoder):
                    yield ev
            else:
                yield encoder.encode(
                    RunErrorEvent(type=EventType.RUN_ERROR, message="Unknown agent type")
                )

        except Exception as error:
            logger.error(f"Error in event_generator: {error}", exc_info=True)
            yield encoder.encode(
                RunErrorEvent(type=EventType.RUN_ERROR, message=str(error))
            )
            context_manager.clear(user_key, agent_url)

    return StreamingResponse(
        event_generator(),
        media_type=encoder.get_content_type(),
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

async def process_a2a_agent_stream(input_data: RunAgentInput, encoder: EventEncoder):
    """Handle streaming events from A2A agent."""
    agent_url = base_url
    user_key = input_data.thread_id
    message_id = str(uuid.uuid4().hex)

    yield encoder.encode(
        RunStartedEvent(
            type=EventType.RUN_STARTED,
            thread_id=input_data.thread_id,
            run_id=input_data.run_id,
        )
    )

    send_message_payload = {
        "message": {
            "role": "user",
            "parts": [{"kind": "text", "text": input_data.messages[-1].content}],
            "messageId": message_id,
        }
    }

    if context_manager.is_active(user_key, agent_url):
        ctx = context_manager.get(user_key, agent_url)
        send_message_payload["message"].update({
            "taskId": ctx["taskId"],
            "contextId": ctx["contextId"],
            "referenceTaskIds": [ctx["taskId"]],
        })
        context_manager.log(user_key, agent_url, logger)
    else:
        logger.info(f"Starting new task for {user_key}")

    streaming_request = SendStreamingMessageRequest(
        id=str(uuid.uuid4().hex), params=MessageSendParams(**send_message_payload)
    )

    stream_response = a2a_client.send_message_streaming(streaming_request)

    first_chunk_text = True
    async for task_event in stream_response:
        dumped_event = task_event.model_dump(mode="json", exclude_none=True)
        print("Dumped Event:", dumped_event)
        kind = dumped_event["result"]["kind"]

        if kind == "status-update":
            context_manager.set(
                        user_key,
                        agent_url,
                        dumped_event["result"]["taskId"],
                        dumped_event["result"]["contextId"],
                        active=True,
                    )

            state = dumped_event["result"]["status"]["state"]
            if state == "input-required":
                yield encoder.encode(
                    TextMessageContentEvent(
                        type=EventType.TEXT_MESSAGE_CONTENT,
                        message_id=message_id,
                        delta=dumped_event["result"]["status"]["message"]["parts"][0]["text"],
                    )
                )
                yield encoder.encode(
                    TextMessageEndEvent(
                        type=EventType.TEXT_MESSAGE_END,
                        message_id=message_id,
                    )
                )
                yield encoder.encode(
                    RunFinishedEvent(
                        type=EventType.RUN_FINISHED,
                        thread_id=input_data.thread_id,
                        run_id=input_data.run_id,
                    )
                )
                # context_manager.deactivate(user_key)
                return

            elif state == "working" and "message" in dumped_event["result"]["status"]:
                # Process streaming text content
                message_content = "processing..."
                if dumped_event["result"]["status"]["message"]["parts"]:
                    # message_content = dumped_event["result"]["status"]["message"]["parts"][0]["text"]
                    message_content = dumped_event["result"]["status"]["message"]["parts"][0].get("text", "processing... ")

                if first_chunk_text:
                    yield encoder.encode(
                        TextMessageStartEvent(
                            type=EventType.TEXT_MESSAGE_START,
                            message_id=message_id,
                        )
                    )
                    first_chunk_text = False

                yield encoder.encode(
                    TextMessageContentEvent(
                        type=EventType.TEXT_MESSAGE_CONTENT,
                        message_id=message_id,
                        delta=message_content,
                    )
                )

        elif kind == "artifact-update":
            context_manager.set(
                        user_key,
                        agent_url,
                        dumped_event["result"]["taskId"],
                        dumped_event["result"]["contextId"],
                        active=True,
                    )

            artifact_name = dumped_event["result"]["artifact"].get("name","response")
            if artifact_name == "response":
                text_parts = dumped_event["result"]["artifact"].get("parts", [])
                final_response = text_parts[0]["text"] if text_parts else ""

                if first_chunk_text:
                    yield encoder.encode(
                        TextMessageStartEvent(
                            type=EventType.TEXT_MESSAGE_START,
                            message_id=message_id,
                        )
                    )
                    first_chunk_text = False

                yield encoder.encode(
                    TextMessageContentEvent(
                        type=EventType.TEXT_MESSAGE_CONTENT,
                        message_id=message_id,
                        delta=final_response,
                    )
                )

                yield encoder.encode(
                    TextMessageEndEvent(
                        type=EventType.TEXT_MESSAGE_END,
                        message_id=message_id,
                    )
                )
                yield encoder.encode(
                    RunFinishedEvent(
                        type=EventType.RUN_FINISHED,
                        thread_id=input_data.thread_id,
                        run_id=input_data.run_id,
                    )
                )
                context_manager.clear(user_key, agent_url)  # cleanup
                return
            
    yield encoder.encode(
        RunFinishedEvent(
            type=EventType.RUN_FINISHED,
            thread_id=input_data.thread_id,
            run_id=input_data.run_id,
        )
    )
    context_manager.clear(user_key, agent_url)

async def process_orchestrator_stream(input_data: RunAgentInput, encoder: EventEncoder):
    """Handle streaming from Orchestrator agent using Google ADK directly, yield AG-UI events."""
    message_id = str(uuid.uuid4().hex)
    yield encoder.encode(
    RunStartedEvent(
        type=EventType.RUN_STARTED,
        thread_id=input_data.thread_id,
        run_id=input_data.run_id,
        )
    )
    try:
        if agent_type == "orchestrator":
            # orchestrator_agent = await _async_main(current_active_orchestrator)
            _agent = await get_orchestrator(current_active_orchestrator_or_agent)
            print("Orchestrator Agent Initialized:", _agent)
        elif agent_type == "local_agent":
            
            _agent = await get_local_agent(current_active_orchestrator_or_agent)

            print("Local Agent Initialized:", _agent)

        session_service = InMemorySessionService()
        await session_service.create_session(
            app_name=current_active_orchestrator_or_agent,
            user_id="self",
            session_id=input_data.thread_id
        )
        runner = Runner(
            app_name=current_active_orchestrator_or_agent,
            agent=_agent,
            artifact_service=InMemoryArtifactService(),
            session_service=session_service,
            memory_service=InMemoryMemoryService(),
        )

    except Exception as e:
        print(f"Failed to initialize orchestrator agent: {e}")
        yield encoder.encode(
            RunErrorEvent(
                type=EventType.RUN_ERROR,
                thread_id=input_data.thread_id,
                run_id=input_data.run_id,
                message=str(e)
            )
        )

    try:
        # Run orchestrator with ADK streaming
        event_iterator: AsyncIterator[Event] = runner.run_async(
            user_id="self",
            session_id=input_data.thread_id,
            new_message=types.Content(
                role='user', parts=[types.Part(text=input_data.messages[-1].content)]
            )
        )
        first_chunk = True
        async for event in event_iterator:
            print("ORCH EVENT:", event)
            # Stream textual responses
            if event.content and event.content.parts:
                for part in event.content.parts:
                    if part.text:
                        if first_chunk:
                            yield encoder.encode(
                                TextMessageStartEvent(
                                    type=EventType.TEXT_MESSAGE_START,
                                    message_id=message_id,
                                )
                            )
                            first_chunk = False

                        yield encoder.encode(
                            TextMessageContentEvent(
                                type=EventType.TEXT_MESSAGE_CONTENT,
                                message_id=message_id,
                                delta=part.text,
                            )
                        )

            # If final response, close the message stream
            if event.is_final_response():
                if not first_chunk:
                    yield encoder.encode(
                        TextMessageEndEvent(
                            type=EventType.TEXT_MESSAGE_END,
                            message_id=message_id,
                        )
                    )
                yield encoder.encode(
                    RunFinishedEvent(
                        type=EventType.RUN_FINISHED,
                        thread_id=input_data.thread_id,
                        run_id=input_data.run_id,
                    )
                )
                return

        # If stream ended without final response
        if not first_chunk:
            yield encoder.encode(
                TextMessageEndEvent(
                    type=EventType.TEXT_MESSAGE_END,
                    message_id=message_id,
                )
            )
        yield encoder.encode(
            RunFinishedEvent(
                type=EventType.RUN_FINISHED,
                thread_id=input_data.thread_id,
                run_id=input_data.run_id,
            )
        )

    except Exception as e:
        logger.error(f"Error in orchestrator stream: {e}", exc_info=True)
        yield encoder.encode(
            RunErrorEvent(type=EventType.RUN_ERROR, message=f"Orchestrator error: {e}")
        )


def main():
    """Run the uvicorn server."""
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("server:app", host="localhost", port=port, reload=True)


if __name__ == "__main__":
    main()
