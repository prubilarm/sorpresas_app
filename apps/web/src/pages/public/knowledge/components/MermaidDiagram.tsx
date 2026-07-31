import React, { useEffect, useRef } from 'react';

interface MermaidDiagramProps {
  chart: string;
  title?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load Mermaid from CDN if not present
    if (!window.mermaid) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.8.0/dist/mermaid.min.js';
      script.async = true;
      script.onload = () => {
        window.mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
        renderDiagram();
      };
      document.head.appendChild(script);
    } else {
      renderDiagram();
    }

    function renderDiagram() {
      if (window.mermaid && containerRef.current) {
        window.mermaid.render('mermaid-svg-' + Math.random().toString(36).substring(7), chart).then((result: any) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = result.svg;
          }
        });
      }
    }
  }, [chart]);

  return (
    <div className="my-8 bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm overflow-x-auto">
      {title && <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 text-center">{title}</h4>}
      
      {/* Visual Render for Humans */}
      <div ref={containerRef} className="flex justify-center min-w-[600px] no-print">
        <div className="text-slate-400 text-sm animate-pulse">Generando diagrama...</div>
      </div>

      {/* Raw Text for NotebookLM / Fallback / Print */}
      <div className="mt-6 pt-4 border-t border-slate-200 hidden print:block">
        <p className="text-xs font-mono text-slate-400 mb-2">Mermaid Source (For AI / Print):</p>
        <pre className="text-xs bg-white p-4 rounded text-slate-600 overflow-x-auto">
          {chart.trim()}
        </pre>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    mermaid: any;
  }
}
