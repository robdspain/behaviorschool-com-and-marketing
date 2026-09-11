import fs from 'fs';
import path from 'path';
import type { Video } from '@/types/video';

const VIDEOS_PATH = path.join(process.cwd(), 'public', 'data', 'videos.json');

export function getVideos(): Video[] {
  try {
    const data = JSON.parse(fs.readFileSync(VIDEOS_PATH, 'utf8')) as { videos?: Video[] };
    return data.videos ?? [];
  } catch (error) {
    console.error('Error loading videos:', error);
    return [];
  }
}

/**
 * A video is publishable only when it points at a real recording. Entries created in the
 * admin before the recording exists carry a PLACEHOLDER YouTube URL; those must not be
 * rendered, linked, or listed in the sitemap.
 */
export function isPublishedVideo(video: Video): boolean {
  const url = video.videoUrl?.trim() ?? '';
  if (!url) return false;
  if (/placeholder/i.test(url)) return false;
  if (/[?&]v=(?:$|&)/.test(url)) return false;
  return true;
}

export function getPublishedVideos(): Video[] {
  return getVideos().filter(isPublishedVideo);
}

export function getPublishedVideoBySlug(slug: string): Video | null {
  return getPublishedVideos().find((video) => video.slug === slug) ?? null;
}
