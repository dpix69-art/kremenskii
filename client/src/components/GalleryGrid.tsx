import { Link } from "wouter";
import { buildImageSet } from "@/lib/imageSet";

export interface GalleryItem {
  id: string;
  title: string;
  year?: string;
  medium?: string;
  imageUrl: string;
  linkUrl: string;
  type: "artwork" | "series" | "sound";
}

interface GalleryGridProps {
  items: GalleryItem[];
  heading?: string;
  linkUrl?: string;
  columns?: number;
}

export default function GalleryGrid({
  items,
  heading,
  linkUrl,
  columns = 3,
}: GalleryGridProps) {
  return (
    <div className="site-container section-py">
      {heading && (
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-type-h2 font-semibold text-foreground">{heading}</h2>
          {linkUrl && (
            <Link href={linkUrl}>
              <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                View All
              </a>
            </Link>
          )}
        </div>
      )}

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-8`}
      >
        {items.map((item) => {
          const set = buildImageSet(item.imageUrl);

          return (
            <Link key={item.id} href={item.linkUrl}>
              <a className="block group">
                <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
                  <picture>
                    <source
                      type="image/avif"
                      srcSet={set.avif}
                      sizes={set.sizes}
                    />
                    <source
                      type="image/webp"
                      srcSet={set.webp}
                      sizes={set.sizes}
                    />
                    <img
                      src={set.fallback}
                      srcSet={set.webp}
                      sizes={set.sizes}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </picture>
                </div>
                <div className="mt-3">
                  <span className="block text-xs font-light text-muted-foreground">
                    {item.type.toUpperCase()}
                  </span>
                  <h3 className="text-type-body font-medium text-foreground group-hover:underline">
                    {item.title}
                  </h3>
                  {item.year && (
                    <p className="text-sm text-muted-foreground">{item.year}</p>
                  )}
                  {item.medium && (
                    <p className="text-sm text-muted-foreground">{item.medium}</p>
                  )}
                </div>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
