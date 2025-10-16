// import React, { useState } from "react";
// import styles from "./CreateLocalAgentForm.module.css";

// export default function CreateLocalAgentForm({ onCreate, onCancel }) {
//   const [name, setName] = useState("");
//   const [instructions, setInstructions] = useState("");
//   const [description, setDescription] = useState("");

//   return (
//     <div className={styles.Window}>
//       <div className={styles.headerContainer}>
//         <div className={styles.headerContent}>
//           <h2 className={styles.title}>Create Local Agent</h2>
//         </div>
//         <div className={styles.actions}>
//           <button
//             onClick={() => {
//               if (name && instructions  && description)
//                 onCreate({ 
//                   name: name,
//                   url: "",
//                   subAgents: [], 
//                   instructions: instructions,
//                   framework: "adk",
//                   description: description,
//                   type: "local_agent"
//                 });
//             }}
//           >
//             Create
//           </button>
//           <button onClick={onCancel}>Cancel</button>
//       </div>
//       </div>
//       <div className={styles.separator}></div>
//       <div className={`${styles.inputSection} ${styles.customScrollbar}`}>
//         <div className={styles.inputs}>
//           <div className={styles.inputContainer}>
//             <p className={styles.label}>Local Agent Name</p>
//             <input className={styles.input}
//                 type="text"
//                 placeholder="e.g. My Local Agent"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//             />
//           </div>
//           <div className={styles.inputContainer}>
//             <p className={styles.label}>System Instructions</p>
//             <textarea className={styles.textarea}
//                 placeholder="Agent Instruction to perform tasks."
//                 value={instructions}
//                 onChange={(e) => setInstructions(e.target.value)}
//                 rows={5}
//             />
//           </div>
//           <div className={styles.inputContainer}>
//             <p className={styles.label}>Agent Descriptions</p>
//             <textarea className={styles.textarea}
//                 placeholder="Agent Description."
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows={5}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import styles from "./CreateLocalAgentForm.module.css";

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

interface CreateLocalAgentFormProps {
  onCreate: (agent: Agent) => void;
  onCancel: () => void;
}

export default function CreateLocalAgentForm({
  onCreate,
  onCancel,
}: CreateLocalAgentFormProps) {
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const isFormValid = name.trim() && instructions.trim() && description.trim();

  const handleCreate = () => {
    if (!isFormValid) {
      setError("All fields are required.");
      return;
    }

    const newAgent: Agent = {
      name: name.trim(),
      url: "", // You might want to allow user input or generate this dynamically
      subAgents: [],
      instructions: instructions.trim(),
      framework: "adk",
      description: description.trim(),
      type: "local_agent",
    };

    onCreate(newAgent);
  };

  return (
    <div className={styles.Window}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Create Local Agent</h2>
        </div>
        <div className={styles.actions}>
          <button
            disabled={!isFormValid}
            onClick={handleCreate}
            className={styles.primaryButton}
          >
            Create
          </button>
          <button onClick={onCancel} className={styles.secondaryButton}>
            Cancel
          </button>
        </div>
      </div>

      <div className={styles.separator} />

      <div className={`${styles.inputSection} ${styles.customScrollbar}`}>
        <div className={styles.inputs}>
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="agent-name">
              Local Agent Name
            </label>
            <input
              id="agent-name"
              className={styles.input}
              type="text"
              placeholder="e.g. My Local Agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="agent-instructions">
              System Instructions
            </label>
            <textarea
              id="agent-instructions"
              className={styles.textarea}
              placeholder="Agent instruction to perform tasks."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="agent-description">
              Agent Description
            </label>
            <textarea
              id="agent-description"
              className={styles.textarea}
              placeholder="Agent description."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    </div>
  );
}