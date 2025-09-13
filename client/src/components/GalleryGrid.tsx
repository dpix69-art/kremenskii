import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { platformCover } from "@/lib/platformCover";

type ItemType = "artwork" | "series" | "sound_project";

interface GridItem {
  id: string;
  title: string;
  year?: string;
  medium?: string;
  imageUrl?: string;          // локальный путь ИЛИ пусто — тогда попробуем platform/embed
  linkUrl: string;
  type: ItemType;
  // для sound_project (автообложка)
  platform?: string;          // "soundcloud" | "bandcamp"
  embedUrl?: string;
}

interface GalleryGridProps {
  items: GridItem[];
  columns?: 2 | 3 | 4 | 6;
  heading?: string;
  linkUrl?: string;
  showArtworkBadge?: boolean;
  /** Класс аспекта изображения (например, 'aspect-[2/3]' для вертикального) */
  imageAspectClass?: string;  // NEW
}

const typeLabel: Record<ItemType, string> = {
  artwork: "ARTWORK",
  series: "SERIES",
  sound_project: "SOUNDS",
};

export default function GalleryGrid({
  items,
  columns = 3,
  heading,
  linkUrl,
  showArtworkBadge = false,
  imageAspectClass = "aspect-[4/3]", // по умолчанию было горизонтально
}: GalleryGridProps) {
  const gridCols =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : columns === 4
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      : "grid-cols-2 md:grid-cols-3 xl:grid-cols-6";

  return (
    <section className="section-py">
      <div className="site-container">
        {heading && (
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-type-h2 font-semibold text-foreground">{heading}</h2>
            {linkUrl && (
              <Link href={linkUrl}>
                <a className="text-type-body underline text-muted-foreground hover:text-foreground">
                  View all
                </a>
              </Link>
            )}
          </div>
        )}

        <div className={cn("grid gap-x-6 gap-y-[22px]", gridCols)}>
          {items.map((item) => {
            // решить, какую картинку рендерить: локальная или из платформы (SoundCloud/Bandcamp)
            const computedImage =
              item.imageUrl && item.imageUrl.trim().length > 0
                ? item.imageUrl
                : platformCover(item.platform, item.embedUrl) || "";

            return (
              <Link key={item.id} href={item.linkUrl}>
                <a className="group block">
                  {/* Медиа */}
                  <div className={cn("overflow-hidden rounded-md", imageAspectClass)}>
                    {computedImage ? (
                      <img
                        src={computedImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>

                  {/* Метка типа (SERIES / SOUNDS / ARTWORK) */}
                  <div className="mt-[14px]">
                    <div className="text-[12px] font-[300] uppercase tracking-wide text-muted-foreground mb-[12px]">
                      {item.type === "artwork" && showArtworkBadge ? "ARTWORK" : typeLabel[item.type]}
                    </div>

                    {/* Тайтл */}
                    <div className="text-type-body font-medium text-foreground leading-tight">
                      {item.title}
                    </div>

                    {/* Мета */}
                    {(item.year || item.medium) && (
                      <div className="text-type-small text-muted-foreground mt-1">
                        {item.year ? item.year : null}
                        {item.year && item.medium ? " • " : ""}
                        {item.medium ? item.medium : null}
                      </div>
                    )}
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
