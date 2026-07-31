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
  const isBW = (currentPhoto as any).is_bw;
  const currentUrl = resolveMediaUrl(currentPhoto.public_url);
  const prevUrl = prevPhoto ? resolveMediaUrl(prevPhoto.public_url) : '';
  const nextUrl = nextPhoto ? resolveMediaUrl(nextPhoto.public_url) : '';

  const currentIsLandscape =
    (currentPhoto.width && currentPhoto.height && currentPhoto.width > currentPhoto.height) || false;

  const dragRatio = Math.max(-1, Math.min(1, dragOffsetX / 300));
  const transition = isDragging ? 'none' : 'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 500ms ease';

  const baseCard =
    'absolute top-0 w-full max-w-[340px] sm:max-w-[420px] h-[400px] sm:h-[440px] rounded-3xl overflow-hidden border p-3 flex flex-col justify-between shadow-2xl transition-transform backdrop-blur-xl';

  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden py-4 select-none"
      style={{ height: '440px', touchAction: 'pan-y' }}
    >
      {/* ── PREVIOUS slide — peeks in from the LEFT on drag-right ── */}
      {prevPhoto && (
        <div
          className={`${baseCard} left-1/2 -translate-x-1/2`}
          style={{
            transform: `translateX(calc(-50% - 100% + ${dragOffsetX}px)) scale(${0.88 + dragRatio * 0.08})`,
            opacity: 0.35 + Math.max(0, dragRatio) * 0.65,
            transition,
            borderColor: theme?.cardBorder || 'rgba(255,255,255,0.12)',
            background: theme?.cardBg || 'rgba(8,3,14,0.85)',
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
          {/* Dim overlay */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        </div>
      )}

      {/* ── CURRENT slide — center stage ── */}
      <div
        className={`${baseCard} left-1/2 -translate-x-1/2`}
        style={{
          transform: `translateX(calc(-50% + ${dragOffsetX}px)) scale(${1 - Math.abs(dragRatio) * 0.05})`,
          opacity: 1 - Math.abs(dragRatio) * 0.25,
          transition,
          borderColor: theme?.cardBorder || 'rgba(255,255,255,0.18)',
          background: theme?.cardBg || 'rgba(12,5,20,0.92)',
          boxShadow: theme?.cardShadow || '0 32px 80px rgba(0,0,0,0.75)',
          zIndex: 20,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Blurred landscape background fill */}
        {currentIsLandscape && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {isMediaVideo(currentPhoto, currentUrl) ? (
              <video src={currentUrl} autoPlay muted playsInline className="w-full h-full object-cover blur-2xl opacity-40 scale-110" />
            ) : (
              <img
                src={currentUrl}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
              />
            )}
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}

        {/* Main photo / video */}
        <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
          {isMediaVideo(currentPhoto, currentUrl) ? (
            <video
              src={currentUrl}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-contain transition-all duration-500 ${isBW ? 'grayscale contrast-110' : ''}`}
            />
          ) : (
            <img
              src={currentUrl}
              alt={currentPhoto.caption || 'Foto'}
              className={`w-full h-full ${currentIsLandscape ? 'object-contain' : 'object-cover'} transition-all duration-500 ${isBW ? 'grayscale contrast-110' : ''}`}
              draggable={false}
            />
          )}
        </div>

        {/* Bottom gradient for caption readability */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-20"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)' }}
        />
      </div>

      {/* ── NEXT slide — peeks in from the RIGHT on drag-left ── */}
      {nextPhoto && (
        <div
          className={`${baseCard} left-1/2 -translate-x-1/2`}
          style={{
            transform: `translateX(calc(-50% + 100% + ${dragOffsetX}px)) scale(${0.88 + Math.abs(Math.min(0, dragRatio)) * 0.08})`,
            opacity: 0.35 + Math.max(0, -dragRatio) * 0.65,
            transition,
            borderColor: theme?.cardBorder || 'rgba(255,255,255,0.12)',
            background: theme?.cardBg || 'rgba(8,3,14,0.85)',
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
          {/* Dim overlay */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        </div>
      )}
    </div>
  );
};
