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

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full max-w-[780px] mx-auto pt-8 pb-24 px-4 text-center"
    >
      {/* Particle Effects */}
      <DynamicParticles type={particleType} speed="medium" color={theme?.accentColor} />

      <div
        className={`reveal-scale ${visible ? 'is-visible' : ''} relative z-10 p-8 sm:p-11 rounded-[30px] border shadow-2xl space-y-4`}
        style={{
          background: theme?.cardBg || 'rgba(0,0,0,0.4)',
          borderColor: theme?.cardBorder || 'rgba(255,255,255,0.1)',
          color: theme?.textColor || '#ffffff',
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${theme?.glowColor || 'rgba(220,40,110,0.15)'}`,
        }}
      >
        <div className="flex justify-center my-1">
          <DynamicIcon
            icon={icon}
            className="w-14 h-14 animate-pulse drop-shadow-[0_0_18px_rgba(255,255,255,0.5)]"
            style={{ color: theme?.titleColor || '#ffffff' }}
          />
        </div>

        <p
          className={`reveal reveal-delay-1 ${visible ? 'is-visible' : ''} max-w-[560px] mx-auto font-serif italic text-lg sm:text-xl leading-relaxed opacity-95`}
        >
          {finalMessage}
        </p>

        <h2
          className={`reveal reveal-delay-2 ${visible ? 'is-visible' : ''} text-4xl sm:text-6xl font-serif script-title my-3`}
          style={{ color: theme?.titleColor, fontFamily: theme?.fontTitle }}
        >
          {finalTitle}
        </h2>

        <p
          className={`reveal reveal-delay-3 ${visible ? 'is-visible' : ''} font-bold text-lg tracking-wide`}
        >
          {signature || `${personOneName} & ${personTwoName}`}
        </p>

        <button
          type="button"
          onClick={onRestart}
          className={`reveal reveal-delay-4 ${visible ? 'is-visible' : ''} inline-flex items-center gap-2 mt-4 py-2.5 px-6 rounded-full border text-sm font-semibold hover:bg-white/10 transition shadow-md`}
          style={{ borderColor: theme?.cardBorder || 'rgba(255,255,255,0.3)', color: theme?.textColor }}
        >
          <RotateCcw className="w-4 h-4" />
          Volver al comienzo
        </button>
      </div>
    </section>
  );
};
