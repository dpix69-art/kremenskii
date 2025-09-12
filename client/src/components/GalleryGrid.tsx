import { useMemo } from "react";
import { usePlatformCover } from "@/lib/platformCover";
import { assetUrl } from "@/lib/assetUrl";

type ItemType = "artwork" | "series" | "sound_project";

export type GridItem = {
  id: string;
  title: string;
  year?: string;
  medium?: string;
  imageUrl?: string; // локальная обложка (если есть)
  linkUrl: string;
  type: ItemType;

  // для sound-проектов — чтобы тянуть обложку с площадки
  platform?: "soundcloud" | "bandcamp";
  embedUrl?: string;
};

interface GalleryGridProps {
  items: GridItem[];
  heading?: string;
  linkUrl?: string; // "see all"
  columns?: 2 | 3 | 4 | 6;
  showArtworkBadge?: boolean; // показывать бейдж ARTWORK у одиночных работ
}

function gridClass(cols: number | undefined) {
  switch (cols) {
    case 2:
      return "grid grid-cols-1 sm:grid-cols-2 gap-6";
    case 4:
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6";
    case 6:
      return "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6";
    case 3:
    default:
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
  }
}

function isAbsolute(url?: string) {
  return !!url && /^(https?:)?\/\//i.test(url);
}

function Card({ item, showArtworkBadge }: { item: GridItem; showArtworkBadge?: boolean }) {
  // для звуковых — пытаемся подтянуть обложку с площадки;
  // если есть item.imageUrl — он приоритетный
  const platformCover = usePlatformCover({
    platform: item.platform,
    embedUrl: item.embedUrl,
    cover: item.imageUrl,
  });

  // итоговый src
  const rawSrc = platformCover || item.imageUrl || "";
  const src = useMemo(() => {
    if (!rawSrc) return "";
    return isAbsolute(rawSrc) ? rawSrc : assetUrl(rawSrc.replace(/^\/+/, ""));
  }, [rawSrc]);

  const badge =
    item.type === "series"
      ? "SERIES"
      : item.type === "sound_project"
      ? "SOUNDS"
      : showArtworkBadge
      ? "ARTWORK"
      : "";

  return (
    <a href={item.linkUrl} className="group block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground/30 rounded-md">
      <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
        {src ? (
          <img
            src={src}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>

      <div className="flex items-end justify-between mt-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {badge && (
              <span className="text-type-xsmall font-semibold uppercase tracking-wide text-muted-foreground">
                {badge}
              </span>
            )}
          </div>
          <div className="text-type-body text-foreground truncate">{item.title}</div>
          <div className="text-type-small text-muted-foreground truncate">
            {[item.year, item.medium].filter(Boolean).join(" • ")}
          </div>
        </div>
      </div>
    </a>
  );
}

export default function GalleryGrid({
  items,
  heading,
  linkUrl,
  columns = 3,
  showArtworkBadge = false,
}: GalleryGridProps) {
  return (
    <section className="section-py">
      <div className="site-container">
        {(heading || linkUrl) && (
          <div className="flex items-baseline justify-between mb-6">
            {heading ? (
              <h2 className="text-type-h2 font-semibold text-foreground">{heading}</h2>
            ) : <div />}
            {linkUrl && (
              <a
                href={linkUrl}
                className="text-type-small underline text-muted-foreground hover:text-foreground"
              >
                See all
              </a>
            )}
          </div>
        )}

        <div className={gridClass(columns)}>
          {items.map((it) => (
            <Card key={it.id} item={it} showArtworkBadge={showArtworkBadge} />
          ))}
        </div>
      </div>
    </section>
  );
}
