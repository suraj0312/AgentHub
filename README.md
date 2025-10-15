# 🚀 AgentHub

!Build Status  
!License: MIT

**AgentHub** is a powerful platform for managing and observing A2A (Agent-to-Agent) interactions. With AgentHub, you can easily register agents via URL, orchestrate multi-agent workflows, and enable collaborative task execution. Whether you're working with remote agents or building local ones tailored to your needs, AgentHub provides a clean and intuitive interface to streamline your agent operations.

---

## ✨ Features

- 🔗 **Add A2A agents via URL**  
- 🧠 **Create orchestrators with multiple agents**  
- 🤝 **Enable agent collaboration for task completion**  
- 🖥️ **Clean and user-friendly interface**  
- 🏠 **Support for local agents**

---

## ⚙️ Setup Instructions

### Manual Setup

1. 📁 Navigate to the `agents` folder and follow the README of the agent you want to run.  
2. 🌐 Go to the `agui_server` folder and follow its README to set up the server.  
3. 🖼️ Open the `agui_client` folder and follow its README to start the UI application.

---

### 🚀 One-Click Setup (Recommended)

1. 📝 Create a `.env` file in the `agents/git_agent` directory with the following content:

   ```env
   AZURE_OPENAI_API_KEY=<your_azure_openai_api_key>
   AZURE_OPENAI_ENDPOINT=<your_azure_openai_endpoint>
   AZURE_OPENAI_API_VERSION=<api_version>
   AZURE_OPENAI_DEPLOYMENT_NAME=<deployment_name>
   AZURE_OPENAI_MODEL_NAME=<model_name>
   GITHUB_TOKEN=<your_github_token>
   ```

2. ▶️ Run the `run.bat` file to start everything in one go.

3. 🧩 Once the server starts, navigate to the `agui_client` folder and install dependencies:

   ```bash
   npm install
   ```

4. 🖥️ Run the application:

   ```bash
   npm run dev
   ```

> **Note:** This will launch the default agent (`git_agent`), the server, and the UI application.

---

## 🧑‍💻 How to Use

Once setup is complete, open your browser and go to:

```
http://localhost:3000
```

From here, you can interact with the application, add agents, create orchestrators, and monitor agent collaboration.

---

## 📚 Documentation & Support

For more details or troubleshooting, please refer to the individual README files in each component directory:

- `agents/`  
- `agui_server/`  
- `agui_client/`

---

## 🛠️ Contributing

We welcome contributions! Feel free to fork the repo, submit pull requests, or open issues to help improve AgentHub.

---

## 📄 License

This project is licensed under the MIT License.