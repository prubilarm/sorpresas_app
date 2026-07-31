import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Sorpresas<span className="text-pink-500 font-extrabold">.app</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#que-es" className="hover:text-white transition-colors">¿Qué es?</a>
          <a href="#casos-de-uso" className="hover:text-white transition-colors">Casos de Uso</a>
          <a href="#como-funciona" className="hover:text-white transition-colors">¿Cómo funciona?</a>
          <a href="#planes" className="hover:text-white transition-colors">Planes</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/notebooklm"
            className="hidden sm:inline-flex text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 px-3 py-2 rounded-lg transition-colors"
          >
            Documentación / IA
          </Link>
          <a
            href="https://wa.me/?text=Hola!%20Quiero%20crear%20mi%20regalo%20digital"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all scale-100 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            Crear mi regalo
          </a>
        </div>
      </div>
    </header>
  );
};
