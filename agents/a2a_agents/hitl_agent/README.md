# 🧠 HITL Agent

!Build Status  
!License: MIT

The **HITL (Human-In-The-Loop) Agent** enables interactive command execution with model assistance. Users issue commands, and the model responds intelligently. If the model encounters uncertainty or requires clarification, it will prompt the user with `transfer-to-user`, allowing seamless human intervention.

---

## ✨ Features

- ⚡ **Interactive Command Handling**  
  Users send commands, and the model processes and responds.

- ❓ **Clarification Mechanism**  
  When unsure, the model uses `transfer-to-user` to request additional input.

- 🤝 **Seamless Collaboration**  
  Facilitates efficient human-model interaction for complex tasks.

---

## 🧑‍💻 Usage

1. **Send a Command**  
   Enter your command for the agent.

2. **Model Response**  
   The model will respond with an action or result.

3. **Clarification (if needed)**  
   If the model needs more information, it will reply with:

   ```
   transfer-to-user
   ```

   You can then provide the required details in your next message.

---

## 📌 Example

```text
User: Ask user a topic and write 4 line poem on the given topic.
Model: transfer-to-user
User: Nature.
Model: [Poem about Nature]
```

> 💡 Respond promptly to `transfer-to-user` prompts for a smooth workflow.

---

## ⚙️ Setup Instructions

### 1. 📦 Install Dependencies

If `uv` is installed, navigate to `agents/a2a_agent/hitl_agent` and run:

```bash
uv sync
```

If not installed, first install `uv`, then run the above command.

---

### 2. 📝 Create Environment File

Create a `.env` file in the same directory and add the following variables:

```env
AZURE_OPENAI_API_KEY=<your_azure_openai_api_key>
AZURE_OPENAI_ENDPOINT=<your_azure_openai_endpoint>
AZURE_OPENAI_API_VERSION=<api_version>
AZURE_OPENAI_DEPLOYMENT_NAME=<deployment_name>
```

---

## ▶️ Running the Project

After setup, run:

```bash
uv run a2a_server.py
```

The agent will start on:  
🌐 `http://localhost:9999`

You can view the agent card at:  
📄 http://localhost:9999/.well-known/agent-card.json

---

## 📄 License

This project is licensed under the MIT License.
