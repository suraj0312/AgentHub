// "use client";
// import React, { useState, useEffect } from "react";
// import AgentRibbon from "./AgentRibbon";
// import Sidebar from "./Sidebar";
// import AddAgentModal from "./AddAgentModal";
// import CreateMultiAgentForm from "./CreateMultiAgentForm";
// import ChatWindow from "./ChatWindow";
// import styles from "./MainLayout.module.css";
// import ListA2AAgents from "./ListA2AAgents";
// import ListOrchestrators from "./ListOrchestrators";
// import EditOrchestratorForm from "./EditOrchestratorForm";
// import CreateLocalAgentForm from "./CreateLocalAgentForm";
// import ListLocalAgents from "./ListLocalAgent";
// import EditLocalAgentForm from "./EditLocalAgentForm";
// import { useCopilotContext } from "@copilotkit/react-core";


// export default function MainLayout() {
//   const [agents, setAgents] = useState([]);
//   // const [showOrchestrators, setShowOrchestrators] = useState(false);
//   const [agentType, setAgentType] = useState("a2a_agent"); // "a2a_agent", "orchestrator", "local_agent"
//   const [selectedAgentUrl, setSelectedAgentUrl] = useState("");
//   const [selectedAgentName, setSelectedAgentName] = useState("");
//   const [selectedAgentDescription, setSelectedAgentDescription] = useState("")
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [activeView, setActiveView] = useState("chat"); // "chat", "addAgent", "createMultiAgent"
//   const [activeSidebarButton, setActiveSidebarButton] = useState("chat"); // "chat", "addAgent", "createMultiAgent"
//   const [chatHistories, setChatHistories] = useState({});
//   const [currentChatAgentUrl, setCurrentChatAgentUrl] = useState("");
//   const [orchestrator, setOrchestrator] = useState(agents[0])
//   const [agentToEdit, setAgentToEdit] = useState(agents[0])
//   const threadId = useCopilotContext().threadId
//      // Fetch agents from backend on mount
//   useEffect(() => {
//     async function fetchAgents() {
//       try {
//         const res = await fetch("http://localhost:8000/get-agents");
//         if (res.ok) {
//           const data = await res.json();
//           console.log(data)
//           setAgents(data.length ? data : []);
//         }
//       } catch (err) {
//         console.error("Failed to fetch agents:", err);
//       }
//     }
//     fetchAgents();
//   }, []);

//   const handleSelectAgent = async (agent) => {
//     setSelectedAgentUrl(agent.url);
//     setSelectedAgentName(agent.name);
//     setCurrentChatAgentUrl(agent.url);
//     setAgentType(agent.type)
//     setActiveView("chat");
//     setActiveSidebarButton("chat");
//     agent.session_id = threadId
//     const data = await fetch("/api/copilotkit/set-agent-url", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(agent),
//     });

//     const responseData = await data.json();

//     if((responseData.agentData.type === "a2a_agent") || (responseData.agentData.type === "local_agent")){
//       setSelectedAgentDescription(responseData.agentData.description)
//     }
//     else if(responseData.agentData.type === "orchestrator"){
//       setSelectedAgentDescription(responseData.agentData.instructions)
//     }
//     // setAgents([responseData.agentData, ...agents])
//     return responseData.agentData
//   };

//   const handleSidebarButtonClick = (view: string) => {
//     setActiveView(view);
//     setActiveSidebarButton(view);
//   };

//   // Handler for adding a new agent
//   const handleAddAgent = async (agent) => {
//     // setAgents([agent, ...agents]);
//     // setShowAddAgent(false);
//     // setShowMultiAgentForm(false);
//     const enriched_agent = await handleSelectAgent(agent);
//     setAgents([enriched_agent, ...agents])
//   };

//   const handleDeleteAgent = async (agent_to_delete : typeof agents[0]) => {
//     console.log("delete agent clicked")
//     console.log(agent_to_delete);

//     const data = await fetch("/api/copilotkit/delete-agent", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(agent_to_delete),
//     })
//     setAgents(prevAgents => prevAgents.filter(agent => (agent.name + agent.url) !== (agent_to_delete.name + agent_to_delete.url)))
//   };

