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

// src/App.tsx — заменить всю функцию RouteManager на это
function RouteManager() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Отключаем восстановление скролла браузером
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch {}
    }

    // Всегда скроллим вверх при смене маршрута
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // ВАЖНО: фокус на #page-title/… больше НЕ ставим,
    // чтобы не появлялась рамка фокуса на заголовке.
  }, [location]);

  return null;
}
// function RouteManager() {
//   const [location] = useLocation();

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     // выключаем нативное восстановление скролла при back/forward
//     if ("scrollRestoration" in window.history) {
//       try {
//         window.history.scrollRestoration = "manual";
//       } catch {}
//     }

//     // Всегда скроллим наверх при смене маршрута (в т.ч. при hash-роутинге)
//     window.scrollTo({ top: 0, left: 0, behavior: "auto" });

//     // Даем кадр(ы) на рендер и фокусим заголовок для доступности
//     const ids = ["page-title", "series-title", "artwork-title", "project-title"];
//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         for (const id of ids) {
//           const el = document.getElementById(id) as HTMLElement | null;
//           if (el) { el.focus?.(); break; }
//         }
//       });
//     });
//   }, [location]);

//   return null;
// }


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
