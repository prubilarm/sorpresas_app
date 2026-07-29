import { Router } from 'express';
import { db } from '../db/db';

export const publicRouter = Router();

/**
 * @openapi
 * /api/public/r/{slug}:
 *   get:
 *     summary: Obtener la experiencia pública de un regalo por su slug
 *     tags: [Experiencia Pública]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Regalo público devuelto con secciones y multimedia
 *       404:
 *         description: Regalo no encontrado o no publicado
 */
publicRouter.get('/r/:slug', (req, res) => {
  const { slug } = req.params;
  const isPreview = req.query.preview === 'true';
  const project = db.getState.projects.find((p) => p.slug === slug);

  if (!project) {
    return res.status(404).json({ error: 'Regalo no encontrado', isFound: false });
  }

  if (project.status !== 'published' && !isPreview) {
    return res.status(403).json({
      error: 'Este regalo aún no ha sido publicado por su creador.',
      isPublished: false,
      internal_name: project.internal_name,
    });
  }

  // Register page view analytics
  db.getState.analytics.push({
    id: `ana_${Date.now()}`,
    project_id: project.id,
    event_type: 'page_view',
    device_type: req.headers['user-agent']?.includes('Mobile') ? 'Mobile' : 'Desktop',
    browser: req.headers['user-agent'] || 'Unknown',
    created_at: new Date().toISOString(),
  });
  db.save();

  const sections = db.getState.sections
    .filter((s) => s.project_id === project.id && s.is_enabled)
    .sort((a, b) => a.position - b.position);

  const media = db.getState.media
    .filter((m) => m.project_id === project.id)
    .sort((a, b) => a.position - b.position);

  const timeline = db.getState.timeline
    .filter((t) => t.project_id === project.id && t.is_enabled)
    .sort((a, b) => a.position - b.position);

  return res.json({
    project: {
      ...project,
      sender_name: project.sender_name || project.person_one_name,
      recipient_name: project.recipient_name || project.person_two_name,
    },
    sections,
    media,
    timeline,
  });
});
