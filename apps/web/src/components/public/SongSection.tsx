import React, { useRef, useEffect, useState } from 'react';
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
  const [duration, setDuration] = useState('0:00');

  const resolvedPhoto = resolveMediaUrl(photoUrl);
  const resolvedCover = resolveMediaUrl(coverImageUrl);

  const formatTime = (sec: number) => {
    if (!isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const p = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      setProgress(p);
      setCurrentTime(formatTime(audio.currentTime));
    };

    const onLoaded = () => {
      setDuration(formatTime(audio.duration));
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    if (audio.duration) setDuration(formatTime(audio.duration));

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [audioRef]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef?.current;
    if (!audio || !audio.duration) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  const accentColor = theme?.accentColor || '#ec4899';
  const glowColor = theme?.glowColor || 'rgba(236,72,153,0.3)';

  return (
    <section
      id="cancion"
      ref={ref as React.RefObject<HTMLElement>}
      className="w-full max-w-[780px] mx-auto py-10 px-4 text-center"
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
        className={`reveal-scale reveal-delay-2 ${visible ? 'is-visible' : ''} relative w-full max-w-[420px] mx-auto mb-8 p-4 rounded-3xl border backdrop-blur-xl shadow-2xl`}
        style={{
          background: theme?.cardBg || 'rgba(10,4,18,0.82)',
          borderColor: theme?.cardBorder || 'rgba(255,131,182,0.25)',
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${glowColor}`,
        }}
      >
        {/* Equalizer bars — animated when playing */}
        <div className="absolute top-4 right-4 flex items-end gap-0.5 h-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`music-bar ${isPlaying ? '' : 'music-bar-paused'}`}
              style={{ height: `${10 + i * 3}px`, backgroundColor: accentColor }}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Cover art — vinyl spin when playing */}
          <div className="relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden shadow-xl"
            style={{ boxShadow: `0 0 20px ${glowColor}` }}>
            {resolvedCover ? (
              <img
                src={resolvedCover}
                alt="Portada"
                className={`w-full h-full object-cover ${isPlaying ? 'animate-vinyl-spin' : 'animate-vinyl-spin-paused'}`}
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${isPlaying ? 'animate-vinyl-spin' : ''}`}
                style={{ background: `radial-gradient(circle, ${accentColor}33 0%, ${accentColor}11 100%)` }}
              >
                <Music2 className="w-8 h-8" style={{ color: accentColor }} />
              </div>
            )}
            {/* Vinyl center dot */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3 h-3 rounded-full bg-slate-900/60 border border-white/20" />
            </div>
          </div>

          {/* Song info */}
          <div className="flex-1 text-left min-w-0">
            <p
              className="font-bold text-base truncate"
              style={{ color: theme?.titleColor || '#ffffff' }}
            >
              {songName}
            </p>
            <p className="text-xs opacity-65 truncate" style={{ color: theme?.textColor || '#cbd5e1' }}>
              {artist}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="mt-4 h-1.5 rounded-full bg-white/10 cursor-pointer overflow-hidden"
          onClick={handleSeek}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${accentColor}, #f9a8d4)`,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
        </div>

        {/* Time + Controls */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] font-mono opacity-50" style={{ color: theme?.textColor || '#fff' }}>
            {currentTime}
          </span>

          {/* Play/Pause */}
          <button
            type="button"
            onClick={onTogglePlay}
            className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition hover:scale-110 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #f43f5e)`,
              boxShadow: `0 4px 20px ${glowColor}`,
            }}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white translate-x-0.5" />
            )}
          </button>

          <span className="text-[10px] font-mono opacity-50" style={{ color: theme?.textColor || '#fff' }}>
            {duration}
          </span>
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
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-7 rounded-sm opacity-75 z-10"
            style={{ background: 'rgba(255,240,200,0.55)', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
          />

          {/* Polaroid frame */}
          <div
            className="p-3 pb-8 shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3)',
            }}
          >
            <img
              src={resolvedPhoto}
              alt="Foto especial"
              className="w-64 sm:w-72 h-72 sm:h-80 object-cover block"
              style={{ display: 'block' }}
            />
          </div>

          {/* Caption */}
          {photoCaption && (
            <p className="mt-2 text-center text-xs font-serif italic opacity-70" style={{ color: theme?.textColor || '#fff' }}>
              {photoCaption}
            </p>
          )}
        </div>
      )}

      {/* Floating hearts decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="absolute text-lg opacity-0"
            style={{
              left: `${15 + i * 14}%`,
              bottom: '-10px',
              fontSize: `${12 + (i % 3) * 6}px`,
              color: accentColor,
              filter: `drop-shadow(0 0 6px ${accentColor})`,
              animation: `waveFloat ${6 + i * 1.2}s ${i * 0.8}s linear infinite`,
            }}
          >
            ♥
          </span>
        ))}
      </div>
    </section>
  );
};
