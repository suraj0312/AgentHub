// import React, { useState } from "react";
// import AgGridTable from "./AgGridTable"; // see below for this component
// import styles from "./EditOrchestratorForm.module.css";
// import { myTheme } from "./AgGridTheme";

// export default function EditLocalAgentForm({ agent, onUpdate, onBack }) {
//   const [name, setName] = useState(agent.name);
//   const [instructions, setInstructions] = useState(agent.instructions);
//   const [description, setDescription] = useState(agent.description);

//   return (
//     <div className={styles.formContainer}>
//       <h2 className={styles.title}>Edit Local Agent Details</h2>
//       <div className={`${styles.inputSection} ${styles.customScrollbar}`}>
//         <div className={styles.inputs}>
//           <div className={styles.inputContainer}>
//             <p className={styles.label}>Local Agent Name</p>
//             <div className={styles.separator}></div>
//             <input className={styles.input}
//               disabled={true}
//               type="text"
//               placeholder="e.g. My local Agent"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>
//           <div className={styles.inputContainer}>
//             <p className={styles.label}>System Instructions</p>
//             <textarea className={styles.textarea}
//               placeholder="Local Agent Instruction to perform tasks."
//               value={instructions}
//               onChange={(e) => setInstructions(e.target.value)}
//               rows={5}
//             />
//           </div>
//           <div className={styles.inputContainer}>
//             <p className={styles.label}>Description</p>
//             <textarea className={styles.textarea}
//               placeholder="Local Agent Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={5}
//             />
//           </div>

//         </div>
//       </div>
//       <div className={styles.actions}>
//         <button
//           onClick={() => onUpdate({
//             ...agent,
//             name,
//             instructions,
//             description
        
//           })}
//         >
//           Update
//         </button>
//         <button onClick={onBack}>Back</button>
//       </div>
//     </div>
//   );
// }




import React, { useState } from "react";
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

interface EditLocalAgentFormProps {
  agent: Agent;
  onUpdate: (updatedAgent: Agent) => void;
  onBack: () => void;
}

export default function EditLocalAgentForm({
  agent,
  onUpdate,
  onBack,
}: EditLocalAgentFormProps) {
  const [name, setName] = useState(agent.name);
  const [instructions, setInstructions] = useState(agent.instructions);
  const [description, setDescription] = useState(agent.description);

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Edit Local Agent Details</h2>

      <div className={`${styles.inputSection} ${styles.customScrollbar}`}>
        <div className={styles.inputs}>
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="agent-name">
              Local Agent Name
            </label>
            <div className={styles.separator}></div>
            <input
              id="agent-name"
              className={styles.input}
              type="text"
              placeholder="e.g. My Local Agent"
              value={name}
              disabled
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="agent-instructions">
              System Instructions
            </label>
            <textarea
              id="agent-instructions"
              className={styles.textarea}
              placeholder="Local Agent instruction to perform tasks."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
            />
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="agent-description">
              Description
            </label>
            <textarea
              id="agent-description"
              className={styles.textarea}
              placeholder="Local Agent description."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={() =>
            onUpdate({
              ...agent,
              name,
              instructions,
              description,
            })
          }
        >
          Update
        </button>
        <button onClick={onBack}>Back</button>
      </div>
    </div>
  );
}