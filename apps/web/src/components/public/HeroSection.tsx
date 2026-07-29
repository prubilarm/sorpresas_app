import React from 'react';
import { ThemeConfig, IconType } from '@recuerdos-qr/shared';
import { useInView } from '../../hooks/useAnimation';
import { DynamicIcon } from './DynamicIcon';

interface HeroSectionProps {
  dateLabel: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  coverUrl?: string;
  icon?: IconType;
  theme?: ThemeConfig;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  dateLabel,
  kicker,
  title,
  subtitle,
  coverUrl,
  icon = 'heart',
  theme,
}) => {
  const [ref, visible] = useInView(0.1);

  return (
    <section
      id="inicio"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full max-w-[780px] mx-auto pt-8 pb-12 px-4 text-center"
    >
      {/* Kicker Tag */}
      {kicker && (
        <span
          className={`reveal ${visible ? 'is-visible' : ''} text-xs font-bold uppercase tracking-[0.2em] block mb-2`}
          style={{ color: theme?.kickerColor || '#ffd7e8' }}
        >
          {kicker}
        </span>
      )}

      {/* Date Pill */}
      <div
        className={`reveal reveal-delay-1 ${visible ? 'is-visible' : ''} relative inline-flex items-center gap-2 py-2 px-6 rounded-full text-xs font-black tracking-widest uppercase shadow-lg`}
        style={{
          backgroundColor: theme?.accentColor || '#df2878',
          color: '#ffffff',
          boxShadow: `0 6px 24px ${theme?.glowColor || 'rgba(220,40,110,0.4)'}`,
        }}
      >
        <DynamicIcon icon={icon} className="w-3.5 h-3.5" />
        {dateLabel}
      </div>

      {/* Script Title */}
      <h1
        className={`reveal reveal-delay-2 ${visible ? 'is-visible' : ''} relative text-4xl sm:text-6xl font-serif mt-5 mb-4 leading-tight drop-shadow-md`}
        style={{
          color: theme?.titleColor || '#ff83b6',
          fontFamily: theme?.fontTitle || 'Georgia, serif',
        }}
      >
        {title || 'Una historia especial'}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <div
          className={`reveal reveal-delay-3 ${visible ? 'is-visible' : ''} relative max-w-[620px] mx-auto mb-6 p-5 border-l-4 rounded-r-2xl text-left shadow-lg`}
          style={{
            background: theme?.cardBg || 'rgba(0,0,0,0.2)',
            borderColor: theme?.accentColor || '#df2878',
            color: theme?.textColor || '#ffffff',
          }}
        >
          <p className="text-sm sm:text-base leading-relaxed">{subtitle}</p>
        </div>
      )}

      {/* Cover Photo */}
      <div
        className={`reveal-scale reveal-delay-4 ${visible ? 'is-visible' : ''} relative max-w-[620px] mx-auto p-2 rounded-3xl overflow-hidden shadow-2xl`}
        style={{
          background: theme?.cardBg || 'rgba(255,255,255,0.1)',
          border: `1.5px solid ${theme?.cardBorder || 'rgba(255,255,255,0.2)'}`,
          boxShadow: `0 30px 70px rgba(0,0,0,0.5), 0 0 60px ${theme?.glowColor || 'rgba(220,40,110,0.12)'}`,
          transition: 'transform 0.4s ease, box-shadow 0.4s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.012)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        <img
          src={coverUrl || '/assets/fotos/portada.svg'}
          alt="Foto principal de la pareja"
          className="w-full max-h-[550px] min-h-[300px] object-cover rounded-2xl bg-black"
          style={{ transition: 'filter 0.6s ease' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/fotos/portada.svg';
          }}
        />
      </div>
    </section>
  );
};
