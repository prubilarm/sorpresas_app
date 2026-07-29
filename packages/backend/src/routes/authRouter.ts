import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/db';

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'recuerdos_qr_super_secret_key_2026';

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de administrador
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@recuerdosqr.cl
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Sesión iniciada exitosamente
 *       401:
 *         description: Credenciales inválidas
 */
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Debes proporcionar correo y contraseña.' });
  }

  const user = db.getState.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || password !== 'admin123') {
    return res.status(401).json({ error: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil de usuario devuelto exitosamente
 */
authRouter.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autenticado.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = db.getState.users.find((u) => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

    return res.json({ user });
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
});
