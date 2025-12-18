/**
 * AudioUpload Component
 * Permite a los editores subir archivos de audio a Supabase Storage
 */

import { useState, useRef } from "react";
import { Upload, File, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { uploadAudio, updateEpisodeAudioUrl, UploadProgress } from "@/services/audioService";

interface AudioUploadProps {
  episodeId: number;
  onUploadSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function AudioUpload({ episodeId, onUploadSuccess, onError }: AudioUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!['audio/mpeg', 'audio/mp4', 'audio/m4a', 'audio/wav'].includes(file.type)) {
      setError('Tipo de archivo no soportado. Usa MP3, MP4, M4A o WAV');
      return;
    }

    // Validar tamaño (máx 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('Archivo demasiado grande. Máximo 100MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // Simular progreso
      setProgress({ loaded: 0, total: selectedFile.size, percentage: 0 });

      // Subir archivo
      const result = await uploadAudio(selectedFile, (prog) => {
        setProgress(prog);
      });

      if (!result) {
        throw new Error('Error al subir el archivo');
      }

      // Actualizar base de datos
      const updated = await updateEpisodeAudioUrl(episodeId, result.url);
      if (!updated) {
        throw new Error('Error al guardar la URL en la base de datos');
      }

      setProgress({ loaded: selectedFile.size, total: selectedFile.size, percentage: 100 });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onUploadSuccess?.(result.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      onError?.(message);
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(null), 1000);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Subir Audio</h3>

      {/* File Input */}
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full justify-start"
        >
          <Upload className="h-4 w-4 mr-2" />
          {selectedFile ? selectedFile.name : 'Seleccionar archivo de audio'}
        </Button>
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="bg-secondary/50 border border-border rounded p-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <File className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {progress && (
        <div className="mb-4">
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {progress.percentage}% • {(progress.loaded / 1024 / 1024).toFixed(2)} MB de {(progress.total / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded p-3 mb-4 flex gap-2">
          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="flex-1"
        >
          {isUploading ? 'Subiendo...' : 'Subir Audio'}
        </Button>
        {selectedFile && (
          <Button
            variant="outline"
            onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            disabled={isUploading}
          >
            Cancelar
          </Button>
        )}
      </div>

      {/* Help Text */}
      <p className="text-xs text-muted-foreground mt-4">
        Formatos soportados: MP3, MP4, M4A, WAV • Máximo 100MB
      </p>
    </div>
  );
}
