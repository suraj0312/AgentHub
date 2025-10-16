// import React, { useState } from "react";
// import styles from "./AddAgentModal.module.css";
// import { useCopilotContext } from "@copilotkit/react-core";

// interface AddAgentModalProps {
//   onAdd: (agent: {
//     name: string;
//     url: string;
//     subAgents: any;
//     instructions: string;
//     framework: string;
//     description: string;
//     type: string;
//     session_id: any;
//   }) => void;
//   onCancel: () => void;
// }

// export default function AddAgentModal({ onAdd, onCancel }: AddAgentModalProps) {
//   const [name, setName] = useState("");
//   const [url, setUrl] = useState("");
//   // const [agentDescription, setAgentDescription] = useState("")
//   const [agentFramework, setAgentFramework] = useState("");
//   const [agentDetailsLoaded, setAgentDetailsLoaded] = useState(false);

//   const [agentCard, setAgentCard] = useState({});
//   const [errorMessage, setErrorMessage] = useState("");
//   const threadId = useCopilotContext().threadId;

//   return (
//     <div className={styles.Window}>
//       <div className={styles.headerContainer}>
//         <div className={styles.headerContent}>
//           <h2 className={styles.title}>Add A2A Agent</h2>
//         </div>
//         <div className={styles.actions}>
//           <button
//             onClick={() => {
//               if (name && url)
//                 onAdd({
//                   name: name,
//                   url: url,
//                   subAgents: [],
//                   instructions: "",
//                   framework: "",
//                   description: "",
//                   type: "a2a_agent",
//                   session_id: threadId,
//                 });
//             }}
//           >
//             Add
//           </button>
//           <button onClick={onCancel}>Cancel</button>
//         </div>
//       </div>
//       <div className={styles.separator}></div>
//       <div className={`${styles.inputSection} ${styles.customScrollbar}`}>
//         <div className={styles.inputs}>
//           <div className={styles.inputContainer}>
//             <p className={styles.label}>Agent Name</p>
//             <input
//               className={styles.input}
//               type="text"
//               placeholder="e.g. My Agent"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>
//           <div className={styles.inputContainer}>
//             <p className={styles.label}>Agent URL</p>
//             <input
//               className={styles.input}
//               type="text"
//               placeholder="e.g. http://localhost:1234"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               onBlur={async () => {
//                 try {
//                   setErrorMessage(""); // Clear previous errors
//                   const res = await fetch(`${url}/.well-known/agent-card.json`);
//                   if (res.ok) {
//                     const data = await res.json();
//                     setAgentCard(data);
//                     // setAgentDescription(data.description);
//                     const framework =
//                       data?.capabilities?.extensions?.[0]?.params?.framework ??
//                       "No Information";
//                     setAgentFramework(framework);
//                     // setAgentFramework(data.capabilities.extensions[0].params.framework);
//                     setAgentDetailsLoaded(true);
//                   } else {
//                     setAgentDetailsLoaded(false);
//                     setErrorMessage(
//                       "No agent details available for the given URL. Please check your URL."
//                     );
//                   }
//                 } catch (err) {
//                   console.error("Failed to fetch agent card:", err);
//                   setAgentDetailsLoaded(false);
//                   setErrorMessage(
//                     "No agent details available for the given URL. Please check your URL."
//                   );
//                 }
//               }}
//             />
//           </div>
//           {errorMessage && <p className={styles.message}>{errorMessage}</p>}
//           {agentDetailsLoaded && (
//             <div className={styles.inputContainer}>
//               <p className={styles.label}>Agent Card</p>
//               <div className={styles.card}>
//                 <h4 className={styles.cardHeader}>Description:</h4>
//                 <p className={styles.cardContent}>{agentCard.description}</p>
//                 <h4 className={styles.cardHeader}>Framework:</h4>
//                 <p className={styles.cardContent}>{agentFramework}</p>
//                 <h4 className={styles.cardHeader}>Tags:</h4>
//                 <div className={styles.cardContent}>
//                   {agentCard?.skills?.[0]?.tags?.length > 0 ? (
//                     agentCard.skills[0].tags.map((tag, index) => (
//                       <p key={index}>- {tag}</p>
//                     ))
//                   ) : (
//                     <p>No tags available</p>
//                   )}
//                 </div>
//                 <h4 className={styles.cardHeader}>Examples:</h4>
//                 <div className={styles.cardContent}>
//                   {agentCard?.skills?.[0]?.examples?.length > 0 ? (
//                     agentCard.skills[0].examples.map((example, index) => (
//                       <p key={index}>- {example}</p>
//                     ))
//                   ) : (
//                     <p>No tags available</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// Written by SRJ, new,

