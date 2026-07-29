import React from 'react';
import { ThemeConfig } from '@recuerdos-qr/shared';

interface MemoryCaptionProps {
  caption?: string;
  date?: string;
  visible: boolean;
  theme?: ThemeConfig;
  isPolaroid?: boolean;
}

export const MemoryCaption: React.FC<MemoryCaptionProps> = ({
  caption,
  date,
  visible,
  theme,
  isPolaroid,
}) => {
  if (!caption && !date) return null;

  const titleFont = theme?.fontTitle || '"Playfair Display", Georgia, serif';
  const textColor = isPolaroid ? '#283618' : theme?.textColor || '#ffffff';

  return (
    <div
      className={`w-full mt-3 px-3 text-center transition-all duration-500 transform ease-out ${
        visible ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-3 blur-[3px]'
      }`}
    >
      {date && (
        <span
          className="block text-[10px] font-mono tracking-widest uppercase mb-1 opacity-70"
          style={{ color: isPolaroid ? '#606c38' : theme?.kickerColor || '#d8b4fe' }}
        >
          {date}
        </span>
      )}

      {caption && (
        <p
          className="font-serif italic text-base sm:text-lg leading-relaxed max-w-[90%] mx-auto"
          style={{
            color: textColor,
            fontFamily: isPolaroid ? '"Caveat", cursive' : titleFont,
          }}
        >
          “{caption}”
        </p>
      )}
    </div>
  );
};
