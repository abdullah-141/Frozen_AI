
"use client";

import { useEffect, useRef } from 'react';

// Define selectors for interactive elements
const interactiveElementSelectors = [
  'a',
  'button',
  '[role="button"]',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'select',
  'textarea',
  'input[type="text"]', // Consider inputs as interactive
  'input[type="email"]',
  'input[type="password"]',
  'input[type="search"]',
  'input[type="tel"]',
  'input[type="url"]',
  '[data-interactive-cursor="true"]' // Custom attribute for explicit interactive elements
];

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mousePositionRef = useRef({ x: -100, y: -100 });
  const targetTextElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const updateCursorPosition = () => {
      if (cursor) {
        cursor.style.left = `${mousePositionRef.current.x}px`;
        cursor.style.top = `${mousePositionRef.current.y}px`;

        const elementMouseIsOver = document.elementFromPoint(mousePositionRef.current.x, mousePositionRef.current.y) as HTMLElement | null;
        const targetTextElement = targetTextElementRef.current;

        // Handle "Frozen Voltage" text color change
        if (targetTextElement) {
          const cursorRect = cursor.getBoundingClientRect();
          const textRect = targetTextElement.getBoundingClientRect();
          const overlaps =
            cursorRect.width > 0 && cursorRect.height > 0 &&
            textRect.width > 0 && textRect.height > 0 &&
            !(
              cursorRect.right < textRect.left ||
              cursorRect.left > textRect.right ||
              cursorRect.bottom < textRect.top ||
              cursorRect.top > textRect.bottom
            );

          if (overlaps) {
            if (!targetTextElement.classList.contains('text-green-500')) {
              targetTextElement.classList.remove('text-primary');
              targetTextElement.classList.add('text-green-500');
            }
          } else {
            if (targetTextElement.classList.contains('text-green-500')) {
              targetTextElement.classList.remove('text-green-500');
              targetTextElement.classList.add('text-primary');
            }
          }
        }

        // Handle cursor style (interactive vs text-hover)
        if (elementMouseIsOver) {
          const isInteractive = interactiveElementSelectors.some(selector => {
            try {
              return elementMouseIsOver.matches(selector);
            } catch (e) {
              // Handle cases where elementMouseIsOver might not be a valid element for matches (e.g. SVG child)
              return false;
            }
          });

          if (isInteractive) {
            cursor.classList.add('interactive');
            cursor.classList.remove('text-hover');
          } else {
            cursor.classList.add('text-hover');
            cursor.classList.remove('interactive');
          }
        } else {
          // Not over any specific element (e.g., body background)
          cursor.classList.remove('interactive');
          cursor.classList.remove('text-hover');
        }
      }
      animationFrameRef.current = requestAnimationFrame(updateCursorPosition);
    };

    const onMouseEnterBody = () => {
      cursor.classList.add('visible');
      if (!targetTextElementRef.current) { // Attempt to find target element if not found yet
          targetTextElementRef.current = document.getElementById('interactive-hero-title');
      }
    };

    const onMouseLeaveBody = () => {
      cursor.classList.remove('visible');
    };
    
    // Initial attempt to find the target element
    targetTextElementRef.current = document.getElementById('interactive-hero-title');

    window.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseenter', onMouseEnterBody);
    document.body.addEventListener('mouseleave', onMouseLeaveBody);

    animationFrameRef.current = requestAnimationFrame(updateCursorPosition);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseenter', onMouseEnterBody);
      document.body.removeEventListener('mouseleave', onMouseLeaveBody);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Reset target text element style on unmount
      const targetText = targetTextElementRef.current;
      if (targetText && targetText.classList.contains('text-green-500')) {
        targetText.classList.remove('text-green-500');
        targetText.classList.add('text-primary');
      }
    };
  }, []);

  return <div id="custom-cursor" ref={cursorRef}></div>;
}
