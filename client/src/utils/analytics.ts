import type { AnalyticsEvent, WindowWithGtag } from "@/types";

/**
 * Type-safe analytics helper for Google Analytics
 */
export const trackEvent = (event: AnalyticsEvent): void => {
  const windowWithGtag = window as WindowWithGtag;
  
  if (typeof window !== 'undefined' && windowWithGtag.gtag) {
    const { event: eventName, ...parameters } = event;
    windowWithGtag.gtag('event', eventName, parameters);
  }
};

// Convenience functions for common events
export const trackArtworkView = (series: string, work: string): void => {
  trackEvent({ event: 'view_artwork', series, work });
};

export const trackSeriesView = (series: string): void => {
  trackEvent({ event: 'view_series', series });
};

export const trackSoundPlay = (project: string, track?: string): void => {
  const eventData: AnalyticsEvent = track 
    ? { event: 'play_sound', project, track }
    : { event: 'play_sound', project };
  trackEvent(eventData);
};

export const trackEmailCopy = (method: string): void => {
  trackEvent({ event: 'copy_email', method });
};

export const trackPortfolioDownload = (bytes: number, version: string): void => {
  trackEvent({ event: 'download_portfolio', bytes, version });
};

export const trackPressKitOpen = (method: string): void => {
  trackEvent({ event: 'press_kit_open', method });
};