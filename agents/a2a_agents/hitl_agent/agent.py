import httpx
from autogen_ext.models.openai import AzureOpenAIChatCompletionClient
from autogen_agentchat.agents import AssistantAgent
from dotenv import load_dotenv
import os
from autogen_agentchat.conditions import HandoffTermination, TextMentionTermination
from autogen_agentchat.base import Handoff
from autogen_agentchat.teams import RoundRobinGroupChat


load_dotenv()

AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")
AZURE_OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
AZURE_OPENAI_MODEL_NAME = os.getenv("AZURE_OPENAI_MODEL_NAME")
SSL_CERT_FILE = os.getenv("SSL_CERT_FILE")

httpx_client = httpx.AsyncClient(verify=False)

model_client = AzureOpenAIChatCompletionClient(
azure_deployment=AZURE_OPENAI_DEPLOYMENT_NAME,
model=AZURE_OPENAI_MODEL_NAME,
api_version=AZURE_OPENAI_API_VERSION,
azure_endpoint=AZURE_OPENAI_ENDPOINT,
api_key=AZURE_OPENAI_API_KEY,
httpx=httpx_client
)
class HitlAgent:
    def __init__(self):
        print("Initializing HitlAgent...")
        self.team =None
        self.context_id = None
        self.user_input_required = False

    async def get_team(self,context_id):
        self.context_id = context_id
    
        host_agent = AssistantAgent(
                            "HitlAgent",
                            model_client=model_client,
                            handoffs=[Handoff(target="user", message="Transfer to user.")],
                            system_message="You are an AI assistant agent. Your job is to answer the user's question. If you cannot complete the task, transfer to user. Otherwise, when finished, respond with 'TERMINATE'."
                        )

        handoff_termination = HandoffTermination(target="user")
        text_termination = TextMentionTermination("TERMINATE")

        if not self.team:
            self.team = RoundRobinGroupChat([host_agent], description="Only perform the requested task.", termination_condition=handoff_termination | text_termination)

        return self.team
    