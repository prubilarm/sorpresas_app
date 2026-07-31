/**
 * playwrightCaptureService.ts
 *
 * Opens the real public gift page in a headless Chromium browser,
 * walks through every section (StartScreen → Hero → Counter → Letter →
 * Gallery photos → Video → Final), captures PNG screenshots for each
 * scene with appropriate dwell times, writes a FFmpeg concat-demuxer
 * manifest file, and returns its path so videoExportService.ts can
 * encode the final MP4.
 */

import fs from 'fs';
import path from 'path';
import { chromium, Browser, Page } from 'playwright';
import { VideoExportFormat } from '@recuerdos-qr/shared';

// ── Resolution map ──────────────────────────────────────────────────────────
const RESOLUTION: Record<VideoExportFormat, { w: number; h: number }> = {
  '9:16': { w: 1080, h: 1920 },
  '4:5': { w: 1080, h: 1350 },
  '1:1': { w: 1080, h: 1080 },
  '16:9': { w: 1920, h: 1080 },
};

// ── Progress reporter type ──────────────────────────────────────────────────
type OnProgress = (pct: number, msg: string) => void;

// ── Main export ─────────────────────────────────────────────────────────────
export interface CaptureResult {
  framesListPath: string;  // path to concat-demuxer manifest
  framesDir: string;       // temp directory with PNG files
  estimatedDuration: number; // total seconds
}

