from typing import override

from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.utils import (
    new_agent_text_message,
    new_task,
)

from a2a.types import (
    Part,
    TaskState,
    TextPart,

)
from a2a.utils import new_text_artifact
from agent import TravelPlannerAgent
from a2a.server.tasks import TaskUpdater


class TravelPlannerAgentExecutor(AgentExecutor):
    """travel planner AgentExecutor Example."""

    def __init__(self):
        self.agent = TravelPlannerAgent()

    @override
    async def execute(
        self,
        context: RequestContext,
        event_queue: EventQueue,
    ) -> None:
        query = context.get_user_input()
        if not context.message:
            raise Exception('No message provided')
        updater = TaskUpdater(event_queue,context.task_id,context.context_id)
        result = ""
        async for event in self.agent.stream(query):
            # print(event)
            
            if event['done']:
                print("RESULT: ",result)
                await updater.add_artifact(
                        [Part(root=TextPart(text="Task completed"))],
                        name='response',
                    )
                await updater.add_artifact(
                        [Part(root=TextPart(text=result))],
                        name='result',
                    )
                await updater.complete()

            else:
                result += str(event['content'])
                await updater.start_work(new_agent_text_message(str(event['content'])))

    #     print(event)
        #     message = TaskArtifactUpdateEvent(
        #         context_id=context.context_id,  # type: ignore
        #         task_id=context.task_id,  # type: ignore
        #         artifact=new_text_artifact(
        #             name='current_result',
        #             text=event['content'],
        #         ),
        #     )
        #     await event_queue.enqueue_event(message)
        #     if event['done']:
        #         break

        # status = TaskStatusUpdateEvent(
        #     context_id=context.context_id,  # type: ignore
        #     task_id=context.task_id,  # type: ignore
        #     status=TaskStatus(state=TaskState.completed),
        #     final=True,
        # )
        # await event_queue.enqueue_event(status)

    @override
    async def cancel(
        self, context: RequestContext, event_queue: EventQueue
    ) -> None:
        raise Exception('cancel not supported')