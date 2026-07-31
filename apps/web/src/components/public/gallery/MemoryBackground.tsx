import React from 'react';
import { MediaItem, ThemeConfig } from '@recuerdos-qr/shared';
import { resolveMediaUrl } from '../../../services/api';

interface MemoryBackgroundProps {
  currentPhoto: MediaItem | null;
  theme?: ThemeConfig;
}

export const MemoryBackground: React.FC<MemoryBackgroundProps> = ({ currentPhoto, theme }) => {
  if (!currentPhoto) return null;
  const url = resolveMediaUrl(currentPhoto.public_url);
  const isVideo = currentPhoto.media_type === 'video' || /\.(mp4|webm|mov|m4v|ogv)$/i.test(url.split('?')[0]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {isVideo ? (
        <video
          src={url}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover blur-3xl opacity-40 scale-125 transition-all duration-700"
        />
      ) : (
        <img
          src={url}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover blur-3xl opacity-40 scale-125 transition-all duration-700"
        />
      )}
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
