import React from 'react';

interface PseudocodePanelProps {
  lines?: string[]
  currentLine?: number
  pseudocode?: string[]
  currentStep?: number
  className?: string
}

const PseudocodePanel: React.FC<PseudocodePanelProps> = ({ lines: explicitLines, currentLine: explicitLine, pseudocode, currentStep, className }) => {
  const lines = explicitLines ?? pseudocode ?? []
  const currentLine = explicitLine ?? currentStep
  return (
    <div
      className={className}
      style={{
        fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
        fontSize: 13,
        lineHeight: 1.6,
        background: '#1E1E1E',
        border: '1px solid #333',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: '#858585',
          borderBottom: '1px solid #333',
        }}
      >
        Pseudocode
      </div>
      <div style={{ padding: '12px 0' }}>
        {lines.map((line, i) => {
          const lineNum = i + 1;
          const isCurrent = currentLine != null && lineNum === currentLine;
          const isCompleted = currentLine != null && lineNum < currentLine;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: 22,
                background: isCurrent ? '#2D2B00' : 'transparent',
                borderLeft: isCurrent ? '3px solid #FFD700' : '3px solid transparent',
                paddingLeft: isCurrent ? 5 : 8,
                color: isCompleted
                  ? '#858585'
                  : isCurrent
                    ? '#FFD700'
                    : '#D4D4D4',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 28,
                  minWidth: 28,
                  textAlign: 'right',
                  paddingRight: 12,
                  color: isCompleted ? '#555' : '#858585',
                  userSelect: 'none',
                  fontSize: 12,
                }}
              >
                {lineNum}
              </span>
              {isCurrent && (
                <span
                  style={{
                    color: '#FFD700',
                    marginRight: 4,
                    fontSize: 12,
                    fontWeight: 'bold',
                    flexShrink: 0,
                  }}
                >
                  {'▸'}
                </span>
              )}
              <span style={{ whiteSpace: 'pre' }}>
                {line || <>&nbsp;</>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PseudocodePanel;
