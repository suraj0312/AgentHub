import logging
import os

import click

from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import AgentCapabilities, AgentCard, AgentSkill
from agent import WeatherAgent
from agent_executor import WeatherAgentExecutor
from dotenv import load_dotenv
# from timestamp_ext import TimestampExtension


load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MissingAPIKeyError(Exception):
    """Exception for missing API key."""


@click.command()
@click.option('--host', default='localhost')
@click.option('--port', default=10002)
def main(host, port):
    try:
        # Check for API key only if Vertex AI is not configured

        capabilities = AgentCapabilities(
            streaming=True,

        )
        skill = AgentSkill(
            id='weather_agent',
            name='Weather Information Agent',
            description='Provides weather information based on user queries.',
            tags=['weather', 'information', 'forecast'],
            examples=[
                'What is the weather in New Delhi?',
                'Will it rain tomorrow?',
                'Give me the weather forecast for LA'
            ],
        )
        agent_card = AgentCard(
            name='Weather Information Agent',
            description='This agent provides weather information based on user queries.',
            url=f'http://{host}:{port}/',
            version='1.0.0',
            default_input_modes=WeatherAgent.SUPPORTED_CONTENT_TYPES,
            default_output_modes=WeatherAgent.SUPPORTED_CONTENT_TYPES,
            capabilities=capabilities,
            skills=[skill],
        )
        agent_executor = WeatherAgentExecutor()
        # Use the decorator version of the extension for highest ease of use.
        # agent_executor = hello_ext.wrap_executor(agent_executor)
        request_handler = DefaultRequestHandler(
            agent_executor=agent_executor,
            task_store=InMemoryTaskStore(),
        )
        server = A2AStarletteApplication(
            agent_card=agent_card, http_handler=request_handler
        )
        import uvicorn

        uvicorn.run(server.build(), host=host, port=port)
    except MissingAPIKeyError as e:
        logger.error(f'Error: {e}')
        exit(1)
    except Exception as e:
        logger.error(f'An error occurred during server startup: {e}')
        exit(1)


if __name__ == '__main__':
    main()