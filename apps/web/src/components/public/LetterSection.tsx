import React, { useState, useEffect, useCallback } from 'react';
import { ThemeConfig } from '@recuerdos-qr/shared';
import { useInView } from '../../hooks/useAnimation';
import { Heart, Sparkles, X, MailOpen } from 'lucide-react';

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
  heading = 'Un mensaje especial',
  title = 'Para ti',
  contentRaw,
  defaultContent,
  signature = 'Con todo mi cariño',
  theme,
}) => {
  const [ref, visible] = useInView(0.15);
  const [isOpen, setIsOpen] = useState(false);
  const [animState, setAnimState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const [textRevealed, setTextRevealed] = useState(false);

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

  const handleOpen = useCallback(() => {
    if (animState !== 'closed') return;
    setIsOpen(true);
    setAnimState('opening');
    setTextRevealed(false);

    // Lock body scroll while letter modal is open
    document.body.style.overflow = 'hidden';

    // Staggered sequence: 750ms start text reveal, 950ms fully open
    const timerText = setTimeout(() => {
      setTextRevealed(true);
    }, 700);

    const timerOpen = setTimeout(() => {
      setAnimState('open');
    }, 950);

    return () => {
      clearTimeout(timerText);
      clearTimeout(timerOpen);
    };
  }, [animState]);

  const handleClose = useCallback(() => {
    if (animState === 'closing' || animState === 'closed') return;
    setAnimState('closing');
    setTextRevealed(false);

    // Restore body scroll
    document.body.style.overflow = '';

    const timerClose = setTimeout(() => {
      setIsOpen(false);
      setAnimState('closed');
    }, 850);

    return () => clearTimeout(timerClose);
  }, [animState]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Clean up body overflow when unmounting
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
      <div className="mb-8 space-y-1.5">
        {kicker && (
          <span
            className={`reveal ${visible ? 'is-visible' : ''} uppercase tracking-[0.2em] text-xs font-bold block`}
            style={{ color: theme?.kickerColor || '#ffd7e8' }}
          >
            {kicker}
          </span>
        )}
        <h2
          className={`reveal reveal-delay-1 ${visible ? 'is-visible' : ''} text-4xl sm:text-6xl font-serif script-title leading-tight`}
          style={{ color: theme?.titleColor || '#ffffff', fontFamily: theme?.fontTitle || 'Georgia, serif' }}
        >
          {heading}
        </h2>
      </div>

      {/* ── CLOSED ENVELOPE CARD (INVITATION TO OPEN) ── */}
      <div
        onClick={handleOpen}
        className={`reveal-scale ${visible ? 'is-visible' : ''} group relative w-full max-w-[560px] mx-auto p-8 sm:p-12 rounded-[36px] text-center shadow-2xl border cursor-pointer overflow-hidden transition-all duration-700 hover:scale-[1.03] active:scale-[0.98]`}
        style={{
          background: theme?.cardBg || 'rgba(15, 8, 22, 0.85)',
          borderColor: theme?.cardBorder || 'rgba(255, 131, 182, 0.3)',
          boxShadow: `0 25px 75px rgba(0,0,0,0.65), 0 0 50px ${theme?.glowColor || 'rgba(236,72,153,0.18)'}`,
        }}
      >
        {/* Envelope Top Triangular Flap Simulation Background */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        {/* Envelope Decorative Stitching / Ribbon Line */}
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 border-t border-dashed border-white/15 pointer-events-none" />

        {/* Wax Seal Badge Centerpiece */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            {/* Pulsing Aura */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 opacity-40 blur-md group-hover:opacity-75 transition duration-500 animate-pulse" />
            
            {/* Wax Seal Button */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-600 via-pink-600 to-amber-700 flex items-center justify-center text-white shadow-2xl border-2 border-amber-300/40 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
              <Heart className="w-9 h-9 fill-white/90 text-amber-200 drop-shadow-md animate-bounce" />
            </div>
          </div>

          {/* Title & Teaser Text */}
          <div className="space-y-1.5 pt-2">
            <h3
              className="text-2xl sm:text-3xl font-serif font-bold tracking-wide"
              style={{ color: theme?.titleColor || '#ffffff', fontFamily: theme?.fontTitle || 'Georgia, serif' }}
            >
              {title || 'Carta de Amor'}
            </h3>
            <p className="text-xs sm:text-sm font-medium opacity-85 text-pink-200/90 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Haz clic para abrir la carta</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            </p>
          </div>
        </div>
      </div>

      {/* ── EXPANDABLE LUXURY 3D UNFOLDED LETTER MODAL ── */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto transition-all duration-700 ${
            animState === 'closing'
              ? 'opacity-0 backdrop-blur-none bg-black/0 pointer-events-none'
              : 'opacity-100 backdrop-blur-xl bg-black/80'
          }`}
          onClick={handleClose}
        >
          {/* Unfolded Letter Sheet Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-[660px] my-auto rounded-[32px] p-8 sm:p-14 text-slate-900 shadow-[0_35px_100px_rgba(0,0,0,0.85)] border transition-all duration-900 ease-out transform select-text ${
              animState === 'opening'
                ? 'scale-90 rotate-x-12 opacity-0 translate-y-12'
                : animState === 'open'
                ? 'scale-100 rotate-x-0 opacity-100 translate-y-0'
                : 'scale-90 rotate-x-12 opacity-0 translate-y-12'
            }`}
            style={{
              background: 'linear-gradient(145deg, #fdfdf9 0%, #f7f4ea 100%)', // Fine Warm Linen Ivory Paper Texture
              borderColor: 'rgba(212, 175, 55, 0.45)', // Gold Accent Border
              boxShadow: '0 40px 120px rgba(0, 0, 0, 0.7), inset 0 0 80px rgba(235, 220, 190, 0.4)',
            }}
          >
            {/* Close Button Top Right */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-5 right-5 sm:top-7 sm:right-7 py-2 px-4 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer backdrop-blur-sm border border-slate-900/15 shadow-sm active:scale-95"
              title="Cerrar carta (ESC)"
            >
              <X className="w-4 h-4 text-slate-800" />
              <span>Cerrar carta</span>
            </button>

            {/* Vintage Gold Paper Watermark / Header */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-700/40" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-800/70 font-semibold">
                Mensaje Entregado Con Amor
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-700/40" />
            </div>

            {/* Letter Title */}
            {title && (
              <h3
                className={`text-2xl sm:text-4xl font-serif text-center mb-8 font-bold text-slate-900 transition-all duration-700 ease-out ${
                  textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ fontFamily: theme?.fontTitle || '"Playfair Display", Georgia, serif' }}
              >
                {title}
              </h3>
            )}

            {/* Quote Symbol Background Graphic */}
            <div className="font-serif text-6xl leading-none select-none text-amber-800/15 text-center -mb-6">
              “
            </div>

            {/* Paragraphs with Progressive Staggered Reveal */}
            <div className="space-y-6 text-center max-w-[540px] mx-auto">
              {paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={`transition-all duration-700 ease-out font-serif italic text-base sm:text-xl leading-relaxed text-slate-800 ${
                    textRevealed
                      ? 'opacity-100 translate-y-0 filter-none'
                      : 'opacity-0 translate-y-8 blur-[2px]'
                  }`}
                  style={{
                    transitionDelay: `${idx * 160}ms`,
                    fontFamily: '"Playfair Display", Georgia, serif',
                  }}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Letter Signature */}
            {signature && (
              <div
                className={`mt-10 pt-6 border-t border-amber-900/15 text-center transition-all duration-700 ease-out ${
                  textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${paragraphs.length * 160 + 120}ms` }}
              >
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
          </div>
        </div>
      )}
    </section>
  );
};
