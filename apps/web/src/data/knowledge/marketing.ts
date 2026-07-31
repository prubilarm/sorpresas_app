export const commercialPlansData = [
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
];

export const renewalsData = {
  model: [
    "Página activa por 3 meses base.",
    "Renovación por 3 meses adicionales (Ref: $3.990 CLP).",
    "Eliminación automática y limpieza de fotos/videos tras el vencimiento."
  ],
  plans: ["3 meses", "6 meses", "12 meses"]
};

export const mariachiIntegrationData = {
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
};

export const operationalFlowData = [
  "Cliente pregunta (WhatsApp/IG).",
  "Elige plan.",
  "Envía recursos (fotos, video, texto).",
  "Se crea la experiencia en el Panel Admin.",
  "Se revisa y publica.",
  "Se genera el QR (Tarjeta 9x9cm PDF).",
  "Se entrega la URL y QR al cliente.",
  "Se controla vencimiento."
];

export const faqData = [
  { question: "¿Necesito instalar una aplicación?", answer: "No, todo funciona directamente desde el navegador de tu celular escaneando el código QR." },
  { question: "¿Funciona en iPhone y Android?", answer: "Sí, es 100% compatible con cualquier celular moderno que tenga cámara y navegador web." },
  { question: "¿Cuántas fotos puedo subir?", answer: "Recomendamos hasta 5 fotos para mantener la fluidez de la experiencia." },
  { question: "¿Cuánto puede durar el video?", answer: "Máximo 3 minutos de duración para optimizar los tiempos de carga." },
  { question: "¿Cuánto tiempo estará disponible?", answer: "Por defecto 3 meses, pero puedes adquirir renovaciones por 3, 6 o 12 meses." }
];

export const commercialMessagesData = [
  {
    type: "Mensaje de bienvenida",
    content: "¡Hola! Qué lindo que quieras sorprender a esa persona especial. Hacemos experiencias digitales únicas a través de Códigos QR..."
  },
  {
    type: "Bio de Instagram",
    content: "Regalos que emocionan 💫\nExperiencias digitales personalizadas en un código QR 📱\nInmortaliza tus recuerdos 👇"
  }
];

export const brandVoiceData = {
  traits: ["Emotiva", "Cercana", "Humana", "Elegante", "Clara"],
  avoidTraits: ["Exageradamente técnica", "Infantil (salvo ocasión específica)", "Manipuladora"],
  avoidPhrases: ["Una experiencia inolvidable", "Un recuerdo para siempre", "Sorprende a esa persona especial"]
};

export const aiGuidelinesData = [
  "No inventar funciones que no estén documentadas aquí.",
  "No cambiar precios de los planes (usar referencia).",
  "No prometer disponibilidad indefinida de los regalos (explicar que hay renovaciones).",
  "No usar datos de clientes reales ni información privada en los ejemplos.",
  "Mantener coherencia con el tono emocional del cliente.",
  "Separar claramente el producto digital del servicio de Mariachis."
];
