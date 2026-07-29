import { ThemeId } from './types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  emoji: string;
  // Backgrounds
  bgGradient: string;
  bgPattern?: string;
  // Cards
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  cardStyle: string;
  // Typography
  textColor: string;
  titleColor: string;
  accentColor: string;
  kickerColor: string;
  fontTitle: string;
  fontBody: string;
  // Components
  buttonStyle: string;
  heroOverlay: string;
  // Counter-specific
  counterBg: string;
  counterNumberColor: string;
  counterLabelColor: string;
  // Dividers / decorative
  dividerColor: string;
  glowColor: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  // 1. Amor romántico — Oscuro vino y rosas doradas
  romantic_elegant: {
    id: 'romantic_elegant',
    emoji: '🌹',
    name: 'Amor Romántico',
    description: 'Fondos oscuros en vino profundo, texto dorado rosado y tipografía serif de alta costura.',
    bgGradient: 'radial-gradient(ellipse at 50% 0%, #5c0b26 0%, #2e0213 45%, #130008 100%)',
    cardBg: 'linear-gradient(145deg, rgba(90,12,42,0.88), rgba(42,3,18,0.96))',
    cardBorder: 'rgba(255,131,182,0.22)',
    cardShadow: '0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,100,160,0.08)',
    cardStyle: 'rounded-3xl backdrop-blur-xl',
    textColor: '#ffd7e8',
    titleColor: '#ff9dc4',
    accentColor: '#e0286e',
    kickerColor: '#d4839a',
    fontTitle: '"Playfair Display", Georgia, serif',
    fontBody: '"Inter", system-ui, sans-serif',
    buttonStyle: 'bg-gradient-to-r from-rose-600 via-pink-500 to-rose-500 text-white shadow-lg shadow-rose-900/60 hover:scale-105 active:scale-95 rounded-2xl',
    heroOverlay: 'linear-gradient(180deg, rgba(19,0,8,0) 0%, rgba(19,0,8,0.88) 100%)',
    counterBg: 'linear-gradient(135deg, rgba(90,12,42,0.7), rgba(30,0,12,0.9))',
    counterNumberColor: '#ffb3d0',
    counterLabelColor: '#c4708a',
    dividerColor: 'rgba(255,131,182,0.18)',
    glowColor: 'rgba(220,40,110,0.25)',
  },

  // 2. Familia cálida — Terracota, beige y álbum familiar
  family_warm: {
    id: 'family_warm',
    emoji: '🏡',
    name: 'Familia Cálida',
    description: 'Tonos cálidos terracota, beige y textura de álbum fotográfico familiar entrañable.',
    bgGradient: 'linear-gradient(165deg, #2b170c 0%, #1f1008 45%, #120904 100%)',
    cardBg: 'linear-gradient(145deg, rgba(65,38,22,0.9), rgba(35,19,10,0.95))',
    cardBorder: 'rgba(230,165,115,0.28)',
    cardShadow: '0 25px 65px rgba(0,0,0,0.75)',
    cardStyle: 'rounded-3xl backdrop-blur-xl border-amber-900/40',
    textColor: '#fceade',
    titleColor: '#f7b083',
    accentColor: '#d96b27',
    kickerColor: '#cfa282',
    fontTitle: '"Georgia", serif',
    fontBody: '"Inter", system-ui, sans-serif',
    buttonStyle: 'bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white shadow-lg shadow-amber-950/70 hover:scale-105 active:scale-95 rounded-2xl',
    heroOverlay: 'linear-gradient(180deg, transparent 0%, rgba(18,9,4,0.9) 100%)',
    counterBg: 'linear-gradient(135deg, rgba(65,38,22,0.8), rgba(28,15,8,0.92))',
    counterNumberColor: '#f5c6a5',
    counterLabelColor: '#b88c6e',
    dividerColor: 'rgba(230,165,115,0.25)',
    glowColor: 'rgba(217,107,39,0.2)',
  },

  // 3. Celebración alegre — Cumpleaños, graduaciones y logros
  joyful_celebration: {
    id: 'joyful_celebration',
    emoji: '🎉',
    name: 'Celebración Alegre',
    description: 'Colores vivos pero elegantes, movimiento dinámico y estética festiva de alegría contagiosa.',
    bgGradient: 'radial-gradient(ellipse at 50% 0%, #1d0f36 0%, #0d061c 55%, #05020c 100%)',
    cardBg: 'linear-gradient(145deg, rgba(45,20,85,0.88), rgba(18,8,38,0.95))',
    cardBorder: 'rgba(210,130,255,0.3)',
    cardShadow: '0 30px 70px rgba(0,0,0,0.7), 0 0 35px rgba(180,80,255,0.2)',
    cardStyle: 'rounded-3xl backdrop-blur-xl',
    textColor: '#f3e8ff',
    titleColor: '#e879f9',
    accentColor: '#c084fc',
    kickerColor: '#a855f7',
    fontTitle: '"Outfit", system-ui, sans-serif',
    fontBody: '"Inter", system-ui, sans-serif',
    buttonStyle: 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-fuchsia-950/80 hover:scale-105 active:scale-95 rounded-2xl',
    heroOverlay: 'linear-gradient(180deg, transparent 0%, rgba(5,2,12,0.9) 100%)',
    counterBg: 'linear-gradient(135deg, rgba(45,20,85,0.8), rgba(14,6,30,0.92))',
    counterNumberColor: '#f5d0fe',
    counterLabelColor: '#c084fc',
    dividerColor: 'rgba(210,130,255,0.25)',
    glowColor: 'rgba(232,121,249,0.25)',
  },

  // 4. Infantil — Suave, místico y delicado
  childish: {
    id: 'childish',
    emoji: '⭐',
    name: 'Infantil & Dulce',
    description: 'Pasteles suaves, estrellas, nubes y formas redondeadas llenas de ternura e ilusión.',
    bgGradient: 'radial-gradient(circle at 50% 0%, #1e2840 0%, #0d121f 55%, #050810 100%)',
    cardBg: 'linear-gradient(145deg, rgba(30,45,70,0.9), rgba(12,20,35,0.96))',
    cardBorder: 'rgba(125,211,252,0.3)',
    cardShadow: '0 25px 60px rgba(0,0,0,0.65)',
    cardStyle: 'rounded-[36px] backdrop-blur-xl border-sky-500/20',
    textColor: '#e0f2fe',
    titleColor: '#7dd3fc',
    accentColor: '#38bdf8',
    kickerColor: '#93c5fd',
    fontTitle: '"Fredoka", "Outfit", system-ui, sans-serif',
    fontBody: '"Inter", system-ui, sans-serif',
    buttonStyle: 'bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 text-white shadow-lg shadow-sky-950/70 hover:scale-105 active:scale-95 rounded-3xl',
    heroOverlay: 'linear-gradient(180deg, transparent 0%, rgba(5,8,16,0.88) 100%)',
    counterBg: 'linear-gradient(135deg, rgba(30,45,70,0.85), rgba(10,16,28,0.92))',
    counterNumberColor: '#bae6fd',
    counterLabelColor: '#60a5fa',
    dividerColor: 'rgba(125,211,252,0.25)',
    glowColor: 'rgba(56,189,248,0.22)',
  },

  // 5. Amistad & Diversión — Scrapbook y polaroids
  friendship_fun: {
    id: 'friendship_fun',
    emoji: '📸',
    name: 'Amistad & Scrapbook',
    description: 'Estilo scrapbook dinámico, polaroids, notas manuscritas y dinamismo juvenil.',
    bgGradient: 'linear-gradient(160deg, #1b1625 0%, #110e19 50%, #07050a 100%)',
    cardBg: 'linear-gradient(145deg, rgba(42,33,60,0.9), rgba(18,14,28,0.96))',
    cardBorder: 'rgba(251,146,60,0.3)',
    cardShadow: '0 25px 65px rgba(0,0,0,0.7)',
    cardStyle: 'rounded-3xl backdrop-blur-xl',
    textColor: '#ffedd5',
    titleColor: '#fb923c',
    accentColor: '#f97316',
    kickerColor: '#fdba74',
    fontTitle: '"Caveat", "Outfit", cursive',
    fontBody: '"Inter", system-ui, sans-serif',
    buttonStyle: 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white shadow-lg shadow-orange-950/70 hover:scale-105 active:scale-95 rounded-2xl',
    heroOverlay: 'linear-gradient(180deg, transparent 0%, rgba(7,5,10,0.9) 100%)',
    counterBg: 'linear-gradient(135deg, rgba(42,33,60,0.85), rgba(14,10,22,0.95))',
    counterNumberColor: '#fed7aa',
    counterLabelColor: '#fb923c',
    dividerColor: 'rgba(251,146,60,0.25)',
    glowColor: 'rgba(249,115,22,0.22)',
  },

  // 6. Elegante & Sobria — Profesional, institucional y sobria
  elegant_sobriety: {
    id: 'elegant_sobriety',
    emoji: '💼',
    name: 'Elegante & Sobria',
    description: 'Blanco, negro, azul profundo y dorado sobrio para reconocimientos, profesores y empresas.',
    bgGradient: 'radial-gradient(ellipse at 50% 0%, #0d192b 0%, #070d17 55%, #020408 100%)',
    cardBg: 'linear-gradient(145deg, rgba(16,30,50,0.92), rgba(6,12,22,0.97))',
    cardBorder: 'rgba(212,175,55,0.28)',
    cardShadow: '0 30px 70px rgba(0,0,0,0.85)',
    cardStyle: 'rounded-2xl border-slate-700/60',
    textColor: '#e2e8f0',
    titleColor: '#f1f5f9',
    accentColor: '#d4af37',
    kickerColor: '#94a3b8',
    fontTitle: '"Playfair Display", Georgia, serif',
    fontBody: '"Inter", system-ui, sans-serif',
    buttonStyle: 'bg-gradient-to-r from-slate-800 via-slate-900 to-black text-amber-300 border border-amber-500/30 shadow-xl hover:scale-105 active:scale-95 rounded-xl',
    heroOverlay: 'linear-gradient(180deg, transparent 0%, rgba(2,4,8,0.92) 100%)',
    counterBg: 'linear-gradient(135deg, rgba(16,30,50,0.85), rgba(4,8,16,0.95))',
    counterNumberColor: '#f8fafc',
    counterLabelColor: '#94a3b8',
    dividerColor: 'rgba(212,175,55,0.25)',
    glowColor: 'rgba(212,175,55,0.18)',
  },

  // 7. Nostalgia & Homenaje — Memoriales y recuerdos respetuosos
  nostalgia_tribute: {
    id: 'nostalgia_tribute',
    emoji: '🕊️',
    name: 'Nostalgia & Homenaje',
    description: 'Atmósfera sobria, crema, transiciones suaves y máxima compostura para homenajes.',
    bgGradient: 'linear-gradient(160deg, #191614 0%, #0f0d0c 50%, #050404 100%)',
    cardBg: 'linear-gradient(145deg, rgba(32,28,25,0.92), rgba(14,12,11,0.97))',
    cardBorder: 'rgba(214,198,176,0.2)',
    cardShadow: '0 30px 75px rgba(0,0,0,0.9)',
    cardStyle: 'rounded-2xl border-stone-800',
    textColor: '#e7e5e4',
    titleColor: '#f5f5f4',
    accentColor: '#d6c6b0',
    kickerColor: '#a8a29e',
    fontTitle: '"Cormorant Garamond", Georgia, serif',
    fontBody: '"Inter", system-ui, sans-serif',
    buttonStyle: 'bg-stone-800 text-stone-200 border border-stone-700 hover:bg-stone-700 rounded-xl transition',
    heroOverlay: 'linear-gradient(180deg, transparent 0%, rgba(5,4,4,0.95) 100%)',
    counterBg: 'linear-gradient(135deg, rgba(32,28,25,0.85), rgba(10,9,8,0.95))',
    counterNumberColor: '#e7e5e4',
    counterLabelColor: '#a8a29e',
    dividerColor: 'rgba(214,198,176,0.2)',
    glowColor: 'rgba(214,198,176,0.12)',
  },

  // 8. Naturaleza & Orgánico — Hojas, bosque y calidez natural
  nature_organic: {
    id: 'nature_organic',
    emoji: '🌿',
    name: 'Naturaleza & Tierra',
    description: 'Verde bosque, tonos tierra, frescura botánica y movimiento sereno.',
    bgGradient: 'radial-gradient(ellipse at 50% 0%, #0d2215 0%, #06130b 55%, #020704 100%)',
    cardBg: 'linear-gradient(145deg, rgba(18,45,28,0.9), rgba(7,20,12,0.96))',
    cardBorder: 'rgba(134,239,172,0.25)',
    cardShadow: '0 25px 65px rgba(0,0,0,0.75)',
    cardStyle: 'rounded-3xl backdrop-blur-xl border-emerald-900/40',
    textColor: '#dcfce7',
    titleColor: '#86efac',
    accentColor: '#4ade80',
    kickerColor: '#a7f3d0',
    fontTitle: '"Playfair Display", Georgia, serif',
    fontBody: '"Inter", system-ui, sans-serif',
    buttonStyle: 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white shadow-lg shadow-emerald-950/70 hover:scale-105 active:scale-95 rounded-2xl',
    heroOverlay: 'linear-gradient(180deg, transparent 0%, rgba(2,7,4,0.9) 100%)',
    counterBg: 'linear-gradient(135deg, rgba(18,45,28,0.85), rgba(6,18,10,0.95))',
    counterNumberColor: '#bbf7d0',
    counterLabelColor: '#6ee7b7',
    dividerColor: 'rgba(134,239,172,0.22)',
    glowColor: 'rgba(74,222,128,0.2)',
  },

  // 9. Minimalista — Fondo limpio y fotografías protagonistas
  minimalist: {
    id: 'minimalist',
    emoji: '🤍',
    name: 'Minimalista & Limpio',
    description: 'Pureza absoluta: fondo claro, fotografías gigantes y tipografía editorial pulida.',
    bgGradient: 'linear-gradient(160deg, #f8f6f4 0%, #f0eee9 50%, #e8e4de 100%)',
    cardBg: 'rgba(255,255,255,0.92)',
    cardBorder: 'rgba(180,170,155,0.35)',
    cardShadow: '0 15px 40px rgba(60,50,40,0.1), 0 2px 8px rgba(60,50,40,0.06)',
    cardStyle: 'rounded-2xl',
    textColor: '#2d2820',
    titleColor: '#1a1510',
    accentColor: '#b91c1c',
    kickerColor: '#6b6055',
    fontTitle: '"Inter", system-ui, -apple-system, sans-serif',
    fontBody: '"Inter", system-ui, -apple-system, sans-serif',
    buttonStyle: 'bg-stone-900 text-white shadow-md hover:bg-stone-800 hover:scale-105 active:scale-95 rounded-xl',
    heroOverlay: 'linear-gradient(180deg, transparent 0%, rgba(25,20,15,0.72) 100%)',
    counterBg: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(240,236,228,0.95))',
    counterNumberColor: '#1a1510',
    counterLabelColor: '#6b6055',
    dividerColor: 'rgba(180,170,155,0.3)',
    glowColor: 'rgba(185,28,28,0.1)',
  },

  // 10. Noche Estelar — Índigo y cosmos
  night_romantic: {
    id: 'night_romantic',
    emoji: '✨',
    name: 'Noche Estelar',
    description: 'Cosmos profundo azul índigo, destellos plateados y tipografía garamond refinada.',
    bgGradient: 'radial-gradient(ellipse at 30% 0%, #0f0a35 0%, #060218 55%, #020010 100%)',
    cardBg: 'linear-gradient(145deg, rgba(20,12,60,0.92), rgba(8,3,32,0.97))',
    cardBorder: 'rgba(150,120,255,0.28)',
    cardShadow: '0 30px 70px rgba(0,0,0,0.8), 0 0 40px rgba(120,80,255,0.12)',
    cardStyle: 'rounded-3xl backdrop-blur-xl',
    textColor: '#e8e0ff',
    titleColor: '#b89dff',
    accentColor: '#7c3aed',
    kickerColor: '#9d84d8',
    fontTitle: '"Cormorant Garamond", Georgia, serif',
    fontBody: '"Inter", system-ui, sans-serif',
    buttonStyle: 'bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 text-white shadow-xl shadow-violet-950/80 hover:scale-105 active:scale-95 rounded-2xl',
    heroOverlay: 'linear-gradient(180deg, transparent 0%, rgba(2,0,16,0.9) 100%)',
    counterBg: 'linear-gradient(135deg, rgba(20,10,60,0.75), rgba(6,2,24,0.92))',
    counterNumberColor: '#c4b5ff',
    counterLabelColor: '#7a68b8',
    dividerColor: 'rgba(140,100,255,0.2)',
    glowColor: 'rgba(100,60,255,0.22)',
  },

  // 11. Oro & Champagne — Fiesta y dorado
  polaroid: {
    id: 'polaroid',
    emoji: '🥂',
    name: 'Oro & Champagne',
    description: 'Paleta cálida de champagne y oro, tipografía manuscrita y atmósfera festiva íntima.',
    bgGradient: 'linear-gradient(160deg, #1a1100 0%, #2a1a00 40%, #120d00 100%)',
    cardBg: 'linear-gradient(145deg, rgba(50,35,5,0.92), rgba(28,18,0,0.96))',
    cardBorder: 'rgba(210,160,40,0.28)',
    cardShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(200,150,20,0.1)',
    cardStyle: 'rounded-3xl backdrop-blur-xl',
    textColor: '#f5e8c0',
    titleColor: '#d4a940',
    accentColor: '#c08000',
    kickerColor: '#a07820',
    fontTitle: '"Caveat", cursive',
    fontBody: '"Playfair Display", Georgia, serif',
    buttonStyle: 'bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-600 text-white shadow-lg shadow-amber-950/70 hover:scale-105 active:scale-95 rounded-2xl',
    heroOverlay: 'linear-gradient(180deg, transparent 0%, rgba(18,13,0,0.88) 100%)',
    counterBg: 'linear-gradient(135deg, rgba(50,35,5,0.75), rgba(24,15,0,0.92))',
    counterNumberColor: '#ffd470',
    counterLabelColor: '#9a7a30',
    dividerColor: 'rgba(210,160,40,0.2)',
    glowColor: 'rgba(200,150,20,0.18)',
  },
};