//   const handleEditAgent = (agent_to_edit) => {
//     console.log("Edit orchestrator clicked")
//     console.log(agent_to_edit);
//     if (agent_to_edit.type === "orchestrator") {
//         handleSidebarButtonClick("editOrchestratorForm");
//         // setOrchestrator(agent_to_edit);
//         setAgentToEdit(agent_to_edit)
//       } else if (agent_to_edit.type === "local_agent") {
//         console.log("Local agent selected:", agent_to_edit);
//         handleSidebarButtonClick("editLocalAgentForm")
//         setAgentToEdit(agent_to_edit)
//       } 
//   };

//   const handleOnback = (targetSidebar :string) => {
//     handleSidebarButtonClick(targetSidebar)
//   }
  
// const handleOnUpdate = async (updatedOrchestrator: typeof agents[0]) => {
//     console.log("update agent clicked");
//     console.log(updatedOrchestrator);
 
//     try {
//       const response = await fetch("/api/copilotkit/update-agent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedOrchestrator),
//       });
 
//       const result = await response.json();
//       console.log("After update-agent POST data received", result);
//       if (result.success) {
//         // Update the agent list locally
//         const updatedAgent = result.agentData
//           setAgents(prevAgents =>
//             prevAgents.map(agent =>
//               (agent.name + agent.url) === (updatedAgent.name + updatedAgent.url)
//                 ? updatedAgent
//                 : agent
//             )
//           );
//         } else {
//           console.error("Update failed:", result.error);
//         }
//         if (result.agentData.type == "orchestrator"){
          
//           handleOnback("listOrchestrators");
//         }
//         else if (result.agentData.type == "local_agent"){
          
//           handleOnback("listLocalAgents");
//         }
//       } 
//       catch (error) {
//         console.error("Error updating agent:", error);
//       }
//     };

//   return (
//     <div className={styles.layout}>
//       <AgentRibbon
//         agents={agents}
//         selectedAgentUrl={selectedAgentUrl}
//         selectedAgentName={selectedAgentName}
//         onSelectAgent={handleSelectAgent}
//         // showOrchestrators={showOrchestrators}
//         agentType={agentType}
//         setAgentType={setAgentType}
//         // setShowOrchestrators={setShowOrchestrators}
//         // multiAgents={multiAgents}
//         // selectedMultiAgentUrl={selectedMultiAgentUrl}
//         // onSelectMultiAgent={handleSelectMultiAgent}
//       />
//       <div className={styles.body}>
//         <Sidebar
//         onChat={() => handleSidebarButtonClick("chat")}
//         onAddAgent={() => handleSidebarButtonClick("addAgent")}
//         onCreateMultiAgent={() => handleSidebarButtonClick("createMultiAgent")}
//         onListA2AAgents={() => handleSidebarButtonClick("listA2AAgents")}
//         onListOrchestrators={() => handleSidebarButtonClick("listOrchestrators")}
//         onCreateLocalAgent={() => handleSidebarButtonClick("createLocalAgents")}
//         onListLocalAgent={() => handleSidebarButtonClick("listLocalAgents")}
//         collapsed={sidebarCollapsed}
//         setCollapsed={setSidebarCollapsed}
//         activeButton={activeSidebarButton}
//       />
//         <div className={sidebarCollapsed ? styles.contentFull : styles.content}>
//           {activeView === "addAgent" ? (
//             <AddAgentModal
//               onAdd={handleAddAgent}
//               onCancel={() => handleSidebarButtonClick("chat")}
//             />
//           ) : activeView === "createMultiAgent" ? (
//             <CreateMultiAgentForm
//               agents={agents}
//               // onCreate={handleCreateMultiAgent}
//               onCreate={handleAddAgent}
//               onCancel={() => handleSidebarButtonClick("chat")}
//             />
//           ) : activeView === "listA2AAgents" ? (
//             <ListA2AAgents 
//               agents={agents}
//               onDeleteAgent={handleDeleteAgent}
//             />
//           ) : activeView === "listOrchestrators" ? (
//             <ListOrchestrators 
//               agents={agents}
//               onDeleteOrchestrator={handleDeleteAgent}
//               onEditOrchestrator={handleEditAgent}
//             />
//           ) : activeView === "editOrchestratorForm" ? (
//             <EditOrchestratorForm
//               orchestrator={agentToEdit}
//               agents={agents}
//               onUpdate={handleOnUpdate}
//               onBack={() => handleOnback("listOrchestrators")}
//             />
//           ) : activeView ==="createLocalAgents" ? (
//             <CreateLocalAgentForm
//               onCreate={handleAddAgent}
//               onCancel={() => handleSidebarButtonClick("chat")}
//             />
//           ) : activeView === "listLocalAgents" ? (
//             <ListLocalAgents
//               agents={agents}
//               onDeleteLocalAgent={handleDeleteAgent}
//               onEditLocalAgent={handleEditAgent}
//             />
//           ): activeView === "editLocalAgentForm" ? (
//             <EditLocalAgentForm
//               agent={agentToEdit}
//               onUpdate={handleOnUpdate}
//               onBack={() => handleOnback("listLocalAgents")}
//             />
//           ):(
//             <ChatWindow
//               selectedAgentName={selectedAgentName}
//               selectedAgentDescription={selectedAgentDescription}
//               agentUrl={currentChatAgentUrl}
//               chatHistory={chatHistories[currentChatAgentUrl] || []}
//               onSendMessage={(msg) => {
//                 setChatHistories((prev) => ({
//                   ...prev,
//                   [currentChatAgentUrl]: [...(prev[currentChatAgentUrl] || []), msg],
//                 }));
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import React, { useState, useEffect } from "react";
import AgentRibbon from "./AgentRibbon";
import Sidebar from "./Sidebar";
import AddAgentModal from "./AddAgentModal";
import CreateMultiAgentForm from "./CreateMultiAgentForm";
import ChatWindow from "./ChatWindow";
import styles from "./MainLayout.module.css";
import ListA2AAgents from "./ListA2AAgents";
import ListOrchestrators from "./ListOrchestrators";
import EditOrchestratorForm from "./EditOrchestratorForm";
import CreateLocalAgentForm from "./CreateLocalAgentForm";
import ListLocalAgents from "./ListLocalAgent";
import EditLocalAgentForm from "./EditLocalAgentForm";
import { useCopilotContext } from "@copilotkit/react-core";

