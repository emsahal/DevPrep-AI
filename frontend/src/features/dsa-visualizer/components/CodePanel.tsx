import React, { useMemo } from 'react';

interface AnimationEvent {
  type: string
  target?: string | string[]
  value?: unknown
  index?: number
  data?: Record<string, unknown>
}

interface StepData {
  title: string
  animations: AnimationEvent[]
}

interface CodePanelProps {
  code: string
  language: 'cpp' | 'javascript'
  highlightedLine?: number
  currentStep?: number
  steps?: StepData[]
  className?: string
}

const keywordColors: Record<string, string> = {
  int: '#569CD6',
  return: '#569CD6',
  if: '#569CD6',
  else: '#569CD6',
  for: '#569CD6',
  while: '#569CD6',
  do: '#569CD6',
  switch: '#569CD6',
  case: '#569CD6',
  break: '#569CD6',
  continue: '#569CD6',
  void: '#569CD6',
  bool: '#569CD6',
  char: '#569CD6',
  double: '#569CD6',
  float: '#569CD6',
  long: '#569CD6',
  short: '#569CD6',
  unsigned: '#569CD6',
  signed: '#569CD6',
  struct: '#569CD6',
  class: '#569CD6',
  enum: '#569CD6',
  union: '#569CD6',
  typedef: '#569CD6',
  const: '#569CD6',
  static: '#569CD6',
  true: '#4EC9B0',
  false: '#4EC9B0',
  nullptr: '#4EC9B0',
  NULL: '#4EC9B0',
  include: '#C586C0',
  define: '#C586C0',
  using: '#C586C0',
  namespace: '#C586C0',
  std: '#C586C0',
  '#include': '#C586C0',
  template: '#C586C0',
  typename: '#C586C0',
  auto: '#569CD6',
  new: '#569CD6',
  delete: '#569CD6',
  try: '#569CD6',
  catch: '#569CD6',
  throw: '#569CD6',
  public: '#569CD6',
  private: '#569CD6',
  protected: '#569CD6',
};

const numberColor = '#B5CEA8';
const stringColor = '#CE9178';
const commentColor = '#6A9955';
const functionColor = '#DCDCAA';
const defaultColor = '#D4D4D4';

function getHighlightedLineFromSteps(steps: StepData[], currentStep: number): number | undefined {
  if (!steps || currentStep < 0 || currentStep >= steps.length) return undefined
  const step = steps[currentStep]
  if (!step) return undefined
  const codeAnimations = step.animations.filter(a => a.type === 'highlightCode')
  if (codeAnimations.length > 0) {
    const lineNum = codeAnimations[0].index
    if (lineNum != null) return lineNum
    const target = codeAnimations[0].target
    if (typeof target === 'string') return parseInt(target, 10)
  }
  return undefined
}

function highlightLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const regex = /(\/\/.*)|("[^"]*")|(\b\d+\.?\d*\b)|(\b[a-zA-Z_]\w*\s*\()|(\b[a-zA-Z_]\w*\b)|(\s+)|(.)/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  const globalRegex = new RegExp(regex.source, 'g');

  while ((match = globalRegex.exec(line)) !== null) {
    const full = match[0];
    const comment = match[1];
    const str = match[2];
    const num = match[3];
    const func = match[4];
    const word = match[5];
    const ws = match[6];
    const other = match[7];

    if (comment) {
      tokens.push(<span key={lastIndex} style={{ color: commentColor }}>{comment}</span>);
    } else if (str) {
      tokens.push(<span key={lastIndex} style={{ color: stringColor }}>{str}</span>);
    } else if (num) {
      tokens.push(<span key={lastIndex} style={{ color: numberColor }}>{num}</span>);
    } else if (func) {
      const funcName = full.replace(/\s*\($/, '');
      const paren = full.replace(funcName, '');
      tokens.push(<span key={lastIndex} style={{ color: functionColor }}>{funcName}</span>);
      tokens.push(<span key={lastIndex + 1} style={{ color: defaultColor }}>{paren}</span>);
    } else if (word) {
      const lower = word;
      if (keywordColors[lower]) {
        tokens.push(<span key={lastIndex} style={{ color: keywordColors[lower] }}>{word}</span>);
      } else {
        tokens.push(<span key={lastIndex} style={{ color: defaultColor }}>{word}</span>);
      }
    } else if (ws) {
      tokens.push(<span key={lastIndex}>{ws}</span>);
    } else if (other) {
      tokens.push(<span key={lastIndex} style={{ color: defaultColor }}>{other}</span>);
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < line.length) {
    tokens.push(<span key={lastIndex} style={{ color: commentColor }}>{line.slice(lastIndex)}</span>);
  }

  return tokens;
}

const CodePanel: React.FC<CodePanelProps> = ({ code, highlightedLine: explicitHighlight, currentStep, steps, className }) => {
  const lines = useMemo(() => code.split('\n'), [code]);
  const highlightedLine = explicitHighlight ?? (currentStep != null && steps ? getHighlightedLineFromSteps(steps, currentStep) : undefined);

  return (
    <div
      className={className}
      style={{
        fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
        fontSize: 13,
        lineHeight: 1.6,
        background: '#1E1E1E',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid #333',
      }}
    >
      <div style={{ padding: '12px 0', overflowX: 'auto' }}>
        {lines.map((line, i) => {
          const lineNum = i + 1;
          const isHighlighted = highlightedLine != null && lineNum === highlightedLine;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: 22,
                background: isHighlighted ? '#2D2B00' : 'transparent',
                borderLeft: isHighlighted ? '3px solid #FFD700' : '3px solid transparent',
                paddingLeft: isHighlighted ? 5 : 8,
                transition: 'background 0.15s ease',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 40,
                  minWidth: 40,
                  textAlign: 'right',
                  paddingRight: 16,
                  color: '#858585',
                  userSelect: 'none',
                  fontSize: 12,
                }}
              >
                {lineNum}
              </span>
              {isHighlighted && (
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
              <span style={{ whiteSpace: 'pre', color: defaultColor }}>
                {line ? highlightLine(line) : <>&nbsp;</>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CodePanel;
