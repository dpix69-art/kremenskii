/**
 * GitHub Pages utilities for handling base URLs and asset paths
 */

// Get the base URL for GitHub Pages deployment
export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use the current base URL
    return document.querySelector('base')?.href ?? '/';
  }
  // Server-side: use environment or default
  return import.meta.env.BASE_URL ?? '/';
};

// Resolve asset path with base URL
export const resolveAssetPath = (path: string): string => {
  const baseUrl = getBaseUrl();
  // Remove leading slash from path to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Ensure base URL ends with slash
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${cleanBase}${cleanPath}`;
};

// Check if running on GitHub Pages
export const isGitHubPages = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.location.hostname.endsWith('.github.io');
  }
  return import.meta.env.PROD && import.meta.env.BASE_URL !== '/';
};

// Get the repository name from base URL (for GitHub Pages)
export const getRepositoryName = (): string => {
  const baseUrl = getBaseUrl();
  if (baseUrl === '/') return '';
  // Extract repository name from base URL like '/repository-name/'
  const match = baseUrl.match(/\/([^\/]+)\/$/);
  return match ? match[1] : '';
};