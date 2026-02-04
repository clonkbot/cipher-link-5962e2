import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  agent: string;
  original: string;
  encoded: string;
  cipher: string;
  timestamp: Date;
}

interface MessageTerminalProps {
  messages: Message[];
}

export function MessageTerminal({ messages }: MessageTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [revealedMessages, setRevealedMessages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleReveal = (id: string) => {
    setRevealedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <span className="terminal-title">SECURE CHANNEL // ENCRYPTED</span>
        <div className="terminal-status">
          <span className="status-dot"></span>
          <span>ACTIVE</span>
        </div>
      </div>

      <div className="terminal-body" ref={terminalRef}>
        {messages.length === 0 ? (
          <div className="empty-terminal">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                  fill="currentColor"
                  opacity="0.5"
                />
              </svg>
            </div>
            <p className="empty-text">AWAITING TRANSMISSION...</p>
            <p className="empty-subtext">No encoded messages in buffer</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id}
              className="message-block"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="message-header">
                <span className="message-agent">{msg.agent}</span>
                <span className="message-cipher">[{msg.cipher}]</span>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
              <div
                className="message-content"
                onClick={() => toggleReveal(msg.id)}
                title="Click to toggle decode"
              >
                <span className={`encoded-text ${revealedMessages.has(msg.id) ? 'revealed' : ''}`}>
                  {revealedMessages.has(msg.id) ? msg.original : msg.encoded}
                </span>
                <button className="decode-toggle">
                  {revealedMessages.has(msg.id) ? 'HIDE' : 'DECODE'}
                </button>
              </div>
            </div>
          ))
        )}
        <div className="terminal-cursor"></div>
      </div>
    </div>
  );
}