# Arquitectura del Sistema - Recuerdos QR

## Estructura Monorepo
- **`apps/web`**: Aplicación web SPA/SSR en React + Vite + Tailwind CSS que aloja el Panel Administrativo y las Experiencias Públicas de Regalos.
- **`packages/backend`**: Servidor API REST escrito en Node.js, Express y TypeScript, documentado con Swagger UI (`/api-docs`).
- **`packages/shared`**: Paquete con tipos de dominio TypeScript, validadores Zod, motor de cálculo de fechas y configuraciones de temas visuales.
- **`supabase/`**: Esquemas de base de datos PostgreSQL, políticas RLS y script seed.

## Flujo de Datos
1. El Administrador crea/edita un proyecto desde el Panel Web (`/admin/editor/:id`).
2. Los datos se envían a la API REST (`/api/projects`), la cual actualiza el almacén de datos.
3. Al publicar, se genera la URL única (`/r/:slug`) y el código QR.
4. El cliente escanea el QR desde su smartphone y abre la vista pública adaptada (`/r/:slug`).
