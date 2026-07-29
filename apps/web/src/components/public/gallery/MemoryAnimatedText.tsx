import React, { useState, useEffect } from 'react';
import { MediaItem, ThemeConfig } from '@recuerdos-qr/shared';

interface MemoryAnimatedTextProps {
  photo: MediaItem | null;
  theme?: ThemeConfig;
}

export const MemoryAnimatedText: React.FC<MemoryAnimatedTextProps> = ({ photo, theme }) => {
  const [displayedPhoto, setDisplayedPhoto] = useState<MediaItem | null>(photo);
  const [textState, setTextState] = useState<'entering' | 'visible' | 'exiting'>('visible');

  useEffect(() => {
    if (photo?.id !== displayedPhoto?.id) {
      // 1. Exit old text
      setTextState('exiting');
      const timerOut = setTimeout(() => {
        setDisplayedPhoto(photo);
        setTextState('entering');
        const timerIn = setTimeout(() => {
          setTextState('visible');
        }, 100);
        return () => clearTimeout(timerIn);
      }, 250);

      return () => clearTimeout(timerOut);
    }
  }, [photo, displayedPhoto]);

  if (!displayedPhoto) return null;

  const title = displayedPhoto.title || displayedPhoto.caption;
  const subtitle = displayedPhoto.subtitle || displayedPhoto.description;
  const date = displayedPhoto.event_date;
  const position = displayedPhoto.text_position || 'bottom';

  if (!title && !subtitle && !date) return null;

  // Split phrase into words for staggered animation
  const titleWords = title ? title.split(' ') : [];
  const subtitleWords = subtitle ? subtitle.split(' ') : [];

  return (
    <div
      className={`relative z-20 w-full max-w-[580px] mx-auto px-4 mt-4 transition-all duration-300 text-center select-none ${
        textState === 'exiting'
          ? 'opacity-0 translate-y-[-10px] blur-[3px]'
          : 'opacity-100 translate-y-0 blur-0'
      }`}
    >
      <div
        className="p-5 sm:p-6 rounded-2xl backdrop-blur-xl border border-white/15 shadow-2xl transition-all duration-500"
        style={{
          background: theme?.cardBg || 'rgba(15, 8, 22, 0.75)',
          borderColor: theme?.cardBorder || 'rgba(255, 255, 255, 0.15)',
          color: theme?.textColor || '#ffffff',
        }}
      >
        {/* Title Words */}
        {titleWords.length > 0 && (
          <h3
            className="text-xl sm:text-3xl font-serif font-bold leading-snug tracking-wide flex flex-wrap justify-center gap-x-1.5 gap-y-1 mb-2"
            style={{ color: theme?.titleColor || '#ffffff', fontFamily: theme?.fontTitle || 'Georgia, serif' }}
          >
            {titleWords.map((word, i) => (
              <span
                key={i}
                className="inline-block transition-all duration-500 transform animate-fade-in-up"
                style={{
                  animationDelay: `${i * 45}ms`,
                }}
              >
                {word}
              </span>
            ))}
          </h3>
        )}

        {/* Subtitle / Description Words */}
        {subtitleWords.length > 0 && (
          <p className="text-sm sm:text-base font-serif italic opacity-95 leading-relaxed flex flex-wrap justify-center gap-x-1 gap-y-0.5 max-w-[500px] mx-auto">
            {subtitleWords.map((word, i) => (
              <span
                key={i}
                className="inline-block transition-all duration-500 transform animate-fade-in-up"
                style={{
                  animationDelay: `${(titleWords.length + i) * 35}ms`,
                }}
              >
                {word}
              </span>
            ))}
          </p>
        )}

        {/* Optional Date Pill */}
        {date && (
          <div className="mt-3 pt-2 border-t border-white/10 flex justify-center">
            <span
              className="text-[10px] sm:text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full font-bold opacity-80"
              style={{
                backgroundColor: theme?.accentColor || '#ec4899',
                color: '#ffffff',
              }}
            >
              {date}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
