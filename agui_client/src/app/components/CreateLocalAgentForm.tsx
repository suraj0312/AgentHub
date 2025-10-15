import React, { useState } from "react";
import styles from "./CreateLocalAgentForm.module.css";

export default function CreateLocalAgentForm({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className={styles.Window}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Create Local Agent</h2>
        </div>
        <div className={styles.actions}>
          <button
            onClick={() => {
              if (name && instructions  && description)
                onCreate({ 
                  name: name,
                  url: "",
                  subAgents: [], 
                  instructions: instructions,
                  framework: "adk",
                  description: description,
                  type: "local_agent"
                });
            }}
          >
            Create
          </button>
          <button onClick={onCancel}>Cancel</button>
      </div>
      </div>
      <div className={styles.separator}></div>
      <div className={`${styles.inputSection} ${styles.customScrollbar}`}>
        <div className={styles.inputs}>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Local Agent Name</p>
            <input className={styles.input}
                type="text"
                placeholder="e.g. My Local Agent"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>System Instructions</p>
            <textarea className={styles.textarea}
                placeholder="Agent Instruction to perform tasks."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={5}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Agent Descriptions</p>
            <textarea className={styles.textarea}
                placeholder="Agent Description."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}