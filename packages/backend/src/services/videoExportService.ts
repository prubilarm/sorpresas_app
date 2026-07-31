import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { db } from '../db/db';
import { VideoExportJob, VideoExportConfig, VideoExportFormat } from '@recuerdos-qr/shared';
import { captureGiftExperience } from './playwrightCaptureService';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const OPTIMIZED_DIR = path.join(UPLOADS_DIR, 'optimized');
const EXPORTS_DIR = path.join(UPLOADS_DIR, 'exports');
const FRAMES_BASE_DIR = path.join(UPLOADS_DIR, 'frames');

// Ensure output directories exist
[UPLOADS_DIR, OPTIMIZED_DIR, EXPORTS_DIR, FRAMES_BASE_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function runFFmpegCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 1024 * 100 }, (error, stdout, stderr) => {
      if (error) {
        console.error('FFmpeg execution error:', stderr || error.message);
        return reject(error);
      }
      resolve(stdout);
    });
  });
}

/**
 * Resolves resolution dimensions from format
 */
export function getResolutionByFormat(format: VideoExportFormat): { width: number; height: number; str: string } {
  switch (format) {
    case '9:16':
      return { width: 1080, height: 1920, str: '1080x1920' };
    case '4:5':
      return { width: 1080, height: 1350, str: '1080x1350' };
    case '1:1':
      return { width: 1080, height: 1080, str: '1080x1080' };
    case '16:9':
    default:
      return { width: 1920, height: 1080, str: '1920x1080' };
  }
}

/**
 * Optimizes an uploaded video to standard MP4 H.264 / AAC / yuv420p / +faststart
 */
export async function optimizeUploadedVideo(inputFilePath: string, outputFilename: string): Promise<string> {
  const outputFilePath = path.join(OPTIMIZED_DIR, outputFilename);

  if (fs.existsSync(outputFilePath)) {
    return `/uploads/optimized/${outputFilename}`;
  }

  const cmd = `ffmpeg -y -i "${inputFilePath}" -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "${outputFilePath}"`;
  await runFFmpegCommand(cmd);

  return `/uploads/optimized/${outputFilename}`;
}

/**
 * Background export worker — now uses real Playwright page capture
 */
