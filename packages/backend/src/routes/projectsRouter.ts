import path from 'path';
import fs from 'fs';
import { Router } from 'express';
import { db } from '../db/db';
import { CreateProjectSchema, UpdateProjectSchema, generateDefaultGiftPreset, VideoExportJob } from '@recuerdos-qr/shared';
import { optimizeUploadedVideo, processVideoExportJob } from '../services/videoExportService';

export const projectsRouter = Router();

/**
 * @openapi
 * /api/projects:
 *   get:
 *     summary: Obtener listado de proyectos con filtros
 *     tags: [Proyectos]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: occasion
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de regalos devuelta exitosamente
 */
projectsRouter.get('/', (req, res) => {
  const { search, status, occasion } = req.query;
  let list = [...db.getState.projects];

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (p) =>
        p.internal_name.toLowerCase().includes(q) ||
        (p.sender_name && p.sender_name.toLowerCase().includes(q)) ||
        (p.recipient_name && p.recipient_name.toLowerCase().includes(q)) ||
        (p.person_one_name && p.person_one_name.toLowerCase().includes(q)) ||
        (p.person_two_name && p.person_two_name.toLowerCase().includes(q))
    );
  }

  if (status) {
    list = list.filter((p) => p.status === status);
  }

  if (occasion) {
    list = list.filter((p) => p.occasion_type === occasion);
  }

  const projectsWithCounts = list.map((p) => {
    const photoCount = db.getState.media.filter((m) => m.project_id === p.id && m.media_type === 'image').length;
    const hasVideo = db.getState.media.some((m) => m.project_id === p.id && m.media_type === 'video');
    const viewCount = db.getState.analytics.filter((a) => a.project_id === p.id && a.event_type === 'page_view').length;

    return {
      ...p,
      photo_count: photoCount,
      has_video: hasVideo,
      view_count: viewCount,
    };
  });

  return res.json({ projects: projectsWithCounts });
});

