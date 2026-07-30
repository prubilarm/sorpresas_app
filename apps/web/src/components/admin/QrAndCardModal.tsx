import React, { useState } from 'react';
import { X, QrCode, FileText, Copy, Check, Download, ExternalLink, Sparkles, Printer, Share2, Palette, Edit3, Layout, Type, Maximize2, Shield } from 'lucide-react';
import { getPrintableCardUrl, getQrCodeUrl, getPublicGiftUrl } from '../../services/api';

interface QrAndCardModalProps {
  project: any;
  onClose: () => void;
}

export interface CardStylePreset {
  id: string;
  name: string;
  tag: string;
  bgStyle: string;
  borderColor: string;
  innerBorderColor: string;
  kickerColor: string;
  namesColor: string;
  messageColor: string;
  qrDark: string;
  qrLight: string;
  badgeBg: string;
  fontTitleClass: string;
}

export const CARD_STYLES: CardStylePreset[] = [
  {
    id: 'midnight_velvet',
    name: '👑 Real Borgoña & Pan de Oro',
    tag: 'Realeza & Amor Eterno',
    bgStyle: 'radial-gradient(circle at 50% 20%, #440d24, #1a030c 80%)',
    borderColor: '#e5c158',
    innerBorderColor: 'rgba(229, 193, 88, 0.45)',
    kickerColor: '#f3d375',
    namesColor: '#ffffff',
    messageColor: '#fce7f0',
    qrDark: '#27000f',
    qrLight: '#ffffff',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    fontTitleClass: "font-['Playfair_Display'] italic font-bold",
  },
  {
    id: 'rose_onyx',
    name: '💎 Ónix Joya & Oro Rosa',
    tag: 'Sutileza & Lujo Moderno',
    bgStyle: 'linear-gradient(145deg, #231c2b, #0c0d12)',
    borderColor: '#f4a2b8',
    innerBorderColor: 'rgba(244, 162, 184, 0.4)',
    kickerColor: '#f8c2d1',
    namesColor: '#ffffff',
    messageColor: '#fce8ef',
    qrDark: '#1e1b26',
    qrLight: '#ffffff',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    fontTitleClass: "font-['Cinzel'] tracking-wider font-bold",
  },
  {
    id: 'minimal_linen',
    name: '📜 Lino Marfil & Oro Imperial',
    tag: 'Alta Costura & Pureza',
    bgStyle: 'linear-gradient(180deg, #ffffff 0%, #f7f4ed 100%)',
    borderColor: '#b89242',
    innerBorderColor: 'rgba(184, 146, 66, 0.35)',
    kickerColor: '#8c6c2e',
    namesColor: '#1c1917',
    messageColor: '#44403c',
    qrDark: '#1c1917',
    qrLight: '#ffffff',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    fontTitleClass: "font-['Cormorant_Garamond'] font-bold text-xl",
  },
  {
    id: 'emerald_passion',
    name: '🌿 Esmeralda Real & Champaña',
    tag: 'Majestuoso & Exclusivo',
    bgStyle: 'radial-gradient(circle at 50% 20%, #0e4431, #031c13 85%)',
    borderColor: '#f5e6be',
    innerBorderColor: 'rgba(245, 230, 190, 0.45)',
    kickerColor: '#f5e6be',
    namesColor: '#ffffff',
    messageColor: '#d1f2e6',
    qrDark: '#031c13',
    qrLight: '#ffffff',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    fontTitleClass: "font-['Playfair_Display'] font-bold",
  },
  {
    id: 'celestial_night',
    name: '🌌 Noche Celestial & Plata Líquida',
    tag: 'Estelar & Infinito',
    bgStyle: 'linear-gradient(135deg, #131d42, #040817)',
    borderColor: '#e2e8f0',
    innerBorderColor: 'rgba(226, 232, 240, 0.4)',
    kickerColor: '#cbd5e1',
    namesColor: '#ffffff',
    messageColor: '#e2e8f0',
    qrDark: '#040817',
    qrLight: '#ffffff',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    fontTitleClass: "font-['Cinzel'] tracking-widest font-bold",
  },
];

