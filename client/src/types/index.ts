// Domain types for the artist portfolio application

export interface Artist {
  name: string;
  statement: string;
  email: string;
  website?: string;
  social?: {
    instagram?: string;
    soundcloud?: string;
    bandcamp?: string;
  };
}

export interface Artwork {
  id: string;
  title: string;
  year: string;
  medium: string;
  dimensions?: string;
  price?: string;
  availability: 'Available' | 'Sold' | 'On loan' | 'Private collection';
  imageUrl: string;
  description?: string;
  series?: string;
  slug: string;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  year: string;
  description: string;
  intro?: string;
  imageUrl: string;
  artworks: Artwork[];
}

export interface SoundProject {
  id: string;
  title: string;
  year: string;
  description: string;
  slug: string;
  imageUrl: string;
  audioUrl?: string;
  platforms?: {
    soundcloud?: string;
    bandcamp?: string;
    spotify?: string;
  };
  tracks?: Track[];
}

export interface Track {
  id: string;
  title: string;
  duration?: string;
  audioUrl?: string;
}

export interface Exhibition {
  title: string;
  venue: string;
  location: string;
  year: string;
  type: 'Solo' | 'Group';
}

export interface GalleryItem {
  id: string;
  title: string;
  year: string;
  medium: string;
  imageUrl: string;
  linkUrl: string;
  type: 'artwork' | 'sound_project' | 'series';
}

// Layout and UI component props
export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl';
}

export interface GridProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  paddingY?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'artwork' | 'series' | 'sound';
  className?: string;
}

// Analytics event types
export type AnalyticsEvent = 
  | { event: 'view_artwork'; series: string; work: string }
  | { event: 'view_series'; series: string }
  | { event: 'play_sound'; project: string; track?: string }
  | { event: 'copy_email'; method: string }
  | { event: 'download_portfolio'; bytes: number; version: string }
  | { event: 'press_kit_open'; method: string };

export interface WindowWithGtag extends Window {
  gtag?: (event: string, action: string, parameters: Record<string, unknown>) => void;
}