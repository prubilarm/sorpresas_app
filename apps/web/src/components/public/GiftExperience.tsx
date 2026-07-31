import React, { useState, useRef, useEffect } from 'react';
import {
  resolveGiftExperience,
  formatDateLabel,
  ThemeConfig,
  ResolvedExperience,
} from '@recuerdos-qr/shared';
import { StartScreen } from './StartScreen';
import { SongSection } from './SongSection';
import { HeroSection } from './HeroSection';
import { TimeCounter } from './TimeCounter';
import { LetterSection } from './LetterSection';
import { PhotoGallery } from './PhotoGallery';
import { ReasonsSection } from './ReasonsSection';
import { TimelineSection } from './TimelineSection';
import { PromiseSection } from './PromiseSection';
import { VideoSection } from './VideoSection';
import { FinalSection } from './FinalSection';
import { DynamicParticles } from './DynamicParticles';
import { Smartphone, Maximize2, Volume2, VolumeX } from 'lucide-react';

// Helper for progressive smooth audio volume fade transition
const fadeAudioVolume = (audio: HTMLAudioElement | null, targetVolume: number, durationMs = 1400) => {
  if (!audio) return;
  const startVolume = audio.volume;
  const delta = targetVolume - startVolume;
  if (Math.abs(delta) < 0.005) {
    audio.volume = targetVolume;
    return;
  }

  const startTime = performance.now();
  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    audio.volume = Math.max(0, Math.min(1, startVolume + delta * eased));

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      audio.volume = targetVolume;
    }
  };
  requestAnimationFrame(step);
};

interface GiftExperienceProps {
  project: any;
  sections?: any[];
  media?: any[];
  timeline?: any[];
  mode?: 'preview' | 'public';
  captureMode?: boolean;
  onVideoPlayStateChange?: (isPlayingVideo: boolean) => void;
}

