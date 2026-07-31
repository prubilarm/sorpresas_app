import React, { useState, useRef, useEffect } from 'react';
import { Move, ZoomIn, ZoomOut, RotateCcw, Type, QrCode, Sliders, Check } from 'lucide-react';
import { CardStylePreset } from './QrAndCardModal';

export interface CanvasElementPos {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  fontSize?: number; // pt size
  sizeCm?: number; // cm size for QR
  width?: number; // percentage width
}

export interface CustomCanvasConfig {
  enabled: boolean;
  qr: CanvasElementPos;
  kicker: CanvasElementPos;
  names: CanvasElementPos;
  message: CanvasElementPos;
}

export const DEFAULT_CANVAS_CONFIG: CustomCanvasConfig = {
  enabled: true,
  qr: { x: 62, y: 35, sizeCm: 3.2 },
  kicker: { x: 8, y: 10, fontSize: 7 },
  names: { x: 8, y: 16, fontSize: 16, width: 50 },
  message: { x: 8, y: 55, fontSize: 8, width: 50 },
};

interface CardCanvasEditorProps {
  selectedTheme: CardStylePreset;
  selectedFont: any;
  kickerText: string;
  namesText: string;
  messageText: string;
  pngQrUrl: string;
  config: CustomCanvasConfig;
  onChange: (newConfig: CustomCanvasConfig) => void;
}

