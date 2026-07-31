import React, { useState, useEffect, useCallback } from 'react';
import { ThemeConfig } from '@recuerdos-qr/shared';
import { useInView } from '../../hooks/useAnimation';
import { Heart, Sparkles, X } from 'lucide-react';

interface LetterSectionProps {
  kicker?: string;
  heading?: string;
  title?: string;
  contentRaw?: string;
  defaultContent?: string[];
  signature?: string;
  theme?: ThemeConfig;
}

export const LetterSection: React.FC<LetterSectionProps> = ({
  kicker = 'Lo que siento por ti',
  heading = 'Una carta para ti',
  title = 'Para ti, mi amor',
  contentRaw,
  defaultContent,
  signature = 'Con todo mi cariño',
  theme,
}) => {
  const [ref, visible] = useInView(0.15);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  let paragraphs: string[] = [];
  try {
    if (contentRaw) {
      const parsed = JSON.parse(contentRaw);
      if (Array.isArray(parsed)) {
        paragraphs = parsed.map((p) => String(p)).filter((p) => p.trim().length > 0);
      } else {
        paragraphs = String(contentRaw).split(/\n+/).filter((p) => p.trim().length > 0);
      }
    }
  } catch (err) {
    if (contentRaw) paragraphs = String(contentRaw).split(/\n+/).filter((p) => p.trim().length > 0);
  }

  if (!paragraphs.length) {
    paragraphs = defaultContent || [
      'Hay personas que iluminan nuestra vida de una forma única, y tú eres una de ellas.',
      'Este detalle fue preparado con mucho cariño para celebrar todos los momentos especiales que compartimos.',
    ];
  }

  // Fast & Fluid 300ms Opening
  const handleOpen = useCallback(() => {
    if (isOpen) return;
    setIsClosing(false);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, [isOpen]);

  // Fast & Fluid 300ms Closing
  const handleClose = useCallback(() => {
    if (!isOpen || isClosing) return;
    setIsClosing(true);

    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      document.body.style.overflow = '';
    }, 280);
  }, [isOpen, isClosing]);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Clean up body overflow
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <section
      id="carta"
      ref={ref as React.RefObject<HTMLElement>}
      className="w-full max-w-[780px] mx-auto py-14 px-4 text-center select-none"
    >
      {/* Section Header */}
      <div className="mb-10 space-y-2">
        {kicker && (
          <span
            className={`reveal ${visible ? 'is-visible' : ''} uppercase tracking-[0.25em] text-xs font-bold block`}
            style={{ color: theme?.kickerColor || '#ffd7e8' }}
          >
            {kicker}
          </span>
        )}
        <h2
          className={`reveal reveal-delay-1 ${visible ? 'is-visible' : ''} text-4xl sm:text-6xl font-serif script-title leading-tight`}
          style={{ color: theme?.titleColor || '#ffffff', fontFamily: theme?.fontTitle || 'Georgia, serif' }}
        >
          {heading || 'Una carta para ti'}
        </h2>
        <p className="text-xs sm:text-sm text-pink-200/80 font-serif italic">
          Haz clic en el sobre para abrir tu mensaje romántico
        </p>
      </div>

      {/* ── 1. CLOSED PHYSICAL ENVELOPE CARD ── */}
      <div
        onClick={handleOpen}
        className={`reveal-scale ${visible ? 'is-visible' : ''} group relative w-full max-w-[540px] h-[320px] sm:h-[350px] mx-auto rounded-[36px] p-6 sm:p-8 text-center cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_25px_80px_rgba(0,0,0,0.65)] border`}
        style={{
          background: 'linear-gradient(135deg, #f7f2e8 0%, #ebe2d3 100%)', // Parchment Envelope Paper
          borderColor: 'rgba(212, 175, 55, 0.45)', // Fine Gold Accent Border
          boxShadow: `0 30px 90px rgba(0,0,0,0.65), 0 0 50px ${theme?.glowColor || 'rgba(236,72,153,0.18)'}`,
        }}
      >
        {/* Envelope Side Fold Seam Accents */}
        <div className="absolute inset-0 pointer-events-none border-4 border-amber-900/10 rounded-[36px]" />
        
        {/* Envelope Top Triangular Flap Simulation */}
        <div
          className="absolute inset-x-0 top-0 h-36 origin-top transition-transform duration-300 ease-out pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, #ede5d5 0%, #e2d7c3 100%)',
            clipPath: 'polygon(0 0, 50% 85%, 100% 0)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          }}
        />

        {/* Envelope Bottom Pocket Cover */}
        <div
          className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(0deg, #f2eadc 0%, #e6dccb 100%)',
            clipPath: 'polygon(0 40%, 50% 0, 100% 40%, 100% 100%, 0 100%)',
            boxShadow: 'inset 0 2px 15px rgba(0,0,0,0.08)',
          }}
        />

        {/* Wax Seal Centerpiece Button */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center space-y-4 pt-4">
          <div className="relative">
            {/* Soft Glowing Aura */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 opacity-50 blur-lg group-hover:opacity-85 transition duration-300 animate-pulse" />

            {/* Hand-Pressed Wax Stamp Badge */}
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-br from-rose-700 via-pink-600 to-amber-800 flex items-center justify-center text-white shadow-[0_15px_35px_rgba(190,18,60,0.5)] border-2 border-amber-300/50 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Heart className="w-10 h-10 fill-white/90 text-amber-200 drop-shadow-md animate-bounce" />
            </div>
          </div>

          {/* Invitation Badge Label */}
          <div className="space-y-1 z-30 pt-1">
            <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-pink-200 text-xs font-bold shadow-xl backdrop-blur-md border border-pink-500/30 tracking-wide transition group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Haz clic para abrir tu carta</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. EXPANDABLE LUXURY 3D UNFOLDED LETTER MODAL ── */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto transition-all duration-300 ease-out select-none ${
            isClosing
              ? 'opacity-0 backdrop-blur-none bg-black/0 pointer-events-none'
              : 'opacity-100 backdrop-blur-2xl bg-black/85'
          }`}
          onClick={handleClose}
        >
          {/* Floating Romantic Background Hearts in Dark Margins */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-40">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute text-pink-400/40 animate-pulse"
                style={{
                  top: `${(i * 19) % 90}%`,
                  left: `${(i * 23) % 92}%`,
                  fontSize: `${14 + (i % 4) * 8}px`,
                  animationDuration: `${2.5 + (i % 3)}s`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                ❤️
              </div>
            ))}
          </div>

          {/* 3D Envelope Container Sheet (ABSOLUTELY NO TOP BUTTONS) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-[660px] my-auto rounded-[36px] p-8 sm:p-14 text-slate-900 shadow-[0_40px_120px_rgba(0,0,0,0.85),0_0_80px_rgba(251,191,36,0.2)] border transition-all duration-300 ease-out transform select-text ${
              isClosing
                ? 'scale-95 opacity-0 translate-y-6'
                : 'scale-100 opacity-100 translate-y-0'
            }`}
            style={{
              background: 'linear-gradient(145deg, #fdfdf9 0%, #f7f3e8 100%)', // Fine Warm Ivory Paper
              borderColor: 'rgba(212, 175, 55, 0.45)', // Gold Accent Border
              boxShadow: '0 45px 130px rgba(0, 0, 0, 0.85), inset 0 0 90px rgba(235, 220, 190, 0.45)',
            }}
          >
            {/* Vintage Gold Header Watermark */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-700/40" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-800/75 font-semibold">
                Mensaje Entregado Con Amor
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-700/40" />
            </div>

            {/* Subtitle / Title inside Letter */}
            {title && (
              <h3
                className="text-2xl sm:text-4xl font-serif text-center mb-6 font-bold text-amber-950 transition-all duration-300"
                style={{ fontFamily: theme?.fontTitle || '"Playfair Display", Georgia, serif' }}
              >
                {title}
              </h3>
            )}

            {/* Decorative Quote Symbol */}
            <div className="font-serif text-6xl leading-none select-none text-amber-800/15 text-center -mb-6">
              “
            </div>

            {/* Paragraphs */}
            <div className="space-y-6 text-center max-w-[540px] mx-auto">
              {paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="font-serif italic text-base sm:text-xl leading-relaxed text-slate-800 transition-all duration-300"
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                  }}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Letter Signature */}
            {signature && (
              <div className="mt-10 pt-6 border-t border-amber-900/15 text-center transition-all duration-300">
                <p className="font-mono text-[9px] uppercase tracking-widest text-amber-800/60 mb-1 font-bold">
                  Con todo mi amor
                </p>
                <p
                  className="font-serif text-2xl sm:text-3xl font-bold text-amber-950"
                  style={{ fontFamily: theme?.fontTitle || '"Playfair Display", Georgia, serif' }}
                >
                  {signature}
                </p>
              </div>
            )}

            {/* ── Integrated Bottom Discrete Close Button ✕ (THE ONLY CLOSE BUTTON) ── */}
            <div className="mt-10 pt-4 text-center border-t border-amber-900/10">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 border border-amber-800/25 shadow-md transition-all duration-300 active:scale-90 cursor-pointer group"
                title="Cerrar carta (ESC)"
              >
                <X className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90 text-amber-950" />
              </button>
              <p className="text-[10px] font-mono tracking-widest text-amber-900/60 uppercase mt-2 font-bold">
                Guardar y cerrar
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
