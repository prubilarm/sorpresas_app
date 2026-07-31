import React from 'react';
import { motion } from 'framer-motion';

export const GallerySection: React.FC = () => {
  return (
    <section className="py-28 bg-slate-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">Diseño Adaptativo Premium</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Cada sección maquetada con <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">estética de alta gama</span>.
          </p>
        </div>

        {/* Gallery Phone Showcase with REAL CAPTURAS */}
        <div className="grid md:grid-cols-3 gap-8 items-center">
          
          {/* Phone Mockup 1: Contador cap3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto w-full max-w-xs bg-slate-900 border-8 border-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-pink-500/50 transition-colors"
          >
            <div className="relative">
              <img 
                src="/assets/capturas/cap3.jpg" 
                alt="Contador Real" 
                className="w-full h-auto object-cover rounded-[2rem]"
              />
              <div className="absolute top-[28%] left-[10%] right-[10%] bg-[#080413] py-2 text-center rounded-lg font-sans text-slate-200 border border-purple-500/20 text-xs">
                Para mi gran amor, <strong>Camila</strong>
              </div>
            </div>
          </motion.div>

          {/* Phone Mockup 2: Galería cap5 (Destacado) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto w-full max-w-xs bg-slate-900 border-8 border-pink-500/60 rounded-[2.5rem] shadow-2xl shadow-pink-500/25 relative overflow-hidden scale-105"
          >
            <div className="relative">
              <img 
                src="/assets/capturas/cap5.jpg" 
                alt="Galería Real" 
                className="w-full h-auto object-cover rounded-[2rem]"
              />
              <div className="absolute top-[32%] left-[6%] right-[6%] bottom-[5%] rounded-[2rem] overflow-hidden border border-purple-500/30">
                <img 
                  src="/assets/landing/hero.png" 
                  alt="Fotografía protegida" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Phone Mockup 3: Promesa cap6 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-full max-w-xs bg-slate-900 border-8 border-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-pink-500/50 transition-colors"
          >
            <img 
              src="/assets/capturas/cap6.jpg" 
              alt="Promesa Real" 
              className="w-full h-auto object-cover rounded-[2rem]"
            />
          </motion.div>

        </div>

      </div>
    </section>
  );
};
