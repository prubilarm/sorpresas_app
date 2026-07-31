import React, { useState, useCallback } from 'react';
import { ThemeConfig } from '@recuerdos-qr/shared';
import { Heart, Sparkles } from 'lucide-react';

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
  kicker = '❤️ El comienzo de nuestra historia',
  productTitle = 'Una historia especial',
  senderName,
  recipientName,
  personOneName,
  personTwoName,
  theme,
  onStart,
}) => {
  const sender = senderName || personOneName || 'Hans';
  const recipient = recipientName || personTwoName || 'Tamara';
  const accentColor = theme?.accentColor || '#ec4899';

  // Stage Machine: 'mystery' | 'untying' | 'opening' | 'zooming' | 'revealed'
  const [stage, setStage] = useState<'mystery' | 'untying' | 'opening' | 'zooming' | 'revealed'>('mystery');

  // Floating Particles
  const particles = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    left: (i * 4.2 + 3) % 94,
    size: 10 + (i % 6) * 5,
    delay: (i * 0.4) % 5,
    duration: 6 + (i % 5) * 2,
    isHeart: i % 2 === 0,
  }));

  const handleBoxClick = useCallback(() => {
    if (stage !== 'mystery') return;

    // Step 1: Untie ribbon + vibrate (0 - 550ms)
    setStage('untying');

    // Step 2: Open 3D lid + light beam burst (550 - 1250ms)
    const t1 = setTimeout(() => {
      setStage('opening');
    }, 550);

    // Step 3: Zoom camera inside box + white light bloom (1250 - 1950ms)
    const t2 = setTimeout(() => {
      setStage('zooming');
    }, 1250);

    // Step 4: Complete transition & trigger cover reveal
    const t3 = setTimeout(() => {
      setStage('revealed');
      onStart();
    }, 1950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [stage, onStart]);

  return (
    <div
      onClick={handleBoxClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 cursor-pointer select-none overflow-hidden bg-gradient-to-b from-slate-950 via-[#0d0317] to-slate-950"
      style={{ perspective: '1200px' }}
    >
      {/* ── Ambient Floating Particles & Golden Dust ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute transition-opacity duration-1000"
            style={{
              left: `${p.left}%`,
              bottom: '-25px',
              fontSize: `${p.size}px`,
              color: p.isHeart ? '#f43f5e' : '#fbbf24',
              opacity: stage === 'mystery' ? 0.4 : 0.85,
              filter: `drop-shadow(0 0 8px ${p.isHeart ? '#f43f5e' : '#fbbf24'})`,
              animation: `waveFloat ${p.duration}s ${p.delay}s linear infinite`,
            }}
          >
            {p.isHeart ? '♥' : '✨'}
          </span>
        ))}
      </div>

      {/* ── Radial Ambient Aura Glow behind Box ── */}
      <div
        className={`absolute w-[460px] h-[460px] rounded-full pointer-events-none transition-all duration-1000 ${
          stage === 'opening' || stage === 'zooming'
            ? 'scale-150 opacity-95 blur-[140px]'
            : 'opacity-40 blur-[100px]'
        }`}
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, rgba(244,63,94,0.4) 40%, transparent 70%)`,
        }}
      />

      {/* ── WHITE LIGHT BLOOM OVERLAY FOR CAMERA ZOOM TRANSITION ── */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-700 bg-white ${
          stage === 'zooming' ? 'opacity-90' : 'opacity-0'
        }`}
      />

      {/* ── SCENE 1: MYSTERY 3D GIFT BOX ── */}
      {stage !== 'revealed' && (
        <div
          className={`relative flex flex-col items-center justify-center transition-all duration-700 z-10 ${
            stage === 'zooming'
              ? 'scale-[3.5] opacity-0 blur-md translate-z-[400px]'
              : stage === 'untying'
              ? 'animate-vibrate'
              : ''
          }`}
        >
          {/* Mystery Copy Header */}
          <div className="text-center mb-8 space-y-2 z-20 transition-opacity duration-500">
            <h2 className="font-serif italic text-2xl sm:text-4xl text-pink-100 tracking-wide drop-shadow-lg">
              Hay un regalo esperando por ti...
            </h2>
            <p className="font-mono text-xs sm:text-sm tracking-[0.25em] text-amber-200/90 uppercase font-semibold animate-pulse flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Tócalo para descubrirlo</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
            </p>
          </div>

          {/* 3D LUXURY GIFT BOX CONTAINER */}
          <div className="relative w-[280px] h-[260px] sm:w-[340px] sm:h-[310px] transform-gpu">
            
            {/* 3D GIFT BOX LID */}
            <div
              className={`absolute top-0 inset-x-0 h-[85px] sm:h-[98px] z-30 rounded-t-3xl border-b-2 border-amber-400/40 shadow-2xl transition-all ${
                stage === 'opening' || stage === 'zooming' ? 'animate-lid-open' : ''
              }`}
              style={{
                background: 'linear-gradient(135deg, #3d0c20 0%, #58122d 50%, #260512 100%)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.7), inset 0 2px 10px rgba(255,215,0,0.3)',
              }}
            >
              {/* Lid Silk Red Ribbon Stripe */}
              <div
                className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-14 sm:w-16 bg-gradient-to-r from-rose-700 via-rose-500 to-rose-800 border-x border-amber-300/50 shadow-md ${
                  stage === 'untying' ? 'animate-ribbon-slide' : ''
                }`}
              />

              {/* Lid Top Silk Bow & Heart Wax Emblem Centerpiece */}
              <div
                className={`absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center transition-all ${
                  stage === 'untying' ? 'animate-ribbon-slide' : ''
                }`}
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-rose-600 via-pink-600 to-amber-700 flex items-center justify-center text-white shadow-[0_15px_40px_rgba(225,29,72,0.6)] border-2 border-amber-300/60 transform transition-transform duration-300 hover:scale-110">
                  <Heart className="w-10 h-10 fill-white text-amber-200 drop-shadow-md animate-bounce" />
                </div>
              </div>
            </div>

            {/* 3D GIFT BOX BASE / BODY */}
            <div
              className="absolute inset-0 pt-[85px] sm:pt-[98px] rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_35px_100px_rgba(0,0,0,0.95)]"
              style={{
                background: 'linear-gradient(145deg, #2b0817 0%, #430d24 50%, #17030b 100%)',
                boxShadow: '0 35px 100px rgba(0,0,0,0.95), inset 0 0 50px rgba(244,114,182,0.15)',
              }}
            >
              {/* Vertical Ribbon Stripe on Box Body */}
              <div
                className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-14 sm:w-16 bg-gradient-to-r from-rose-700 via-rose-500 to-rose-800 border-x border-amber-300/40 shadow-md ${
                  stage === 'untying' ? 'animate-ribbon-slide' : ''
                }`}
              />

              {/* Horizontal Ribbon Stripe on Box Body */}
              <div
                className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 sm:h-14 bg-gradient-to-b from-rose-700 via-rose-500 to-rose-800 border-y border-amber-300/40 shadow-md ${
                  stage === 'untying' ? 'animate-ribbon-slide' : ''
                }`}
              />

              {/* GOLDEN BEAM LIGHT BURST FROM INSIDE BOX WHEN OPENING */}
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
                  stage === 'opening' || stage === 'zooming' ? 'opacity-100 scale-150' : 'opacity-0'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-t from-amber-300 via-rose-400 to-white blur-xl opacity-90 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SCENE 2: ELEGANT SURPRISE COVER REVEAL ── */}
      {stage === 'revealed' && (
        <div
          className="relative z-30 w-full max-w-[500px] text-center border rounded-[36px] p-8 sm:p-12 shadow-2xl space-y-6 backdrop-blur-2xl animate-fade-in"
          style={{
            background: theme?.cardBg || 'rgba(15, 6, 25, 0.88)',
            borderColor: theme?.cardBorder || 'rgba(212, 175, 55, 0.45)',
            color: theme?.textColor || '#ffffff',
            boxShadow: `0 40px 110px rgba(0,0,0,0.85), 0 0 70px ${theme?.glowColor || 'rgba(236,72,153,0.3)'}`,
          }}
        >
          <span
            className="uppercase tracking-[0.25em] text-xs font-bold block text-pink-300 animate-pulse"
            style={{ color: theme?.kickerColor || '#ffd7e8' }}
          >
            {kicker}
          </span>

          <div className="flex justify-center my-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 p-0.5 shadow-xl animate-bounce">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <Heart className="w-8 h-8 fill-rose-500 text-rose-500 drop-shadow-md" />
              </div>
            </div>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-serif script-title leading-tight text-white drop-shadow-md"
            style={{ fontFamily: theme?.fontTitle || 'Georgia, serif' }}
          >
            {productTitle}
          </h1>

          <div className="py-3 px-6 rounded-2xl bg-white/5 border border-white/10 max-w-[360px] mx-auto space-y-1">
            <p className="text-sm sm:text-base font-serif italic text-pink-200">
              De: <span className="font-bold text-white tracking-wide">{sender}</span>
            </p>
            <p className="text-sm sm:text-base font-serif italic text-pink-200">
              Para: <span className="font-bold text-white tracking-wide">{recipient}</span>
            </p>
          </div>

          <p className="text-xs text-pink-200/80 font-serif italic pt-2">
            Desliza hacia abajo para revivir cada momento especial ❤️
          </p>
        </div>
      )}
    </div>
  );
};
