from urllib import response
from a2a.server.agent_execution import AgentExecutor, RequestContext
from agent import GitMagenticAgent
from autogen_agentchat.base import TaskResult
from autogen_agentchat.messages import TextMessage
from a2a.server.events import EventQueue
from a2a.server.tasks import TaskUpdater
from a2a.types import (
    Part,
    TextPart,

)
from a2a.utils import (
    new_agent_text_message,
)
from typing import Dict

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class GitMagenticAgentExecutor(AgentExecutor):
    def __init__(self):
        self.agents: Dict[str, GitMagenticAgent] = {}

    async def execute(
        self,
        context: RequestContext,
        event_queue: EventQueue,
    ) -> None:
        ctx_id = context.context_id # Use task_id
        user_input = context.get_user_input()
        print("CONTEXT MESSAGE \n",context.message)
        updater = TaskUpdater(event_queue,context.task_id,context.context_id)
        if ctx_id not in self.agents:
            self.agents[ctx_id] = GitMagenticAgent()

        agent = self.agents[ctx_id]

        try:

            stream =  agent.team.run_stream(task = user_input)
            async for message in stream:

                if not isinstance(message, TaskResult):
                    print(f"{message.source} - {message.content}\n{"-"*80}")

                if isinstance(message,TaskResult):
                    
                    response_txt = message.messages[-1].content
                    await updater.add_artifact(
                            [Part(root=TextPart(text=message.stop_reason))],
                            name='response',
                        )
                    await updater.add_artifact(
                            
                            [Part(root=TextPart(text=response_txt +'\n' +message.stop_reason))],
                            name='result',
                        )
                    await updater.complete()

                elif isinstance(message,TextMessage):
                    await updater.start_work(new_agent_text_message(str(message.content)))


        except Exception as e:
            print("Exception",e)

        
    async def cancel(
        self, context: RequestContext, event_queue: EventQueue
        ) -> None:
        raise Exception('cancel not supported')