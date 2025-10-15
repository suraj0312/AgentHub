import asyncio
import os
import uuid
from a2a.server.agent_execution import AgentExecutor, RequestContext
from agent import HitlAgent
from autogen_agentchat.base import TaskResult
from autogen_agentchat.messages import UserInputRequestedEvent,TextMessage,HandoffMessage
from a2a.server.events import EventQueue
from a2a.server.tasks import TaskUpdater
from a2a.types import (
    Part,
    TaskState,
    TextPart,

)
from a2a.utils import (
    new_agent_text_message,
    new_task,
)
from typing import Dict
import asyncio
import aiofiles,json

# import logging
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)


class HitlAgentExecutor(AgentExecutor):
    def __init__(self):
        self.agents: Dict[str, HitlAgent] = {}
        # self.states: Dict[str, ExecutorState] = {}

    async def execute(
        self,
        context: RequestContext,
        event_queue: EventQueue,
    ) -> None:
        ctx_id = context.context_id # Use task_id
        user_input = context.get_user_input()
        print("CONTEXT MESSAGE \n",context.message)
        updater = TaskUpdater(event_queue,context.task_id,context.context_id)
        # init if first time
        if ctx_id not in self.agents:
            self.agents[ctx_id] = HitlAgent()

        agent = self.agents[ctx_id]
        agent.user_input_required = False
        try:
            team = await agent.get_team(ctx_id)
            stream =  team.run_stream(task = user_input)
            async for message in stream:
                if agent.user_input_required:
                    continue
                if not isinstance(message, TaskResult):
                    print(f"{message.source} - {message.content}\n{"-"*80}")

                if isinstance(message,TaskResult):
                    await updater.add_artifact(
                            [Part(root=TextPart(text=message.stop_reason))],
                            name='response',
                        )
                    await updater.complete()

                elif isinstance(message,TextMessage):
                    await updater.start_work(new_agent_text_message(str(message.content)))

                elif isinstance(message,HandoffMessage):
                    print("Will send input-required event")
                    agent.user_input_required = True
                    # user_input_required =True
                    await updater.requires_input(new_agent_text_message(f"{message.content}"),final=False)
                    

            print("Is team is running",team._is_running)
            # await agent.save_state()
                    # break

        except Exception as e:
            print("Exception Occurred",e)

    async def cancel(
        self, context: RequestContext, event_queue: EventQueue
        ) -> None:
        raise Exception('cancel not supported')