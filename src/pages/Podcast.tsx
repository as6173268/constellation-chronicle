import { Navigation } from "@/components/Navigation";
import { EpisodeCard } from "@/components/EpisodeCard";
import { EpisodeMarkdown } from "@/components/EpisodeMarkdown";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lagrangeMap from "@/data/lagrange/lagrange_map.json";
import { getEpisodes, getChapters } from "@/services/podcastService";
import { cn } from "@/utils/utils";

export default function Podcast() {
  const navigate = useNavigate();
  const [selectedEje, setSelectedEje] = useState<string | null>(null);
  const [selectedTension, setSelectedTension] = useState<string | null>(null);
  const [selectedCapitulo, setSelectedCapitulo] = useState<number | null>(null);

  const episodes = getEpisodes();
  const chapters = getChapters();

  // Lógica para enlazar dinámicamente el audio
  // Usar directamente el archivo real
  const audioFileName = "Silenciar_la_conciencia_por_miedo_a_la_exclusión001.m4a";
  const audioUrl = `${import.meta.env.BASE_URL}episodes/${audioFileName}`;

  // Filter episodes based on selections
  const filteredEpisodes = episodes.filter(episode => {
    const episodeId = `E${episode.id}`;
    const associatedQuestions = lagrangeMap.preguntas.filter(q => q.episodios.includes(episodeId));

    if (selectedEje && !associatedQuestions.some(q => q.eje === selectedEje)) return false;
    if (selectedTension && !associatedQuestions.some(q => q.tension === selectedTension)) return false;
    if (selectedCapitulo) {
      const chapter = chapters.find(c => c.id === selectedCapitulo);
      if (!chapter || chapter.episodeId !== episode.id) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Podcast
            </h1>
            <p className="text-lg text-muted-foreground">
              Temporada 1 — 52 episodios que trazan el mapa del pensamiento a través de diálogos socráticos y reflexiones sobre la condición humana.
            </p>
          </div>

          {/* Episodio Markdown de ejemplo */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">Episodio Destacado</h2>
            <div className="mb-6">
              <audio
                key={audioUrl}
                controls
                controlsList="nodownload"
                preload="auto"
                className="w-full"
                src={audioUrl}
              >
                Tu navegador no soporta la reproducción de audio.
              </audio>
              <span className="inline-block mt-2 px-3 py-1 text-xs bg-accent/30 border border-border rounded-full text-muted-foreground">
                Archivo: {audioFileName}
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm font-medium mr-2">Eje:</span>
              <button
                onClick={() => setSelectedEje(null)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs transition-all border",
                  !selectedEje
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                )}
              >
                Todos
              </button>
              {lagrangeMap.ejes.map((eje) => (
                <button
                  key={eje.id}
                  onClick={() => setSelectedEje(eje.id)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs transition-all border",
                    selectedEje === eje.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  {eje.nombre}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm font-medium mr-2">Tensión:</span>
              <button
                onClick={() => setSelectedTension(null)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs transition-all border",
                  !selectedTension
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                )}
              >
                Todas
              </button>
              {["alta", "media", "baja"].map((tension) => (
                <button
                  key={tension}
                  onClick={() => setSelectedTension(tension)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs transition-all border",
                    selectedTension === tension
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  {tension.charAt(0).toUpperCase() + tension.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium mr-2">Capítulo:</span>
              <button
                onClick={() => setSelectedCapitulo(null)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs transition-all border",
                  !selectedCapitulo
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                )}
              >
                Todos
              </button>
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedCapitulo(chapter.id)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs transition-all border",
                    selectedCapitulo === chapter.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  {chapter.id.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>

          {/* Episodes Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredEpisodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} onClick={() => navigate(`/podcast/${episode.id}`)} />
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-12 text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">
              Más episodios próximamente...
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              52 espinas narrativas por explorar
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
