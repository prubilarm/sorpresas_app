import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recuerdos QR API',
      version: '1.0.0',
      description: 'API REST backend para administración de regalos personalizados con QR y vista pública',
      contact: {
        name: 'Soporte Técnico Recuerdos QR',
        email: 'soporte@recuerdosqr.cl',
      },
    },
    servers: [
      {
        url: process.env.PUBLIC_DOMAIN || 'http://localhost:4000',
        description: 'Servidor API Backend',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    path.join(__dirname, './routes/*.ts'),
    path.join(__dirname, './routes/*.js'),
    path.join(__dirname, './server.ts'),
    path.join(__dirname, './server.js'),
  ],
};

let swaggerSpec: any;
try {
  swaggerSpec = swaggerJsdoc(options);
} catch (err) {
  console.warn('[Swagger] Warning: could not parse JSDoc schemas:', err);
  swaggerSpec = { openapi: '3.0.0', info: { title: 'Recuerdos QR API', version: '1.0.0' }, paths: {} };
}

export function setupSwagger(app: Express) {
  try {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
    console.log('📖 Documentación Swagger UI disponible en /api-docs');
  } catch (err) {
    console.error('[Swagger] Error mounting Swagger UI:', err);
  }
}
