import React from 'react';
import { MediaItem, ThemeConfig } from '@recuerdos-qr/shared';
import { resolveMediaUrl } from '../../../services/api';

interface MemorySceneProps {
  currentPhoto: MediaItem;
  prevPhoto: MediaItem | null;
  nextPhoto: MediaItem | null;
  dragOffsetX: number;
  isDragging: boolean;
  isAnimating: boolean;
  theme?: ThemeConfig;
}

export const MemoryScene: React.FC<MemorySceneProps> = ({
  currentPhoto,
  prevPhoto,
  nextPhoto,
  dragOffsetX,
  isDragging,
  isAnimating,
  theme,
}) => {
  const isLandscape = (currentPhoto.width && currentPhoto.height && currentPhoto.width > currentPhoto.height) || false;
  const rotationDeg = dragOffsetX * -0.015; // Subtle tilt proportional to drag
  const absDrag = Math.abs(dragOffsetX);
  const dragRatio = Math.min(absDrag / 300, 1);
  const activeScale = 1 - dragRatio * 0.08;
  const activeOpacity = 1 - dragRatio * 0.7;
  const activeBlur = dragRatio * 4;

  const isScrapbook = theme?.id === 'friendship_fun';
  const isPolaroid = theme?.id === 'polaroid';
  const isBW = currentPhoto.is_bw;

  const currentUrl = resolveMediaUrl(currentPhoto.public_url);
  const prevUrl = prevPhoto ? resolveMediaUrl(prevPhoto.public_url) : '';
  const nextUrl = nextPhoto ? resolveMediaUrl(nextPhoto.public_url) : '';

  return (
    <div className="relative w-full max-w-[900px] h-[480px] sm:h-[560px] mx-auto flex items-center justify-center select-none overflow-hidden touch-pan-y">
      {/* ─── PREVIOUS PHOTO (Left Insinuation) ─── */}
      {prevPhoto && (
        <div
          className="absolute z-10 w-[260px] sm:w-[340px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl pointer-events-none transition-all duration-500 ease-out border"
          style={{
            transform: `translateX(calc(-100% - 20px + ${dragOffsetX * 0.5}px)) scale(0.88)`,
            opacity: 0.45 + (dragOffsetX > 0 ? dragRatio * 0.4 : 0),
            filter: 'blur(3px)',
            borderColor: theme?.cardBorder || 'rgba(255,255,255,0.15)',
            background: theme?.cardBg || 'rgba(0,0,0,0.5)',
          }}
        >
          <img src={prevUrl} alt="" aria-hidden="true" className="w-full h-full object-cover" />
        </div>
      )}

      {/* ─── ACTIVE PHOTO (Center Stage) ─── */}
      <div
        className={`relative z-20 w-[88%] sm:w-[480px] aspect-[4/5] sm:aspect-[3/4] max-h-[520px] flex flex-col items-center justify-center p-3 sm:p-4 rounded-[32px] border shadow-2xl overflow-hidden transition-transform duration-300 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isScrapbook || isPolaroid ? 'bg-white text-slate-800 border-white' : 'backdrop-blur-2xl'}`}
        style={{
          transform: `translateX(${dragOffsetX}px) rotate(${rotationDeg}deg) scale(${activeScale})`,
          opacity: activeOpacity,
          filter: `blur(${activeBlur}px)`,
          transition: isDragging ? 'none' : 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease, filter 0.4s ease',
          background: isScrapbook || isPolaroid ? '#ffffff' : theme?.cardBg || 'rgba(18, 8, 22, 0.88)',
          borderColor: isScrapbook || isPolaroid ? '#ffffff' : theme?.cardBorder || 'rgba(255,255,255,0.2)',
          boxShadow: isScrapbook || isPolaroid ? '0 25px 60px rgba(0,0,0,0.4)' : theme?.cardShadow || '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Landscape Blurred Background Overlay */}
        {isLandscape && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={currentUrl}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover blur-2xl opacity-40 scale-125"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}

        {/* Main Photo Frame */}
        <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center">
          <img
            src={currentUrl}
            alt={currentPhoto.caption || 'Fotografía de recuerdo'}
            className={`w-full h-full ${isLandscape ? 'object-contain' : 'object-cover'} transition-all duration-500 ${
              isBW ? 'filter grayscale contrast-110' : ''
            }`}
          />
        </div>
      </div>

      {/* ─── NEXT PHOTO (Right Insinuation) ─── */}
      {nextPhoto && (
        <div
          className="absolute z-10 w-[260px] sm:w-[340px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl pointer-events-none transition-all duration-500 ease-out border"
          style={{
            transform: `translateX(calc(100% + 20px + ${dragOffsetX * 0.5}px)) scale(0.88)`,
            opacity: 0.45 + (dragOffsetX < 0 ? dragRatio * 0.4 : 0),
            filter: 'blur(3px)',
            borderColor: theme?.cardBorder || 'rgba(255,255,255,0.15)',
            background: theme?.cardBg || 'rgba(0,0,0,0.5)',
          }}
        >
          <img src={nextUrl} alt="" aria-hidden="true" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};
