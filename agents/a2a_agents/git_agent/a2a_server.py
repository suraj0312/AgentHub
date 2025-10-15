import uvicorn
from starlette.middleware.cors import CORSMiddleware
from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import (
    AgentCapabilities,
    AgentCard,
    AgentSkill,
    AgentExtension
)
from agent_executer import (
    GitMagenticAgentExecutor,  # type: ignore[import-untyped]
)

extension = AgentExtension(
    uri="test",
    params={"framework": "autogen[MagenticOne]"})
if __name__ == '__main__':
    # --8<-- [start:AgentSkill]
    skill = AgentSkill(
        id='git_magentic_agent',
        name='Git Magentic Agent',
        description='An agent for managing Git repositories and use git commands',
        tags=['git', 'magentic', 'agent'],
        examples=['clone a repo', 'create a branch', 'commit changes', 'push changes'],
    )


    public_agent_card = AgentCard(
    name='Git Magentic Agent',
    description='An agent for Git related operations',
    url='http://localhost:10000/',
    version='1.0.0',
    default_input_modes=['text'],
    default_output_modes=['text'],
    capabilities=AgentCapabilities(extensions=[extension], streaming=True),
    skills=[skill],  # Only the basic skill for the public card
    )


    request_handler = DefaultRequestHandler(
    agent_executor=GitMagenticAgentExecutor(),
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
        uvicorn.run(app, host='localhost', port=10000)    