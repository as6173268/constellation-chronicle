import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

interface AudioPlayerProps {
  title: string;
  duration?: string;
  episodeNumber?: number;
  audioUrl?: string;
  onDownload?: () => void;
}

export function AudioPlayer({ 
  title, 
  duration = "00:00", 
  episodeNumber = 1,
  audioUrl,
  onDownload
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [volume, setVolume] = useState([80]);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState(duration);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update audio element volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = (volume[0] / 100);
    }
  }, [volume]);

  // Handle audio play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setError('Error al reproducir el audio');
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Format time MM:SS
  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    if (duration > 0) {
      setProgress([Math.round((currentTime / duration) * 100)]);
      setCurrentTime(formatTime(currentTime));
      setTotalTime(formatTime(duration));
    }
  };

  // Handle progress bar change
  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = (value[0] / 100) * (audioRef.current.duration || 0);
    audioRef.current.currentTime = newTime;
    setProgress(value);
  };

  // Handle audio loading
  const handleCanPlay = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('No se puede cargar el audio');
    setIsPlaying(false);
  };

  // Handle play button
  const togglePlay = () => {
    if (!audioUrl) {
      setError('URL de audio no disponible');
      return;
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          crossOrigin="anonymous"
          onTimeUpdate={handleTimeUpdate}
          onCanPlay={handleCanPlay}
          onLoadStart={handleLoadStart}
          onError={handleError}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="flex flex-col gap-4">
        {/* Episode Info */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30 node-glow">
            <span className="font-display text-xl md:text-2xl text-primary font-bold">
              {episodeNumber.toString().padStart(2, "0")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Episodio {episodeNumber}
            </p>
            <h3 className="font-display text-lg md:text-xl font-semibold truncate">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{totalTime}</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded p-3">
            {error}
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={progress}
            onValueChange={handleProgressChange}
            max={100}
            step={1}
            className="w-full"
            disabled={!audioUrl || isLoading}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentTime}</span>
            <span>{totalTime}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              disabled={!audioUrl || isLoading}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="node"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={togglePlay}
              disabled={!audioUrl || isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              disabled={!audioUrl || isLoading}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume + Download */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-2 w-32">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            {onDownload && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={onDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
