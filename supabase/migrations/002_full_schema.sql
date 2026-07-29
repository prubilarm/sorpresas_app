-- ================================================
-- RECUERDOS QR — MIGRACIÓN SQL COMPLETA v2
-- Ejecutar en el SQL Editor de Supabase Dashboard
-- ================================================

-- ── Extensiones necesarias ──────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tabla: perfiles de usuario ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'client')),
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabla: proyectos (regalos) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id                     TEXT PRIMARY KEY,
  owner_id               TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_id              TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  internal_name          TEXT NOT NULL,

  -- Personas involucradas
  sender_name            TEXT,
  recipient_name         TEXT,
  person_one_name        TEXT,
  person_two_name        TEXT,
  affectionate_name      TEXT,
  final_signature        TEXT,

  -- Tipo de experiencia
  relationship_type      TEXT NOT NULL DEFAULT 'couple',
  custom_relationship    TEXT,
  occasion_type          TEXT NOT NULL DEFAULT 'anniversary',
  custom_occasion        TEXT,
  emotional_tone         TEXT NOT NULL DEFAULT 'romantic',

  -- Fechas
  occasion_date          DATE,
  relationship_start_date DATE,
  counter_display_mode   TEXT DEFAULT 'elapsed_time',

  -- Publicación
  slug                   TEXT NOT NULL UNIQUE,
  status                 TEXT NOT NULL DEFAULT 'draft'
                         CHECK (status IN ('draft', 'published', 'unpublished', 'archived')),
  template_id            TEXT NOT NULL DEFAULT 'romantic_elegant',
  language               TEXT NOT NULL DEFAULT 'es',
  share_enabled          BOOLEAN NOT NULL DEFAULT TRUE,
  published_at           TIMESTAMPTZ,

  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at             TIMESTAMPTZ
);

-- ── Tabla: secciones de proyecto ────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_sections (
  id           TEXT PRIMARY KEY,
  project_id   TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  title        TEXT,
  subtitle     TEXT,
  content      TEXT,
  settings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  position     INT NOT NULL DEFAULT 1,
  is_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabla: archivos multimedia ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.media (
  id                TEXT PRIMARY KEY,
  project_id        TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  section_id        TEXT REFERENCES public.project_sections(id) ON DELETE SET NULL,
  media_type        TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'audio')),
  storage_path      TEXT NOT NULL,
  public_url        TEXT NOT NULL,
  thumbnail_url     TEXT,
  original_filename TEXT NOT NULL,
  mime_type         TEXT NOT NULL,
  size_bytes        BIGINT NOT NULL DEFAULT 0,
  width             INT,
  height            INT,
  duration_seconds  INT,
  position          INT NOT NULL DEFAULT 1,
  caption           TEXT,
  description       TEXT,
  alt_text          TEXT,
  event_date        DATE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabla: eventos de línea de tiempo ───────────────────────
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id          TEXT PRIMARY KEY,
  project_id  TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  event_date  DATE,
  media_id    TEXT REFERENCES public.media(id) ON DELETE SET NULL,
  icon        TEXT,
  position    INT NOT NULL DEFAULT 1,
  is_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabla: códigos QR ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.qr_codes (
  id              TEXT PRIMARY KEY,
  project_id      TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  destination_url TEXT NOT NULL,
  png_storage_path TEXT,
  svg_storage_path TEXT,
  settings_json   JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabla: diseños de tarjeta ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.card_designs (
  id          TEXT PRIMARY KEY,
  project_id  TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL DEFAULT 'default',
  settings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabla: analytics ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_analytics (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id  TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL CHECK (event_type IN ('page_view', 'video_play', 'song_click', 'share_click')),
  device_type TEXT,
  browser     TEXT,
  referrer    TEXT,
  country     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabla: exportaciones de video ────────────────────────────
CREATE TABLE IF NOT EXISTS public.video_exports (
  id               TEXT PRIMARY KEY,
  project_id       TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  format           TEXT NOT NULL DEFAULT '9:16',
  profile          TEXT NOT NULL DEFAULT 'full_experience',
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'preparing', 'rendering', 'processing_photos', 'mixing_audio', 'encoding', 'completed', 'failed')),
  progress_percent INT NOT NULL DEFAULT 0,
  output_url       TEXT,
  file_size_bytes  BIGINT,
  duration_seconds INT,
  resolution       TEXT,
  error_message    TEXT,
  bg_music_url     TEXT,
  bg_music_volume  DECIMAL(3,2) DEFAULT 0.35,
  auto_ducking     BOOLEAN DEFAULT TRUE,
  video_audio_volume DECIMAL(3,2) DEFAULT 1.0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Índices ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_sections_project ON public.project_sections(project_id);
CREATE INDEX IF NOT EXISTS idx_media_project ON public.media(project_id);
CREATE INDEX IF NOT EXISTS idx_timeline_project ON public.timeline_events(project_id);
CREATE INDEX IF NOT EXISTS idx_exports_project ON public.video_exports(project_id);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Lectura pública de proyectos publicados
CREATE POLICY "Lectura pública de proyectos publicados"
  ON public.projects FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

-- Lectura pública de secciones de proyectos publicados
CREATE POLICY "Lectura pública de secciones"
  ON public.project_sections FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
  ));

-- Lectura pública de media de proyectos publicados
CREATE POLICY "Lectura pública de media"
  ON public.media FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
  ));

-- Lectura pública de timeline
CREATE POLICY "Lectura pública de timeline"
  ON public.timeline_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
  ));

-- Acceso completo vía service_role (backend en Railway)
-- El service_role key bypassa RLS automáticamente en Supabase
-- No se necesitan políticas adicionales para el backend

-- ── Bucket de Storage para media ────────────────────────────
-- (Ejecutar DESPUÉS de crear el bucket manualmente en Supabase Dashboard > Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
-- ON CONFLICT (id) DO NOTHING;
