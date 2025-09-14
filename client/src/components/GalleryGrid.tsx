// client/src/components/GalleryGrid.tsx
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { assetUrl } from "@/lib/assetUrl";

type ItemType = "artwork" | "series" | "sound_project";

interface GridItem {
  id: string;
  title: string;
  year?: string;
  medium?: string;
  imageUrl?: string;      // локальный или абсолютный URL
  linkUrl: string;
  type: ItemType;
  platform?: string;      // optional (sound_project)
  embedUrl?: string;      // optional (sound_project)
}

interface Props {
  items: GridItem[];
  heading?: string;
  linkUrl?: string;     // “See all” ссылка
  columns?: 2 | 3 | 4 | 6;
  showArtworkBadge?: boolean;
  imageAspect?: "square" | "portrait" | "landscape";
}

const aspectClass = (a: Props["imageAspect"]) => {
  switch (a) {
    case "portrait":
      return "aspect-[4/5]"; // вертикально (как в макете)
    case "landscape":
      return "aspect-[4/3]"; // горизонтально
    default:
      return "aspect-square";
  }
};

export default function GalleryGrid({
  items,
  heading,
  linkUrl,
  columns = 2,
  showArtworkBadge = true,
  imageAspect = "square",
}: Props) {
  const gridCols =
    columns === 6
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
      : columns === 4
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      : columns === 3
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <section className="section-py">
      <div className="site-container">
        {heading && (
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-type-h2 font-semibold text-foreground">{heading}</h2>
            {linkUrl && (
              <Link href={linkUrl}>
                <span className="text-type-body underline text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  See all
                </span>
              </Link>
            )}
          </div>
        )}

        <div className={cn("grid gap-x-6 gap-y-8", gridCols)}>
          {items.map((it) => {
            const badgeLabel =
              it.type === "series"
                ? "SERIES"
                : it.type === "sound_project"
                ? "SOUNDS"
                : showArtworkBadge
                ? "ARTWORK"
                : "";

            const imgSrc = it.imageUrl ? assetUrl(it.imageUrl) : "";

            return (
              <Link key={it.id} href={it.linkUrl}>
                <a className="block group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring rounded-md">
                  {/* Картинка */}
                  <div className={cn("w-full overflow-hidden rounded-md", aspectClass(imageAspect))}>
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={it.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Подписи */}
                  <div className="mt-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-light uppercase tracking-wide text-muted-foreground mb-[12px]">
                        {badgeLabel || <span>&nbsp;</span>}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-type-body text-foreground leading-snug">
                        {it.title}
                      </div>
                      {(it.year || it.medium) && (
                        <div className="text-type-small text-muted-foreground leading-snug">
                          {[it.year, it.medium].filter(Boolean).join(" • ")}
                        </div>
                      )}
                    </div>
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
