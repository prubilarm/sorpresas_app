import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Images, FileText, Video, Sparkles } from 'lucide-react';

export const WhatRecipientGetsSection: React.FC = () => {
  return (
    <section className="py-28 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">¿Qué incluye la experiencia?</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Todo empaquetado en un <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">diseño de lujo interactivo</span>.
          </p>
        </div>

        {/* Bento Grid with REAL CAPTURAS */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Bento Item 1: Código QR Exclusivo */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-pink-500/40 transition-colors"
          >
            <div className="max-w-md space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Código QR Exclusivo Imprimible</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Recibes una tarjeta física en PDF lista para imprimir en papel de alta densidad. Puedes colocarla en un ramo de flores, caja de regalo, serenata o carta.
              </p>
            </div>
            <div className="absolute right-6 -bottom-10 w-64 h-64 bg-slate-950 border border-white/10 rounded-2xl p-6 shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500 flex flex-col items-center justify-center">
              <QrCode className="w-36 h-36 text-white" />
              <span className="text-[10px] text-pink-400 font-mono mt-3 uppercase tracking-wider font-bold">Sorpresas QR Edition</span>
            </div>
          </motion.div>

          {/* Bento Item 2: Carta Personalizada (Showing cap4.jpg screenshot) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-pink-500/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Carta Emocional</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Párrafos maquetados con tipografía elegante para crear momentos de suspenso y emoción.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 h-44">
              <img src="/assets/capturas/cap4.jpg" alt="Carta Real" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Bento Item 3: Reproductor de Música (Showing cap2.jpg screenshot) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-pink-500/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Música Persistente</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                La canción especial de ustedes sonando mientras el destinatario navega la historia.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 h-44">
              <img src="/assets/capturas/cap2.jpg" alt="Música Real" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Bento Item 4: Video Dedicatoria y Descarga (Showing cap7.jpg screenshot) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden hover:border-pink-500/40 transition-colors flex flex-col md:flex-row items-center gap-8"
          >
            <div className="space-y-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Video Dedicatoria con Descarga</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Inserta tu video personal. La persona podrá reproducirlo directamente dentro de la experiencia web y descargarlo en formato MP4 con un solo clic.
              </p>
            </div>
            <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden border border-white/10 shrink-0">
              <img src="/assets/capturas/cap7.jpg" alt="Video Real" className="w-full h-full object-cover" />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
