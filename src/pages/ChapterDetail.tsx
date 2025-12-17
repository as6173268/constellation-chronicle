import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Map, Play } from "lucide-react";
import { getChapterBySlug, getEpisodes } from "@/services/podcastService";
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import lagrangeMap from "@/data/lagrange/lagrange_map.json";

export default function ChapterDetail() {
  const { slug } = useParams<{ slug: string }>();

  const chapter = pipe(
    getChapterBySlug(slug!),
    O.getOrElse(() => null as any)
  );

  if (!chapter) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold">Capítulo no encontrado</h1>
          </div>
        </main>
      </div>
    );
  }

  // Find related episodes
  const relatedEpisodes = getEpisodes().filter(e => e.chapterId === chapter.id);

  // Find associated questions (through related episodes)
  const associatedQuestions = lagrangeMap.preguntas.filter(q =>
    q.episodios.some(ep => chapter.relatedEpisodes.includes(parseInt(ep.slice(1))))
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link to="/capitulos">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Capítulos
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {chapter.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {chapter.description}
            </p>

            {/* Theory Section */}
            <div className="mb-8">
              <h2 className="font-display text-2xl font-semibold mb-4">Teoría</h2>
              <div className="prose prose-lg max-w-none">
                {chapter.theory.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Related Episodes */}
            {relatedEpisodes.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-2xl font-semibold mb-4">Episodios Relacionados</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {relatedEpisodes.map(episode => (
                    <div key={episode.id} className="p-4 border border-border rounded-lg">
                      <h3 className="font-semibold mb-2">{episode.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {episode.description}
                      </p>
                      <Link to={`/podcast/${episode.id}`}>
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Escuchar Episodio
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Questions */}
            {associatedQuestions.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-2xl font-semibold mb-4">Preguntas Socráticas Asociadas</h2>
                <div className="space-y-4">
                  {associatedQuestions.map(q => (
                    <div key={q.id} className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        {q.eje} | {q.nivel} | {q.tension}
                      </p>
                      <p className="font-medium">{q.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links to Map */}
            <div className="text-center">
              <Link to="/mapa-lagrange">
                <Button>
                  <Map className="h-4 w-4 mr-2" />
                  Explorar en el Mapa Lagrange
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}