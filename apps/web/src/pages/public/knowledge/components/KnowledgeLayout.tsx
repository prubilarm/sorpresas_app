import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, Search } from 'lucide-react';

interface KnowledgeLayoutProps {
  children: React.ReactNode;
}

export const KnowledgeLayout: React.FC<KnowledgeLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-pink-200">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { font-size: 11pt; background: white; }
          h1, h2, h3 { page-break-after: avoid; }
          p, ul, li { page-break-inside: avoid; }
          a { text-decoration: none; color: black; }
          .shadow-sm, .shadow-md, .shadow-lg { box-shadow: none !important; border: 1px solid #ccc !important; }
        }
        html { scroll-behavior: smooth; }
      `}} />

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 no-print">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-slate-500 hover:text-slate-900"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center bg-slate-100 text-slate-400 px-3 py-1.5 rounded-md text-sm border border-slate-200 w-64 cursor-not-allowed">
              <Search className="w-4 h-4 mr-2" />
              <span>Buscar en la documentación...</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors">Soporte</a>
            <div className="w-px h-4 bg-slate-300"></div>
            <span className="text-slate-400">v1.2.0</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-12 xl:p-16">
          {children}
        </main>
        
        <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-100 no-print">
          &copy; {new Date().getFullYear()} Sorpresas App. Creado para maravillar.
        </footer>
      </div>
    </div>
  );
};
