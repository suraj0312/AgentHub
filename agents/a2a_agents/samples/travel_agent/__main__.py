from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import (
    AgentCapabilities,
    AgentCard,
    AgentSkill,
    AgentExtension
)
from agent_executor import TravelPlannerAgentExecutor
import uvicorn
from starlette.middleware.cors import CORSMiddleware

if __name__ == '__main__':
    skill = AgentSkill(
        id='travel_planner',
        name='travel planner agent',
        description='travel planner',
        tags=['travel planner'],
        examples=['hello', 'nice to meet you!'],
    )

    extension = AgentExtension(
        uri="test",
        params={"framework": "Langchain"})
    
    agent_card = AgentCard(
        name='travel planner Agent',
        description='travel planner',
        url='http://localhost:10001/',
        version='1.0.0',
        default_input_modes=['text'],
        default_output_modes=['text'],
        capabilities=AgentCapabilities(extensions=[extension], streaming=True),
        skills=[skill],

    
    )

    request_handler = DefaultRequestHandler(
        agent_executor=TravelPlannerAgentExecutor(),
        task_store=InMemoryTaskStore(),
    )

    server = A2AStarletteApplication(
        agent_card=agent_card, http_handler=request_handler
    )

    # uvicorn.run(server.build(), host='localhost', port=10001)
    app = server.build()
   
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  # or ["*"] for development
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
   
    # Run the app with uvicorn
    if __name__ == "__main__":
        # uvicorn.run(app, host="localhost", port=10000)
        uvicorn.run(app, host='localhost', port=10001)    