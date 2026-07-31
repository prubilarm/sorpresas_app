import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MediaItem, ThemeConfig, PhotoFrameVariant } from '@recuerdos-qr/shared';
import { useSwipeHorizontal } from '../../../hooks/useSwipeHorizontal';
import { useAutoplay } from '../../../hooks/useAutoplay';
import { MemoryBackground } from './MemoryBackground';
import { MemoryScene } from './MemoryScene';
import { MemoryAnimatedText } from './MemoryAnimatedText';
import { MemoryProgress } from './MemoryProgress';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CinematicMemoryGalleryProps {
  photos: MediaItem[];
  title?: string;
  subtitle?: string;
  frameVariant?: PhotoFrameVariant;
  tiltEffect?: boolean;
  theme?: ThemeConfig;
  autoplayMode?: 'auto_and_manual' | 'manual_only';
  isAdminPreview?: boolean;
  captureMode?: boolean;
}

export const CinematicMemoryGallery: React.FC<CinematicMemoryGalleryProps> = ({
  photos = [],
  title = 'Nuestros Recuerdos',
  subtitle = 'Desliza hacia los lados para revivir cada momento',
  theme,
  autoplayMode = 'auto_and_manual',
  captureMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalPhotos = photos.length;
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetControlsTimer = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 2500);
  }, []);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [resetControlsTimer]);

  const {
    currentIndex,
    dragOffsetX,
    isDragging,
    isAnimating,
    next,
    prev,
    gestureHandlers,
  } = useSwipeHorizontal({
    totalItems: totalPhotos,
    thresholdRatio: 0.2,
    thresholdPx: 80,
    snapDurationMs: 700,
  });

  const { isPaused, pauseTemporarily } = useAutoplay({
    enabled: autoplayMode === 'auto_and_manual',
    intervalMs: 5500,
    totalPhotos,
    currentIndex,
    onNext: next,
    containerRef: containerRef as React.RefObject<HTMLElement>,
  });

  // Reset timer on slide change
  useEffect(() => {
    resetControlsTimer();
  }, [currentIndex, resetControlsTimer]);

  // Keyboard Left / Right Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        next();
        pauseTemporarily();
        resetControlsTimer();
      } else if (e.key === 'ArrowLeft') {
        prev();
        pauseTemporarily();
        resetControlsTimer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev, pauseTemporarily, resetControlsTimer]);

  // Capture mode: expose gallery controller to Playwright via window globals
  useEffect(() => {
    if (!captureMode) return;

    const controller = {
      next,
      prev,
      getCurrentIndex: () => currentIndex,
      getTotalPhotos: () => totalPhotos,
    };

    (window as any).__galleryController = controller;
    (window as any).__galleryCurrentIndex = currentIndex;
    (window as any).__galleryTotalPhotos = totalPhotos;

    const handleCaptureNext = () => {
      next();
    };
    window.addEventListener('captureGalleryNext', handleCaptureNext);

    return () => {
      window.removeEventListener('captureGalleryNext', handleCaptureNext);
    };
  }, [captureMode, next, prev, currentIndex, totalPhotos]);

  // Sync currentIndex to window globals so Playwright can read it
  useEffect(() => {
    if (!captureMode) return;
    (window as any).__galleryCurrentIndex = currentIndex;
  }, [captureMode, currentIndex]);

  if (!photos || totalPhotos === 0) return null;

  const currentPhoto = photos[currentIndex];
  const prevPhoto = currentIndex > 0 ? photos[currentIndex - 1] : null;
  const nextPhoto = currentIndex < totalPhotos - 1 ? photos[currentIndex + 1] : null;

  return (
    <section
      ref={containerRef}
      id="fotos"
      className="relative w-full max-w-[920px] mx-auto py-12 px-4 text-center select-none overflow-hidden"
      onMouseMove={resetControlsTimer}
      onTouchStart={resetControlsTimer}
      {...gestureHandlers}
    >
      {/* Dynamic Ambient Background */}
      <MemoryBackground currentPhoto={currentPhoto} theme={theme} />

      {/* Gallery Section Header */}
      <div className="relative z-20 mb-6 space-y-1">
        <span
          className="uppercase tracking-[0.2em] text-xs font-bold block"
          style={{ color: theme?.kickerColor || '#ffd7e8' }}
        >
          {title}
        </span>
        <h2
          className="text-3xl sm:text-5xl font-serif script-title leading-tight"
          style={{ color: theme?.titleColor || '#ffffff', fontFamily: theme?.fontTitle || 'Georgia, serif' }}
        >
          {subtitle}
        </h2>
      </div>

      {/* Discrete Progress Bar (e.g. 03 / 12) */}
      <div className="relative z-20 mb-4">
        <MemoryProgress current={currentIndex + 1} total={totalPhotos} theme={theme} />
      </div>

      {/* Center 3D Stage Scene */}
      <div className="relative z-20">
        {/* Discrete Desktop Outer Left/Right Control Buttons with Auto-Hide */}
        {!captureMode && (
          <div
            className={`hidden sm:flex absolute inset-y-0 inset-x-0 z-40 items-center justify-between pointer-events-none transition-all duration-500 ${
              controlsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            {currentIndex > 0 ? (
              <button
                type="button"
                onClick={() => {
                  prev();
                  pauseTemporarily();
                  resetControlsTimer();
                }}
                className="pointer-events-auto p-3.5 rounded-full bg-black/45 hover:bg-black/80 border border-white/25 text-white shadow-2xl transition backdrop-blur-md active:scale-95 cursor-pointer ml-1 sm:ml-2 hover:scale-110"
                title="Foto anterior (Flecha Izquierda)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            ) : (
              <div />
            )}

            {currentIndex < totalPhotos - 1 ? (
              <button
                type="button"
                onClick={() => {
                  next();
                  pauseTemporarily();
                  resetControlsTimer();
                }}
                className="pointer-events-auto p-3.5 rounded-full bg-black/45 hover:bg-black/80 border border-white/25 text-white shadow-2xl transition backdrop-blur-md active:scale-95 cursor-pointer mr-1 sm:mr-2 hover:scale-110"
                title="Siguiente foto (Flecha Derecha)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            ) : (
              <div />
            )}
          </div>
        )}

        <MemoryScene
          currentPhoto={currentPhoto}
          prevPhoto={prevPhoto}
          nextPhoto={nextPhoto}
          dragOffsetX={dragOffsetX}
          isDragging={isDragging}
          isAnimating={isAnimating}
          theme={theme}
          onNext={next}
        />
      </div>

      {/* Staggered Word-by-Word Animated Caption Text */}
      <MemoryAnimatedText photo={currentPhoto} theme={theme} />
    </section>
  );
};
