"use client";

import { useEffect, useRef, useState } from "react";

export type RevealType = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale";

const HIDDEN: Record<RevealType, string> = {
  "fade-up": "opacity-0 translate-y-8",
  "fade-in": "opacity-0",
  "slide-left": "opacity-0 -translate-x-10",
  "slide-right": "opacity-0 translate-x-10",
  scale: "opacity-0 scale-95",
};

const VISIBLE = "opacity-100 translate-x-0 translate-y-0 scale-100";

export default function Reveal({
  children,
  type = "fade-up",
  delay = 0,
  duration = 700,
  className = "",
  threshold = 0.15,
}: {
  children: React.ReactNode;
  type?: RevealType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 모션 줄이기 사용자는 즉시 표시
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- matchMedia (외부 시스템) 구독 결과 반영
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            const id = window.setTimeout(() => setVisible(true), delay);
            observer.unobserve(el);
            return () => window.clearTimeout(id);
          }
          setVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className={`transition-all will-change-transform ${visible ? VISIBLE : HIDDEN[type]} ${className}`}
    >
      {children}
    </div>
  );
}