export const GiftExperience: React.FC<GiftExperienceProps> = ({
  project,
  sections = [],
  media = [],
  timeline = [],
  mode = 'public',
  captureMode = false,
  onVideoPlayStateChange,
}) => {
  const [started, setStarted] = useState(false);
  const [phoneFrameMode, setPhoneFrameMode] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for background playback
  useEffect(() => {
    if (typeof window !== 'undefined' && mode === 'public') {
      const audioSource = project.settings_json?.music_url || '/until_found.mp3';
      const audio = new Audio(audioSource);
      audio.loop = true;
      audio.volume = captureMode ? 0 : 0.55; // silent in capture mode (Playwright can't record audio)
      bgAudioRef.current = audio;
    }
    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
    };
  }, [mode, captureMode, project.settings_json?.music_url]);

  // Auto-start in capture mode after 2.5s (StartScreen stays visible for that time)
  useEffect(() => {
    if (!captureMode || mode !== 'public') return;

    // Signal to Playwright that the page is fully rendered
    (window as any).__capturePhase = 'start-screen';
    (window as any).__captureStarted = false;

    const timer = setTimeout(() => {
      if (bgAudioRef.current) {
        bgAudioRef.current.play().catch(() => {});
      }
      setIsPlayingMusic(true);
      setStarted(true);
      (window as any).__capturePhase = 'transition';
      (window as any).__captureStarted = true;

      // After transition completes
      setTimeout(() => {
        (window as any).__capturePhase = 'content';
      }, 1200);
    }, 2500);

    return () => clearTimeout(timer);
  }, [captureMode, mode]);

  // Resolve central experience engine
  const resolved: ResolvedExperience = resolveGiftExperience({
    senderName: project.sender_name || project.person_one_name,
    recipientName: project.recipient_name || project.person_two_name,
    finalSignature: project.final_signature,
    relationshipType: project.relationship_type,
    customRelationship: project.custom_relationship,
    occasionType: project.occasion_type,
    customOccasion: project.custom_occasion,
    emotionalTone: project.emotional_tone,
    templateId: project.template_id,
  });

  const theme = resolved.theme;
  const sender = project.sender_name || project.person_one_name || 'Remitente';
  const recipient = project.recipient_name || project.person_two_name || 'Destinatario';
  const headerTitle = project.affectionate_name || `De ${sender} para ${recipient}`;

  const heroSec = sections.find((s) => s.section_type === 'hero');
  const counterSec = sections.find((s) => s.section_type === 'counter');
  const letterSec = sections.find((s) => s.section_type === 'letter');
  const videoSec = sections.find((s) => s.section_type === 'video');
  const finalSec = sections.find((s) => s.section_type === 'final_message');

  const startDateLabel = formatDateLabel(project.relationship_start_date || project.occasion_date);

  const toggleMusic = () => {
    if (!bgAudioRef.current) return;
    if (isPlayingMusic) {
      bgAudioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      bgAudioRef.current.play().catch(() => {});
      setIsPlayingMusic(true);
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Capture mode: inject global CSS to hide cursor and scrollbars
  useEffect(() => {
    if (!captureMode) return;
    const style = document.createElement('style');
    style.id = 'capture-mode-styles';
    style.textContent = `
      * { cursor: none !important; }
      ::-webkit-scrollbar { display: none !important; }
      body { overflow-y: scroll; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    document.documentElement.setAttribute('data-capture-mode', 'true');
    return () => {
      const el = document.getElementById('capture-mode-styles');
      if (el) el.remove();
      document.documentElement.removeAttribute('data-capture-mode');
    };
  }, [captureMode]);

  // Capture mode: expose photo count for Playwright
  const photosForCapture = media.filter((m: any) => m.media_type === 'image');
  useEffect(() => {
    if (!captureMode) return;
    (window as any).__capturePhotosTotal = photosForCapture.length;
    (window as any).__captureLetterWordCount = letterSec?.content
      ? JSON.stringify(letterSec.content).split(/\s+/).length
      : 100;
  }, [captureMode, photosForCapture.length, letterSec]);

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans select-none ${mode === 'preview' ? 'w-full' : ''}`}
      data-capture-root={captureMode ? 'true' : undefined}
    >
      {/* Background Gradient */}
      <div
        className="fixed inset-0 z-0 transition-all duration-700 pointer-events-none"
        style={{ background: theme.bgGradient }}
      />

      {/* Dynamic Background Particles */}
      <DynamicParticles type={resolved.particleType} speed={resolved.particleSpeed} color={theme.accentColor} />

      {/* Desktop Mode Toggle Controls — hidden in capture mode */}
      {mode === 'public' && !captureMode && (
        <div className="hidden lg:flex fixed top-4 right-4 z-50 items-center gap-2 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-2xl">
          <button
            onClick={() => setPhoneFrameMode(true)}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full transition ${
              phoneFrameMode ? 'bg-pink-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Modo Teléfono
          </button>
          <button
            onClick={() => setPhoneFrameMode(false)}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full transition ${
              !phoneFrameMode ? 'bg-pink-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Pantalla Completa
          </button>
        </div>
      )}

      {/* Floating Audio Control Button — hidden in capture mode */}
      {started && mode === 'public' && !captureMode && (
        <button
          type="button"
          onClick={toggleMusic}
          className="fixed bottom-4 left-4 z-50 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90 hover:scale-105 active:scale-95 transition shadow-2xl"
          title={isPlayingMusic ? 'Pausar música de fondo' : 'Reproducir música de fondo'}
        >
          {isPlayingMusic ? <Volume2 className="w-5 h-5 text-pink-400" /> : <VolumeX className="w-5 h-5 text-pink-400" />}
        </button>
      )}

      {/* Gift Experience Frame Container */}
      <div
        className={`relative z-10 w-full transition-all duration-500 ${
          mode === 'public' && phoneFrameMode && !captureMode
            ? 'max-w-[430px] my-0 lg:my-8 rounded-none lg:rounded-[42px] ring-0 lg:ring-8 lg:ring-slate-900 shadow-2xl overflow-hidden border-0 lg:border border-white/20'
            : 'max-w-4xl my-0 rounded-none overflow-hidden'
        }`}
        style={{
          background: theme.bgGradient,
          color: theme.textColor,
        }}
      >
        {/* Start Screen Overlay */}
        {!started && mode === 'public' && (
          <StartScreen
            kicker={resolved.startScreen.kicker}
            productTitle={heroSec?.title || resolved.startScreen.title}
            senderName={sender}
            recipientName={recipient}
            icon={resolved.startScreen.icon}
            buttonText={resolved.startScreen.buttonText}
            theme={theme}
            onStart={() => {
              window.scrollTo(0, 0);
              if (bgAudioRef.current) {
                bgAudioRef.current.play().then(() => {
                  setIsPlayingMusic(true);
                }).catch((err) => {
                  console.warn('Audio play failed initially, registering touch handler:', err);
                  const playOnInteraction = () => {
                    bgAudioRef.current?.play().then(() => setIsPlayingMusic(true)).catch(() => {});
                    window.removeEventListener('click', playOnInteraction);
                    window.removeEventListener('touchstart', playOnInteraction);
                  };
                  window.addEventListener('click', playOnInteraction);
                  window.addEventListener('touchstart', playOnInteraction);
                });
              }
              setStarted(true);
            }}
          />
        )}

        {/* Top Navbar — hidden in capture mode */}
        {!captureMode && (
          <header
            className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5 border-b backdrop-blur-xl transition-colors duration-500"
            style={{
              backgroundColor: theme.id === 'minimalist' ? 'rgba(255,255,255,0.92)' : 'rgba(15, 3, 10, 0.85)',
              borderColor: theme.cardBorder,
            }}
          >
            <button
              type="button"
              onClick={() => scrollToSection('inicio')}
              className="font-serif text-lg font-bold truncate tracking-wide text-left cursor-pointer"
              style={{ color: theme.titleColor, fontFamily: theme.fontTitle }}
            >
              {headerTitle}
            </button>
            <nav className="flex items-center gap-2 text-xs font-semibold opacity-90 flex-wrap justify-end">
              <button type="button" onClick={() => scrollToSection('cancion')} className="hover:opacity-100 transition cursor-pointer">♫</button>
              <button type="button" onClick={() => scrollToSection('inicio')} className="hover:opacity-100 transition cursor-pointer">Inicio</button>
              <button type="button" onClick={() => scrollToSection('carta')} className="hover:opacity-100 transition cursor-pointer">Carta</button>
              <button type="button" onClick={() => scrollToSection('razones')} className="hover:opacity-100 transition cursor-pointer">Razones</button>
              <button type="button" onClick={() => scrollToSection('fotos')} className="hover:opacity-100 transition cursor-pointer">Fotos</button>
              <button type="button" onClick={() => scrollToSection('video')} className="hover:opacity-100 transition cursor-pointer">Video</button>
            </nav>
          </header>
        )}

        {/* Main Content Sections */}
        <main className="space-y-6">

          {/* 1 — La canción que empezó todo */}
          <SongSection
            songName={project.settings_json?.song_name || 'Until Found'}
            artist={project.settings_json?.song_artist || 'Sam Smith'}
            audioRef={bgAudioRef}
            isPlaying={isPlayingMusic}
            onTogglePlay={() => {
              if (!bgAudioRef.current) return;
              if (isPlayingMusic) {
                bgAudioRef.current.pause();
                setIsPlayingMusic(false);
              } else {
                bgAudioRef.current.play().catch(() => {});
                setIsPlayingMusic(true);
              }
            }}
            coverImageUrl={project.settings_json?.song_cover_url}
            photoUrl={project.settings_json?.song_photo_url}
            photoCaption={project.settings_json?.song_photo_caption}
            theme={theme}
          />

          {/* 2 — Portada + Dedicatoria */}
          <div data-export-section="hero" data-section-type="hero">
            <HeroSection
              dateLabel={startDateLabel}
              kicker={resolved.hero.kicker}
              title={heroSec?.title || resolved.hero.title}
              subtitle={heroSec?.subtitle || resolved.hero.subtitle}
              coverUrl={heroSec?.settings_json?.cover}
              icon={resolved.primaryIcon}
              theme={theme}
            />
          </div>

          {/* 3 — Contador de tiempo */}
          <div data-export-section="counter" data-section-type="counter">
            <TimeCounter
              startDate={project.relationship_start_date || project.occasion_date}
              title={counterSec?.title || resolved.counter.title}
              footer={counterSec?.subtitle || counterSec?.settings_json?.footer || resolved.counter.footer}
              customYears={counterSec?.settings_json?.customYears}
              customMonths={counterSec?.settings_json?.customMonths}
              customDays={counterSec?.settings_json?.customDays}
              displayMode={project.counter_display_mode || counterSec?.settings_json?.display_mode || resolved.counter.displayMode}
              theme={theme}
            />
          </div>

          {/* 4 — Carta personalizada */}
          <div data-export-section="letter" data-section-type="letter">
            <LetterSection
              kicker={letterSec?.settings_json?.kicker}
              heading={letterSec?.title || resolved.letter.heading}
              title={letterSec?.subtitle || resolved.letter.title}
              contentRaw={letterSec?.content}
              defaultContent={resolved.letter.defaultContent}
              signature={letterSec?.settings_json?.signature || project.final_signature || resolved.letter.defaultSignature}
              theme={theme}
            />
          </div>

          {/* 5 — Galería de Fotos */}
          <div data-export-section="gallery" data-section-type="gallery">
            <PhotoGallery
              mediaItems={media}
              heroCoverUrl={heroSec?.settings_json?.cover || ''}
              title={resolved.photos.title}
              subtitle={resolved.photos.subtitle}
              frameVariant={resolved.photos.frameVariant}
              tiltEffect={resolved.photos.tiltEffect}
              theme={theme}
              autoplayMode={captureMode ? 'auto_and_manual' : 'manual_only'}
              captureMode={captureMode}
            />
          </div>

          {/* 6 — Lo que me gusta de ti */}
          <ReasonsSection
            reasons={project.settings_json?.reasons}
            theme={theme}
          />

          {/* 7 — Nuestra historia */}
          <TimelineSection events={timeline} theme={theme} />

          {/* 8 — Una promesa para ti */}
          <PromiseSection
            promise={project.settings_json?.promise}
            title={project.settings_json?.promise_title}
            theme={theme}
          />

          {/* 9 — Mensaje de cierre */}
          <div data-export-section="final" data-section-type="final">
            <FinalSection
              personOneName={sender}
              personTwoName={recipient}
              finalTitle={finalSec?.title || resolved.finalMessage.title}
              finalMessage={finalSec?.subtitle || resolved.finalMessage.message}
              signature={project.final_signature || resolved.finalMessage.signature}
              particleType={resolved.particleType}
              icon={resolved.primaryIcon}
              theme={theme}
              onRestart={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (bgAudioRef.current) {
                  bgAudioRef.current.pause();
                  bgAudioRef.current.currentTime = 0;
                }
                setIsPlayingMusic(false);
                setStarted(false);
              }}
            />
          </div>

          {/* 10 — Video especial (al final como remate emocional) */}
          <div data-export-section="video" data-section-type="video">
            <VideoSection
              projectId={project.id}
              title={videoSec?.title || resolved.video.title}
              intro={videoSec?.subtitle || resolved.video.intro}
              buttonText={videoSec?.settings_json?.buttonText || resolved.video.buttonText}
              warningText={videoSec?.settings_json?.warningText || resolved.video.warningText}
              videoUrl={videoSec?.settings_json?.videoUrl}
              posterUrl={videoSec?.settings_json?.poster}
              caption={videoSec?.content || resolved.video.caption}
              theme={theme}
              onVideoPlayStateChange={(isPlayingVideo) => {
                if (bgAudioRef.current) {
                  const targetVolume = isPlayingVideo ? 0.05 : 0.55;
                  fadeAudioVolume(bgAudioRef.current, targetVolume, 1400);
                }
                onVideoPlayStateChange?.(isPlayingVideo);
              }}
            />
          </div>

        </main>
      </div>
    </div>
  );
};
