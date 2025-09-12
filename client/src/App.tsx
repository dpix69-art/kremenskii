import { Switch, Route, useLocation } from "wouter";
import { useEffect, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CookiesBanner from "@/components/CookiesBanner";
import ErrorBoundary from "@/components/ui/error-boundary";
import LoadingFallback from "@/components/ui/loading-fallback";
import {
  HomePage,
  GalleryPage,
  SeriesPage as LazySeriesPage,
  ArtworkDetailPage,
  SoundsPage,
  SoundProjectDetailPage,
  StatementPage,
  ContactsPage,
  ImpressumPage,
  NotFoundPage
} from "@/components/ui/lazy-routes";

// Content routes that need scroll-to-top and focus management
const CONTENT_ROUTES = [
  /^\/gallery(\/[^\/]+)?(\/[^\/]+)?$/, // /gallery, /gallery/:series, /gallery/:series/:slug
  /^\/sounds(\/[^\/]+)?$/, // /sounds, /sounds/:slug
  /^\/statement$/,
  /^\/contacts$/,
  /^\/impressum$/
];

function RouteManager() {
  const [location] = useLocation();

  useEffect(() => {
    // Check if current route is a content route
    const isContentRoute = CONTENT_ROUTES.some(pattern => pattern.test(location));
    
    if (isContentRoute) {
      // Check if URL has a hash
      const hasHash = window.location.hash.length > 0;
      
      if (!hasHash) {
        // Immediately scroll to top
        window.scrollTo(0, 0);
        
        // Focus main heading after a brief delay to ensure DOM is ready
        setTimeout(() => {
          // Try different heading IDs in order of priority
          const headingSelectors = ['#page-title', '#series-title', '#artwork-title', '#project-title'];
          
          for (const selector of headingSelectors) {
            const heading = document.querySelector(selector);
            if (heading) {
              (heading as HTMLElement).focus();
              break;
            }
          }
        }, 50);
      }
      // If has hash, let browser handle naturally
    }
  }, [location]);

  return null;
}

function Router() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <RouteManager />
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/gallery" component={GalleryPage} />
          <Route path="/gallery/:series" component={LazySeriesPage} />
          <Route path="/gallery/:series/:slug" component={ArtworkDetailPage} />
          <Route path="/sounds" component={SoundsPage} />
          <Route path="/sounds/:slug" component={SoundProjectDetailPage} />
          <Route path="/statement" component={StatementPage} />
          <Route path="/contacts" component={ContactsPage} />
          <Route path="/impressum" component={ImpressumPage} />
          {/* Fallback to 404 */}
          <Route component={NotFoundPage} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <CookiesBanner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
