import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, QrCode, Heart, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 bg-slate-950 text-white overflow-hidden flex items-center">
      {/* Background Mesh Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headline & Value Prop */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-8"
        >
          {/* Tag */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-pink-500/30 text-pink-300 text-xs font-semibold tracking-wide backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Experiencias Digitales Personalizadas con Código QR</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
            El regalo que se guarda <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">para siempre</span>.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            Transformamos tus fotografías, canciones, cartas y videos más profundos en un regalo interactivo único, listo para ser escaneado con la cámara del celular.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <a
              href="https://wa.me/?text=Hola!%20Quiero%20crear%20mi%20regalo%20digital"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-95 transition-all text-center"
            >
              <span>Crear mi regalo ahora</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-semibold bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-all text-center"
            >
              <span>Ver cómo funciona</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sin apps que instalar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% en iPhone y Android</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Entrega física con QR</span>
            </div>
          </div>

        </motion.div>

        {/* Right Column: Sleek Phone Display with REAL CAPTURA 1 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center relative"
        >
          {/* Phone Mockup Frame */}
          <div className="relative w-full max-w-[320px] aspect-[9/19] bg-slate-900 border-8 border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden shadow-pink-500/20 group">
            
            {/* Real App Screenshot 1 (Portada) */}
            <img 
              src="/assets/capturas/cap1.jpg" 
              alt="Portada de la Experiencia Real" 
              className="w-full h-full object-cover"
            />

            {/* ANONYMOUS OVERLAY: Protection over client names */}
            <div className="absolute bottom-[28%] left-[8%] right-[8%] bg-[#090514] py-3 text-center rounded-xl font-sans text-white border border-purple-500/40 shadow-lg">
              <span className="text-xs text-slate-200">De: <strong>Diego</strong> → Para: <strong>Camila</strong></span>
            </div>

            {/* Glowing Accent Badge */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5 text-pink-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">Demostración en vivo</div>
                <div className="text-xs font-semibold text-white truncate">Aniversario Camila & Diego</div>
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
