import React from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar({
  onChat,
  onAddAgent,
  onCreateMultiAgent,
  onListA2AAgents,
  onListOrchestrators,
  onCreateLocalAgent,
  onListLocalAgent,
  collapsed,
  setCollapsed,
  activeButton,
}) {
  return (
    <div className={collapsed ? styles.sidebarCollapsed : styles.sidebar}>
      <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? ">" : "<"}
      </button>
      {!collapsed && (
        <>
          {/* <div className={styles.header}>
            <h2 className={styles.title}>Agent Management</h2>
          </div> */}
          {/* <div className={styles.separator}></div> */}
          <div className={styles.buttonContainer}>
            {/* <button
              className={`${styles.chatBtn} ${activeButton === "chat" ? styles.active : ""}`}
              onClick={onChat}
            >
              <h3>Chat</h3>
            </button> */}
            {/* <div className={styles.separator}></div> */}
            <button
              className={`${styles.actionBtn} ${activeButton === "addAgent" ? styles.active : ""}`}
              onClick={onAddAgent}
            >
              <h3>Add A2A Agent</h3>
              {/* <p>Add a new remote agent to the system for specific tasks</p> */}
            </button>
            <button
              className={`${styles.actionBtn} ${activeButton === "listA2AAgents" ? styles.active : ""}`}
              onClick={onListA2AAgents}
            >
              <h3>List A2A Agents</h3>
              {/* <p>Create a new orchestrator for managing multiple remote agents</p> */}
            </button>
            <button
              className={`${styles.actionBtn} ${activeButton === "createMultiAgent" ? styles.active : ""}`}
              onClick={onCreateMultiAgent}
            >
              <h3>Create Orchestrator</h3>
              {/* <p>Create a new orchestrator for managing multiple remote agents</p> */}
            </button>
            <button
              className={`${styles.actionBtn} ${activeButton === "listOrchestrators" ? styles.active : ""}`}
              onClick={onListOrchestrators}
            >
              <h3>List Orchestrators</h3>
              {/* <p>Create a new orchestrator for managing multiple remote agents</p> */}
            </button>
            <button
              className={`${styles.actionBtn} ${activeButton === "createLocalAgent" ? styles.active : ""}`}
              onClick={onCreateLocalAgent}
            >
              <h3>Create Local Agent</h3>
              {/* <p>Create a new orchestrator for managing multiple remote agents</p> */}
            </button>
            <button
              className={`${styles.actionBtn} ${activeButton === "listLocalAgents" ? styles.active : ""}`}
              onClick={onListLocalAgent}
            >
              <h3>List Local Agents</h3>
              {/* <p>Create a new orchestrator for managing multiple remote agents</p> */}
            </button>
          </div>
        </>
      )}
    </div>
  );
}