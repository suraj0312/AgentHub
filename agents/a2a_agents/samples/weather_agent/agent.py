import os
from typing import Any
from collections.abc import AsyncIterable
from google.adk.agents.llm_agent import LlmAgent
# from google.adk.models.lite_llm import LiteLlm
from google.adk.artifacts import InMemoryArtifactService
from google.adk.memory.in_memory_memory_service import InMemoryMemoryService
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
import httpx

from dotenv import load_dotenv
load_dotenv()
SSL_CERT_FILE = os.getenv("SSL_CERT_FILE")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

if not OPENWEATHER_API_KEY:
    raise RuntimeError("Set environment variable OPENWEATHER_API_KEY")


def get_weather(city_name: str) -> dict:
    """Retrieves the current weather report for a specified city via OpenWeather API."""

    base_url = "http://api.openweathermap.org/data/2.5/weather"

    geo_cord = f"http://api.openweathermap.org/geo/1.0/direct?q={city_name}&appid={OPENWEATHER_API_KEY}"
    try:
        resp = httpx.get(geo_cord, timeout=5)
    except Exception as e:
        return {"status": "error", "error_message": f"HTTP request failed: {e}"}

    if resp.status_code != 200:
        try:
            err = resp.json()
            msg = err.get("message", "")
        except Exception:
            msg = resp.text
        return {"status": "error", "error_message": f"OpenWeather API error: {resp.status_code}: {msg}"}

    data = resp.json()
    lat = data[0]["lat"]
    lon = data[0]["lon"]

    complete_url = f"{base_url}?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"
    
    try:
        report = httpx.get(complete_url, timeout=5)
    except Exception as e:
        return {"status": "error", "error_message": f"HTTP request failed: {e}"}

    weather_data = report.json()
    city = weather_data.get("name", "Unknown")
    description = weather_data["weather"][0]["description"]
    temp = weather_data["main"]["temp"] - 273.15
    humidity = weather_data["main"].get("humidity")
    wind_speed = weather_data.get("wind", {}).get("speed")

    report = (
        f"The weather in {city} is {description}, "
        f"with temperature {temp:.1f}°C, "
        f"humidity {humidity}%"
        + (f", wind speed {wind_speed} m/s" if wind_speed is not None else "")
    )

    return report
    


# --- Agent ---

class WeatherAgent:
    """Agent that answers weather and time queries using OpenWeather + timezone data."""

    SUPPORTED_CONTENT_TYPES = ["text", "text/plain"]

    def __init__(self):
        self._agent = self._build_agent()
        self._user_id = "weather_user"
        self._runner = Runner(
            app_name=self._agent.name,
            agent=self._agent,
            artifact_service=InMemoryArtifactService(),
            session_service=InMemorySessionService(),
            memory_service=InMemoryMemoryService(),
        )

    def get_processing_message(self) -> str:
        return "Fetching weather/time info..."

    def _build_agent(self) -> LlmAgent:
        """Build the LLM agent for weather and time tasks."""
        # LITELLM_MODEL = os.getenv("LITELLM_MODEL", "gemini/gemini-2.0-flash-001")
        model_name = "gemini-2.5-flash"
        return LlmAgent(
            model=model_name,
            name="weather_agent",
            description="This agent provides current weather and local time information.",
            instruction="""
You are an assistant that can provide:
1. Current weather conditions using get_weather(city).
Always call the appropriate tool when asked about weather.
""",
            tools=[get_weather],
            # tools=[get_weather],
        )

    async def stream(self, query, session_id) -> AsyncIterable[dict[str, Any]]:
        """Stream responses to the user query."""
        with httpx.Client(verify=False) as client:
            session = await self._runner.session_service.get_session(
                app_name=self._agent.name,
                user_id=self._user_id,
                session_id=session_id,
            )
            content = types.Content(role="user", parts=[types.Part.from_text(text=query)])

            if session is None:
                session = await self._runner.session_service.create_session(
                    app_name=self._agent.name,
                    user_id=self._user_id,
                    state={},
                    session_id=session_id,
                )

            async for event in self._runner.run_async(
                user_id=self._user_id, session_id=session.id, new_message=content
            ):
                if event.is_final_response():
                    response = ""
                    if (
                        event.content
                        and event.content.parts
                        and event.content.parts[0].text
                    ):
                        response = "\n".join(
                            [p.text for p in event.content.parts if p.text]
                        )
                    elif (
                        event.content
                        and event.content.parts
                        and any(p.function_response for p in event.content.parts)
                    ):
                        response = next(
                            p.function_response.model_dump()
                            for p in event.content.parts
                            if p.function_response
                        )
                    yield {"is_task_complete": True, "content": response}
                else:
                    yield {"is_task_complete": False, "updates": self.get_processing_message()}
