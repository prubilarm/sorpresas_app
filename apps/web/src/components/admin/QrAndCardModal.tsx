import React, { useState } from 'react';
import { X, QrCode, FileText, Copy, Check, Download, ExternalLink, Sparkles, Printer, Share2 } from 'lucide-react';
import { getPrintableCardUrl, getQrCodeUrl, getPublicGiftUrl } from '../../services/api';

interface QrAndCardModalProps {
  project: any;
  onClose: () => void;
}

export const QrAndCardModal: React.FC<QrAndCardModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'card' | 'qr'>('card');
  const [qrColor, setQrColor] = useState('#e83482');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [copied, setCopied] = useState(false);

  const sender = project.sender_name || project.person_one_name || 'Remitente';
  const recipient = project.recipient_name || project.person_two_name || 'Destinatario';
  const publicUrl = getPublicGiftUrl(project.slug);
  const pdfUrl = getPrintableCardUrl(project.id);
  const pngQrUrl = getQrCodeUrl(project.id, 'png', qrColor, qrBgColor);
  const svgQrUrl = getQrCodeUrl(project.id, 'svg', qrColor, qrBgColor);

  const whatsappMessage = encodeURIComponent(
    `¡Hola! Tu experiencia de regalo personalizada ya está lista. Puedes verla aquí: ${publicUrl}\n\nO escanea el código QR que te adjuntamos. ¡Esperamos que te emocione mucho! ❤️`
  );
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Código QR y Tarjeta de Presentación
              </h2>
              <p className="text-xs text-slate-400">
                {project.internal_name} ({sender} & {recipient})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition ${
              activeTab === 'card'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Tarjeta de Presentación (9x9 cm)
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition ${
              activeTab === 'qr'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Personalizador de Código QR
          </button>
        </div>

        {/* Main Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'card' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                {/* Visual 9cm x 9cm Physical Card Mockup */}
                <div className="relative w-64 h-64 rounded-2xl p-5 shadow-2xl flex flex-col justify-between overflow-hidden border border-white/10 select-none"
                     style={{ background: 'radial-gradient(circle at top, #67143a, #27000f 65%)' }}>
                  <div className="space-y-1">
                    <span className="block uppercase text-[9px] tracking-widest text-pink-300 font-bold">
                      Hecho especialmente para
                    </span>
                    <h3 className="text-lg font-serif font-bold text-white leading-tight">
                      {project.person_one_name || sender} &amp; {project.person_two_name || recipient}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-[10px] leading-snug text-pink-100/90 flex-1">
                      Escanea este código con la cámara de tu teléfono y descubre un recuerdo preparado con mucho amor.
                    </p>
                    <div className="w-20 h-20 bg-white p-1 rounded-lg shadow-inner flex items-center justify-center flex-shrink-0">
                      <img src={pngQrUrl} alt="Código QR Imprimible" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>

                {/* Printable Card Instructions & Action Buttons */}
                <div className="space-y-4 max-w-md text-slate-300 text-sm">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Tarjeta Física de Alta Resolución
                    </span>
                    <h4 className="text-base font-bold text-white">Listo para Imprimir</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Genera un PDFvectorial de exactamente <strong>9 x 9 cm</strong> listo para imprenta o impresora casera en papel fotográfico o cartulina opaca.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 font-bold text-white text-sm shadow-lg hover:brightness-110 active:scale-95 transition"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Tarjeta PDF (9x9 cm)
                    </a>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition"
                      title="Abrir vista de impresión"
                    >
                      <Printer className="w-4 h-4" />
                      Imprimir
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                {/* Live QR Preview */}
                <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                  <div className="p-4 rounded-2xl shadow-xl transition-all duration-300" style={{ backgroundColor: qrBgColor }}>
                    <img src={pngQrUrl} alt="QR Code Preview" className="w-48 h-48 object-contain" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono text-center truncate max-w-full px-2">
                    {publicUrl}
                  </span>
                </div>

                {/* Color Customization & Format Controls */}
                <div className="space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white">Personalizar Código QR</h3>
                    
                    {/* Foreground Color */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Color de Módulos (Código)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer p-1"
                        />
                        <div className="flex gap-1.5 flex-wrap">
                          {['#e83482', '#27000f', '#000000', '#6366f1', '#10b981', '#f59e0b'].map((c) => (
                            <button
                              key={c}
                              onClick={() => setQrColor(c)}
                              className={`w-6 h-6 rounded-full border-2 transition ${
                                qrColor === c ? 'border-pink-500 scale-110' : 'border-transparent opacity-80 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Background Color */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Color de Fondo
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={qrBgColor}
                          onChange={(e) => setQrBgColor(e.target.value)}
                          className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer p-1"
                        />
                        <div className="flex gap-1.5 flex-wrap">
                          {['#ffffff', '#fbcfe8', '#27000f', '#0f172a', '#18181b'].map((c) => (
                            <button
                              key={c}
                              onClick={() => setQrBgColor(c)}
                              className={`w-6 h-6 rounded-full border-2 transition ${
                                qrBgColor === c ? 'border-pink-500 scale-110' : 'border-transparent opacity-80 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Public Link Box */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Enlace Público del Regalo
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={publicUrl}
                        className="flex-1 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-pink-300 focus:outline-none"
                      />
                      <button
                        onClick={handleCopyUrl}
                        className="px-3 py-1.5 rounded-lg bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/30 text-xs font-bold transition flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  {/* Downloads Footer Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleDownloadFile(pngQrUrl, `qr_${project.slug}.png`)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-pink-600 text-white font-bold text-xs hover:bg-pink-500 shadow-md transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descargar PNG
                    </button>
                    <button
                      onClick={() => handleDownloadFile(svgQrUrl, `qr_${project.slug}.svg`)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descargar SVG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              Enviar por WhatsApp al Cliente
            </a>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-pink-400 transition font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Abrir regalo público
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-semibold text-xs transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
