import React from 'react';
import { calculateTimeElapsed, ThemeConfig } from '@recuerdos-qr/shared';
import { useInView, useCountUp } from '../../hooks/useAnimation';

interface TimeCounterProps {
  startDate: string;
  title?: string;
  footer?: string;
  customYears?: number | string;
  customMonths?: number | string;
  customDays?: number | string;
  displayMode?: 'elapsed_time' | 'countdown' | 'show_date_only' | 'hidden';
  theme?: ThemeConfig;
}

interface AnimatedNumberProps {
  value: number;
  label: string;
  active: boolean;
  delay: number;
  numColor: string;
  labelColor: string;
  glowColor: string;
  fontTitle?: string;
  themeCardBg?: string;
  dividerColor?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  label,
  active,
  delay,
  numColor,
  labelColor,
  glowColor,
  fontTitle,
  themeCardBg,
  dividerColor,
}) => {
  const animated = useCountUp(value, 1200 + delay * 200, active);

  return (
    <div
      className="flex flex-col items-center justify-center py-5 px-2 rounded-2xl"
      style={{
        background: glowColor ? `${glowColor}` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${dividerColor || 'rgba(255,255,255,0.06)'}`,
        transition: 'transform 0.3s ease',
      }}
    >
      <strong
        className={`block text-4xl sm:text-5xl font-black leading-none ${active ? 'num-pop' : 'opacity-0'}`}
        style={{
          color: numColor,
          fontFamily: fontTitle,
          animationDelay: `${delay * 0.15}s`,
        }}
      >
        {active ? animated : 0}
      </strong>
      <small
        className="mt-2 uppercase tracking-widest text-[10px] font-bold"
        style={{ color: labelColor, opacity: 0.75 }}
      >
        {label}
      </small>
    </div>
  );
};

export const TimeCounter: React.FC<TimeCounterProps> = ({
  startDate,
  title = 'Desde aquel día han pasado',
  footer = 'y cada momento sigue siendo inolvidable.',
  customYears,
  customMonths,
  customDays,
  displayMode = 'elapsed_time',
  theme,
}) => {
  if (displayMode === 'hidden') return null;

  const elapsed = calculateTimeElapsed(startDate);
  const [ref, visible] = useInView(0.2);

  const displayYears = customYears !== undefined && customYears !== '' ? Number(customYears) : elapsed.years;
  const displayMonths = customMonths !== undefined && customMonths !== '' ? Number(customMonths) : elapsed.months;
  const displayDays = customDays !== undefined && customDays !== '' ? Number(customDays) : elapsed.days;

  const counterBg = theme?.counterBg || theme?.cardBg || 'rgba(0,0,0,0.3)';
  const numColor = theme?.counterNumberColor || theme?.titleColor || '#ffffff';
  const labelColor = theme?.counterLabelColor || theme?.kickerColor || 'rgba(255,255,255,0.5)';

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${visible ? 'is-visible' : ''} w-full max-w-[620px] mx-auto mt-6 px-6 py-8 rounded-3xl text-center shadow-2xl animate-border-pulse`}
      style={{
        background: counterBg,
        border: `1.5px solid ${theme?.dividerColor || theme?.cardBorder || 'rgba(255,255,255,0.1)'}`,
        color: theme?.textColor || '#ffffff',
        boxShadow: theme?.cardShadow || '0 20px 60px rgba(0,0,0,0.4)',
      }}
    >
      {/* Counter grid or date view */}
      {displayMode !== 'show_date_only' ? (
        <div className="grid grid-cols-3 gap-3 my-2">
          <AnimatedNumber
            value={displayYears}
            label="años"
            active={visible}
            delay={0}
            numColor={numColor}
            labelColor={labelColor}
            glowColor={theme?.glowColor || 'rgba(255,255,255,0.05)'}
            fontTitle={theme?.fontTitle}
            dividerColor={theme?.dividerColor}
          />
          <AnimatedNumber
            value={displayMonths}
            label="meses"
            active={visible}
            delay={1}
            numColor={numColor}
            labelColor={labelColor}
            glowColor={theme?.glowColor || 'rgba(255,255,255,0.05)'}
            fontTitle={theme?.fontTitle}
            dividerColor={theme?.dividerColor}
          />
          <AnimatedNumber
            value={displayDays}
            label="días"
            active={visible}
            delay={2}
            numColor={numColor}
            labelColor={labelColor}
            glowColor={theme?.glowColor || 'rgba(255,255,255,0.05)'}
            fontTitle={theme?.fontTitle}
            dividerColor={theme?.dividerColor}
          />
        </div>
      ) : (
        <div className="py-4 font-serif text-2xl sm:text-3xl font-bold" style={{ color: numColor, fontFamily: theme?.fontTitle }}>
          {new Date(startDate).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      )}

      {/* Footer */}
      {footer && (
        <p
          className={`mt-5 text-sm opacity-90 italic leading-relaxed reveal reveal-delay-4 ${visible ? 'is-visible' : ''}`}
          style={{ fontFamily: theme?.fontBody, color: theme?.textColor || '#ffffff' }}
        >
          {footer}
        </p>
      )}
    </div>
  );
};
