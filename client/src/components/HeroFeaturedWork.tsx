import { Link } from "wouter";

interface HeroFeaturedWorkProps {
  imageUrl: string;
  title: string;
  year: string;
  medium: string;
  series: string;
  linkUrl: string;
  statement: string;
  artistName: string;
  caption?: {
    visible: boolean;
    variant: 'overlay-card' | 'none';
  };
}

export default function HeroFeaturedWork({
  imageUrl,
  title,
  year,
  medium,
  series,
  linkUrl,
  statement,
  artistName,
  caption = { visible: true, variant: 'overlay-card' }
}: HeroFeaturedWorkProps) {
  const showCaption = caption.visible && caption.variant === 'overlay-card';

  return (
    <section className="w-full h-screen flex flex-col lg:flex-row">
      {/* Statement Area - Left Side */}
      <div className="w-full lg:w-1/2 flex items-start pt-32 lg:pt-40">
        <div className="site-container">
          <div className="max-w-[480px] space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-semibold text-foreground" data-testid="text-artist-name">
                {artistName}
              </h1>
              <p className="text-base text-muted-foreground" data-testid="text-artist-title">
                Artist
              </p>
            </div>
            <p className="text-base lg:text-lg leading-relaxed text-foreground font-medium">
              {statement}
            </p>
          </div>
        </div>
      </div>
      {/* Image Area - Right Side */}
      <div className="w-full lg:w-1/2 relative h-64 lg:h-screen">
        <img
          src={imageUrl}
          alt={`${title} by Dmitrii Kremenskii`}
          className="absolute inset-0 w-full h-full object-cover pt-[0px] pb-[0px] mt-[550px] mb-[550px]"
          data-testid="img-hero-artwork"
        />
        
        {/* Overlay Caption Card */}
        {showCaption && (
          <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 max-w-[280px] bg-white/85 backdrop-blur-sm p-3 rounded-md shadow-sm" data-testid="caption-overlay-card">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{series}</p>
              <h2 className="text-sm font-medium text-foreground leading-tight">
                {title}
              </h2>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>{year}</p>
                <p>{medium}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}