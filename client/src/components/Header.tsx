import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useContent } from "@/content/ContentProvider";

type NavItem = { title: string; path: string };

function normalizePath(p?: string): string {
  if (!p) return "/";
  // Support both "#/gallery" (legacy) and "/gallery"
  if (p.startsWith("#/")) return p.slice(1);
  if (p === "#/") return "/";
  return p;
}

export default function Header() {
  const { content } = useContent();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const artistName = content?.site?.artistName ?? "Dmitrii Kremenskii";

  const navItems: NavItem[] = (content?.nav || [])
    .map((n: any) => ({
      title: String(n.title ?? n.label ?? "").trim(),
      path: normalizePath(String(n.path ?? n.href ?? "/")),
    }))
    .filter((n: NavItem) => n.title && n.path && n.path !== "/");

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location === path || location.startsWith(path + "/");
  };

  return (
    <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-transparent">
      <div className="site-container">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link href="/" aria-label="Home">
            <span className="text-type-h3 font-semibold text-foreground tracking-tight cursor-pointer">
              {artistName}
            </span>
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span
                  className={`text-type-small tracking-wide transition-colors duration-200 cursor-pointer ${
                    isActive(item.path)
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 text-foreground"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="md:hidden pb-6 border-t border-border" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} onClick={() => setOpen(false)}>
                <span
                  className={`block py-3 text-type-small tracking-wide transition-colors duration-200 cursor-pointer ${
                    isActive(item.path)
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
