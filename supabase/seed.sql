-- ================================================
-- RECUERDOS QR - SEED DATA FOR DEMO PROJECT
-- ================================================

INSERT INTO public.projects (
  id, internal_name, person_one_name, person_two_name, affectionate_name,
  occasion_type, occasion_date, relationship_start_date, slug, status, template_id, language, share_enabled
) VALUES (
  'proj_demo_camila_diego', 'Demostración - Camila & Diego', 'Camila', 'Diego', 'Cami & Dieguito',
  'anniversary', '2026-02-14', '2022-02-05', 'camila-y-diego', 'published', 'romantic_elegant', 'es', TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.project_sections (id, project_id, section_type, title, subtitle, content, position, is_enabled) VALUES
('sec_hero_demo', 'proj_demo_camila_diego', 'hero', 'El comienzo de nuestra historia', 'El comienzo de una relación que ha ido creciendo poco a poco 💞', NULL, 1, TRUE),
('sec_letter_demo', 'proj_demo_camila_diego', 'letter', 'Te amo', 'TE AMO, MI AMOR 💖', '["Lo nuestro no se planeó y pienso que, ni haciendo el mejor de los planes, hubiésemos creado una historia tan bonita como la de hoy.","Si algún día pienso volver a algún lugar antes vivido, sería al momento en que te conocí."]', 2, TRUE),
('sec_photos_demo', 'proj_demo_camila_diego', 'photos', 'Nuestra historia en fotos', 'Momentos que guardo en mi corazón', NULL, 3, TRUE),
('sec_video_demo', 'proj_demo_camila_diego', 'video', 'Nuestros recuerdos especiales', 'Haz clic abajo para revivir uno de nuestros mejores momentos.', 'Un pedacito de nuestra historia, guardado para siempre.', 4, TRUE),
('sec_final_demo', 'proj_demo_camila_diego', 'final_message', 'Siempre tú', 'No necesito una historia perfecta. Solo quiero seguir escribiendo la nuestra contigo.', NULL, 5, TRUE)
ON CONFLICT (id) DO NOTHING;
