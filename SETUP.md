# Guía de Instalación y Configuración - Recuerdos QR

## 1. Configuración de Supabase (Opcional en Producción)
1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ejecuta los scripts SQL ubicados en `supabase/migrations/001_initial_schema.sql` en el SQL Editor de Supabase.
3. Inserta los datos demo con `supabase/seed.sql`.
4. Configura el Bucket de Storage en Supabase llamado `media` con acceso público de lectura.
5. Copia la `SUPABASE_URL` y `SUPABASE_KEY` a tu archivo `.env`.

## 2. Ejecución Local (Modo Independiente)
Si no deseas usar Supabase durante el desarrollo local, el sistema utiliza automáticamente el motor de persistencia integrado sin requerir ninguna base de datos externa instalada.
