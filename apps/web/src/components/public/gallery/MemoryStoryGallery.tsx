import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MediaItem, ThemeConfig, PhotoFrameVariant } from '@recuerdos-qr/shared';
import { resolveMediaUrl } from '../../../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '../../../hooks/useAnimation';

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
  const [ref, visible] = useInView(0.05);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = photos.length;
  const accentColor = theme?.accentColor || '#ec4899';

  const goTo = useCallback(
    (index: number, skipAnim = false) => {
      if (index < 0 || index >= total || isAnimating) return;
      if (!skipAnim) setIsAnimating(true);
      setCurrentIndex(index);
      setDragOffset(0);
      if (!skipAnim) setTimeout(() => setIsAnimating(false), 500);
    },
    [total, isAnimating]
  );

  const next = useCallback(() => {
    if (currentIndex < total - 1) goTo(currentIndex + 1);
  }, [currentIndex, total, goTo]);

  const prev = useCallback(() => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  // Autoplay
  useEffect(() => {
    if (autoplayMode !== 'auto_and_manual') return;
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((i) => {
        const next = (i + 1) % total;
        return next;
      });
    }, 4000);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [autoplayMode, total]);

  const pauseAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  // Touch / mouse drag handlers
  const handleDragStart = useCallback((clientX: number) => {
    if (isAnimating) return;
    setIsDragging(true);
    setDragStartX(clientX);
    setDragOffset(0);
    pauseAutoplay();
  }, [isAnimating]);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const delta = clientX - dragStartX;
    // Resist at boundaries
    if ((currentIndex === 0 && delta > 0) || (currentIndex === total - 1 && delta < 0)) {
      setDragOffset(delta * 0.2); // rubberbanding
    } else {
      setDragOffset(delta);
    }
  }, [isDragging, dragStartX, currentIndex, total]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const containerW = containerRef.current?.clientWidth || 360;
    const threshold = containerW * 0.22;
    const velocity = Math.abs(dragOffset) / Math.max(1, containerW);

    if (dragOffset < -threshold || (dragOffset < -30 && velocity > 0.15)) {
      next();
    } else if (dragOffset > threshold || (dragOffset > 30 && velocity > 0.15)) {
      prev();
    } else {
      setIsAnimating(true);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 400);
    }
  }, [isDragging, dragOffset, next, prev]);

  if (!photos || photos.length === 0) return null;

  return (
    <section
      id="fotos"
      ref={ref as React.RefObject<HTMLElement>}
      className="w-full max-w-[780px] mx-auto py-10 px-4"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <span
          className={`reveal ${visible ? 'is-visible' : ''} uppercase tracking-widest text-xs font-bold block mb-2`}
          style={{ color: theme?.kickerColor || '#ffd7e8' }}
        >
          Momentos juntos
        </span>
        <h2
          className={`reveal reveal-delay-1 ${visible ? 'is-visible' : ''} text-4xl sm:text-5xl font-serif script-title shimmer-text`}
          style={{ color: theme?.titleColor || '#ff83b6', fontFamily: theme?.fontTitle }}
        >
          {title || 'Nuestra galería'}
        </h2>
        {subtitle && (
          <p className={`reveal reveal-delay-2 ${visible ? 'is-visible' : ''} text-sm opacity-60 mt-2`}
            style={{ color: theme?.textColor }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Gallery carousel container */}
      <div
        ref={containerRef}
        className={`reveal-scale ${visible ? 'is-visible' : ''} relative w-full select-none overflow-hidden rounded-3xl`}
        style={{
          aspectRatio: isAdminPreview ? '4/3' : '4/5',
          background: theme?.bgGradient || 'radial-gradient(ellipse, #1e0a28 0%, #0a0410 100%)',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'pan-y',
        }}
        // Touch events
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        // Mouse events
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => { if (isDragging) handleDragMove(e.clientX); }}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Photo slides */}
        {photos.map((photo, idx) => {
          const offset = idx - currentIndex;
          const resolvedSrc = resolveMediaUrl(photo.public_url || photo.storage_path);

          // Only render current ± 1 for perf
          if (Math.abs(offset) > 1) return null;

          const translateX = (offset * 100) + (dragOffset / (containerRef.current?.clientWidth || 360)) * 100;
          const scale = offset === 0 ? 1 - Math.abs(dragOffset) / (containerRef.current?.clientWidth || 360) * 0.05 : 0.94;
          const opacity = offset === 0 ? 1 : 0.5 + (1 - Math.abs(translateX) / 100) * 0.5;

          return (
            <div
              key={photo.id || idx}
              className="absolute inset-0 w-full h-full"
              style={{
                transform: `translateX(${translateX}%) scale(${scale})`,
                opacity,
                transition: isDragging
                  ? 'none'
                  : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease, scale 0.45s ease',
                zIndex: offset === 0 ? 10 : 5,
              }}
            >
              <img
                src={resolvedSrc}
                alt={`Foto ${idx + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
              />

              {/* Gradient overlay at bottom */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                }}
              />

              {/* Caption */}
              {offset === 0 && (photo as any).caption && (
                <div className="absolute bottom-14 inset-x-0 text-center px-6 pointer-events-none">
                  <p className="text-white text-sm font-serif italic opacity-90 drop-shadow-md">
                    {(photo as any).caption}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Left/Right nav buttons — visible on desktop */}
        {currentIndex > 0 && (
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110 active:scale-95 hidden sm:flex"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', border: `1px solid ${accentColor}44` }}
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}
        {currentIndex < total - 1 && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110 active:scale-95 hidden sm:flex"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', border: `1px solid ${accentColor}44` }}
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Dot indicators */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-none">
          {photos.map((_, idx) => (
            <div
              key={idx}
              className="rounded-full transition-all duration-300"
              style={{
                width: idx === currentIndex ? '20px' : '6px',
                height: '6px',
                backgroundColor: idx === currentIndex ? accentColor : 'rgba(255,255,255,0.4)',
                boxShadow: idx === currentIndex ? `0 0 8px ${accentColor}` : 'none',
              }}
            />
          ))}
        </div>

        {/* Counter badge */}
        <div
          className="absolute top-4 right-4 z-20 py-1 px-3 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', color: 'rgba(255,255,255,0.85)' }}
        >
          {currentIndex + 1} / {total}
        </div>
      </div>

      {/* Swipe hint — mobile only, visible briefly */}
      <p className="text-center text-xs opacity-40 mt-3 sm:hidden" style={{ color: theme?.textColor || '#fff' }}>
        ← desliza para ver más →
      </p>
    </section>
  );
};
