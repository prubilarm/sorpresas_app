export const productData = {
  summary: "Se vende una experiencia digital personalizada que combina fotografías, mensajes, fechas, video, música, animaciones y recuerdos para regalar.",
  problemSolved: "Resuelve la necesidad de entregar un regalo con alto impacto emocional, original y perdurable, superando las limitaciones de los regalos físicos convencionales.",
  whatCustomerReceives: "El cliente recibe una página web única y personalizada, un código QR físico/digital para acceder a ella, y opcionalmente un video renderizado de la experiencia para redes sociales.",
  howItWorks: "El cliente compra, envía sus archivos (fotos/video/textos), nosotros armamos la experiencia, le entregamos un QR, y al escanearlo, el destinatario vive la experiencia interactiva.",
  differentiator: "No es una simple galería ni un video estático. Es un viaje interactivo con música, scroll guiado, mensajes que aparecen secuencialmente y un diseño elegante adaptado al tipo de relación.",
  emotionalGoal: "Provocar sorpresa, lágrimas de alegría, nostalgia, amor y una profunda conexión emocional.",
  valueProposition: "Transformar recuerdos digitales sueltos en una obra de arte interactiva, empaquetada como un regalo de lujo accesible a través de un simple código QR.",
  whatItIsNot: "No es simplemente una página web estática. No es solo un código QR. No es un álbum de fotos genérico."
};

export const brandingData = {
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
};

export const audiencesData = {
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
};

export const experienceStructureData = {
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
};

export const relationshipsData = {
  types: [
    "Pareja", "Esposo/a", "Novio/a", "Mamá", "Papá", "Hijo/a", "Abuelos", "Amigos", 
    "Familia", "Compañeros", "Profesor", "Homenaje", "En Memoria"
  ],
  impact: "El tipo de relación afecta la selección del tema visual, el tono de los textos por defecto, y sugiere una música acorde (ej: romance vs gratitud profesional)."
};

export const occasionsData = {
  types: [
    "Aniversario", "Cumpleaños", "Día de la Madre", "Día del Padre", "Día de los Abuelos",
    "Nacimiento", "Graduación", "Matrimonio", "Propuesta de matrimonio", "San Valentín",
    "Navidad", "Agradecimiento", "Homenaje", "Fecha especial", "Sorpresa sin ocasión"
  ],
  impact: "Determina la plantilla, el texto del contador (ej: 'Feliz Cumpleaños' vs 'Tiempo Juntos'), y los mensajes sugeridos."
};
