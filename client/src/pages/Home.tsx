import { useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import { useContent } from "@/content/ContentProvider";

function pickRandom<T>(arr: T[], n: number): T[] {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export default function Home() {
  const { content } = useContent();

  const pool = useMemo(() => {
    const items: any[] = [];
    (content?.series || []).forEach((s: any) => {
      if (Array.isArray(s.works) && s.works.length > 0) {
        const w = s.works[0];
        const img =
          Array.isArray(w.images) && w.images[0]
            ? (typeof w.images[0] === "string"
                ? w.images[0]
                : (w.images[0].url || w.images[0].src || ""))
            : "";
        items.push({
          id: `${s.slug}-${w.slug}`,
          title: w.title || s.title || "Untitled",
          year: String(w.year ?? ""),
          medium: w.technique || w.medium || "",
          imageUrl: img || "",
          linkUrl: `#/gallery/${s.slug}${w.slug ? `/${w.slug}` : ""}`,
          type: "artwork" as const,
        });
      } else if (Array.isArray(s.artworkImages) && s.artworkImages[0]) {
        items.push({
          id: `${s.slug}-series`,
          title: s.title || "Series",
          year: String(s.year ?? ""),
          medium: "Series",
          imageUrl: s.artworkImages[0],
          linkUrl: `#/gallery/${s.slug}`,
          type: "series" as const,
        });
      }
    });

    (content?.sounds || []).forEach((x: any) => {
      items.push({
        id: x.slug,
        title: x.title || "Untitled",
        year: String(x.year ?? ""),
        medium: (x?.meta?.label || x?.platform || "").toString().trim(),
        imageUrl: typeof x.cover === "string" ? x.cover : "",
        linkUrl: `#/sounds/${x.slug}`,
        type: "sound_project" as const,
        platform: (x.platform || "").toLowerCase(),
        embedUrl: x.embed,
      });
    });

    return items;
  }, [content]);

  const HOMEPAGE_COUNT = 6;
  const homepageCards = useMemo(() => pickRandom(pool, HOMEPAGE_COUNT), [pool]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="section-py">
          <div className="site-container">
            <div className="max-w-4xl">
              <h1 id="page-title" tabIndex={-1} className="text-type-h1 leading-tight font-semibold text-foreground h1-spacing">
                {content?.site?.artistName ?? "Artist Name"}
              </h1>
              <p className="text-type-small leading-snug font-semibold text-muted-foreground uppercase tracking-wide" style={{ marginBottom: "var(--paragraph-gap)" }}>
                {content?.site?.role ?? "artist"}
              </p>
              <p className="text-type-body leading-relaxed text-foreground max-w-[48ch]">
                {content?.site?.statement ?? "Two short sentences about the practice."}
              </p>
            </div>
          </div>
        </section>

        {/* Две вертикальные карточки */}
        <section style={{ marginTop: "var(--heading-gap-lg)" }}>
          <GalleryGrid
            items={homepageCards}
            columns={2}
            showArtworkBadge={true}
            imageAspectClass="aspect-[2/3]"   // ВЕРТИКАЛЬНО только на главной
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
