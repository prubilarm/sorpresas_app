import { ProductKnowledge } from './types';
import { productData, brandingData, audiencesData, experienceStructureData, relationshipsData, occasionsData } from './product';
import { technicalArchitectureData, infrastructureData, adminPanelData, implementationStatusData } from './architecture';
import { commercialPlansData, renewalsData, mariachiIntegrationData, operationalFlowData, faqData, commercialMessagesData, brandVoiceData, aiGuidelinesData } from './marketing';
import { useCasesData } from './use-cases';

// Default static features as they were defined initially
const emotionalTonesData = [
  {
    name: "Romántico", goal: "Enamorar y conmover profundamente a la pareja.",
    recommendedWords: ["Amor", "Siempre", "Juntos", "Corazón", "Magia", "Destino"],
    avoidWords: ["Compañero", "Simpático", "Útil"], style: "Apasionado, dulce y dedicado.",
    titleIdeas: ["El comienzo de lo nuestro", "Nuestra Historia de Amor"],
    callToActionIdeas: ["Revive nuestra historia", "Descubre mi amor por ti"],
    suggestedColors: "Vino profundo, dorado rosado.",
    socialMediaStyle: "Videos lentos, baladas, enfoques en los ojos y sonrisas.",
    suggestedMusic: "Baladas acústicas, piano suave.",
    suggestedVideoEditing: "Transiciones de disolución lenta, colores cálidos."
  },
  {
    name: "Familiar", goal: "Reforzar vínculos de sangre y hogar.",
    recommendedWords: ["Hogar", "Raíces", "Cariño", "Infinito", "Protección"],
    avoidWords: ["Pasión", "Locura", "Aventura extrema"], style: "Acogedor, cálido y seguro.",
    titleIdeas: ["Nuestra Familia", "El mejor refugio"],
    callToActionIdeas: ["Revive nuestros recuerdos", "Descubre nuestro álbum"],
    suggestedColors: "Terracota, beige, tonos madera.",
    socialMediaStyle: "Reels de momentos cotidianos, sonrisas genuinas.",
    suggestedMusic: "Folk acústico, guitarra alegre.",
    suggestedVideoEditing: "Transiciones de recorte rápido, ritmo alegre."
  }
];

const visualThemesData = [
  { id: "romantic_elegant", name: "Amor Romántico", description: "Fondos oscuros en vino profundo, texto dorado rosado y tipografía serif de alta costura.", dynamicElements: ["Fondo gradiente radial", "Tarjetas estilo glassmorphism", "Bordes rosados brillantes"] },
  { id: "family_warm", name: "Familia Cálida", description: "Tonos cálidos terracota, beige y textura de álbum fotográfico.", dynamicElements: ["Sombras profundas", "Bordes color ámbar"] }
];

const galleryBehaviorData = {
  features: ["Desplazamiento horizontal (Swipe)", "Entrada con animación (Fade up)", "Soporte para imágenes en alta resolución adaptadas al viewport", "Bordes redondeados elegantes con sombras acordes al tema"],
  socialMediaRepresentation: "En videos de redes sociales, el scroll debe verse fluido como si un dedo lo deslizara mágicamente, deteniéndose en las fotos clave."
};

const videoFeatureData = { maxDuration: "3 minutos (Recomendado)", format: "MP4 (Optimizado H.264 para web)", location: "Generalmente después de la galería de fotos y antes del mensaje final.", playback: "Requiere toque del usuario para iniciar con sonido (políticas de navegadores).", mobileBehavior: "Reproductor nativo optimizado o reproductor HTML5 in-line.", limitations: "1 video por experiencia.", compression: "El backend tiene lógica para optimizar el video mediante FFmpeg si se requiere." };

const photosFeatureData = { maxQuantity: 5, recommendedSize: "1080x1920 (Vertical idealmente) o cuadrados.", formats: ["JPG", "PNG", "WebP"], features: ["Recorte CSS object-cover", "Bordes redondeados", "Optimización de carga"] };

const socialMediaVideoGenerationData = {
  description: "Generación automática o manual de un video que recorre toda la web (la experiencia completa) de arriba a abajo, con la música de fondo.",
  differences: { originalVideo: "Es el clip personal subido por el cliente.", fullExperienceVideo: "Es el MP4 renderizado de toda la web. Ideal para Instagram Reels." },
  techSpecs: ["Formato 9:16", "Resolución 1080x1920", "Música de fondo persistente", "Scroll automatizado fluido", "Compatible con RRSS"]
};

export const knowledgeBase: ProductKnowledge = {
  lastUpdated: new Date().toISOString(),
  product: productData,
  branding: brandingData,
  audiences: audiencesData,
  experienceStructure: experienceStructureData,
  relationships: relationshipsData,
  occasions: occasionsData,
  emotionalTones: emotionalTonesData,
  visualThemes: visualThemesData,
  galleryBehavior: galleryBehaviorData,
  videoFeature: videoFeatureData,
  photosFeature: photosFeatureData,
  socialMediaVideoGeneration: socialMediaVideoGenerationData,
  commercialPlans: commercialPlansData,
  renewals: renewalsData,
  mariachiIntegration: mariachiIntegrationData,
  operationalFlow: operationalFlowData,
  adminPanel: adminPanelData,
  technicalArchitecture: technicalArchitectureData,
  infrastructure: infrastructureData,
  faq: faqData,
  commercialMessages: commercialMessagesData,
  brandVoice: brandVoiceData,
  aiGuidelines: aiGuidelinesData,
  implementationStatus: [...implementationStatusData],
  useCases: useCasesData
};
