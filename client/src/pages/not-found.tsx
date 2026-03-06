import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 section-py">
        <div className="site-container">
          <h1 className="text-type-h1 font-semibold mb-4">404 — Page not found</h1>
          <p className="text-type-body text-muted-foreground mb-8">
            We couldn't find <code className="text-foreground font-mono">{location}</code>
          </p>
          <Link href="/">
            <span className="text-type-body text-foreground underline underline-offset-3 hover:opacity-70 transition-opacity cursor-pointer">
              ← Back home
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