export const FONT_OPTIONS = [
  { id: 'playfair', name: 'Playfair Display (Romántica)', class: "font-['Playfair_Display']" },
  { id: 'cinzel', name: 'Cinzel Royal (Imperial)', class: "font-['Cinzel'] tracking-wider" },
  { id: 'cormorant', name: 'Cormorant Garamond (Alta Costura)', class: "font-['Cormorant_Garamond']" },
  { id: 'great_vibes', name: 'Great Vibes (Manuscrita Cursiva)', class: "font-['Great_Vibes'] text-xl" },
  { id: 'clean', name: 'Inter Clean (Moderna & Minimalista)', class: 'font-sans font-semibold' },
];

export const QR_POSITIONS = [
  { id: 'bottom_right', name: 'Abajo Derecha', desc: 'Diseño clásico de regalo' },
  { id: 'center_large', name: 'Gigante Centro', desc: 'Minimalista enfoque en escáner' },
  { id: 'bottom_center', name: 'Abajo Centro', desc: 'Textos superiores centrados' },
  { id: 'top_right', name: 'Arriba Derecha', desc: 'Nombres a la izquierda' },
  { id: 'left_split', name: 'Columna Izquierda', desc: 'QR a la izq, texto a la der' },
];

export const BORDER_STYLES = [
  { id: 'double_gold', name: 'Marco Doble Dorado' },
  { id: 'ornate_filigree', name: 'Filigranas Barrocas' },
  { id: 'minimal_line', name: 'Línea Fina Minimalista' },
  { id: 'no_border', name: 'Sin Marco' },
];