import React, { useState } from "react";
import styles from "./AddAgentModal.module.css";
import { useCopilotContext } from "@copilotkit/react-core";

interface AgentCard {
  description?: string;
  capabilities?: {
    extensions?: {
      params?: {
        framework?: string;
      };
    }[];
  };
  skills?: {
    tags?: string[];
    examples?: string[];
  }[];
}
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
interface AddAgentModalProps {
  onAdd: (agent: {
    name: string;
    url: string;
    subAgents: Agent[];
    instructions: string;
    framework: string;
    description: string;
    type: string;
    session_id: string;
  }) => void;
  onCancel: () => void;
}

export default function AddAgentModal({ onAdd, onCancel }: AddAgentModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [agentFramework, setAgentFramework] = useState("No Information");
  const [agentDetailsLoaded, setAgentDetailsLoaded] = useState(false);
  const [agentCard, setAgentCard] = useState<AgentCard>({});
  const [errorMessage, setErrorMessage] = useState("");
  const threadId = useCopilotContext().threadId;

  const isFormValid = name.trim() !== "" && url.trim() !== "";

  const handleBlur = async () => {
    setErrorMessage("");
    try {
      const res = await fetch(`${url}/.well-known/agent-card.json`);

      if (!res.ok) {
        setAgentDetailsLoaded(false);
        setErrorMessage(
          "No agent details available for the given URL. Please check your URL."
        );
        return; // Exit early without throwing
      }

      const data: AgentCard = await res.json();
      setAgentCard(data);

      const framework =
        data?.capabilities?.extensions?.[0]?.params?.framework ??
        "No Information";
      setAgentFramework(framework);
      setAgentDetailsLoaded(true);
    } catch (err) {
      console.error("Failed to fetch agent card:", err);
      setAgentDetailsLoaded(false);
      setErrorMessage(
        "Unable to fetch agent details. Please verify the URL and try again."
      );
    }
  }

    return (
      <div className={styles.Window}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Add A2A Agent</h2>
          </div>
          <div className={styles.actions}>
            <button
              disabled={!isFormValid}
              onClick={() => {
                onAdd({
                  name,
                  url,
                  subAgents: [],
                  instructions: "",
                  framework: agentFramework,
                  description: agentCard.description ?? "",
                  type: "a2a_agent",
                  session_id: threadId,
                });
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
              <label className={styles.label}>Agent Name</label>
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. My Agent"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.label}>Agent URL</label>
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. http://localhost:1234"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleBlur}
              />
            </div>

            {errorMessage && <p className={styles.message}>{errorMessage}</p>}

            {agentDetailsLoaded && (
              <div className={styles.inputContainer}>
                <label className={styles.label}>Agent Card</label>
                <div className={styles.card}>
                  <h4 className={styles.cardHeader}>Description:</h4>
                  <p className={styles.cardContent}>
                    {agentCard.description ?? "No description"}
                  </p>

                  <h4 className={styles.cardHeader}>Framework:</h4>
                  <p className={styles.cardContent}>{agentFramework}</p>

                  <h4 className={styles.cardHeader}>Tags:</h4>
                  <div className={styles.cardContent}>
                    {agentCard?.skills?.[0]?.tags?.length ? (
                      agentCard.skills[0].tags.map((tag, index) => (
                        <p key={index}>- {tag}</p>
                      ))
                    ) : (
                      <p>No tags available</p>
                    )}
                  </div>

                  <h4 className={styles.cardHeader}>Examples:</h4>
                  <div className={styles.cardContent}>
                    {agentCard?.skills?.[0]?.examples?.length ? (
                      agentCard.skills[0].examples.map((example, index) => (
                        <p key={index}>- {example}</p>
                      ))
                    ) : (
                      <p>No examples available</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
