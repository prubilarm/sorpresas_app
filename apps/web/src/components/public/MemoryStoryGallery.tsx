import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MediaItem, ThemeConfig } from '@recuerdos-qr/shared';
import { ChevronUp, ChevronDown, Play, Pause } from 'lucide-react';

interface MemoryStoryGalleryProps {
  photos: MediaItem[];
  theme?: ThemeConfig;
  autoplayMode?: 'auto_and_manual' | 'manual_only';
}

export const MemoryStoryGallery: React.FC<MemoryStoryGalleryProps> = ({
  photos,
  theme,
  autoplayMode = 'auto_and_manual',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [captionVisible, setCaptionVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const touchStartY = useRef<number | null>(null);
  const wheelLockTimer = useRef<NodeJS.Timeout | null>(null);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const isVisibleInViewport = useRef<boolean>(true);

  const totalPhotos = photos.length;

  // Preload adjacent images
  useEffect(() => {
    if (!photos.length) return;
    const indicesToPreload = [currentIndex - 1, currentIndex, currentIndex + 1].filter(
      (idx) => idx >= 0 && idx < totalPhotos
    );
    indicesToPreload.forEach((idx) => {
      const img = new Image();
      img.src = photos[idx].public_url;
    });
  }, [currentIndex, photos, totalPhotos]);

  // Navigate to target slide safely
  const goToIndex = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= totalPhotos || isTransitioning) return;

      setIsTransitioning(true);
      setCaptionVisible(false);

      setCurrentIndex(targetIndex);

      setTimeout(() => {
        setIsTransitioning(false);
        setTimeout(() => setCaptionVisible(true), 250);
      }, 700);
    },
    [totalPhotos, isTransitioning]
  );

  const nextSlide = useCallback(() => {
    if (currentIndex < totalPhotos - 1) {
      goToIndex(currentIndex + 1);
    }
  }, [currentIndex, totalPhotos, goToIndex]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      goToIndex(currentIndex - 1);
    }
  }, [currentIndex, goToIndex]);

  // IntersectionObserver for pausing autoplay when offscreen
  useEffect(() => {
    if (!galleryRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleInViewport.current = entry.isIntersecting;
      },
      { threshold: 0.4 }
    );
    observer.observe(galleryRef.current);
    return () => observer.disconnect();
  }, []);

  // Autoplay Logic
  useEffect(() => {
    if (autoplayMode === 'manual_only' || isPaused || isUserInteracting || totalPhotos <= 1) {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      return;
    }

    autoplayTimer.current = setInterval(() => {
      if (!isVisibleInViewport.current || document.hidden) return;
      setCurrentIndex((prev) => {
        if (prev < totalPhotos - 1) {
          setCaptionVisible(false);
          setTimeout(() => setCaptionVisible(true), 350);
          return prev + 1;
        }
        return 0; // Loop back to start
      });
    }, 3600);

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [autoplayMode, isPaused, isUserInteracting, totalPhotos]);

  // Handle Touch Swipe Genuinely with Boundary Scroll Unblocking
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setIsUserInteracting(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    touchStartY.current = null;

    // Minimum swipe threshold
    if (Math.abs(deltaY) > 40) {
      if (deltaY > 0) {
        // Swipe Up -> Next Photo
        if (currentIndex < totalPhotos - 1) {
          nextSlide();
        }
      } else {
        // Swipe Down -> Previous Photo
        if (currentIndex > 0) {
          prevSlide();
        }
      }
    }

    // Resume user interaction state after delay
    setTimeout(() => setIsUserInteracting(false), 4000);
  };

  // Handle Mouse Wheel with Boundary Escape
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // If at start and scrolling up, allow page to scroll up natively
      if (currentIndex === 0 && e.deltaY < 0) return;
      // If at end and scrolling down, allow page to scroll down natively
      if (currentIndex === totalPhotos - 1 && e.deltaY > 0) return;

      if (wheelLockTimer.current) return;

      if (Math.abs(e.deltaY) > 25) {
        if (e.deltaY > 0 && currentIndex < totalPhotos - 1) {
          e.preventDefault();
          nextSlide();
        } else if (e.deltaY < 0 && currentIndex > 0) {
          e.preventDefault();
          prevSlide();
        }

        wheelLockTimer.current = setTimeout(() => {
          wheelLockTimer.current = null;
        }, 750);
      }
    },
    [currentIndex, totalPhotos, nextSlide, prevSlide]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisibleInViewport.current) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (currentIndex < totalPhotos - 1) {
          e.preventDefault();
          nextSlide();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          e.preventDefault();
          prevSlide();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalPhotos, nextSlide, prevSlide]);

  if (!photos || !photos.length) return null;

  const currentPhoto = photos[currentIndex];
  const isPolaroid = theme?.id === 'polaroid';
  const variantIndex = currentIndex % 4; // Select variant A, B, C, or D dynamically

  return (
    <section
      ref={galleryRef}
      id="fotos"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full max-w-[540px] mx-auto min-h-[85vh] flex flex-col justify-center items-center py-8 px-4 select-none"
    >
      {/* Section Header */}
      <div className="text-center mb-6 z-10">
        <span className="uppercase tracking-widest text-xs font-bold" style={{ color: theme?.kickerColor }}>
          Secuencia de recuerdos
        </span>
        <h2
          className="text-4xl sm:text-5xl font-serif mt-1 script-title"
          style={{ color: theme?.titleColor, fontFamily: theme?.fontTitle }}
        >
          Nuestra historia
        </h2>
      </div>

      {/* Main Vertical Story Stage Container */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] max-h-[640px] flex items-center justify-center">
        {/* Photo Card Frame */}
        <div
          className={`relative w-full h-full p-3 sm:p-4 transition-all duration-700 ease-out flex flex-col justify-between overflow-hidden shadow-2xl ${
            isPolaroid
              ? 'bg-white text-slate-800 rounded-none border-[10px] border-white rotate-[-1deg]'
              : 'rounded-3xl border backdrop-blur-xl'
          }`}
          style={
            !isPolaroid
              ? {
                  background: theme?.cardBg || 'rgba(15, 5, 12, 0.85)',
                  borderColor: theme?.cardBorder || 'rgba(255,131,182,0.25)',
                  transform:
                    variantIndex === 2
                      ? 'rotate(0.8deg)'
                      : variantIndex === 3
                      ? 'rotate(-0.8deg)'
                      : 'none',
                }
              : {}
          }
        >
          {/* Simulated Tape accent for Polaroid theme */}
          {isPolaroid && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-100/70 border border-amber-200/60 rotate-1 shadow-sm z-30 pointer-events-none" />
          )}

          {/* Photo Media Container with Landscape Blur Layer */}
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
            {/* Blurred Background Copy for Horizontal Photos */}
            <img
              src={currentPhoto.public_url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125"
            />

            {/* Foreground Main Photo */}
            <img
              key={currentPhoto.id}
              src={currentPhoto.public_url}
              alt={currentPhoto.caption || `Fotografía ${currentIndex + 1}`}
              className={`relative z-10 w-full h-full object-contain transition-all duration-700 ease-out ${
                variantIndex === 3 ? 'filter grayscale-0 transition-all duration-1000' : ''
              }`}
            />
          </div>

          {/* Caption Overlay */}
          {currentPhoto.caption && (
            <div
              className={`mt-3 px-2 text-center transition-all duration-500 transform ${
                captionVisible ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-3 blur-sm'
              }`}
            >
              <p
                className="font-serif italic text-base sm:text-lg leading-snug"
                style={{ color: isPolaroid ? '#283618' : theme?.textColor || '#ffffff' }}
              >
                “{currentPhoto.caption}”
              </p>
            </div>
          )}
        </div>

        {/* Up / Down Discreet Controls */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`p-2.5 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 transition ${
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-pink-600 hover:scale-110 active:scale-95'
            }`}
            title="Fotografía anterior"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex === totalPhotos - 1}
            className={`p-2.5 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 transition ${
              currentIndex === totalPhotos - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-pink-600 hover:scale-110 active:scale-95'
            }`}
            title="Fotografía siguiente"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress & Autoplay Toolbar */}
      <div className="mt-5 flex items-center justify-between w-full max-w-[540px] px-2 text-xs font-bold text-white/90">
        {/* Counter Badge */}
        <div className="py-1.5 px-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 font-mono tracking-widest">
          {currentIndex + 1} / {totalPhotos}
        </div>

        {/* Autoplay Pause/Play button */}
        {autoplayMode === 'auto_and_manual' && totalPhotos > 1 && (
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition"
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                <span>Reanudar</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-pink-400" />
                <span>Pausar</span>
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
};
