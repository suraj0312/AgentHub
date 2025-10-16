import React from "react";
import { CopilotChat } from "@copilotkit/react-ui";
import styles from "./ChatWindow.module.css";
import "@copilotkit/react-ui/styles.css";
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";

interface ChatWindowProps {
  selectedAgentName: string;
  selectedAgentDescription: string;
  
}

// export default function ChatWindow({ selectedAgentName, selectedAgentDescription, agentUrl, chatHistory, onSendMessage }) {
export default function ChatWindow({ selectedAgentName, selectedAgentDescription }:ChatWindowProps) {
  // Use agentUrl and chatHistory to display chat for the selected agent
  // onSendMessage to update chat history
  return (
    <div className={styles.chatWindow}
  //   style={
  //   {
  //     "--copilot-kit-background-color": "#c309edff",
  //   } as CopilotKitCSSProperties
  // }
    >
      <CopilotChat
        labels={{
          title: "Chat Assistant",
          initial: `Hi! I'm connected to **${selectedAgentName}** - ${selectedAgentDescription}. How can I help?`, // "Hi! I'm connected to <agent name>. How can I help?"
          
        
        }}
      />
    </div>
  );
}