import app from '../../../packages/backend/src/server';
import { db } from '../../../packages/backend/src/db/db';

let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    try {
      await db.initialize();
      initialized = true;
    } catch (err) {
      console.error('[Vercel API] DB init error:', err);
    }
  }
  return app(req, res);
}
