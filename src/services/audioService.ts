/**
 * Audio Storage Service
 * Maneja upload, descarga y streaming de archivos de audio desde Supabase Storage
 */

import { supabase } from '@/integrations/supabase/client';

const BUCKET_NAME = 'podcast-episodes';
const AUDIO_MIME_TYPES = ['audio/mpeg', 'audio/mp4', 'audio/m4a', 'audio/wav'];

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Obtener URL pública de un archivo de audio
 */
export async function getAudioUrl(fileName: string): Promise<string | null> {
  try {
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);
    
    return data?.publicUrl || null;
  } catch (error) {
    console.error('Error getting audio URL:', error);
    return null;
  }
}

/**
 * Subir un archivo de audio a Supabase Storage
 */
export async function uploadAudio(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ path: string; url: string } | null> {
  // Validar tipo de archivo
  if (!AUDIO_MIME_TYPES.includes(file.type)) {
    throw new Error(`Tipo de archivo no soportado. Usa: ${AUDIO_MIME_TYPES.join(', ')}`);
  }

  // Validar tamaño (máx 100MB)
  const MAX_FILE_SIZE = 100 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`El archivo es demasiado grande. Máximo: 100MB`);
  }

  try {
    // Crear nombre único para el archivo
    const timestamp = new Date().getTime();
    const ext = file.name.split('.').pop();
    const fileName = `episode_${timestamp}.${ext}`;

    // Simular progreso (Supabase no proporciona callback de progreso directamente)
    if (onProgress) {
      onProgress({ loaded: 0, total: file.size, percentage: 0 });
    }

    // Subir archivo
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    if (onProgress) {
      onProgress({ loaded: file.size, total: file.size, percentage: 100 });
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return {
      path: fileName,
      url: urlData?.publicUrl || `https://cadavbabblukuabioekc.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${fileName}`,
    };
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw error;
  }
}

/**
 * Eliminar un archivo de audio de Supabase Storage
 */
export async function deleteAudio(fileName: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting audio:', error);
    return false;
  }
}

/**
 * Listar todos los archivos de audio
 */
export async function listAudioFiles(): Promise<Array<{ name: string; url: string }>> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list();

    if (error) throw error;

    return (data || []).map(file => {
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(file.name);

      return {
        name: file.name,
        url: urlData?.publicUrl || '',
      };
    });
  } catch (error) {
    console.error('Error listing audio files:', error);
    return [];
  }
}

/**
 * Actualizar URL de audio en la tabla episodes
 */
export async function updateEpisodeAudioUrl(
  episodeId: number,
  audioUrl: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('episodes')
      .update({ audio_url: audioUrl })
      .eq('id', episodeId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating episode audio URL:', error);
    return false;
  }
}

/**
 * Crear el bucket si no existe (para desarrollo local)
 */
export async function initializeAudioBucket(): Promise<boolean> {
  try {
    // Intentar listar - si funciona, el bucket ya existe
    await supabase.storage.from(BUCKET_NAME).list();
    return true;
  } catch (error) {
    console.warn('Audio bucket might not exist:', error);
    return false;
  }
}
