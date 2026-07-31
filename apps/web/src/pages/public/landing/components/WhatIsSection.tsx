import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Wand2, QrCode, HeartHandshake, ArrowRight } from 'lucide-react';

export const WhatIsSection: React.FC = () => {
  const steps = [
    {
      icon: Upload,
      title: "1. Envías tu contenido",
      description: "Fotos inolvidables, un video especial y tus palabras más sinceras.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Wand2,
      title: "2. Creamos la magia",
      description: "Diseñamos una web personalizada interactiva con música y animaciones.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: QrCode,
      title: "3. Recibes un QR exclusivo",
      description: "Un código QR de alta resolución listo para imprimir en una tarjeta física o regalo.",
      color: "from-amber-500 to-rose-500"
    },
    {
      icon: HeartHandshake,
      title: "4. Escanea y se emociona",
      description: "La persona abre su cámara, escanea y vive una experiencia inolvidable.",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <section id="que-es" className="py-28 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">¿Cómo funciona el regalo?</h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            De recuerdos sueltos a una <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">obra de arte interactiva</span>.
          </p>
          <p className="text-slate-400 text-lg leading-relaxed">
            Olvídate de los regalos materiales que terminan acumulando polvo. Regala emociones reales a través de un viaje digital cuidadosamente maquetado.
          </p>
        </div>

        {/* 4 Steps Flow */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 relative group hover:border-pink-500/50 transition-colors shadow-lg"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 shadow-md shadow-pink-500/10 group-hover:scale-110 transition-transform`}>
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              
              {idx < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-700 z-20 pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
