import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useParams } from "wouter";
import { buildImageSet } from "@/lib/imageSet";

interface ArtworkImage {
  url: string;
  role: "main" | "angle" | "detail" | "poster" | "installation-view";
  alt: string;
}

interface ArtworkDetailProps {
  title: string;
  seriesTitle?: string;
  year: string;
  medium: string;
  dimensions: string;
  price?: string;
  availability?: "available" | "sold";
  description: string[];
  images: ArtworkImage[];
  prevWork?: { title: string; slug: string };
  nextWork?: { title: string; slug: string };
}

export default function ArtworkDetail({
  title,
  seriesTitle,
  year,
  medium,
  dimensions,
  price,
  availability = "available",
  description,
  images,
  prevWork,
  nextWork,
}: ArtworkDetailProps) {
  const [, setLocation] = useLocation();
  const { series } = useParams();
  const mainImage = images.find((img) => img.role === "main") || images[0];
  const extraImages = images.filter((img) => img.role !== "main");

  const handlePrevClick = () => {
    if (prevWork && series) setLocation(`/gallery/${series}/${prevWork.slug}`);
  };
  const handleNextClick = () => {
    if (nextWork && series) setLocation(`/gallery/${series}/${nextWork.slug}`);
  };

  return (
    <div className="w-full">
      {/* First Screen: Image + Meta Panel */}
      <div className="site-container section-py">
        <div className="grid-12">
          {/* Left Column: Main Image */}
          <div className="col-span-12 lg:col-span-7">
            <div className="w-full flex justify-center">
              {mainImage && (
                <picture>
                  <source
                    type="image/avif"
                    srcSet={buildImageSet(mainImage.url).avif}
                    sizes={buildImageSet(mainImage.url).sizes}
                  />
                  <source
                    type="image/webp"
                    srcSet={buildImageSet(mainImage.url).webp}
                    sizes={buildImageSet(mainImage.url).sizes}
                  />
                  <img
                    src={buildImageSet(mainImage.url).fallback}
                    srcSet={buildImageSet(mainImage.url).webp}
                    sizes={buildImageSet(mainImage.url).sizes}
                    alt={mainImage.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full max-h-[90vh] object-contain bg-muted"
                    style={{ cursor: "default", pointerEvents: "none" }}
                    data-testid="main-artwork-image"
                  />
                </picture>
              )}
            </div>
          </div>

          {/* Right Column: Meta Panel */}
          <div
            className="col-span-12 lg:col-span-5"
            style={{ marginTop: "var(--block-gap-sm)" }}
          >
            <div className="block-gap">
              {/* Title */}
              <h1
                id="artwork-title"
                tabIndex={-1}
                className="text-type-h1 font-semibold text-foreground leading-tight"
              >
                {title}
              </h1>

              {/* Metadata */}
              <dl className="space-y-4">
                {seriesTitle && (
                  <div>
                    <dt className="text-type-small font-semibold text-foreground leading-snug">
                      Series:
                    </dt>
                    <dd className="text-type-body text-foreground leading-relaxed">
                      {seriesTitle}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-type-small font-semibold text-foreground leading-snug">
                    Year:
                  </dt>
                  <dd className="text-type-body text-foreground leading-relaxed">
                    {year}
                  </dd>
                </div>

                <div>
                  <dt className="text-type-small font-semibold text-foreground leading-snug">
                    Availability:
                  </dt>
                  <dd className="text-type-body text-foreground leading-relaxed">
                    {availability === "sold" ? "Sold" : "Available"}
                  </dd>
                </div>

                <div>
                  <dt className="text-type-small font-semibold text-foreground leading-snug">
                    Price:
                  </dt>
                  <dd className="text-type-body text-foreground leading-relaxed">
                    {price || "On request"}
                  </dd>
                </div>

                <div>
                  <dt className="text-type-small font-semibold text-foreground leading-snug">
                    Technique:
                  </dt>
                  <dd className="text-type-body text-foreground leading-relaxed">
                    {medium}
                  </dd>
                </div>

                <div>
                  <dt className="text-type-small font-semibold text-foreground leading-snug">
                    Dimensions:
                  </dt>
                  <dd className="text-type-body text-foreground leading-relaxed">
                    {dimensions}
                  </dd>
                </div>
              </dl>

              {/* About */}
              {description.length > 0 && (
                <div
                  className="block-gap"
                  style={{ paddingTop: "var(--h3-mt)" }}
                >
                  <h3 className="text-type-h3 font-medium text-foreground h3-spacing">
                    About This Work
                  </h3>
                  <div className="space-y-4">
                    {description.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-type-body text-foreground leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Extra Images */}
      {extraImages.length > 0 && (
        <div className="site-container py-12">
          <div className="space-y-6 mb-12">
            <h3 className="text-xl font-medium text-foreground">
              Additional Views
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {extraImages.map((image, index) => {
                const set = buildImageSet(image.url);
                return (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-md bg-muted"
                    data-testid={`extra-image-${index}`}
                  >
                    <picture>
                      <source type="image/avif" srcSet={set.avif} sizes={set.sizes} />
                      <source type="image/webp" srcSet={set.webp} sizes={set.sizes} />
                      <img
                        src={set.fallback}
                        srcSet={set.webp}
                        sizes={set.sizes}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain"
                      />
                    </picture>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Prev/Next Navigation */}
      {(prevWork || nextWork) && (
        <div className="site-container py-8 flex justify-between items-center">
          {prevWork ? (
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              data-testid="button-prev-work"
              onClick={handlePrevClick}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </Button>
          ) : (
            <div />
          )}

          {nextWork ? (
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              data-testid="button-next-work"
              onClick={handleNextClick}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </Button>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}
