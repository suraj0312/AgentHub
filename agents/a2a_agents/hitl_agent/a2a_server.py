import uvicorn

from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import (
    AgentCapabilities,
    AgentCard,
    AgentSkill,
    AgentExtension
)
from starlette.middleware.cors import CORSMiddleware

from agent_executer import (
    HelloAgentExecutor, 
)


if __name__ == '__main__':
    skill = AgentSkill(
        id='hello_magentic_agent',
        name='Hello Magentic Agent',
        description='An agent for managing Hello operations and use hello commands',
        tags=['hello', 'magentic', 'agent'],
        examples=['say hello', 'greet user', 'ask for name'],
    )

    extension = AgentExtension(
        uri="test",
        params={"framework": "Microsoft-AutoGen"}
    )

    public_agent_card = AgentCard(
    name='Hello Magentic Agent',
    description='An agent for Hello related operations',
    url='http://localhost:9999/',
    version='1.0.0',
    default_input_modes=['text'],
    default_output_modes=['text'],
    capabilities=AgentCapabilities(extensions=[extension], streaming=True),
    skills=[skill],  # Only the basic skill for the public card

    )


    request_handler = DefaultRequestHandler(
    agent_executor=HelloAgentExecutor(),
    task_store=InMemoryTaskStore(),
    )

    server = A2AStarletteApplication(
        agent_card=public_agent_card,
        http_handler=request_handler,
        # extended_agent_card=specific_extended_agent_card,
    )

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
        uvicorn.run(app, host='localhost', port=9999)    