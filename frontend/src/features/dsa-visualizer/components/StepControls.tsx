import React from 'react';

interface StepControlsProps {
  currentStep: number
  totalSteps: number
  onPrev: () => void
  onNext: () => void
  onReset: () => void
  isAutoPlaying?: boolean
  onToggleAutoPlay?: () => void
  className?: string
}

const btnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: 8,
  border: '1px solid #444',
  background: '#2A2A2A',
  color: '#D4D4D4',
  fontSize: 16,
  cursor: 'pointer',
  transition: 'background 0.15s ease, opacity 0.15s ease',
  userSelect: 'none',
};

const StepControls: React.FC<StepControlsProps> = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onReset,
  isAutoPlaying = false,
  onToggleAutoPlay,
  className,
}) => {
  const isFirst = currentStep <= 0;
  const isLast = currentStep >= totalSteps - 1;
  const progressPct = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div
      className={className}
      style={{
        background: '#1E1E1E',
        border: '1px solid #333',
        borderRadius: 8,
        padding: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 8,
        }}
      >
        <button
          type="button"
          onClick={onReset}
          title="Reset"
          style={{
            ...btnBase,
            opacity: isFirst ? 0.4 : 0.8,
          }}
        >
          {'⟳'}
        </button>
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          title="Previous"
          style={{
            ...btnBase,
            opacity: isFirst ? 0.4 : 0.8,
            cursor: isFirst ? 'not-allowed' : 'pointer',
          }}
        >
          {'←'}
        </button>

        <span
          style={{
            fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
            fontSize: 13,
            color: '#D4D4D4',
            minWidth: 100,
            textAlign: 'center',
          }}
        >
          Step {currentStep + 1} of {totalSteps}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={isLast}
          title="Next"
          style={{
            ...btnBase,
            opacity: isLast ? 0.4 : 0.8,
            cursor: isLast ? 'not-allowed' : 'pointer',
          }}
        >
          {'→'}
        </button>
        {onToggleAutoPlay && (
          <button
            type="button"
            onClick={onToggleAutoPlay}
            title={isAutoPlaying ? 'Pause' : 'Auto-play'}
            style={{
              ...btnBase,
              opacity: 0.8,
              marginLeft: 4,
            }}
          >
            {isAutoPlaying ? '⏸' : '▶'}
          </button>
        )}
      </div>
      <div
        style={{
          width: '100%',
          height: 4,
          background: '#333',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #569CD6, #4EC9B0)',
            borderRadius: 2,
            transition: 'width 0.2s ease',
          }}
        />
      </div>
    </div>
  );
};

export default StepControls;
