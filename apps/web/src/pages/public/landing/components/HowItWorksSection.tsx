import React from 'react';
import { motion } from 'framer-motion';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Envíanos tu información",
      desc: "Selecciona las fotos más bonitas, escribe tu mensaje o carta y añade un video cortito."
    },
    {
      num: "02",
      title: "Diseñamos la experiencia",
      desc: "Maquetamos la web adaptando el tono emocional, tipografías y efectos según la ocasión."
    },
    {
      num: "03",
      title: "Recibes el Código QR",
      desc: "Te entregamos la tarjeta digital lista para imprimir o enviar por mensaje a medianoche."
    },
    {
      num: "04",
      title: "Sorprende a quien más quieres",
      desc: "La persona escanea el código con su cámara y vive un momento inolvidable llena de emoción."
    }
  ];

  return (
    <section id="como-funciona" className="py-28 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">Paso a Paso</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Listo en solo <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">cuatro sencillos pasos</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="text-5xl font-extrabold text-pink-500/20 mb-6 font-mono">
                {s.num}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