export async function captureGiftExperience(options: {
  slug: string;
  format: VideoExportFormat;
  profile: 'reel_short' | 'reel_social' | 'full_experience';
  framesDir: string;
  frontendUrl?: string;
  onProgress: OnProgress;
}): Promise<CaptureResult> {
  const {
    slug,
    format,
    profile,
    framesDir,
    frontendUrl = 'http://localhost:3000',
    onProgress,
  } = options;

  const res = RESOLUTION[format] || RESOLUTION['9:16'];

  // Ensure frames dir exists and is empty
  if (fs.existsSync(framesDir)) {
    fs.rmSync(framesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(framesDir, { recursive: true });

  onProgress(5, 'Iniciando navegador...');

  // ── Launch Playwright Chromium (with 4s max timeout) ──────────────────────
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined;

  const launchBrowser = async (): Promise<Browser> => {
    const launchPromise = chromium.launch({
      headless: true,
      executablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-web-security',
        '--allow-running-insecure-content',
        `--window-size=${res.w},${res.h}`,
      ],
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Chromium launch timeout (4s exceeded)')), 4000);
    });

    return Promise.race([launchPromise, timeoutPromise]);
  };

  const browser: Browser = await launchBrowser();

  const page: Page = await browser.newPage({
    viewport: { width: res.w, height: res.h },
    deviceScaleFactor: 1,
  });

  // Silence console noise from the page
  page.on('console', () => {});
  page.on('pageerror', () => {});

  const captureUrl = `${frontendUrl}/r/${slug}?capture=true&format=${encodeURIComponent(format)}`;

  onProgress(8, 'Cargando página del regalo...');

  try {
    await page.goto(captureUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
  } catch (err) {
    console.warn('[Capture] Warning loading page, continuing:', err);
    await page.waitForTimeout(1000);
  }

  // ── Wait for fonts and images to load ───────────────────────────────────
  onProgress(12, 'Cargando fuentes e imágenes...');
  await page.waitForTimeout(1500);

  // Pre-load all images so they appear in screenshots
  await page.evaluate(() => {
    return Promise.all(
      Array.from(document.images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        });
      })
    );
  });

  // ── Frame accumulator ────────────────────────────────────────────────────
  interface Frame { file: string; duration: number }
  const frames: Frame[] = [];
  let frameIndex = 0;

  const takeScreenshot = async (durationSeconds: number): Promise<string> => {
    frameIndex++;
    const framePath = path.join(framesDir, `frame_${String(frameIndex).padStart(5, '0')}.png`);
    await page.screenshot({ path: framePath, type: 'png', fullPage: false });
    frames.push({ file: framePath, duration: durationSeconds });
    return framePath;
  };

  // ── Take multiple screenshots over a given duration ──────────────────────
  const captureScene = async (
    durationSeconds: number,
    intervalMs: number = 500
  ): Promise<void> => {
    const steps = Math.max(1, Math.round((durationSeconds * 1000) / intervalMs));
    const perFrameDuration = durationSeconds / steps;
    for (let i = 0; i < steps; i++) {
      await takeScreenshot(perFrameDuration);
      if (i < steps - 1) await page.waitForTimeout(intervalMs);
    }
  };

  // ── Helper: Smooth scroll to element ────────────────────────────────────
  const scrollToElement = async (selector: string): Promise<void> => {
    try {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, selector);
      await page.waitForTimeout(800); // wait for smooth scroll
    } catch {
      // ignore if element not found
    }
  };

  // ── Helper: Smooth scroll to top ────────────────────────────────────────
  const scrollToTop = async (): Promise<void> => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(300);
  };

  // ── Helper: Animated scroll between positions ────────────────────────────
  const smoothScrollTo = async (targetY: number, durationMs: number = 1000): Promise<void> => {
    const startY: number = await page.evaluate(() => window.scrollY);
    const distance = targetY - startY;
    const steps = Math.max(1, Math.floor(durationMs / 50));
    for (let i = 1; i <= steps; i++) {
      const eased = 0.5 * (1 - Math.cos(Math.PI * (i / steps)));
      const newY = startY + distance * eased;
      await page.evaluate((y) => window.scrollTo({ top: y }), Math.round(newY));
      await page.waitForTimeout(50);
    }
  };

  // ── PHASE 1: StartScreen (2.5s) ─────────────────────────────────────────
  onProgress(15, 'Capturando pantalla de bienvenida...');
  await scrollToTop();

  // Capture start screen at multiple frames for smooth appearance
  await captureScene(2.5, 500);

  // ── Wait for React auto-start (set by GiftExperience after 2.5s) ─────────
  onProgress(20, 'Simulando apertura de la sorpresa...');
  await page.waitForFunction(
    () => (window as any).__captureStarted === true,
    { timeout: 8000 }
  ).catch(() => {
    // If not exposed, just wait
  });
  await page.waitForTimeout(1500); // transition animation

  // ── PHASE 2: Hero Section ────────────────────────────────────────────────
  onProgress(25, 'Capturando portada principal...');
  await scrollToTop();
  await page.waitForTimeout(600);

  const heroDuration = profile === 'reel_short' ? 2 : 3;
  await captureScene(heroDuration, 600);

  if (profile === 'reel_short') {
    // Reel short: only hero + 2 photos + final
    await captureGalleryShort(page, frames, framesDir, frameIndex, takeScreenshot, onProgress);
    await captureFinalSection(page, takeScreenshot, scrollToElement, captureScene, onProgress);
  } else {
    // Full or social reel: all sections
    await captureFullExperience(page, frames, framesDir, frameIndex, takeScreenshot, captureScene, scrollToElement, smoothScrollTo, onProgress, profile);
  }

  // ── Build FFmpeg concat demuxer manifest ─────────────────────────────────
  onProgress(88, 'Construyendo lista de frames...');
  const framesListPath = path.join(framesDir, 'frames_list.txt');
  const manifestLines = frames.flatMap((f) => [
    `file '${f.file.replace(/\\/g, '/')}'`,
    `duration ${f.duration.toFixed(3)}`,
  ]);
  // Repeat last frame (required by concat demuxer)
  if (frames.length > 0) {
    manifestLines.push(`file '${frames[frames.length - 1].file.replace(/\\/g, '/')}'`);
  }
  fs.writeFileSync(framesListPath, manifestLines.join('\n'), 'utf-8');

  const estimatedDuration = frames.reduce((sum, f) => sum + f.duration, 0);

  await browser.close();

  return { framesListPath, framesDir, estimatedDuration: Math.round(estimatedDuration) };
}

