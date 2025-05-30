"use client";

/**
 * Simple motion utility for animations.
 * This is a lightweight alternative to framer-motion using CSS transitions.
 */

import React, { HTMLAttributes, useRef, useEffect } from "react";

interface MotionProps extends HTMLAttributes<HTMLDivElement> {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: {
    duration?: number;
    delay?: number;
    [key: string]: any;
  };
  children?: React.ReactNode;
}

export const motion = {
  div: ({
    initial,
    animate,
    transition = { duration: 0.3 },
    style,
    ...props
  }: MotionProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!ref.current) return;
      
      const element = ref.current;
      
      // Apply initial styles
      if (initial) {
        Object.entries(initial).forEach(([key, value]) => {
          element.style[key as any] = value;
        });
      }
      
      // Wait a frame to ensure initial styles are applied
      requestAnimationFrame(() => {
        // Setup transition
        const transitionProperties = Object.keys(animate || {}).join(", ");
        element.style.transition = `${transitionProperties} ${transition.duration}s ease${
          transition.delay ? ` ${transition.delay}s` : ""
        }`;
        
        // Apply animation styles
        if (animate) {
          requestAnimationFrame(() => {
            Object.entries(animate).forEach(([key, value]) => {
              element.style[key as any] = value;
            });
          });
        }
      });
    }, [initial, animate, transition]);

    return (
      <div
        ref={ref}
        style={{
          ...style,
        }}
        {...props}
      />
    );
  },
};