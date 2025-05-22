"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundLines = ({
  strokeWidth = 0.3, // Made lines thinner for subtlety
  lineColorLight = "hsl(var(--border))",
  lineColorDark = "hsl(var(--border))",
  className,
  animationDuration = "80s", // Slower animation
  ...props
}: {
  strokeWidth?: number;
  lineColorLight?: string;
  lineColorDark?: string;
  className?: string;
  animationDuration?: string;
}) => {
  const patternId = React.useId().replace(/:/g, ""); // Ensure unique ID

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden z-0",
        className
      )}
      {...props}
    >
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern
            id={`grid-pattern-${patternId}`}
            width="40" // Grid cell width
            height="40" // Grid cell height
            patternUnits="userSpaceOnUse"
          >
            {/* Vertical line of the grid cell */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="40"
              className="stroke-[var(--grid-line-color)] opacity-20 dark:opacity-10"
              strokeWidth={strokeWidth}
            />
            {/* Horizontal line of the grid cell */}
            <line
              x1="0"
              y1="0"
              x2="40"
              y2="0"
              className="stroke-[var(--grid-line-color)] opacity-20 dark:opacity-10"
              strokeWidth={strokeWidth}
            />
          </pattern>
        </defs>
        <rect
          width="calc(100% + 40px)" // Make rect larger to allow panning
          height="calc(100% + 40px)"
          x="-20px" // Offset to hide animation edges
          y="-20px"
          fill={`url(#grid-pattern-${patternId})`}
          className="animate-grid-pan"
          style={{ animationDuration: animationDuration } as React.CSSProperties}
        />
      </svg>
      {/* Define CSS variables for line colors based on theme */}
      <style jsx global>{`
        :root { --grid-line-color: ${lineColorLight}; }
        .dark { --grid-line-color: ${lineColorDark}; }

        @keyframes gridPanAnimation {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); } /* Move by one full grid cell */
        }
        .animate-grid-pan {
          animation-name: gridPanAnimation;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};
