export interface ProductKnowledge {
  lastUpdated: string;
  product: {
    summary: string;
    problemSolved: string;
    whatCustomerReceives: string;
    howItWorks: string;
    differentiator: string;
    emotionalGoal: string;
    valueProposition: string;
    whatItIsNot: string;
  };
  branding: {
    category: string[];
    suggestedNames: string[];
    noteToAI: string;
  };
  audiences: {
    target: string[];
    motivations: string[];
  };
  experienceStructure: {
    sections: { name: string; description: string }[];
    currentOrder: string[];
  };
  relationships: {
    types: string[];
    impact: string;
  };
  occasions: {
    types: string[];
    impact: string;
  };
  emotionalTones: Array<{
    name: string;
    goal: string;
    recommendedWords: string[];
    avoidWords: string[];
    style: string;
    titleIdeas: string[];
    callToActionIdeas: string[];
    suggestedColors: string;
    socialMediaStyle: string;
    suggestedMusic: string;
    suggestedVideoEditing: string;
  }>;
  visualThemes: Array<{
    id: string;
    name: string;
    description: string;
    dynamicElements: string[];
  }>;
  galleryBehavior: {
    features: string[];
    socialMediaRepresentation: string;
  };
  videoFeature: {
    maxDuration: string;
    format: string;
    location: string;
    playback: string;
    mobileBehavior: string;
    limitations: string;
    compression: string;
  };
  photosFeature: {
    maxQuantity: number;
    recommendedSize: string;
    formats: string[];
    features: string[];
  };
  socialMediaVideoGeneration: {
    description: string;
    differences: {
      originalVideo: string;
      fullExperienceVideo: string;
    };
    techSpecs: string[];
  };
  commercialPlans: Array<{
    name: string;
    referencePriceCLP: number;
    includes: string[];
  }>;
  renewals: {
    model: string[];
    plans: string[];
  };
  mariachiIntegration: {
    description: string;
    saleFormats: string[];
    experienceFlow: string[];
    referencePrices: string[];
  };
  operationalFlow: string[];
  adminPanel: {
    structure: string[];
    model: string;
  };
  technicalArchitecture: {
    implemented: string[];
    planned: string[];
  };
  infrastructure: {
    current: string[];
    recommendations: string[];
  };
  faq: Array<{ question: string; answer: string }>;
  commercialMessages: Array<{ type: string; content: string }>;
  socialMediaIdeas: Array<{
    category: string;
    title: string;
    goal: string;
    hook: string;
    format: string;
    duration: string;
    scenes: string;
    onScreenText: string;
    voiceOver: string;
    cta: string;
    description: string;
    hashtags: string;
  }>;
  brandVoice: {
    traits: string[];
    avoidTraits: string[];
    avoidPhrases: string[];
  };
  aiGuidelines: string[];
  implementationStatus: Array<{
    feature: string;
    status: 'Implementada' | 'Parcial' | 'Pendiente' | 'Error';
    priority: string;
    relatedFiles: string;
  }>;
}

