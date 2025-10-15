import React from "react";
import styles from "./AgentRibbon.module.css";

export default function AgentRibbon({
  agents,
  selectedAgentUrl,
  selectedAgentName,
  onSelectAgent,
  agentType,
  setAgentType,
}) {
  // Filter agents based on toggle
  const filteredAgents = agents.filter(
        (agent) => agent.type === agentType
  );

  return (
    <div className={styles.ribbon}>
      <div className={styles.toggleGroup}>
        <input type="radio" name="mode" id="a2a_agents" value="a2a_agents" checked={agentType === "a2a_agent"} onChange={() => setAgentType("a2a_agent")}/>
        <label htmlFor="a2a_agents">
          A2A Agents
        </label>
        <input type="radio" name="mode" id="orchestrators" value="orchestrators" checked={agentType === "orchestrator"} onChange={() => setAgentType("orchestrator")}/>
        <label htmlFor="orchestrators">
          Orchestrators
        </label>
        <input type="radio" name="mode" id="local_agents" value="local_agents" checked={agentType === "local_agent"} onChange={() => setAgentType("local_agent")}/>
        <label htmlFor="local_agents">
          Local Agents
        </label>
      </div>
      <div className={styles.separator}></div>
      <div className={`${styles.buttonContainer} ${styles.customScrollbar}`}>
        {filteredAgents.map((agent) => (
          <button
            key={agent.name + agent.url}
            className={
              (selectedAgentUrl === agent.url && selectedAgentName === agent.name)
                ? styles.selected
                : styles.button
            }
            onClick={() => onSelectAgent(agent)}
          >
            {agent.name}
          </button>
        ))}
      </div>
    </div>
  );
}