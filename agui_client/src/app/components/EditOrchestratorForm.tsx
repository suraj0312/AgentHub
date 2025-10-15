import React, { useState } from "react";
import AgGridTable from "./AgGridTable"; // see below for this component
import styles from "./EditOrchestratorForm.module.css";
import { myTheme } from "./AgGridTheme";

export default function EditOrchestratorForm({ orchestrator, agents, onUpdate, onBack }) {
  const [name, setName] = useState(orchestrator.name);
  const [instructions, setInstructions] = useState(orchestrator.instructions);
  const [selected, setSelected] = useState(orchestrator.subAgents.map(a => a.name + a.url));

  return (
    <div className={styles.Window}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Edit Orchestrator Details</h2>
        </div>
        <div className={styles.actions}>
          <button
            onClick={() => onUpdate({
              ...orchestrator,
              name,
              instructions,
              subAgents: agents.filter(a => selected.includes(a.name + a.url))
            })}
          >
            Update
          </button>
          <button onClick={onBack}>Back</button>
        </div>
      </div>
      <div className={styles.separator}></div>
      <div className={`${styles.inputSection} ${styles.customScrollbar}`}>
        <div className={styles.inputs}>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Orchestrator Name</p>
            <input className={styles.input}
              disabled={true}
              type="text"
              placeholder="e.g. My Orchestrator Agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>System Instructions</p>
            <textarea className={styles.textarea}
              placeholder="Supervisor Instruction for managing multiple agents"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Selected Agents</p>
            <div className={styles.tableContainer}>
              <AgGridTable
                theme = {myTheme}
                agents={agents.filter(a => a.type === "a2a_agent")}
                selected={selected}
                setSelected={setSelected}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}