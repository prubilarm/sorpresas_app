import React from 'react';

interface MemoryDecorationsProps {
  variant: 'tape-top' | 'tape-bottom' | 'stars' | 'stamp' | 'clean';
  accentColor?: string;
  isPolaroid?: boolean;
}

export const MemoryDecorations: React.FC<MemoryDecorationsProps> = ({
  variant,
  accentColor = '#df2878',
  isPolaroid = false,
}) => {
  if (variant === 'tape-top' || isPolaroid) {
    return (
      <>
        {/* Subtle decorative tape */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-100/60 border border-amber-200/50 rotate-[-1deg] shadow-sm z-30 pointer-events-none rounded-sm backdrop-blur-[1px]"
          style={{ opacity: 0.85 }}
        />
        {/* Delicate star accent */}
        <div className="absolute top-3 right-4 z-30 pointer-events-none text-amber-300/80 text-xs font-mono">
          ✦
        </div>
      </>
    );
  }

  if (variant === 'tape-bottom') {
    return (
      <>
        <div
          className="absolute -bottom-2 right-6 w-24 h-5 bg-amber-100/50 border border-amber-200/40 rotate-[2deg] shadow-sm z-30 pointer-events-none rounded-sm"
          style={{ opacity: 0.8 }}
        />
        <div className="absolute bottom-4 left-4 z-30 pointer-events-none text-amber-300/70 text-xs font-mono">
          ✧
        </div>
      </>
    );
  }

  if (variant === 'stars') {
    return (
      <div className="absolute top-4 left-5 z-30 pointer-events-none flex gap-1.5 text-amber-300/70 text-xs">
        <span>✦</span>
        <span className="text-[9px] opacity-60">✧</span>
      </div>
    );
  }

  if (variant === 'stamp') {
    return (
      <div
        className="absolute top-4 right-5 z-30 pointer-events-none border border-current rounded-full px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest opacity-40 rotate-[6deg]"
        style={{ color: accentColor }}
      >
        ♥ recuerdo
      </div>
    );
  }

  return null;
};
