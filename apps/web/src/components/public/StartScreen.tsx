import React from 'react';
import { ThemeConfig, IconType } from '@recuerdos-qr/shared';
import { DynamicIcon } from './DynamicIcon';

interface StartScreenProps {
  kicker?: string;
  productTitle?: string;
  senderName?: string;
  recipientName?: string;
  personOneName?: string;
  personTwoName?: string;
  icon?: IconType;
  buttonText?: string;
  theme?: ThemeConfig;
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  kicker = 'Un detalle hecho con cariño',
  productTitle = 'Una historia especial',
  senderName,
  recipientName,
  personOneName,
  personTwoName,
  icon = 'heart',
  buttonText = 'Toca para comenzar',
  theme,
  onStart,
}) => {
  const sender = senderName || personOneName || 'Remitente';
  const recipient = recipientName || personTwoName || 'Destinatario';
  const accentColor = theme?.accentColor || '#ec4899';

  // Generate floating heart particles
  const hearts = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    left: 5 + (i * 5.5) % 90,
    size: 10 + (i % 5) * 4,
    delay: (i * 0.55) % 6,
    duration: 7 + (i % 4) * 1.5,
  }));

  return (
    <div
      onClick={onStart}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onStart();
      }}
      tabIndex={0}
      role="button"
      aria-label="Comenzar experiencia"
      className="fixed inset-0 z-50 flex items-center justify-center p-6 cursor-pointer select-none overflow-hidden"
      style={{
        background: theme?.bgGradient || 'radial-gradient(circle at center, #5c0b26, #2e0213 50%, #130008)',
      }}
    >
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="absolute"
            style={{
              left: `${h.left}%`,
              bottom: '-20px',
              fontSize: `${h.size}px`,
              color: accentColor,
              opacity: 0,
              filter: `drop-shadow(0 0 5px ${accentColor}88)`,
              animation: `waveFloat ${h.duration}s ${h.delay}s linear infinite`,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Large ambient glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none animate-float"
        style={{ background: `radial-gradient(circle, ${accentColor}28 0%, transparent 70%)` }} />

      <div
        className="relative w-full max-w-[430px] text-center border rounded-[36px] p-8 sm:p-11 shadow-2xl space-y-4 backdrop-blur-xl"
        style={{
          background: theme?.cardBg || 'rgba(255,255,255,0.06)',
          borderColor: theme?.cardBorder || 'rgba(255,255,255,0.15)',
          color: theme?.textColor || '#ffffff',
          boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 60px ${theme?.glowColor || 'rgba(220,40,110,0.2)'}`,
        }}
      >
        <span
          className="uppercase tracking-[0.2em] text-xs font-bold block animate-pulse"
          style={{ color: theme?.kickerColor || '#ffd7e8' }}
        >
          {kicker}
        </span>

        <div className="flex justify-center my-2">
          <DynamicIcon
            icon={icon}
            className="w-14 h-14 animate-beat animate-glow-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            style={{ color: theme?.titleColor || '#ffffff' }}
          />
        </div>

        <h1
          className="text-3xl sm:text-4xl font-serif script-title leading-tight shimmer-text"
          style={{ color: theme?.titleColor || '#ffffff', fontFamily: theme?.fontTitle }}
        >
          {productTitle}
        </h1>

        <p className="text-base sm:text-lg font-medium opacity-95">
          De: <span className="font-bold">{sender}</span> → Para: <span className="font-bold">{recipient}</span>
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStart();
          }}
          className={`w-full mt-4 py-4 px-6 rounded-full font-bold text-white shadow-xl hover:brightness-110 transition active:scale-95 animate-pulse-button text-lg`}
          style={{
            background: `linear-gradient(135deg, ${accentColor}, #f43f5e)`,
            boxShadow: `0 8px 30px ${theme?.glowColor || 'rgba(220,40,110,0.45)'}`,
          }}
        >
          {buttonText}
        </button>

        <p className="text-[10px] opacity-40 tracking-widest uppercase">toca en cualquier lugar para comenzar</p>
      </div>
    </div>
  );
};