// ── Capture full experience (all sections) ──────────────────────────────────
async function captureFullExperience(
  page: Page,
  frames: any[],
  framesDir: string,
  startFrameIndex: number,
  takeScreenshot: (dur: number) => Promise<string>,
  captureScene: (dur: number, intervalMs?: number) => Promise<void>,
  scrollToElement: (sel: string) => Promise<void>,
  smoothScrollTo: (y: number, dur?: number) => Promise<void>,
  onProgress: OnProgress,
  profile: string
) {
  const isShortReel = profile === 'reel_social';

  // ── Counter Section ────────────────────────────────────────────────────
  onProgress(30, 'Capturando contador de tiempo...');
  await scrollToElement('[data-export-section="counter"]');
  await page.waitForTimeout(600);
  await captureScene(isShortReel ? 2.5 : 3, 600);

  // ── Letter Section ─────────────────────────────────────────────────────
  onProgress(38, 'Capturando carta personalizada...');
  await scrollToElement('[data-export-section="letter"]');
  await page.waitForTimeout(800);

  // Calculate reading time from word count
  const wordCount: number = await page.evaluate(() => {
    return (window as any).__captureLetterWordCount || 80;
  });
  const letterDuration = Math.max(4, Math.min(isShortReel ? 6 : 10, Math.round(wordCount / 25)));
  await captureScene(letterDuration, 700);

  // ── Gallery Section ────────────────────────────────────────────────────
  onProgress(50, 'Capturando galería de fotografías...');
  await scrollToElement('[data-export-section="gallery"]');
  await page.waitForTimeout(1000);

  const totalPhotos: number = await page.evaluate(() => {
    return (window as any).__galleryTotalPhotos || 0;
  });

  const photosToShow = isShortReel ? Math.min(3, totalPhotos) : totalPhotos;
  const photoDuration = isShortReel ? 2.5 : 3.5;

  for (let i = 0; i < photosToShow; i++) {
    const progressVal = 50 + Math.round((i / Math.max(1, photosToShow)) * 20);
    onProgress(progressVal, `Capturando foto ${i + 1} de ${photosToShow}...`);

    // Capture current photo for its dwell time
    await captureScene(photoDuration, 700);

    // Advance to next photo (if not last)
    if (i < photosToShow - 1) {
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('captureGalleryNext'));
      });
      await page.waitForTimeout(900); // wait for slide animation
      await captureScene(0.5, 500); // capture transition
    }
  }

  // ── Video Section ──────────────────────────────────────────────────────
  onProgress(72, 'Capturando sección de video...');
  await scrollToElement('[data-export-section="video"]');
  await page.waitForTimeout(800);
  await captureScene(isShortReel ? 3 : 5, 700);

  // ── Final Message ──────────────────────────────────────────────────────
  onProgress(82, 'Capturando mensaje final...');
  await captureFinalSection(page, takeScreenshot, scrollToElement, captureScene, onProgress);
}

// ── Capture reel short (just hero + 2 photos + final) ──────────────────────
async function captureGalleryShort(
  page: Page,
  frames: any[],
  framesDir: string,
  startFrameIndex: number,
  takeScreenshot: (dur: number) => Promise<string>,
  onProgress: OnProgress
) {
  onProgress(45, 'Capturando fotos destacadas...');
  try {
    await page.evaluate(() => {
      const el = document.querySelector('[data-export-section="gallery"]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    await page.waitForTimeout(1000);

    const totalPhotos: number = await page.evaluate(() => (window as any).__galleryTotalPhotos || 0);
    const photosToShow = Math.min(2, totalPhotos);

    for (let i = 0; i < photosToShow; i++) {
      await page.screenshot({
        path: path.join(framesDir, `frame_${String(frames.length + 1).padStart(5, '0')}.png`),
        type: 'png',
        fullPage: false,
      });
      frames.push({ file: path.join(framesDir, `frame_${String(frames.length).padStart(5, '0')}.png`), duration: 2.5 });

      if (i < photosToShow - 1) {
        await page.evaluate(() => window.dispatchEvent(new CustomEvent('captureGalleryNext')));
        await page.waitForTimeout(900);
      }
    }
  } catch { /* ignore */ }
}

// ── Capture final message section ───────────────────────────────────────────
async function captureFinalSection(
  page: Page,
  takeScreenshot: (dur: number) => Promise<string>,
  scrollToElement: (sel: string) => Promise<void>,
  captureScene: (dur: number, intervalMs?: number) => Promise<void>,
  onProgress: OnProgress
) {
  onProgress(85, 'Capturando mensaje final...');
  await scrollToElement('[data-export-section="final"]');
  await page.waitForTimeout(1000);
  await captureScene(5, 1000);
}
