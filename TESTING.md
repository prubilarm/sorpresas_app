# Guía de Pruebas y Verificación - Recuerdos QR

## Pruebas Automatizadas del Backend
Para ejecutar la suite de pruebas unitarias e integración de la API REST y cálculo de fechas:
```bash
npm --prefix packages/backend test
```

## Verificación Manual del Swagger API
1. Inicia el servidor backend (`npm run dev:backend`).
2. Abre `http://localhost:4000/api-docs`.
3. Prueba el inicio de sesión (`POST /api/auth/login`), creación de regalos (`POST /api/projects`) y generación de QR (`GET /api/projects/:id/qr`).
