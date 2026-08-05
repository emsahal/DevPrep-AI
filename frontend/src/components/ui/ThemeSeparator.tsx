import type { CSSProperties } from 'react';
import './ThemeSeparator.css';

export interface ThemeSeparatorProps {
  /** Custom additional class names for the container */
  className?: string;
  /** Max-width of the separator, e.g. 'max-w-6xl', 'max-w-4xl', 'w-full' */
  maxWidth?: string;
  /** Color variant matching the theme tokens */
  variant?: 'primary' | 'secondary' | 'ambient';
  /** Animation duration in seconds (default: 3.5s) */
  speed?: number;
  /** Whether to show a subtle center glow node */
  withNode?: boolean;
  /** Inline styles for container */
  style?: CSSProperties;
}

export function ThemeSeparator({
  className = '',
  maxWidth = 'max-w-5xl',
  variant = 'primary',
  speed = 3.5,
  withNode = false,
  style,
}: ThemeSeparatorProps) {
  return (
    <div
      className={`theme-separator-wrapper mx-auto ${maxWidth} ${className}`.trim()}
      style={style}
    >
      <div className="theme-separator-glow" />
      <div className={`theme-separator-track variant-${variant}`}>
        <div
          className="theme-separator-light-sweep"
          style={{ animationDuration: `${speed}s` }}
        />
      </div>
      {withNode && <div className="theme-separator-node" />}
    </div>
  );
}

export default ThemeSeparator;
