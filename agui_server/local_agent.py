import os
from typing import Any, Dict
from collections.abc import AsyncIterable
from google.adk.agents.llm_agent import LlmAgent
# from google.adk.models.lite_llm import LiteLlm
from google.adk.artifacts import InMemoryArtifactService
from google.adk.memory.in_memory_memory_service import InMemoryMemoryService
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
import json
from pathlib import Path
from dotenv import load_dotenv

from agent_db import fetch_local_agent_by_name
load_dotenv()
SSL_CERT_FILE = os.getenv("SSL_CERT_FILE")

# --- Agent ---

class LocalAgentBuilder:
    """Local agent for user queries."""

    SUPPORTED_CONTENT_TYPES = ["text", "text/plain"]

    def __init__(self,local_agent_info: Dict[str, Any] ) -> None:
        self._agent_info = local_agent_info

    # def get_processing_message(self) -> str:
    #     return "Fetching info..."

    def create_local_agent(self,) -> LlmAgent:
        """Build the LLM agent."""
        # LITELLM_MODEL = os.getenv("LITELLM_MODEL", "gemini/gemini-2.0-flash-001")
        model_name = "gemini-2.5-flash"
        info = self._agent_info
        if not info:
            raise ValueError(f"Local agent with name '{self._local_agent_name}' not found in database.")
        print("NAME", info.get("name"))
        print("Description",info.get("description"))
        return LlmAgent(
            model=model_name,
            name=info.get("name", "").replace(" ", "_") ,
            description=info.get("description", ""),
            instruction=info.get("instructions", ""),

        )
    

async def get_local_agent(name: str):
    local_agent_data = await fetch_local_agent_by_name(name)
    builder = LocalAgentBuilder(local_agent_data)
    return builder.create_local_agent()

