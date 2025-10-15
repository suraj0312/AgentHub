# GitMagenticAgent

## 🌟 Overview
Git Agent is a robust and intelligent agent designed to automate and streamline Git operations. It leverages AI capabilities to interact with Git repositories, perform various tasks, and provide real-time updates. This project is ideal for developers and teams looking to simplify their Git workflows and integrate automation into their development processes.

## ✨ Features
- 🛠️ Clone repositories, create branches, and switch between branches.
- 📤 Commit and push changes to remote repositories.
- 🔄 Pull the latest changes and handle merge conflicts.
- 📝 Create and manage GitHub issues and pull requests.
- 📊 Fetch repository status and list branches.
- ⚡ Real-time task updates and artifact management.

## 📂 Project Structure
The project is organized as follows:

```
git_agent/
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── agent_executer.py        # Main agent execution logic
├── agent.py                 # Core agent implementation
├── a2a_server.py                  # Entry point for the application
├── pyproject.toml           # Project dependencies and configuration
├── README.md                # Project documentation
├── uv.lock                  # Dependency lock file

```

## 🛠️ Prerequisites
- Python 3.12 or higher
- Git installed on your system
- A GitHub personal access token (PAT) with appropriate permissions

## 🚀 Setup Instructions

1. **Install UV (if not already installed):**
   ```bash
   pip install uv
   ```

2. **Sync Dependencies:**
   - Navigate to `agents/a2a_agents/git_agent` folder and run the following command:

   ```bash
   uv sync
   ```

3. **Set Up Environment Variables:**
    **e.g.**
   - Create a `.env` file and add the following:
     ```env
     AZURE_OPENAI_API_KEY=<your_azure_openai_api_key>
     AZURE_OPENAI_ENDPOINT=<your_azure_openai_endpoint>
     AZURE_OPENAI_API_VERSION=<api_version>
     AZURE_OPENAI_DEPLOYMENT_NAME=<deployment_name>
     AZURE_OPENAI_MODEL_NAME=<model_name>
     GITHUB_TOKEN=<your_github_token>
     ```

4. **Run the Application:**

   - **To Run the agent server**
   ```bash
   uv run a2a_server.py
   ```
   After running this command, the agent server starts.
   You can see the agent card at http://localhost:10000/.well-known/agent-card.json


## 🌐 What This Project Does
Git Agent simplifies Git operations by automating repetitive tasks and providing an AI-powered interface for interacting with repositories. It is designed to:
- Enhance productivity by reducing manual effort.
- Provide real-time updates on task progress.
- Integrate seamlessly with GitHub for issue and pull request management.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## 📜 License
This project is licensed under the MIT License. See the LICENSE file for details.
