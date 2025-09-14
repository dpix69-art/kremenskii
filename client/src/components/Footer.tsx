import { Download, Instagram, Music2, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/content/ContentProvider";

interface FooterProps {
  artistName?: string;
  year?: number;
  portfolioPdfUrl?: string;
  socialLinks?: {
    instagram?: string;
    soundcloud?: string;
    bandcamp?: string;
  };
}

function extractSocials(raw: any): { instagram?: string; soundcloud?: string; bandcamp?: string } {
  const out: Record<string, string> = {};
  if (Array.isArray(raw)) {
    raw.forEach((s) => {
      const label = String(s?.label ?? s?.platform ?? "").toLowerCase();
      const href = String(s?.href ?? s?.url ?? "").trim();
      if (!href) return;
      if (label.includes("instagram")) out.instagram = href;
      if (label.includes("soundcloud")) out.soundcloud = href;
      if (label.includes("bandcamp")) out.bandcamp = href;
    });
  }
  return out;
}

export default function Footer({
  artistName,
  year = new Date().getFullYear(),
  portfolioPdfUrl,
  socialLinks = {},
}: FooterProps) {
  const { content } = useContent();

  const nameFromContent = content?.site?.artistName || "Dmitrii Kremenskii";
  const finalArtistName = artistName || nameFromContent;

  const portfolioFromContent = (content?.contacts?.portfolioPdf || "/files/kremenskii-portfolio.pdf").replace(/^\/+/, "");
  const finalPortfolio = (portfolioPdfUrl || portfolioFromContent).replace(/^\/+/, "");

  const socialsFromContent = extractSocials(content?.contacts?.socials);
  const finalSocials = { ...socialsFromContent, ...socialLinks }; // пропсы переопределяют content.json при наличии

  return (
    <footer className="w-full bg-background py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Copyright and Legal */}
          <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
            <a
              href="#/impressum"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-impressum"
            >
              Impressum
            </a>
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-2">
              <p className="text-sm text-muted-foreground">
                Stuttgart {year} © {finalArtistName}
              </p>
              <p className="text-sm text-muted-foreground">
                All rights reserved.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 lg:gap-6">
            {/* Portfolio Download */}
            {finalPortfolio && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open(finalPortfolio, "_blank")}
                data-testid="button-download-portfolio"
              >
                <Download size={14} />
                <span>Portfolio</span>
              </Button>
            )}

            {/* Social Links */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              {finalSocials.instagram && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(finalSocials.instagram!, "_blank")}
                  data-testid="link-instagram"
                >
                  <Instagram size={14} />
                  <span className="hidden sm:inline">Instagram</span>
                </Button>
              )}
              {finalSocials.soundcloud && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(finalSocials.soundcloud!, "_blank")}
                  data-testid="link-soundcloud"
                >
                <Music2 size={14} />
                  <span className="hidden sm:inline">SoundCloud</span>
                </Button>
              )}
              {finalSocials.bandcamp && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(finalSocials.bandcamp!, "_blank")}
                  data-testid="link-bandcamp"
                >
                  <Music size={14} />
                  <span className="hidden sm:inline">Bandcamp</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
