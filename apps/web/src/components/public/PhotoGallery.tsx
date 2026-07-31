import React from 'react';
import { MediaItem, ThemeConfig, PhotoFrameVariant } from '@recuerdos-qr/shared';
import { CinematicMemoryGallery } from './gallery/CinematicMemoryGallery';

interface PhotoGalleryProps {
  mediaItems: MediaItem[];
  heroCoverUrl?: string;
  videoUrl?: string;
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
  videoUrl = '',
  title,
  subtitle,
  frameVariant,
  tiltEffect,
  theme,
  autoplayMode,
  captureMode = false,
}) => {
  // Show images and 2-sec mini-videos that are NOT the hero cover or main video
  const photos = mediaItems.filter(
    (m) =>
      (m.media_type === 'image' || m.media_type === 'video') &&
      m.public_url !== heroCoverUrl &&
      m.public_url !== videoUrl
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
