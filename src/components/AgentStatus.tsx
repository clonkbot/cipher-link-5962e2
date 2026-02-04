import { useState } from 'react';

interface AgentStatusProps {
  activeAgent: string;
  onAgentChange: (agent: string) => void;
}

const AGENTS = [
  { id: 'AGENT-X7', status: 'online', signal: 98 },
  { id: 'AGENT-K9', status: 'online', signal: 87 },
  { id: 'AGENT-Z3', status: 'away', signal: 64 },
  { id: 'AGENT-M1', status: 'offline', signal: 0 },
];

export function AgentStatus({ activeAgent, onAgentChange }: AgentStatusProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentAgent = AGENTS.find(a => a.id === activeAgent) || AGENTS[0];

  return (
    <div className="agent-status-container">
      <button
        className="agent-status-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="agent-avatar">
          <span className={`status-indicator ${currentAgent.status}`}></span>
          <svg viewBox="0 0 24 24" className="avatar-icon">
            <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.8" />
            <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" fill="currentColor" opacity="0.8" />
          </svg>
        </div>
        <div className="agent-info">
          <span className="agent-name">{currentAgent.id}</span>
          <div className="signal-bar">
            <div className="signal-fill" style={{ width: `${currentAgent.signal}%` }}></div>
          </div>
        </div>
        <svg
          viewBox="0 0 24 24"
          className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
        >
          <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
        </svg>
      </button>

      {isExpanded && (
        <div className="agent-dropdown">
          <div className="dropdown-header">SELECT AGENT IDENTITY</div>
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              className={`agent-option ${agent.id === activeAgent ? 'selected' : ''} ${agent.status}`}
              onClick={() => {
                onAgentChange(agent.id);
                setIsExpanded(false);
              }}
              disabled={agent.status === 'offline'}
            >
              <span className={`option-status ${agent.status}`}></span>
              <span className="option-name">{agent.id}</span>
              <span className="option-signal">{agent.signal}%</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}