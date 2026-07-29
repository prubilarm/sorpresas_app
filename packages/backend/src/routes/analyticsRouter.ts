import { Router } from 'express';
import { db } from '../db/db';

export const analyticsRouter = Router();

/**
 * @openapi
 * /api/analytics/track:
 *   post:
 *     summary: Registrar evento analítico (reproducción de video, clic en canción, etc.)
 *     tags: [Analíticas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectId, eventType]
 *             properties:
 *               projectId:
 *                 type: string
 *               eventType:
 *                 type: string
 *                 enum: [page_view, video_play, song_click, share_click]
 *     responses:
 *       200:
 *         description: Evento registrado exitosamente
 */
analyticsRouter.post('/track', (req, res) => {
  const { projectId, eventType } = req.body;
  if (!projectId || !eventType) {
    return res.status(400).json({ error: 'projectId y eventType son requeridos.' });
  }

  const record: any = {
    id: `ana_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    project_id: projectId,
    event_type: eventType,
    device_type: req.headers['user-agent']?.includes('Mobile') ? 'Mobile' : 'Desktop',
    browser: req.headers['user-agent'] || 'Unknown',
    created_at: new Date().toISOString(),
  };

  db.getState.analytics.push(record);
  db.save();

  return res.json({ success: true, record });
});
