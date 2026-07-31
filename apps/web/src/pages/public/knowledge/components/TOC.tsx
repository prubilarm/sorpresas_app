import React, { useEffect, useState } from 'react';

export const TOC: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const sections = [
    { id: 'inicio', label: '1. Resumen Ejecutivo' },
    { id: 'producto', label: '2. Producto y Branding' },
    { id: 'estructura', label: '3. Estructura de Experiencia' },
    { id: 'visuales', label: '4. Temas y Galería' },
    { id: 'tonos', label: '5. Tonos Emocionales' },
    { id: 'casos-de-uso', label: '6. Biblioteca Casos de Uso' },
    { id: 'redes', label: '7. Video RRSS' },
    { id: 'planes', label: '8. Planes y Renovación' },
    { id: 'operativa', label: '9. Flujo y Mariachis' },
    { id: 'arquitectura', label: '10. Arquitectura Técnica' },
    { id: 'faq', label: '11. FAQ y Guías' },
  ];

  return (
    <div className="hidden xl:block w-64 shrink-0 no-print">
      <div className="sticky top-24 pl-8 border-l border-slate-100">
        <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">En esta página</h4>
        <ul className="space-y-3 text-sm">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`block transition-colors ${
                  activeSection === section.id 
                    ? 'text-pink-600 font-medium' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
