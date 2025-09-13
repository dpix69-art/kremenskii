import Header from "@/components/Header";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

export default function Home() {
  const { content } = useContent();

  const artistName = content?.site?.artistName ?? "Artist Name";
  const role = content?.site?.role ?? "artist";
  const statement =
    content?.site?.statement ??
    "Two short sentences about the practice.";

  // 1) Пара работ (берем первые попавшиеся из первой серии)
  const firstSeries = (content?.series || [])[0];
  const artworkItems =
    firstSeries && Array.isArray(firstSeries.works)
      ? firstSeries.works.slice(0, 2).map((w: any) => ({
          id: w.slug,
          title: w.title || "Untitled",
          year: String(w.year ?? ""),
          medium: w.technique || w.medium || "",
          imageUrl:
            Array.isArray(w.images) && w.images[0]
              ? (typeof w.images[0] === "string"
                  ? w.images[0]
                  : w.images[0]?.url || w.images[0]?.src || "")
              : undefined,
          linkUrl: `#/gallery/${firstSeries.slug}/${w.slug}`,
          type: "artwork" as const,
        }))
      : [];

  // 2) Одна серия
  const seriesItem = (content?.series || [])
    .slice(0, 1)
    .map((s: any) => ({
      id: s.slug,
      title: s.title,
      year: String(s.year ?? ""),
      medium: "Series",
      imageUrl: Array.isArray(s.artworkImages) ? s.artworkImages[0] : undefined,
      linkUrl: `#/gallery/${s.slug}`,
      type: "series" as const,
    }));

  // 3) Один звуковой проект — ВАЖНО: platform + embedUrl
  const soundItem = (content?.sounds || [])
    .slice(0, 1)
    .map((s: any) => ({
      id: s.slug,
      title: s.title,
      year: String(s.year ?? ""),
      medium: s?.meta?.label || (s.platform ? String(s.platform).toUpperCase() : ""),
      imageUrl: typeof s.cover === "string" ? s.cover.replace(/^\/+/, "") : undefined,
      linkUrl: `#/sounds/${s.slug}`,
      type: "sound_project" as const,
      platform: (s.platform || "").toLowerCase(), // "soundcloud" | "bandcamp"
      embedUrl: s.embed,
    }));

  // Собираем набор карточек на главной (можно менять количество)
  const mixedGalleryItems = [...artworkItems, ...seriesItem, ...soundItem];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header artistName={artistName} />
      <main className="flex-1">
        {/* Text Header */}
        <section className="section-py">
          <div className="site-container">
            <div className="max-w-4xl">
              <h1
                id="page-title"
                tabIndex={-1}
                className="text-type-h1 leading-tight font-semibold text-foreground h1-spacing"
                data-testid="text-artist-name"
              >
                {artistName}
              </h1>
              <p
                className="text-type-small leading-snug font-semibold text-muted-foreground uppercase tracking-wide"
                style={{ marginBottom: "var(--paragraph-gap)" }}
              >
                {role}
              </p>
              <p className="text-type-body leading-relaxed text-foreground max-w-[48ch]">
                {statement}
              </p>
            </div>
          </div>
        </section>

        {/* Two-column Grid (можно columns={3|4|6} по желанию) */}
        <div style={{ marginTop: "var(--heading-gap-lg)" }}>
          <GalleryGrid items={mixedGalleryItems} columns={2} showArtworkBadge />
        </div>
      </main>

      <Footer />
    </div>
  );
}
