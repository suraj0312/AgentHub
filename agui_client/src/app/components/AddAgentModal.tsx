import React, { useState } from "react";
import styles from "./AddAgentModal.module.css";

export default function AddAgentModal({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [agentDescription, setAgentDescription] = useState("")
  const [agentFramework, setAgentFramework] = useState("")
  const [agentDetailsLoaded, setAgentDetailsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className={styles.Window}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Add A2A Agent</h2>
        </div>
        <div className={styles.actions}>
          <button
            onClick={() => {
              if (name && url) onAdd({ name: name, url: url, subAgents: [], instructions: "", framework: "", description: "", type: "a2a_agent" });
            }}
          >
            Add
          </button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
      <div className={styles.separator}></div>
      <div className={`${styles.inputSection} ${styles.customScrollbar}`}>
        <div className={styles.inputs}>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Agent Name</p>
            <input className={styles.input}
              type="text"
              placeholder="e.g. My Agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Agent URL</p>
            <input className={styles.input}
              type="text"
              placeholder="e.g. http://localhost:1234"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={async () => {
                try {
                  setErrorMessage(""); // Clear previous errors
                  const res = await fetch(`${url}/.well-known/agent-card.json`);
                  if (res.ok) {
                    const data = await res.json();
                    setAgentDescription(data.description);
                    setAgentFramework(data.capabilities.extensions[0].params.framework);
                    setAgentDetailsLoaded(true);
                  } else {
                    setAgentDetailsLoaded(false);
                    setErrorMessage("No agent details available for the given URL. Please check your URL.");
                  }
                } catch (err) {
                  console.error("Failed to fetch agent card:", err);
                  setAgentDetailsLoaded(false);
                  setErrorMessage("No agent details available for the given URL. Please check your URL.");
                }
              }}
            />
          </div>
          {errorMessage && (
            <p className={styles.Message}>{errorMessage}</p>
          )}
          {agentDetailsLoaded && (
            <div>
              <div className={styles.inputContainer}>
                <p className={styles.label}>Agent Description</p>
                {/* <div className={styles.cardContainer}> */}
                <p className={styles.Message}>{agentDescription}</p>
              </div>
              <div className={styles.inputContainer}>
                <p className={styles.label}>Agent Framework</p>
                {/* <div className={styles.cardContainer}> */}
                <p className={styles.Message}>{agentFramework}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}