/**
 * db.ts — Capa de datos dual-mode
 *
 * • En DEVELOPMENT (sin SUPABASE_URL): usa data/db.json (igual que antes)
 * • En PRODUCTION (con SUPABASE_URL):  lee de Supabase al iniciar y escribe
 *   de vuelta en cada save(). La interfaz pública (db.getState / db.save) es
 *   100% compatible con el código existente — ninguna ruta necesita cambios.
 */

import fs from 'fs';
import path from 'path';
import {
  Project,
  ProjectSection,
  MediaItem,
  TimelineEvent,
  QRCodeRecord,
  CardDesign,
  ProjectAnalytics,
  UserProfile,
  VideoExportJob,
} from '@recuerdos-qr/shared';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';

// ── Types ────────────────────────────────────────────────────────────────────

export interface DatabaseState {
  users: UserProfile[];
  projects: Project[];
  sections: ProjectSection[];
  media: MediaItem[];
  timeline: TimelineEvent[];
  qrCodes: QRCodeRecord[];
  cardDesigns: CardDesign[];
  analytics: ProjectAnalytics[];
  exports: VideoExportJob[];
}

// ── JSON fallback (development) ──────────────────────────────────────────────

const DATA_FILE = path.join(__dirname, '../../data/db.json');

const INITIAL_DEMO_PROJECT_ID = 'proj_demo_camila_diego';

