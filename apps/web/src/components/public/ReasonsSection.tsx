import React from 'react';
import { Heart } from 'lucide-react';
import { ThemeConfig } from '@recuerdos-qr/shared';

interface ReasonItem {
  id: string;
  title: string;
  description: string;
}

interface ReasonsSectionProps {
  reasons?: ReasonItem[];
  theme?: ThemeConfig;
}

export const ReasonsSection: React.FC<ReasonsSectionProps> = ({ reasons, theme }) => {
  const list = reasons && reasons.length ? reasons : [
    { id: '1', title: 'Tu sonrisa', description: 'Porque ilumina cada uno de mis días.' },
    { id: '2', title: 'Tu paciencia', description: 'Por la forma tan dulce en que me escuchas.' },
    { id: '3', title: 'Nuestra complicidad', description: 'Por las risas y miradas que solo nosotros entendemos.' },
  ];

  return (
    <section className="w-full max-w-[780px] mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <span className="uppercase tracking-widest text-xs font-bold" style={{ color: theme?.kickerColor }}>Detalles especiales</span>
        <h2
          className="text-4xl sm:text-6xl font-serif mt-2 mb-2 script-title"
          style={{ color: theme?.titleColor, fontFamily: theme?.fontTitle }}
        >
          Razones por las que te amo
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[650px] mx-auto">
        {list.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border shadow-lg text-center space-y-2"
            style={{
              background: theme?.cardBg || 'rgba(255,255,255,0.08)',
              borderColor: theme?.cardBorder || 'rgba(255,255,255,0.1)',
              color: theme?.textColor || '#ffffff',
            }}
          >
            <Heart className="w-7 h-7 mx-auto text-pink-400 fill-pink-400/30" />
            <h4 className="font-bold text-base" style={{ color: theme?.titleColor }}>
              {item.title}
            </h4>
            <p className="text-xs leading-relaxed opacity-85">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
