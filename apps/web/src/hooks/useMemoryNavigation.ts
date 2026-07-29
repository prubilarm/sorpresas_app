import React, { useState, useRef, useEffect, useCallback } from 'react';

interface UseMemoryNavigationOptions {
  totalPhotos: number;
  thresholdRatio?: number; // Default 0.22 (22% of height)
  snapDurationMs?: number; // Default 600ms
}

export function useMemoryNavigation({
  totalPhotos,
  thresholdRatio = 0.22,
  snapDurationMs = 600,
}: UseMemoryNavigationOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const startY = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const currentDragRef = useRef<number>(0);
  const wheelLockTimer = useRef<NodeJS.Timeout | null>(null);

  // Keep ref up to date for event listeners
  currentDragRef.current = dragOffsetY;

  const goTo = useCallback(
    (target: number) => {
      if (target < 0 || target >= totalPhotos || isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(target);
      setDragOffsetY(0);

      setTimeout(() => {
        setIsAnimating(false);
      }, snapDurationMs);
    },
    [totalPhotos, isAnimating, snapDurationMs]
  );

  const next = useCallback(() => {
    if (currentIndex < totalPhotos - 1) {
      goTo(currentIndex + 1);
    }
  }, [currentIndex, totalPhotos, goTo]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      goTo(currentIndex - 1);
    }
  }, [currentIndex, goTo]);

  /* ─── Touch Handlers with real-time tracking & clean scroll escape ─── */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      if (totalPhotos <= 1 || isAnimating) return;
      startY.current = e.touches[0].clientY;
      startTime.current = performance.now();
      setIsDragging(true);
    },
    [totalPhotos, isAnimating]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      if (startY.current === null || isAnimating) return;

      const deltaY = e.touches[0].clientY - startY.current;

      // Escape top boundary: if at 1st photo and dragging downwards, let page scroll up natively
      if (currentIndex === 0 && deltaY > 0) {
        setDragOffsetY(0);
        return;
      }

      // Escape bottom boundary: if at last photo and dragging upwards, let page scroll down natively
      if (currentIndex === totalPhotos - 1 && deltaY < 0) {
        setDragOffsetY(0);
        return;
      }

      setDragOffsetY(deltaY);
    },
    [currentIndex, totalPhotos, isAnimating]
  );

  const handleTouchEnd = useCallback(() => {
    if (startY.current === null || isAnimating) return;

    const deltaY = currentDragRef.current;
    const elapsed = performance.now() - startTime.current;
    const screenH = window.innerHeight || 700;
    const threshold = screenH * thresholdRatio;
    const velocity = Math.abs(deltaY) / Math.max(elapsed, 1); // px per ms

    setIsDragging(false);
    startY.current = null;

    // Check threshold or fast flick
    if (deltaY < -threshold || (deltaY < -40 && velocity > 0.4)) {
      // Drag Up -> Next Photo
      if (currentIndex < totalPhotos - 1) {
        next();
      } else {
        setDragOffsetY(0);
      }
    } else if (deltaY > threshold || (deltaY > 40 && velocity > 0.4)) {
      // Drag Down -> Prev Photo
      if (currentIndex > 0) {
        prev();
      } else {
        setDragOffsetY(0);
      }
    } else {
      // Spring back to current slide
      setDragOffsetY(0);
    }
  }, [currentIndex, totalPhotos, thresholdRatio, isAnimating, next, prev]);

  /* ─── Wheel & Keyboard handlers ─── */
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (totalPhotos <= 1 || isAnimating || wheelLockTimer.current) return;

      // Allow page to scroll natively at top or bottom boundary
      if (currentIndex === 0 && e.deltaY < 0) return;
      if (currentIndex === totalPhotos - 1 && e.deltaY > 0) return;

      if (Math.abs(e.deltaY) > 20) {
        e.preventDefault();
        if (e.deltaY > 0) {
          next();
        } else {
          prev();
        }

        wheelLockTimer.current = setTimeout(() => {
          wheelLockTimer.current = null;
        }, snapDurationMs + 100);
      }
    },
    [currentIndex, totalPhotos, isAnimating, snapDurationMs, next, prev]
  );

  return {
    currentIndex,
    dragOffsetY,
    isDragging,
    isAnimating,
    goTo,
    next,
    prev,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    handleWheel,
  };
}
