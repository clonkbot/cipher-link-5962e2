import { useState, useEffect, useCallback } from 'react';
import { MessageTerminal } from './components/MessageTerminal';
import { CipherEngine } from './components/CipherEngine';
import { AgentStatus } from './components/AgentStatus';
import { ScanLines } from './components/ScanLines';
import { GlitchText } from './components/GlitchText';
import './styles.css';

const CIPHER_METHODS = ['ROT13', 'BINARY', 'HEX', 'BASE64', 'MORSE'];

interface Message {
  id: string;
  agent: string;
  original: string;
  encoded: string;
  cipher: string;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedCipher, setSelectedCipher] = useState('ROT13');
  const [activeAgent, setActiveAgent] = useState('AGENT-X7');
  const [isTransmitting, setIsTransmitting] = useState(false);

  const encodeMessage = useCallback((text: string, cipher: string): string => {
    switch (cipher) {
      case 'ROT13':
        return text.replace(/[a-zA-Z]/g, (c) => {
          const base = c <= 'Z' ? 65 : 97;
          return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
        });
      case 'BINARY':
        return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      case 'HEX':
        return text.split('').map(c => c.charCodeAt(0).toString(16).toUpperCase()).join(' ');
      case 'BASE64':
        return btoa(text);
      case 'MORSE':
        const morseMap: Record<string, string> = {
          'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
          'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
          'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
          'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
          'Y': '-.--', 'Z': '--..', ' ': '/', '1': '.----', '2': '..---',
          '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
          '8': '---..', '9': '----.', '0': '-----'
        };
        return text.toUpperCase().split('').map(c => morseMap[c] || c).join(' ');
      default:
        return text;
    }
  }, []);

  const sendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    setIsTransmitting(true);

    setTimeout(() => {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        agent: activeAgent,
        original: inputText,
        encoded: encodeMessage(inputText, selectedCipher),
        cipher: selectedCipher,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setIsTransmitting(false);
    }, 800);
  }, [inputText, activeAgent, selectedCipher, encodeMessage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        sendMessage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sendMessage]);

  return (
    <div className="app-container">
      <ScanLines />

      <header className="main-header">
        <div className="logo-section">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" className="logo-svg">
              <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              <circle cx="20" cy="20" r="6" fill="currentColor" />
              <line x1="20" y1="2" x2="20" y2="10" stroke="currentColor" strokeWidth="1" />
              <line x1="20" y1="30" x2="20" y2="38" stroke="currentColor" strokeWidth="1" />
              <line x1="2" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="1" />
              <line x1="30" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
          <div className="logo-text">
            <GlitchText text="CIPHER_LINK" className="logo-title" />
            <span className="logo-subtitle">AGENT COMMUNICATION PROTOCOL v2.7</span>
          </div>
        </div>

        <AgentStatus
          activeAgent={activeAgent}
          onAgentChange={setActiveAgent}
        />
      </header>

      <main className="main-content">
        <div className="terminal-section">
          <MessageTerminal messages={messages} />
        </div>

        <div className="control-section">
          <CipherEngine
            selectedCipher={selectedCipher}
            onCipherChange={setSelectedCipher}
            cipherMethods={CIPHER_METHODS}
          />

          <div className="input-panel">
            <div className="input-header">
              <span className="input-label">TRANSMIT MESSAGE</span>
              <span className="input-hint">CTRL+ENTER to send</span>
            </div>
            <div className="input-wrapper">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter message for encoding..."
                className="message-input"
                rows={3}
              />
              <button
                onClick={sendMessage}
                className={`send-button ${isTransmitting ? 'transmitting' : ''}`}
                disabled={isTransmitting || !inputText.trim()}
              >
                {isTransmitting ? (
                  <span className="transmitting-text">ENCODING...</span>
                ) : (
                  <>
                    <span>TRANSMIT</span>
                    <svg viewBox="0 0 24 24" className="send-icon">
                      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="currentColor"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
            {inputText && (
              <div className="preview-panel">
                <span className="preview-label">PREVIEW [{selectedCipher}]:</span>
                <div className="preview-text">{encodeMessage(inputText, selectedCipher)}</div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="main-footer">
        <span>Requested by @GoldenFarFR · Built by @clonkbot</span>
      </footer>
    </div>
  );
}

export default App;