import React, { useState } from 'react';
import { Menu, X, BookOpen, Layers, Lightbulb, Image as ImageIcon, Box, Heart, MessageSquare, TerminalSquare, Rss, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navItems = [
  { name: 'Inicio', icon: BookOpen, href: '#inicio' },
  { name: 'Producto', icon: Box, href: '#producto' },
  { name: 'Estructura', icon: Layers, href: '#estructura' },
  { name: 'Temas Visuales', icon: ImageIcon, href: '#visuales' },
  { name: 'Tonos Emocionales', icon: Heart, href: '#tonos' },
  { name: 'Casos de Uso', icon: Lightbulb, href: '#casos-de-uso' },
  { name: 'Redes Sociales', icon: Rss, href: '#redes' },
  { name: 'FAQ', icon: MessageSquare, href: '#faq' },
  { name: 'Arquitectura', icon: TerminalSquare, href: '#arquitectura' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-slate-50 border-r border-slate-200 
        transform transition-transform duration-200 ease-in-out lg:translate-x-0 overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 text-pink-600 font-bold text-xl">
              Sorpresas App <span className="text-xs bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full">DOCS</span>
            </Link>
            <button className="lg:hidden text-slate-500 hover:text-slate-900" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver a la app
            </Link>
            
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">Documentación</h3>
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-white hover:text-pink-600 hover:shadow-sm transition-all"
              >
                <item.icon className="w-4 h-4 text-slate-400" />
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
