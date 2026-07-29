import { RelationshipType, OccasionType, EmotionalTone, ThemeId, CounterDisplayMode, SectionType } from './types';

export interface OptionItem<T extends string> {
  value: T;
  label: string;
  group?: string;
  emoji?: string;
  description?: string;
}

export const RELATIONSHIP_OPTIONS: OptionItem<RelationshipType>[] = [
  { value: 'couple', label: 'Pareja', group: 'Amor' },
  { value: 'husband_to_wife', label: 'Esposo a esposa', group: 'Amor' },
  { value: 'wife_to_husband', label: 'Esposa a esposo', group: 'Amor' },
  { value: 'boyfriend_to_girlfriend', label: 'Novio a novia', group: 'Amor' },
  { value: 'girlfriend_to_boyfriend', label: 'Novia a novio', group: 'Amor' },
  { value: 'father_to_daughter', label: 'Padre a hija', group: 'Familia' },
  { value: 'father_to_son', label: 'Padre a hijo', group: 'Familia' },
  { value: 'mother_to_daughter', label: 'Madre a hija', group: 'Familia' },
  { value: 'mother_to_son', label: 'Madre a hijo', group: 'Familia' },
  { value: 'daughter_to_mother', label: 'Hija a madre', group: 'Familia' },
  { value: 'son_to_mother', label: 'Hijo a madre', group: 'Familia' },
  { value: 'daughter_to_father', label: 'Hija a padre', group: 'Familia' },
  { value: 'son_to_father', label: 'Hijo a padre', group: 'Familia' },
  { value: 'parents_to_child', label: 'Padres a hijo o hija', group: 'Familia' },
  { value: 'child_to_parents', label: 'Hijo o hija a sus padres', group: 'Familia' },
  { value: 'grandparent_to_grandchild', label: 'Abuelo o abuela a nieto(a)', group: 'Familia' },
  { value: 'grandchild_to_grandparents', label: 'Nieto o nieta a abuelos', group: 'Familia' },
  { value: 'siblings', label: 'Entre hermanos', group: 'Familia' },
  { value: 'family', label: 'Familia en general', group: 'Familia' },
  { value: 'friends', label: 'Entre amigos', group: 'Amistad' },
  { value: 'best_friends', label: 'Mejor amigo o amiga', group: 'Amistad' },
  { value: 'coworkers', label: 'Compañeros de trabajo', group: 'Profesional' },
  { value: 'student_to_teacher', label: 'Alumno a profesor', group: 'Profesional' },
  { value: 'teacher_to_student', label: 'Profesor a alumno', group: 'Profesional' },
  { value: 'professional_gratitude', label: 'Agradecimiento profesional', group: 'Profesional' },
  { value: 'tribute', label: 'Homenaje', group: 'Especial' },
  { value: 'in_memory', label: 'En memoria de alguien', group: 'Especial' },
  { value: 'other', label: 'Otra relación', group: 'Otro' },
];

export const OCCASION_OPTIONS: OptionItem<OccasionType>[] = [
  { value: 'anniversary', label: 'Aniversario' },
  { value: 'birthday', label: 'Cumpleaños' },
  { value: 'mothers_day', label: 'Día de la Madre' },
  { value: 'fathers_day', label: 'Día del Padre' },
  { value: 'grandparents_day', label: 'Día de los Abuelos' },
  { value: 'birth', label: 'Nacimiento' },
  { value: 'baby_welcome', label: 'Bienvenida a un bebé' },
  { value: 'graduation', label: 'Graduación' },
  { value: 'wedding', label: 'Matrimonio' },
  { value: 'marriage_proposal', label: 'Propuesta de matrimonio' },
  { value: 'valentines', label: 'San Valentín' },
  { value: 'christmas', label: 'Navidad' },
  { value: 'friendship', label: 'Amistad' },
  { value: 'gratitude', label: 'Agradecimiento' },
  { value: 'reconciliation', label: 'Reconciliación' },
  { value: 'apology', label: 'Pedir disculpas' },
  { value: 'farewell', label: 'Despedida' },
  { value: 'retirement', label: 'Jubilación' },
  { value: 'personal_achievement', label: 'Logro personal' },
  { value: 'tribute', label: 'Homenaje' },
  { value: 'family_memory', label: 'Recuerdo familiar' },
  { value: 'in_memory', label: 'En memoria de alguien' },
  { value: 'no_occasion', label: 'Sin ocasión especial' },
  { value: 'custom', label: 'Personalizado' },
];

