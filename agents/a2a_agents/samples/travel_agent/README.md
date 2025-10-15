# Travel Agent

This agent generates a detailed travel plan for your desired location and duration (default: 3-5 days).

## Setup Instructions

1. **Install [uv](https://github.com/astral-sh/uv):**
   
2. **Sync dependencies:**
    ```bash
    uv sync
    ```
3. **Create a `.env` file** in the project root with your Google API key:
    ```
    GOOGLE_API_KEY=your_api_key_here
    ```

## Usage

Run the agent with:
```bash
uv run __main__.py
```

Follow the prompts to specify your destination and trip duration.
## Example Query

For example, you can enter:
```
plan 2 day trip to Rajasthan
```