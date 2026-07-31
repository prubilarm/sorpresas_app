import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, MessageCircle, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-16 text-sm">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 mb-12">
        
        <div className="space-y-4 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            <span>Sorpresas.app</span>
          </Link>
          <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
            Plataforma líder en la creación de experiencias digitales personalizadas con código QR. Transformamos fotografías y recuerdos en emociones inolvidables.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Navegación</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#que-es" className="hover:text-white transition-colors">¿Qué es?</a></li>
            <li><a href="#casos-de-uso" className="hover:text-white transition-colors">Casos de Uso</a></li>
            <li><a href="#planes" className="hover:text-white transition-colors">Planes & Precios</a></li>
            <li><Link to="/notebooklm" className="hover:text-white transition-colors">Documentación para IA</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Contacto</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-400" />
              <a href="https://wa.me/" target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp Soporte</a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-400" />
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">@sorpresas.app</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>contacto@sorpresas.app</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Sorpresas App. Todos los derechos reservados.</p>
        <p className="mt-2 sm:mt-0">Diseñado con amor para emocionar al mundo.</p>
      </div>
    </footer>
  );
};