const INITIAL_STATE: DatabaseState = {
  users: [
    {
      id: 'usr_admin_default',
      email: 'admin@recuerdosqr.cl',
      name: 'Administrador Principal',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  projects: [
    {
      id: INITIAL_DEMO_PROJECT_ID,
      owner_id: 'usr_admin_default',
      client_id: 'usr_admin_default',
      internal_name: 'Demostración - Camila & Diego',
      sender_name: 'Camila',
      recipient_name: 'Diego',
      final_signature: 'Con todo mi amor, Camila',
      person_one_name: 'Camila',
      person_two_name: 'Diego',
      affectionate_name: 'Cami & Dieguito',
      relationship_type: 'couple',
      occasion_type: 'anniversary',
      emotional_tone: 'romantic',
      occasion_date: '2026-02-14',
      relationship_start_date: '2022-02-05',
      counter_display_mode: 'elapsed_time',
      slug: 'camila-y-diego',
      status: 'published',
      template_id: 'romantic_elegant',
      language: 'es',
      share_enabled: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Project,
  ],
  sections: [
    {
      id: 'sec_hero_demo',
      project_id: INITIAL_DEMO_PROJECT_ID,
      section_type: 'hero',
      title: 'El comienzo de nuestra historia',
      subtitle: 'El comienzo de una relación que ha ido creciendo poco a poco 💞',
      settings_json: { cover: '/assets/fotos/portada.svg' },
      position: 1,
      is_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'sec_letter_demo',
      project_id: INITIAL_DEMO_PROJECT_ID,
      section_type: 'letter',
      title: 'Te amo',
      subtitle: 'TE AMO, MI AMOR 💖',
      content: JSON.stringify([
        'Lo nuestro no se planeó y pienso que, ni haciendo el mejor de los planes, hubiésemos creado una historia tan bonita como la de hoy.',
        'Si algún día pienso volver a algún lugar antes vivido, sería al momento en que te conocí.',
      ]),
      settings_json: { signature: 'Con todo mi amor, Camila' },
      position: 2,
      is_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'sec_photos_demo',
      project_id: INITIAL_DEMO_PROJECT_ID,
      section_type: 'photos',
      title: 'Nuestra historia en fotos',
      subtitle: 'Momentos que guardo en mi corazón',
      settings_json: { autoplay_mode: 'auto_and_manual' },
      position: 3,
      is_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'sec_video_demo',
      project_id: INITIAL_DEMO_PROJECT_ID,
      section_type: 'video',
      title: 'Nuestros recuerdos especiales',
      subtitle: 'Haz clic abajo para revivir uno de nuestros mejores momentos.',
      content: 'Un pedacito de nuestra historia, guardado para siempre.',
      settings_json: { poster: '/assets/fotos/portada.svg' },
      position: 4,
      is_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'sec_final_demo',
      project_id: INITIAL_DEMO_PROJECT_ID,
      section_type: 'final_message',
      title: 'Siempre tú',
      subtitle: 'No necesito una historia perfecta. Solo quiero seguir escribiendo la nuestra contigo.',
      settings_json: { heartsEnabled: true },
      position: 5,
      is_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  media: [
    {
      id: 'med_foto_1',
      project_id: INITIAL_DEMO_PROJECT_ID,
      media_type: 'image',
      storage_path: 'fotos/foto01.svg',
      public_url: '/assets/fotos/foto01.svg',
      thumbnail_url: '/assets/fotos/foto01.svg',
      original_filename: 'foto01.svg',
      mime_type: 'image/svg+xml',
      size_bytes: 1024,
      position: 1,
      caption: 'El día en que comenzó todo.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'med_foto_2',
      project_id: INITIAL_DEMO_PROJECT_ID,
      media_type: 'image',
      storage_path: 'fotos/foto02.svg',
      public_url: '/assets/fotos/foto02.svg',
      thumbnail_url: '/assets/fotos/foto02.svg',
      original_filename: 'foto02.svg',
      mime_type: 'image/svg+xml',
      size_bytes: 1024,
      position: 2,
      caption: 'Una de nuestras aventuras favoritas.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  timeline: [],
  qrCodes: [
    {
      id: 'qr_demo_1',
      project_id: INITIAL_DEMO_PROJECT_ID,
      destination_url: `${process.env.PUBLIC_DOMAIN || 'http://localhost:3000'}/r/camila-y-diego`,
      settings_json: { color: '#e83482', bgColor: '#ffffff', errorCorrection: 'M' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  cardDesigns: [
    {
      id: 'card_demo_1',
      project_id: INITIAL_DEMO_PROJECT_ID,
      template_id: 'default',
      settings_json: {
        title: 'Camila & Diego',
        subtitle: 'Escanea este código con la cámara de tu teléfono',
        footer: 'Tengo algo especial para ti',
        bgColor: '#27000f',
        textColor: '#ffffff',
        qrSizeCm: 3.15,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  analytics: [],
  exports: [],
};

// ── DBManager ────────────────────────────────────────────────────────────────

class DBManager {
  private data: DatabaseState;
  private _useSupabase: boolean = false;
  private _initialized: boolean = false;
  // Dirty flag per table — only sync tables that have been modified
  private _dirtyTables: Set<keyof DatabaseState> = new Set();

  constructor() {
    this.data = this.loadFromJson();
  }

  // ── Local JSON fallback ─────────────────────────────────────

  private loadFromJson(): DatabaseState {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        delete parsed.music;
        const merged = { ...INITIAL_STATE, ...parsed };
        if (Array.isArray(merged.projects)) {
          merged.projects = merged.projects.map((p: any) => ({
            ...p,
            sender_name: p.sender_name || p.person_one_name || '',
            recipient_name: p.recipient_name || p.person_two_name || '',
            person_one_name: p.person_one_name || p.sender_name || '',
            person_two_name: p.person_two_name || p.recipient_name || '',
            relationship_type: p.relationship_type || 'couple',
            occasion_type: p.occasion_type || 'anniversary',
            emotional_tone: p.emotional_tone || 'romantic',
            counter_display_mode: p.counter_display_mode || 'elapsed_time',
            final_signature: p.final_signature || `Con todo mi amor, ${p.sender_name || p.person_one_name || ''}`,
          }));
        }
        return merged;
      }
    } catch (err) {
      console.warn('[DB] Unable to read JSON file, using initial state:', (err as any).message);
    }
    this.saveJsonFile(INITIAL_STATE);
    return { ...INITIAL_STATE };
  }

  private saveJsonFile(state: DatabaseState) {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
    } catch (err) {
      console.error('[DB] Failed to persist JSON state:', err);
    }
  }

  // ── Supabase initialization ─────────────────────────────────

  /**
   * Call this from server.ts at startup.
   * Loads all data from Supabase into memory so existing routes work unchanged.
   */
  public async initialize(): Promise<void> {
    if (this._initialized) return;
    this._initialized = true;

    if (!isSupabaseConfigured()) {
      console.log('[DB] Supabase not configured — using local JSON file (development mode)');
      return;
    }

    console.log('[DB] Connecting to Supabase...');
    this._useSupabase = true;

    try {
      await this.loadFromSupabase();
      console.log(`[DB] ✓ Loaded from Supabase: ${this.data.projects.length} projects, ${this.data.media.length} media items`);
    } catch (err) {
      console.error('[DB] Failed to load from Supabase, falling back to JSON:', err);
      this._useSupabase = false;
    }
  }

  private async loadFromSupabase(): Promise<void> {
    const sb = getSupabaseClient()!;

    const [
      projectsRes,
      sectionsRes,
      mediaRes,
      timelineRes,
      qrRes,
      cardRes,
      analyticsRes,
      exportsRes,
      usersRes,
    ] = await Promise.all([
      sb.from('projects').select('*').is('deleted_at', null).order('created_at', { ascending: false }),
      sb.from('project_sections').select('*').order('position'),
      sb.from('media').select('*').order('position'),
      sb.from('timeline_events').select('*').order('position'),
      sb.from('qr_codes').select('*'),
      sb.from('card_designs').select('*'),
      sb.from('project_analytics').select('*'),
      sb.from('video_exports').select('*').order('created_at', { ascending: false }),
      sb.from('profiles').select('*'),
    ]);

    this.data = {
      projects: projectsRes.data || [],
      sections: sectionsRes.data || [],
      media: mediaRes.data || [],
      timeline: timelineRes.data || [],
      qrCodes: (qrRes.data || []).map((r: any) => ({ ...r, settings_json: r.settings_json || {} })),
      cardDesigns: (cardRes.data || []).map((r: any) => ({ ...r, settings_json: r.settings_json || {} })),
      analytics: analyticsRes.data || [],
      exports: exportsRes.data || [],
      users: usersRes.data || [],
    };
  }

  // ── Public API (same interface as before) ───────────────────

  public get getState(): DatabaseState {
    return this.data;
  }

  public markDirty(table: keyof DatabaseState) {
    this._dirtyTables.add(table);
  }

  /**
   * Persist all dirty tables to Supabase (or JSON file in dev).
   * Fire-and-forget safe — existing routes can call this synchronously.
   */
  public save() {
    if (!this._useSupabase) {
      this.saveJsonFile(this.data);
      return;
    }
    // Fire async save without blocking the current request
    this.saveToSupabase().catch((err) =>
      console.error('[DB] Background Supabase save failed:', err)
    );
  }

  private async saveToSupabase(): Promise<void> {
    const sb = getSupabaseClient()!;
    const dirty = Array.from(this._dirtyTables);
    this._dirtyTables.clear();

    for (const table of dirty) {
      try {
        switch (table) {
          case 'projects':
            await sb.from('projects').upsert(this.data.projects, { onConflict: 'id' });
            break;
          case 'sections':
            await sb.from('project_sections').upsert(this.data.sections, { onConflict: 'id' });
            break;
          case 'media':
            await sb.from('media').upsert(this.data.media, { onConflict: 'id' });
            break;
          case 'timeline':
            await sb.from('timeline_events').upsert(this.data.timeline, { onConflict: 'id' });
            break;
          case 'qrCodes':
            await sb.from('qr_codes').upsert(this.data.qrCodes, { onConflict: 'id' });
            break;
          case 'cardDesigns':
            await sb.from('card_designs').upsert(this.data.cardDesigns, { onConflict: 'id' });
            break;
          case 'analytics':
            // Analytics are insert-only, we don't upsert the whole table
            break;
          case 'exports':
            await sb.from('video_exports').upsert(this.data.exports, { onConflict: 'id' });
            break;
          case 'users':
            await sb.from('profiles').upsert(this.data.users, { onConflict: 'id' });
            break;
        }
      } catch (err) {
        console.error(`[DB] Failed to upsert table ${table}:`, err);
      }
    }
  }

  // ── Analytics: direct Supabase insert (no upsert needed) ────

  public async insertAnalyticEvent(event: Omit<ProjectAnalytics, 'id'>): Promise<void> {
    if (this._useSupabase) {
      const sb = getSupabaseClient()!;
      await sb.from('project_analytics').insert({ ...event, id: `anl_${Date.now()}` });
    } else {
      this.data.analytics.push({ ...event, id: `anl_${Date.now()}` } as ProjectAnalytics);
      this.saveJsonFile(this.data);
    }
  }
}

export const db = new DBManager();
