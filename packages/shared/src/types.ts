export type RelationshipType =
  | 'couple'
  | 'husband_to_wife'
  | 'wife_to_husband'
  | 'boyfriend_to_girlfriend'
  | 'girlfriend_to_boyfriend'
  | 'father_to_daughter'
  | 'father_to_son'
  | 'mother_to_daughter'
  | 'mother_to_son'
  | 'daughter_to_mother'
  | 'son_to_mother'
  | 'daughter_to_father'
  | 'son_to_father'
  | 'parents_to_child'
  | 'child_to_parents'
  | 'grandparent_to_grandchild'
  | 'grandchild_to_grandparents'
  | 'siblings'
  | 'friends'
  | 'best_friends'
  | 'family'
  | 'coworkers'
  | 'student_to_teacher'
  | 'teacher_to_student'
  | 'professional_gratitude'
  | 'tribute'
  | 'in_memory'
  | 'other';

export type OccasionType =
  | 'anniversary'
  | 'birthday'
  | 'mothers_day'
  | 'fathers_day'
  | 'grandparents_day'
  | 'birth'
  | 'baby_welcome'
  | 'graduation'
  | 'wedding'
  | 'marriage_proposal'
  | 'valentines'
  | 'christmas'
  | 'friendship'
  | 'gratitude'
  | 'reconciliation'
  | 'apology'
  | 'farewell'
  | 'retirement'
  | 'personal_achievement'
  | 'tribute'
  | 'family_memory'
  | 'in_memory'
  | 'no_occasion'
  | 'custom';

export type EmotionalTone =
  | 'romantic'
  | 'family'
  | 'emotional'
  | 'joyful'
  | 'funny'
  | 'tender'
  | 'childish'
  | 'elegant'
  | 'nostalgic'
  | 'inspiring'
  | 'solemn'
  | 'grateful'
  | 'custom';

export type CounterDisplayMode = 'elapsed_time' | 'countdown' | 'show_date_only' | 'hidden';

export type ProjectStatus = 'draft' | 'published' | 'unpublished' | 'archived';

export type ThemeId =
  | 'romantic_elegant'
  | 'family_warm'
  | 'joyful_celebration'
  | 'childish'
  | 'friendship_fun'
  | 'elegant_sobriety'
  | 'nostalgia_tribute'
  | 'nature_organic'
  | 'minimalist'
  | 'night_romantic'
  | 'polaroid';

export type SectionType =
  | 'hero'
  | 'history'
  | 'counter'
  | 'letter'
  | 'photos'
  | 'timeline'
  | 'video'
  | 'reasons'
  | 'final_message';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectParticipant {
  id: string;
  project_id: string;
  role: 'sender' | 'recipient' | 'featured_person' | 'family_member' | 'friend' | 'other';
  display_name: string;
  position: number;
  created_at: string;
}

export interface Project {
  id: string;
  owner_id: string;
  client_id?: string;
  internal_name: string;
  sender_name: string;
  recipient_name: string;
  final_signature?: string;
  // Legacy aliases for backward compatibility
  person_one_name?: string;
  person_two_name?: string;
  affectionate_name?: string;
  relationship_type: RelationshipType;
  custom_relationship?: string;
  occasion_type: OccasionType;
  custom_occasion?: string;
  emotional_tone: EmotionalTone;
  occasion_date: string;
  relationship_start_date: string;
  counter_display_mode?: CounterDisplayMode;
  slug: string;
  status: ProjectStatus;
  template_id: ThemeId;
  language: string;
  share_enabled: boolean;
  allow_public_video_download?: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export type VideoExportFormat = '9:16' | '4:5' | '1:1' | '16:9';
export type VideoExportProfile = 'reel_short' | 'reel_social' | 'full_experience' | 'custom';
export type VideoExportStatus = 'pending' | 'preparing' | 'rendering' | 'processing_photos' | 'mixing_audio' | 'encoding' | 'completed' | 'failed';

export interface VideoExportConfig {
  format: VideoExportFormat;
  profile: VideoExportProfile;
  bg_music_url?: string;
  bg_music_volume?: number;
  video_audio_volume?: number;
  auto_ducking?: boolean;
  show_branding_closing?: boolean;
}

export interface VideoExportJob {
  id: string;
  project_id: string;
  format: VideoExportFormat;
  profile: VideoExportProfile;
  status: VideoExportStatus;
  progress_percent: number;
  output_url?: string;
  file_size_bytes?: number;
  duration_seconds?: number;
  resolution?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectSection {
  id: string;
  project_id: string;
  section_type: SectionType;
  title: string;
  subtitle?: string;
  content?: string;
  settings_json: Record<string, any>;
  position: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: string;
  project_id: string;
  section_id?: string;
  media_type: 'image' | 'video' | 'audio';
  storage_path: string;
  public_url: string;
  thumbnail_url?: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  duration_seconds?: number;
  position: number;
  title?: string;
  subtitle?: string;
  caption?: string;
  description?: string;
  alt_text?: string;
  event_date?: string;
  text_position?: 'auto' | 'bottom' | 'top' | 'left' | 'right' | 'overlay';
  is_bw?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  project_id: string;
  title: string;
  description: string;
  event_date: string;
  media_id?: string;
  icon?: string;
  position: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface QRCodeRecord {
  id: string;
  project_id: string;
  destination_url: string;
  png_storage_path?: string;
  svg_storage_path?: string;
  settings_json: {
    color: string;
    bgColor: string;
    errorCorrection: 'L' | 'M' | 'Q' | 'H';
    logoUrl?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CardDesign {
  id: string;
  project_id: string;
  template_id: string;
  settings_json: {
    title: string;
    subtitle: string;
    footer: string;
    bgColor: string;
    textColor: string;
    qrSizeCm: number;
  };
  created_at: string;
  updated_at: string;
}

export interface ProjectAnalytics {
  id: string;
  project_id: string;
  event_type: 'page_view' | 'video_play' | 'share_click';
  device_type?: string;
  browser?: string;
  referrer?: string;
  country?: string;
  created_at: string;
}
