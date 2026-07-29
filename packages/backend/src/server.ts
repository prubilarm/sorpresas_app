import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { setupSwagger } from './swagger';
import { authRouter } from './routes/authRouter';
import { projectsRouter } from './routes/projectsRouter';
import { mediaRouter } from './routes/mediaRouter';
import { qrRouter } from './routes/qrRouter';
import { cardRouter } from './routes/cardRouter';
import { publicRouter } from './routes/publicRouter';
import { analyticsRouter } from './routes/analyticsRouter';
import { db } from './db/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static asset folders
const uploadsPath = path.join(__dirname, '../uploads');
const assetsPath = path.join(__dirname, '../../../regalo_qr_producto_v2/assets');

app.use('/uploads', express.static(uploadsPath));
app.use('/assets', express.static(assetsPath));

// Root welcome page / Swagger redirect
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Setup Swagger UI Documentation
setupSwagger(app);

// Mount API Routers
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/projects', qrRouter);
app.use('/api/projects', cardRouter);
app.use('/api/public', publicRouter);
app.use('/api/analytics', analyticsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Recuerdos QR Backend API',
    environment: process.env.NODE_ENV || 'development',
    supabase: !!(process.env.SUPABASE_URL),
    timestamp: new Date().toISOString(),
  });
});

// Generic Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Ocurrió un error en el servidor. Inténtalo nuevamente más tarde.',
    message: err.message,
  });
});

// ── Startup ──────────────────────────────────────────────────────────────────
if (require.main === module) {
  const listenPort = Number(PORT) || 4000;
  db.initialize().then(() => {
    app.listen(listenPort, '0.0.0.0', () => {
      console.log(`📖 Documentación Swagger UI disponible en http://0.0.0.0:${listenPort}/api-docs`);
      console.log(`🚀 Backend Server ejecutándose en http://0.0.0.0:${listenPort}`);
    });
  }).catch((err) => {
    console.error('Failed to initialize DB, starting anyway:', err);
    app.listen(listenPort, '0.0.0.0', () => {
      console.log(`🚀 Backend Server ejecutándose en http://0.0.0.0:${listenPort}`);
    });
  });
}

export default app;
