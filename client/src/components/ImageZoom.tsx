import { useState, useRef, useCallback } from "react";

interface Props {
  thumbSrc: string;   // Optimized thumbnail for display
  fullSrc: string;    // Full-res original for zoom
  alt: string;
  className?: string;
  zoomScale?: number; // How much to zoom (default 2.5)
}

/**
 * Gallery-style image zoom on hover.
 * Shows thumbnail by default, loads full-res on first hover,
 * then pans the full-res image following the cursor.
 */
export default function ImageZoom({
  thumbSrc,
  fullSrc,
  alt,
  className = "",
  zoomScale = 2.5,
}: Props) {
  const [zooming, setZooming] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    setZooming(true);
    // Preload full-res image on first hover
    if (!loaded) {
      const img = new Image();
      img.onload = () => setLoaded(true);
      img.src = fullSrc;
    }
  }, [fullSrc, loaded]);

  const handleMouseLeave = useCallback(() => {
    setZooming(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ cursor: zooming && loaded ? "crosshair" : "zoom-in" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Thumbnail — always visible */}
      <img
        src={thumbSrc}
        alt={alt}
        className="w-full max-h-[85vh] object-contain"
        draggable={false}
      />

      {/* Zoom overlay — full-res image, panned by cursor */}
      {zooming && loaded && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${fullSrc})`,
            backgroundSize: `${zoomScale * 100}%`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundRepeat: "no-repeat",
            opacity: 1,
            transition: "opacity 0.15s ease",
          }}
        />
      )}

      {/* Loading indicator on first hover */}
      {zooming && !loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 pointer-events-none">
          <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground/60 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
