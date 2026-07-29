import React from 'react';
import { MediaItem, ThemeConfig } from '@recuerdos-qr/shared';

interface MemoryBackgroundProps {
  currentPhoto: MediaItem | null;
  theme?: ThemeConfig;
}

export const MemoryBackground: React.FC<MemoryBackgroundProps> = ({ currentPhoto, theme }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Blurred Ambient Image Background */}
      {currentPhoto && (
        <div
          key={currentPhoto.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-40 scale-125 filter blur-3xl saturate-150"
        >
          <img
            src={currentPhoto.public_url}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Overlay Vignette Gradient */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background:
            theme?.id === 'minimalist'
              ? 'radial-gradient(ellipse at 50% 50%, rgba(248,246,244,0.7) 0%, rgba(232,228,222,0.92) 100%)'
              : 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.78) 100%)',
        }}
      />
    </div>
  );
};
