import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useContent } from "@/content/ContentProvider";

type NavItem = { title: string; path: string };

function normalizePath(p?: string): string {
  if (!p) return "/";
  // поддерживаем "#/gallery" и "/gallery"
  return p.startsWith("#/") ? p.slice(1) : p;
}

export default function NotFound() {
  const [location] = useLocation();
  const { content } = useContent();

  const navItems: NavItem[] =
    (content?.nav || content?.navigation || [])
      .map((n: any) => ({
        title: String(n.title ?? n.label ?? "").trim(),
        path: normalizePath(String(n.path ?? n.href ?? "/")),
      }))
      .filter((n: NavItem) => n.title && n.path)
      .slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 section-py">
        <div className="site-container">
          <Card className="max-w-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <h1 className="text-type-h3 font-semibold">404 — Page not found</h1>
            </div>

              <p className="text-type-body text-muted-foreground mb-6">
                We couldn’t find&nbsp;
                <span className="font-mono text-foreground">{location}</span>.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/">← Back home</Link>
                </Button>

                {navItems.map((item) => (
                  <Button key={item.path} variant="outline" asChild>
                    <Link href={item.path}>{item.title}</Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer year={new Date().getFullYear()} />
    </div>
  );
}
