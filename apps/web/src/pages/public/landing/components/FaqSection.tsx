import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const faqs = [
    {
      q: "¿Necesito instalar una aplicación para ver el regalo?",
      a: "No. Todo funciona directamente desde el navegador web de cualquier teléfono inteligente. La persona solo debe abrir la cámara de su celular y escanear el Código QR."
    },
    {
      q: "¿Funciona en iPhone y Android?",
      a: "Sí, es 100% compatible con todos los navegadores modernos (Safari, Chrome, Firefox, Edge) en iOS y Android."
    },
    {
      q: "¿Cuántas fotos y videos puedo incluir?",
      a: "El plan estándar incluye hasta 5 fotografías en alta resolución y 1 video personalizado de hasta 3 minutos de duración."
    },
    {
      q: "¿Cuánto tiempo estará activa la experiencia web?",
      a: "Por defecto la experiencia permanece activa durante 3 meses completos. Puedes renovar su vigencia posteriormente por periodos de 3, 6 o 12 meses."
    },
    {
      q: "¿Cómo recibo el Código QR para entregarlo?",
      a: "Te enviamos una imagen de alta resolución en formato PNG y PDF lista para imprimir o enviar por mensaje directo."
    }
  ];

  return (
    <section id="faq" className="py-28 bg-slate-900 text-white relative">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">Preguntas Frecuentes</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Resuelve todas tus <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">dudas antes de regalar</span>.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-white font-bold text-lg hover:text-pink-400 transition-colors">
                <span>{faq.q}</span>
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:-rotate-180 transition-transform shrink-0" />
              </summary>
              <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-900 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

      </div>
    </section>
  );
};
