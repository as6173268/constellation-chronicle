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

export const episodes: Episode[] = [
  {
    id: 1,
    title: "El Despertar del Miedo",
    description: "Primer episodio de la travesía. Exploramos el origen del temor y su papel en la construcción de la consciencia humana.",
    duration: "32:15",
    publishedAt: "2024-01-15",
    chapterId: 1,
    season: 1,
  },
  {
    id: 2,
    title: "La Trampa de la Razón",
    description: "Segundo capítulo. La lógica como herramienta y prisión. ¿Cuándo dejamos de sentir para empezar a calcular?",
    duration: "28:42",
    publishedAt: "2024-01-22",
    chapterId: 2,
    season: 1,
  },
  {
    id: 3,
    title: "La Comedia del Control",
    description: "Tercer episodio. Reímos ante la ilusión del dominio mientras la tecnología teje redes invisibles.",
    duration: "35:08",
    publishedAt: "2024-01-29",
    chapterId: 3,
    season: 1,
  },
  {
    id: 4,
    title: "El Peso de la Culpa",
    description: "Cuarto capítulo. Heredamos culpas ajenas y las hacemos propias. El mercado emocional de los 'debería'.",
    duration: "31:20",
    publishedAt: "2024-02-05",
    chapterId: 4,
    season: 1,
  },
  {
    id: 5,
    title: "La Máscara del Héroe",
    description: "Quinto episodio. La armadura que protege y asfixia. El precio de la fortaleza perpetua.",
    duration: "29:55",
    publishedAt: "2024-02-12",
    chapterId: 5,
    season: 1,
  },
  {
    id: 6,
    title: "El Eco del Silencio",
    description: "Sexto capítulo. Las palabras que callamos resuenan más fuerte que las dichas.",
    duration: "33:40",
    publishedAt: "2024-02-19",
    chapterId: 6,
    season: 1,
  },
];

export const getLatestEpisodes = (count: number = 3): Episode[] => {
  return [...episodes]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
};