export const QrAndCardModal: React.FC<QrAndCardModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'card' | 'qr'>('card');
  const [qrColor, setQrColor] = useState('#e83482');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [copied, setCopied] = useState(false);

  // Card customization states
  const sender = project.sender_name || project.person_one_name || 'Remitente';
  const recipient = project.recipient_name || project.person_two_name || 'Destinatario';
  const initialNames = `${sender} & ${recipient}`;

  const savedCardSettings = project.settings_json?.card_settings || {};
  const [cardStyleId, setCardStyleId] = useState<string>(savedCardSettings.styleId || 'midnight_velvet');
  const [cardKicker, setCardKicker] = useState<string>(savedCardSettings.kicker || 'HECHO ESPECIALMENTE PARA');
  const [cardMessage, setCardMessage] = useState<string>(
    savedCardSettings.message || 'Escanea este código con la cámara de tu teléfono y descubre un recuerdo preparado con mucho amor.'
  );
  const [cardNames, setCardNames] = useState<string>(savedCardSettings.names || initialNames);

  // Advanced Layout Studio states
  const [cardQrPosition, setCardQrPosition] = useState<string>(savedCardSettings.qrPosition || 'bottom_right');
  const [cardFontFamily, setCardFontFamily] = useState<string>(savedCardSettings.fontFamily || 'playfair');
  const [cardTitleSize, setCardTitleSize] = useState<string>(savedCardSettings.titleSize || 'medium');
  const [cardQrSize, setCardQrSize] = useState<string>(savedCardSettings.qrSize || 'medium');
  const [cardBorderStyle, setCardBorderStyle] = useState<string>(savedCardSettings.borderStyle || 'double_gold');

  const selectedTheme = CARD_STYLES.find((s) => s.id === cardStyleId) || CARD_STYLES[0];
  const selectedFont = FONT_OPTIONS.find((f) => f.id === cardFontFamily) || FONT_OPTIONS[0];

  const publicUrl = getPublicGiftUrl(project.slug);

  const pdfUrl = getPrintableCardUrl(project.id, project.slug, {
    styleId: cardStyleId,
    kicker: cardKicker,
    message: cardMessage,
    names: cardNames,
    qrPosition: cardQrPosition,
    fontFamily: cardFontFamily,
    titleSize: cardTitleSize,
    qrSize: cardQrSize,
    borderStyle: cardBorderStyle,
  });

  const pngQrUrl = getQrCodeUrl(project.id, 'png', selectedTheme.qrDark, selectedTheme.qrLight, project.slug);
  const svgQrUrl = getQrCodeUrl(project.id, 'svg', selectedTheme.qrDark, selectedTheme.qrLight, project.slug);

  const customPngQrUrl = getQrCodeUrl(project.id, 'png', qrColor, qrBgColor, project.slug);
  const customSvgQrUrl = getQrCodeUrl(project.id, 'svg', qrColor, qrBgColor, project.slug);

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

  // Dynamic Tailwind helper for Title Size
  let nameSizeClass = 'text-lg';
  if (cardTitleSize === 'small') nameSizeClass = 'text-sm';
  if (cardTitleSize === 'large') nameSizeClass = 'text-xl sm:text-2xl';

  // Dynamic Tailwind helper for QR Size
  let qrSizeClass = 'w-20 h-20';
  if (cardQrSize === 'small') qrSizeClass = 'w-16 h-16';
  if (cardQrSize === 'large') qrSizeClass = 'w-24 h-24 sm:w-28 sm:h-28';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/70 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Estudio de Tarjetas Físicas &amp; Código QR
              </h2>
              <p className="text-xs text-slate-400">
                {project.internal_name} ({cardNames})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition cursor-pointer ${
              activeTab === 'card'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Estudio de Maquetación de Tarjeta (9x9 cm)
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition cursor-pointer ${
              activeTab === 'qr'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Personalizar Código QR Digital
          </button>
        </div>

        {/* Main Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'card' && (
            <div className="space-y-6">
              {/* 1. Theme Preset Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-pink-400" />
                  1. Paleta &amp; Estilo de Tarjeta
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {CARD_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setCardStyleId(style.id)}
                      className={`p-3 rounded-2xl border text-left transition relative overflow-hidden flex flex-col justify-between h-24 cursor-pointer ${
                        cardStyleId === style.id
                          ? 'border-pink-500 ring-2 ring-pink-500/50 shadow-xl scale-[1.02]'
                          : 'border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                      }`}
                      style={{ background: style.bgStyle }}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${style.badgeBg}`}>
                          {style.tag}
                        </span>
                        {cardStyleId === style.id && (
                          <div className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="block text-xs font-bold truncate" style={{ color: style.namesColor }}>
                          {style.name}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: style.borderColor }} />
                          <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: style.kickerColor }} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Interactive Mockup + Advanced Layout Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                {/* Physical 9x9cm Card Dynamic Mockup */}
                <div className="md:col-span-6 flex flex-col items-center justify-center space-y-3">
                  <div
                    className="relative w-80 h-80 rounded-2xl p-5 shadow-2xl flex flex-col justify-between overflow-hidden border transition-all duration-500"
                    style={{
                      background: selectedTheme.bgStyle,
                      borderColor: cardBorderStyle === 'no_border' ? 'transparent' : selectedTheme.borderColor,
                      boxShadow: `0 25px 60px rgba(0,0,0,0.65), inset 0 0 0 1px ${selectedTheme.innerBorderColor}`,
                    }}
                  >
                    {/* Double Line Border Overlay */}
                    {cardBorderStyle !== 'no_border' && (
                      <div
                        className="absolute inset-2.5 pointer-events-none rounded-xl border"
                        style={{ borderColor: selectedTheme.innerBorderColor }}
                      />
                    )}

                    {/* Corner Ornaments */}
                    {cardBorderStyle !== 'no_border' && (
                      <>
                        <div className="absolute top-2 left-2 w-1.5 h-1.5 rotate-45" style={{ backgroundColor: selectedTheme.borderColor }} />
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rotate-45" style={{ backgroundColor: selectedTheme.borderColor }} />
                        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rotate-45" style={{ backgroundColor: selectedTheme.borderColor }} />
                        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rotate-45" style={{ backgroundColor: selectedTheme.borderColor }} />
                      </>
                    )}

                    {/* DYNAMIC LAYOUT RENDERING BASED ON qrPosition */}
                    {cardQrPosition === 'center_large' ? (
                      <div className="flex flex-col items-center justify-between h-full z-10 text-center">
                        <div className="space-y-1">
                          <span className="block uppercase text-[8.5px] tracking-widest font-bold" style={{ color: selectedTheme.kickerColor }}>
                            {cardKicker}
                          </span>
                          <h3 className={`font-bold leading-tight ${nameSizeClass} ${selectedFont.class}`} style={{ color: selectedTheme.namesColor }}>
                            {cardNames}
                          </h3>
                        </div>

                        <div className={`${qrSizeClass} bg-white p-1 rounded-xl shadow-inner flex items-center justify-center my-2 border`} style={{ borderColor: selectedTheme.borderColor }}>
                          <img src={pngQrUrl} alt="QR Tarjeta" className="w-full h-full object-contain" />
                        </div>

                        <p className="text-[10px] leading-snug font-serif italic max-w-[90%]" style={{ color: selectedTheme.messageColor }}>
                          {cardMessage}
                        </p>
                      </div>
                    ) : cardQrPosition === 'bottom_center' ? (
                      <div className="flex flex-col items-center justify-between h-full z-10 text-center">
                        <div className="space-y-1">
                          <span className="block uppercase text-[8.5px] tracking-widest font-bold" style={{ color: selectedTheme.kickerColor }}>
                            {cardKicker}
                          </span>
                          <h3 className={`font-bold leading-tight ${nameSizeClass} ${selectedFont.class}`} style={{ color: selectedTheme.namesColor }}>
                            {cardNames}
                          </h3>
                          <p className="text-[10px] leading-snug font-serif italic max-w-[90%] pt-1" style={{ color: selectedTheme.messageColor }}>
                            {cardMessage}
                          </p>
                        </div>

                        <div className={`${qrSizeClass} bg-white p-1 rounded-xl shadow-inner flex items-center justify-center border`} style={{ borderColor: selectedTheme.borderColor }}>
                          <img src={pngQrUrl} alt="QR Tarjeta" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    ) : cardQrPosition === 'top_right' ? (
                      <div className="flex flex-col justify-between h-full z-10">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <span className="block uppercase text-[8.5px] tracking-widest font-bold" style={{ color: selectedTheme.kickerColor }}>
                              {cardKicker}
                            </span>
                            <h3 className={`font-bold leading-tight ${nameSizeClass} ${selectedFont.class}`} style={{ color: selectedTheme.namesColor }}>
                              {cardNames}
                            </h3>
                          </div>
                          <div className={`${qrSizeClass} bg-white p-1 rounded-xl shadow-inner flex items-center justify-center flex-shrink-0 border`} style={{ borderColor: selectedTheme.borderColor }}>
                            <img src={pngQrUrl} alt="QR Tarjeta" className="w-full h-full object-contain" />
                          </div>
                        </div>

                        <p className="text-[10px] leading-snug font-serif italic pt-2" style={{ color: selectedTheme.messageColor }}>
                          {cardMessage}
                        </p>
                      </div>
                    ) : cardQrPosition === 'left_split' ? (
                      <div className="flex items-center gap-4 h-full z-10">
                        <div className={`${qrSizeClass} bg-white p-1 rounded-xl shadow-inner flex items-center justify-center flex-shrink-0 border`} style={{ borderColor: selectedTheme.borderColor }}>
                          <img src={pngQrUrl} alt="QR Tarjeta" className="w-full h-full object-contain" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <span className="block uppercase text-[8.5px] tracking-widest font-bold" style={{ color: selectedTheme.kickerColor }}>
                            {cardKicker}
                          </span>
                          <h3 className={`font-bold leading-tight ${nameSizeClass} ${selectedFont.class}`} style={{ color: selectedTheme.namesColor }}>
                            {cardNames}
                          </h3>
                          <p className="text-[10px] leading-snug font-serif italic" style={{ color: selectedTheme.messageColor }}>
                            {cardMessage}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Standard bottom_right */
                      <div className="flex flex-col justify-between h-full z-10">
                        <div className="space-y-1">
                          <span className="block uppercase text-[8.5px] tracking-widest font-bold" style={{ color: selectedTheme.kickerColor }}>
                            {cardKicker}
                          </span>
                          <h3 className={`font-bold leading-tight ${nameSizeClass} ${selectedFont.class}`} style={{ color: selectedTheme.namesColor }}>
                            {cardNames}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-[10px] leading-snug font-serif italic flex-1" style={{ color: selectedTheme.messageColor }}>
                            {cardMessage}
                          </p>
                          <div className={`${qrSizeClass} bg-white p-1 rounded-xl shadow-inner flex items-center justify-center flex-shrink-0 border`} style={{ borderColor: selectedTheme.borderColor }}>
                            <img src={pngQrUrl} alt="QR Tarjeta" className="w-full h-full object-contain" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">
                    Escala física real: 9 x 9 cm (300 DPI Vectorial PDF)
                  </span>
                </div>

                {/* Controls Column */}
                <div className="md:col-span-6 space-y-5">
                  {/* 1. QR Position Layout Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layout className="w-4 h-4 text-pink-400" />
                      Disposición &amp; Posición del QR
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {QR_POSITIONS.map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => setCardQrPosition(pos.id)}
                          className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                            cardQrPosition === pos.id
                              ? 'border-pink-500 bg-pink-500/10 text-white font-bold'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className="block text-xs">{pos.name}</span>
                          <span className="block text-[9px] text-slate-500 font-normal">{pos.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Typography Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Type className="w-4 h-4 text-pink-400" />
                      Fuente Tipográfica
                    </label>
                    <select
                      value={cardFontFamily}
                      onChange={(e) => setCardFontFamily(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Font & QR Size Controls */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5" /> Tamaño del Título
                      </label>
                      <div className="flex rounded-xl bg-slate-900 border border-slate-700 p-1 gap-1">
                        {['small', 'medium', 'large'].map((s) => (
                          <button
                            key={s}
                            onClick={() => setCardTitleSize(s)}
                            className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-lg transition cursor-pointer ${
                              cardTitleSize === s ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {s === 'small' ? 'Pequ' : s === 'medium' ? 'Med' : 'Gran'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5" /> Tamaño del QR
                      </label>
                      <div className="flex rounded-xl bg-slate-900 border border-slate-700 p-1 gap-1">
                        {['small', 'medium', 'large'].map((s) => (
                          <button
                            key={s}
                            onClick={() => setCardQrSize(s)}
                            className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-lg transition cursor-pointer ${
                              cardQrSize === s ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {s === 'small' ? '2.5cm' : s === 'medium' ? '3.2cm' : '4.0cm'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4. Text Contents Form */}
                  <div className="space-y-3 pt-1">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Edit3 className="w-4 h-4 text-pink-400" />
                      Contenidos de Texto
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Encabezado</label>
                        <input
                          type="text"
                          value={cardKicker}
                          onChange={(e) => setCardKicker(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Nombres</label>
                        <input
                          type="text"
                          value={cardNames}
                          onChange={(e) => setCardNames(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Mensaje Escáner</label>
                      <textarea
                        value={cardMessage}
                        onChange={(e) => setCardMessage(e.target.value)}
                        rows={2}
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-serif italic"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 font-bold text-white text-xs shadow-lg hover:brightness-110 active:scale-95 transition"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Tarjeta PDF (9x9 cm)
                    </a>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
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
                    <img src={customPngQrUrl} alt="QR Code Preview" className="w-48 h-48 object-contain" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono text-center truncate max-w-full px-2">
                    {publicUrl}
                  </span>
                </div>

                {/* Color Customization & Format Controls */}
                <div className="space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white">Personalizar Código QR Digital</h3>
                    
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
                              className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${
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
                              className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${
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
                        className="px-3 py-1.5 rounded-lg bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  {/* Downloads Footer Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleDownloadFile(customPngQrUrl, `qr_${project.slug}.png`)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-pink-600 text-white font-bold text-xs hover:bg-pink-500 shadow-md transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descargar PNG
                    </button>
                    <button
                      onClick={() => handleDownloadFile(customSvgQrUrl, `qr_${project.slug}.svg`)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition cursor-pointer"
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
        <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
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
            className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-semibold text-xs transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
