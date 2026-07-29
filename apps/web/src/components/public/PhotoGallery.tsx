import React from 'react';
import { MediaItem, ThemeConfig, PhotoFrameVariant } from '@recuerdos-qr/shared';
import { CinematicMemoryGallery } from './gallery/CinematicMemoryGallery';

interface PhotoGalleryProps {
  mediaItems: MediaItem[];
  heroCoverUrl?: string;
  title?: string;
  subtitle?: string;
  frameVariant?: PhotoFrameVariant;
  tiltEffect?: boolean;
  theme?: ThemeConfig;
  autoplayMode?: 'auto_and_manual' | 'manual_only';
  captureMode?: boolean;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  mediaItems,
  heroCoverUrl = '',
  title,
  subtitle,
  frameVariant,
  tiltEffect,
  theme,
  autoplayMode,
  captureMode = false,
}) => {
  // Only show images that are NOT the hero cover photo
  const photos = mediaItems.filter(
    (m) => m.media_type === 'image' && m.public_url !== heroCoverUrl
  );

  if (!photos.length) return null;

  return (
    <CinematicMemoryGallery
      photos={photos}
      title={title}
      subtitle={subtitle}
      frameVariant={frameVariant}
      tiltEffect={tiltEffect}
      theme={theme}
      autoplayMode={autoplayMode}
      captureMode={captureMode}
    />
  );
};
