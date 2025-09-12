import { cn } from "@/lib/utils";

interface FigureProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
  sizes?: string;
  caption?: string;
  loading?: 'lazy' | 'eager';
}

const aspectRatioVariants = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/9]",
  auto: "",
};

export default function Figure({ 
  src,
  alt,
  className,
  aspectRatio = "auto",
  sizes = "100vw",
  caption,
  loading = "lazy"
}: FigureProps) {
  return (
    <figure className={cn("overflow-hidden", className)}>
      <div className={cn("overflow-hidden rounded-md", aspectRatioVariants[aspectRatio])}>
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={loading}
          className="h-full w-full object-cover"
          decoding="async"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}