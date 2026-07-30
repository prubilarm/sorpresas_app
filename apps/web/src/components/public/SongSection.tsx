import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ThemeConfig } from '@recuerdos-qr/shared';
import { useInView } from '../../hooks/useAnimation';
import { resolveMediaUrl } from '../../services/api';
import { Play, Pause, Music2 } from 'lucide-react';

interface SongSectionProps {
  songName?: string;
  artist?: string;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  coverImageUrl?: string;
  photoUrl?: string;
  photoCaption?: string;
  theme?: ThemeConfig;
}

export const SongSection: React.FC<SongSectionProps> = ({
  songName = 'Until Found',
  artist = 'Sam Smith',
  audioRef,
  isPlaying = false,
  onTogglePlay,
  coverImageUrl,
  photoUrl,
  photoCaption,
  theme,
}) => {
  const [ref, visible] = useInView(0.1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('--:--');
  const rafRef = useRef<number | null>(null);

  const formatTime = (sec: number): string => {
    if (!isFinite(sec) || isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Polling loop via requestAnimationFrame for smooth real-time progress
  const tick = useCallback(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    if (audio.duration && isFinite(audio.duration)) {
      const pct = (audio.currentTime / audio.duration) * 100;
      setProgress(pct);
      setCurrentTime(formatTime(audio.currentTime));
      setDuration(formatTime(audio.duration));
    } else {
      setCurrentTime(formatTime(audio.currentTime));
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [audioRef]);

  // Start / stop the RAF loop depending on isPlaying
  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, tick]);

  // Grab duration once audio metadata is ready (even if not yet playing)
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const onLoaded = () => {
      if (isFinite(audio.duration)) setDuration(formatTime(audio.duration));
    };

    // If already loaded
    if (audio.readyState >= 1 && isFinite(audio.duration)) {
      setDuration(formatTime(audio.duration));
    }

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('durationchange', onLoaded);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('durationchange', onLoaded);
    };
  }, [audioRef]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef?.current;
    if (!audio || !audio.duration) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    audio.currentTime = pct * audio.duration;
  };

  const resolvedPhoto = resolveMediaUrl(photoUrl);
  // Default: the Until Found / Gloria album cover we ship in public/
  const coverSrc = resolveMediaUrl(coverImageUrl) || '/until_found_cover.svg';

  const accentColor = theme?.accentColor || '#ec4899';
  const glowColor = theme?.glowColor || 'rgba(236,72,153,0.3)';

  return (
    <section
      id="cancion"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full max-w-[780px] mx-auto py-10 px-4 text-center overflow-hidden"
    >
      {/* Section label */}
      <div className="mb-8">
        <span
          className={`reveal ${visible ? 'is-visible' : ''} uppercase tracking-[0.25em] text-xs font-bold block mb-2`}
          style={{ color: theme?.kickerColor || '#ffd7e8' }}
        >
          El comienzo de todo
        </span>
        <h2
          className={`reveal reveal-delay-1 ${visible ? 'is-visible' : ''} text-4xl sm:text-5xl font-serif script-title leading-tight shimmer-text`}
          style={{ color: theme?.titleColor || '#ff83b6', fontFamily: theme?.fontTitle }}
        >
          La canción que empezó todo.
        </h2>
      </div>

      {/* Music Player Widget */}
      <div
        className={`reveal-scale reveal-delay-2 ${visible ? 'is-visible' : ''} relative w-full max-w-[440px] mx-auto mb-8 p-4 sm:p-5 rounded-3xl border backdrop-blur-xl shadow-2xl`}
        style={{
          background: theme?.cardBg || 'rgba(10,4,18,0.85)',
          borderColor: theme?.cardBorder || 'rgba(255,131,182,0.22)',
          boxShadow: `0 20px 60px rgba(0,0,0,0.65), 0 0 40px ${glowColor}`,
        }}
      >
        {/* Equalizer bars — top right */}
        <div className="absolute top-4 right-4 flex items-end gap-0.5 h-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`music-bar ${isPlaying ? '' : 'music-bar-paused'}`}
              style={{ height: `${8 + i * 3}px`, backgroundColor: accentColor }}
            />
          ))}
        </div>

        {/* Row: cover + info */}
        <div className="flex items-center gap-4">
          {/* Cover art — vinyl spin when playing */}
          <div
            className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-xl"
            style={{ boxShadow: `0 0 24px ${glowColor}` }}
          >
            <img
              src={coverSrc}
              alt="Portada del álbum"
              className={`w-full h-full object-cover transition-all duration-300 ${isPlaying ? 'animate-vinyl-spin' : ''}`}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Vinyl center dot overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-4 h-4 rounded-full border-2 border-white/20 shadow"
                style={{ background: 'rgba(5,0,10,0.65)' }}
              />
            </div>
            {/* Fallback icon if img fails */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Music2 className="w-7 h-7 opacity-0" style={{ color: accentColor }} />
            </div>
          </div>

          {/* Song info */}
          <div className="flex-1 text-left min-w-0">
            <p
              className="font-bold text-base sm:text-lg truncate"
              style={{ color: theme?.titleColor || '#ffffff' }}
            >
              {songName}
            </p>
            <p className="text-xs sm:text-sm opacity-60 truncate mt-0.5" style={{ color: theme?.textColor || '#cbd5e1' }}>
              {artist}
            </p>
          </div>
        </div>

        {/* Progress bar — clickable + auto-advancing */}
        <div className="mt-4 space-y-1">
          <div
            className="h-1.5 rounded-full bg-white/10 cursor-pointer overflow-hidden"
            style={{ touchAction: 'none' }}
            onClick={handleSeek}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${accentColor}, #f9a8d4)`,
                boxShadow: `0 0 8px ${accentColor}88`,
                transition: isPlaying ? 'none' : 'width 0.3s ease',
              }}
            />
          </div>

          {/* Time row */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono opacity-50 tabular-nums" style={{ color: theme?.textColor || '#fff' }}>
              {currentTime}
            </span>
            <span className="text-[11px] font-mono opacity-50 tabular-nums" style={{ color: theme?.textColor || '#fff' }}>
              {duration}
            </span>
          </div>
        </div>

        {/* Play/Pause button */}
        <div className="flex justify-center mt-3">
          <button
            type="button"
            onClick={onTogglePlay}
            className="w-13 h-13 w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-xl transition hover:scale-110 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #f43f5e)`,
              boxShadow: `0 6px 24px ${glowColor}`,
            }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Polaroid photo */}
      {resolvedPhoto && (
        <div
          className={`reveal-scale reveal-delay-3 ${visible ? 'is-visible' : ''} relative inline-block mx-auto`}
          style={{ transform: 'rotate(-1.5deg)' }}
        >
          {/* Tape strip */}
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-7 rounded-sm opacity-70 z-10"
            style={{ background: 'rgba(255,240,200,0.55)', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
          />
          {/* Polaroid frame */}
          <div
            className="p-3 pb-8 shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.3)',
            }}
          >
            <img
              src={resolvedPhoto}
              alt="Foto especial"
              className="w-64 sm:w-72 h-72 sm:h-80 object-cover block"
            />
          </div>
          {photoCaption && (
            <p className="mt-2 text-center text-xs font-serif italic opacity-70" style={{ color: theme?.textColor || '#fff' }}>
              {photoCaption}
            </p>
          )}
        </div>
      )}

      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(7)].map((_, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: `${12 + i * 13}%`,
              bottom: '-10px',
              fontSize: `${10 + (i % 3) * 5}px`,
              color: accentColor,
              opacity: 0,
              filter: `drop-shadow(0 0 5px ${accentColor}88)`,
              animation: `waveFloat ${6 + i * 1.1}s ${i * 0.9}s linear infinite`,
            }}
          >
            ♥
          </span>
        ))}
      </div>
    </section>
  );
};
