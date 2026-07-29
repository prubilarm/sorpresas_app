import React, { useRef, useEffect } from 'react';
import { MediaItem, ThemeConfig, PhotoFrameVariant } from '@recuerdos-qr/shared';
import { useMemoryNavigation } from '../../../hooks/useMemoryNavigation';
import { useAutoplay } from '../../../hooks/useAutoplay';
import { MemorySlide } from './MemorySlide';
import { MemoryProgress } from './MemoryProgress';

interface MemoryStoryGalleryProps {
  photos: MediaItem[];
  title?: string;
  subtitle?: string;
  frameVariant?: PhotoFrameVariant;
  tiltEffect?: boolean;
  theme?: ThemeConfig;
  autoplayMode?: 'auto_and_manual' | 'manual_only';
  isAdminPreview?: boolean;
}

export const MemoryStoryGallery: React.FC<MemoryStoryGalleryProps> = ({
  photos,
  title,
  subtitle,
  frameVariant,
  tiltEffect,
  theme,
  autoplayMode = 'auto_and_manual',
  isAdminPreview = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalPhotos = photos.length;

  const {
    currentIndex,
    dragOffsetY,
    isDragging,
    isAnimating,
    next,
    prev,
    touchHandlers,
    handleWheel,
  } = useMemoryNavigation({
    totalPhotos,
    thresholdRatio: 0.2,
    snapDurationMs: 600,
  });

  const { isPaused, setIsPaused, pauseTemporarily } = useAutoplay({
    enabled: autoplayMode === 'auto_and_manual',
    intervalMs: 3800,
    totalPhotos,
    currentIndex,
    onNext: next,
    containerRef: containerRef as React.RefObject<HTMLElement>,
  });

  // Attach native wheel & keyboard event listeners to avoid passive preventDefault warnings
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const wheelHandler = (e: WheelEvent) => {
      handleWheel(e);
      pauseTemporarily();
    };

    el.addEventListener('wheel', wheelHandler, { passive: false });
    return () => el.removeEventListener('wheel', wheelHandler);
  }, [handleWheel, pauseTemporarily]);

  // Keyboard Navigation when gallery is in viewport
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (currentIndex < totalPhotos - 1) {
          e.preventDefault();
          next();
          pauseTemporarily();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (currentIndex > 0) {
          e.preventDefault();
          prev();
          pauseTemporarily();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalPhotos, next, prev, pauseTemporarily]);

  if (!photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];
  const nextPhoto = currentIndex < totalPhotos - 1 ? photos[currentIndex + 1] : null;
  const prevPhoto = currentIndex > 0 ? photos[currentIndex - 1] : null;

  return (
    <section
      ref={containerRef}
      id="fotos"
      {...touchHandlers}
      className={`relative w-full overflow-hidden select-none touch-pan-y ${
        isAdminPreview
          ? 'h-[620px] rounded-3xl border border-slate-700/80 my-4'
          : 'min-h-[100svh] h-[100svh] my-0'
      }`}
      style={{
        background: theme?.bgGradient || 'radial-gradient(ellipse at 50% 0%, #1e0a28 0%, #0a0410 100%)',
      }}
    >
      {/* ─── SECTION TITLE ─── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
        <span
          className="uppercase tracking-widest text-[10px] font-bold block"
          style={{ color: theme?.kickerColor || '#d8b4fe' }}
        >
          Secuencia de recuerdos
        </span>
        <h2
          className="text-2xl sm:text-3xl font-serif script-title mt-0.5"
          style={{ color: theme?.titleColor || '#ff83b6', fontFamily: theme?.fontTitle }}
        >
          Nuestra historia
        </h2>
      </div>

      {/* ─── VERTICAL SLIDE STAGE ─── */}
      <div className="relative w-full h-full flex items-center justify-center">

        {/* 1. PREVIOUS SLIDE (Emerged from Above when dragging down) */}
        {prevPhoto && dragOffsetY > 0 && (
          <div
            className="absolute inset-0 w-full h-full z-20 pointer-events-none"
            style={{
              transform: `translateY(${-100 + (dragOffsetY / (containerRef.current?.clientHeight || 700)) * 100}%)`,
              transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <MemorySlide
              photo={prevPhoto}
              index={currentIndex - 1}
              total={totalPhotos}
              captionVisible={true}
              theme={theme}
            />
          </div>
        )}

        {/* 2. CURRENT SLIDE (Active) */}
        <div
          className="absolute inset-0 w-full h-full z-10"
          style={{
            transform: `translateY(${dragOffsetY}px)`,
            opacity: 1 - Math.abs(dragOffsetY) / ((containerRef.current?.clientHeight || 700) * 1.5),
            scale: 1 - (Math.abs(dragOffsetY) / (containerRef.current?.clientHeight || 700)) * 0.04,
            transition: isDragging ? 'none' : 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <MemorySlide
            photo={currentPhoto}
            index={currentIndex}
            total={totalPhotos}
            captionVisible={!isDragging && !isAnimating}
            theme={theme}
          />
        </div>

        {/* 3. NEXT SLIDE (Entering from Below when dragging up) */}
        {nextPhoto && dragOffsetY < 0 && (
          <div
            className="absolute inset-0 w-full h-full z-20 pointer-events-none"
            style={{
              transform: `translateY(${100 + (dragOffsetY / (containerRef.current?.clientHeight || 700)) * 100}%)`,
              transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <MemorySlide
              photo={nextPhoto}
              index={currentIndex + 1}
              total={totalPhotos}
              captionVisible={true}
              theme={theme}
            />
          </div>
        )}
      </div>

      {/* ─── PROGRESS BADGE & CONTROLS ─── */}
      <MemoryProgress
        currentIndex={currentIndex}
        totalPhotos={totalPhotos}
        isPaused={isPaused}
        autoplayEnabled={autoplayMode === 'auto_and_manual'}
        onTogglePause={() => setIsPaused((prev: boolean) => !prev)}
      />
    </section>
  );
};
