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
    'absolute top-0 w-full max-w-[340px] sm:max-w-[430px] h-[420px] sm:h-[460px] rounded-[28px] overflow-hidden border p-4 flex flex-col justify-between shadow-2xl backdrop-blur-xl transition-all';

  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden py-4 select-none"
      style={{ height: '470px', touchAction: 'pan-y', perspective: '1200px' }}
    >
      {/* ── PREVIOUS slide — peeks in from the LEFT ── */}
      {prevPhoto && (
        <div
          className={`${baseCard} left-1/2`}
          style={{
            transform: `translateX(calc(-50% - 105% + ${dragOffsetX}px)) scale(${0.88 + Math.max(0, dragRatio) * 0.12}) rotate(${-5 + dragRatio * 5}deg)`,
            opacity: 0.45 + Math.max(0, dragRatio) * 0.55,
            transition,
            backgroundColor: '#fdfdf9',
            backgroundImage: `
              linear-gradient(to right, rgba(147, 197, 253, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(147, 197, 253, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '22px 22px',
            borderColor: 'rgba(203, 213, 225, 0.7)',
            zIndex: dragOffsetX > 0 ? 15 : 5,
          }}
        >
          {/* Pink Margin Lines */}
          <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-rose-400/50 z-10 pointer-events-none" />
          <div className="absolute right-8 top-0 bottom-0 w-[2px] bg-rose-400/50 z-10 pointer-events-none" />

          {isMediaVideo(prevPhoto, prevUrl) ? (
            <video src={prevUrl} autoPlay muted playsInline className="w-full h-full object-cover rounded-2xl opacity-60" />
          ) : (
            <img
              src={prevUrl}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover rounded-2xl opacity-60"
              draggable={false}
            />
          )}
          <div className="absolute inset-0 bg-black/15 pointer-events-none rounded-[28px]" />
        </div>
      )}

      {/* ── CURRENT slide — Center Stage Graph Paper Notebook Page ── */}
      <div
        className={`${baseCard} left-1/2`}
        style={{
          transform: `translateX(calc(-50% + ${dragOffsetX}px)) scale(${1 - Math.abs(dragRatio) * 0.06}) rotate(${dragRatio * -3}deg)`,
          opacity: 1 - Math.abs(dragRatio) * 0.2,
          transition,
          backgroundColor: '#fdfdf9', // Warm Off-White Notebook Paper
          backgroundImage: `
            linear-gradient(to right, rgba(147, 197, 253, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(147, 197, 253, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '22px 22px',
          borderColor: 'rgba(203, 213, 225, 0.8)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.65), inset 0 0 60px rgba(235,220,190,0.3)',
          zIndex: 20,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Pink Left & Right Vertical Margin Lines (matching reference notebook image) */}
        <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-rose-400/65 z-10 pointer-events-none" />
        <div className="absolute right-8 top-0 bottom-0 w-[2px] bg-rose-400/65 z-10 pointer-events-none" />

        {/* ── Top Header: ✨ Recuerdo especial ── */}
        <div className="relative z-20 text-center pt-1 pb-1">
          <h3 className="font-serif italic font-semibold text-base sm:text-lg text-slate-800 tracking-wide flex items-center justify-center gap-1.5 drop-shadow-sm">
            <span>✨ Recuerdo especial</span>
          </h3>
        </div>

        {/* ── Mounted Photo/Video Frame — Centered in Middle ── */}
        <div className="relative z-20 my-auto flex-1 w-full max-h-[300px] rounded-2xl overflow-hidden bg-white p-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.18)] border border-slate-200/90 flex items-center justify-center">
          {isMediaVideo(currentPhoto, currentUrl) ? (
            <video
              src={currentUrl}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-contain rounded-xl drop-shadow-md transition-all duration-500 ${isBW ? 'grayscale contrast-110' : ''}`}
            />
          ) : (
            <img
              src={currentUrl}
              alt={currentPhoto.caption || 'Foto'}
              className={`w-full h-full object-contain rounded-xl drop-shadow-md transition-all duration-500 ${isBW ? 'grayscale contrast-110' : ''}`}
              draggable={false}
            />
          )}
        </div>

        {/* ── Bottom Footer: Guardado con amor ❤️ ── */}
        <div className="relative z-20 text-center pt-1 pb-1">
          <p className="font-serif italic font-medium text-xs sm:text-sm text-slate-700 tracking-wide flex items-center justify-center gap-1">
            <span>Guardado con amor</span>
            <span className="text-rose-500 animate-pulse">❤️</span>
          </p>
        </div>
      </div>

      {/* ── NEXT slide — peeks in from the RIGHT ── */}
      {nextPhoto && (
        <div
          className={`${baseCard} left-1/2`}
          style={{
            transform: `translateX(calc(-50% + 105% + ${dragOffsetX}px)) scale(${0.88 + Math.abs(Math.min(0, dragRatio)) * 0.12}) rotate(${5 + dragRatio * 5}deg)`,
            opacity: 0.4 + Math.max(0, -dragRatio) * 0.6,
            transition,
            backgroundColor: '#fdfdf9',
            backgroundImage: `
              linear-gradient(to right, rgba(147, 197, 253, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(147, 197, 253, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '22px 22px',
            borderColor: 'rgba(203, 213, 225, 0.7)',
            zIndex: dragOffsetX < 0 ? 15 : 5,
          }}
        >
          {/* Pink Margin Lines */}
          <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-rose-400/50 z-10 pointer-events-none" />
          <div className="absolute right-8 top-0 bottom-0 w-[2px] bg-rose-400/50 z-10 pointer-events-none" />

          {isMediaVideo(nextPhoto, nextUrl) ? (
            <video src={nextUrl} autoPlay muted playsInline className="w-full h-full object-cover rounded-2xl opacity-60" />
          ) : (
            <img
              src={nextUrl}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover rounded-2xl opacity-60"
              draggable={false}
            />
          )}
          <div className="absolute inset-0 bg-black/15 pointer-events-none rounded-[28px]" />
        </div>
      )}
    </div>
  );
};
