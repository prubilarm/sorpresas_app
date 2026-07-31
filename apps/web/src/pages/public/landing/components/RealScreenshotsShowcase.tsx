import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShieldCheck, Smartphone, Eye } from 'lucide-react';

interface ScreenItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  overlayType?: 'cover' | 'recipient' | 'photo';
}

export const RealScreenshotsShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const screens: ScreenItem[] = [
    {
      id: 1,
      title: "1. Desbloqueo y Portada",
      subtitle: "Pantalla inicial con el título de la historia, dedicatoria 'Un detalle hecho con amor' y botón de entrada.",
      image: "/assets/capturas/cap1.jpg",
      overlayType: 'cover'
    },
    {
      id: 2,
      title: "2. Reproductor de Música Personalizado",
      subtitle: "Reproductor con la canción favorita de la pareja ('Until Found - Sam Smith') sonando de fondo.",
      image: "/assets/capturas/cap2.jpg"
    },
    {
      id: 3,
      title: "3. Contador de Tiempo Juntos",
      subtitle: "Muestra la fecha de inicio y contabiliza exactamente los días, meses y años de relación.",
      image: "/assets/capturas/cap3.jpg",
      overlayType: 'recipient'
    },
    {
      id: 4,
      title: "4. Carta Emocional",
      subtitle: "Párrafos con tipografía serif de alta costura diseñados para emocionar desde las primeras líneas.",
      image: "/assets/capturas/cap4.jpg"
    },
    {
      id: 5,
      title: "5. Galería de Recuerdos en Alta Resolución",
      subtitle: "Carrusel fotográfico con contador de diapositivas (1 / 10) y diseño envolvente.",
      image: "/assets/capturas/cap5.jpg",
      overlayType: 'photo'
    },
    {
      id: 6,
      title: "6. Sección de Promesas",
      subtitle: "Tarjeta estelar para guardar votos, juramentos o promesas de vida.",
      image: "/assets/capturas/cap6.jpg"
    },
    {
      id: 7,
      title: "7. Video Dedicatoria y Descarga",
      subtitle: "Video interactivo personal con opción de reproducción en HD y botón de descarga directa en MP4.",
      image: "/assets/capturas/cap7.jpg"
    }
  ];

  const handleNext = () => setActiveIdx((prev) => (prev + 1) % screens.length);
  const handlePrev = () => setActiveIdx((prev) => (prev - 1 + screens.length) % screens.length);

  const current = screens[activeIdx];

  return (
    <section id="como-funciona" className="py-28 bg-slate-950 text-white relative border-t border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-pink-400" />
            <span>Muestra Real del Sistema</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Recorre la experiencia <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">pantalla por pantalla</span>.
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Capturas reales tomadas directamente de una experiencia activa en la plataforma.
          </p>
        </div>

        {/* Display Container */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Phone Display with Anonymity Overlays */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[320px] aspect-[9/19.5] bg-slate-900 border-8 border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden shadow-pink-500/15">
              
              {/* Actual Captura Image */}
              <img 
                src={current.image} 
                alt={current.title}
                className="w-full h-full object-cover"
              />

              {/* OVERLAY 1: Cover Names anonymization */}
              {current.overlayType === 'cover' && (
                <div className="absolute bottom-[28%] left-[8%] right-[8%] bg-[#080413] py-2.5 text-center rounded-xl font-sans text-white border border-purple-500/30">
                  <span className="text-xs text-slate-200">De: <strong>Diego</strong> → Para: <strong>Camila</strong></span>
                </div>
              )}

              {/* OVERLAY 2: Recipient Name anonymization */}
              {current.overlayType === 'recipient' && (
                <div className="absolute top-[28%] left-[10%] right-[10%] bg-[#080413] py-2 text-center rounded-lg font-sans text-slate-200 border border-purple-500/20 text-xs">
                  Para mi gran amor, <strong>Camila</strong>
                </div>
              )}

              {/* OVERLAY 3: Photo anonymization (Snow Couple replaced with demo photo) */}
              {current.overlayType === 'photo' && (
                <div className="absolute top-[32%] left-[6%] right-[6%] bottom-[5%] rounded-[2rem] overflow-hidden border border-purple-500/30">
                  <img 
                    src="/assets/landing/hero.png" 
                    alt="Fotografía protegida" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Speaker notch */}
              <div className="absolute top-0 inset-x-0 h-5 bg-slate-950/80 flex items-center justify-center">
                <div className="w-16 h-2 bg-slate-900 rounded-b-md" />
              </div>

            </div>
          </div>

          {/* Right: Screen Description & Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl">
              <span className="text-xs font-mono font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full">
                Sección {activeIdx + 1} de {screens.length}
              </span>
              <h3 className="text-2xl font-bold text-white">{current.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{current.subtitle}</p>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white transition-all flex items-center gap-2 text-sm font-bold shadow-lg shadow-pink-500/30"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {screens.map((scr, idx) => (
                <button
                  key={scr.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-16 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeIdx === idx ? 'border-pink-500 scale-105 shadow-lg shadow-pink-500/20' : 'border-slate-800 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={scr.image} alt={scr.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
