import { Router } from 'express';
import QRCode from 'qrcode';
import { db } from '../db/db';

export const qrRouter = Router();

/**
 * @openapi
 * /api/projects/{id}/qr:
 *   get:
 *     summary: Generar código QR (PNG o SVG) para un regalo
 *     tags: [Código QR]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [png, svg]
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *       - in: query
 *         name: bgColor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Código QR generado devuelto como imagen o SVG
 */
qrRouter.get('/:id/qr', async (req, res) => {
  const project = db.getState.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const format = (req.query.format as string) || 'png';
  const color = (req.query.color as string) || '#e83482';
  const bgColor = (req.query.bgColor as string) || '#ffffff';

  const host = req.get('host') || 'localhost:3000';
  const destinationUrl = `http://${host}/r/${project.slug}`;

  try {
    if (format === 'svg') {
      const svgString = await QRCode.toString(destinationUrl, {
        type: 'svg',
        color: { dark: color, light: bgColor },
        margin: 2,
        errorCorrectionLevel: 'M',
      });
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(svgString);
    } else {
      const pngBuffer = await QRCode.toBuffer(destinationUrl, {
        type: 'png',
        width: 600,
        color: { dark: color, light: bgColor },
        margin: 2,
        errorCorrectionLevel: 'M',
      });
      res.setHeader('Content-Type', 'image/png');
      return res.send(pngBuffer);
    }
  } catch (err: any) {
    console.error('Error generating QR code:', err);
    return res.status(500).json({ error: 'Error al generar el código QR: ' + err.message });
  }
});