export const TONE_OPTIONS: OptionItem<EmotionalTone>[] = [
  { value: 'romantic', label: 'Romántico', emoji: '🌹', description: 'Cálido, pasional y dedicado a parejas' },
  { value: 'family', label: 'Familiar', emoji: '🏡', description: 'Cálido, de hogar y recuerdos compartidos' },
  { value: 'emotional', label: 'Emotivo', emoji: '💖', description: 'Profundo, sensible y lleno de gratitud' },
  { value: 'joyful', label: 'Alegre', emoji: '🎉', description: 'Vibrante, festivo y positivo' },
  { value: 'funny', label: 'Divertido', emoji: '🤪', description: 'Espontáneo, gracioso y entre cómplices' },
  { value: 'tender', label: 'Tierno', emoji: '🧸', description: 'Dulce, cariñoso y de afecto puro' },
  { value: 'childish', label: 'Infantil', emoji: '⭐', description: 'Mágico, suave e ilustrado para niños' },
  { value: 'elegant', label: 'Elegante', emoji: '✨', description: 'Refinado, limpio y de alta distinción' },
  { value: 'nostalgic', label: 'Nostálgico', emoji: '📜', description: 'Evocador, de añoranza y bellos recuerdos' },
  { value: 'inspiring', label: 'Inspirador', emoji: '🌿', description: 'Motivador, positivo y lleno de superación' },
  { value: 'solemn', label: 'Solemne', emoji: '🕊️', description: 'Respetuoso, noble y conmemorable' },
  { value: 'grateful', label: 'Agradecido', emoji: '🙏', description: 'De reconocimiento y valoración sincera' },
  { value: 'custom', label: 'Personalizado', emoji: '🎨', description: 'Configuración libre y a medida' },
];

export interface GiftPresetConfig {
  recommendedThemes: ThemeId[];
  recommendedSections: SectionType[];
  heroTitle: string;
  heroSubtitle: string;
  letterHeading: string;
  letterTitle: string;
  letterParagraphs: string[];
  signature: string;
  counterTitle: string;
  counterFooter: string;
  counterDisplayMode: CounterDisplayMode;
  finalTitle: string;
  finalSubtitle: string;
}

