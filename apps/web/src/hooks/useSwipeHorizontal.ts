import React, { useState, useRef, useCallback, useEffect } from 'react';

interface UseSwipeHorizontalOptions {
  totalItems: number;
  thresholdRatio?: number; // Default 0.20 (20% of container width)
  thresholdPx?: number; // Default 80px
  snapDurationMs?: number; // Default 700ms
}

export function useSwipeHorizontal({
  totalItems,
  thresholdRatio = 0.2,
  thresholdPx = 80,
  snapDurationMs = 700,
}: UseSwipeHorizontalOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const startX = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const currentDragRef = useRef<number>(0);
  const isMouseDownRef = useRef<boolean>(false);

  currentDragRef.current = dragOffsetX;

  const goTo = useCallback(
    (target: number) => {
      if (target < 0 || target >= totalItems || isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(target);
      setDragOffsetY(0);

      setTimeout(() => {
        setIsAnimating(false);
      }, snapDurationMs);
    },
    [totalItems, isAnimating, snapDurationMs]
  );

  const setDragOffsetY = (val: number) => setDragOffsetX(val);

  const next = useCallback(() => {
    if (currentIndex < totalItems - 1) {
      goTo(currentIndex + 1);
    } else {
      setDragOffsetX(0);
    }
  }, [currentIndex, totalItems, goTo]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      goTo(currentIndex - 1);
    } else {
      setDragOffsetX(0);
    }
  }, [currentIndex, goTo]);

  // Touch Handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      if (totalItems <= 1 || isAnimating) return;
      startX.current = e.touches[0].clientX;
      startTime.current = performance.now();
      setIsDragging(true);
    },
    [totalItems, isAnimating]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      if (startX.current === null || isAnimating) return;
      const deltaX = e.touches[0].clientX - startX.current;

      // Boundary resistance
      if (currentIndex === 0 && deltaX > 0) {
        setDragOffsetX(deltaX * 0.3);
        return;
      }
      if (currentIndex === totalItems - 1 && deltaX < 0) {
        setDragOffsetX(deltaX * 0.3);
        return;
      }

      setDragOffsetX(deltaX);
    },
    [currentIndex, totalItems, isAnimating]
  );

  const handleTouchEnd = useCallback(() => {
    if (startX.current === null || isAnimating) return;

    const deltaX = currentDragRef.current;
    const elapsed = Math.max(performance.now() - startTime.current, 1);
    const velocity = Math.abs(deltaX) / elapsed;
    const effectiveThreshold = 45; // 45px threshold for light, natural swipes

    setIsDragging(false);
    startX.current = null;

    if (deltaX < -effectiveThreshold || (deltaX < -25 && velocity > 0.20)) {
      // Swipe Left -> Next Item
      next();
    } else if (deltaX > effectiveThreshold || (deltaX > 25 && velocity > 0.20)) {
      // Swipe Right -> Prev Item
      prev();
    } else {
      setDragOffsetX(0);
    }
  }, [currentIndex, thresholdRatio, thresholdPx, isAnimating, next, prev]);

  // Mouse Handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (totalItems <= 1 || isAnimating) return;
      isMouseDownRef.current = true;
      startX.current = e.clientX;
      startTime.current = performance.now();
      setIsDragging(true);
    },
    [totalItems, isAnimating]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isMouseDownRef.current || startX.current === null || isAnimating) return;
      const deltaX = e.clientX - startX.current;

      if (currentIndex === 0 && deltaX > 0) {
        setDragOffsetX(deltaX * 0.3);
        return;
      }
      if (currentIndex === totalItems - 1 && deltaX < 0) {
        setDragOffsetX(deltaX * 0.3);
        return;
      }

      setDragOffsetX(deltaX);
    },
    [currentIndex, totalItems, isAnimating]
  );

  const handleMouseUp = useCallback(() => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    handleTouchEnd();
  }, [handleTouchEnd]);

  return {
    currentIndex,
    dragOffsetX,
    isDragging,
    isAnimating,
    goTo,
    next,
    prev,
    gestureHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };
}
