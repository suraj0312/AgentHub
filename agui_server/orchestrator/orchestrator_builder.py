import json
from pathlib import Path
from typing import Dict, Any, Optional, List

from google.adk.agents.llm_agent import Agent
from google.adk.agents import SequentialAgent
from google.adk.agents.remote_a2a_agent import AGENT_CARD_WELL_KNOWN_PATH
from google.adk.agents.remote_a2a_agent import RemoteA2aAgent
from google.genai import types
from google.adk.tools import agent_tool
import os
from dotenv import load_dotenv
from google.adk.planners import PlanReActPlanner, BuiltInPlanner
from agent_db import fetch_orchestrator_by_name
import json
from typing import Dict, Any, List, Optional

load_dotenv()
class OrchestratorBuilder:
    def __init__(self, orchestrator_config: Dict[str, Any]):
        self.orchestrator_config = orchestrator_config

    def _fetch_instructions_for_agent(self, agent_config: Dict[str, Any]) -> str:
        instructions = agent_config.get("instructions", "").strip()

        if not instructions:
            if agent_config["type"] == "orchestrator":
                instructions = """
                    You are a helpful orchestrator agent. Your primary role is to understand user requests and
                    delegate tasks to your specialized sub-agents.

                    Follow these guidelines:
                    1. Identify which of your sub-agents is best suited to handle the user's current request.
                    2. If multiple sub-agents are needed, determine the logical order of execution.
                    3. Pass the relevant parts of the user's request to the appropriate sub-agent.
                    4. Synthesize the responses from your sub-agents into a coherent and helpful final answer for the user.
                    5. Do not invent information; rely solely on the responses from your sub-agents.
                    6. If a sub-agent's response is unclear or insufficient, try to refine your query to the sub-agent if possible, or inform the user if the task cannot be completed.
                """
            elif agent_config["type"] == "a2a_agent":
                instructions = f"""
                    You are a specialized agent named '{agent_config.get('name', 'Unknown Agent')}'. Your task is to perform specific operations related to your domain.
                """
        return instructions

    def _create_sub_agent(self, sub_agent_config: Dict[str, Any]) -> Optional[Any]:
        agent_type = sub_agent_config.get("type")
        agent_name = sub_agent_config.get("name", "").replace(" ", "_")
        agent_url = sub_agent_config.get("url")
        agent_instructions = self._fetch_instructions_for_agent(sub_agent_config)

        if agent_type == "a2a_agent":
            agent_card_url = f"{agent_url}{AGENT_CARD_WELL_KNOWN_PATH}"
            return RemoteA2aAgent(
                name=agent_name,
                description=agent_instructions,
                agent_card=agent_card_url,
            )
        return None

    def create_orchestrator_agent(self, model: str = "gemini-2.5-flash") -> Optional[Agent]:
        config = self.orchestrator_config
        if not config:
            return None

        orchestrator_name = config.get("name", "UnnamedOrchestrator").replace(" ", "_")
        instructions = self._fetch_instructions_for_agent(config)

        sub_agent_tools: List[Any] = []
        for sub_agent_data in config.get("subAgents", []):
            sub_agent = self._create_sub_agent(sub_agent_data)
            if sub_agent:
                tool_agent = agent_tool.AgentTool(agent=sub_agent)
                sub_agent_tools.append(tool_agent)

        safety_settings = [
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=types.HarmBlockThreshold.OFF,
            ),
        ]

        orchestrator_agent = Agent(
            model=model,
            planner=PlanReActPlanner(),
            name=orchestrator_name,
            instruction=instructions,
            tools=sub_agent_tools
        )
        return orchestrator_agent


async def get_orchestrator(name: str):
    orchestrator_data = await fetch_orchestrator_by_name(name)
    builder = OrchestratorBuilder(orchestrator_data)
    return builder.create_orchestrator_agent()
