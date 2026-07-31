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

const isMediaVideo = (item?: MediaItem | null, url?: string) => {
  if (!item && !url) return false;
  if (item?.media_type === 'video') return true;
  const targetUrl = url || item?.public_url || '';
  return /\.(mp4|webm|mov|m4v|ogv)$/i.test(targetUrl.split('?')[0]);
};

export const MemoryScene: React.FC<MemorySceneProps> = ({
  currentPhoto,
  prevPhoto,
  nextPhoto,
  dragOffsetX,
  isDragging,
  isAnimating,
  theme,
}) => {
  const isBW = (currentPhoto as any)?.is_bw;
  const currentUrl = resolveMediaUrl(currentPhoto.public_url);
  const prevUrl = prevPhoto ? resolveMediaUrl(prevPhoto.public_url) : '';
  const nextUrl = nextPhoto ? resolveMediaUrl(nextPhoto.public_url) : '';

  // Drag ratio normalized (-1 to 1) for scaling, rotation & opacities
  const dragRatio = Math.max(-1, Math.min(1, dragOffsetX / 300));
  
  // Ultra-smooth liquid spring curve (Apple iOS Photos / Instagram style)
  const transition = isDragging
    ? 'none'
    : 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 450ms cubic-bezier(0.16, 1, 0.3, 1), filter 450ms ease';

  const baseCard =
    'absolute top-0 w-full max-w-[340px] sm:max-w-[420px] h-[410px] sm:h-[450px] rounded-3xl overflow-hidden border flex flex-col justify-between shadow-2xl backdrop-blur-2xl transition-all';

  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden py-4 select-none"
      style={{ height: '460px', touchAction: 'pan-y', perspective: '1200px' }}
    >
      {/* ── PREVIOUS slide — peeks in from the LEFT ── */}
      {prevPhoto && (
        <div
          className={`${baseCard} left-1/2`}
          style={{
            transform: `translateX(calc(-50% - 105% + ${dragOffsetX}px)) scale(${0.88 + Math.max(0, dragRatio) * 0.12}) rotate(${-5 + dragRatio * 5}deg)`,
            opacity: 0.4 + Math.max(0, dragRatio) * 0.6,
            transition,
            borderColor: theme?.cardBorder || 'rgba(255,255,255,0.15)',
            background: theme?.cardBg || 'rgba(10,4,18,0.88)',
            zIndex: dragOffsetX > 0 ? 15 : 5,
          }}
        >
          {isMediaVideo(prevPhoto, prevUrl) ? (
            <video src={prevUrl} autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <img
              src={prevUrl}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              draggable={false}
            />
          )}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </div>
      )}

      {/* ── CURRENT slide — center stage with liquid physics ── */}
      <div
        className={`${baseCard} left-1/2`}
        style={{
          transform: `translateX(calc(-50% + ${dragOffsetX}px)) scale(${1 - Math.abs(dragRatio) * 0.06}) rotate(${dragRatio * -3}deg)`,
          opacity: 1 - Math.abs(dragRatio) * 0.2,
          transition,
          borderColor: theme?.cardBorder || 'rgba(255,255,255,0.25)',
          background: theme?.cardBg || 'rgba(12,5,20,0.95)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.8), 0 0 40px rgba(236,72,153,0.15)',
          zIndex: 20,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Ambient blurred background glow layer — fills all surrounding space with video colors so ZERO black bars exist */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {isMediaVideo(currentPhoto, currentUrl) ? (
            <video
              src={currentUrl}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover blur-3xl opacity-75 scale-150 saturate-150 brightness-110"
            />
          ) : (
            <img
              src={currentUrl}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover blur-3xl opacity-75 scale-150 saturate-150 brightness-110"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Main photo / video — 100% of video visible (object-contain) with zero black bars thanks to glowing background */}
        <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden flex items-center justify-center p-1">
          {isMediaVideo(currentPhoto, currentUrl) ? (
            <video
              src={currentUrl}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-500 ${isBW ? 'grayscale contrast-110' : ''}`}
            />
          ) : (
            <img
              src={currentUrl}
              alt={currentPhoto.caption || 'Foto'}
              className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-500 ${isBW ? 'grayscale contrast-110' : ''}`}
              draggable={false}
            />
          )}
        </div>

        {/* Soft bottom gradient to ensure text readability */}
        <div
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-20 rounded-b-2xl"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
        />
      </div>

      {/* ── NEXT slide — peeks in from the RIGHT ── */}
      {nextPhoto && (
        <div
          className={`${baseCard} left-1/2`}
          style={{
            transform: `translateX(calc(-50% + 105% + ${dragOffsetX}px)) scale(${0.88 + Math.abs(Math.min(0, dragRatio)) * 0.12}) rotate(${5 + dragRatio * 5}deg)`,
            opacity: 0.4 + Math.max(0, -dragRatio) * 0.6,
            transition,
            borderColor: theme?.cardBorder || 'rgba(255,255,255,0.15)',
            background: theme?.cardBg || 'rgba(10,4,18,0.88)',
            zIndex: dragOffsetX < 0 ? 15 : 5,
          }}
        >
          {isMediaVideo(nextPhoto, nextUrl) ? (
            <video src={nextUrl} autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <img
              src={nextUrl}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              draggable={false}
            />
          )}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </div>
      )}
    </div>
  );
};
