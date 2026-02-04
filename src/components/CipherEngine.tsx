import { useState, useEffect } from 'react';

interface CipherEngineProps {
  selectedCipher: string;
  onCipherChange: (cipher: string) => void;
  cipherMethods: string[];
}

export function CipherEngine({ selectedCipher, onCipherChange, cipherMethods }: CipherEngineProps) {
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getCipherDescription = (cipher: string): string => {
    const descriptions: Record<string, string> = {
      'ROT13': 'Letter substitution cipher - shifts each letter 13 positions',
      'BINARY': 'Converts text to 8-bit binary representation',
      'HEX': 'Hexadecimal encoding of character codes',
      'BASE64': 'Base64 encoding scheme for binary data',
      'MORSE': 'International Morse code representation',
    };
    return descriptions[cipher] || 'Unknown cipher method';
  };

  return (
    <div className="cipher-engine">
      <div className="cipher-header">
        <div className="cipher-icon-wrapper">
          <svg
            viewBox="0 0 100 100"
            className="cipher-wheel"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          >
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 50 + 40 * Math.cos(angle);
              const y1 = 50 + 40 * Math.sin(angle);
              const x2 = 50 + 45 * Math.cos(angle);
              const y2 = 50 + 45 * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="2"
                />
              );
            })}
            {[...Array(6)].map((_, i) => {
              const angle = (i * 60 * Math.PI) / 180;
              const x = 50 + 25 * Math.cos(angle);
              const y = 50 + 25 * Math.sin(angle);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="currentColor"
                />
              );
            })}
          </svg>
        </div>
        <div className="cipher-title-section">
          <h3 className="cipher-title">CIPHER ENGINE</h3>
          <p className="cipher-subtitle">Select encoding protocol</p>
        </div>
      </div>

      <div className="cipher-selector">
        {cipherMethods.map((cipher) => (
          <button
            key={cipher}
            onClick={() => onCipherChange(cipher)}
            className={`cipher-option ${selectedCipher === cipher ? 'active' : ''}`}
          >
            <span className="cipher-name">{cipher}</span>
            <span className="cipher-indicator"></span>
          </button>
        ))}
      </div>

      <div className="cipher-description">
        <span className="description-label">PROTOCOL INFO:</span>
        <p className="description-text">{getCipherDescription(selectedCipher)}</p>
      </div>
    </div>
  );
}