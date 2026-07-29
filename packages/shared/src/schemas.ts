import { z } from 'zod';

export const CreateProjectSchema = z.object({
  client_id: z.string().optional(),
  internal_name: z.string().min(2, 'El nombre interno debe tener al menos 2 caracteres'),
  sender_name: z.string().min(1, 'El nombre del remitente es obligatorio'),
  recipient_name: z.string().min(1, 'El nombre del destinatario es obligatorio'),
  final_signature: z.string().optional(),
  person_one_name: z.string().optional(),
  person_two_name: z.string().optional(),
  affectionate_name: z.string().optional(),
  relationship_type: z.string().default('couple'),
  custom_relationship: z.string().optional(),
  occasion_type: z.string().default('anniversary'),
  custom_occasion: z.string().optional(),
  emotional_tone: z.string().default('romantic'),
  occasion_date: z.string().min(1, 'La fecha de la ocasión es obligatoria'),
  relationship_start_date: z.string().min(1, 'La fecha de inicio es obligatoria'),
  counter_display_mode: z.enum(['elapsed_time', 'countdown', 'show_date_only', 'hidden']).optional().default('elapsed_time'),
  template_id: z.string().default('romantic_elegant'),
  language: z.string().default('es'),
});

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  slug: z.string().optional(),
  status: z.enum(['draft', 'published', 'unpublished', 'archived']).optional(),
  share_enabled: z.boolean().optional(),
});

export const LetterSectionSchema = z.object({
  heading: z.string().default('Te amo'),
  title: z.string().default('TE AMO, MI AMOR 💖'),
  bodyParagraphs: z.array(z.string()).min(1, 'La carta debe contener al menos un párrafo'),
  signature: z.string().default('Con todo mi amor'),
});

export const QRCodeSettingsSchema = z.object({
  color: z.string().default('#e83482'),
  bgColor: z.string().default('#ffffff'),
  errorCorrection: z.enum(['L', 'M', 'Q', 'H']).default('M'),
  logoUrl: z.string().optional(),
});
