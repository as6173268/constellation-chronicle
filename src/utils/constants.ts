// Application constants
export const APP_CONFIG = {
  name: 'Constellation Chronicle',
  version: '1.0.0',
  description: 'Sistema Lagrange - Un mapa interactivo del pensamiento',
  author: 'Constellation Team',
};

export const ROUTES = {
  HOME: '/',
  PODCAST: '/podcast',
  EPISODE: '/podcast/:slug',
  CHAPTERS: '/capitulos',
  CHAPTER: '/capitulos/:slug',
  LAGRANGE_MAP: '/mapa-lagrange',
  LABORATORY: '/laboratorio',
  AUTH: '/auth',
};

export const API_ENDPOINTS = {
  IA_ANALYZE: '/api/ia/analyze',
  PODCAST_EPISODES: '/api/podcast/episodes',
  MAP_DATA: '/api/map',
  AUTH_SIGNIN: '/api/auth/signin',
  AUTH_SIGNUP: '/api/auth/signup',
};

export const LAGRANGE_AXES = {
  MIEDO_CONTROL: 'miedo-control',
  CULPA_OBEDIENCIA: 'culpa-obediencia',
  TECNOLOGIA_VIGILANCIA: 'tecnologia-vigilancia',
  FATIGA_DELEGACION: 'fatiga-delegacion',
  CONCIENCIA_REBELION: 'conciencia-rebelion',
};

export const QUESTION_LEVELS = ['bajo', 'medio', 'alto'];
export const QUESTION_TENSIONS = ['baja', 'media', 'alta'];

export const COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  muted: 'hsl(var(--muted))',
  border: 'hsl(var(--border))',
};