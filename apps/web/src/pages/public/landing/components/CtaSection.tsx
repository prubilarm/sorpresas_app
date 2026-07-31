import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden text-center">
      <div className="absolute inset-0 bg-pink-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 mx-auto flex items-center justify-center shadow-xl shadow-pink-500/30">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Hay regalos que se olvidan.<br />
          <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
            Y hay recuerdos que permanecen para siempre.
          </span>
        </h2>

        <p className="text-slate-300 text-lg max-w-xl mx-auto">
          No dejes tus mejores recuerdos archivados en la galería del celular. Transfórmalos en una obra de arte digital hoy mismo.
        </p>

        <div>
          <a
            href="https://wa.me/?text=Hola!%20Quiero%20crear%20mi%20experiencia%20digital"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full text-lg font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-2xl shadow-pink-500/40 hover:scale-105 transition-all"
          >
            <span>Quiero crear mi experiencia</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};
