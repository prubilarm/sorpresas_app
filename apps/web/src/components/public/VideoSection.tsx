import React, { useState, useRef } from 'react';
import { Film, Play, X } from 'lucide-react';
import { ThemeConfig } from '@recuerdos-qr/shared';

interface VideoSectionProps {
  projectId?: string;
  title?: string;
  intro?: string;
  buttonText?: string;
  warningText?: string;
  videoUrl?: string;
  posterUrl?: string;
  caption?: string;
  theme?: ThemeConfig;
  onVideoPlayStateChange?: (isPlayingVideo: boolean) => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  title = 'Nuestros recuerdos especiales',
  intro = 'Tengo una sorpresa guardada en video para ti.',
  videoUrl,
  posterUrl,
  caption = 'Un pedacito de nuestra historia, guardado para siempre.',
  theme,
  onVideoPlayStateChange,
}) => {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpenVideo = () => {
    setIsPlayerVisible(true);
    setIsImmersive(true);
    onVideoPlayStateChange?.(true);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 350);
  };

  const handleCloseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsImmersive(false);
    onVideoPlayStateChange?.(false);
  };

  const handleVideoPlay = () => {
    setIsImmersive(true);
    onVideoPlayStateChange?.(true);
  };

  const handleVideoPause = () => {
    onVideoPlayStateChange?.(false);
  };

  return (
    <section id="video" className="w-full max-w-[780px] mx-auto py-12 px-4 text-center relative">
      <div className="mb-6">
        <span className="uppercase tracking-widest text-xs font-bold" style={{ color: theme?.kickerColor }}>
          Un recuerdo en movimiento
        </span>
        <h2
          className="text-4xl sm:text-6xl font-serif mt-2 mb-2 script-title"
          style={{ color: theme?.titleColor, fontFamily: theme?.fontTitle }}
        >
          {title}
        </h2>
      </div>

      {/* Pre-video Message Card */}
      <div
        className="w-full max-w-[640px] mx-auto p-6 sm:p-8 rounded-3xl border shadow-2xl mb-6 space-y-5"
        style={{
          background: theme?.cardBg || 'rgba(0,0,0,0.35)',
          borderColor: theme?.cardBorder || 'rgba(255,255,255,0.1)',
          color: theme?.textColor || '#ffffff',
        }}
      >
        <Film className="w-10 h-10 mx-auto text-pink-400 opacity-90" />
        {intro && (
          <p className="text-base sm:text-lg font-serif italic leading-relaxed max-w-[540px] mx-auto opacity-95">
            “{intro}”
          </p>
        )}

        {/* Initial View: Only the "Ver video" Button */}
        {!isPlayerVisible && (
          <div className="pt-2 flex flex-col items-center">
            <button
              type="button"
              onClick={handleOpenVideo}
              className={`inline-flex items-center justify-center gap-3 py-4 px-9 rounded-full font-bold text-white shadow-2xl hover:brightness-110 active:scale-95 transition-all duration-300 ${
                theme?.buttonStyle || 'bg-pink-600'
              }`}
            >
              <Play className="w-5 h-5 fill-white text-white" />
              Ver video
            </button>
          </div>
        )}
      </div>

      {/* 🎬 Fullscreen Cinematic Immersive Theater Overlay */}
      {isImmersive && (
        <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 transition-all duration-700 animate-fade-in overflow-hidden">
          
          {/* Subtle Ambient Romantic Floating Hearts in Dark Margins */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute text-pink-400/40 animate-wave-float select-none pointer-events-none"
                style={{
                  left: `${(i * 6.5 + 2) % 96}%`,
                  bottom: '-40px',
                  fontSize: `${14 + (i % 4) * 8}px`,
                  animationDuration: `${6.5 + (i % 5) * 2}s`,
                  animationDelay: `${(i % 5) * 1.2}s`,
                  filter: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.45))',
                }}
              >
                ♥
              </div>
            ))}
          </div>

          {/* Top Bar with Close Action */}
          <div className="relative z-10 w-full max-w-4xl flex items-center justify-between mb-4 px-2 text-white">
            <span className="font-serif text-sm italic text-pink-300 truncate">{title}</span>
            <button
              type="button"
              onClick={handleCloseVideo}
              className="flex items-center gap-2 py-2 px-4 rounded-full bg-white/10 text-white hover:bg-rose-600/90 transition text-xs font-semibold backdrop-blur-md border border-white/20 shadow-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
              Cerrar reproductor
            </button>
          </div>

          {/* Centered Main Video Player Container */}
          <div className="relative z-10 w-full max-w-4xl max-h-[80vh] rounded-3xl overflow-hidden shadow-[0_0_90px_rgba(236,72,153,0.35)] border border-pink-500/30 bg-black">
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl || '/assets/fotos/portada.svg'}
                controls
                playsInline
                preload="auto"
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoPause}
                className="w-full h-full max-h-[78vh] object-contain bg-black rounded-3xl"
              />
            ) : (
              <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 p-6 text-slate-300">
                <Film className="w-12 h-12 text-pink-400" />
                <strong className="text-lg text-white">Video especial</strong>
                <p className="text-sm opacity-80">El video personalizado cargado se reproducirá aquí.</p>
              </div>
            )}
          </div>

          {caption && (
            <p className="relative z-10 mt-4 text-center font-serif italic text-sm text-pink-200/90">
              {caption}
            </p>
          )}
        </div>
      )}

      {/* Restart section button */}
      <div className="mt-10 flex flex-col items-center gap-2">
        <div className="flex gap-3 text-xl" style={{ color: theme?.accentColor || '#ec4899' }}>
          {['♥', '♥', '♥'].map((h, i) => (
            <span key={i} className="animate-beat" style={{ animationDelay: `${i * 0.2}s` }}>{h}</span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="mt-2 inline-flex items-center gap-2 py-2.5 px-6 rounded-full border text-sm font-semibold hover:bg-white/10 transition"
          style={{
            borderColor: theme?.cardBorder || 'rgba(255,255,255,0.25)',
            color: theme?.textColor || 'rgba(255,255,255,0.7)',
          }}
        >
          ↩ Volver al comienzo
        </button>
      </div>
    </section>
  );
};
