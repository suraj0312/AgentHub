// import React, { useState } from "react";
// import AgGridTable from "./AgGridTable"; // see below for this component
// import styles from "./EditOrchestratorForm.module.css";
// import { myTheme } from "./AgGridTheme";

// export default function EditOrchestratorForm({ orchestrator, agents, onUpdate, onBack }) {
//   const [name, setName] = useState(orchestrator.name);
//   const [instructions, setInstructions] = useState(orchestrator.instructions);
//   const [selected, setSelected] = useState(orchestrator.subAgents.map(a => a.name + a.url));

//   return (
//     <div className={styles.Window}>
//       <div className={styles.headerContainer}>
//         <div className={styles.headerContent}>
//           <h2 className={styles.title}>Edit Orchestrator Details</h2>
//         </div>
//         <div className={styles.actions}>
//           <button
//             onClick={() => onUpdate({
//               ...orchestrator,
//               name,
//               instructions,
//               subAgents: agents.filter(a => selected.includes(a.name + a.url))
//             })}
//           >
//             Update
//           </button>
//           <button onClick={onBack}>Back</button>
//         </div>
//       </div>
//       <div className={styles.separator}></div>
//       <div className={`${styles.inputSection} ${styles.customScrollbar}`}>
//         <div className={styles.inputs}>
//           <div className={styles.inputContainer}>
//             <p className={styles.label}>Orchestrator Name</p>
//             <input className={styles.input}
//               disabled={true}
//               type="text"
//               placeholder="e.g. My Orchestrator Agent"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>
//           <div className={styles.inputContainer}>
//             <p className={styles.label}>System Instructions</p>
//             <textarea className={styles.textarea}
//               placeholder="Supervisor Instruction for managing multiple agents"
//               value={instructions}
//               onChange={(e) => setInstructions(e.target.value)}
//               rows={5}
//             />
//           </div>
//           <div className={styles.inputContainer}>
//             <p className={styles.label}>Selected Agents</p>
//             <div className={styles.tableContainer}>
//               <AgGridTable
//                 theme = {myTheme}
//                 agents={agents.filter(a => a.type === "a2a_agent")}
//                 selected={selected}
//                 setSelected={setSelected}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState } from "react";
import AgGridTable from "./AgGridTable";
import styles from "./EditOrchestratorForm.module.css";

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

interface Orchestrator {
  name: string;
  url: string;
  type: string;
  instructions?: string;
  description?: string;
  framework?: string;
  subAgents?: Agent[];
}

interface EditOrchestratorFormProps {
  orchestrator: Orchestrator;
  agents: Agent[];
  onUpdate: (updatedOrchestrator: Orchestrator) => void;
  onBack: () => void;
}

export default function EditOrchestratorForm({
  orchestrator,
  agents,
  onUpdate,
  onBack,
}: EditOrchestratorFormProps) {
  const [name, setName] = useState(orchestrator.name);
  const [instructions, setInstructions] = useState(orchestrator.instructions);
  const [selected, setSelected] = useState<string[]>(
    (orchestrator.subAgents ?? []).map((a) => a.name + a.url)
  );

  const selectedAgents = agents.filter((a) => selected.includes(a.name + a.url));

  return (
    <div className={styles.Window}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Edit Orchestrator Details</h2>
        </div>
        <div className={styles.actions}>
          <button
            onClick={() =>
              onUpdate({
                ...orchestrator,
                name,
                instructions,
                subAgents: selectedAgents,
              })
            }
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
            <label className={styles.label} htmlFor="orchestrator-name">
              Orchestrator Name
            </label>
            <input
              id="orchestrator-name"
              className={styles.input}
              type="text"
              placeholder="e.g. My Orchestrator Agent"
              value={name}
              disabled
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="orchestrator-instructions">
              System Instructions
            </label>
            <textarea
              id="orchestrator-instructions"
              className={styles.textarea}
              placeholder="Supervisor instruction for managing multiple agents"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
            />
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label}>Selected Agents</label>
            <div className={styles.tableContainer}>
              <AgGridTable
                agents={agents.filter((a) => a.type === "a2a_agent")}
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