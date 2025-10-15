
## Roll Dice Agent

This agent picks a random number from a dice you roll. You can specify the number of sides on the dice (e.g., roll a dice with 30 sides), and the agent will choose a number from 1 to the specified side count and return the result.

### Setup Instructions

1. **Install `uv` if not already installed:**
2. **Sync dependencies in this folder:**
    ```bash
    uv sync
    ```
3. **Create a `.env` file with your Google API key:**
    ```
    GOOGLE_API_KEY=your_api_key_here
    ```
4. **Run the agent:**
    ```bash
    uvicorn agent:a2a_app --host localhost --port 8002
    ```

The agent will start running at [http://localhost:8002](http://localhost:8002).

You can view the agent card at: [http://localhost:8002/.well-known/agent-card.json](http://localhost:8002/.well-known/agent-card.json)