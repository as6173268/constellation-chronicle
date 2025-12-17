import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { EpisodeMarkdown } from "@/components/EpisodeMarkdown";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Map } from "lucide-react";
import { getEpisodeBySlug, getChapters } from "@/services/podcastService";
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import lagrangeMap from "@/data/lagrange/lagrange_map.json";

export default function Episode() {
  const { slug } = useParams<{ slug: string }>();
  const episode = pipe(
    getEpisodeBySlug(slug!),
    O.getOrElse(() => null as any)
  );
  const chapters = getChapters();
  const chapter = chapters.find(c => c.id === episode?.chapterId);

  if (!episode) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold">Episodio no encontrado</h1>
          </div>
        </main>
      </div>
    );
  }

  // Find associated questions
  const associatedQuestions = lagrangeMap.preguntas.filter(q =>
    q.episodios.includes(`E${episode.id}`)
  );

  // Assume audio file naming convention
  const audioFileName = `episode_${episode.id}.m4a`; // Adjust as needed
  const audioUrl = `${import.meta.env.BASE_URL}episodes/${audioFileName}`;

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link to="/podcast">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Podcast
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {episode.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {episode.description}
            </p>
            <div className="text-sm text-muted-foreground mb-6">
              Duración: {episode.duration} | Temporada {episode.season}
            </div>

            {/* Audio Player */}
            <div className="mb-8">
              <audio
                controls
                controlsList="nodownload"
                preload="auto"
                className="w-full"
                src={audioUrl}
              >
                Tu navegador no soporta la reproducción de audio.
              </audio>
            </div>

            {/* Transcript */}
            <div className="mb-8">
              <h2 className="font-display text-2xl font-semibold mb-4">Transcripción</h2>
              <EpisodeMarkdown slug={`ep_${episode.id.toString().padStart(3, '0')}`} />
            </div>

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

            {/* Related Chapter */}
            {chapter && (
              <div className="mb-8">
                <h2 className="font-display text-2xl font-semibold mb-4">Capítulo Relacionado</h2>
                <Link to={`/capitulos/${chapter.slug}`}>
                  <Button variant="outline">
                    Ver Capítulo: {chapter.title}
                  </Button>
                </Link>
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