import React from 'react';
import { Play, Pause } from 'lucide-react';

import { ThemeConfig } from '@recuerdos-qr/shared';

interface MemoryProgressProps {
  currentIndex?: number;
  totalPhotos?: number;
  current?: number;
  total?: number;
  isPaused?: boolean;
  autoplayEnabled?: boolean;
  onTogglePause?: () => void;
  theme?: ThemeConfig;
}

export const MemoryProgress: React.FC<MemoryProgressProps> = ({
  currentIndex,
  totalPhotos,
  current,
  total,
  isPaused = false,
  autoplayEnabled = false,
  onTogglePause,
  theme,
}) => {
  const activeIdx = current !== undefined ? current - 1 : currentIndex || 0;
  const countTotal = total !== undefined ? total : totalPhotos || 1;
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between w-full max-w-[420px] px-6 select-none pointer-events-auto">
      {/* Discreet Counter Badge */}
      <div className="py-1 px-3.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-widest text-white/90 shadow-lg">
        {activeIdx + 1} / {countTotal}
      </div>

      {/* Autoplay Pause/Play button (secondary control) */}
      {autoplayEnabled && countTotal > 1 && (
        <button
          type="button"
          onClick={onTogglePause}
          className="flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white/80 hover:bg-white/15 transition shadow-lg"
        >
          {isPaused ? (
            <>
              <Play className="w-3 h-3 text-pink-400 fill-pink-400" />
              <span>Reanudar</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 text-pink-400" />
              <span>Pausar</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
