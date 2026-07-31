import React from 'react';
import { MediaItem, ThemeConfig } from '@recuerdos-qr/shared';
import { MemoryDecorations } from './MemoryDecorations';
import { MemoryCaption } from './MemoryCaption';
import { resolveMediaUrl } from '../../../services/api';

interface MemorySlideProps {
  photo: MediaItem;
  index: number;
  total: number;
  captionVisible: boolean;
  theme?: ThemeConfig;
}

export const MemorySlide: React.FC<MemorySlideProps> = ({
  photo,
  index,
  total,
  captionVisible,
  theme,
}) => {
  const isPolaroidTheme = theme?.id === 'polaroid';
  const resolvedPhotoUrl = resolveMediaUrl(photo.public_url);

  // Determine composition type A, B, C, D, E
  const isLast = index === total - 1;
  const isLandscape = (photo.width && photo.height && photo.width > photo.height) || false;

  let sceneType: 'A' | 'B' | 'C' | 'D' | 'E' = 'A';
  if (isLast) {
    sceneType = 'E';
  } else if (isLandscape) {
    sceneType = 'C';
  } else {
    const mod = index % 3;
    if (mod === 1) sceneType = 'B';
    else if (mod === 2 && index % 5 === 0) sceneType = 'D';
    else sceneType = 'A';
  }

  // Pre-calculate slight rotation for Polaroid/Printed types (-1.2deg to +1.2deg)
  const rotationDegrees =
    sceneType === 'B' || isPolaroidTheme ? ((index % 3) - 1) * 1.2 : 0;

  const isVideo = photo.media_type === 'video' || /\.(mp4|webm|mov|m4v|ogv)$/i.test(resolvedPhotoUrl.split('?')[0]);

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center transition-all duration-700 ${
        sceneType === 'C' ? 'p-2 sm:p-4' : 'p-3 sm:p-6'
      }`}
    >
      {/* ─── SCENE TYPE C: Landscape Photo with Blurred Background ─── */}
      {sceneType === 'C' && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {isVideo ? (
            <video
              src={resolvedPhotoUrl}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover blur-2xl opacity-35 scale-125"
            />
          ) : (
            <img
              src={resolvedPhotoUrl}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover blur-2xl opacity-35 scale-125"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%)',
            }}
          />
        </div>
      )}

      {/* ─── Main Photo Card Frame ─── */}
      <div
        className={`relative flex flex-col w-full h-full p-3 sm:p-4 rounded-3xl transition-all duration-500 overflow-hidden ${
          sceneType === 'B' || isPolaroidTheme
            ? 'bg-white border-8 border-white shadow-2xl text-slate-900'
            : 'backdrop-blur-xl'
        }`}
        style={{
          transform: `rotate(${rotationDegrees}deg)`,
          background:
            sceneType === 'B' || isPolaroidTheme
              ? '#ffffff'
              : theme?.cardBg || 'rgba(18, 8, 22, 0.88)',
          borderColor:
            sceneType === 'B' || isPolaroidTheme
              ? '#ffffff'
              : theme?.cardBorder || 'rgba(255,131,182,0.22)',
          boxShadow:
            sceneType === 'B' || isPolaroidTheme
              ? '0 20px 50px rgba(0,0,0,0.35)'
              : theme?.cardShadow || '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Decorations */}
        <MemoryDecorations
          variant={
            sceneType === 'B' || isPolaroidTheme
              ? 'tape-top'
              : index % 2 === 0
              ? 'stars'
              : 'stamp'
          }
          accentColor={theme?.accentColor}
          isPolaroid={sceneType === 'B' || isPolaroidTheme}
        />

        {/* Photo Container */}
        <div className="relative flex-1 w-full rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center">
          {isVideo ? (
            <video
              src={resolvedPhotoUrl}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-contain transition-all duration-700 ${
                sceneType === 'D' ? 'filter grayscale contrast-105' : ''
              }`}
            />
          ) : (
            <img
              src={resolvedPhotoUrl}
              alt={photo.caption || `Fotografía ${index + 1}`}
              className={`w-full h-full object-contain transition-all duration-700 ${
                sceneType === 'D' ? 'filter grayscale contrast-105' : ''
              }`}
            />
          )}
        </div>

        {/* Caption */}
        <MemoryCaption
          caption={photo.caption}
          date={photo.event_date}
          visible={captionVisible}
          theme={theme}
          isPolaroid={sceneType === 'B' || isPolaroidTheme}
        />
      </div>

      {/* ─── SCENE TYPE E: Closing Cue to Continue Page Scroll ─── */}
      {sceneType === 'E' && (
        <div className="absolute bottom-16 z-20 text-center animate-bounce opacity-75 pointer-events-none">
          <span className="text-[10px] font-mono uppercase tracking-widest block text-white/80">
            Desliza para continuar la historia ↓
          </span>
        </div>
      )}
    </div>
  );
};
