import React, { useEffect } from 'react';
import { knowledgeBase } from '../../data/knowledge';
import { exportKnowledge } from '../../utils/knowledgeExportUtils';
import { KnowledgeLayout } from './knowledge/components/KnowledgeLayout';
import { TOC } from './knowledge/components/TOC';
import { UseCaseCard } from './knowledge/components/UseCaseCard';
import { SystemScreenshot } from './knowledge/components/SystemScreenshot';
import { MermaidDiagram } from './knowledge/components/MermaidDiagram';
import { Download, FileText, Code, FileJson, FileType2, ChevronRight } from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  useEffect(() => {
    document.title = "Documentación Oficial - Sorpresas App";
    
    // Inject basic SEO tags if they don't exist
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', knowledgeBase.product.summary);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const archDiagram = `
graph TD
    Client[Cliente/Navegador] -->|HTTPS| Frontend[Vite/React SPA]
    Frontend -->|API REST| Backend[Express.js API]
    Backend --> DB[(Base de Datos JSON/Supabase)]
    Backend --> FS[File System / S3]
    Client -->|Escanea QR| Redirector[Servicio de Rutas Cortas]
    Redirector --> Frontend
    `;

  return (
    <KnowledgeLayout>
      <div className="flex flex-col xl:flex-row gap-12">
        
        {/* Main Content */}
        <div className="flex-1 min-w-0 pb-24">
          
          {/* Header */}
          <header className="mb-16 border-b border-slate-200 pb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Documentación Oficial
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl leading-relaxed mb-8">
              La guía definitiva sobre arquitectura, casos de uso, flujos operativos y estrategias comerciales de Sorpresas App.
            </p>
            
            <div className="flex flex-wrap gap-3 no-print">
              <button onClick={() => exportKnowledge('json')} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <FileJson className="w-4 h-4 text-slate-500" /> JSON API
              </button>
              <button onClick={() => exportKnowledge('md')} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <FileType2 className="w-4 h-4 text-slate-500" /> Markdown
              </button>
              <button onClick={() => exportKnowledge('txt')} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <FileText className="w-4 h-4 text-slate-500" /> Plain Text
              </button>
              <button onClick={() => exportKnowledge('html')} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <Code className="w-4 h-4 text-slate-500" /> HTML Static
              </button>
              <button onClick={handlePrint} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm ml-auto">
                <Download className="w-4 h-4" /> Guardar PDF
              </button>
            </div>
          </header>

          <article className="space-y-24">
            
            <section id="inicio" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">1. Resumen Ejecutivo</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  {knowledgeBase.product.summary}
                </p>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">El Problema</h3>
                    <p className="text-slate-600">{knowledgeBase.product.problemSolved}</p>
                  </div>
                  <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100">
                    <h3 className="text-sm font-bold text-pink-900 uppercase tracking-wider mb-2">La Solución</h3>
                    <p className="text-pink-800">{knowledgeBase.product.valueProposition}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mt-8 mb-4">¿Cómo funciona?</h3>
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex-1 text-center">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-slate-500">1</div>
                    <p className="text-sm font-medium">Cliente Compra & Sube Medios</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 hidden sm:block" />
                  <div className="flex-1 text-center">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-slate-500">2</div>
                    <p className="text-sm font-medium">Armado & Generación QR</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 hidden sm:block" />
                  <div className="flex-1 text-center">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-pink-600">3</div>
                    <p className="text-sm font-medium">Destinatario Escanea & Se Emociona</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="producto" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">2. Producto y Galería de Pantallas Reales</h2>
              
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <SystemScreenshot 
                  src="/assets/showcase/screen1.png" 
                  alt="Pantalla de Bloqueo / Portada" 
                  caption="Pantalla 1: Portada con título de la historia y botón de desbloqueo." 
                  isMobile 
                />
                <SystemScreenshot 
                  src="/assets/showcase/screen2.png" 
                  alt="Reproductor de Música" 
                  caption="Pantalla 2: Música de fondo elegida por el usuario." 
                  isMobile 
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <SystemScreenshot 
                  src="/assets/showcase/screen4.png" 
                  alt="Carta Emocional" 
                  caption="Pantalla 4: Carta redactada en párrafos elegantes." 
                  isMobile 
                />
                <SystemScreenshot 
                  src="/assets/showcase/screen8.png" 
                  alt="Sección de Video" 
                  caption="Pantalla 8: Reproductor de video de dedicatoria con descarga." 
                  isMobile 
                />
              </div>
            </section>

            <section id="estructura" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">3. Estructura de la Experiencia</h2>
              <div className="space-y-4">
                {knowledgeBase.experienceStructure.sections.map((sec, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                    <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{sec.name}</h4>
                      <p className="text-sm text-slate-600 mt-1">{sec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="visuales" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">4. Temas y Galería</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {knowledgeBase.visualThemes.map(theme => (
                  <div key={theme.id} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <h3 className="text-lg font-bold mb-2">{theme.name}</h3>
                    <p className="text-sm text-slate-600 mb-4">{theme.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {theme.dynamicElements.map(el => (
                        <span key={el} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">{el}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="tonos" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">5. Tonos Emocionales</h2>
              <div className="space-y-6">
                {knowledgeBase.emotionalTones.map((tone, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{tone.name}</h3>
                    <p className="text-slate-700 mb-4">{tone.goal}</p>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-green-700">✓ Usar:</strong> {tone.recommendedWords.join(', ')}
                      </div>
                      <div>
                        <strong className="text-red-700">✗ Evitar:</strong> {tone.avoidWords.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="casos-de-uso" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">6. Biblioteca de Casos de Uso</h2>
              <p className="text-slate-500 mb-8">Historias reales diseñadas para campañas de marketing, inspiración de clientes y creación de contenido automatizado.</p>
              
              <div className="grid gap-6">
                {knowledgeBase.useCases.map(uc => (
                  <UseCaseCard key={uc.id} useCase={uc} />
                ))}
              </div>
            </section>

            <section id="redes" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">7. Video para RRSS</h2>
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-indigo-900 mb-4">Exportación Social Media</h3>
                <p className="text-indigo-800 mb-6">{knowledgeBase.socialMediaVideoGeneration.description}</p>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="font-bold mb-4">Especificaciones:</h4>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    {knowledgeBase.socialMediaVideoGeneration.techSpecs.map(s => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section id="planes" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">8. Planes y Renovación</h2>
              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                {knowledgeBase.commercialPlans.map(plan => (
                  <div key={plan.name} className="p-6 border border-slate-200 rounded-2xl bg-white text-center">
                    <h3 className="font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-extrabold text-pink-600 mb-4">${plan.referencePriceCLP.toLocaleString()}</div>
                    <ul className="text-sm text-slate-600 space-y-2 text-left">
                      {plan.includes.map(inc => (
                        <li key={inc} className="flex gap-2"><span className="text-pink-500">✓</span> {inc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section id="operativa" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">9. Flujo y Mariachis</h2>
              <SystemScreenshot 
                src="/assets/docs/editor.png" 
                alt="Panel Editor de Regalo" 
                caption="El panel de control permite configurar el regalo visualmente antes de la entrega física por parte del Mariachi."
              />
              <div className="mt-8">
                <h3 className="font-bold text-lg mb-4">Integración Física (Serenata)</h3>
                <p className="text-slate-700 mb-4">{knowledgeBase.mariachiIntegration.description}</p>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700 font-medium">
                    {knowledgeBase.mariachiIntegration.experienceFlow.map(step => <li key={step}>{step}</li>)}
                  </ol>
                </div>
              </div>
            </section>

            <section id="arquitectura" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">10. Arquitectura Técnica</h2>
              <p className="text-slate-600 mb-6">Infraestructura, stack de tecnologías y estado de implementación.</p>
              
              <MermaidDiagram chart={archDiagram} title="Diagrama de Arquitectura de Alto Nivel" />
              
              <div className="mt-12 overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 font-semibold text-slate-900">Módulo / Feature</th>
                      <th className="p-4 font-semibold text-slate-900">Estado</th>
                      <th className="p-4 font-semibold text-slate-900">Archivos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {knowledgeBase.implementationStatus.map((status, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="p-4">{status.feature}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            status.status === 'Implementada' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {status.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-xs text-slate-500">{status.relatedFiles}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="faq" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">11. FAQ y Guías AI</h2>
              <div className="bg-slate-900 text-slate-300 rounded-2xl p-8 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Directrices Estrictas para IA (NotebookLM)</h3>
                <ul className="space-y-3 list-disc pl-5">
                  {knowledgeBase.aiGuidelines.map(g => <li key={g}>{g}</li>)}
                </ul>
              </div>
              
              <div className="space-y-4">
                {knowledgeBase.faq.map((q, i) => (
                  <details key={i} className="group bg-white border border-slate-200 rounded-xl [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-slate-900 font-medium">
                      {q.question}
                      <span className="shrink-0 rounded-full bg-slate-50 p-1.5 text-slate-900 sm:p-3 group-open:-rotate-180 transition-transform">
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </summary>
                    <p className="px-4 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                      {q.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>

          </article>
        </div>

        {/* Table of Contents */}
        <TOC />
        
      </div>
    </KnowledgeLayout>
  );
};

// Pequeño hack para importar icono en details
import { ChevronDown } from 'lucide-react';
