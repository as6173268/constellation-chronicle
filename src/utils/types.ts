// Shared type definitions
export interface Episode {
  id: number;
  title: string;
  description: string;
  duration: string;
  publishedAt: string;
  audioUrl?: string;
  chapterId: number;
  season: number;
}

export interface Chapter {
  id: number;
  slug: string;
  title: string;
  summary: string;
  dialogue?: string;
  lagrangeTag: string;
  axis: string;
  episodeId?: number;
}

export interface LagrangeNode {
  id: string;
  eje: string;
  nivel: string;
  tension: string;
  texto: string;
  conexiones: string[];
  episodios: string[];
}

export interface LagrangeConnection {
  id: string;
  source: string;
  target: string;
  tipo: string;
  fuerza: number;
}

export interface LagrangeAxis {
  id: string;
  name: string;
  chapters: number[];
  color: string;
}

export interface SocraticQuestion {
  id: string;
  eje: string;
  nivel: string;
  tension: string;
  texto: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'editor' | 'admin';
  createdAt: Date;
}