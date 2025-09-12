import Header from "@/components/Header";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

type GridItem =
  | { id: string; title: string; year: string; medium: string; imageUrl: string; linkUrl: string; type: "artwork" }
  | { id: string; title: string; year: string; medium: string; imageUrl: string; linkUrl: string; type: "series" }
  | { id: string; title: string; year: string; medium: string; imageUrl: string; linkUrl: string; type: "sound_project" };

export default function Home() {
  const { content } = useContent();

  const artistName = content?.site?.artistName ?? "Artist Name";
  const role = content?.site?.role ?? "artist";
  const statement = content?.site?.statement ?? "";

  // карточки серий
  const seriesCards: GridItem[] = (content?.series || []).map((s: any) => {
    const first =
      (Array.isArray(s.artworkImages) && s.artworkImages[0]) ||
      (Array.isArray(s.works) && s.works[0]?.images?.[0]);
    const src = typeof first === "string" ? first : (first?.url || first?.src || "");
    return {
      id: s.slug,
      title: s.title || s.slug,
      year: String(s.year ?? ""),
      medium: "SERIES",
      imageUrl: (src || "").replace(/^\/+/, ""),
      linkUrl: `#/gallery/${s.slug}`,
      type: "series",
    };
  });

  // несколько работ суммарно
  const artworkCards: GridItem[] = (content?.series || [])
    .flatMap((s: any) =>
      (Array.isArray(s.works) ? s.works : []).slice(0, 1).map((w: any) => {
        const first = Array.isArray(w.images) && w.images[0] ? w.images[0] : undefined;
        const src = typeof first === "string" ? first : (first?.url || first?.src || "");
        return {
          id: `${s.slug}-${w.slug}`,
          title: w.title || "Untitled",
          year: String(w.year ?? ""),
          medium: w.technique || w.medium || "",
          imageUrl: (src || "").replace(/^\/+/, ""),
          linkUrl: `#/gallery/${s.slug}/${w.slug}`,
          type: "artwork" as const,
        };
      })
    )
    .slice(0, 3);

  // 1–2 звуковых проекта
  const soundCards: GridItem[] = (content?.sounds || []).slice(0, 2).map((p: any) => ({
    id: p.slug,
    title: p.title || "Untitled",
    year: String(p.year ?? ""),
    medium: (p?.meta?.label || p?.meta?.platforms?.[0] || "Sound").toString(),
    imageUrl: String(p.cover || "").replace(/^\/+/, ""),
    linkUrl: `#/sounds/${p.slug}`,
    type: "sound_project" as const,
  }));

  const items: GridItem[] = [...seriesCards, ...artworkCards, ...soundCards].slice(0, 6);
  const portfolioPdfUrl = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(/^\/+/, "");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Text Header */}
        <section className="section-py">
          <div className="site-container">
            <div className="max-w-4xl">
              <h1 id="page-title" tabIndex={-1} className="text-type-h1 leading-tight font-semibold text-foreground h1-spacing">
                {artistName}
              </h1>
              <p className="text-type-small leading-snug font-semibold text-muted-foreground uppercase tracking-wide" style={{ marginBottom: "var(--paragraph-gap)" }}>
                {role}
              </p>
              <p className="text-type-body leading-relaxed text-foreground max-w-[48ch]">{statement}</p>
            </div>
          </div>
        </section>

        {/* Two-column Grid */}
        <div style={{ marginTop: "var(--heading-gap-lg)" }}>
          <GalleryGrid items={items} columns={2} showArtworkBadge />
        </div>
      </main>
      <Footer portfolioPdfUrl={portfolioPdfUrl} />
    </div>
  );
}
