import React, { useState, useRef } from 'react';
import { Film, PlayCircle, AlertTriangle, X, Heart, Download } from 'lucide-react';
import { trackAnalyticsEvent } from '../../services/api';
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
  projectId,
  title = 'Nuestros recuerdos especiales',
  intro = 'Tengo una sorpresa guardada en video para ti. Presiona el botón para descubrirla.',
  buttonText = 'Pulsa aquí para ver el video ✨',
  warningText = '⚠️ ADVERTENCIA: Video no apto para cardíacos ni personas propensas a llorar de emoción... ¿Deseas continuar?',
  videoUrl,
  posterUrl,
  caption = 'Un pedacito de nuestra historia, guardado para siempre.',
  theme,
  onVideoPlayStateChange,
}) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleInitialClick = () => {
    setShowWarningModal(true);
  };

  const confirmAndPlayVideo = () => {
    setShowWarningModal(false);
    setIsTheaterOpen(true);
    trackAnalyticsEvent(projectId, 'video_play');
    onVideoPlayStateChange?.(true);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 400);
  };

  const closeTheater = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsTheaterOpen(false);
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

      {/* Pre-video Message Intro Card */}
      <div
        className="w-full max-w-[620px] mx-auto p-6 sm:p-8 rounded-3xl border shadow-2xl mb-6 space-y-4"
        style={{
          background: theme?.cardBg || 'rgba(0,0,0,0.35)',
          borderColor: theme?.cardBorder || 'rgba(255,255,255,0.1)',
          color: theme?.textColor || '#ffffff',
        }}
      >
        <Film className="w-10 h-10 mx-auto text-pink-400 opacity-90" />
        <p className="text-base sm:text-lg font-serif italic leading-relaxed max-w-[540px] mx-auto opacity-95">
          “{intro}”
        </p>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleInitialClick}
            className={`inline-flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-full font-bold text-white shadow-xl hover:brightness-110 active:scale-95 transition ${
              theme?.buttonStyle || 'bg-pink-600'
            }`}
          >
            <PlayCircle className="w-5 h-5 fill-white/20 text-white" />
            {buttonText}
          </button>

          {videoUrl && (
            <a
              href={`http://localhost:4000/api/projects/${projectId}/video/download?type=optimized&isPublic=true`}
              download
              className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-full font-bold text-xs bg-slate-900/90 hover:bg-slate-800 text-pink-300 border border-pink-500/30 shadow-md hover:scale-105 active:scale-95 transition cursor-pointer mt-1"
              title="Descargar este video personalizado"
            >
              <Download className="w-4 h-4 text-pink-400" />
              Descargar este video
            </a>
          )}
        </div>
      </div>

      {/* ⚠️ Warning Modal Overlay */}
      {showWarningModal && (
        <div
          onClick={() => setShowWarningModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl text-center space-y-5 relative overflow-hidden"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white tracking-wide">¡Advertencia Especial! ⚠️</h3>

            <p className="text-sm sm:text-base font-serif italic text-amber-200/90 leading-relaxed bg-amber-950/40 p-4 rounded-2xl border border-amber-500/20">
              {warningText}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAndPlayVideo}
                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
              >
                <Heart className="w-4 h-4 fill-white" />
                Continuar y Ver Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎬 Fullscreen Cinematic Theater Mode Player */}
      {isTheaterOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-8 transition-all duration-700 animate-fade-in">
          {/* Top Close Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between mb-4 px-2 text-white">
            <span className="font-serif text-sm italic text-pink-300 truncate">{title}</span>
            <button
              onClick={closeTheater}
              className="flex items-center gap-1.5 py-2 px-4 rounded-full bg-white/10 text-white hover:bg-rose-600 transition text-xs font-semibold"
            >
              <X className="w-4 h-4" />
              Cerrar reproductor
            </button>
          </div>

          {/* Large Centered Video Container */}
          <div className="relative w-full max-w-4xl max-h-[82vh] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(236,72,153,0.3)] border border-pink-500/30 bg-black">
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl || '/assets/fotos/portada.svg'}
                controls
                autoPlay
                playsInline
                preload="auto"
                className="w-full h-full max-h-[80vh] object-contain bg-black"
              />
            ) : (
              <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 p-6 text-slate-300">
                <Film className="w-12 h-12 text-pink-400" />
                <strong className="text-lg text-white">Video especial</strong>
                <p className="text-sm opacity-80">El video personalizado cargado se reproducirá aquí.</p>
              </div>
            )}
          </div>

          {caption && <p className="mt-4 text-center font-serif italic text-sm text-pink-200/90">{caption}</p>}
        </div>
      )}

      {/* Restart — only shown after the video section closes */}
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