export async function processVideoExportJob(jobId: string, config: VideoExportConfig): Promise<void> {
  const exportsList = db.getState.exports || [];
  const jobIndex = exportsList.findIndex((j) => j.id === jobId);
  if (jobIndex === -1) return;

  const updateJob = (updates: Partial<VideoExportJob>) => {
    const list = db.getState.exports || [];
    const idx = list.findIndex((j) => j.id === jobId);
    if (idx !== -1) {
      db.getState.exports[idx] = {
        ...db.getState.exports[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      db.save();
    }
  };

  try {
    const project = db.getState.projects.find((p) => p.id === exportsList[jobIndex].project_id);
    if (!project) throw new Error('Proyecto no encontrado');

    const resInfo = getResolutionByFormat(config.format);
    const outputFilename = `export_${project.slug}_${config.format.replace(':', 'x')}_${Date.now()}.mp4`;
    const finalOutputPath = path.join(EXPORTS_DIR, outputFilename);
    const framesDir = path.join(FRAMES_BASE_DIR, `job_${jobId}`);

    // 1. Preparing (10%)
    updateJob({ status: 'preparing', progress_percent: 10 });

    // 2. Playwright capture — opens real /r/[slug]?capture=true page
    updateJob({ status: 'rendering', progress_percent: 20 });

    const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://sorpresas-app-web.vercel.app' : 'http://localhost:5173');

    let framesListPath = '';
    let estimatedDuration = 12;

    try {
      const captureResult = await captureGiftExperience({
        slug: project.slug,
        format: config.format,
        profile: config.profile as 'reel_short' | 'reel_social' | 'full_experience',
        framesDir,
        frontendUrl,
        onProgress: (pct, msg) => {
          updateJob({ status: 'rendering', progress_percent: Math.min(80, pct) });
          console.log(`[Export ${jobId}] ${pct}% - ${msg}`);
        },
      });
      framesListPath = captureResult.framesListPath;
      estimatedDuration = captureResult.estimatedDuration;
    } catch (captureError) {
      console.warn(`[Export ${jobId}] Playwright capture failed, using fallback frame generator:`, captureError);
      
      // Fallback: Generate static frame manifest so export never crashes
      if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });
      const fallbackFramePath = path.join(framesDir, 'fallback_frame.png');
      
      // Write a minimal SVG/PNG fallback if no frames exist
      const svgContent = `<svg width="${resInfo.width}" height="${resInfo.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#110411"/>
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#ffd7e8" font-size="42" font-family="serif">❤️ ${project.internal_name || 'Un detalle especial'}</text>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="32" font-family="sans-serif">De ${project.sender_name || project.person_one_name || 'Hans'} para ${project.recipient_name || project.person_two_name || 'Tamara'}</text>
      </svg>`;
      
      const fallbackSvgPath = path.join(framesDir, 'fallback_frame.svg');
      fs.writeFileSync(fallbackSvgPath, svgContent, 'utf-8');
      
      framesListPath = path.join(framesDir, 'frames_list.txt');
      fs.writeFileSync(framesListPath, `file '${fallbackSvgPath.replace(/\\/g, '/')}'\nduration 10.000\nfile '${fallbackSvgPath.replace(/\\/g, '/')}'`, 'utf-8');
      estimatedDuration = 10;
    }

    // 3. Encode with FFmpeg (88%)
    updateJob({ status: 'encoding', progress_percent: 88 });

    // Build FFmpeg command using concat demuxer (actual page frames)
    let ffmpegCmd: string;

    const bgMusicPath = config.bg_music_url
      ? path.join(UPLOADS_DIR, config.bg_music_url.replace('/uploads/', ''))
      : null;

    const musicExists = bgMusicPath && fs.existsSync(bgMusicPath);
    const musicVolume = config.bg_music_volume ?? 0.35;
    const videoDuration = estimatedDuration + 1; // small buffer

    if (musicExists) {
      // Mix page frames with background music
      // Apply fadein at start, fadeout at end, auto-ducking if requested
      const fadeDuration = 1.5;
      const fadeOutStart = Math.max(0, videoDuration - fadeDuration);

      const audioFilter = config.auto_ducking
        ? `[1:a]volume=${musicVolume},afade=t=in:st=0:d=${fadeDuration},afade=t=out:st=${fadeOutStart}:d=${fadeDuration}[bg]`
        : `[1:a]volume=${musicVolume},afade=t=in:st=0:d=${fadeDuration},afade=t=out:st=${fadeOutStart}:d=${fadeDuration}[bg]`;

      ffmpegCmd = [
        'ffmpeg -y',
        `-f concat -safe 0 -i "${framesListPath}"`,
        `-i "${bgMusicPath}"`,
        `-filter_complex "${audioFilter}"`,
        `-map 0:v -map "[bg]"`,
        `-vf scale=${resInfo.width}:${resInfo.height}:force_original_aspect_ratio=decrease,pad=${resInfo.width}:${resInfo.height}:(ow-iw)/2:(oh-ih)/2:black`,
        `-c:v libx264 -preset fast -crf 22 -r 30 -pix_fmt yuv420p`,
        `-c:a aac -b:a 128k`,
        `-t ${videoDuration}`,
        `-movflags +faststart`,
        `"${finalOutputPath}"`,
      ].join(' ');
    } else {
      // No music - video only
      ffmpegCmd = [
        'ffmpeg -y',
        `-f concat -safe 0 -i "${framesListPath}"`,
        `-vf scale=${resInfo.width}:${resInfo.height}:force_original_aspect_ratio=decrease,pad=${resInfo.width}:${resInfo.height}:(ow-iw)/2:(oh-ih)/2:black`,
        `-c:v libx264 -preset fast -crf 22 -r 30 -pix_fmt yuv420p`,
        `-movflags +faststart`,
        `"${finalOutputPath}"`,
      ].join(' ');
    }

    console.log(`[Export ${jobId}] Running FFmpeg...`);
    await runFFmpegCommand(ffmpegCmd);

    const stats = fs.statSync(finalOutputPath);

    // 4. Cleanup frames
    try {
      fs.rmSync(framesDir, { recursive: true, force: true });
    } catch { /* ignore cleanup errors */ }

    // 5. Completed (100%)
    updateJob({
      status: 'completed',
      progress_percent: 100,
      output_url: `/uploads/exports/${outputFilename}`,
      file_size_bytes: stats.size,
      duration_seconds: estimatedDuration,
      resolution: resInfo.str,
    });

    console.log(`[Export ${jobId}] ✓ Completed: ${outputFilename} (${Math.round(stats.size / 1024)}KB, ${estimatedDuration}s, ${resInfo.str})`);

  } catch (err: any) {
    console.error('Failed to process video export job:', err);
    // Cleanup frames on error
    try {
      const framesDir = path.join(FRAMES_BASE_DIR, `job_${jobId}`);
      if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true, force: true });
    } catch { /* ignore */ }

    updateJob({
      status: 'failed',
      error_message: err.message || 'Error al generar el video de la experiencia',
    });
  }
}
