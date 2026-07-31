import React, { useState, useEffect, useCallback } from 'react';
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

  // State Machine: 'ambient' | 'floating_memories' | 'dolly_zoom' | 'cover_revealed'
  const [stage, setStage] = useState<'ambient' | 'floating_memories' | 'dolly_zoom' | 'cover_revealed'>('ambient');

  // Apple-style Golden Dust Particles (No cartoon hearts)
  const dustParticles = Array.from({ length: 32 }).map((_, i) => ({
    id: i,
    left: (i * 3.1 + 4) % 96,
    top: (i * 4.7 + 5) % 92,
    size: 2 + (i % 4) * 2,
    delay: (i * 0.3) % 4,
    duration: 4 + (i % 3) * 2,
    opacity: 0.25 + (i % 4) * 0.18,
  }));

  // Automatic 8-Second Cinematic Timeline
  useEffect(() => {
    // 0 - 1.4s: Dark ambient space with music & Apple light dust
    const t1 = setTimeout(() => {
      setStage('floating_memories');
    }, 1400);

    // 1.4s - 4.5s: 3D Suspended Memories floating gently
    // 4.5s - 6.5s: Dolly In camera movement through main photo paper
    const t2 = setTimeout(() => {
      setStage('dolly_zoom');
    }, 4500);

    // 6.5s+: Dissolve through paper into ultra-clean cover card
    const t3 = setTimeout(() => {
      setStage('cover_revealed');
      onStart();
    }, 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onStart]);

  // Click anywhere to fast-forward into cover or start
  const handleScreenClick = useCallback(() => {
    if (stage !== 'cover_revealed') {
      setStage('cover_revealed');
      onStart();
    } else {
      onStart();
    }
  }, [stage, onStart]);

  return (
    <div
      onClick={handleScreenClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 cursor-pointer select-none overflow-hidden bg-black text-white"
      style={{ perspective: '1400px' }}
    >
      {/* ── Apple Memories Illuminated Dust Particles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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
              boxShadow: `0 0 10px rgba(253, 224, 71, 0.8), 0 0 20px rgba(244, 114, 182, 0.5)`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* ── Soft Cinematic Radial Warm Ambient Lighting ── */}
      <div
        className={`absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-1000 ${
          stage === 'dolly_zoom'
            ? 'scale-150 opacity-95 blur-[160px]'
            : stage === 'floating_memories'
            ? 'opacity-60 blur-[120px]'
            : 'opacity-25 blur-[90px]'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(244,114,182,0.35) 0%, rgba(212,175,55,0.2) 50%, transparent 70%)',
        }}
      />

      {/* ── SOFT RADIANT WHITE BLOOM OVERLAY WHEN PASSING THROUGH PAPER ── */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-700 bg-white/90 ${
          stage === 'dolly_zoom' ? 'opacity-90' : 'opacity-0'
        }`}
      />

      {/* ── SCENE 2 & 3: 3D SUSPENDED FLOATING POLAROID MEMORIES (PARALLAX & DOLLY IN) ── */}
      {stage !== 'cover_revealed' && (
        <div
          className={`relative w-full max-w-[700px] h-[480px] flex items-center justify-center transition-all duration-1000 transform-gpu z-10 ${
            stage === 'dolly_zoom' ? 'animate-dolly-zoom' : stage === 'floating_memories' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Background Suspended Photo 1 (Left Far Depth, Unfocused Blur) */}
          <div
            className="absolute -left-8 sm:left-4 top-10 w-44 sm:w-56 h-52 sm:h-64 bg-white p-2.5 pb-8 rounded-lg shadow-2xl border border-amber-100/30 opacity-35 blur-[3px] transform -rotate-12 transition-all duration-1000"
            style={{ transform: 'translateZ(-400px) rotate(-14deg)' }}
          >
            <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-rose-950 to-amber-950 rounded" />
          </div>

          {/* Background Suspended Photo 2 (Right Far Depth, Unfocused Blur) */}
          <div
            className="absolute -right-8 sm:right-4 bottom-10 w-48 sm:w-60 h-56 sm:h-68 bg-white p-2.5 pb-8 rounded-lg shadow-2xl border border-amber-100/30 opacity-35 blur-[3px] transform rotate-12 transition-all duration-1000"
            style={{ transform: 'translateZ(-500px) rotate(14deg)' }}
          >
            <div className="w-full h-full bg-gradient-to-br from-amber-950 via-slate-900 to-rose-900 rounded" />
          </div>

          {/* ── CENTER MAIN SUSPENDED POLAROID MEMORY ── */}
          <div
            className="relative z-30 w-[260px] sm:w-[320px] bg-white p-3.5 sm:p-4 pb-12 rounded-xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] border border-slate-200/90 transform rotate-1 transition-all duration-700 animate-float-subtle"
            style={{
              boxShadow: '0 35px 90px rgba(0,0,0,0.9), 0 0 50px rgba(244,114,182,0.25)',
            }}
          >
            {/* Fine Paper Curvature & Photo Surface Inner Frame */}
            <div className="w-full h-[210px] sm:h-[260px] rounded-lg overflow-hidden bg-gradient-to-br from-rose-950 via-slate-950 to-amber-950 flex flex-col items-center justify-center p-4 relative shadow-inner">
              <Sparkles className="w-10 h-10 text-amber-300 animate-spin mb-2" style={{ animationDuration: '4s' }} />
              <p className="font-serif italic text-xs sm:text-sm text-pink-200/90 text-center tracking-wide">
                “Un recuerdo suspendido en el tiempo...”
              </p>
            </div>

            {/* Polaroid Bottom Subtle Signature Line */}
            <div className="pt-3 text-center">
              <p className="font-serif italic font-semibold text-xs text-slate-700 tracking-wider">
                📍 {kicker}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── SCENE 4: ULTRA-MINIMALIST ELEGANT COVER REVEAL (APPLE / CARTIER STYLE) ── */}
      {stage === 'cover_revealed' && (
        <div className="relative z-40 max-w-[620px] text-center px-6 space-y-8 animate-fade-in">
          {/* Subtle Ambient Icon */}
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-amber-500/20 p-0.5 shadow-2xl backdrop-blur-xl border border-rose-400/30 flex items-center justify-center">
              <Heart className="w-8 h-8 fill-rose-500 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-pulse" />
            </div>
          </div>

          {/* Minimalist Subtitle */}
          <span className="uppercase tracking-[0.3em] text-xs font-bold text-amber-200/90 block">
            {kicker}
          </span>

          {/* Clean Title */}
          <h1
            className="text-4xl sm:text-6xl font-serif script-title leading-tight text-white drop-shadow-2xl"
            style={{ fontFamily: theme?.fontTitle || 'Georgia, serif' }}
          >
            {productTitle}
          </h1>

          {/* Clean Sender & Recipient Typography */}
          <div className="pt-2 pb-1 space-y-1 font-serif italic text-lg sm:text-2xl text-pink-100/90">
            <p>
              De: <span className="font-semibold text-white tracking-wide">{sender}</span>
            </p>
            <p className="text-amber-200">
              Para: <span className="font-semibold text-white tracking-wide">{recipient}</span>
            </p>
          </div>

          {/* Discrete Tap Invite */}
          <div className="pt-6">
            <span className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-pink-100 text-xs font-semibold backdrop-blur-md border border-white/20 tracking-widest uppercase transition-all duration-300">
              <span>Toca en cualquier lugar para comenzar</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
