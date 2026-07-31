import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Star } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const plans = [
    {
      name: "Experiencia Digital",
      price: "14.990",
      featured: false,
      description: "Ideal para sorprender con una web interactiva llena de fotos y recuerdos.",
      features: [
        "Página web personalizada",
        "Hasta 5 fotografías HD",
        "1 Video dedicatoria",
        "Carta personalizada",
        "Código QR imprimible",
        "Disponible por 3 meses"
      ]
    },
    {
      name: "Plan Completo",
      price: "22.990",
      featured: true,
      badge: "MÁS ELEGIDO",
      description: "La experiencia completa: web interactiva QR + video renderizado para publicar en Instagram.",
      features: [
        "Todo lo del Plan Experiencia Digital",
        "Código QR de alta definición",
        "Video MP4 completo renderizado",
        "Formato vertical 9:16 listo para Instagram/TikTok",
        "Descarga directa del MP4",
        "Soporte preferencial"
      ]
    },
    {
      name: "Recuerdo en Video",
      price: "14.990",
      featured: false,
      description: "Generamos un video cinemático completo listo para publicar en tus redes.",
      features: [
        "Creación de la experiencia",
        "Video renderizado completo",
        "Descarga directa en MP4",
        "Optimizado para Instagram Reels",
        "Revisión previa de 24 horas",
        "Eliminación posterior de la página"
      ]
    }
  ];

  return (
    <section id="planes" className="py-28 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">Precios Transparentes</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Invierte en emociones <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">que duran toda la vida</span>.
          </p>
          <p className="text-slate-400 text-lg">Sin suscripciones ocultas ni cargos sorpresa.</p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className={`rounded-3xl p-8 relative flex flex-col justify-between ${
                p.featured 
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-pink-500 shadow-2xl shadow-pink-500/20 md:-translate-y-4' 
                  : 'bg-slate-900/60 border border-slate-800'
              }`}
            >
              {p.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-xs px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-white" />
                  {p.badge}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
                <p className="text-xs text-slate-400 mb-6 min-h-[36px]">{p.description}</p>
                
                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-white">${p.price}</span>
                  <span className="text-slate-400 text-xs ml-2 font-medium">CLP</span>
                </div>

                <ul className="space-y-3.5 text-sm text-slate-300 mb-8">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`https://wa.me/?text=Hola!%20Quiero%20el%20${encodeURIComponent(p.name)}`}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-3.5 rounded-full text-sm font-bold text-center transition-all ${
                  p.featured
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30 hover:scale-105'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                Elegir {p.name}
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
