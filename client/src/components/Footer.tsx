import { Download, Instagram, Music2, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function Footer({
  artistName = "Dmitrii Kremenskii",
  year = new Date().getFullYear(),
  portfolioPdfUrl = "/files/kremenskii-portfolio.pdf",
  socialLinks = {}
}: FooterProps) {
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
                Stuttgart 2025 © Dmitrii Kremenskii
              </p>
              <p className="text-sm text-muted-foreground">
                All rights reserved.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 lg:gap-6">
            {/* Portfolio Download */}
            {portfolioPdfUrl && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open(portfolioPdfUrl, '_blank')}
                data-testid="button-download-portfolio"
              >
                <Download size={14} />
                <span>Portfolio</span>
              </Button>
            )}

            {/* Social Links */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              {socialLinks.instagram && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(socialLinks.instagram, '_blank')}
                  data-testid="link-instagram"
                >
                  <Instagram size={14} />
                  <span className="hidden sm:inline">Instagram</span>
                </Button>
              )}
              
              {socialLinks.soundcloud && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(socialLinks.soundcloud, '_blank')}
                  data-testid="link-soundcloud"
                >
                  <Music2 size={14} />
                  <span className="hidden sm:inline">SoundCloud</span>
                </Button>
              )}
              
              {socialLinks.bandcamp && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(socialLinks.bandcamp, '_blank')}
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