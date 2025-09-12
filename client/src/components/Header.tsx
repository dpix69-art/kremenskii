import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/content/ContentProvider";

interface HeaderProps {
  artistName?: string;
}

type NavItem = { title: string; path: string }; // path вида "/gallery"

function normalizePath(p?: string): string {
  if (!p) return "/";
  // принимаем "#/gallery" или "/gallery" → приводим к "/gallery"
  if (p.startsWith("#/")) return p.slice(1);
  return p;
}

export default function Header({ artistName: artistNameProp }: HeaderProps) {
  const { content } = useContent();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // const artistName = artistNameProp ?? content?.site?.artistName ?? "Dmitrii Kremenskii";
  const artistName = content?.site?.artistName ?? artistNameProp ?? "Dmitrii Kremenskii";
  // Навигация: content.json (nav/navigation) → дефолт
  const navBase = ((content?.nav || content?.navigation || []) as any[]);
  const navFromJson: NavItem[] = navBase
    .map((n: any) => ({
      title: String(n.title ?? n.label ?? "").trim(),
      path: normalizePath(String(n.path ?? n.href ?? "/")),
    }))
    .filter((n: NavItem) => n.title && n.path);

  const navItems: NavItem[] =
    navFromJson.length > 0
      ? navFromJson
      : [
          { title: "Gallery", path: "/gallery" },
          { title: "Sounds", path: "/sounds" },
          { title: "Statement", path: "/statement" },
          { title: "Contacts", path: "/contacts" },
        ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location === path || location.startsWith(path + "/");
  };

  return (
    <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Artist Name */}
          <Link href="/" data-testid="link-home" className="cursor-pointer" aria-label="Home">
            <div
              className="text-type-h3 font-semibold text-foreground"
              data-testid="text-header-artist-name"
            >
              {artistName}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-${item.title.toLowerCase()}`}>
                <span
                  className={`text-type-small transition-colors hover:text-foreground/80 ${
                    isActive(item.path) ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            data-testid="button-mobile-menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav id="mobile-nav" className="md:hidden py-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-link-${item.title.toLowerCase()}`}
                >
                  <span
                    className={`block py-2 text-type-small transition-colors hover:text-foreground/80 ${
                      isActive(item.path) ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                    aria-current={isActive(item.path) ? "page" : undefined}
                  >
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
