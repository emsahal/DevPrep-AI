import { useEffect, useMemo, useRef, useState } from 'react';

type Token = { text: string; className: string; start: number };
type Row = { tokens: Token[] };

const KEYWORDS = new Set([
  'def', 'for', 'in', 'if', 'elif', 'else', 'and', 'or', 'not', 'return',
  'while', 'import', 'from', 'as', 'with', 'try', 'except', 'lambda',
  'pass', 'break', 'continue', 'None', 'True', 'False', 'class', 'is', 'del', 'raise',
]);

const TOKEN_REGEX = /(\s+)|(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\d+(?:\.\d+)*)|([A-Za-z_][A-Za-z0-9_]*)/g;

function highlightLine(line: string, funcColor: string): { text: string; className: string }[] {
  const tokens: { text: string; className: string }[] = [];
  let lastEnd = 0;
  let prevIsDef = false;
  let m: RegExpExecArray | null;

  TOKEN_REGEX.lastIndex = 0;
  while ((m = TOKEN_REGEX.exec(line)) !== null) {
    if (m.index > lastEnd) {
      tokens.push({ text: line.slice(lastEnd, m.index), className: 'text-white/70' });
    }

    const [full, space, comment, str, num, word] = m;
    let className = 'text-white/70';

    if (space !== undefined) {
      className = '';
    } else if (comment !== undefined) {
      className = 'text-white/35';
    } else if (str !== undefined) {
      className = 'text-emerald-300';
    } else if (num !== undefined) {
      className = 'text-orange-300';
    } else if (word !== undefined) {
      if (KEYWORDS.has(word)) className = 'text-purple-400';
      else if (prevIsDef) className = funcColor;
      else className = '';
    }

    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(full)) prevIsDef = full === 'def';

    tokens.push({ text: full, className });
    lastEnd = m.index + full.length;
  }

  if (lastEnd < line.length) {
    tokens.push({ text: line.slice(lastEnd), className: 'text-white/70' });
  }

  return tokens;
}

interface TypingCodeProps {
  lines: string[];
  funcColor?: string;
  charInterval?: number;
  startDelay?: number;
  loop?: boolean;
  loopPause?: number;
  className?: string;
}

const TypingCode = ({
  lines,
  funcColor = 'text-cyan-300 font-semibold',
  charInterval = 34,
  startDelay = 400,
  loop = false,
  loopPause = 3500,
  className = '',
}: TypingCodeProps) => {
  const { rows, total } = useMemo(() => {
    const parsed: Row[] = [];
    let offset = 0;
    for (const line of lines) {
      const tokens = highlightLine(line, funcColor).map((t) => {
        const token: Token = { ...t, start: offset };
        offset += t.text.length;
        return token;
      });
      parsed.push({ tokens });
    }
    return { rows: parsed, total: offset };
  }, [lines, funcColor]);

  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    setCount(0);
    const timer = setTimeout(() => {
      setCount((c) => Math.min(c + 1, total));
    }, startDelay);
    return () => clearTimeout(timer);
  }, [inView, total, startDelay]);

  useEffect(() => {
    if (!inView || count >= total) return;
    const iv = setInterval(() => {
      setCount((c) => (c < total ? c + 1 : c));
    }, charInterval);
    return () => clearInterval(iv);
  }, [inView, count, total, charInterval]);

  useEffect(() => {
    if (!inView || !loop || count < total) return;
    const t = setTimeout(() => setCount(0), loopPause);
    return () => clearTimeout(t);
  }, [inView, loop, count, total, loopPause]);

  const renderCaret = (token: Token) => count > token.start && count <= token.start + token.text.length;

  return (
    <div ref={ref} className={className}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="space-y-0">
          {row.tokens.map((token, tokenIndex) => {
            const start = token.start;
            const revealed = Math.max(0, Math.min(count - start, token.text.length));
            if (revealed <= 0) return null;
            const slice = token.text.slice(0, revealed).replace(/ /g, '\u00A0');
            return (
              <span key={tokenIndex} className={token.className}>
                {slice}
                {renderCaret(token) && <span className="typing-caret inline-block w-[7px] h-[14px] align-middle bg-cyan-400 animate-pulse ml-px" />}
              </span>
            );
          })}
          {count === 0 && rowIndex === 0 && total > 0 && (
            <span className="typing-caret inline-block w-[7px] h-[14px] align-middle bg-cyan-400 animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
};

export default TypingCode;
