import type { ReactNode, CSSProperties, ElementType } from 'react';
import './StarBorder.css';

interface StarBorderProps {
  as?: ElementType;
  className?: string;
  innerClassName?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children?: ReactNode;
  style?: CSSProperties;
  innerStyle?: CSSProperties;
  [key: string]: unknown;
}

const StarBorder = ({
  as: Component = 'button',
  className = '',
  innerClassName = '',
  color = 'white',
  speed = '6s',
  thickness = 1.5,
  children,
  innerStyle,
  ...rest
}: StarBorderProps) => {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px`,
        ...(rest.style as CSSProperties)
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div className={`inner-content ${innerClassName}`} style={innerStyle}>
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