/**
 * @openapi
 * /api/projects:
 *   post:
 *     summary: Crear un nuevo regalo personalizado para cualquier relación u ocasión
 *     tags: [Proyectos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [internal_name, sender_name, recipient_name, occasion_date, relationship_start_date]
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 */
projectsRouter.post('/', (req, res) => {
  const parseResult = CreateProjectSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Datos inválidos', details: parseResult.error.errors });
  }

  const data = parseResult.data as any;
  const id = `proj_${Date.now()}`;
  const sender = data.sender_name || data.person_one_name || 'Remitente';
  const recipient = data.recipient_name || data.person_two_name || 'Destinatario';

  const baseSlug = `${sender}-${recipient}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const uniqueSuffix = Math.random().toString(36).substring(2, 6);
  const slug = `${baseSlug || 'regalo'}-${uniqueSuffix}`;

  const preset = generateDefaultGiftPreset({
    senderName: sender,
    recipientName: recipient,
    finalSignature: data.final_signature,
    relationship: data.relationship_type || 'couple',
    occasion: data.occasion_type || 'anniversary',
    tone: data.emotional_tone || 'romantic',
  });

  const newProject: any = {
    id,
    owner_id: 'usr_admin_default',
    client_id: data.client_id || 'usr_admin_default',
    internal_name: data.internal_name,
    sender_name: sender,
    recipient_name: recipient,
    final_signature: data.final_signature || preset.signature,
    person_one_name: sender,
    person_two_name: recipient,
    affectionate_name: data.affectionate_name || `${sender} & ${recipient}`,
    relationship_type: data.relationship_type || 'couple',
    custom_relationship: data.custom_relationship,
    occasion_type: data.occasion_type || 'anniversary',
    custom_occasion: data.custom_occasion,
    emotional_tone: data.emotional_tone || 'romantic',
    occasion_date: data.occasion_date,
    relationship_start_date: data.relationship_start_date,
    counter_display_mode: data.counter_display_mode || preset.counterDisplayMode,
    slug,
    status: 'draft',
    template_id: data.template_id || preset.recommendedThemes[0] || 'romantic_elegant',
    language: data.language || 'es',
    share_enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.getState.projects.unshift(newProject);

  // Generate Default Sections based on Presets
  const defaultSections: any[] = [
    {
      id: `sec_hero_${id}`,
      project_id: id,
      section_type: 'hero',
      title: preset.heroTitle,
      subtitle: preset.heroSubtitle,
      settings_json: { cover: '/assets/fotos/portada.svg' },
      position: 1,
      is_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: `sec_counter_${id}`,
      project_id: id,
      section_type: 'counter',
      title: preset.counterTitle,
      subtitle: preset.counterFooter,
      settings_json: { display_mode: newProject.counter_display_mode },
      position: 2,
      is_enabled: newProject.counter_display_mode !== 'hidden',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: `sec_letter_${id}`,
      project_id: id,
      section_type: 'letter',
      title: preset.letterHeading,
      subtitle: preset.letterTitle,
      content: JSON.stringify(preset.letterParagraphs),
      settings_json: { signature: newProject.final_signature },
      position: 3,
      is_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: `sec_photos_${id}`,
      project_id: id,
      section_type: 'photos',
      title: 'Fotografías y Recuerdos',
      subtitle: 'Momentos especiales guardados para siempre',
      settings_json: { autoplay_mode: 'manual_only' },
      position: 4,
      is_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: `sec_video_${id}`,
      project_id: id,
      section_type: 'video',
      title: 'Un mensaje especial en video',
      subtitle: 'Haz clic abajo para descubrir la sorpresa que guardé en video para ti.',
      content: 'Un recuerdo en movimiento preparado especialmente para ti.',
      settings_json: { poster: '/assets/fotos/portada.svg' },
      position: 5,
      is_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: `sec_final_${id}`,
      project_id: id,
      section_type: 'final_message',
      title: preset.finalTitle,
      subtitle: preset.finalSubtitle,
      settings_json: { particlesEnabled: true },
      position: 6,
      is_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  db.getState.sections.push(...defaultSections);
  db.save();

  return res.status(201).json({ project: newProject });
});

/**
 * @openapi
 * /api/projects/{id}:
 *   get:
 *     summary: Obtener detalle completo de un regalo
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del proyecto
 *       404:
 *         description: Proyecto no encontrado
 */
projectsRouter.get('/:id', (req, res) => {
  const project = db.getState.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const sections = db.getState.sections
    .filter((s) => s.project_id === project.id)
    .sort((a, b) => a.position - b.position);

  const media = db.getState.media
    .filter((m) => m.project_id === project.id)
    .sort((a, b) => a.position - b.position);

  const timeline = db.getState.timeline
    .filter((t) => t.project_id === project.id)
    .sort((a, b) => a.position - b.position);

  const qrCode = db.getState.qrCodes.find((q) => q.project_id === project.id);
  const cardDesign = db.getState.cardDesigns.find((c) => c.project_id === project.id);

  return res.json({
    project,
    sections,
    media,
    timeline,
    qrCode,
    cardDesign,
  });
});

/**
 * @openapi
 * /api/projects/{id}:
 *   put:
 *     summary: Actualizar datos de un regalo
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 */
projectsRouter.put('/:id', (req, res) => {
  const index = db.getState.projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const { sections, ...projectData } = req.body;
  const current = db.getState.projects[index];

  const updatedProject = {
    ...current,
    ...projectData,
    updated_at: new Date().toISOString(),
  };

  db.getState.projects[index] = updatedProject;

  if (Array.isArray(sections)) {
    sections.forEach((secUpdate: any) => {
      const secIdx = db.getState.sections.findIndex(
        (s) => s.id === secUpdate.id || (s.section_type === secUpdate.section_type && s.project_id === current.id)
      );
      if (secIdx !== -1) {
        db.getState.sections[secIdx] = {
          ...db.getState.sections[secIdx],
          ...secUpdate,
          updated_at: new Date().toISOString(),
        };
      } else {
        db.getState.sections.push({
          ...secUpdate,
          project_id: current.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    });
  }

  db.save();
  return res.json({ project: updatedProject });
});

/**
 * @openapi
 * /api/projects/{id}/publish:
 *   post:
 *     summary: Publicar un regalo
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto publicado exitosamente
 */
projectsRouter.post('/:id/publish', (req, res) => {
  const project = db.getState.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  project.status = 'published';
  project.published_at = new Date().toISOString();
  project.updated_at = new Date().toISOString();
  db.save();

  return res.json({
    message: 'Regalo publicado exitosamente',
    public_url: `http://localhost:3000/r/${project.slug}`,
    project,
  });
});

