import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { episodes } from "@/data/episodes";
import { chapters } from "@/data/chapters";
import { useState, useRef, useEffect } from "react";

export default function EpisodeDetail() {
  const { id } = useParams<{ id: string }>();
  const episodeId = parseInt(id || "0", 10);
  const episode = episodes.find((e) => e.id === episodeId);
  const chapter = episode ? chapters.find((c) => c.episodeId === episode.id) : null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Navigation
  const currentIndex = episodes.findIndex((e) => e.id === episodeId);
  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

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

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
  };

  if (!episode) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Episodio no encontrado</h1>
            <Link to="/podcast">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al podcast
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
            to="/podcast"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al podcast
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Temporada {episode.season}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  Episodio {episode.id}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(episode.publishedAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                {episode.title}
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                {episode.description}
              </p>
            </header>

            {/* Audio Player */}
            <section className="mb-12">
              <div className="bg-card border border-border rounded-lg p-6">
                <audio
                  ref={audioRef}
                  src={episode.audioUrl || `${import.meta.env.BASE_URL}episodes/Silenciar_la_conciencia_por_miedo_a_la_exclusión001.m4a`}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Progress */}
                <div className="space-y-2 mb-6">
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

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => skip(-15)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="node"
                      size="icon"
                      className="h-14 w-14 rounded-full"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-0.5" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => skip(30)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="hidden md:flex items-center gap-2 w-32">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={[volume]}
                      onValueChange={(v) => setVolume(v[0])}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Chapter link */}
            {chapter && (
              <section className="mb-12">
                <h2 className="font-display text-xl font-semibold mb-4">
                  Capítulo asociado
                </h2>
                <Link
                  to={`/capitulos/${chapter.slug}`}
                  className="block bg-card border border-border rounded-lg p-6 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                      <span className="font-display text-lg text-primary font-bold">
                        {chapter.id.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-primary uppercase tracking-wider">
                        {chapter.lagrangeTag}
                      </span>
                      <h3 className="font-display font-semibold">
                        {chapter.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                    {chapter.summary}
                  </p>
                </Link>
              </section>
            )}

            {/* Episode Navigation */}
            <nav className="flex justify-between items-center pt-8 border-t border-border">
              {prevEpisode ? (
                <Link
                  to={`/podcast/${prevEpisode.id}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-wider">Anterior</p>
                    <p className="font-semibold">{prevEpisode.title}</p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextEpisode && (
                <Link
                  to={`/podcast/${nextEpisode.id}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-right"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wider">Siguiente</p>
                    <p className="font-semibold">{nextEpisode.title}</p>
                  </div>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              )}
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}
