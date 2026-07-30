import React from 'react';
import { TimelineEvent, ThemeConfig } from '@recuerdos-qr/shared';
import { Calendar } from 'lucide-react';
import { useInView } from '../../hooks/useAnimation';

interface TimelineSectionProps {
  events: TimelineEvent[];
  theme?: ThemeConfig;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ events, theme }) => {
  const [ref, visible] = useInView(0.05);

  if (!events || !events.length) return null;

  const accentColor = theme?.accentColor || '#ec4899';

  return (
    <section
      id="historia"
      ref={ref as React.RefObject<HTMLElement>}
      className="w-full max-w-[780px] mx-auto py-12 px-4"
    >
      <div className="text-center mb-10">
        <span
          className={`reveal ${visible ? 'is-visible' : ''} uppercase tracking-widest text-xs font-bold block mb-2`}
          style={{ color: theme?.kickerColor || '#ffd7e8' }}
        >
          Línea de tiempo
        </span>
        <h2
          className={`reveal reveal-delay-1 ${visible ? 'is-visible' : ''} text-4xl sm:text-5xl font-serif mt-2 mb-2 script-title shimmer-text`}
          style={{ color: theme?.titleColor || '#ff83b6', fontFamily: theme?.fontTitle }}
        >
          Nuestra historia
        </h2>
      </div>

      <div className="relative max-w-[620px] mx-auto pl-6 sm:pl-8 space-y-6">
        {/* Animated vertical line */}
        <div
          className="absolute top-0 bottom-0 left-[11px] sm:left-[15px] w-0.5"
          style={{
            background: `linear-gradient(to bottom, transparent, ${accentColor}80 10%, ${accentColor} 50%, ${accentColor}80 90%, transparent)`,
            boxShadow: `0 0 8px ${accentColor}55`,
          }}
        />

        {events.map((evt, idx) => (
          <div
            key={evt.id}
            className={`reveal-left ${visible ? 'is-visible' : ''} relative`}
            style={{ transitionDelay: `${idx * 0.12}s` }}
          >
            {/* Timeline dot */}
            <div
              className="absolute -left-[19px] sm:-left-[23px] top-4 w-6 h-6 rounded-full border-4 flex items-center justify-center shadow-lg animate-beat"
              style={{
                backgroundColor: accentColor,
                borderColor: theme?.bgGradient ? '#120008' : '#120008',
                boxShadow: `0 0 12px ${accentColor}88`,
                animationDelay: `${idx * 0.3}s`,
              }}
            >
              <Calendar className="w-2.5 h-2.5 text-white" />
            </div>

            {/* Event card */}
            <div
              className="p-5 rounded-2xl border shadow-xl transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: theme?.cardBg || 'rgba(255,255,255,0.07)',
                borderColor: theme?.cardBorder || `${accentColor}22`,
                color: theme?.textColor || '#ffffff',
                boxShadow: `0 8px 30px rgba(0,0,0,0.3)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 50px rgba(0,0,0,0.4), 0 0 20px ${accentColor}33`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
              }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wider opacity-85"
                style={{ color: theme?.titleColor || accentColor }}
              >
                {evt.event_date}
              </span>
              <h3 className="text-xl font-bold mt-1 mb-2">{evt.title}</h3>
              <p className="text-sm leading-relaxed opacity-90">{evt.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
