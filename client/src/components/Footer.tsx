import { Link } from "wouter";
import { useContent } from "@/content/ContentProvider";

export default function Footer() {
  const { content } = useContent();

  const artistName = content?.site?.artistName || "Dmitrii Kremenskii";
  const year = new Date().getFullYear();
  const legal = content?.footer?.legal || "";
  const socials = (content?.contacts?.socials || [])
    .map((s: any) => ({ label: String(s.label || ""), href: String(s.href || "") }))
    .filter((s: any) => s.label && s.href);
  const portfolio = content?.contacts?.portfolioPdf || "";

  return (
    <footer className="w-full mt-auto border-t border-border">
      <div className="site-container py-10">
        {/* Row 1: Socials + Portfolio */}
        {(socials.length > 0 || portfolio) && (
          <div className="flex flex-wrap gap-6 mb-6">
            {socials.map((s: any) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-type-small text-muted-foreground hover:text-foreground transition-colors"
              >
                {s.label}
              </a>
            ))}
            {portfolio && (
              <a
                href={portfolio}
                target="_blank"
                rel="noopener"
                className="text-type-small text-muted-foreground hover:text-foreground transition-colors"
              >
                Portfolio PDF
              </a>
            )}
          </div>
        )}

        {/* Row 2: Copyright + Impressum */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-type-small text-muted-foreground">
          <span>{year} © {artistName}</span>
          {legal && <span>{legal}</span>}
          <Link href="/impressum">
            <span className="hover:text-foreground transition-colors cursor-pointer">
              Impressum
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
