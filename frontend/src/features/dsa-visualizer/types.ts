export type AnimationType =
  | 'highlight'
  | 'compare'
  | 'moveArrow'
  | 'swap'
  | 'insert'
  | 'remove'
  | 'fade'
  | 'glow'
  | 'pulse'
  | 'showVariable'
  | 'updateVariable'
  | 'showText'
  | 'highlightCode'
  | 'visitNode'
  | 'showTree'
  | 'connectNodes'
  | 'showStack'
  | 'showQueue'
  | 'showGraph'
  | 'push'
  | 'pop'
  | 'enqueue'
  | 'dequeue'
  | 'highlightNode'
  | 'zoom'
  | 'drawLine'
  | 'drawArrow'
  | 'disconnectNodes'
  | 'showTable';

export interface AnimationEvent {
  type: AnimationType;
  target?: string | string[];
  value?: unknown;
  from?: string | number;
  to?: string | number;
  index?: number;
  indices?: number[];
  color?: string;
  label?: string;
  description?: string;
  duration?: number;
  data?: Record<string, unknown>;
}

export interface Step {
  title: string;
  description: string;
  why?: string;
  animations: AnimationEvent[];
}

export interface QuestionData {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  level: number;
  problem: string;
  example?: string;
  intuition: string;
  steps: Step[];
  pseudocode: string[];
  code: { cpp: string; javascript: string };
  complexity: { time: string; space: string };
  commonMistakes: string[];
  tips: string[];
  inputExample?: Record<string, unknown>;
}
