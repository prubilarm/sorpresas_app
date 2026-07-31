import React from 'react';
import { Check, X } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisonData = [
    { feature: "Durabilidad", sorpresas: "Para siempre en el corazón y celular", flores: "Se marchitan en 5 días", chocolates: "Se comen en 10 minutos", ropa: "Se desgasta o pasa de moda" },
    { feature: "Carga Emocional", sorpresas: "Lágrimas de alegría garantizadas", flores: "Lindo gesto momentáneo", chocolates: "Agradable", ropa: "Utilitario" },
    { feature: "Personalización", sorpresas: "100% tus fotos, palabras y videos", flores: "Genéricas de catálogo", chocolates: "Empaque estándar", ropa: "Talla estándar" },
    { feature: "Facilidad de entrega", sorpresas: "Código QR o enlace instantáneo", flores: "Requiere despacho físico", chocolates: "Requiere despacho físico", ropa: "Ir a la tienda / Envío" },
    { feature: "Efecto Sorpresa", sorpresas: "Inigualable (Plot twist digital)", flores: "Predecible", chocolates: "Predecible", ropa: "Bajo" }
  ];

  return (
    <section className="py-28 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">¿Por qué cambiar?</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Sorpresas App vs <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">Regalos Tradicionales</span>.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                <th className="p-5 text-sm font-bold text-slate-300">Característica</th>
                <th className="p-5 text-sm font-extrabold text-pink-400 bg-pink-500/10 border-x border-pink-500/20">✨ Sorpresas App</th>
                <th className="p-5 text-sm font-medium text-slate-400">🌹 Flores</th>
                <th className="p-5 text-sm font-medium text-slate-400">🍫 Chocolates</th>
                <th className="p-5 text-sm font-medium text-slate-400">🎁 Regalos Físicos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-5 font-bold text-slate-200">{row.feature}</td>
                  <td className="p-5 font-bold text-white bg-pink-500/5 border-x border-pink-500/20 flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>{row.sorpresas}</span>
                  </td>
                  <td className="p-5 text-slate-400">{row.flores}</td>
                  <td className="p-5 text-slate-400">{row.chocolates}</td>
                  <td className="p-5 text-slate-400">{row.ropa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
