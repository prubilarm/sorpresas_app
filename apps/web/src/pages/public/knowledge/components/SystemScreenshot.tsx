import React from 'react';

interface SystemScreenshotProps {
  src: string;
  alt: string;
  caption?: string;
  isMobile?: boolean;
}

export const SystemScreenshot: React.FC<SystemScreenshotProps> = ({ src, alt, caption, isMobile }) => {
  return (
    <figure className="my-8">
      <div className={`mx-auto overflow-hidden bg-slate-900 shadow-2xl border border-slate-200/50 ${isMobile ? 'rounded-[2rem] max-w-sm aspect-[9/19.5] border-8 border-slate-900' : 'rounded-xl max-w-4xl'}`}>
        {/* Fake window header for desktop */}
        {!isMobile && (
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="mx-auto bg-white border border-slate-200 text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded shadow-sm w-48 text-center truncate">
              {alt}
            </div>
          </div>
        )}
        
        {/* The actual image */}
        <div className="relative w-full h-full bg-slate-50 flex items-center justify-center min-h-[200px]">
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              // Placeholder si la imagen no existe aún
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('bg-slate-100');
              const span = document.createElement('span');
              span.className = 'text-slate-400 text-sm font-mono text-center px-4';
              span.innerHTML = `[Screenshot Placeholder]<br/>Guardar captura en:<br/>${src}`;
              e.currentTarget.parentElement?.appendChild(span);
            }}
          />
        </div>
      </div>
      
      {caption && (
        <figcaption className="text-center text-sm text-slate-500 mt-3 font-medium">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
