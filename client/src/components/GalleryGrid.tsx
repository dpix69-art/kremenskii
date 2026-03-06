import { Link } from "wouter";
import { clsx } from "clsx";

type ItemType = "artwork" | "series" | "sound_project";

interface GridItem {
  id: string;
  title: string;
  year?: string;
  medium?: string;
  imageUrl?: string;
  linkUrl: string;
  type: ItemType;
  platform?: string;
  embedUrl?: string;
}

interface Props {
  items: GridItem[];
  heading?: string;
  linkUrl?: string;
  columns?: 2 | 3 | 4 | 6;
  showArtworkBadge?: boolean;
  imageAspect?: "square" | "portrait" | "landscape";
  imageAspectClass?: string;
}

const defaultAspect = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

// Normalize link: strip "#" prefix for browser routing
function normalizeLink(href: string): string {
  if (href.startsWith("#/")) return href.slice(1);
  if (href.startsWith("#")) return "/" + href.slice(1);
  return href;
}

// Normalize image URL
function normalizeImage(src?: string): string {
  if (!src) return "";
  let s = src.replace(/^\/+/, "").replace(/\?url.*$/, "");
  // Skip legacy/placeholder assets
  if (s.includes("generated_images") || s.startsWith("@assets")) return "";
  // Ensure absolute path
  if (!s.startsWith("http") && !s.startsWith("/")) s = "/" + s;
  return s;
}

export default function GalleryGrid({
  items,
  heading,
  linkUrl,
  columns = 2,
  showArtworkBadge = true,
  imageAspect = "square",
  imageAspectClass,
}: Props) {
  const gridCols =
    columns === 6
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
      : columns === 4
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      : columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2";

  const aspectCls = imageAspectClass || defaultAspect[imageAspect] || "aspect-square";

  return (
    <section className="section-py">
      <div className="site-container">
        {heading && (
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-type-h2 font-semibold text-foreground">{heading}</h2>
            {linkUrl && (
              <Link href={normalizeLink(linkUrl)}>
                <span className="text-type-body underline text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  See all
                </span>
              </Link>
            )}
          </div>
        )}

        <div className={clsx("grid gap-x-6 gap-y-8", gridCols)}>
          {items.map((it) => {
            const badge =
              it.type === "series"
                ? "Series"
                : it.type === "sound_project"
                ? "Sounds"
                : showArtworkBadge
                ? "Artwork"
                : "";

            const imgSrc = normalizeImage(it.imageUrl);

            return (
              <Link key={it.id} href={normalizeLink(it.linkUrl)}>
                <article className="group cursor-pointer">
                  {/* Image with hover zoom */}
                  <div className={clsx("w-full overflow-hidden rounded-sm bg-muted", aspectCls)}>
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={it.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="mt-3">
                    {badge && (
                      <span className="text-[11px] font-normal uppercase tracking-widest text-muted-foreground block mb-1.5">
                        {badge}
                      </span>
                    )}
                    <div className="text-type-body text-foreground leading-snug">
                      {it.title}
                    </div>
                    {(it.year || it.medium) && (
                      <div className="text-type-small text-muted-foreground leading-snug mt-1">
                        {[it.year, it.medium].filter(Boolean).join(" · ")}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