interface Agent {
  name: string;
  url: string;
  type: string;
  description?: string;
  instructions?: string;
  framework?: string;
  session_id?: string;
  subAgents?: Agent[];
}

export default function MainLayout() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentType, setAgentType] = useState("a2a_agent");
  const [selectedAgentUrl, setSelectedAgentUrl] = useState("");
  const [selectedAgentName, setSelectedAgentName] = useState("");
  const [selectedAgentDescription, setSelectedAgentDescription] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("chat");
  const [activeSidebarButton, setActiveSidebarButton] = useState("chat");
  const [chatHistories, setChatHistories] = useState<Record<string, string[]>>({});
  const [currentChatAgentUrl, setCurrentChatAgentUrl] = useState("");
  const [agentToEdit, setAgentToEdit] = useState<Agent | null>(null);
  const threadId = useCopilotContext().threadId;

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch("http://localhost:8000/get-agents");
        if (res.ok) {
          const data = await res.json();
          setAgents(data.length ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch agents:", err);
      }
    }
    fetchAgents();
  }, []);

  const handleSelectAgent = async (agent: Agent) => {
    setSelectedAgentUrl(agent.url);
    setSelectedAgentName(agent.name);
    setCurrentChatAgentUrl(agent.url);
    setAgentType(agent.type);
    setActiveView("chat");
    setActiveSidebarButton("chat");

    agent.session_id = threadId;

    const res = await fetch("/api/copilotkit/set-agent-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agent),
    });

    const responseData = await res.json();
    const updatedAgent = responseData.agentData;

    setSelectedAgentDescription(
      updatedAgent.type === "orchestrator"
        ? updatedAgent.instructions ?? ""
        : updatedAgent.description ?? ""
    );

    return updatedAgent;
  };

  const handleSidebarButtonClick = (view: string) => {
    setActiveView(view);
    setActiveSidebarButton(view);
  };

  const handleAddAgent = async (agent: Agent) => {
    const enrichedAgent = await handleSelectAgent(agent);
    setAgents((prev) => [enrichedAgent, ...prev]);
  };

  const handleDeleteAgent = async (agentToDelete: Agent) => {
    await fetch("/api/copilotkit/delete-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agentToDelete),
    });

    setAgents((prev) =>
      prev.filter(
        (agent) => agent.name + agent.url !== agentToDelete.name + agentToDelete.url
      )
    );
  };

  const handleEditAgent = (agentToEdit: Agent) => {
    setAgentToEdit(agentToEdit);
    if (agentToEdit.type === "orchestrator") {
      handleSidebarButtonClick("editOrchestratorForm");
    } else if (agentToEdit.type === "local_agent") {
      handleSidebarButtonClick("editLocalAgentForm");
    }
  };

  const handleOnBack = (targetSidebar: string) => {
    handleSidebarButtonClick(targetSidebar);
  };

  const handleOnUpdate = async (updatedAgent: Agent) => {
    try {
      const response = await fetch("/api/copilotkit/update-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAgent),
      });

      const result = await response.json();
      if (result.success) {
        const updated = result.agentData;
        setAgents((prev) =>
          prev.map((agent) =>
            agent.name + agent.url === updated.name + updated.url ? updated : agent
          )
        );

        handleOnBack(
          updated.type === "orchestrator" ? "listOrchestrators" : "listLocalAgents"
        );
      } else {
        console.error("Update failed:", result.error);
      }
    } catch (error) {
      console.error("Error updating agent:", error);
    }
  };

  return (
    <div className={styles.layout}>
      <AgentRibbon
        agents={agents}
        selectedAgentUrl={selectedAgentUrl}
        selectedAgentName={selectedAgentName}
        onSelectAgent={handleSelectAgent}
        agentType={agentType}
        setAgentType={setAgentType}
      />
      <div className={styles.body}>
        <Sidebar
          onChat={() => handleSidebarButtonClick("chat")}
          onAddAgent={() => handleSidebarButtonClick("addAgent")}
          onCreateMultiAgent={() => handleSidebarButtonClick("createMultiAgent")}
          onListA2AAgents={() => handleSidebarButtonClick("listA2AAgents")}
          onListOrchestrators={() => handleSidebarButtonClick("listOrchestrators")}
          onCreateLocalAgent={() => handleSidebarButtonClick("createLocalAgents")}
          onListLocalAgent={() => handleSidebarButtonClick("listLocalAgents")}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          activeButton={activeSidebarButton}
        />
        <div className={sidebarCollapsed ? styles.contentFull : styles.content}>
          {activeView === "addAgent" ? (
            <AddAgentModal
              onAdd={handleAddAgent}
              onCancel={() => handleSidebarButtonClick("chat")}
            />
          ) : activeView === "createMultiAgent" ? (
            <CreateMultiAgentForm
              agents={agents}
              onCreate={handleAddAgent}
              onCancel={() => handleSidebarButtonClick("chat")}
            />
          ) : activeView === "listA2AAgents" ? (
            <ListA2AAgents agents={agents} onDeleteAgent={handleDeleteAgent} />
          ) : activeView === "listOrchestrators" ? (
            <ListOrchestrators
              agents={agents}
              onDeleteOrchestrator={handleDeleteAgent}
              onEditOrchestrator={handleEditAgent}
            />
          ) : activeView === "editOrchestratorForm" && agentToEdit ? (
            <EditOrchestratorForm
              orchestrator={agentToEdit}
              agents={agents}
              onUpdate={handleOnUpdate}
              onBack={() => handleOnBack("listOrchestrators")}
            />
          ) : activeView === "createLocalAgents" ? (
            <CreateLocalAgentForm
              onCreate={handleAddAgent}
              onCancel={() => handleSidebarButtonClick("chat")}
            />
          ) : activeView === "listLocalAgents" ? (
            <ListLocalAgents
              agents={agents}
              onDeleteLocalAgent={handleDeleteAgent}
              onEditLocalAgent={handleEditAgent}
            />
          ) : activeView === "editLocalAgentForm" && agentToEdit ? (
            <EditLocalAgentForm
              agent={agentToEdit}
              onUpdate={handleOnUpdate}
              onBack={() => handleOnBack("listLocalAgents")}
            />
          ) : (
            <ChatWindow
              selectedAgentName={selectedAgentName}
              selectedAgentDescription={selectedAgentDescription}
              // agentUrl={currentChatAgentUrl}
              // chatHistory={chatHistories[currentChatAgentUrl] || []}
              // onSendMessage={(msg) => {
              //   setChatHistories((prev) => ({
              //     ...prev,
              //     [currentChatAgentUrl]: [...(prev[currentChatAgentUrl] || []), msg],
              //   }));
              // }}
            />
          )}
        </div>
      </div>
    </div>
  );
}