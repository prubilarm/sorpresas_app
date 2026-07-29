import React, { useEffect, useRef, useState } from 'react';

interface UseAutoplayOptions {
  enabled: boolean;
  intervalMs?: number; // Default 3600ms
  totalPhotos: number;
  currentIndex: number;
  onNext: () => void;
  containerRef: React.RefObject<HTMLElement>;
}

export function useAutoplay({
  enabled,
  intervalMs = 3600,
  totalPhotos,
  currentIndex,
  onNext,
  containerRef,
}: UseAutoplayOptions) {
  const [isPaused, setIsPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const isVisibleInViewport = useRef(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Observer to pause if container is offscreen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleInViewport.current = entry.isIntersecting;
      },
      { threshold: 0.3 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef]);

  // Autoplay loop
  useEffect(() => {
    if (!enabled || isPaused || isUserInteracting || totalPhotos <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (!isVisibleInViewport.current || document.hidden) return;
      onNext();
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enabled, isPaused, isUserInteracting, totalPhotos, intervalMs, onNext]);

  const pauseTemporarily = (durationMs = 4000) => {
    setIsUserInteracting(true);
    setTimeout(() => setIsUserInteracting(false), durationMs);
  };

  return {
    isPaused,
    setIsPaused,
    pauseTemporarily,
  };
}
