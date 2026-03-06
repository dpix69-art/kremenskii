import { useMemo } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import { useContent } from "@/content/ContentProvider";
import { assetUrl } from "@/lib/assetUrl";

type GridItem = {
  id: string;
  title: string;
  year?: string;
  medium?: string;
  imageUrl?: string;
  linkUrl: string;
  type: "artwork" | "series" | "sound_project";
};

function makeArtworkCard(content: any, seriesSlug: string, workSlug: string): GridItem | null {
  const s = (content?.series || []).find((ss: any) => ss.slug === seriesSlug);
  if (!s || !Array.isArray(s.works)) return null;
  const w = s.works.find((ww: any) => ww.slug === workSlug);
  if (!w) return null;

  let img = "";
  if (Array.isArray(w.images) && w.images[0]) {
    img = typeof w.images[0] === "string" ? w.images[0] : (w.images[0]?.url || "");
  } else if (Array.isArray(s.artworkImages) && s.artworkImages[0]) {
    img = String(s.artworkImages[0] || "");
  }

  return {
    id: `${s.slug}-${w.slug}`,
    title: w.title || s.title || "Untitled",
    year: String(w.year ?? ""),
    medium: w.technique || w.medium || "",
    imageUrl: img || "",
    linkUrl: `/gallery/${s.slug}/${w.slug}`,
    type: "artwork",
  };
}

function pickRandom<T>(arr: T[], n: number): T[] {
  if (!arr.length || n <= 0) return [];
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
    const items: GridItem[] = [];
    (content?.series || []).forEach((s: any) => {
      if (Array.isArray(s.works) && s.works.length > 0) {
        const w = s.works[0];
        const img = Array.isArray(w.images) && w.images[0]
          ? (typeof w.images[0] === "string" ? w.images[0] : (w.images[0].url || ""))
          : "";
        items.push({
          id: `${s.slug}-${w.slug}`,
          title: w.title || s.title || "Untitled",
          year: String(w.year ?? ""),
          medium: w.technique || w.medium || "",
          imageUrl: img,
          linkUrl: `/gallery/${s.slug}/${w.slug}`,
          type: "artwork",
        });
      }
    });
    return items;
  }, [content]);

  const featuredCards = useMemo(() => {
    const raw = (content?.site?.homeFeatured || []) as { series: string; work: string }[];
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const seen = new Set<string>();
    const result: GridItem[] = [];
    for (const f of raw) {
      const card = makeArtworkCard(content, f.series, f.work);
      if (card && !seen.has(card.id)) {
        seen.add(card.id);
        result.push(card);
      }
      if (result.length >= 2) break;
    }
    return result;
  }, [content]);

  const homepageCards = useMemo(() => {
    const excludeIds = new Set(featuredCards.map((it) => it.id));
    const rest = pool.filter((it) => !excludeIds.has(it.id));
    const need = Math.max(0, 2 - featuredCards.length);
    return [...featuredCards, ...pickRandom(rest, need)];
  }, [pool, featuredCards]);

  const featuredSound = content?.sounds?.[0];
  const soundCover = featuredSound?.cover ? assetUrl(featuredSound.cover) : "";
  const soundEmbed = (featuredSound?.embed || "").trim();
  const soundPlatform = (featuredSound?.platform || "").toLowerCase();
  const embedHeight = soundPlatform.includes("soundcloud") ? 166 : 120;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Statement */}
        <section className="section-py">
          <div className="site-container">
            <div className="max-w-4xl">
              <p
                className="text-type-small leading-snug font-semibold text-muted-foreground uppercase tracking-wide"
                style={{ marginBottom: "var(--paragraph-gap)" }}
              >
                {content?.site?.role ?? "Visual & Sound Artist"}
              </p>
              <p className="text-type-body leading-relaxed text-foreground max-w-[48ch]">
                {content?.site?.statement ?? "Experience becomes structure."}
              </p>
            </div>
          </div>
        </section>

        {/* Featured artworks */}
        <section style={{ marginTop: "var(--heading-gap-lg)" }}>
          <GalleryGrid items={homepageCards} columns={2} showArtworkBadge imageAspect="portrait" />
        </section>

        {/* Featured sound — with cover image + embed player */}
        {featuredSound && (
          <section style={{ marginTop: "var(--heading-gap-lg)", paddingBottom: "200px" }}>
            <div className="site-container">
              <p className="text-type-small leading-snug font-semibold text-muted-foreground uppercase tracking-wide">
                <Link href="/sounds"><span className="cursor-pointer">Sounds</span></Link>
              </p>

              <div style={{ marginTop: "var(--paragraph-gap)" }} className="space-y-2">
                <div className="flex justify-between items-start gap-6">
                  <Link href={`/sounds/${featuredSound.slug}`}>
                    <span className="text-type-body leading-relaxed text-foreground hover:underline cursor-pointer">
                      {featuredSound.title || "Untitled"}
                    </span>
                  </Link>
                  <div className="text-type-small leading-snug text-muted-foreground whitespace-nowrap">
                    {featuredSound.year ? String(featuredSound.year) : ""}
                    {featuredSound.meta?.label ? ` · ${featuredSound.meta.label}` : ""}
                  </div>
                </div>

                {featuredSound.summary && (
                  <p className="text-type-small text-muted-foreground">{featuredSound.summary}</p>
                )}

                {/* Cover image */}
                {soundCover && (
                  <Link href={`/sounds/${featuredSound.slug}`}>
                    <div className="mt-4 cursor-pointer overflow-hidden rounded-sm">
                      <img
                        src={soundCover}
                        alt={featuredSound.title || ""}
                        className="w-full max-w-md aspect-square object-cover transition-transform duration-500 hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                )}

                {/* Embedded player */}
                {soundEmbed && (
                  <div className="mt-4">
                    <iframe
                      src={soundEmbed}
                      className="w-full border-0 rounded-sm"
                      style={{ height: embedHeight }}
                      allow="autoplay"
                      loading="lazy"
                      title={featuredSound.title || "Sound player"}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
