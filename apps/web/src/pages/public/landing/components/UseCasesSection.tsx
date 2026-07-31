import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Cake, GraduationCap, Gift, Sparkles, Building, Baby, Users } from 'lucide-react';

interface UseCaseItem {
  id: string;
  category: string;
  emoji: string;
  title: string;
  description: string;
  emotionalResult: string;
  exampleText: string;
  image: string;
}

export const UseCasesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = [
    'Todos', 'Parejas', 'Familia', 'Celebraciones', 'Homenajes & Empresa'
  ];

  const useCases: UseCaseItem[] = [
    {
      id: 'aniversario',
      category: 'Parejas',
      emoji: '❤️',
      title: 'Aniversario de Novios / Matrimonio',
      description: 'Revive los momentos más hermosos de su historia desde el día que se conocieron hasta hoy.',
      emotionalResult: 'Lágrimas de nostalgia y un fuerte abrazo de agradecimiento.',
      exampleText: '"3 años juntos y cada día te amo más. Mira nuestro recorrido..."',
      image: '/assets/landing/hero.png'
    },
    {
      id: 'matrimonio-propuesta',
      category: 'Parejas',
      emoji: '💍',
      title: 'Pedida de Matrimonio',
      description: 'El preámbulo perfecto en una cena romántica antes de sacar el anillo de compromiso.',
      emotionalResult: 'Suspenso absoluto que termina en un ¡SÍ! lleno de emoción.',
      exampleText: '"Antes de hacerte la gran pregunta, quiero que recuerdes esto..."',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'cumpleanos',
      category: 'Celebraciones',
      emoji: '🎂',
      title: 'Cumpleaños Especiales',
      description: 'Celebra sus 18, 30, 50 o cualquier año recopilando fotos de su evolución y videos de amigos.',
      emotionalResult: 'Risas, sorpresa total y una fiesta inolvidable.',
      exampleText: '"¡Felices 30! Tu familia y amigos te preparamos esta cápsula del tiempo."',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'dia-madre',
      category: 'Familia',
      emoji: '👩',
      title: 'Día de la Madre (A Distancia)',
      description: 'Envíale un abrazo digital directo a su WhatsApp aunque estés a miles de kilómetros.',
      emotionalResult: 'Mamá tomando café en la mañana llorando de orgullo.',
      exampleText: '"Mami, aunque hoy no pueda estar ahí, te dejo mi corazón en este QR..."',
      image: '/assets/landing/mother.png'
    },
    {
      id: 'dia-padre',
      category: 'Familia',
      emoji: '👨',
      title: 'Día del Padre / Papá Increíble',
      description: 'Recuerda las enseñanzas del hombre que te dio todo con fotos de la infancia.',
      emotionalResult: 'Papá intentando no llorar en frente de todos.',
      exampleText: '"Gracias por ser mi héroe desde el día uno."',
      image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'nacimiento',
      category: 'Familia',
      emoji: '👶',
      title: 'Bienvenida al Bebé / Baby Shower',
      description: 'Anuncia la llegada del nuevo integrante de la familia con sus primeras fotos en el hospital.',
      emotionalResult: 'Los abuelos y tíos derretidos de ternura.',
      exampleText: '"¡Ya llegué! Me llamo Mateo y peso 3.5kg. Mira mis primeras fotos..."',
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'graduacion',
      category: 'Celebraciones',
      emoji: '🎓',
      title: 'Graduación y Logros',
      description: 'Premia años de esfuerzo universitario o escolar guardando el diploma y la fiesta.',
      emotionalResult: 'Orgullo inmenso y ganas de compartirlo en redes sociales.',
      exampleText: '"¡Lo lograste Ingeniero! Siempre supimos que llegarías lejos."',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'pedir-perdon',
      category: 'Parejas',
      emoji: '🙏',
      title: 'Pedir Perdón y Reconciliación',
      description: 'Demuestra arrepentimiento real y esfuerzo sincero tras una discusión importante.',
      emotionalResult: 'Rompe el hielo y abre las puertas a una conversación sanadora.',
      exampleText: '"Sé que me equivoqué. Solo pido que veas esto cuando tengas 2 minutos..."',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'abuelos-homenaje',
      category: 'Homenajes & Empresa',
      emoji: '👵',
      title: 'Homenaje a los Abuelos',
      description: 'Honra la vida y legado de tus abuelos con una recopilación familiar histórica.',
      emotionalResult: 'Paz, gratitud y memoria viva para las futuras generaciones.',
      exampleText: '"Para los mejores abuelos del mundo. Gracias por sus historias y su amor."',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'empresa-corporativo',
      category: 'Homenajes & Empresa',
      emoji: '🏢',
      title: 'Regalos Corporativos / Fin de Año',
      description: 'Sorprende a tus clientes VIP o colaboradores con un QR en una tarjeta de agradecimiento elegante.',
      emotionalResult: 'Fidelización máxima y percepción de marca de súper lujo.',
      exampleText: '"Gracias por acompañarnos este 2026. Ve el mensaje de nuestro CEO..."',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop'
    }
  ];

  const filteredUseCases = selectedCategory === 'Todos' 
    ? useCases 
    : useCases.filter(uc => uc.category === selectedCategory);

  return (
    <section id="casos-de-uso" className="py-28 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">Casos de Uso Infinitos</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Hay un regalo perfecto para <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">cada momento importante</span>.
          </p>
          <p className="text-slate-400 text-lg">
            Imagina inmediatamente cómo vas a sorprender a esa persona especial.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25 scale-105'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUseCases.map((uc) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={uc.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden group hover:border-pink-500/50 transition-all shadow-lg flex flex-col"
            >
              <div className="h-48 relative overflow-hidden bg-slate-900">
                <img 
                  src={uc.image} 
                  alt={uc.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-4 left-4 text-2xl bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-white/10">
                  {uc.emoji}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{uc.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{uc.description}</p>
                  
                  <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-3 text-xs text-pink-300">
                    <strong className="block text-pink-400 font-bold mb-0.5">Resultado Emocional:</strong>
                    {uc.emotionalResult}
                  </div>
                </div>

                <a
                  href="https://wa.me/?text=Hola!%20Quiero%20crear%20mi%20regalo"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-pink-600 text-slate-300 hover:text-white text-xs font-bold transition-colors text-center block border border-slate-800 hover:border-pink-500"
                >
                  Crear regalo para este momento
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
