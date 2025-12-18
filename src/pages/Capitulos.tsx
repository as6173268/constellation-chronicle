import { Navigation } from "@/components/Navigation";
import { ChapterCard } from "@/components/ChapterCard";
import { chapters, lagrangeAxes } from "@/data/chapters";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Capitulos() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredChapters = activeFilter
    ? chapters.filter((c) => c.axis === activeFilter)
    : chapters;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Los 52 Capítulos
            </h1>
            <p className="text-lg text-muted-foreground">
              Cada espina narrativa contiene un resumen, un fragmento de diálogo socrático 
              y su conexión con el mapa conceptual del Sistema Lagrange.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveFilter(null)}
              className={cn(
                "px-4 py-2 rounded-full text-sm transition-all border",
                !activeFilter
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              Todos
            </button>
            {lagrangeAxes.map((axis) => (
              <button
                key={axis.id}
                onClick={() => setActiveFilter(axis.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm transition-all border flex items-center gap-2",
                  activeFilter === axis.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                )}
              >
                <span
                  className="w-2 h-2 rounded-full bg-yellow-400"
                />
                {axis.name.split("→")[0].trim()}
              </button>
            ))}
          </div>

          {/* Chapters Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredChapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="animate-fade-in"
              >
                <ChapterCard chapter={chapter} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredChapters.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                No hay capítulos en este eje todavía.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
