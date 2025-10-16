// import React, { useState } from "react";
// import styles from "./CreateMultiAgentForm.module.css";
// import { subscribe } from "diagnostics_channel";
// import AgGridTable from "./AgGridTable";



// export default function CreateMultiAgentForm({ agents, onCreate, onCancel }) {
//   const [name, setName] = useState("");
//   const [instructions, setInstructions] = useState("");
//   const [selected, setSelected] = useState<string[]>([]);

//   // const handleCheck = (name_url: string) => {
//   //   setSelected((prev) =>
//   //     prev.includes(name_url) ? prev.filter((u) => u !== name_url) : [...prev, name_url]
//   //   );
//   // };

//   return (
//     <div className={styles.Window}>
//       <div className={styles.headerContainer}>
//         <div className={styles.headerContent}>
//           <h2 className={styles.title}>Create Orchestrator</h2>
//         </div>
//         <div className={styles.actions}>
//           <button
//             onClick={() => {
//               if (name && instructions && selected.length)
//                 // onCreate({
//                 //   name,
//                 //   instructions,
//                 //   agents: agents.filter((a) => selected.includes(a.url)),
//                 // });
//                 onCreate({ 
//                   name: name, 
//                   url: "http://localhost:8083", 
//                   subAgents: agents.filter((a) => selected.includes(a.name + a.url)),
//                   instructions: instructions,
//                   description: "",
//                   type: "orchestrator"
//                 });
//             }}
//           >
//             Create
//           </button>
//           <button onClick={onCancel}>Cancel</button>
//         </div>
//       </div>
//       <div className={styles.separator}></div>
//       <div className={`${styles.inputSection} ${styles.customScrollbar}`}>
//         <div className={styles.inputs}>
//           <div className={styles.inputContainer}>
//             <p className={styles.label}>Orchestrator Name</p>
//             <input className={styles.input}
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
//               <p className={styles.label}>Select Agents</p>
//               <div className={styles.tableContainer}>   
//                 <AgGridTable
//                   agents={agents.filter(a => a.type === "a2a_agent")}
//                   selected={selected}
//                   setSelected={setSelected}
//                 />
//               </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useState } from "react";
import styles from "./CreateMultiAgentForm.module.css";
import AgGridTable from "./AgGridTable";

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

interface CreateMultiAgentFormProps {
  agents: Agent[];
  onCreate: (agent: {
    name: string;
    url: string;
    subAgents: Agent[];
    instructions: string;
    framework: string;
    description: string;
    type: string;
  }) => void;
  onCancel: () => void;
}

export default function CreateMultiAgentForm({
  agents,
  onCreate,
  onCancel,
}: CreateMultiAgentFormProps) {
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const isFormValid = name.trim() !== "" && instructions.trim() !== "" && selected.length > 0;

  const selectedAgents = agents.filter((a) => selected.includes(a.name + a.url));

  return (
    <div className={styles.Window}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Create Orchestrator</h2>
        </div>
        <div className={styles.actions}>
          <button
            disabled={!isFormValid}
            onClick={() => {
              if (isFormValid) {
                onCreate({
                  name,
                  url: "http://localhost:8083",
                  subAgents: selectedAgents,
                  instructions,
                  framework: "",
                  description: "",
                  type: "orchestrator",
                });
              }
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
            <label className={styles.label} htmlFor="orchestrator-name">
              Orchestrator Name
            </label>
            <input
              id="orchestrator-name"
              className={styles.input}
              type="text"
              placeholder="e.g. My Orchestrator Agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="system-instructions">
              System Instructions
            </label>
            <textarea
              id="system-instructions"
              className={styles.textarea}
              placeholder="Supervisor instruction for managing multiple agents"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
            />
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label}>Select Agents</label>
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