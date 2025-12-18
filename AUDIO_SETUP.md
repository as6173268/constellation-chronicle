# 🎵 Audio Storage Setup Guide

## Overview

Sistema Lagrange includes a complete audio storage and streaming system powered by Supabase Storage. This guide explains how to set up audio files for podcast episodes.

---

## Architecture

```
User's Browser
    ↓
AudioPlayer Component (plays)
    ↓
Supabase Storage API
    ↓
Podcast Episodes Bucket
    ↓
MP3/M4A Audio Files (Public)
```

---

## Step 1: Create Storage Bucket

### In Supabase Dashboard:

1. Go to: https://app.supabase.com
2. Select project: `cadavbabblukuabioekc`
3. Click "Storage" (left sidebar)
4. Click "New bucket"
5. Name: `podcast-episodes`
6. ✅ Make public: YES
7. Click "Create bucket"

---

## Step 2: Upload Audio Files

### Option A: Manual Upload via Dashboard

1. Open bucket: `podcast-episodes`
2. Click "Upload"
3. Select your MP3 files
4. Wait for upload to complete

### Option B: Use AudioUpload Component

```typescript
import { AudioUpload } from '@/components/AudioUpload';

function EpisodeEditor() {
  return (
    <AudioUpload 
      episodeId={1}
      onUploadSuccess={(url) => console.log('Audio uploaded:', url)}
      onError={(error) => console.error('Upload failed:', error)}
    />
  );
}
```

---

## Step 3: Get Public URLs

Each uploaded file automatically gets a public URL:

```
https://cadavbabblukuabioekc.supabase.co/storage/v1/object/public/podcast-episodes/episode_12345.mp3
```

---

## Step 4: Update Episode in Database

### Option A: SQL Query (Manual)

```sql
UPDATE episodes
SET audio_url = 'https://cadavbabblukuabioekc.supabase.co/storage/v1/object/public/podcast-episodes/episode_01.mp3'
WHERE id = 1;
```

### Option B: Programmatic (Recommended)

```typescript
import { updateEpisodeAudioUrl } from '@/services/audioService';

const success = await updateEpisodeAudioUrl(1, audioUrl);
```

---

## Step 5: Test Audio Playback

1. Open your app: http://localhost:5173
2. Navigate to an episode with `audio_url` set
3. Click play button in AudioPlayer
4. Verify audio plays

---

## Audio Service API

### `audioService.ts` Functions

#### getAudioUrl(fileName)
Get public URL for a file:
```typescript
const url = await getAudioUrl('episode_01.mp3');
```

#### uploadAudio(file, onProgress?)
Upload a file to storage:
```typescript
const result = await uploadAudio(file, (progress) => {
  console.log(`${progress.percentage}% uploaded`);
});
console.log(result.url); // Public URL
```

#### deleteAudio(fileName)
Delete a file from storage:
```typescript
await deleteAudio('episode_01.mp3');
```

#### updateEpisodeAudioUrl(episodeId, audioUrl)
Update episode record with audio URL:
```typescript
await updateEpisodeAudioUrl(1, 'https://...');
```

#### listAudioFiles()
List all audio files:
```typescript
const files = await listAudioFiles();
files.forEach(f => console.log(f.name, f.url));
```

---

## useAudio Hook

Simplified hook for components:

```typescript
import { useAudio } from '@/hooks/useAudio';

function MyComponent() {
  const { isLoading, error, progress, upload } = useAudio({
    onSuccess: (url) => console.log('Success:', url),
    onError: (error) => console.error('Error:', error),
    onProgress: (progress) => console.log(`${progress.percentage}%`),
  });

  const handleUpload = async (file) => {
    const result = await upload(file);
  };

  return (
    <div>
      {progress && <p>{progress.percentage}%</p>}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
```

---

## AudioPlayer Component

Updated to support real audio:

```typescript
import { AudioPlayer } from '@/components/AudioPlayer';

function EpisodePage({ episode }) {
  return (
    <AudioPlayer
      title={episode.title}
      duration="33:45"
      episodeNumber={episode.id}
      audioUrl={episode.audio_url}
      onDownload={() => window.open(episode.audio_url)}
    />
  );
}
```

Features:
- ▶️ Play/Pause
- ⏩ Progress bar (click to seek)
- 🔊 Volume control
- 🔄 Current time / Total time display
- ⬇️ Download button
- ⚠️ Error handling
- 📦 Loading spinner

---

## Supported Formats

✅ MP3 (audio/mpeg)
✅ MP4 (audio/mp4)
✅ M4A (audio/m4a)
✅ WAV (audio/wav)

❌ OGG, FLAC, other formats

---

## File Size Limits

- **Maximum:** 100 MB per file
- **Recommended:** 50 MB (for faster streaming)
- **Minimum:** N/A

---

## RLS Policies

Public read access is enabled:

```sql
-- podcast-episodes bucket RLS
select: (true) -- Anyone can download
insert: (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'editor')
delete: (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'editor')
```

Only editors can upload/delete. Everyone can download.

---

## Troubleshooting

### "Error: bucket not found"
→ Bucket doesn't exist in Supabase
→ Create it manually via dashboard (Step 1)

### "Error: The resource was not found"
→ File doesn't exist in bucket
→ Check filename is correct
→ Re-upload file

### "Audio plays for a moment then stops"
→ File might be corrupted
→ Try different MP3 encoding
→ Test file locally first

### "CORS error when loading"
→ Bucket might not be public
→ Go to Storage settings, enable public access

### "Upload shows 0% and never progresses"
→ File might be too large (> 100MB)
→ Check file size, compress if needed
→ Try uploading smaller file first

---

## Performance Tips

1. **Compress audio** before uploading
   ```bash
   ffmpeg -i input.mp3 -q:a 5 output.mp3
   ```

2. **Use appropriate bitrate**
   - 128 kbps: Good quality, smaller file
   - 192 kbps: Better quality, medium file
   - 256 kbps: High quality, larger file

3. **Cache control**
   Files are cached for 1 hour by default. Update via:
   ```typescript
   cacheControl: '86400' // 24 hours
   ```

4. **Batch uploads**
   Upload multiple files at once to save time

---

## Integration with Episode Page

Example of fully integrated episode with audio:

```typescript
import { useEpisodeBySlug } from '@/hooks/useData';
import { AudioPlayer } from '@/components/AudioPlayer';

function EpisodePage() {
  const { slug } = useParams();
  const { episode, loading } = useEpisodeBySlug(slug);

  if (loading) return <div>Loading...</div>;
  if (!episode) return <div>Not found</div>;

  return (
    <div>
      <h1>{episode.title}</h1>
      <AudioPlayer
        title={episode.title}
        audioUrl={episode.audio_url}
        episodeNumber={episode.id}
        duration={episode.duration}
      />
      <p>{episode.description}</p>
    </div>
  );
}
```

---

## Monitoring & Analytics

Track downloads via Supabase logs:
1. Dashboard → Logs
2. Filter by storage bucket
3. See download statistics

---

## Next Steps

1. ✅ Create bucket (Step 1)
2. ✅ Upload files (Step 2)
3. ✅ Update DB with URLs (Step 4)
4. ✅ Test playback (Step 5)
5. 🔜 Implement editor dashboard (next feature)

---

**Last Updated:** 2025-12-18
**Audio Service Status:** ✅ Ready
**Components Status:** ✅ Ready
**Build Status:** ✅ Passing
