import { Switch, Route, useLocation } from "wouter";
import { useEffect, Suspense, lazy } from "react";
import CookiesBanner from "@/components/CookiesBanner";

// Lazy-loaded pages
const HomePage = lazy(() => import("@/pages/Home"));
const GalleryPage = lazy(() => import("@/pages/Gallery"));
const SeriesPage = lazy(() => import("@/pages/SeriesPage"));
const ArtworkDetailPage = lazy(() => import("@/pages/ArtworkDetailPage"));
const SoundsPage = lazy(() => import("@/pages/Sounds"));
const SoundProjectDetailPage = lazy(() => import("@/pages/SoundProjectDetailPage"));
const StatementPage = lazy(() => import("@/pages/Statement"));
const ContactsPage = lazy(() => import("@/pages/Contacts"));
const ImpressumPage = lazy(() => import("@/pages/Impressum"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));

// Scroll to top on route change
function RouteManager() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      try { window.history.scrollRestoration = "manual"; } catch {}
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}

// Minimal loading state — just a thin line
function LoadingFallback() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: "2px",
      background: "currentColor", opacity: 0.15, zIndex: 9999,
      animation: "loading 1.2s ease infinite",
    }} />
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouteManager />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/gallery/:series" component={SeriesPage} />
        <Route path="/gallery/:series/:slug" component={ArtworkDetailPage} />
        <Route path="/sounds" component={SoundsPage} />
        <Route path="/sounds/:slug" component={SoundProjectDetailPage} />
        <Route path="/statement" component={StatementPage} />
        <Route path="/contacts" component={ContactsPage} />
        <Route path="/impressum" component={ImpressumPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Suspense>
  );
}

export default function App() {
  return (
    <>
      <Router />
      <CookiesBanner />
    </>
  );
}
