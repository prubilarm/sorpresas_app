import React, { useState, useCallback } from 'react';
import { ThemeConfig } from '@recuerdos-qr/shared';
import { Sparkles } from 'lucide-react';

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
  kicker = 'UN REGALO ESPECIAL',
  productTitle = 'El comienzo de nuestra historia',
  senderName,
  recipientName,
  personOneName,
  personTwoName,
  theme,
  onStart,
}) => {
  const sender = senderName || personOneName || 'Hans';
  const recipient = recipientName || personTwoName || 'Tamara';

  const [isOpening, setIsOpening] = useState(false);

  // Apple-style Golden Dust Light Particles (Discrete & Elegant)
  const dustParticles = Array.from({ length: 28 }).map((_, i) => ({
    id: i,
    left: (i * 3.4 + 2) % 96,
    top: (i * 4.3 + 3) % 94,
    size: 2 + (i % 4) * 2,
    delay: (i * 0.35) % 4.5,
    duration: 4.5 + (i % 3) * 2,
    opacity: 0.25 + (i % 4) * 0.15,
  }));

  // Immediate Click Handler (Triggers Audio Instantly with 100% Browser Approval!)
  const handleClick = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);

    // Smooth 350ms cinematic camera zoom + light bloom transition
    setTimeout(() => {
      onStart();
    }, 350);
  }, [isOpening, onStart]);

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
      tabIndex={0}
      role="button"
      aria-label="Toca cualquier parte para comenzar"
      className="fixed inset-0 z-50 flex items-center justify-center p-6 cursor-pointer select-none overflow-hidden bg-black text-white"
    >
      {/* ── 100VW / 100VH FULLSCREEN BACKGROUND PHOTOGRAPHY (FOTO_FONDO) ── */}
      <div
        className={`absolute inset-0 z-0 overflow-hidden transition-all duration-700 ease-out transform-gpu ${
          isOpening ? 'scale-125 opacity-0 blur-lg' : 'scale-100 opacity-100'
        }`}
      >
        <img
          src="/assets/foto_fondo.jpg"
          alt="Fotografía de portada"
          className="w-full h-full object-cover animate-ken-burns transform-gpu"
        />

        {/* ── Subtle Dark Overlay (25%-35%) + Micro Backdrop Blur for Perfect Legibility ── */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] transition-colors duration-500" />
        
        {/* ── Radial Soft Warm Bloom Aura ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* ── Discrete Apple Light Dust Particles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {dustParticles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-amber-200 animate-apple-dust"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              boxShadow: `0 0 8px rgba(253, 224, 71, 0.7), 0 0 16px rgba(244, 114, 182, 0.4)`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* ── INTEGRATED DIRECT TYPOGRAPHY (NO CARD, NO BOX, NO BUTTON) ── */}
      <div
        className={`relative z-20 max-w-[680px] w-full text-center px-4 space-y-8 sm:space-y-10 transition-all duration-500 transform-gpu ${
          isOpening ? 'scale-110 opacity-0 blur-sm translate-y-4' : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        {/* Kicker Header */}
        <div className="space-y-2">
          <span
            className="uppercase tracking-[0.35em] text-xs sm:text-sm font-semibold block text-amber-200/90 drop-shadow-md animate-fade-in"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            {kicker}
          </span>
          <div className="w-12 h-px bg-amber-300/50 mx-auto" />
        </div>

        {/* Story Title */}
        <h1
          className="text-4xl sm:text-7xl font-serif script-title leading-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] tracking-wide"
          style={{ fontFamily: theme?.fontTitle || "'Playfair Display', Georgia, serif" }}
        >
          {productTitle}
        </h1>

        {/* Elegant Calligraphy Names (De Hans / Para Tamara) */}
        <div className="py-2 space-y-2 font-serif italic text-xl sm:text-3xl text-pink-100/95 drop-shadow-lg">
          <p
            className="flex items-center justify-center gap-3"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            <span className="opacity-80 text-lg sm:text-2xl font-light">De</span>
            <span
              className="font-normal text-amber-100 text-4xl sm:text-6xl drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'Great Vibes', cursive", letterSpacing: '0.05em' }}
            >
              {sender}
            </span>
          </p>
          
          <div className="w-16 h-px bg-white/25 mx-auto my-1" />

          <p
            className="flex items-center justify-center gap-3"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            <span className="opacity-80 text-lg sm:text-2xl font-light">Para</span>
            <span
              className="font-normal text-amber-100 text-4xl sm:text-6xl drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'Great Vibes', cursive", letterSpacing: '0.05em' }}
            >
              {recipient}
            </span>
          </p>
        </div>

        {/* Minimalist Action Prompt (No Clunky Button!) */}
        <div className="pt-8 sm:pt-12">
          <div className="inline-flex items-center gap-2.5 py-3 px-8 rounded-full bg-black/40 hover:bg-black/60 text-amber-100 text-xs sm:text-sm font-medium backdrop-blur-md border border-white/20 tracking-[0.25em] uppercase transition-all duration-300 shadow-2xl animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Toca cualquier parte para comenzar</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
