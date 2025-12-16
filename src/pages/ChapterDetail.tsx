import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Volume2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { chapters, lagrangeAxes } from "@/data/chapters";
import { episodes } from "@/data/episodes";
import { useState, useRef, useEffect } from "react";

export default function ChapterDetail() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = chapters.find((c) => c.slug === slug);
  const axis = chapter ? lagrangeAxes.find((a) => a.id === chapter.axis) : null;
  const episode = chapter ? episodes.find((e) => e.id === chapter.episodeId) : null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Find related chapters in same axis
  const relatedChapters = chapter
    ? chapters.filter((c) => c.axis === chapter.axis && c.id !== chapter.id).slice(0, 3)
    : [];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration || 0;
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!chapter) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Capítulo no encontrado</h1>
            <Link to="/capitulos">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a capítulos
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <Link
            to="/capitulos"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a capítulos
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center border-2 node-glow"
                  style={{
                    borderColor: axis?.color,
                    backgroundColor: `${axis?.color}20`,
                  }}
                >
                  <span
                    className="font-display text-2xl font-bold"
                    style={{ color: axis?.color }}
                  >
                    {chapter.id.toString().padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <span
                    className="text-xs uppercase tracking-wider font-medium px-2 py-1 rounded"
                    style={{
                      color: axis?.color,
                      backgroundColor: `${axis?.color}20`,
                    }}
                  >
                    {chapter.lagrangeTag}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {axis?.name}
                  </p>
                </div>
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                {chapter.title}
              </h1>
            </header>

            {/* Audio Player */}
            {episode && (
              <section className="mb-12">
                <div className="bg-card border border-border rounded-lg p-6">
                  <audio
                    ref={audioRef}
                    src={episode.audioUrl || `${import.meta.env.BASE_URL}episodes/Silenciar_la_conciencia_por_miedo_a_la_exclusión001.m4a`}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                  />

                  <div className="flex items-center gap-4 mb-4">
                    <Button
                      variant="node"
                      size="icon"
                      className="h-14 w-14 rounded-full shrink-0"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-0.5" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold">
                        Episodio {episode.id}: {episode.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {episode.duration}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Slider
                      value={[progress]}
                      onValueChange={handleProgressChange}
                      max={100}
                      step={0.1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime((progress / 100) * duration)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-2 mt-4 w-32">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={[volume]}
                      onValueChange={(v) => setVolume(v[0])}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Summary */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">
                Resumen
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {chapter.summary}
              </p>
            </section>

            {/* Dialogue */}
            {chapter.dialogue && (
              <section className="mb-12">
                <h2 className="font-display text-2xl font-semibold mb-4">
                  Diálogo Socrático
                </h2>
                <div className="bg-secondary/30 border-l-4 rounded-r-lg p-6" style={{ borderColor: axis?.color }}>
                  {chapter.dialogue.split("\n").map((line, i) => (
                    <p
                      key={i}
                      className={`text-lg italic ${
                        line.startsWith("—¿") || line.startsWith("—Pero")
                          ? "text-muted-foreground"
                          : "text-foreground"
                      } ${i > 0 ? "mt-3" : ""}`}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Related Chapters */}
            {relatedChapters.length > 0 && (
              <section className="mt-16 pt-12 border-t border-border">
                <h2 className="font-display text-xl font-semibold mb-6">
                  Capítulos relacionados en este eje
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {relatedChapters.map((c) => (
                    <Link
                      key={c.id}
                      to={`/capitulos/${c.slug}`}
                      className="block bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{
                            backgroundColor: `${axis?.color}20`,
                            color: axis?.color,
                          }}
                        >
                          {c.id}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {c.lagrangeTag}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold">{c.title}</h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Link to map */}
            <div className="mt-12 text-center">
              <Link to="/sistema-lagrange">
                <Button variant="constellation">
                  Ver en el Mapa Lagrange
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
