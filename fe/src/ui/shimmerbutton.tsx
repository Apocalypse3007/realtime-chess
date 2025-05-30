import React, {type CSSProperties, type FC } from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton: FC<ShimmerButtonProps> = ({ 
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  shimmerDuration = "3s",
  borderRadius = "9999px", 
  background = "rgba(0, 0, 0, 1)",
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <button
      className={`shimmer-button-container ${className}`}
      style={{
        "--shimmer-color": shimmerColor,
        "--radius": borderRadius,
        "--speed": shimmerDuration,
        "--cut": shimmerSize,
        "--bg": background,
      } as CSSProperties}
      {...props}
    >
      {/* Spark container */}
      <div className="shimmer-spark-container">
        {/* Rotating spark */}
        <div className="shimmer-spark">
          <div className="shimmer-spark-gradient"></div>
        </div>
      </div>
      
      {/* Replace border beam with subtle border glow */}
      <div className="shimmer-border-glow"></div>
      
      {/* Content */}
      <span className="shimmer-content">{children}</span>
      
      {/* Inner highlight */}
      <div className="shimmer-highlight"></div>
      
      {/* Inner background */}
      <div className="shimmer-backdrop"></div>

      <style>{`
        .shimmer-button-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 10px 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: var(--bg);
          color: white;
          border-radius: var(--radius);
          font-weight: 500;
          cursor: pointer;
          z-index: 1;
          transform-style: preserve-3d;
          transform: translateZ(0);
          transition: transform 300ms ease-in-out;
        }
        
        .shimmer-button-container:active {
          transform: translateY(1px);
        }
        
        /* Spark container */
        .shimmer-spark-container {
          position: absolute;
          inset: 0;
          z-index: -30;
          overflow: visible;
          filter: blur(2px);
        }
        
        /* Spark element */
        .shimmer-spark {
          position: absolute;
          inset: 0;
          height: 100cqh;
          aspect-ratio: 1;
        }
        
        /* Gradient background */
        .shimmer-spark-gradient {
          position: absolute;
          inset: -100%;
          width: auto;
          animation: var(--animate-spin-around);
          background: conic-gradient(
            from 270deg,
            transparent 0,
            var(--shimmer-color) 90deg,
            transparent 180deg
          );
        }
        
        /* Replace the beam with a subtle border glow */
        .shimmer-border-glow {
          position: absolute;
          inset: -1px;
          border-radius: var(--radius);
          z-index: 1;
          background: transparent;
          box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.1);
          pointer-events: none;
          overflow: hidden;
        }
        
        .shimmer-border-glow::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: var(--radius);
          box-shadow: 0 0 4px 2px rgba(255, 255, 255, 0.3);
          opacity: 0.7;
        }
        
        /* Content z-ordering */
        .shimmer-content {
          position: relative;
          z-index: 2;
        }
        
        /* Inner highlight effect */
        .shimmer-highlight {
          position: absolute;
          inset: 0;
          border-radius: calc(var(--radius) - 4px);
          padding: 6px;
          box-shadow: inset 0 -8px 10px rgba(255, 255, 255, 0.3);
          transition: all 300ms ease-in-out;
        }
        
        .shimmer-button-container:hover .shimmer-highlight {
          box-shadow: inset 0 -6px 10px rgb(255, 255, 255);
        }
        
        .shimmer-button-container:active .shimmer-highlight {
          box-shadow: inset 0 -10px 10px rgba(255, 255, 255, 0.55);
        }
        
        /* Inner background to cover the gradient */
        .shimmer-backdrop {
          position: absolute;
          z-index: -20;
          background: var(--bg);
          border-radius: var(--radius);
          inset: var(--cut);
        }
        
        /* Animation for the rotating gradient */
        @keyframes spin-around {
          0% {
            transform: translateZ(0) rotate(0);
          }
          15%,
          35% {
            transform: translateZ(0) rotate(90deg);
          }
          65%,
          85% {
            transform: translateZ(0) rotate(270deg);
          }
          100% {
            transform: translateZ(0) rotate(360deg);
          }
        }
        
        @keyframes shimmer-slide {
          to {
            transform: translate(calc(100cqw - 100%), 0);
          }
        }
        
        /* Animation variables */
        :root {
          --animate-shimmer-slide: shimmer-slide var(--speed) ease-in-out infinite alternate;
          --animate-spin-around: spin-around calc(var(--speed) * 2) infinite linear;
        }
      `}</style>
    </button>
  );
};

export default ShimmerButton;
