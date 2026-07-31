export const technicalArchitectureData = {
  implemented: [
    "React + Vite (Frontend)",
    "TailwindCSS (Estilos)",
    "Express.js (Backend local/API)",
    "Zustand/Context (Estado)",
    "Generación de QR (qrcode)",
    "Editor Drag & Drop de Tarjetas QR (react-rnd/html2canvas/jsPDF)",
    "Almacenamiento de archivos locales (Uploads directos)"
  ],
  planned: [
    "Supabase (Autenticación y BD en Producción)",
    "FFmpeg (Generación automática del video del scroll en el backend)",
    "Playwright (Captura de pantalla y renderizado)"
  ]
};

export const infrastructureData = {
  current: [
    "Frontend hosteado en Vercel/Railway.",
    "Backend en Railway (Node.js).",
    "Archivos en disco local (temporal o persistente según el host)."
  ],
  recommendations: [
    "Migrar almacenamiento de fotos y videos a AWS S3 o Supabase Storage para persistencia real.",
    "Ejecutar los renderizados de video con Playwright/Remotion en un worker serverless separado para no bloquear la API."
  ]
};

export const adminPanelData = {
  structure: [
    "Dashboard (Métricas)",
    "Editor de Regalo (Configuración visual, carga de media, creación de textos)",
    "Gestor de Tarjetas QR (Modal para maquetar la tarjeta a imprimir)",
    "Descargas y Exportaciones"
  ],
  model: "Un usuario administrador crea proyectos (regalos). Cada regalo tiene su slug público y configuraciones de diseño."
};

export const implementationStatusData = [
  { feature: "Creación de proyectos y URLs (slugs)", status: "Implementada", priority: "Alta", relatedFiles: "projectsRouter.ts, ProjectEditor.tsx" },
  { feature: "Carga de fotos y videos", status: "Implementada", priority: "Alta", relatedFiles: "mediaRouter.ts, MediaUploader.tsx" },
  { feature: "Generación de QR y descarga en PDF", status: "Implementada", priority: "Alta", relatedFiles: "qrRouter.ts, QrAndCardModal.tsx" },
  { feature: "Reproductor de Video con Descarga", status: "Implementada", priority: "Alta", relatedFiles: "VideoSection.tsx, projectsRouter.ts" },
  { feature: "Editor Canva Drag&Drop", status: "Implementada", priority: "Alta", relatedFiles: "CardCanvasEditor.tsx" },
  { feature: "Base de Datos en Supabase real", status: "Pendiente", priority: "Alta", relatedFiles: "db.ts" },
  { feature: "Generación automática del Video de la Experiencia (MP4 del scroll)", status: "Pendiente", priority: "Alta", relatedFiles: "videoExportService.ts" }
] as const;
