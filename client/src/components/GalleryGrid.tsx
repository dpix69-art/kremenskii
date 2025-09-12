import { Link } from "wouter";
import MouseTooltip from "./MouseTooltip";

interface GalleryItem {
  id: string;
  title: string;
  year: string;
  medium: string;
  imageUrl: string;
  linkUrl: string;
  type: 'artwork' | 'sound_project' | 'series';
}

interface GalleryGridProps {
  items: GalleryItem[];
  heading?: string;
  linkUrl?: string;
  columns?: 2 | 3 | 4;
  showArtworkBadge?: boolean;
}

export default function GalleryGrid({ 
  items, 
  heading, 
  linkUrl, 
  columns = 3,
  showArtworkBadge = false
}: GalleryGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", 
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <section className="w-full">
      <div className="site-container">
        {heading && (
          <div className="flex items-end justify-between h2-spacing">
            <h2 className="text-type-h2 font-semibold text-foreground">
              {heading}
            </h2>
            {linkUrl && (
              <Link href={linkUrl}>
                <span className="text-type-small text-muted-foreground hover:text-foreground transition-colors">
                  View All
                </span>
              </Link>
            )}
          </div>
        )}

        <div className="grid-12 items-stretch">
          {items.map((item) => {
            const getColSpan = () => {
              switch (columns) {
                case 2: return "col-span-12 md:col-span-6";
                case 3: return "col-span-12 md:col-span-6 lg:col-span-4";
                case 4: return "col-span-12 md:col-span-6 lg:col-span-3";
                default: return "col-span-12 md:col-span-6 lg:col-span-4";
              }
            };
            
            const getBadgeText = () => {
              switch (item.type) {
                case 'artwork': return showArtworkBadge ? 'Artwork' : null;
                case 'series': return 'Series';
                case 'sound_project': return 'Sound';
                default: return null;
              }
            };

            const badgeText = getBadgeText();
            const needsPlaceholder = item.type === 'artwork' && !showArtworkBadge;

            return (
              <div key={item.id} className={getColSpan()}>
                <Link href={item.linkUrl}>
                    <article 
                      className="group cursor-pointer flex flex-col h-full"
                      data-testid={`card-${item.type}-${item.id}`}
                    >
                      <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          data-testid={`img-${item.type}-${item.id}`}
                        />
                      </div>
                      <div className="flex flex-col justify-end flex-1 card-caption-p card-caption-gap">
                        {/* Badge row - always present for alignment */}
                        <div className="min-h-[1rem]">
                          {badgeText ? (
                            <span className="text-type-small font-semibold text-foreground uppercase tracking-wider">
                              {badgeText}
                            </span>
                          ) : needsPlaceholder ? (
                            <div className="h-[1rem]" aria-hidden="true" />
                          ) : null}
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-type-body font-semibold text-foreground line-clamp-2">
                          {item.title}
                        </h3>
                        
                        {/* Meta */}
                        <div className="space-y-1">
                          <p className="text-type-small text-muted-foreground">{item.year}</p>
                          <p className="text-type-small text-muted-foreground">{item.medium}</p>
                        </div>
                      </div>
                    </article>
                  </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}