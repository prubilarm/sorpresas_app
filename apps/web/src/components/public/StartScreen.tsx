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
  productTitle = 'Una sorpresa especial hecha para ti',
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

        {/* Sender & Recipient Metadata (Ultra-Elegant Cormorant Garamond & Great Vibes) */}
        <div className="py-4 px-6 rounded-2xl bg-gradient-to-br from-white/10 via-pink-950/30 to-amber-950/30 border border-amber-300/30 shadow-inner max-w-[360px] mx-auto space-y-1.5 backdrop-blur-md">
          <p
            className="text-lg sm:text-xl font-serif italic tracking-wide text-pink-200 flex items-center justify-center gap-2"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            <span>De:</span>
            <span
              className="font-normal text-amber-100 text-3xl sm:text-4xl drop-shadow-md"
              style={{ fontFamily: "'Great Vibes', cursive", letterSpacing: '0.05em' }}
            >
              {sender}
            </span>
          </p>
          <div className="w-16 h-px bg-amber-300/40 mx-auto my-1" />
          <p
            className="text-lg sm:text-xl font-serif italic tracking-wide text-amber-200 flex items-center justify-center gap-2"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            <span>Para:</span>
            <span
              className="font-normal text-amber-100 text-3xl sm:text-4xl drop-shadow-md"
              style={{ fontFamily: "'Great Vibes', cursive", letterSpacing: '0.05em' }}
            >
              {recipient}
            </span>
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
            className="w-full py-4.5 px-8 rounded-full font-serif font-bold text-white shadow-2xl hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 text-lg sm:text-xl tracking-wider cursor-pointer border border-amber-300/40"
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
              background: `linear-gradient(135deg, ${accentColor}, #f43f5e)`,
              boxShadow: `0 12px 40px ${theme?.glowColor || 'rgba(236,72,153,0.55)'}`,
            }}
          >
            <Play className="w-5 h-5 fill-white text-white animate-pulse" />
            <span>{buttonText || 'Toca para abrir tu detalle'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
