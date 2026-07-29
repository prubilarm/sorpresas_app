import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { trackAnalyticsEvent } from '../../services/api';

interface ShareModalProps {
  projectId: string;
  shareUrl: string;
  title: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ projectId, shareUrl, title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    trackAnalyticsEvent(projectId, 'share_click');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    trackAnalyticsEvent(projectId, 'share_click');
    const text = encodeURIComponent(`Mira este detalle especial hecho con amor: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      trackAnalyticsEvent(projectId, 'share_click');
      navigator.share({
        title: title || 'Nuestra historia',
        text: 'Mira este detalle especial',
        url: shareUrl,
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
      <button
        onClick={handleWhatsApp}
        className="p-3 rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-500 transition"
        title="Compartir por WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
      </button>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 py-2.5 px-4 rounded-full bg-pink-600 text-white font-medium text-sm shadow-xl hover:bg-pink-500 transition"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? '¡Copiado!' : 'Copiar enlace'}
      </button>

      {'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="p-3 rounded-full bg-slate-800 text-white shadow-xl hover:bg-slate-700 transition"
          title="Compartir"
        >
          <Share2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
