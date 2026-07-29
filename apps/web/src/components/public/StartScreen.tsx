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

  return (
    <div
      onClick={onStart}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onStart();
      }}
      tabIndex={0}
      role="button"
      aria-label="Comenzar experiencia"
      className="fixed inset-0 z-50 flex items-center justify-center p-6 cursor-pointer select-none"
      style={{
        background: theme?.bgGradient || 'radial-gradient(circle at center, #5c0b26, #2e0213 50%, #130008)',
      }}
    >
      <div className="absolute w-[280px] h-[280px] rounded-full bg-pink-500/20 blur-[90px] pointer-events-none" />

      <div
        className="relative w-full max-w-[430px] text-center border rounded-[36px] p-8 sm:p-11 shadow-2xl space-y-4 backdrop-blur-xl"
        style={{
          background: theme?.cardBg || 'rgba(255,255,255,0.06)',
          borderColor: theme?.cardBorder || 'rgba(255,255,255,0.15)',
          color: theme?.textColor || '#ffffff',
        }}
      >
        <span
          className="uppercase tracking-[0.2em] text-xs font-bold block"
          style={{ color: theme?.kickerColor || '#ffd7e8' }}
        >
          {kicker}
        </span>

        <div className="flex justify-center my-2">
          <DynamicIcon
            icon={icon}
            className="w-12 h-12 animate-pulse drop-shadow-[0_0_16px_rgba(255,255,255,0.4)]"
            style={{ color: theme?.titleColor || '#ffffff' }}
          />
        </div>

        <h1
          className="text-3xl sm:text-4xl font-serif script-title leading-tight"
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
          className={`w-full mt-4 py-3.5 px-6 rounded-full font-bold text-white shadow-xl hover:brightness-110 transition active:scale-95 ${
            theme?.buttonStyle || 'bg-gradient-to-r from-pink-500 to-rose-500'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
