# Weather Agent

This agent fetches the **current weather** for a specified location.

## Setup Instructions

1. **Install `uv` (if not already installed):**


2. **Sync dependencies:**
    ```bash
    uv sync
    ```

3. **Create a `.env` file** in this directory with the following content:
    ```
    GOOGLE_API_KEY=your_google_api_key
    OPENWEATHER_API_KEY=your_openweather_api_key
    ```
    - You can obtain your OpenWeather API key from [openweathermap.org](https://openweathermap.org/).

## Running the Agent

```bash
uv run a2a_server.py
```

## Example Queries

- `Tell me weather of New Delhi`
- `What's the weather in London?`
- `Current weather in Tokyo`

> **Note:**  
> This agent only shows **current weather**. It does **not** predict future weather.
