import React from 'react';
import { MediaItem, ThemeConfig, PhotoFrameVariant } from '@recuerdos-qr/shared';
import { CinematicMemoryGallery } from './gallery/CinematicMemoryGallery';
import { resolveMediaUrl } from '../../services/api';

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
  const normalizePath = (url?: string) => {
    if (!url) return '';
    const resolved = resolveMediaUrl(url);
    try {
      return new URL(resolved).pathname;
    } catch (e) {
      return resolved;
    }
  };

  const heroPath = normalizePath(heroCoverUrl);
  const videoPath = normalizePath(videoUrl);

  // Show images and 2-sec mini-videos that are NOT the hero cover or main video
  const photos = mediaItems.filter((m) => {
    const path = normalizePath(m.public_url || (m as any).url || m.storage_path);
    if (!path) return false;
    if (heroPath && path === heroPath) return false;
    if (videoPath && path === videoPath) return false;
    return m.media_type === 'image' || m.media_type === 'video';
  });

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