export const knowledgeBase: ProductKnowledge = {
  lastUpdated: new Date().toISOString(),
  product: {
    summary: "Se vende una experiencia digital personalizada que combina fotografías, mensajes, fechas, video, música, animaciones y recuerdos para regalar.",
    problemSolved: "Resuelve la necesidad de entregar un regalo con alto impacto emocional, original y perdurable, superando las limitaciones de los regalos físicos convencionales.",
    whatCustomerReceives: "El cliente recibe una página web única y personalizada, un código QR físico/digital para acceder a ella, y opcionalmente un video renderizado de la experiencia para redes sociales.",
    howItWorks: "El cliente compra, envía sus archivos (fotos/video/textos), nosotros armamos la experiencia, le entregamos un QR, y al escanearlo, el destinatario vive la experiencia interactiva.",
    differentiator: "No es una simple galería ni un video estático. Es un viaje interactivo con música, scroll guiado, mensajes que aparecen secuencialmente y un diseño elegante adaptado al tipo de relación.",
    emotionalGoal: "Provocar sorpresa, lágrimas de alegría, nostalgia, amor y una profunda conexión emocional.",
    valueProposition: "Transformar recuerdos digitales sueltos en una obra de arte interactiva, empaquetada como un regalo de lujo accesible a través de un simple código QR.",
    whatItIsNot: "No es simplemente una página web estática. No es solo un código QR. No es un álbum de fotos genérico."
  },
  branding: {
    category: [
      "Experiencias digitales personalizadas",
      "Regalos digitales con QR",
      "Recuerdos digitales interactivos",
      "Historias personalizadas para regalar"
    ],
    suggestedNames: [
      "Momentia",
      "Recuerdo Vivo",
      "Memorias QR",
      "Mi Historia QR",
      "Recuerdos QR",
      "Siempre Contigo"
    ],
    noteToAI: "NotebookLM debe respetar el nombre final configurado en el sistema cuando exista. Si no está definido, puede usar estos de referencia."
  },
  audiences: {
    target: [
      "Parejas", "Esposos", "Pololos", "Mamás", "Papás", "Hijos", "Hijas", 
      "Abuelos", "Amigos", "Familias", "Personas que celebran cumpleaños", 
      "Aniversarios", "Graduaciones", "Nacimientos", "Pedidas de matrimonio", 
      "Día de la Madre", "Día del Padre", "Navidad", "San Valentín", 
      "Homenajes", "Agradecimientos", "Recuerdos familiares"
    ],
    motivations: [
      "Sorprender", "Emocionar", "Pedir perdón", "Agradecer", "Celebrar", 
      "Recordar", "Homenajear", "Declarar amor", "Conservar recuerdos", 
      "Compartir una historia"
    ]
  },
  experienceStructure: {
    sections: [
      { name: "Pantalla inicial", description: "Muestra 'Toca para comenzar' para asegurar interacción y auto-play de audio." },
      { name: "Portada (Hero)", description: "Imagen principal, título, subtítulo decorativo." },
      { name: "Contador de tiempo", description: "Muestra tiempo transcurrido desde una fecha (ej: 'Llevamos juntos 3 años')." },
      { name: "Carta", description: "Mensaje de texto profundo, dividido en párrafos." },
      { name: "Galería de fotos", description: "Carrusel o presentación cinematográfica de fotografías." },
      { name: "Video", description: "Video personalizado (subido por el cliente) que se reproduce al interactuar." },
      { name: "Mensaje Final", description: "Firma, dedicatoria final y llamado a la acción emocional." }
    ],
    currentOrder: ["Pantalla inicial", "Portada (Hero)", "Contador de tiempo", "Carta", "Galería de fotos", "Video", "Mensaje Final"]
  },
  relationships: {
    types: [
      "Pareja", "Esposo/a", "Novio/a", "Mamá", "Papá", "Hijo/a", "Abuelos", "Amigos", 
      "Familia", "Compañeros", "Profesor", "Homenaje", "En Memoria"
    ],
    impact: "El tipo de relación afecta la selección del tema visual, el tono de los textos por defecto, y sugiere una música acorde (ej: romance vs gratitud profesional)."
  },
  occasions: {
    types: [
      "Aniversario", "Cumpleaños", "Día de la Madre", "Día del Padre", "Día de los Abuelos",
      "Nacimiento", "Graduación", "Matrimonio", "Propuesta de matrimonio", "San Valentín",
      "Navidad", "Agradecimiento", "Homenaje", "Fecha especial", "Sorpresa sin ocasión"
    ],
    impact: "Determina la plantilla, el texto del contador (ej: 'Feliz Cumpleaños' vs 'Tiempo Juntos'), y los mensajes sugeridos."
  },
  emotionalTones: [
    {
      name: "Romántico",
      goal: "Enamorar y conmover profundamente a la pareja.",
      recommendedWords: ["Amor", "Siempre", "Juntos", "Corazón", "Magia", "Destino"],
      avoidWords: ["Compañero", "Simpático", "Útil"],
      style: "Apasionado, dulce y dedicado.",
      titleIdeas: ["El comienzo de lo nuestro", "Nuestra Historia de Amor"],
      callToActionIdeas: ["Revive nuestra historia", "Descubre mi amor por ti"],
      suggestedColors: "Vino profundo, dorado rosado.",
      socialMediaStyle: "Videos lentos, baladas, enfoques en los ojos y sonrisas.",
      suggestedMusic: "Baladas acústicas, piano suave.",
      suggestedVideoEditing: "Transiciones de disolución lenta, colores cálidos."
    },
    {
      name: "Familiar",
      goal: "Reforzar vínculos de sangre y hogar.",
      recommendedWords: ["Hogar", "Raíces", "Cariño", "Infinito", "Protección"],
      avoidWords: ["Pasión", "Locura", "Aventura extrema"],
      style: "Acogedor, cálido y seguro.",
      titleIdeas: ["Nuestra Familia", "El mejor refugio"],
      callToActionIdeas: ["Revive nuestros recuerdos", "Descubre nuestro álbum"],
      suggestedColors: "Terracota, beige, tonos madera.",
      socialMediaStyle: "Reels de momentos cotidianos, sonrisas genuinas.",
      suggestedMusic: "Folk acústico, guitarra alegre.",
      suggestedVideoEditing: "Transiciones de recorte rápido, ritmo alegre."
    }
  ],
  visualThemes: [
    {
      id: "romantic_elegant",
      name: "Amor Romántico",
      description: "Fondos oscuros en vino profundo, texto dorado rosado y tipografía serif de alta costura.",
      dynamicElements: ["Fondo gradiente radial", "Tarjetas estilo glassmorphism", "Bordes rosados brillantes"]
    },
    {
      id: "family_warm",
      name: "Familia Cálida",
      description: "Tonos cálidos terracota, beige y textura de álbum fotográfico.",
      dynamicElements: ["Sombras profundas", "Bordes color ámbar"]
    }
  ],
  galleryBehavior: {
    features: [
      "Desplazamiento horizontal (Swipe)",
      "Entrada con animación (Fade up)",
      "Soporte para imágenes en alta resolución adaptadas al viewport",
      "Bordes redondeados elegantes con sombras acordes al tema"
    ],
    socialMediaRepresentation: "En videos de redes sociales, el scroll debe verse fluido como si un dedo lo deslizara mágicamente, deteniéndose en las fotos clave."
  },
  videoFeature: {
    maxDuration: "3 minutos (Recomendado)",
    format: "MP4 (Optimizado H.264 para web)",
    location: "Generalmente después de la galería de fotos y antes del mensaje final.",
    playback: "Requiere toque del usuario para iniciar con sonido (políticas de navegadores).",
    mobileBehavior: "Reproductor nativo optimizado o reproductor HTML5 in-line.",
    limitations: "1 video por experiencia.",
    compression: "El backend tiene lógica para optimizar el video mediante FFmpeg si se requiere."
  },
  photosFeature: {
    maxQuantity: 5,
    recommendedSize: "1080x1920 (Vertical idealmente) o cuadrados.",
    formats: ["JPG", "PNG", "WebP"],
    features: ["Recorte CSS object-cover", "Bordes redondeados", "Optimización de carga"]
  },
  socialMediaVideoGeneration: {
    description: "Generación automática o manual de un video que recorre toda la web (la experiencia completa) de arriba a abajo, con la música de fondo.",
    differences: {
      originalVideo: "Es el clip personal (ej: saludo de feliz cumpleaños) subido por el cliente a la web.",
      fullExperienceVideo: "Es el MP4 renderizado (o capturado) de toda la web, mostrando el título, la carta, bajando por las fotos, y cerrando. Ideal para Instagram Reels."
    },
    techSpecs: [
      "Formato 9:16",
      "Resolución 1080x1920",
      "Música de fondo persistente",
      "Scroll automatizado fluido con pausas",
      "Compatible con Instagram, TikTok y WhatsApp"
    ]
  },
  commercialPlans: [
    {
      name: "Experiencia Digital",
      referencePriceCLP: 14990,
      includes: ["Página personalizada", "Código QR", "Hasta 5 fotografías", "1 video", "Carta", "URL exclusiva", "Vigencia de 3 meses"]
    },
    {
      name: "Recuerdo en Video",
      referencePriceCLP: 14990,
      includes: ["Creación de la experiencia", "Video renderizado completo", "Descarga en MP4", "Página activa 24h para revisión", "Eliminación posterior de página"]
    },
    {
      name: "Experiencia Completa",
      referencePriceCLP: 22990,
      includes: ["Página activa 3 meses", "Código QR", "Video completo para redes", "MP4 descargable", "Todas las funciones"]
    }
  ],
  renewals: {
    model: [
      "Página activa por 3 meses base.",
      "Renovación por 3 meses adicionales (Ref: $3.990 CLP).",
      "Eliminación automática y limpieza de fotos/videos tras el vencimiento."
    ],
    plans: ["3 meses", "6 meses", "12 meses"]
  },
  mariachiIntegration: {
    description: "Integración física-digital: El mariachi hace la serenata y entrega una tarjeta física con el QR. Al escanearlo, el cliente ve su sorpresa digital.",
    saleFormats: ["Regalo digital individual", "Complemento de serenata", "Pack serenata + experiencia", "Pack serenata + experiencia + video redes"],
    experienceFlow: [
      "El mariachi llega al domicilio.",
      "Realiza la serenata.",
      "Entrega una tarjeta con QR.",
      "La persona escanea.",
      "Descubre la sorpresa digital."
    ],
    referencePrices: ["Serenata Express", "Serenata + Regalo Digital", "Serenata + Regalo Digital + Video"]
  },
  operationalFlow: [
    "Cliente pregunta (WhatsApp/IG).",
    "Elige plan.",
    "Envía recursos (fotos, video, texto).",
    "Se crea la experiencia en el Panel Admin.",
    "Se revisa y publica.",
    "Se genera el QR (Tarjeta 9x9cm PDF).",
    "Se entrega la URL y QR al cliente.",
    "Se controla vencimiento."
  ],
  adminPanel: {
    structure: [
      "Dashboard (Métricas)",
      "Editor de Regalo (Configuración visual, carga de media, creación de textos)",
      "Gestor de Tarjetas QR (Modal para maquetar la tarjeta a imprimir)",
      "Descargas y Exportaciones"
    ],
    model: "Un usuario administrador crea proyectos (regalos). Cada regalo tiene su slug público y configuraciones de diseño."
  },
  technicalArchitecture: {
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
  },
  infrastructure: {
    current: [
      "Frontend hosteado en Vercel/Railway.",
      "Backend en Railway (Node.js).",
      "Archivos en disco local (temporal o persistente según el host)."
    ],
    recommendations: [
      "Migrar almacenamiento de fotos y videos a AWS S3 o Supabase Storage para persistencia real.",
      "Ejecutar los renderizados de video con Playwright/Remotion en un worker serverless separado para no bloquear la API."
    ]
  },
  faq: [
    { question: "¿Necesito instalar una aplicación?", answer: "No, todo funciona directamente desde el navegador de tu celular escaneando el código QR." },
    { question: "¿Funciona en iPhone y Android?", answer: "Sí, es 100% compatible con cualquier celular moderno que tenga cámara y navegador web." },
    { question: "¿Cuántas fotos puedo subir?", answer: "Recomendamos hasta 5 fotos para mantener la fluidez de la experiencia." },
    { question: "¿Cuánto puede durar el video?", answer: "Máximo 3 minutos de duración para optimizar los tiempos de carga." },
    { question: "¿Cuánto tiempo estará disponible?", answer: "Por defecto 3 meses, pero puedes adquirir renovaciones por 3, 6 o 12 meses." }
  ],
  commercialMessages: [
    {
      type: "Mensaje de bienvenida",
      content: "¡Hola! Qué lindo que quieras sorprender a esa persona especial. Hacemos experiencias digitales únicas a través de Códigos QR..."
    },
    {
      type: "Bio de Instagram",
      content: "Regalos que emocionan 💫\nExperiencias digitales personalizadas en un código QR 📱\nInmortaliza tus recuerdos 👇"
    }
  ],
  socialMediaIdeas: [
    {
      category: "Reacciones",
      title: "Lloró al ver su regalo",
      goal: "Mostrar el impacto emocional real de la experiencia.",
      hook: "¿No sabes qué regalarle? Mira la reacción de...",
      format: "Reel / TikTok",
      duration: "15-20s",
      scenes: "Split screen: Arriba la persona escaneando y emocionándose. Abajo, el scroll de la web.",
      onScreenText: "El regalo que la hizo llorar de emoción 🥺",
      voiceOver: "Buscaba algo único, y encontró esto...",
      cta: "Pide el tuyo en el link del perfil.",
      description: "No regalamos solo tecnología, regalamos momentos eternos. ✨ #Sorpresa #RegaloOriginal",
      hashtags: "#RegaloOriginal #Sorpresa #Amor"
    }
  ],
  brandVoice: {
    traits: ["Emotiva", "Cercana", "Humana", "Elegante", "Clara"],
    avoidTraits: ["Exageradamente técnica", "Infantil (salvo ocasión específica)", "Manipuladora"],
    avoidPhrases: ["Una experiencia inolvidable", "Un recuerdo para siempre", "Sorprende a esa persona especial"]
  },
  aiGuidelines: [
    "No inventar funciones que no estén documentadas aquí.",
    "No cambiar precios de los planes (usar referencia).",
    "No prometer disponibilidad indefinida de los regalos (explicar que hay renovaciones).",
    "No usar datos de clientes reales ni información privada en los ejemplos.",
    "Mantener coherencia con el tono emocional del cliente.",
    "Separar claramente el producto digital del servicio de Mariachis."
  ],
  implementationStatus: [
    { feature: "Creación de proyectos y URLs (slugs)", status: "Implementada", priority: "Alta", relatedFiles: "projectsRouter.ts, ProjectEditor.tsx" },
    { feature: "Carga de fotos y videos", status: "Implementada", priority: "Alta", relatedFiles: "mediaRouter.ts, MediaUploader.tsx" },
    { feature: "Generación de QR y descarga en PDF", status: "Implementada", priority: "Alta", relatedFiles: "qrRouter.ts, QrAndCardModal.tsx" },
    { feature: "Reproductor de Video con Descarga", status: "Implementada", priority: "Alta", relatedFiles: "VideoSection.tsx, projectsRouter.ts" },
    { feature: "Editor Canva Drag&Drop", status: "Implementada", priority: "Alta", relatedFiles: "CardCanvasEditor.tsx" },
    { feature: "Base de Datos en Supabase real", status: "Pendiente", priority: "Alta", relatedFiles: "db.ts" },
    { feature: "Generación automática del Video de la Experiencia (MP4 del scroll)", status: "Pendiente", priority: "Alta", relatedFiles: "videoExportService.ts" }
  ]
};
