import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

interface AudioPlayerProps {
  title: string;
  duration: string;
  episodeNumber: number;
  audioUrl?: string;
}

export function AudioPlayer({ title, duration, episodeNumber, audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioSrc = audioUrl || `${import.meta.env.BASE_URL}episodes/Silenciar_la_conciencia_por_miedo_a_la_exclusión001.m4a`;

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
      setCurrentDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current || !currentDuration) return;
    const newTime = (value[0] / 100) * currentDuration;
    audioRef.current.currentTime = newTime;
    setProgress(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const skip = (seconds: number) => {
    if (!audioRef.current || !currentDuration) return;
    audioRef.current.currentTime = Math.max(0, Math.min(currentDuration, audioRef.current.currentTime + seconds));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex flex-col gap-4">
        {/* Episode Info */}
        <div className="flex items-start gap-4">
          <Link to={`/podcast/${episodeNumber}`}>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30 node-glow hover:border-primary/50 transition-colors">
              <span className="font-display text-xl md:text-2xl text-primary font-bold">
                {episodeNumber.toString().padStart(2, "0")}
              </span>
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Episodio {episodeNumber}
            </p>
            <Link to={`/podcast/${episodeNumber}`}>
              <h3 className="font-display text-lg md:text-xl font-semibold truncate hover:text-primary transition-colors">
                {title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">{duration}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[progress]}
            onValueChange={handleProgressChange}
            max={100}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime((progress / 100) * currentDuration)}</span>
            <span>{currentDuration ? formatTime(currentDuration) : duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => skip(-15)}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="node"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => skip(30)}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2 w-32">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              onValueChange={(v) => setVolume(v[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
