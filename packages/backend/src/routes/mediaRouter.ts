import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db/db';

export const mediaRouter = Router();

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.bin';
    cb(null, `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for video files
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(jpg|jpeg|png|webp|heic|mp4|webm|mov)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de archivo no soportado. Usa JPG, PNG, WebP, MP4 o WebM.'));
    }
  },
});

/**
 * @openapi
 * /api/media/upload:
 *   post:
 *     summary: Subir imagen o video para un proyecto
 *     tags: [Archivos Multimedia]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [projectId, file]
 *             properties:
 *               projectId:
 *                 type: string
 *               caption:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Archivo subido y registrado exitosamente
 */
mediaRouter.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha adjuntado ningún archivo.' });
  }

  const { projectId, caption, mediaType } = req.body;
  if (!projectId) {
    return res.status(400).json({ error: 'Falta el ID del proyecto (projectId).' });
  }

  const isVideo = req.file.mimetype.startsWith('video/') || req.file.originalname.match(/\.(mp4|webm|mov)$/i);
  const mediaItem: any = {
    id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    project_id: projectId,
    media_type: isVideo ? 'video' : 'image',
    storage_path: req.file.filename,
    public_url: `/uploads/${req.file.filename}`,
    thumbnail_url: isVideo ? undefined : `/uploads/${req.file.filename}`,
    original_filename: req.file.originalname,
    mime_type: req.file.mimetype,
    size_bytes: req.file.size,
    position: db.getState.media.filter((m) => m.project_id === projectId).length + 1,
    caption: caption || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.getState.media.push(mediaItem);

  // If video section exists, update video section settings
  if (isVideo) {
    const videoSection = db.getState.sections.find((s) => s.project_id === projectId && s.section_type === 'video');
    if (videoSection) {
      videoSection.settings_json.videoUrl = `/uploads/${req.file.filename}`;
      videoSection.updated_at = new Date().toISOString();
    }
  }

  db.save();
  return res.status(201).json({ media: mediaItem });
});

/**
 * @openapi
 * /api/media/{id}:
 *   delete:
 *     summary: Eliminar un archivo multimedia
 *     tags: [Archivos Multimedia]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Archivo eliminado exitosamente
 */
mediaRouter.delete('/:id', (req, res) => {
  const index = db.getState.media.findIndex((m) => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Archivo multimedia no encontrado' });

  const item = db.getState.media[index];
  const filePath = path.join(uploadsDir, item.storage_path);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.warn('Could not remove physical file:', err);
    }
  }

  db.getState.media.splice(index, 1);
  db.save();

  return res.json({ message: 'Archivo multimedia eliminado exitosamente' });
});
