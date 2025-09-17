import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useParams } from "wouter";

interface ArtworkImage {
  url: string;
  role: "main" | "angle" | "detail";
  alt: string;
}

type Availability = "available" | "reserved" | "sold" | "not_for_sale" | "";

interface ArtworkDetailProps {
  title: string;
  seriesTitle?: string;
  year: string;
  medium: string;
  dimensions: string;
  price?: string; // e.g. "€1,800" or "Price on request"
  availability?: Availability; // now supports reserved / not_for_sale
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

  // Безопасные выборки изображений (страница-родитель уже подставляет плейсхолдер, но перестрахуемся)
  const mainImage = images?.find((img) => img.role === "main") || images?.[0];
  const extraImages = (images || []).filter((img) => img.role !== "main");

  const handlePrevClick = () => {
    if (prevWork && series) setLocation(`/gallery/${series}/${prevWork.slug}`);
  };

  const handleNextClick = () => {
    if (nextWork && series) setLocation(`/gallery/${series}/${nextWork.slug}`);
  };

  // Человеческий лейбл доступности
  const availabilityLabels: Record<Exclude<Availability, "">, string> = {
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    not_for_sale: "Not for sale",
  };
  const availabilityLabel =
    availability && availability !== ""
      ? availabilityLabels[availability as Exclude<Availability, "">] || "Available"
      : "Available";

  // Показываем цену ТОЛЬКО если работа доступна
  const showPrice = availability === "available";

  return (
    <div className="w-full">
      {/* First Screen: Image + Meta Panel */}
      <div className="site-container section-py">
        <div className="grid-12">
          {/* Left Column: Main Image */}
          <div className="col-span-12 lg:col-span-7">
            <div className="w-full flex justify-center">
              {mainImage ? (
                <img
                  src={mainImage.url}
                  alt={mainImage.alt}
                  className="w-full max-h-[90vh] object-contain"
                  style={{ cursor: "default", pointerEvents: "none" }}
                  data-testid="main-artwork-image"
                />
              ) : (
                <div
                  className="w-full max-h-[90vh] aspect-[4/5] bg-muted rounded"
                  aria-hidden
                />
              )}
            </div>
          </div>

          {/* Right Column: Meta Panel */}
          <div className="col-span-12 lg:col-span-5" style={{ marginTop: "var(--block-gap-sm)" }}>
            <div className="block-gap">
              {/* Title */}
              <h1
                id="artwork-title"
                tabIndex={-1}
                className="text-type-h1 font-semibold text-foreground leading-tight"
              >
                {title}
              </h1>

              {/* Metadata as labeled rows */}
              <dl className="space-y-4">
                {/* Series */}
                {seriesTitle && (
                  <div>
                    <dt className="text-type-small font-semibold text-foreground leading-snug">Series:</dt>
                    <dd className="text-type-body text-foreground leading-relaxed">{seriesTitle}</dd>
                  </div>
                )}

                {/* Year */}
                <div>
                  <dt className="text-type-small font-semibold text-foreground leading-snug">Year:</dt>
                  <dd className="text-type-body text-foreground leading-relaxed">{year}</dd>
                </div>

                {/* Availability */}
                <div>
                  <dt className="text-type-small font-semibold text-foreground leading-snug">Availability:</dt>
                  <dd className="text-type-body text-foreground leading-relaxed">{availabilityLabel}</dd>
                </div>

                {/* Price — показываем только если available */}
                {showPrice && (
                  <div>
                    <dt className="text-type-small font-semibold text-foreground leading-snug">Price:</dt>
                    <dd className="text-type-body text-foreground leading-relaxed">
                      {price || "On request"}
                    </dd>
                  </div>
                )}

                {/* Technique */}
                <div>
                  <dt className="text-type-small font-semibold text-foreground leading-snug">Technique:</dt>
                  <dd className="text-type-body text-foreground leading-relaxed">{medium}</dd>
                </div>

                {/* Dimensions */}
                <div>
                  <dt className="text-type-small font-semibold text-foreground leading-snug">Dimensions:</dt>
                  <dd className="text-type-body text-foreground leading-relaxed">{dimensions}</dd>
                </div>
              </dl>

              {/* About This Work */}
              <div className="block-gap" style={{ paddingTop: "var(--h3-mt)" }}>
                <h3 className="text-type-h3 font-medium text-foreground h3-spacing">About This Work</h3>
                <div className="space-y-4">
                  {description.map((paragraph, index) => (
                    <p key={index} className="text-type-body text-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional content below main content */}
      <div className="site-container py-12">
        {/* Extra Images */}
        {extraImages.length > 0 && (
          <div className="space-y-6 mb-12">
            <h3 className="text-xl font-medium text-foreground">Additional Views</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {extraImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-md bg-muted"
                  data-testid={`extra-image-${index}`}
                >
                  <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        {(prevWork || nextWork) && (
          <div className="flex justify-between items-center pt-8">
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
    </div>
  );
}
