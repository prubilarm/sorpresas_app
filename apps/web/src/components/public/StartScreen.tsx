import React, { useState, useCallback } from 'react';
import { ThemeConfig } from '@recuerdos-qr/shared';
import { Heart, Sparkles, Play } from 'lucide-react';

interface StartScreenProps {
  kicker?: string;
  productTitle?: string;
  senderName?: string;
  recipientName?: string;
  personOneName?: string;
  personTwoName?: string;
  icon?: any;
  buttonText?: string;
  theme?: ThemeConfig;
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  kicker = '✨ Un detalle preparado con todo mi amor',
  productTitle = 'Una historia especial',
  senderName,
  recipientName,
  personOneName,
  personTwoName,
  buttonText = 'Toca para abrir tu detalle',
  theme,
  onStart,
}) => {
  const sender = senderName || personOneName || 'Hans';
  const recipient = recipientName || personTwoName || 'Tamara';
  const accentColor = theme?.accentColor || '#ec4899';

  const [isOpening, setIsOpening] = useState(false);

  // Floating particles (smooth GPU acceleration)
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: (i * 4.8 + 3) % 94,
    size: 10 + (i % 5) * 4,
    delay: (i * 0.4) % 5,
    duration: 6 + (i % 4) * 1.5,
    isHeart: i % 2 === 0,
  }));

  // Immediate Click Handler (Ensures Browser Autoplay Approval for Song!)
  const handleClick = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);

    // Smooth 300ms transition before revealing content & starting music
    setTimeout(() => {
      onStart();
    }, 300);
  }, [isOpening, onStart]);

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
      tabIndex={0}
      role="button"
      aria-label="Abrir regalo especial"
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 cursor-pointer select-none overflow-hidden transition-all duration-300 ease-out ${
        isOpening ? 'opacity-0 scale-105 filter blur-sm pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: theme?.bgGradient || 'radial-gradient(circle at center, #3d0517 0%, #1c020b 60%, #0a0005 100%)',
      }}
    >
      {/* ── Ambient Floating Particles & Hearts ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute opacity-50"
            style={{
              left: `${p.left}%`,
              bottom: '-20px',
              fontSize: `${p.size}px`,
              color: p.isHeart ? accentColor : '#fbbf24',
              filter: `drop-shadow(0 0 6px ${p.isHeart ? accentColor : '#fbbf24'})`,
              animation: `waveFloat ${p.duration}s ${p.delay}s linear infinite`,
            }}
          >
            {p.isHeart ? '♥' : '✨'}
          </span>
        ))}
      </div>

      {/* ── Radial Soft Glowing Aura ── */}
      <div
        className="absolute w-[440px] h-[440px] rounded-full pointer-events-none animate-pulse"
        style={{
          background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
        }}
      />

      {/* ── CENTRAL ELEGANT PRESENTATION CARD ── */}
      <div
        className="relative z-10 w-full max-w-[440px] text-center border rounded-[36px] p-8 sm:p-11 shadow-[0_30px_100px_rgba(0,0,0,0.8)] space-y-6 backdrop-blur-2xl transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: theme?.cardBg || 'rgba(15, 4, 12, 0.82)',
          borderColor: theme?.cardBorder || 'rgba(212, 175, 55, 0.45)',
          color: theme?.textColor || '#ffffff',
          boxShadow: `0 35px 100px rgba(0,0,0,0.85), 0 0 60px ${theme?.glowColor || 'rgba(236,72,153,0.25)'}`,
        }}
      >
        {/* Kicker Header */}
        <span
          className="uppercase tracking-[0.25em] text-xs font-bold block animate-pulse"
          style={{ color: theme?.kickerColor || '#ffd7e8' }}
        >
          {kicker}
        </span>

        {/* Pulsing Central Wax Heart Stamp */}
        <div className="flex justify-center my-2">
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-br from-rose-600 via-pink-600 to-amber-700 flex items-center justify-center text-white shadow-[0_15px_40px_rgba(225,29,72,0.55)] border-2 border-amber-300/60 transform transition-transform duration-300 group-hover:scale-110">
            <Heart className="w-10 h-10 fill-white text-amber-200 drop-shadow-md animate-bounce" />
          </div>
        </div>

        {/* Story Title */}
        <h1
          className="text-3xl sm:text-5xl font-serif script-title leading-tight text-white drop-shadow-md"
          style={{ color: theme?.titleColor || '#ffffff', fontFamily: theme?.fontTitle || 'Georgia, serif' }}
        >
          {productTitle}
        </h1>

        {/* Sender & Recipient Metadata */}
        <div className="py-2.5 px-5 rounded-2xl bg-white/5 border border-white/10 max-w-[340px] mx-auto space-y-0.5">
          <p className="text-sm sm:text-base font-serif italic text-pink-200">
            De: <span className="font-bold text-white tracking-wide">{sender}</span>
          </p>
          <p className="text-sm sm:text-base font-serif italic text-pink-200">
            Para: <span className="font-bold text-white tracking-wide">{recipient}</span>
          </p>
        </div>

        {/* Primary Action Button (Triggers Audio Instantly!) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="w-full py-4 px-7 rounded-full font-bold text-white shadow-2xl hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #f43f5e)`,
              boxShadow: `0 10px 35px ${theme?.glowColor || 'rgba(236,72,153,0.5)'}`,
            }}
          >
            <Play className="w-5 h-5 fill-white text-white" />
            <span>{buttonText || 'Toca para abrir tu detalle'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
