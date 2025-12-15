import { Navigation } from "@/components/Navigation";
import { EpisodeCard } from "@/components/EpisodeCard";

import { episodes } from "@/data/episodes";
import { EpisodeMarkdown } from "@/components/EpisodeMarkdown";

export default function Podcast() {
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
            <EpisodeMarkdown slug="ep_001" />
          </div>

          {/* Episodes Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
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
