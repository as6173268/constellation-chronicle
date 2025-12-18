/**
 * useAudio Hook
 * Maneja lógica de audio en componentes
 */

import { useState, useCallback } from 'react';
import { getAudioUrl, uploadAudio, deleteAudio, UploadProgress } from '@/services/audioService';

export interface UseAudioOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: UploadProgress) => void;
}

export function useAudio(options?: UseAudioOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const getUrl = useCallback(async (fileName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await getAudioUrl(fileName);
      if (!url) throw new Error('No se pudo obtener la URL del audio');
      return url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      options?.onError?.(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const upload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await uploadAudio(file, (prog) => {
        setProgress(prog);
        options?.onProgress?.(prog);
      });
      if (!result) throw new Error('Error al subir el archivo');
      options?.onSuccess?.(result.url);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      options?.onError?.(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const deleteFile = useCallback(async (fileName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await deleteAudio(fileName);
      if (!success) throw new Error('Error al eliminar el archivo');
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      options?.onError?.(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    isLoading,
    error,
    progress,
    getUrl,
    upload,
    deleteFile,
  };
}
