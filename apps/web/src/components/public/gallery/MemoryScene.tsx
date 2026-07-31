import React from 'react';
import { MediaItem, ThemeConfig } from '@recuerdos-qr/shared';
import { resolveMediaUrl } from '../../../services/api';
import { Heart, Sparkles } from 'lucide-react';

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
    'absolute top-0 w-full max-w-[340px] sm:max-w-[420px] h-[410px] sm:h-[450px] rounded-[32px] overflow-hidden border p-3.5 flex flex-col justify-between shadow-2xl backdrop-blur-2xl transition-all';

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
            opacity: 0.45 + Math.max(0, dragRatio) * 0.55,
            transition,
            borderColor: 'rgba(212, 175, 55, 0.25)',
            background: 'linear-gradient(145deg, #f4efe4 0%, #e9e0cf 100%)',
            zIndex: dragOffsetX > 0 ? 15 : 5,
          }}
        >
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
          <div className="absolute inset-0 bg-black/20 pointer-events-none rounded-[32px]" />
        </div>
      )}

      {/* ── CURRENT slide — Center Stage Romantic Journal Card ── */}
      <div
        className={`${baseCard} left-1/2`}
        style={{
          transform: `translateX(calc(-50% + ${dragOffsetX}px)) scale(${1 - Math.abs(dragRatio) * 0.06}) rotate(${dragRatio * -3}deg)`,
          opacity: 1 - Math.abs(dragRatio) * 0.2,
          transition,
          borderColor: 'rgba(212, 175, 55, 0.45)', // Fine Gold Trim
          background: 'linear-gradient(145deg, #fdfdf9 0%, #f7f3e8 100%)', // Luxury Warm Ivory Paper
          boxShadow: '0 30px 95px rgba(0,0,0,0.65), inset 0 0 50px rgba(235,220,190,0.4)',
          zIndex: 20,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Paper Corner Stitching Accent */}
        <div className="absolute inset-0 pointer-events-none border border-dashed border-amber-900/15 rounded-[32px]" />

        {/* ── Paper Top Header Bar ── */}
        <div className="relative z-10 flex items-center justify-between px-2 pt-1 pb-1.5 border-b border-amber-900/10">
          <div className="flex items-center gap-1.5 text-amber-800/70">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold">
              Recuerdo Especial
            </span>
          </div>
          {(currentPhoto as any).taken_at ? (
            <span className="text-[10px] font-mono tracking-widest text-amber-900/60 uppercase">
              {new Date((currentPhoto as any).taken_at).toLocaleDateString()}
            </span>
          ) : (
            <div className="w-2 h-2 rounded-full bg-rose-400/60 animate-ping" />
          )}
        </div>

        {/* ── Mounted Live Photograph Container (Center Piece) ── */}
        <div className="relative z-10 my-2 flex-1 w-full rounded-2xl overflow-hidden bg-white/95 p-2 sm:p-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.22)] border border-slate-200/80 flex items-center justify-center">
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

        {/* ── Paper Bottom Footer Bar ── */}
        <div className="relative z-10 flex items-center justify-between px-2 pt-1.5 pb-0.5 border-t border-amber-900/10 text-amber-900/70">
          <span className="font-serif italic text-xs tracking-wide">
            {currentPhoto.caption ? `“${currentPhoto.caption}”` : 'Guardado con amor'}
          </span>
          <div className="flex items-center gap-1 text-rose-500/80">
            <Heart className="w-3.5 h-3.5 fill-rose-500/60 text-rose-600 animate-pulse" />
          </div>
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