/**
 * @openapi
 * /api/projects/{id}/unpublish:
 *   post:
 *     summary: Despublicar un regalo
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto despublicado
 */
projectsRouter.post('/:id/unpublish', (req, res) => {
  const project = db.getState.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  project.status = 'unpublished';
  project.updated_at = new Date().toISOString();
  db.save();

  return res.json({ message: 'Regalo despublicado', project });
});

/**
 * @openapi
 * /api/projects/{id}/duplicate:
 *   post:
 *     summary: Duplicar un proyecto existente
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Proyecto duplicado exitosamente
 */
projectsRouter.post('/:id/duplicate', (req, res) => {
  const source = db.getState.projects.find((p) => p.id === req.params.id);
  if (!source) return res.status(404).json({ error: 'Proyecto original no encontrado' });

  const newId = `proj_${Date.now()}`;
  const newSlug = `${source.slug}-copia-${Math.random().toString(36).substring(2, 5)}`;

  const duplicatedProject: any = {
    ...source,
    id: newId,
    internal_name: `${source.internal_name} (Copia)`,
    slug: newSlug,
    status: 'draft',
    published_at: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.getState.projects.unshift(duplicatedProject);

  const sourceSections = db.getState.sections.filter((s) => s.project_id === source.id);
  sourceSections.forEach((s) => {
    db.getState.sections.push({
      ...s,
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      project_id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  db.save();
  return res.status(201).json({ project: duplicatedProject });
});

/**
 * @openapi
 * /api/projects/{id}:
 *   delete:
 *     summary: Eliminar un regalo
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto eliminado exitosamente
 */
projectsRouter.delete('/:id', (req, res) => {
  const index = db.getState.projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Proyecto no encontrado' });

  db.getState.projects.splice(index, 1);
  db.save();

  return res.json({ message: 'Proyecto eliminado exitosamente' });
});

/**
 * @openapi
 * /api/projects/{id}/video/download:
 *   get:
 *     summary: Descargar el video subido del regalo (original u optimizado)
 *     tags: [Proyectos]
 */
projectsRouter.get('/:id/video/download', async (req, res) => {
  const project = db.getState.projects.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  // Find video section or video media item
  const videoSec = db.getState.sections.find((s) => s.project_id === project.id && s.section_type === 'video');
  const videoMedia = db.getState.media.find((m) => m.project_id === project.id && m.media_type === 'video');

  const videoUrl = videoSec?.settings_json?.videoUrl || videoMedia?.public_url;
  if (!videoUrl) return res.status(404).json({ error: 'No existe video cargado para este regalo' });

  const isPublic = req.query.isPublic === 'true';
  if (isPublic && project.allow_public_video_download === false) {
    return res.status(403).json({ error: 'La descarga pública de este video ha sido desactivada por el creador' });
  }

  const type = req.query.type === 'original' ? 'original' : 'optimized';
  const recipientName = project.recipient_name || project.person_two_name || 'destinatario';
  const safeFilename = `video-recuerdo-${recipientName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.mp4`;

  let localFilePath = path.join(__dirname, '../../', videoUrl.replace('/uploads/', 'uploads/'));
  if (!fs.existsSync(localFilePath)) {
    localFilePath = path.join(__dirname, '../../../web/public', videoUrl);
  }

  if (!fs.existsSync(localFilePath)) {
    return res.status(404).json({ error: 'Archivo de video no encontrado en el servidor' });
  }

  if (type === 'optimized') {
    try {
      const optFilename = `opt_${project.id}_${path.basename(localFilePath)}.mp4`;
      const optRelUrl = await optimizeUploadedVideo(localFilePath, optFilename);
      const optFullPath = path.join(__dirname, '../../', optRelUrl.replace('/uploads/', 'uploads/'));
      return res.download(optFullPath, safeFilename);
    } catch (err) {
      console.warn('Fallback to original file on optimization fail:', err);
    }
  }

  return res.download(localFilePath, safeFilename);
});

/**
 * @openapi
 * /api/projects/{id}/export:
 *   post:
 *     summary: Crear un nuevo trabajo de exportación de video completo (MP4)
 *     tags: [Proyectos]
 */
projectsRouter.post('/:id/export', async (req, res) => {
  const project = db.getState.projects.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const { format = '9:16', profile = 'full_experience', bg_music_url, bg_music_volume = 0.3, video_audio_volume = 1, auto_ducking = true, show_branding_closing = false } = req.body;

  const jobId = `export_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newJob: VideoExportJob = {
    id: jobId,
    project_id: project.id,
    format,
    profile,
    status: 'pending',
    progress_percent: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!db.getState.exports) db.getState.exports = [];
  db.getState.exports.unshift(newJob);
  db.save();

  // Launch background job processing
  processVideoExportJob(jobId, {
    format,
    profile,
    bg_music_url,
    bg_music_volume,
    video_audio_volume,
    auto_ducking,
    show_branding_closing,
  }).catch((err: any) => console.error('Export job background error:', err));

  return res.status(201).json({ job: newJob });
});

/**
 * @openapi
 * /api/projects/{id}/exports:
 *   get:
 *     summary: Obtener el historial de trabajos de exportación de video de un proyecto
 *     tags: [Proyectos]
 */
projectsRouter.get('/:id/exports', (req, res) => {
  const project = db.getState.projects.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const list = (db.getState.exports || []).filter((j) => j.project_id === project.id);
  return res.json({ exports: list });
});

/**
 * @openapi
 * /api/projects/{id}/exports/{exportId}/download:
 *   get:
 *     summary: Descargar un archivo MP4 generado de la experiencia completa
 *     tags: [Proyectos]
 */
projectsRouter.get('/:id/exports/:exportId/download', (req, res) => {
  const project = db.getState.projects.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const job = (db.getState.exports || []).find((j) => j.id === req.params.exportId && j.project_id === project.id);
  if (!job || !job.output_url) return res.status(404).json({ error: 'Archivo de exportación no encontrado o no finalizado' });

  const localFilePath = path.join(__dirname, '../../', job.output_url.replace('/uploads/', 'uploads/'));
  if (!fs.existsSync(localFilePath)) return res.status(404).json({ error: 'El archivo MP4 no existe en el servidor' });

  const recipientName = project.recipient_name || project.person_two_name || 'destinatario';
  const filename = `experiencia-completa-${recipientName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${job.format.replace(':', 'x')}.mp4`;

  return res.download(localFilePath, filename);
});

/**
 * @openapi
 * /api/projects/{id}/exports/{exportId}:
 *   delete:
 *     summary: Eliminar un trabajo de exportación del historial
 *     tags: [Proyectos]
 */
projectsRouter.delete('/:id/exports/:exportId', (req, res) => {
  const project = db.getState.projects.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const exportsList = db.getState.exports || [];
  const idx = exportsList.findIndex((j) => j.id === req.params.exportId && j.project_id === project.id);
  if (idx === -1) return res.status(404).json({ error: 'Exportación no encontrada' });

  exportsList.splice(idx, 1);
  db.save();

  return res.json({ message: 'Exportación eliminada exitosamente' });
});
