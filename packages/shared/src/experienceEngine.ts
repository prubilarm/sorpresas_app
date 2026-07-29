import {
  RelationshipType,
  OccasionType,
  EmotionalTone,
  ThemeId,
  CounterDisplayMode,
  SectionType,
} from './types';
import { THEMES, ThemeConfig } from './themes';

export type IconType =
  | 'heart'
  | 'star'
  | 'cake'
  | 'home'
  | 'trophy'
  | 'smile'
  | 'ribbon'
  | 'sparkles'
  | 'feather'
  | 'sun'
  | 'flower';

export type ParticleType = 'hearts' | 'stars' | 'confetti' | 'sparkles' | 'leaves' | 'none';

export type PhotoFrameVariant = 'polaroid' | 'scrapbook' | 'classic' | 'modern_clean' | 'soft_rounded';

export interface ResolvedExperience {
  theme: ThemeConfig;
  primaryIcon: IconType;
  particleType: ParticleType;
  particleSpeed: 'slow' | 'medium' | 'fast';
  startScreen: {
    kicker: string;
    title: string;
    subtitle: string;
    buttonText: string;
    icon: IconType;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  counter: {
    title: string;
    footer: string;
    displayMode: CounterDisplayMode;
    icon: IconType;
  };
  letter: {
    heading: string;
    title: string;
    defaultSignature: string;
    defaultContent: string[];
  };
  photos: {
    title: string;
    subtitle: string;
    frameVariant: PhotoFrameVariant;
    tiltEffect: boolean;
  };
  video: {
    title: string;
    intro: string;
    buttonText: string;
    warningText: string;
    caption: string;
  };
  finalMessage: {
    title: string;
    message: string;
    signature: string;
  };
  suggestedSections: SectionType[];
}

export function resolveGiftExperience(params: {
  senderName?: string;
  recipientName?: string;
  finalSignature?: string;
  relationshipType?: RelationshipType;
  customRelationship?: string;
  occasionType?: OccasionType;
  customOccasion?: string;
  emotionalTone?: EmotionalTone;
  templateId?: ThemeId;
}): ResolvedExperience {
  const sender = params.senderName || 'Remitente';
  const recipient = params.recipientName || 'Destinatario';
  const rel = params.relationshipType || 'couple';
  const occ = params.occasionType || 'anniversary';
  const tone = params.emotionalTone || 'romantic';
  const tmpl = params.templateId || 'romantic_elegant';

  // Base Theme
  let baseTheme = THEMES[tmpl] || THEMES.romantic_elegant;

  // 1. RESOLVE TONE-SPECIFIC STYLING OVERRIDES (Palettes, fonts, buttons, gradients)
  let resolvedTheme: ThemeConfig = { ...baseTheme };

  if (tone === 'funny') {
    resolvedTheme = {
      ...resolvedTheme,
      bgGradient: 'linear-gradient(165deg, #181c2b 0%, #101422 45%, #080a12 100%)',
      cardBg: 'linear-gradient(145deg, rgba(30,36,56,0.92), rgba(16,20,34,0.97))',
      cardBorder: 'rgba(251,191,36,0.35)',
      cardShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 20px rgba(251,191,36,0.15)',
      textColor: '#fef3c7',
      titleColor: '#fbbf24',
      accentColor: '#f59e0b',
      kickerColor: '#fcd34d',
      fontTitle: '"Outfit", system-ui, sans-serif',
      fontBody: '"Inter", system-ui, sans-serif',
      buttonStyle: 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 font-black shadow-xl shadow-amber-950/70 hover:scale-105 active:scale-95 rounded-2xl',
      counterBg: 'linear-gradient(135deg, rgba(35,42,65,0.85), rgba(14,18,30,0.95))',
      counterNumberColor: '#fef08a',
      counterLabelColor: '#f59e0b',
      dividerColor: 'rgba(251,191,36,0.25)',
      glowColor: 'rgba(245,158,11,0.25)',
    };
  } else if (tone === 'childish') {
    resolvedTheme = {
      ...resolvedTheme,
      bgGradient: 'radial-gradient(ellipse at 50% 0%, #1e293b 0%, #0f172a 55%, #020617 100%)',
      cardBg: 'linear-gradient(145deg, rgba(30,41,59,0.92), rgba(15,23,42,0.97))',
      cardBorder: 'rgba(125,211,252,0.35)',
      cardShadow: '0 25px 60px rgba(0,0,0,0.65)',
      textColor: '#f0f9ff',
      titleColor: '#38bdf8',
      accentColor: '#0284c7',
      kickerColor: '#7dd3fc',
      fontTitle: '"Fredoka", "Outfit", system-ui, sans-serif',
      fontBody: '"Inter", system-ui, sans-serif',
      buttonStyle: 'bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 text-white font-bold shadow-xl shadow-sky-950/70 hover:scale-105 active:scale-95 rounded-full',
      counterBg: 'linear-gradient(135deg, rgba(30,41,59,0.85), rgba(15,23,42,0.95))',
      counterNumberColor: '#bae6fd',
      counterLabelColor: '#38bdf8',
      dividerColor: 'rgba(125,211,252,0.25)',
      glowColor: 'rgba(56,189,248,0.22)',
    };
  } else if (tone === 'solemn' || tone === 'nostalgic') {
    resolvedTheme = {
      ...resolvedTheme,
      bgGradient: 'linear-gradient(160deg, #18181b 0%, #09090b 50%, #020202 100%)',
      cardBg: 'linear-gradient(145deg, rgba(39,39,42,0.9), rgba(18,18,20,0.97))',
      cardBorder: 'rgba(226,232,240,0.18)',
      cardShadow: '0 30px 75px rgba(0,0,0,0.9)',
      textColor: '#f1f5f9',
      titleColor: '#ffffff',
      accentColor: '#cbd5e1',
      kickerColor: '#94a3b8',
      fontTitle: '"Cormorant Garamond", Georgia, serif',
      fontBody: '"Inter", system-ui, sans-serif',
      buttonStyle: 'bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 font-semibold rounded-xl transition',
      counterBg: 'linear-gradient(135deg, rgba(39,39,42,0.85), rgba(18,18,20,0.95))',
      counterNumberColor: '#ffffff',
      counterLabelColor: '#94a3b8',
      dividerColor: 'rgba(226,232,240,0.18)',
      glowColor: 'rgba(255,255,255,0.08)',
    };
  } else if (tone === 'family') {
    resolvedTheme = {
      ...resolvedTheme,
      bgGradient: 'linear-gradient(165deg, #2b1a10 0%, #1a0f08 50%, #0c0603 100%)',
      cardBg: 'linear-gradient(145deg, rgba(62,37,21,0.92), rgba(30,17,9,0.97))',
      cardBorder: 'rgba(249,115,22,0.25)',
      textColor: '#ffedd5',
      titleColor: '#f97316',
      accentColor: '#ea580c',
      kickerColor: '#fdba74',
      fontTitle: '"Georgia", serif',
      fontBody: '"Inter", system-ui, sans-serif',
      buttonStyle: 'bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white font-bold shadow-lg shadow-orange-950/70 hover:scale-105 active:scale-95 rounded-2xl',
      counterBg: 'linear-gradient(135deg, rgba(62,37,21,0.85), rgba(30,17,9,0.95))',
      counterNumberColor: '#fed7aa',
      counterLabelColor: '#f97316',
      dividerColor: 'rgba(249,115,22,0.22)',
      glowColor: 'rgba(234,88,12,0.2)',
    };
  } else if (tone === 'joyful' || tone === 'inspiring') {
    resolvedTheme = {
      ...resolvedTheme,
      bgGradient: 'radial-gradient(ellipse at 50% 0%, #1e1b4b 0%, #0f0e2b 55%, #050514 100%)',
      cardBg: 'linear-gradient(145deg, rgba(49,46,129,0.9), rgba(19,18,60,0.96))',
      cardBorder: 'rgba(165,180,252,0.3)',
      textColor: '#e0e7ff',
      titleColor: '#818cf8',
      accentColor: '#6366f1',
      kickerColor: '#c7d2fe',
      fontTitle: '"Outfit", system-ui, sans-serif',
      fontBody: '"Inter", system-ui, sans-serif',
      buttonStyle: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-xl shadow-indigo-950/80 hover:scale-105 active:scale-95 rounded-2xl',
      counterBg: 'linear-gradient(135deg, rgba(49,46,129,0.85), rgba(19,18,60,0.95))',
      counterNumberColor: '#e0e7ff',
      counterLabelColor: '#818cf8',
      dividerColor: 'rgba(165,180,252,0.25)',
      glowColor: 'rgba(99,102,241,0.25)',
    };
  }

  // 2. PRIMARY ICON RESOLUTION
  let primaryIcon: IconType = 'heart';
  if (occ === 'birthday') primaryIcon = 'cake';
  else if (occ === 'graduation' || occ === 'personal_achievement') primaryIcon = 'trophy';
  else if (occ === 'mothers_day' || occ === 'fathers_day' || rel.includes('mother') || rel.includes('father') || rel.includes('parents')) primaryIcon = 'home';
  else if (occ === 'in_memory' || occ === 'tribute' || rel === 'in_memory' || rel === 'tribute') primaryIcon = 'feather';
  else if (tone === 'childish') primaryIcon = 'star';
  else if (tone === 'funny' || rel.includes('friend')) primaryIcon = 'smile';
  else if (rel.includes('teacher') || rel === 'professional_gratitude' || occ === 'gratitude') primaryIcon = 'sun';
  else if (tone === 'family') primaryIcon = 'home';
  else if (tone === 'joyful' || tone === 'inspiring') primaryIcon = 'sparkles';

  // 3. PARTICLE TYPE RESOLUTION
  let particleType: ParticleType = 'hearts';
  let particleSpeed: 'slow' | 'medium' | 'fast' = 'medium';

  if (tone === 'funny' || tone === 'joyful' || occ === 'birthday' || occ === 'graduation') {
    particleType = 'confetti';
    particleSpeed = 'fast';
  } else if (tone === 'childish') {
    particleType = 'stars';
    particleSpeed = 'slow';
  } else if (tone === 'family' || rel.includes('mother') || rel.includes('father')) {
    particleType = 'leaves';
    particleSpeed = 'slow';
  } else if (tone === 'solemn' || tone === 'nostalgic' || occ === 'in_memory' || occ === 'tribute') {
    particleType = 'none';
    particleSpeed = 'slow';
  } else if (tone === 'inspiring' || tone === 'elegant' || tone === 'grateful') {
    particleType = 'sparkles';
    particleSpeed = 'slow';
  } else if (tone === 'romantic' || rel === 'couple' || occ === 'anniversary' || occ === 'valentines') {
    particleType = 'hearts';
    particleSpeed = 'medium';
  } else {
    particleType = 'sparkles';
  }

  // 4. PHOTO FRAME & TILT VARIANT RESOLUTION
  let frameVariant: PhotoFrameVariant = 'classic';
  let tiltEffect = false;

  if (tone === 'funny' || rel.includes('friend') || occ === 'friendship') {
    frameVariant = 'scrapbook';
    tiltEffect = true;
  } else if (tone === 'nostalgic' || tmpl === 'polaroid') {
    frameVariant = 'polaroid';
    tiltEffect = true;
  } else if (tone === 'childish') {
    frameVariant = 'soft_rounded';
    tiltEffect = false;
  } else if (tone === 'elegant' || tmpl === 'minimalist' || tone === 'solemn') {
    frameVariant = 'modern_clean';
    tiltEffect = false;
  } else if (tone === 'family') {
    frameVariant = 'classic';
    tiltEffect = false;
  }

  // 5. TEXT RESOLUTION HIERARCHY (Level 1 Occasion + Level 2 Relation + Level 3 Tone)
  let startKicker = 'Un detalle hecho con cariño';
  let startTitle = `Una historia especial`;
  let startSubtitle = `De: ${sender} → Para: ${recipient}`;
  let startButton = 'Toca para comenzar';

  let heroKicker = 'Una historia especial';
  let heroTitle = `Un detalle pensado para ti`;
  let heroSubtitle = `De parte de ${sender} para ${recipient}`;

  let counterTitle = `Desde aquel día han pasado`;
  let counterFooter = `y cada momento sigue siendo inolvidable.`;
  let counterDisplayMode: CounterDisplayMode = 'elapsed_time';

  let letterHeading = `De ${sender} para ${recipient}`;
  let letterTitle = `Para ti, ${recipient}`;
  let defaultSignature = params.finalSignature || `Con todo mi cariño, ${sender}`;
  let letterContent = [
    `Hay personas que iluminan nuestra vida de una forma única, y tú eres una de ellas.`,
    `Este detalle fue preparado con mucho cariño para celebrar todos los momentos que compartimos y los que vendrán.`,
  ];

  let photosTitle = 'Fotografías y Recuerdos';
  let photosSubtitle = 'Momentos especiales guardados para siempre';

  let videoTitle = 'Un mensaje especial en video';
  let videoIntro = 'Tengo una sorpresa guardada en video para ti. Presiona el botón para descubrirla.';
  let videoButtonText = 'Pulsa aquí para ver el video ✨';
  let videoWarningText = '⚠️ ADVERTENCIA: Video con un mensaje especial preparado para ti... ¿Deseas continuar?';
  let videoCaption = 'Un recuerdo en movimiento preparado especialmente para ti.';

  let finalTitle = 'Gracias por estar';
  let finalSubtitle = 'Con todo nuestro cariño siempre.';

  // SPECIFIC CUSTOMIZATION SCENARIOS:

  // Scenario A: Mother's Day / Son to Mother / Daughter to Mother
  if (occ === 'mothers_day' || rel.includes('mother') || rel === 'daughter_to_mother' || rel === 'son_to_mother') {
    startKicker = 'Gracias por estar siempre';
    startTitle = tone === 'funny' ? '¡Feliz día a la mejor mamá!' : 'Para la mejor Mamá del mundo';
    startSubtitle = `Con todo el amor de ${sender}`;
    startButton = 'Toca para descubrir tu regalo';

    heroKicker = 'Homenaje a Mamá';
    heroTitle = tone === 'funny' ? '¡Hoy celebramos a alguien increíble!' : 'Gracias por estar siempre, Mamá';
    heroSubtitle = `Un detalle preparado con profundo amor por ${sender}`;

    counterTitle = `Desde que nos acompañas han pasado`;
    counterFooter = `y tu amor sigue siendo nuestra mayor guía.`;
    counterDisplayMode = 'elapsed_time';

    letterHeading = `Te queremos, Mamá`;
    letterTitle = `Todo lo que aprendí de ti`;
    letterContent = [
      `Gracias por tu paciencia incondicional, por tus abrazos de refugio y por enseñarme el valor de las cosas hechas con el corazón.`,
      `Ver crecer nuestra familia a tu lado es el regalo más hermoso que la vida nos ha dado. Gracias por cada sonrisa y por estar siempre ahí.`,
    ];

    photosTitle = 'Recuerdos junto a Mamá';
    photosSubtitle = 'Momentos imborrables que guardamos en el corazón';

    videoTitle = 'Un video dedicado a Mamá';
    videoIntro = 'Mamá, preparé un recuerdo especial en video para ti.';
    videoButtonText = 'Ver video para Mamá 💖';
    videoWarningText = '⚠️ ADVERTENCIA: Prepara pañuelos... este video puede causar emoción profunda.';

    finalTitle = 'Para siempre en nuestro corazón';
    finalSubtitle = 'Gracias por tu amor, tu paciencia y todo lo que haces por nosotros.';
  }
  // Scenario B: Father's Day / Son or Daughter to Father
  else if (occ === 'fathers_day' || rel.includes('father') || rel === 'daughter_to_father' || rel === 'son_to_father') {
    startKicker = 'Gracias por tu ejemplo';
    startTitle = 'Para el mejor Papá';
    startSubtitle = `De: ${sender} → Para: ${recipient}`;

    heroKicker = 'Un ejemplo de vida';
    heroTitle = 'Gracias por enseñarme el camino, Papá';
    heroSubtitle = `Un recuerdo especial dedicado con admiración por ${sender}`;

    counterTitle = `Compartiendo este camino han pasado`;
    counterFooter = `y tus enseñanzas permanecen intactas.`;

    letterHeading = `Con admiración y respeto`;
    letterTitle = `Tus enseñanzas nos acompañarán siempre`;
    letterContent = [
      `Tus consejos, tu ejemplo de trabajo y tu apoyo constante son el faro que nos acompaña cada día.`,
      `Gracias por tus risas, por tus palabras en el momento justo y por estar presente en cada paso del camino.`,
    ];

    photosTitle = 'Momentos con Papá';
    photosSubtitle = 'Historias y risas compartidas';

    finalTitle = 'Siempre nuestro orgullo';
    finalSubtitle = 'Tus enseñanzas y tu ejemplo nos acompañarán siempre.';
  }
  // Scenario C: Birthday
  else if (occ === 'birthday') {
    if (tone === 'funny') {
      startKicker = '¡Atención! Hoy es un día épico';
      startTitle = `¡Feliz Cumpleaños, ${recipient}! 🎉`;
      startSubtitle = `De: ${sender} → Para: ${recipient}`;
      startButton = '¡Abrir sorpresas!';

      heroKicker = '¡Hoy se celebra fuerte!';
      heroTitle = `¡Hoy celebramos a alguien increíble!`;
      heroSubtitle = `Que nunca falten las risas, las aventuras y las buenas historias para ${recipient}.`;

      counterTitle = `Acumulando momentos divertidos durante`;
      counterFooter = `y que vengan muchos años más de risas.`;

      letterHeading = `¡Salud por ti!`;
      letterTitle = `Que nunca falten las risas`;
      letterContent = [
        `¡Feliz cumpleaños! Que este nuevo año de vida venga cargado de proyectos geniales, viajes inolvidables y momentos inolvidables.`,
        `Gracias por tu energía, por tus locuras y por hacer la vida mucho más entretenida.`,
      ];

      photosTitle = 'Momentos divertidos e inolvidables';
      photosSubtitle = 'Risas, viajes y locuras guardadas para la historia';

      finalTitle = '¡Que sea un año espectacular!';
      finalSubtitle = 'Que nunca falten las risas, las aventuras y las buenas historias.';
    } else if (tone === 'childish') {
      startKicker = '¡Hoy es un día mágico!';
      startTitle = `¡Feliz cumpleaños, ${recipient}! ⭐`;
      startSubtitle = `Con todo el amor de ${sender}`;

      heroKicker = '¡Un día lleno de magia!';
      heroTitle = `¡Feliz cumpleaños, mi pequeña estrella!`;
      heroSubtitle = `Todo el amor y la ilusión del mundo para ti.`;

      counterTitle = `Iluminando nuestro hogar durante`;
      counterFooter = `y nuestro amor por ti crece cada día más.`;

      letterHeading = `Eres nuestra mayor alegría`;
      letterTitle = `Un deseo mágico para ti`;
      letterContent = [
        `Desde el primer día en que llegaste a nuestras vidas, el mundo se llenó de colores, risas y ternura.`,
        `Queremos que nunca dejes de soñar y que sepas que siempre estaremos a tu lado para cuidarte.`,
      ];

      photosTitle = 'Tus momentos más dulces';
      photosSubtitle = 'Sonrisas y juegos inolvidables';

      finalTitle = '¡Sigue brillando siempre!';
      finalSubtitle = 'Verte crecer ha sido uno de los regalos más grandes de nuestra vida.';
    } else {
      startKicker = 'Hoy celebramos tu vida';
      startTitle = `¡Feliz Cumpleaños, ${recipient}!`;
      startSubtitle = `De: ${sender} → Para: ${recipient}`;

      heroKicker = 'Un año más de recuerdos';
      heroTitle = `Hoy celebramos tu vida, ${recipient}`;
      heroSubtitle = `Un detalle preparado con todo el cariño de ${sender}`;

      counterTitle = `Celebrando tu vida durante`;
      counterFooter = `y que este nuevo año esté lleno de momentos felices.`;

      letterHeading = `Felicidades en tu día`;
      letterTitle = `Todo lo que te hace único`;
      letterContent = [
        `En este día tan especial queremos recordarte lo valioso que eres para todos quienes te rodeamos.`,
        `Que este nuevo año traiga salud, alegrías y la concreción de todos tus sueños.`,
      ];

      finalTitle = '¡Feliz cumpleaños!';
      finalSubtitle = 'Que este nuevo año de vida supere todas tus expectativas.';
    }
  }
  // Scenario D: Graduation / Personal Achievement
  else if (occ === 'graduation' || occ === 'personal_achievement') {
    startKicker = '¡El esfuerzo valió la pena!';
    startTitle = `¡Lo lograste, ${recipient}! 🎓`;
    startSubtitle = `Orgullo de: ${sender}`;
    startButton = 'Ver celebración de logro';

    heroKicker = 'Un logro inolvidable';
    heroTitle = `¡Una historia llena de esfuerzo y superación!`;
    heroSubtitle = `Celebrando el gran éxito de ${recipient}`;

    counterTitle = `El camino de preparación duró`;
    counterFooter = `hoy se convierte en este gran triunfo.`;
    counterDisplayMode = 'countdown';

    letterHeading = `Orgullo y admiración`;
    letterTitle = `El camino recorrido`;
    letterContent = [
      `Hoy se corona una etapa de gran dedicación, trasnoches y perseverancia. Verte alcanzar este objetivo nos llena de profunda alegría.`,
      `Que este logro sea solo el primer peldaño de una carrera llena de éxitos y satisfacciones. ¡Felicitaciones!`,
    ];

    photosTitle = 'El camino hacia la meta';
    photosSubtitle = 'Fotografías del proceso y la gran celebración';

    videoTitle = 'Un mensaje de felicitación en video';
    videoIntro = 'Preparé un video con las palabras de todos quienes estamos orgullosos de ti.';

    finalTitle = 'Llegaste hasta aquí';
    finalSubtitle = 'Ahora comienza una nueva historia llena de grandes triunfos.';
  }
  // Scenario E: Tribute / In Memory / Solemn
  else if (occ === 'in_memory' || occ === 'tribute' || rel === 'in_memory' || rel === 'tribute' || tone === 'solemn') {
    startKicker = 'Una vida que dejó huellas';
    startTitle = `En homenaje a ${recipient}`;
    startSubtitle = `Con el respeto de: ${sender}`;
    startButton = 'Ver homenaje de vida';

    heroKicker = 'Homenaje & Memoria';
    heroTitle = `Una vida que dejó huellas imborrables`;
    heroSubtitle = `Un espacio de recuerdo y afecto dedicado a ${recipient}`;

    counterTitle = `Su legado permanece con nosotros desde hace`;
    counterFooter = `y su recuerdo vivirá para siempre en nuestros corazones.`;
    counterDisplayMode = 'show_date_only';

    letterHeading = `Su legado permanece`;
    letterTitle = `Recuerdos que permanecerán`;
    letterContent = [
      `Hay huellas que el tiempo jamás podrá borrar. Tu generosidad, tu ejemplo y la luz de tu presencia seguirán acompañándonos.`,
      `Guardamos con profundo respeto y amor cada instante compartido, honrando tu memoria en cada paso que damos.`,
    ];

    photosTitle = 'Imágenes que honran su historia';
    photosSubtitle = 'Recuerdos imborrables compartidos en familia';

    videoTitle = 'Homenaje en video';
    videoIntro = 'Un testimonio en imágenes para recordar una trayectoria de vida noble.';

    finalTitle = 'Siempre presente en nosotros';
    finalSubtitle = 'Los recuerdos y el cariño permanecerán para siempre.';
  }
  // Scenario F: Friendship
  else if (rel.includes('friend') || occ === 'friendship') {
    startKicker = 'Una historia de amistad real';
    startTitle = `Aventuras de ${sender} & ${recipient}`;
    startSubtitle = `Para ${recipient}, de tu gran amigo(a) ${sender}`;

    heroKicker = 'Amistad incondicional';
    heroTitle = `¡Una historia llena de momentos inolvidables!`;
    heroSubtitle = `Gracias por cada risa, cada consejo y cada aventura compartida.`;

    counterTitle = `Nuestra historia de amistad comenzó hace`;
    counterFooter = `y las mejores aventuras aún están por escribirse.`;

    letterHeading = `Gracias por estar`;
    letterTitle = `Cómo comenzó esta amistad`;
    letterContent = [
      `Dicen que los amigos son la familia que elegimos, y no me cabe duda de que haberte conocido fue una de las mejores cosas.`,
      `Gracias por la complicidad en cada historia, por el apoyo incondicional y por hacer que cada momento sea más divertido.`,
    ];

    photosTitle = 'Galería de aventuras y risas';
    photosSubtitle = 'Historias que solo nosotros dos entendemos';

    finalTitle = '¡Gracias por esta gran amistad!';
    finalSubtitle = 'Gracias por todas las historias que todavía nos quedan por vivir.';
  }
  // Scenario G: Romantic / Couple / Anniversary (Default fallback if Couple)
  else if (rel === 'couple' || rel.includes('husband') || rel.includes('wife') || rel.includes('boyfriend') || rel.includes('girlfriend') || occ === 'anniversary' || occ === 'valentines') {
    startKicker = 'Un detalle hecho con amor';
    startTitle = `Nuestra historia de amor`;
    startSubtitle = `De: ${sender} → Para: ${recipient}`;

    heroKicker = 'Amor verdadero';
    heroTitle = `El comienzo de nuestra historia`;
    heroSubtitle = `El comienzo de una relación que ha ido creciendo poco a poco 💞`;

    counterTitle = `Llevamos compartiendo esta historia durante`;
    counterFooter = `y todavía quedan infinitos recuerdos por crear.`;

    letterHeading = `Te amo`;
    letterTitle = `Para ti, mi gran amor`;
    letterContent = [
      `Lo nuestro no se planeó y pienso que, ni haciendo el mejor de los planes, hubiésemos creado una historia tan bonita como la de hoy.`,
      `Si algún día pienso volver a algún lugar antes vivido, sería al momento en que te conocí.`,
    ];

    finalTitle = 'Te volvería a elegir siempre';
    finalSubtitle = 'No necesito una historia perfecta. Solo quiero seguir escribiendo la nuestra contigo.';
  }

  return {
    theme: resolvedTheme,
    primaryIcon,
    particleType,
    particleSpeed,
    startScreen: {
      kicker: startKicker,
      title: startTitle,
      subtitle: startSubtitle,
      buttonText: startButton,
      icon: primaryIcon,
    },
    hero: {
      kicker: heroKicker,
      title: heroTitle,
      subtitle: heroSubtitle,
    },
    counter: {
      title: counterTitle,
      footer: counterFooter,
      displayMode: counterDisplayMode,
      icon: primaryIcon,
    },
    letter: {
      heading: letterHeading,
      title: letterTitle,
      defaultSignature,
      defaultContent: letterContent,
    },
    photos: {
      title: photosTitle,
      subtitle: photosSubtitle,
      frameVariant,
      tiltEffect,
    },
    video: {
      title: videoTitle,
      intro: videoIntro,
      buttonText: videoButtonText,
      warningText: videoWarningText,
      caption: videoCaption,
    },
    finalMessage: {
      title: finalTitle,
      message: finalSubtitle,
      signature: defaultSignature,
    },
    suggestedSections: ['hero', 'counter', 'letter', 'photos', 'timeline', 'video', 'final_message'],
  };
}
