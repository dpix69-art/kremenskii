// client/src/pages/Home.tsx
import Header from "@/components/Header";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";
import { useMemo } from "react";

type GridItem = Parameters<typeof GalleryGrid>[0]["items"][number];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function takeRandom<T>(arr: T[], n: number): T[] {
  if (!arr.length || n <= 0) return [];
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

export default function Home() {
  const { content } = useContent();

  const artistName = content?.site?.artistName ?? "Artist Name";
  const role = content?.site?.role ?? "artist";
  const statement =
    content?.site?.statement ??
    "Two short sentences about the practice.";

  const homeItems: GridItem[] = useMemo(() => {
    const COUNT = 6;

    // 1) Все работы из всех серий
    const allArtworks: GridItem[] = (content?.series || []).flatMap((s: any) =>
      Array.isArray(s.works)
        ? s.works.map((w: any) => {
            const firstImg =
              Array.isArray(w.images) && w.images[0]
                ? typeof w.images[0] === "string"
                  ? w.images[0]
                  : w.images[0]?.url || w.images[0]?.src || ""
                : undefined;

            return {
              id: w.slug,
              title: w.title || "Untitled",
              year: String(w.year ?? ""),
              medium: w.technique || w.medium || "",
              imageUrl: firstImg ? String(firstImg).replace(/^\/+/, "") : undefined,
              linkUrl: `#/gallery/${s.slug}/${w.slug}`,
              type: "artwork" as const,
            };
          })
        : []
    );

    // 2) Все серии
    const allSeries: GridItem[] = (content?.series || []).map((s: any) => ({
      id: s.slug,
      title: s.title || "Series",
      year: String(s.year ?? ""),
      medium: "Series",
      imageUrl: Array.isArray(s.artworkImages) ? s.artworkImages[0] : undefined,
      linkUrl: `#/gallery/${s.slug}`,
      type: "series" as const,
    }));

    // 3) Все sound-проекты (с платформой и embed для обложек)
    const allSounds: GridItem[] = (content?.sounds || []).map((s: any) => ({
      id: s.slug,
      title: s.title || "Untitled",
      year: String(s.year ?? ""),
      medium: s?.meta?.label || (s.platform ? String(s.platform).toUpperCase() : ""),
      imageUrl: typeof s.cover === "string" ? s.cover.replace(/^\/+/, "") : undefined,
      linkUrl: `#/sounds/${s.slug}`,
      type: "sound_project" as const,
      platform: (s.platform || "").toLowerCase(), // "soundcloud" | "bandcamp"
      embedUrl: s.embed,
    }));

    // базовый микс: минимум 1 серия и 1 sound (если есть), остальное — работы
    const picked: GridItem[] = [];
    picked.push(...takeRandom(allSeries, 1));
    picked.push(...takeRandom(allSounds, 1));

    const remaining = Math.max(0, COUNT - picked.length);
    picked.push(...takeRandom(allArtworks, remaining));

    // если работ не хватило — добиваем из серий/саундов
    if (picked.length < COUNT) {
      const still = COUNT - picked.length;
      const extras = [...allSeries, ...allSounds].filter(
        (x) => !picked.some((p) => p.id === x.id && p.type === x.type)
      );
      picked.push(...takeRandom(extras, still));
    }

    // финальное перемешивание для более естественного порядка
    return shuffle(picked).slice(0, COUNT);
  }, [content]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header artistName={artistName} />
      <main className="flex-1">
        {/* Верхний текстовый блок */}
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

        {/* Рандомные карточки */}
        <div style={{ marginTop: "var(--heading-gap-lg)" }}>
          <GalleryGrid items={homeItems} columns={3} showArtworkBadge />
        </div>
      </main>

      <Footer />
    </div>
  );
}
