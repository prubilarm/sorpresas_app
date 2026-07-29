import React from 'react';
import { TimelineEvent, ThemeConfig } from '@recuerdos-qr/shared';
import { Calendar } from 'lucide-react';

interface TimelineSectionProps {
  events: TimelineEvent[];
  theme?: ThemeConfig;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ events, theme }) => {
  if (!events || !events.length) return null;

  return (
    <section id="historia" className="w-full max-w-[780px] mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <span className="uppercase tracking-widest text-xs font-bold" style={{ color: theme?.kickerColor }}>Línea de tiempo</span>
        <h2
          className="text-4xl sm:text-6xl font-serif mt-2 mb-2 script-title"
          style={{ color: theme?.titleColor, fontFamily: theme?.fontTitle }}
        >
          Nuestra historia
        </h2>
      </div>

      <div className="relative max-w-[620px] mx-auto border-l-2 border-pink-500/40 pl-6 sm:pl-8 space-y-6">
        {events.map((evt) => (
          <div key={evt.id} className="relative">
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-pink-500 border-4 border-pink-950 flex items-center justify-center shadow-lg">
              <Calendar className="w-3 h-3 text-white" />
            </div>
            <div
              className="p-5 rounded-2xl border shadow-xl"
              style={{
                background: theme?.cardBg || 'rgba(255,255,255,0.08)',
                borderColor: theme?.cardBorder || 'rgba(255,255,255,0.1)',
                color: theme?.textColor || '#ffffff',
              }}
            >
              <span className="text-xs font-bold uppercase tracking-wider opacity-85" style={{ color: theme?.titleColor }}>
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