export const CardCanvasEditor: React.FC<CardCanvasEditorProps> = ({
  selectedTheme,
  selectedFont,
  kickerText,
  namesText,
  messageText,
  pngQrUrl,
  config,
  onChange,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeElement, setActiveElement] = useState<'qr' | 'kicker' | 'names' | 'message'>('names');
  const [dragging, setDragging] = useState<'qr' | 'kicker' | 'names' | 'message' | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentConfig = config.enabled ? config : DEFAULT_CANVAS_CONFIG;

  const handlePointerDown = (elementKey: 'qr' | 'kicker' | 'names' | 'message', e: React.PointerEvent) => {
    e.stopPropagation();
    setActiveElement(elementKey);
    setDragging(elementKey);

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const elemPos = currentConfig[elementKey];

    const currentPxX = (elemPos.x / 100) * rect.width;
    const currentPxY = (elemPos.y / 100) * rect.height;

    const mousePxX = e.clientX - rect.left;
    const mousePxY = e.clientY - rect.top;

    setDragOffset({
      x: mousePxX - currentPxX,
      y: mousePxY - currentPxY,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    const mousePxX = e.clientX - rect.left - dragOffset.x;
    const mousePxY = e.clientY - rect.top - dragOffset.y;

    // Convert back to percentages (clamped 2% to 85%)
    let pctX = Math.max(2, Math.min(85, (mousePxX / rect.width) * 100));
    let pctY = Math.max(2, Math.min(85, (mousePxY / rect.height) * 100));

    const targetKey = dragging;
    const updated = {
      ...currentConfig,
      enabled: true,
      [targetKey]: {
        ...currentConfig[targetKey],
        x: Math.round(pctX * 10) / 10,
        y: Math.round(pctY * 10) / 10,
      },
    };

    onChange(updated);
  };

  const handlePointerUp = () => {
    setDragging(null);
  };

  const updateActiveSize = (newVal: number) => {
    const key = activeElement;
    const updated = {
      ...currentConfig,
      enabled: true,
      [key]: {
        ...currentConfig[key],
        ...(key === 'qr' ? { sizeCm: newVal } : { fontSize: newVal }),
      },
    };
    onChange(updated);
  };

  const updateActiveWidth = (newVal: number) => {
    if (activeElement === 'qr') return;
    const key = activeElement;
    const updated = {
      ...currentConfig,
      enabled: true,
      [key]: {
        ...currentConfig[key],
        width: newVal,
      },
    };
    onChange(updated);
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_CANVAS_CONFIG, enabled: true });
  };

  // Convert CM to PX relative to 320px canvas (9cm = 320px)
  const cmToPx = (cm: number) => (cm / 9.0) * 320;

  return (
    <div className="space-y-4">
      {/* Visual Canvas Instruction Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Move className="w-4 h-4 text-pink-400" />
          Lienzo de Edición Libre Drag &amp; Drop (9 x 9 cm)
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restaurar Posiciones
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Interactive 320x320 Drag Canvas */}
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          <div
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative w-80 h-80 rounded-2xl shadow-2xl overflow-hidden border transition-all duration-300 select-none touch-none cursor-crosshair"
            style={{
              background: selectedTheme.bgStyle,
              borderColor: selectedTheme.borderColor,
              boxShadow: `0 25px 60px rgba(0,0,0,0.65), inset 0 0 0 1px ${selectedTheme.innerBorderColor}`,
            }}
          >
            {/* Border Frames */}
            <div
              className="absolute inset-2.5 pointer-events-none rounded-xl border"
              style={{ borderColor: selectedTheme.innerBorderColor }}
            />

            {/* Corner Ornaments */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rotate-45" style={{ backgroundColor: selectedTheme.borderColor }} />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rotate-45" style={{ backgroundColor: selectedTheme.borderColor }} />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rotate-45" style={{ backgroundColor: selectedTheme.borderColor }} />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rotate-45" style={{ backgroundColor: selectedTheme.borderColor }} />

            {/* DRAGGABLE ELEMENT 1: KICKER */}
            <div
              onPointerDown={(e) => handlePointerDown('kicker', e)}
              className={`absolute cursor-move p-1 rounded transition-shadow ${
                activeElement === 'kicker' ? 'ring-2 ring-pink-500 bg-pink-500/10' : 'hover:ring-1 hover:ring-pink-400/50'
              }`}
              style={{
                left: `${currentConfig.kicker.x}%`,
                top: `${currentConfig.kicker.y}%`,
              }}
            >
              <span
                className="block uppercase tracking-widest font-bold pointer-events-none"
                style={{
                  color: selectedTheme.kickerColor,
                  fontSize: `${(currentConfig.kicker.fontSize || 7) * 1.3}px`,
                }}
              >
                {kickerText || 'HECHO ESPECIALMENTE PARA'}
              </span>
            </div>

            {/* DRAGGABLE ELEMENT 2: NAMES */}
            <div
              onPointerDown={(e) => handlePointerDown('names', e)}
              className={`absolute cursor-move p-1 rounded transition-shadow ${
                activeElement === 'names' ? 'ring-2 ring-pink-500 bg-pink-500/10' : 'hover:ring-1 hover:ring-pink-400/50'
              }`}
              style={{
                left: `${currentConfig.names.x}%`,
                top: `${currentConfig.names.y}%`,
                maxWidth: `${currentConfig.names.width || 60}%`,
              }}
            >
              <h4
                className={`font-bold leading-tight pointer-events-none break-words ${selectedFont.class}`}
                style={{
                  color: selectedTheme.namesColor,
                  fontSize: `${(currentConfig.names.fontSize || 16) * 1.3}px`,
                }}
              >
                {namesText || 'Camila & Diego'}
              </h4>
            </div>

            {/* DRAGGABLE ELEMENT 3: MESSAGE */}
            <div
              onPointerDown={(e) => handlePointerDown('message', e)}
              className={`absolute cursor-move p-1 rounded transition-shadow ${
                activeElement === 'message' ? 'ring-2 ring-pink-500 bg-pink-500/10' : 'hover:ring-1 hover:ring-pink-400/50'
              }`}
              style={{
                left: `${currentConfig.message.x}%`,
                top: `${currentConfig.message.y}%`,
                maxWidth: `${currentConfig.message.width || 50}%`,
              }}
            >
              <p
                className="leading-snug font-serif italic pointer-events-none break-words"
                style={{
                  color: selectedTheme.messageColor,
                  fontSize: `${(currentConfig.message.fontSize || 8) * 1.3}px`,
                }}
              >
                {messageText || 'Escanea este código...'}
              </p>
            </div>

            {/* DRAGGABLE ELEMENT 4: QR CODE */}
            <div
              onPointerDown={(e) => handlePointerDown('qr', e)}
              className={`absolute cursor-move p-1 rounded-xl bg-white shadow-inner flex items-center justify-center border transition-all ${
                activeElement === 'qr' ? 'ring-4 ring-pink-500 scale-105' : 'hover:ring-2 hover:ring-pink-400'
              }`}
              style={{
                left: `${currentConfig.qr.x}%`,
                top: `${currentConfig.qr.y}%`,
                width: `${cmToPx(currentConfig.qr.sizeCm || 3.2)}px`,
                height: `${cmToPx(currentConfig.qr.sizeCm || 3.2)}px`,
                borderColor: selectedTheme.borderColor,
              }}
            >
              <img src={pngQrUrl} alt="QR Code" className="w-full h-full object-contain pointer-events-none" />
            </div>
          </div>

          <span className="text-[11px] text-slate-500 mt-2 font-mono text-center">
            💡 Toca o haz clic y arrastra con el ratón cualquier elemento para colocarlo donde quieras.
          </span>
        </div>

        {/* Selected Element Fine-Tuning Controls */}
        <div className="md:col-span-6 space-y-5 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-pink-400" />
              Elemento Seleccionado
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold text-xs capitalize">
              {activeElement === 'qr'
                ? 'Código QR'
                : activeElement === 'names'
                ? 'Nombres Principales'
                : activeElement === 'kicker'
                ? 'Encabezado'
                : 'Mensaje Dedicatorio'}
            </span>
          </div>

          {/* Element Selection Tabs */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'names', label: 'Nombres', icon: Type },
              { id: 'qr', label: 'Código QR', icon: QrCode },
              { id: 'kicker', label: 'Encabezado', icon: Type },
              { id: 'message', label: 'Mensaje', icon: Type },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveElement(item.id as any)}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeElement === item.id
                    ? 'bg-pink-600 text-white shadow-lg font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Size Adjustment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">
                {activeElement === 'qr' ? 'Tamaño del Código QR (en cm)' : 'Tamaño de Fuente (pt)'}
              </label>
              <span className="font-mono text-pink-400 font-bold text-sm">
                {activeElement === 'qr'
                  ? `${currentConfig.qr.sizeCm || 3.2} cm`
                  : `${currentConfig[activeElement].fontSize || 12} pt`}
              </span>
            </div>

            <input
              type="range"
              min={activeElement === 'qr' ? 1.8 : 6}
              max={activeElement === 'qr' ? 5.2 : 36}
              step={activeElement === 'qr' ? 0.2 : 1}
              value={
                activeElement === 'qr'
                  ? currentConfig.qr.sizeCm || 3.2
                  : currentConfig[activeElement].fontSize || 12
              }
              onChange={(e) => updateActiveSize(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          {/* Width Adjustment Slider (For text boxes) */}
          {activeElement !== 'qr' && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300">Ancho Máximo del Texto (% del lienzo)</label>
                <span className="font-mono text-pink-400 font-bold text-sm">
                  {currentConfig[activeElement].width || 50}%
                </span>
              </div>

              <input
                type="range"
                min={20}
                max={90}
                step={5}
                value={currentConfig[activeElement].width || 50}
                onChange={(e) => updateActiveWidth(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>
          )}

          {/* Position Numeric Feedback */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
            <span>Coordenada X: {currentConfig[activeElement].x}%</span>
            <span>Coordenada Y: {currentConfig[activeElement].y}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
