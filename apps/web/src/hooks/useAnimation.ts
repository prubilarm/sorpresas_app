import React, { useEffect, useRef, useState } from 'react';

/**
 * Returns true once the element has entered the viewport.
 * Once visible it stays visible (no toggle back).
 */
export function useInView(threshold = 0.18): [React.RefObject<HTMLElement>, boolean] {
  const ref = useRef<HTMLElement>(null as any);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/**
 * Animates a number from 0 → target over `duration` ms using easeOut.
 * Only starts when `active` becomes true.
 */
export function useCountUp(target: number, duration = 1400, active = false): number {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current || isNaN(target)) return;
    started.current = true;
    if (target === 0) return;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [active, target, duration]);

  return count;
}
