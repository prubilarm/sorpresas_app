import React from 'react';
import { RotateCcw } from 'lucide-react';
import { ThemeConfig, IconType, ParticleType } from '@recuerdos-qr/shared';
import { useInView } from '../../hooks/useAnimation';
import { DynamicIcon } from './DynamicIcon';
import { DynamicParticles } from './DynamicParticles';

interface FinalSectionProps {
  personOneName: string;
  personTwoName: string;
  finalMessage?: string;
  finalTitle?: string;
  signature?: string;
  particleType?: ParticleType;
  icon?: IconType;
  theme?: ThemeConfig;
  onRestart: () => void;
}

export const FinalSection: React.FC<FinalSectionProps> = ({
  personOneName,
  personTwoName,
  finalMessage = 'Con todo nuestro cariño siempre.',
  finalTitle = 'Gracias por estar',
  signature,
  particleType = 'hearts',
  icon = 'heart',
  theme,
  onRestart,
}) => {
  const [ref, visible] = useInView(0.1);
  const accentColor = theme?.accentColor || '#ec4899';
  const glowColor = theme?.glowColor || 'rgba(220,40,110,0.25)';

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full max-w-[780px] mx-auto pt-8 pb-24 px-4 text-center overflow-hidden"
    >
      {/* Particle Effects */}
      <DynamicParticles type={particleType} speed="medium" color={accentColor} />

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 65%)`,
        }}
      />

      <div
        className={`reveal-scale ${visible ? 'is-visible' : ''} relative z-10 p-8 sm:p-11 rounded-[30px] border shadow-2xl space-y-4`}
        style={{
          background: theme?.cardBg || 'rgba(0,0,0,0.4)',
          borderColor: theme?.cardBorder || `${accentColor}33`,
          color: theme?.textColor || '#ffffff',
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 80px ${glowColor}`,
        }}
      >
        {/* Burst icon */}
        <div
          className={`flex justify-center my-1 ${visible ? 'animate-heart-burst' : 'opacity-0'}`}
          style={{ animationDelay: '0.3s' }}
        >
          <DynamicIcon
            icon={icon}
            className="w-16 h-16 animate-glow-pulse drop-shadow-[0_0_24px_rgba(255,255,255,0.6)]"
            style={{ color: accentColor }}
          />
        </div>

        <p
          className={`reveal reveal-delay-1 ${visible ? 'is-visible' : ''} max-w-[560px] mx-auto font-serif italic text-lg sm:text-xl leading-relaxed opacity-95`}
        >
          {finalMessage}
        </p>

        <h2
          className={`reveal reveal-delay-2 ${visible ? 'is-visible' : ''} text-4xl sm:text-6xl font-serif script-title my-3 shimmer-text`}
          style={{ color: theme?.titleColor || accentColor, fontFamily: theme?.fontTitle }}
        >
          {finalTitle}
        </h2>

        {/* Signature with golden shimmer */}
        <p
          className={`reveal reveal-delay-3 ${visible ? 'is-visible' : ''} font-bold text-xl tracking-wide shimmer-text`}
          style={{ color: theme?.titleColor || '#ffd7e8' }}
        >
          {signature || `${personOneName} & ${personTwoName}`}
        </p>

        {/* Decorative hearts row */}
        <div
          className={`reveal reveal-delay-4 ${visible ? 'is-visible' : ''} flex justify-center gap-3 text-2xl`}
        >
          {['♥', '♥', '♥'].map((h, i) => (
            <span
              key={i}
              className="animate-beat"
              style={{
                color: accentColor,
                filter: `drop-shadow(0 0 8px ${accentColor})`,
                animationDelay: `${i * 0.25}s`,
              }}
            >
              {h}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onRestart}
          className={`reveal reveal-delay-5 ${visible ? 'is-visible' : ''} inline-flex items-center gap-2 mt-4 py-2.5 px-6 rounded-full border text-sm font-semibold hover:bg-white/10 transition shadow-md`}
          style={{ borderColor: theme?.cardBorder || 'rgba(255,255,255,0.3)', color: theme?.textColor }}
        >
          <RotateCcw className="w-4 h-4" />
          Volver al comienzo
        </button>
      </div>
    </section>
  );
};
