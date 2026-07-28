import React from 'react';
import type { QuestionData } from '../types';

interface SummaryPanelProps {
  question: QuestionData
  className?: string
}

const badgeBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 10px',
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 600,
  fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
};

const difficultyColors: Record<string, { bg: string; fg: string }> = {
  Easy: { bg: '#1A3A2A', fg: '#4EC9B0' },
  Medium: { bg: '#3A2E1A', fg: '#DCDCAA' },
  Hard: { bg: '#3A1A1A', fg: '#F44747' },
};

const SummaryPanel: React.FC<SummaryPanelProps> = ({ question, className }) => {
  const diffStyle = difficultyColors[question.difficulty] || difficultyColors.Easy;

  return (
    <div
      className={className}
      style={{
        background: '#1E1E1E',
        border: '1px solid #333',
        borderRadius: 8,
        padding: 16,
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        color: '#D4D4D4',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Title + Difficulty */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#FFF',
              marginBottom: 4,
            }}
          >
            {question.title}
          </div>
          <div style={{ fontSize: 12, color: '#858585' }}>
            {question.topic}
          </div>
        </div>
        <span
          style={{
            ...badgeBase,
            background: diffStyle.bg,
            color: diffStyle.fg,
          }}
        >
          {question.difficulty}
        </span>
      </div>

      {/* Complexity */}
      <div style={{ display: 'flex', gap: 8 }}>
        <span style={{ ...badgeBase, background: '#1A2A3A', color: '#569CD6' }}>
          Time: {question.complexity.time}
        </span>
        <span style={{ ...badgeBase, background: '#1A2A3A', color: '#569CD6' }}>
          Space: {question.complexity.space}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#333' }} />

      {/* Common Mistakes */}
      {question.commonMistakes.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#F44747',
              marginBottom: 8,
            }}
          >
            {'❌  Common Mistakes'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {question.commonMistakes.map((mistake, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: '#CCC',
                }}
              >
                <span style={{ flexShrink: 0, color: '#F44747', fontSize: 14 }}>{'✕'}</span>
                <span>{mistake}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {question.tips.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#DCDCAA',
              marginBottom: 8,
            }}
          >
            {'💡  Tips'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {question.tips.map((tip, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: '#CCC',
                }}
              >
                <span style={{ flexShrink: 0, fontSize: 14 }}>{'💡'}</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: '#333' }} />

      {/* Key Takeaway */}
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#4EC9B0',
            marginBottom: 6,
          }}
        >
          {'🎯  Key Takeaway'}
        </div>
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: '#CCC',
            padding: '8px 12px',
            background: '#2A2A2A',
            borderRadius: 6,
            borderLeft: '3px solid #4EC9B0',
          }}
        >
          {question.intuition}
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
