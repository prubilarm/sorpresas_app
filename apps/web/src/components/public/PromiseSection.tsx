import React from 'react';
import { ThemeConfig, IconType } from '@recuerdos-qr/shared';
import { useInView } from '../../hooks/useAnimation';
import { DynamicIcon } from './DynamicIcon';

interface PromiseSectionProps {
  promise?: string;
  title?: string;
  icon?: IconType;
  theme?: ThemeConfig;
}

export const PromiseSection: React.FC<PromiseSectionProps> = ({
  promise = 'Prometo estar a tu lado en cada momento que me necesites, celebrar tus logros y acompañarte en tus sueños.',
  title = 'Una promesa para ti',
  icon = 'star',
  theme,
}) => {
  const [ref, visible] = useInView(0.15);

  const accentColor = theme?.accentColor || '#ec4899';
  const glowColor = theme?.glowColor || 'rgba(236,72,153,0.25)';

  return (
    <section
      id="promesa"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full max-w-[780px] mx-auto py-12 px-4 text-center overflow-hidden"
    >
      {/* Background glow radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Floating mini hearts */}
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className="absolute text-sm pointer-events-none"
          style={{
            left: `${8 + i * 11}%`,
            bottom: '-10px',
            color: accentColor,
            opacity: 0,
            filter: `drop-shadow(0 0 4px ${accentColor})`,
            animation: `waveFloat ${7 + i}s ${i * 0.6}s linear infinite`,
          }}
        >
          ♥
        </span>
      ))}

      <div className="relative z-10">
        {/* Kicker */}
        <span
          className={`reveal ${visible ? 'is-visible' : ''} uppercase tracking-[0.25em] text-xs font-bold block mb-2`}
          style={{ color: theme?.kickerColor || '#ffd7e8' }}
        >
          Con el corazón en la mano
        </span>

        {/* Title */}
        <h2
          className={`reveal reveal-delay-1 ${visible ? 'is-visible' : ''} text-4xl sm:text-5xl font-serif script-title leading-tight mb-8 shimmer-text`}
          style={{ color: theme?.titleColor || '#ff83b6', fontFamily: theme?.fontTitle }}
        >
          {title}
        </h2>

        {/* Promise Card */}
        <div
          className={`reveal-scale reveal-delay-2 ${visible ? 'is-visible' : ''} relative max-w-[580px] mx-auto p-8 sm:p-12 rounded-[32px] border backdrop-blur-xl shadow-2xl`}
          style={{
            background: theme?.cardBg || 'rgba(0,0,0,0.45)',
            borderColor: theme?.cardBorder || 'rgba(255,131,182,0.2)',
            boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 60px ${glowColor}`,
            color: theme?.textColor || '#ffffff',
          }}
        >
          {/* Animated icon */}
          <div
            className={`reveal reveal-delay-1 ${visible ? 'is-visible' : ''} flex justify-center mb-6`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center animate-glow-pulse`}
              style={{
                background: `${accentColor}22`,
                border: `2px solid ${accentColor}44`,
              }}
            >
              <DynamicIcon
                icon={icon}
                className="w-8 h-8 animate-beat"
                style={{ color: accentColor }}
              />
            </div>
          </div>

          {/* Promise text */}
          <blockquote
            className={`reveal reveal-delay-3 ${visible ? 'is-visible' : ''} font-serif italic text-lg sm:text-xl leading-relaxed opacity-95`}
            style={{
              fontFamily: theme?.fontTitle || 'Georgia, serif',
              color: theme?.textColor || '#fff8fc',
            }}
          >
            "{promise}"
          </blockquote>

          {/* Decorative line */}
          <div
            className={`reveal reveal-delay-4 ${visible ? 'is-visible' : ''} mt-8 flex items-center gap-4`}
          >
            <div className="flex-1 h-px" style={{ background: `${accentColor}30` }} />
            <DynamicIcon icon="heart" className="w-4 h-4 animate-beat" style={{ color: accentColor }} />
            <div className="flex-1 h-px" style={{ background: `${accentColor}30` }} />
          </div>
        </div>
      </div>
    </section>
  );
};
