import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { QuestionData } from '../types'

interface AnimationEvent {
  type: string
  label?: string
  value?: unknown
  target?: string | string[]
  data?: Record<string, unknown>
}

interface VariablePanelProps {
  variables?: Record<string, string | number | boolean | null | undefined>
  question?: QuestionData
  currentStep?: number
  className?: string
}

function extractVariablesFromStep(question: QuestionData, stepIndex: number): Record<string, string | number | boolean | null | undefined> {
  const vars: Record<string, string | number | boolean | null | undefined> = {}
  if (!question || stepIndex < 0 || stepIndex >= question.steps.length) return vars
  for (let i = 0; i <= stepIndex; i++) {
    const step = question.steps[i]
    if (!step) continue
    for (const anim of step.animations) {
      if ((anim.type === 'showVariable' || anim.type === 'updateVariable') && anim.label) {
        const val = anim.value
        if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean' || val === null || val === undefined) {
          vars[anim.label] = val
        } else if (val != null) {
          vars[anim.label] = String(val)
        }
      }
    }
  }
  return vars
}

const typeColors: Record<string, string> = {
  string: '#CE9178',
  number: '#B5CEA8',
  boolean: '#4EC9B0',
  null: '#D4D4D4',
  undefined: '#858585',
};

function getValueColor(value: string | number | boolean | null | undefined): string {
  if (value === null) return typeColors.null;
  if (value === undefined) return typeColors.undefined;
  return typeColors[typeof value] || '#D4D4D4';
}

function formatValue(value: string | number | boolean | null | undefined): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  return String(value);
}

const VariablePanel: React.FC<VariablePanelProps> = ({ variables: explicitVars, question, currentStep, className }) => {
  const computedVars = question != null && currentStep != null
    ? extractVariablesFromStep(question, currentStep)
    : {}
  const variables = explicitVars ?? computedVars
  const entries = Object.entries(variables);

  return (
    <div
      className={className}
      style={{
        background: '#1E1E1E',
        border: '1px solid #333',
        borderRadius: 8,
        padding: 12,
        fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: '#858585',
          marginBottom: 8,
        }}
      >
        Variables
      </div>
      {entries.length === 0 ? (
        <div style={{ fontSize: 13, color: '#858585', fontStyle: 'italic' }}>
          No variables to display
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <AnimatePresence mode="popLayout">
            {entries.map(([key, value]) => {
              const valueColor = getValueColor(value);
              return (
                <motion.div
                  key={key}
                  layout
                  initial={{ opacity: 0, y: -4 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    boxShadow: [
                      '0 0 0px rgba(76, 175, 80, 0)',
                      '0 0 12px rgba(76, 175, 80, 0.6)',
                      '0 0 0px rgba(76, 175, 80, 0)',
                    ],
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    borderRadius: 4,
                    background: '#2A2A2A',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: '#569CD6', fontWeight: 500 }}>{key}</span>
                  <span style={{ color: valueColor, fontWeight: 600, marginLeft: 12 }}>
                    {formatValue(value)}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default VariablePanel;
