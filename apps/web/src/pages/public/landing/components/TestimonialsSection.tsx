import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Valeria R.",
      role: "Aniversario de Novios",
      text: "Le regalé el QR a mi pololo en nuestro aniversario. Pensó que era una tarjeta normal hasta que escaneó. Cuando vio el video con nuestra música se puso a llorar. Valio cada peso.",
      stars: 5,
      avatar: "V"
    },
    {
      name: "Ignacio M.",
      role: "Día de la Madre",
      text: "Vivo en España y mi mamá en Chile. Le mandé el enlace por WhatsApp en la mañana de su cumpleaños. Me llamó llorando desconsolada de la emoción. Es el mejor regalo a distancia.",
      stars: 5,
      avatar: "I"
    },
    {
      name: "Constanza B.",
      role: "Pedida de Matrimonio",
      text: "Mi prometido usó Sorpresas App para la propuesta. El recorrido por nuestras fotos fue el preámbulo perfecto antes de que sacara el anillo. No lo olvidaré jamás.",
      stars: 5,
      avatar: "C"
    }
  ];

  return (
    <section className="py-28 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">Testimonios Reales</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Lo que dicen quienes <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">ya regalaron emociones</span>.
          </p>
          <span className="inline-block text-xs text-slate-500 mt-2 font-mono">(Ejemplos de diseño de clientes satisfechos)</span>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative flex flex-col justify-between">
              <Quote className="w-10 h-10 text-pink-500/20 mb-4" />
              <p className="text-slate-300 text-sm leading-relaxed italic mb-6">"{t.text}"</p>
              
              <div className="flex items-center gap-4 border-t border-slate-800 pt-4">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center font-bold text-pink-400">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
