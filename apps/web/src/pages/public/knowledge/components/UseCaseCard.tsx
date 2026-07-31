import React, { useState } from 'react';
import { UseCase } from '../../../../data/knowledge/types';
import { ChevronDown, ChevronUp, Instagram, MessageCircle, FileText, Image as ImageIcon, Video, Heart, CheckCircle2 } from 'lucide-react';

export const UseCaseCard: React.FC<{ useCase: UseCase }> = ({ useCase }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'historia' | 'carta' | 'redes'>('historia');

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div 
        className="p-5 cursor-pointer bg-slate-50 border-b border-slate-100 flex items-start justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-100 px-2 py-0.5 rounded">
              {useCase.category}
            </span>
          </div>
          <h4 className="text-lg font-bold text-slate-900">{useCase.title}</h4>
          <p className="text-sm text-slate-500 mt-1 line-clamp-1">{useCase.context}</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 mt-2">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-0">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 px-4 bg-slate-50/50">
            <button 
              onClick={() => setActiveTab('historia')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'historia' ? 'border-pink-500 text-pink-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Historia & Problema</div>
            </button>
            <button 
              onClick={() => setActiveTab('carta')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'carta' ? 'border-pink-500 text-pink-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Carta & Medios</div>
            </button>
            <button 
              onClick={() => setActiveTab('redes')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'redes' ? 'border-pink-500 text-pink-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <div className="flex items-center gap-2"><Instagram className="w-4 h-4" /> Marketing & Redes</div>
            </button>
          </div>

          {/* Tab Content: Historia */}
          {activeTab === 'historia' && (
            <div className="p-5 space-y-4 text-sm text-slate-700">
              <div>
                <strong className="block text-slate-900 mb-1">Contexto:</strong>
                <p>{useCase.context}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <strong className="block text-red-900 mb-1">Problema:</strong>
                <p className="text-red-800">{useCase.problem}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <strong className="block text-green-900 mb-1">Solución:</strong>
                <p className="text-green-800">{useCase.solution}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div>
                  <strong className="block text-slate-900 mb-1"><Heart className="inline w-4 h-4 mr-1 text-pink-500" /> Resultado Emocional</strong>
                  <p>{useCase.emotionalResult}</p>
                </div>
                <div>
                  <strong className="block text-slate-900 mb-1"><CheckCircle2 className="inline w-4 h-4 mr-1 text-blue-500" /> Beneficio Principal</strong>
                  <p>{useCase.benefit}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Carta & Medios */}
          {activeTab === 'carta' && (
            <div className="p-5 space-y-6 text-sm text-slate-700">
              <div>
                <strong className="flex items-center gap-2 text-slate-900 mb-2"><FileText className="w-4 h-4" /> Ejemplo de Carta:</strong>
                <blockquote className="border-l-4 border-pink-300 pl-4 italic text-slate-600 bg-slate-50 py-2 pr-2 rounded-r">
                  "{useCase.exampleLetter}"
                </blockquote>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <strong className="flex items-center gap-2 text-slate-900 mb-2"><ImageIcon className="w-4 h-4" /> Fotos recomendadas:</strong>
                  <p>{useCase.examplePhotos}</p>
                </div>
                <div>
                  <strong className="flex items-center gap-2 text-slate-900 mb-2"><Video className="w-4 h-4" /> Tipo de Video:</strong>
                  <p>{useCase.exampleVideoType}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Marketing */}
          {activeTab === 'redes' && (
            <div className="p-5 space-y-4 text-sm text-slate-700">
              <div className="bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-xs">
                <div className="text-pink-400 mb-2">{'// Guion para Reel / TikTok'}</div>
                <p><strong className="text-white">Hook:</strong> {useCase.socialMedia.hook}</p>
                <p className="mt-2"><strong className="text-white">Script:</strong> {useCase.socialMedia.reelScript}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <strong className="block text-slate-900 mb-1"><Instagram className="inline w-4 h-4 mr-1" /> Idea Instagram:</strong>
                  <p>{useCase.socialMedia.instagram}</p>
                </div>
                <div>
                  <strong className="block text-slate-900 mb-1"><MessageCircle className="inline w-4 h-4 mr-1" /> Idea WhatsApp:</strong>
                  <p>{useCase.socialMedia.whatsapp}</p>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
                <strong className="block text-blue-900 mb-1">Copy para Meta Ads:</strong>
                <p className="text-blue-800 italic">{useCase.socialMedia.metaAdsCopy}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Pequeño hack para importar BookOpen localmente en el tab de arriba
import { BookOpen } from 'lucide-react';
