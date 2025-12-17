import { Navigation } from "@/components/Navigation";
import { EpisodeCard } from "@/components/EpisodeCard";

import { episodes } from "@/data/episodes";
import { EpisodeMarkdown } from "@/components/EpisodeMarkdown";
import { useEffect, useState } from "react";

export default function Podcast() {
  // Lógica para enlazar dinámicamente el audio
  // Usar directamente el archivo real
  const audioFileName = "Silenciar_la_conciencia_por_miedo_a_la_exclusión001.m4a";
  const audioUrl = `${import.meta.env.BASE_URL}episodes/${audioFileName}`;

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