export function generateDefaultGiftPreset(params: {
  senderName: string;
  recipientName: string;
  finalSignature?: string;
  relationship: RelationshipType;
  occasion: OccasionType;
  tone: EmotionalTone;
}): GiftPresetConfig {
  const { senderName, recipientName, finalSignature, relationship, occasion, tone } = params;
  const signature = finalSignature || `Con todo mi cariño, ${senderName}`;

  // 1. Determine recommended Themes
  let recommendedThemes: ThemeId[] = ['minimalist'];

  if (relationship === 'couple' || relationship === 'husband_to_wife' || relationship === 'wife_to_husband' || relationship === 'boyfriend_to_girlfriend' || relationship === 'girlfriend_to_boyfriend') {
    recommendedThemes = ['romantic_elegant', 'night_romantic', 'polaroid', 'minimalist'];
  } else if (relationship === 'daughter_to_mother' || relationship === 'son_to_mother' || relationship === 'father_to_daughter' || relationship === 'mother_to_daughter' || relationship === 'parents_to_child' || relationship === 'child_to_parents') {
    recommendedThemes = ['family_warm', 'nature_organic', 'minimalist'];
  } else if (relationship === 'friends' || relationship === 'best_friends' || relationship === 'siblings') {
    recommendedThemes = ['friendship_fun', 'joyful_celebration', 'minimalist'];
  } else if (relationship === 'student_to_teacher' || relationship === 'teacher_to_student' || relationship === 'coworkers' || relationship === 'professional_gratitude') {
    recommendedThemes = ['elegant_sobriety', 'minimalist'];
  } else if (relationship === 'tribute' || relationship === 'in_memory' || occasion === 'in_memory' || occasion === 'tribute') {
    recommendedThemes = ['nostalgia_tribute', 'elegant_sobriety', 'minimalist'];
  } else if (tone === 'childish' || occasion === 'birth' || occasion === 'baby_welcome') {
    recommendedThemes = ['childish', 'nature_organic', 'joyful_celebration'];
  } else if (tone === 'joyful' || occasion === 'birthday' || occasion === 'graduation') {
    recommendedThemes = ['joyful_celebration', 'friendship_fun', 'polaroid'];
  } else {
    recommendedThemes = ['family_warm', 'nature_organic', 'minimalist'];
  }

  // 2. Counter Display Mode
  let counterDisplayMode: CounterDisplayMode = 'elapsed_time';
  if (occasion === 'graduation' || occasion === 'wedding' || occasion === 'marriage_proposal') {
    counterDisplayMode = 'countdown';
  } else if (occasion === 'in_memory' || occasion === 'tribute' || relationship === 'student_to_teacher' || relationship === 'professional_gratitude') {
    counterDisplayMode = 'show_date_only';
  }

  // 3. Texts by Category
  let heroTitle = `Un detalle especial para ti`;
  let heroSubtitle = `Para ${recipientName}, de parte de ${senderName}`;
  let letterHeading = `De ${senderName} para ${recipientName}`;
  let letterTitle = `Para ti, ${recipientName}`;
  let letterParagraphs: string[] = [
    `Hay personas que iluminan nuestras vidas de una manera única, y tú eres una de ellas.`,
    `Este regalo fue creado con mucho cariño para recordar todos los momentos especiales que compartimos y los que vendrán.`,
  ];
  let counterTitle = `Desde aquel día han pasado`;
  let counterFooter = `y cada momento a tu lado sigue siendo incalculable.`;
  let finalTitle = `Siempre contigo`;
  let finalSubtitle = `Gracias por ser parte fundamental de mi vida.`;

  // Specific Overrides:

  // A. Madre / Padre / Familia
  if (relationship.includes('mother') || occasion === 'mothers_day') {
    heroTitle = `Gracias por estar siempre, Mamá`;
    heroSubtitle = `Un homenaje lleno de amor para ${recipientName}`;
    letterHeading = `Te quiero, Mamá`;
    letterTitle = `Todo lo que aprendí de ti`;
    letterParagraphs = [
      `Gracias por tu paciencia incondicional, por tus abrazos de refugio y por enseñarme el valor de las cosas hechas con el corazón.`,
      `Ver crecer esta familia a tu lado es el regalo más hermoso que la vida nos ha dado. Gracias por cada sonrisa y por estar siempre ahí.`,
    ];
    counterTitle = `Desde que nos acompañas han pasado`;
    counterFooter = `y tu amor sigue siendo nuestra mayor guía.`;
    finalTitle = `Para siempre en el corazón`;
    finalSubtitle = `Con el amor más profundo de tu familia.`;
  } else if (relationship.includes('father') || occasion === 'fathers_day') {
    heroTitle = `Gracias por enseñarme el camino, Papá`;
    heroSubtitle = `Un recuerdo especial dedicado a ${recipientName}`;
    letterHeading = `Con admiración y cariño`;
    letterTitle = `Momentos inolvidables junto a ti`;
    letterParagraphs = [
      `Tus consejos, tu ejemplo de trabajo y tu apoyo constante son el faro que me acompaña cada día.`,
      `Gracias por tus risas, por tus palabras en el momento justo y por estar presente en cada paso del camino.`,
    ];
    counterTitle = `Compartiendo este camino han pasado`;
    counterFooter = `y tus enseñanzas permanecen intactas.`;
    finalTitle = `Siempre nuestro orgullo`;
    finalSubtitle = `Con todo nuestro cariño y respeto.`;
  } else if (relationship.includes('child') || relationship.includes('daughter') || relationship.includes('son') || occasion === 'birth' || occasion === 'baby_welcome') {
    heroTitle = `Desde que llegaste a nuestras vidas`;
    heroSubtitle = `El mayor regalo para ${recipientName}`;
    letterHeading = `Verte crecer es nuestro mayor regalo`;
    letterTitle = `Para ti, ${recipientName}`;
    letterParagraphs = [
      `Desde el primer segundo en que te vimos, supimos que el mundo se había vuelto un lugar mucho más hermoso y brillante.`,
      `Queremos que recuerdes siempre lo orgullosos que estamos de ti y que siempre tendrás nuestros brazos abiertos para apoyarte.`,
    ];
    counterTitle = `Desde aquel día en que llegaste a nuestras vidas han pasado`;
    counterFooter = `y nuestro amor por ti crece cada segundo.`;
    finalTitle = `Siempre estaremos contigo`;
    finalSubtitle = `Iluminas cada uno de nuestros días.`;
  } else if (relationship.includes('friend') || occasion === 'friendship') {
    heroTitle = `Una gran amistad merece celebrarse`;
    heroSubtitle = `Para ${recipientName}, de tu gran amigo(a) ${senderName}`;
    letterHeading = `Gracias por tantas aventuras`;
    letterTitle = `Nuestra historia de amistad`;
    letterParagraphs = [
      `Dicen que los amigos son la familia que elegimos, y no me cabe duda de que haberte conocido fue una de las mejores elecciones.`,
      `Gracias por las risas espontáneas, la complicidad en cada historia y por estar presente en los momentos más importantes.`,
    ];
    counterTitle = `Nuestra amistad comenzó hace`;
    counterFooter = `y las mejores aventuras aún están por vivirse.`;
    finalTitle = `Por muchos recuerdos más`;
    finalSubtitle = `¡Salud por nuestra gran amistad!`;
  } else if (occasion === 'graduation' || occasion === 'personal_achievement') {
    heroTitle = `¡Todo el esfuerzo valió la pena!`;
    heroSubtitle = `Celebrando el gran logro de ${recipientName}`;
    letterHeading = `Orgullo y admiración`;
    letterTitle = `El camino recorrido`;
    letterParagraphs = [
      `Hoy se corona una etapa llena de dedicación, perseverancia y superación constante. Verte alcanzar este objetivo nos llena de profunda alegría.`,
      `Que este logro sea solo el primer paso de un camino brillante y lleno de nuevos horizontes. ¡Felicitaciones!`,
    ];
    counterTitle = `El esfuerzo acumulado durante`;
    counterFooter = `hoy se convierte en este gran éxito.`;
    finalTitle = `Esto recién comienza`;
    finalSubtitle = `El futuro te pertenece. ¡Mucho éxito!`;
  } else if (occasion === 'in_memory' || occasion === 'tribute' || relationship === 'in_memory' || relationship === 'tribute') {
    heroTitle = `En memoria de una vida extraordinaria`;
    heroSubtitle = `Homenaje a ${recipientName}`;
    letterHeading = `Su legado permanece en nosotros`;
    letterTitle = `Recuerdos inolvidables`;
    letterParagraphs = [
      `Hay huellas que el tiempo jamás podrá borrar. Tu alegría, tu bondad y la luz de tu presencia seguirán acompañándonos siempre.`,
      `Guardamos con profundo respeto y amor cada momento compartido, sabiendo que vives en la memoria de todos quienes te quisimos.`,
    ];
    counterTitle = `Su recuerdo vive en nosotros desde`;
    counterFooter = `y su legado permanecerá para siempre.`;
    finalTitle = `Para siempre presente`;
    finalSubtitle = `Con todo nuestro amor y respeto.`;
  } else if (relationship.includes('teacher') || relationship === 'professional_gratitude') {
    heroTitle = `En reconocimiento a su gran labor`;
    heroSubtitle = `Para ${recipientName}, de parte de ${senderName}`;
    letterHeading = `Con gratitud sincera`;
    letterTitle = `Gracias por su dedicación`;
    letterParagraphs = [
      `Queremos expresar nuestro más sincero agradecimiento por su paciencia, vocación y por inspirarnos a ser mejores cada día.`,
      `Su impacto va más allá de las aulas o del trabajo diario: es una huella positiva que perdurará por siempre.`,
    ];
    counterTitle = `Compartiendo esta etapa han transcurrido`;
    counterFooter = `dejando un testimonio de excelencia e inspiración.`;
    finalTitle = `Nuestra más profunda gratitud`;
    finalSubtitle = `Con aprecio y respeto profesional.`;
  } else if (relationship === 'couple' || relationship.includes('husband') || relationship.includes('wife') || relationship.includes('boyfriend') || relationship.includes('girlfriend') || occasion === 'anniversary' || occasion === 'valentines') {
    heroTitle = `El comienzo de nuestra historia`;
    heroSubtitle = `Para mi gran amor, ${recipientName}`;
    letterHeading = `Te amo`;
    letterTitle = `Para ti, mi amor`;
    letterParagraphs = [
      `Lo nuestro no se planeó y pienso que, ni haciendo el mejor de los planes, hubiésemos creado una historia tan bonita como la de hoy.`,
      `Si algún día pienso volver a algún lugar antes vivido, sería al momento en que te conocí.`,
    ];
    counterTitle = `Llevamos compartiendo esta historia durante`;
    counterFooter = `y todavía quedan infinitos recuerdos por crear.`;
    finalTitle = `Siempre tú`;
    finalSubtitle = `No necesito una historia perfecta. Solo quiero seguir escribiendo la nuestra contigo.`;
  }

  return {
    recommendedThemes,
    recommendedSections: ['hero', 'counter', 'letter', 'photos', 'timeline', 'video', 'final_message'],
    heroTitle,
    heroSubtitle,
    letterHeading,
    letterTitle,
    letterParagraphs,
    signature,
    counterTitle,
    counterFooter,
    counterDisplayMode,
    finalTitle,
    finalSubtitle,
  };
}
