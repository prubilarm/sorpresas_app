import React from 'react';
import { Heart } from 'lucide-react';
import { ThemeConfig } from '@recuerdos-qr/shared';
import { useInView } from '../../hooks/useAnimation';

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
  const [ref, visible] = useInView(0.1);

  const list = reasons && reasons.length ? reasons : [
    { id: '1', title: 'Tu sonrisa', description: 'Porque ilumina cada uno de mis días y hace que todo valga la pena.' },
    { id: '2', title: 'Tu paciencia', description: 'Por la forma tan dulce en que me escuchas y me entiendes siempre.' },
    { id: '3', title: 'Nuestra complicidad', description: 'Por las risas y miradas que solo nosotros entendemos.' },
    { id: '4', title: 'Tu forma de ser', description: 'Porque eres auténtica, única, y exactamente quien necesito.' },
    { id: '5', title: 'Tus detalles', description: 'Cada pequeño gesto que demuestras que me tienes presente.' },
    { id: '6', title: 'Todo lo que me enseñas', description: 'Porque cada día a tu lado aprendo algo nuevo sobre amar.' },
  ];

  const accentColor = theme?.accentColor || '#ec4899';

  return (
    <section
      id="razones"
      ref={ref as React.RefObject<HTMLElement>}
      className="w-full max-w-[780px] mx-auto py-12 px-4"
    >
      <div className="text-center mb-10">
        <span
          className={`reveal ${visible ? 'is-visible' : ''} uppercase tracking-widest text-xs font-bold block mb-2`}
          style={{ color: theme?.kickerColor || '#ffd7e8' }}
        >
          Detalles especiales
        </span>
        <h2
          className={`reveal reveal-delay-1 ${visible ? 'is-visible' : ''} text-4xl sm:text-5xl font-serif mt-2 mb-2 script-title shimmer-text`}
          style={{ color: theme?.titleColor || '#ff83b6', fontFamily: theme?.fontTitle }}
        >
          Lo que me gusta de ti
        </h2>
        <p
          className={`reveal reveal-delay-2 ${visible ? 'is-visible' : ''} text-sm opacity-70 max-w-xs mx-auto`}
          style={{ color: theme?.textColor }}
        >
          Hay tantas razones... aquí van algunas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[720px] mx-auto">
        {list.map((item, idx) => {
          const isLeft = idx % 2 === 0;
          const revealClass = isLeft ? 'reveal-left' : 'reveal-right';
          const delayStyle = { transitionDelay: `${idx * 0.1}s` };

          return (
            <div
              key={item.id}
              className={`${revealClass} ${visible ? 'is-visible' : ''} group p-5 rounded-2xl border shadow-lg text-center space-y-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-default`}
              style={{
                ...delayStyle,
                background: theme?.cardBg || 'rgba(255,255,255,0.06)',
                borderColor: theme?.cardBorder || `${accentColor}33`,
                color: theme?.textColor || '#ffffff',
                boxShadow: `0 8px 30px rgba(0,0,0,0.3)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 50px rgba(0,0,0,0.4), 0 0 30px ${accentColor}33`;
                (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}66`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
                (e.currentTarget as HTMLElement).style.borderColor = theme?.cardBorder || `${accentColor}33`;
              }}
            >
              <Heart
                className="w-7 h-7 mx-auto animate-beat"
                style={{
                  color: accentColor,
                  fill: `${accentColor}44`,
                  filter: `drop-shadow(0 0 6px ${accentColor}88)`,
                  animationDelay: `${idx * 0.2}s`,
                }}
              />
              <h4
                className="font-bold text-base"
                style={{ color: theme?.titleColor || accentColor }}
              >
                {item.title}
              </h4>
              <p className="text-xs leading-relaxed opacity-80">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
