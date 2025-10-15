import React, { useState } from "react";
import AgGridTable from "./AgGridTable"; // see below for this component
import styles from "./EditOrchestratorForm.module.css";
import { myTheme } from "./AgGridTheme";

export default function EditLocalAgentForm({ agent, onUpdate, onBack }) {
  const [name, setName] = useState(agent.name);
  const [instructions, setInstructions] = useState(agent.instructions);
  const [description, setDescription] = useState(agent.description);

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Edit Local Agent Details</h2>
      <div className={`${styles.inputSection} ${styles.customScrollbar}`}>
        <div className={styles.inputs}>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Local Agent Name</p>
            <div className={styles.separator}></div>
            <input className={styles.input}
              disabled={true}
              type="text"
              placeholder="e.g. My local Agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>System Instructions</p>
            <textarea className={styles.textarea}
              placeholder="Local Agent Instruction to perform tasks."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Description</p>
            <textarea className={styles.textarea}
              placeholder="Local Agent Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>

        </div>
      </div>
      <div className={styles.actions}>
        <button
          onClick={() => onUpdate({
            ...agent,
            name,
            instructions,
            description
        
          })}
        >
          Update
        </button>
        <button onClick={onBack}>Back</button>
      </div>
    </div>
  );
}