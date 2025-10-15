// "use client";
// import "@copilotkit/react-ui/styles.css";
// import { CopilotChat } from "@copilotkit/react-ui";
// import AgentRibbon from "./components/AgentRibbon";
// import { useState } from "react";

// export default function YourApp() {

//   const [agentUrl, setAgentUrl] = useState("http://localhost:9999");

//   const handleAgentSelect = async (url: string) => {
//     setAgentUrl(url);
//     await fetch("/api/copilotkit/set-agent-url", {
//       method: "POST",
//       headers: { "Content-Type" : "application/json" },
//       body: JSON.stringify({ url }),
//     });
//   };
// return (
//     <main>
//     <h1>Your main content</h1>
//     <AgentRibbon onAgentSelect={handleAgentSelect} />
//     <CopilotChat
//         labels={{
//             title: "Chat Assistant",
//             initial: "Hi! I'm connected to an agent. How can I help?",
//         }}
//     />
//     </main>
// );
// }



import MainLayout from "./components/MainLayout";

export default function Page() {
  return <MainLayout />;
}