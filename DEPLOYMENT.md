# Guía de Despliegue en Producción - Recuerdos QR

## Despliegue Frontend (Web Application)
1. Conecta el repositorio con **Vercel** o **Netlify**.
2. Configura el directorio raíz de la app en `apps/web`.
3. Comando de Build: `npm run build`
4. Directorio de salida: `dist`

## Despliegue Backend (API REST)
1. Despliega la aplicación Express en **Render**, **Railway** o VPS Ubuntu.
2. Configura la variable de entorno `PORT=4000` y `JWT_SECRET`.
3. Inicia la aplicación con `npm --prefix packages/backend run start`.
