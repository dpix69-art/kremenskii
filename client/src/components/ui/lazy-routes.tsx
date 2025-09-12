import { lazy } from 'react';

// Lazy-loaded page components for better performance
export const HomePage = lazy(() => import('@/pages/Home'));
export const GalleryPage = lazy(() => import('@/pages/Gallery'));  
export const SeriesPage = lazy(() => import('@/pages/SeriesPage'));
export const ArtworkDetailPage = lazy(() => import('@/pages/ArtworkDetailPage'));
export const SoundsPage = lazy(() => import('@/pages/Sounds'));
export const SoundProjectDetailPage = lazy(() => import('@/pages/SoundProjectDetailPage'));
export const StatementPage = lazy(() => import('@/pages/Statement'));
export const ContactsPage = lazy(() => import('@/pages/Contacts'));
export const ImpressumPage = lazy(() => import('@/pages/Impressum'));
export const NotFoundPage = lazy(() => import('@/pages/not-found'));