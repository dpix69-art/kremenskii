import { useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import { useContent } from "@/content/ContentProvider";

type GridItem = {
  id: string;
  title: string;
  year?: string;
  medium?: string;
  imageUrl?: string;
  linkUrl: string;
  type: "artwork" | "series" | "sound_project";
  platform?: string;
  embedUrl?: string;
};

function pickRandom<T>(arr: T[], n: number): T[] {
  if (!Array.isArray(arr) || arr.length === 0 || n <= 0) return [];
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

// Build an artwork card from (seriesSlug, workSlug)
function makeArtworkCard(content: any, seriesSlug: string, workSlug: string): GridItem | null {
  const s = (content?.series || []).find((ss: any) => ss.slug === seriesSlug);
  if (!s || !Array.isArray(s.works)) return null;
  const w = s.works.find((ww: any) => ww.slug === workSlug);
  if (!w) return null;

  let img = "";
  if (Array.isArray(w.images) && w.images[0]) {
    img =
      typeof w.images[0] === "string"
        ? w.images[0]
        : (w.images[0]?.url || w.images[0]?.src || "");
  } else if (Array.isArray(s.artworkImages) && s.artworkImages[0]) {
    img = String(s.artworkImages[0] || "");
  }

  return {
    id: `${s.slug}-${w.slug}`,
    title: w.title || s.title || "Untitled",
    year: String(w.year ?? ""),
    medium: w.technique || w.medium || "",
    imageUrl: img || "",
    linkUrl: `#/gallery/${s.slug}${w.slug ? `/${w.slug}` : ""}`,
    type: "artwork",
  };
}

export default function Home() {
  const { content } = useContent();

  // Base card pool (as before)
  const pool = useMemo(() => {
    const items: GridItem[] = [];

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
          type: "artwork",
        });
      } else if (Array.isArray(s.artworkImages) && s.artworkImages[0]) {
        items.push({
          id: `${s.slug}-series`,
          title: s.title || "Series",
          year: String(s.year ?? ""),
          medium: "Series",
          imageUrl: s.artworkImages[0],
          linkUrl: `#/gallery/${s.slug}`,
          type: "series",
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
        type: "sound_project",
        platform: (x.platform || "").toLowerCase(),
        embedUrl: x.embed,
      });
    });

    return items;
  }, [content]);

  // Fixed featured artwork cards (first 1–2)
  const featuredCards = useMemo(() => {
    const raw = (content?.site?.homeFeatured || []) as { series: string; work: string }[];
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const resolved = raw
      .map((f) => makeArtworkCard(content, f.series, f.work))
      .filter(Boolean) as GridItem[];

    // Deduplicate and limit to 2
    const seen = new Set<string>();
    const uniq: GridItem[] = [];
    for (const it of resolved) {
      if (!seen.has(it.id)) {
        seen.add(it.id);
        uniq.push(it);
      }
      if (uniq.length >= 2) break;
    }
    return uniq;
  }, [content]);

  // Final homepage selection: featured first, then random without duplicates
  const HOMEPAGE_COUNT = 2;
  const homepageCards = useMemo(() => {
    const excludeIds = new Set(featuredCards.map((it) => it.id));
    const restPool = pool.filter((it) => !excludeIds.has(it.id));
    const need = Math.max(0, HOMEPAGE_COUNT - featuredCards.length);
    const randomTail = pickRandom(restPool, need);
    return [...featuredCards, ...randomTail];
  }, [pool, featuredCards]);

  const featuredSound = content?.sounds?.[0];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="section-py">
          <div className="site-container">
            <div className="max-w-4xl">
              <h1
                id="page-title"
                tabIndex={-1}
                className="text-type-h1 leading-tight font-semibold text-foreground h1-spacing"
              >
                {/* artist name intentionally omitted */}
              </h1>
              <p
                className="text-type-small leading-snug font-semibold text-muted-foreground uppercase tracking-wide"
                style={{ marginBottom: "var(--paragraph-gap)" }}
              >
                {content?.site?.role ?? "Visual & Sound Artist"}
              </p>
              <p className="text-type-body leading-relaxed text-foreground max-w-[48ch]">
                {content?.site?.statement ??
                  "Experience becomes structure. I compress, distort, layer. Material stores the action. Sound stores the space."}
              </p>
            </div>
          </div>
        </section>

        {/* Two vertical featured cards */}
        <section style={{ marginTop: "var(--heading-gap-lg)" }}>
          <GalleryGrid
            items={homepageCards}
            columns={2}
            showArtworkBadge={true}
            imageAspect="portrait"
          />
        </section>

        {/* Featured sound */}
        {featuredSound && (
          <section style={{ marginTop: "var(--heading-gap-lg)", paddingBottom: "200px", }}>
            <div className="site-container">
              <div className="">
                <p className="text-type-small leading-snug font-semibold text-muted-foreground uppercase tracking-wide">
                  <a  
               href="#/sounds"
              //  className="hover:underline"
             >
               Sounds
                </a>
                </p>

                <div style={{ marginTop: "var(--paragraph-gap)" }} className="space-y-2">
                  <div className="flex justify-between items-start gap-6">
                <a
                  href={`#/sounds/${featuredSound.slug}`}
                  className="text-type-body leading-relaxed text-foreground hover:underline"
                >
                  {featuredSound.title || "Untitled"}
                </a>

                    <div className="text-type-small leading-snug text-muted-foreground whitespace-nowrap">
                      {featuredSound.year ? String(featuredSound.year) : ""}
                    </div>
                  </div>

                  <iframe
                    title={`${featuredSound.title || "Sound"} player`}
                    src={featuredSound.embed}
                    loading="lazy"
                    className="w-full border-0"
                    style={{
                      height: String(featuredSound.platform || "")
                        .toLowerCase()
                        .includes("soundcloud")
                        ? "166px"
                        : "120px",
                    }}
                    allow="encrypted-media; fullscreen"
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
