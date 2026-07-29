import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  resolveGiftExperience,
  formatDateLabel,
  ThemeConfig,
  ResolvedExperience,
} from '@recuerdos-qr/shared';
import { StartScreen } from './StartScreen';
import { HeroSection } from './HeroSection';
import { TimeCounter } from './TimeCounter';
import { LetterSection } from './LetterSection';
import { PhotoGallery } from './PhotoGallery';
import { TimelineSection } from './TimelineSection';
import { VideoSection } from './VideoSection';
import { FinalSection } from './FinalSection';
import { DynamicParticles } from './DynamicParticles';
import { Smartphone, Maximize2, Volume2, VolumeX } from 'lucide-react';

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
      const audio = new Audio('/uploads/until_found.mp3');
      audio.loop = true;
      audio.volume = captureMode ? 0 : 0.55; // silent in capture mode (Playwright can't record audio)
      bgAudioRef.current = audio;
    }
    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
    };
  }, [mode, captureMode]);

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
                bgAudioRef.current.play().catch(() => {});
              }
              setIsPlayingMusic(true);
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
            <nav className="flex items-center gap-3 text-xs font-semibold opacity-90">
              <button type="button" onClick={() => scrollToSection('inicio')} className="hover:opacity-100 transition cursor-pointer">Inicio</button>
              <button type="button" onClick={() => scrollToSection('carta')} className="hover:opacity-100 transition cursor-pointer">Carta</button>
              <button type="button" onClick={() => scrollToSection('fotos')} className="hover:opacity-100 transition cursor-pointer">Fotos</button>
              <button type="button" onClick={() => scrollToSection('video')} className="hover:opacity-100 transition cursor-pointer">Video</button>
            </nav>
          </header>
        )}

        {/* Main Content Sections — each with data-export-section for Playwright */}
        <main className="space-y-6">
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

          <TimelineSection events={timeline} theme={theme} />

          {/* Video Section */}
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
                  bgAudioRef.current.volume = isPlayingVideo ? 0.08 : 0.55;
                }
                onVideoPlayStateChange?.(isPlayingVideo);
              }}
            />
          </div>

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
        </main>
      </div>
    </div>
  );
};
