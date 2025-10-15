import os
from typing import Any, Dict
from collections.abc import AsyncIterable
from google.adk.agents.llm_agent import LlmAgent
from google.adk.artifacts import InMemoryArtifactService
from google.adk.memory.in_memory_memory_service import InMemoryMemoryService
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
import json
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()
SSL_CERT_FILE = os.getenv("SSL_CERT_FILE")

def _load_config(local_agent_db_path: str) -> Dict[str, Any]:
    """Load local agent config from database."""
   
    if not local_agent_db_path.exists():
        raise FileNotFoundError(f"Local agent config file not found: {local_agent_db_path}")
    with open(local_agent_db_path, 'r') as f:
        return json.load(f)
    
def _load_local_model_info(name:str) -> Dict[str, Any]:
    """Load local model info from database."""
    DB_PATH = Path(os.getenv("DB_PATH"))
    local_agent_db_path = DB_PATH / "local_agents" / "local_agents.json"
    local_agent_data = _load_config(local_agent_db_path)
    agent_info = next((agent for agent in local_agent_data.get("local_agents", []) if agent["name"] == name), None)
    if not agent_info:
        raise ValueError(f"Local agent with name '{name}' not found in database.")
    model_info = {
        "agent_name":agent_info.get("name",""),
        "description":agent_info.get("description",""),
        "instruction":agent_info.get("instruction",""),
    }
    return model_info
# --- Agent ---

class LocalAgent:
    """Local agent for user queries."""

    SUPPORTED_CONTENT_TYPES = ["text", "text/plain"]

    def __init__(self,local_agent_name: str) -> None:
        self._local_agent_name = local_agent_name
        self._agent = self._build_agent()
        self._user_id = "self"
        self._runner = Runner(
            app_name=self._agent.name,
            agent=self._agent,
            artifact_service=InMemoryArtifactService(),
            session_service=InMemorySessionService(),
            memory_service=InMemoryMemoryService(),
        )

    def get_processing_message(self) -> str:
        return "Fetching weather/time info..."

    def _get_model_info(self) -> dict[str, Any]:
        """Get model info from database."""
        return _load_local_model_info(self._local_agent_name)

    def _build_agent(self) -> LlmAgent:
        """Build the LLM agent for weather and time tasks."""
        # LITELLM_MODEL = os.getenv("LITELLM_MODEL", "gemini/gemini-2.0-flash-001")
        model_name = "gemini-2.5-flash"
        info = self._get_model_info()
        if not info:
            raise ValueError(f"Local agent with name '{self._local_agent_name}' not found in database.")
        
        return LlmAgent(
            model=model_name,
            name=info.get("agent_name", "").replace(" ", "_") ,
            description=info.get("description", ""),
            instruction=info.get("instruction", ""),

        )