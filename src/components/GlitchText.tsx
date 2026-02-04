import { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

export function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setIsGlitching(true);

        const glitchDuration = Math.random() * 200 + 50;

        const glitchLoop = setInterval(() => {
          setDisplayText(
            text
              .split('')
              .map((char) =>
                Math.random() > 0.7
                  ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
                  : char
              )
              .join('')
          );
        }, 30);

        setTimeout(() => {
          clearInterval(glitchLoop);
          setDisplayText(text);
          setIsGlitching(false);
        }, glitchDuration);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, [text]);

  return (
    <span className={`glitch-text ${className} ${isGlitching ? 'glitching' : ''}`} data-text={text}>
      {displayText}
    </span>
  );
}