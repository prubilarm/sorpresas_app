import React, { useRef } from 'react';
import { Film } from 'lucide-react';
import { ThemeConfig } from '@recuerdos-qr/shared';

interface VideoSectionProps {
  projectId: string;
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
  const videoRef = useRef<HTMLVideoElement>(null);

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

      {/* Pre-video Message & Direct Video Card */}
      <div
        className="w-full max-w-[680px] mx-auto p-6 sm:p-8 rounded-3xl border shadow-2xl mb-6 space-y-5"
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

        {/* Video Player Rendered Directly */}
        {videoUrl ? (
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-pink-500/30 bg-black mt-4">
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl || '/assets/fotos/portada.svg'}
              controls
              playsInline
              preload="metadata"
              onPlay={() => onVideoPlayStateChange?.(true)}
              onPause={() => onVideoPlayStateChange?.(false)}
              onEnded={() => onVideoPlayStateChange?.(false)}
              className="w-full max-h-[75vh] object-contain bg-black rounded-2xl"
            />
          </div>
        ) : (
          <div className="min-h-[220px] flex flex-col items-center justify-center gap-3 p-6 text-slate-300 bg-black/40 rounded-2xl border border-white/10">
            <Film className="w-12 h-12 text-pink-400 opacity-70" />
            <strong className="text-lg text-white">Video especial</strong>
            <p className="text-sm opacity-80">El video personalizado cargado se mostrará aquí.</p>
          </div>
        )}

        {caption && <p className="mt-3 text-center font-serif italic text-sm text-pink-200/90">{caption}</p>}
      </div>

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
