/**
 * Video Types
 * For the BehaviorSchool video library system
 */

export type VideoCategory = 'Exam Prep' | 'School BCBA Tips' | 'Tool Tutorials';

export type VideoSource = 'youtube' | 'vimeo' | 'upload';

export interface Video {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: VideoCategory;
  
  // Video source - can be YouTube URL, Vimeo URL, or direct file URL
  videoUrl: string;
  videoSource: VideoSource;
  
  // Optional thumbnail (if not using platform default)
  thumbnailUrl?: string;
  
  // Optional transcript
  transcript?: string;
  
  // Metadata
  duration?: number; // in seconds
  publishedAt: string; // ISO date
  updatedAt?: string; // ISO date
  
  // Display order within category
  order: number;
  
  // SEO
  metaDescription?: string;
  keywords?: string[];
}

export interface VideoLibrary {
  videos: Video[];
  lastUpdated: string;
}
