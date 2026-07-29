# Recuerdos QR - Plataforma Web para Regalos Personalizados con QR

Plataforma web comercial y reutilizable diseñada para crear, gestionar, publicar y distribuir experiencias digitales románticas personalizadas mediante códigos QR y tarjetas físicas imprimibles.

---

## 🚀 Características Principales

- **Panel de Administración Responsive**: Gestión completa de clientes, regalos, fotos, videos y configuraciones desde cualquier dispositivo.
- **Experiencia Pública Romántica**: Páginas web verticales (`/r/:slug`) con pantalla de inicio animada, contador exacto de tiempo, carta con tipografía serif, galería de fotos, reproductor de video especial ("Pulsa aquí ✨"), canción y mensaje final con partículas de corazones.
- **Documentación Swagger Integrada**: Documentación de la API REST accesible directamente en `/api-docs`.
- **4 Plantillas Visuales**: Romántico elegante, Noche romántica, Polaroid, Minimalista.
- **Generador de QR y Tarjeta Imprimible**: Código QR personalizado (PNG/SVG) y tarjeta física de 9x9 cm exportable a PDF de alta resolución.
- **Base de Datos Dual**: Soporte para Supabase (PostgreSQL + RLS) y motor de almacenamiento local en archivo JSON/SQLite.

---

## 🛠️ Requisitos e Instalación

### 1. Clonar el repositorio e instalar dependencias
```bash
npm install
```

### 2. Variables de entorno
Copia el archivo de ejemplo para configurar tus credenciales:
```bash
cp .env.example .env
```

### 3. Iniciar en desarrollo
Para ejecutar el backend y la web frontend simultáneamente:
```bash
# Iniciar backend Express con Swagger UI en http://localhost:4000
npm run dev:backend

# Iniciar plataforma web React en http://localhost:3000
npm run dev:web
```

---

## 📘 Documentación API (Swagger UI)

Una vez iniciado el servidor backend, abre tu navegador e ingresa a:
`http://localhost:4000/api-docs`

Ahí podrás consultar y probar interactivamente todos los endpoints para Autenticación, Proyectos, Multimedia, Código QR, Tarjetas Imprimibles y Analíticas.

---

## 🔑 Credenciales de Prueba (Demostración)

- **Administrador**: `admin@recuerdosqr.cl`
- **Contraseña**: `admin123`
- **Regalo Demo**: `http://localhost:3000/r/camila-y-diego`
