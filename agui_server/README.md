# 🖥️ AGUI Server

This folder contains the **AGUI server** and supporting scripts for running local agents and orchestrators used by the AgentHub project.

---

## 📦 What is the `orchestrator/` Folder?

The `orchestrator/` directory includes builder logic and helper utilities for creating **orchestrators** — components that coordinate multiple agents and define their interaction logic.

### Contents:

- `orchestrator_builder.py`: Helper functions and classes for programmatic orchestrator construction.
- `__init__.py`: Package marker for the orchestrator module.

---

## 🧑‍💻 `local_agent.py`

> `local_agent.py` is a utility script for creating a **local agent** using the ADK (Agent Development Kit). You’ll need to provide:

- 🏷️ Agent name  
- 📝 Agent description  
- 📜 Agent instruction  

The script registers the agent in the local store so it can be loaded and used by AGUI.

---

## 🌐 `server.py` — The AGUI Server

`server.py` is the main entry point for the AGUI server.

> ⚠️ **Before starting**, ensure the default agent (`git_agent`) is running and listening on port `10000`.

---

## 🚀 How to Start the Server

1. ✅ Start the `git_agent` server first.
2. 📝 Create a `.env` file in the `agui_server` folder with the following content:

   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   ```

3. ▶️ Navigate to the `agui_server` folder and run the following command:

   ```bash
   uv run server.py
   ```

---

## 📄 License

This project is licensed under the MIT License.
