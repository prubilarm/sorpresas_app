import React from 'react';
import { ThemeConfig } from '@recuerdos-qr/shared';
import { useInView } from '../../hooks/useAnimation';

interface LetterSectionProps {
  kicker?: string;
  heading?: string;
  title?: string;
  contentRaw?: string;
  defaultContent?: string[];
  signature?: string;
  theme?: ThemeConfig;
}

export const LetterSection: React.FC<LetterSectionProps> = ({
  kicker = 'Lo que siento por ti',
  heading = 'Un mensaje especial',
  title = 'Para ti',
  contentRaw,
  defaultContent,
  signature = 'Con todo mi cariño',
  theme,
}) => {
  const [ref, visible] = useInView(0.15);

  let paragraphs: string[] = [];
  try {
    if (contentRaw) {
      const parsed = JSON.parse(contentRaw);
      if (Array.isArray(parsed)) {
        paragraphs = parsed.map((p) => String(p)).filter((p) => p.trim().length > 0);
      } else {
        paragraphs = String(contentRaw).split(/\n+/).filter((p) => p.trim().length > 0);
      }
    }
  } catch (err) {
    if (contentRaw) paragraphs = String(contentRaw).split(/\n+/).filter((p) => p.trim().length > 0);
  }

  if (!paragraphs.length) {
    paragraphs = defaultContent || [
      'Hay personas que iluminan nuestra vida de una forma única, y tú eres una de ellas.',
      'Este detalle fue preparado con mucho cariño para celebrar todos los momentos especiales que compartimos.',
    ];
  }

  return (
    <section
      id="carta"
      ref={ref as React.RefObject<HTMLElement>}
      className="w-full max-w-[780px] mx-auto py-12 px-4 text-center"
    >
      {/* Section Header */}
      <div className="mb-6 space-y-1">
        {kicker && (
          <span
            className={`reveal ${visible ? 'is-visible' : ''} uppercase tracking-[0.2em] text-xs font-bold block`}
            style={{ color: theme?.kickerColor || '#ffd7e8' }}
          >
            {kicker}
          </span>
        )}
        <h2
          className={`reveal reveal-delay-1 ${visible ? 'is-visible' : ''} text-4xl sm:text-6xl font-serif script-title leading-tight`}
          style={{ color: theme?.titleColor || '#ffffff', fontFamily: theme?.fontTitle || 'Georgia, serif' }}
        >
          {heading}
        </h2>
      </div>

      {/* Letter Card */}
      <article
        className={`reveal-scale ${visible ? 'is-visible' : ''} relative w-full max-w-[640px] mx-auto p-8 sm:p-12 rounded-[32px] text-center shadow-2xl overflow-hidden border backdrop-blur-xl`}
        style={{
          background: theme?.cardBg || 'rgba(0,0,0,0.4)',
          borderColor: theme?.cardBorder || 'rgba(255,255,255,0.15)',
          color: theme?.textColor || '#ffffff',
          boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 50px ${theme?.glowColor || 'rgba(0,0,0,0)'}`,
        }}
      >
        {/* Quote Symbol Accent */}
        <div
          className="font-serif text-6xl sm:text-7xl leading-none select-none opacity-40 mb-2"
          style={{ color: theme?.titleColor || '#ff83b6' }}
        >
          “
        </div>

        {/* Letter Card Title / Subtitle */}
        {title && (
          <h3
            className="text-2xl sm:text-4xl font-serif mb-6 font-semibold"
            style={{ color: theme?.titleColor || '#ffffff', fontFamily: theme?.fontTitle || 'Georgia, serif' }}
          >
            {title}
          </h3>
        )}

        {/* Letter Paragraphs */}
        <div className="space-y-5 font-serif italic text-base sm:text-lg leading-relaxed text-center opacity-95">
          {paragraphs.map((p, idx) => (
            <p
              key={idx}
              className={`reveal reveal-delay-${Math.min(idx + 2, 4)} ${visible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${0.1 + idx * 0.1}s` }}
            >
              {p}
            </p>
          ))}
        </div>

        {/* Signature */}
        {signature && (
          <div className="mt-8 pt-6 border-t border-white/15">
            <p
              className={`reveal reveal-delay-4 ${visible ? 'is-visible' : ''} font-serif text-xl sm:text-2xl font-bold`}
              style={{ color: theme?.titleColor || '#ffffff', fontFamily: theme?.fontTitle || 'Georgia, serif' }}
            >
              {signature}
            </p>
          </div>
        )}
      </article>
    </section>
  );
};
