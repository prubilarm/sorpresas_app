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
    'absolute top-0 w-full max-w-[580px] sm:max-w-[720px] h-[430px] sm:h-[480px] rounded-[32px] overflow-hidden border p-4 sm:p-6 flex flex-col justify-between shadow-2xl backdrop-blur-xl transition-all';

  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden py-4 select-none"
      style={{ height: '490px', touchAction: 'pan-y', perspective: '1200px' }}
    >
      {/* ── PREVIOUS slide — peeks in from the LEFT ── */}
      {prevPhoto && (
        <div
          className={`${baseCard} left-1/2`}
          style={{
            transform: `translateX(calc(-50% - 105% + ${dragOffsetX}px)) scale(${0.88 + Math.max(0, dragRatio) * 0.12}) rotate(${-4 + dragRatio * 4}deg)`,
            opacity: 0.45 + Math.max(0, dragRatio) * 0.55,
            transition,
            backgroundColor: '#fdfdf9',
            backgroundImage: `url(/assets/hoja_cuaderno_corazones.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderColor: 'rgba(203, 213, 225, 0.7)',
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
          <div className="absolute inset-0 bg-black/15 pointer-events-none rounded-[28px]" />
        </div>
      )}

      {/* ── CURRENT slide — Center Stage Horizontal Notebook Sheet with Hearts ── */}
      <div
        className={`${baseCard} left-1/2`}
        style={{
          transform: `translateX(calc(-50% + ${dragOffsetX}px)) scale(${1 - Math.abs(dragRatio) * 0.05}) rotate(${dragRatio * -2}deg)`,
          opacity: 1 - Math.abs(dragRatio) * 0.2,
          transition,
          backgroundColor: '#fdfdf9',
          backgroundImage: `url(/assets/hoja_cuaderno_corazones.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderColor: 'rgba(203, 213, 225, 0.8)',
          boxShadow: '0 30px 95px rgba(0,0,0,0.65), inset 0 0 60px rgba(235,220,190,0.3)',
          zIndex: 20,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* ── Top Header: 📖 Nuestro recuerdo especial ── */}
        <div className="relative z-20 text-center pt-1 pb-1">
          <h3 className="font-serif italic font-bold text-lg sm:text-2xl text-slate-800 tracking-wide flex items-center justify-center gap-2 drop-shadow-sm">
            <span>📖 Nuestro recuerdo especial</span>
          </h3>
        </div>

        {/* ── Mounted Polaroid Photograph Frame with Washi Tape & Drop Bounce ── */}
        <div className="relative z-20 my-auto mx-auto w-full max-w-[340px] sm:max-w-[440px] bg-white p-3 sm:p-4 pb-9 sm:pb-11 rounded-xl shadow-[0_22px_55px_rgba(0,0,0,0.32)] border border-slate-200/90 flex flex-col items-center justify-between transform rotate-1 transition-all duration-500 hover:rotate-0 hover:scale-[1.02] animate-polaroid-drop">
          {/* Washi Tape Accent - Top Left */}
          <div className="absolute -top-3.5 left-6 z-30 w-16 h-6 bg-amber-100/75 border border-amber-200/60 backdrop-blur-sm -rotate-12 shadow-sm rounded-sm pointer-events-none opacity-90" />
          
          {/* Washi Tape Accent - Top Right */}
          <div className="absolute -top-3.5 right-6 z-30 w-16 h-6 bg-pink-100/75 border border-pink-200/60 backdrop-blur-sm rotate-12 shadow-sm rounded-sm pointer-events-none opacity-90" />

          {/* Photo / Video Inner Slot */}
          <div className="w-full h-[200px] sm:h-[235px] overflow-hidden rounded-lg bg-slate-900 flex items-center justify-center relative">
            {isMediaVideo(currentPhoto, currentUrl) ? (
              <video
                src={currentUrl}
                autoPlay
                muted
                loop
                playsInline
                className={`w-full h-full object-contain drop-shadow-sm transition-all duration-500 ${isBW ? 'grayscale contrast-110' : ''}`}
              />
            ) : (
              <img
                src={currentUrl}
                alt={currentPhoto.caption || 'Foto'}
                className={`w-full h-full object-contain drop-shadow-sm transition-all duration-500 ${isBW ? 'grayscale contrast-110' : ''}`}
                draggable={false}
              />
            )}
          </div>

          {/* Polaroid Bottom Handwritten Caption */}
          <div className="pt-2 text-center w-full">
            <p className="font-serif italic font-medium text-xs sm:text-sm text-slate-700 truncate px-2">
              {currentPhoto.caption ? `“${currentPhoto.caption}”` : '📍 Guardado con amor 💕'}
            </p>
          </div>
        </div>

        {/* ── Bottom Footer: Un recuerdo que siempre volveremos a vivir ── */}
        <div className="relative z-20 text-center pt-1 pb-1">
          <p className="font-serif italic font-semibold text-xs sm:text-sm text-slate-700 tracking-wide flex items-center justify-center gap-1.5">
            <span>📖 Un recuerdo que siempre volveremos a vivir</span>
          </p>
        </div>
      </div>

      {/* ── NEXT slide — peeks in from the RIGHT ── */}
      {nextPhoto && (
        <div
          className={`${baseCard} left-1/2`}
          style={{
            transform: `translateX(calc(-50% + 105% + ${dragOffsetX}px)) scale(${0.88 + Math.abs(Math.min(0, dragRatio)) * 0.12}) rotate(${4 + dragRatio * 4}deg)`,
            opacity: 0.4 + Math.max(0, -dragRatio) * 0.6,
            transition,
            backgroundColor: '#fdfdf9',
            backgroundImage: `url(/assets/hoja_cuaderno_corazones.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderColor: 'rgba(203, 213, 225, 0.7)',
            zIndex: dragOffsetX < 0 ? 15 : 5,
          }}
        >
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
