
import { useParams } from "wouter";
import { useEffect } from "react";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArtworkDetail from "@/components/ArtworkDetail";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";
import { assetUrl } from "@/lib/assetUrl";

type RouteParams = { series: string; slug: string };

/** Нейтральный плейсхолдер (4:5) без внешних файлов */
const BLANK_PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="100%" height="100%" fill="%23f2f2f2"/></svg>';

/** Рубильник: считаем «наследием» всё, что ведёт в старые ассеты */
function isLegacyAsset(raw: string) {
  const s = raw.toLowerCase();
  return (
    s.includes("generated_images") ||
    s.startsWith("@assets") ||
    s.includes("/assets/generated_images")
  );
}

/** Нормализация пути к картинке: выкидываем «наследие», чистим слэши */
function cleanImageUrl(raw?: string): string {
  if (!raw) return "";
  if (isLegacyAsset(raw)) return "";
  return String(raw).replace(/^\/+/, "");
}

export default function ArtworkDetailPage() {
  const { series, slug } = useParams<RouteParams>();
  const { content } = useContent();

  // --- 1) Найдём серию и работу в content.json ---
  const ser = (content?.series || []).find((s: any) => s.slug === series);
  const work = ser?.works?.find((w: any) => w.slug === slug);

  // Карта для человекочитаемого названия серии (если нет в JSON)
  const seriesMap: Record<string, string> = {
    farbkoerper: "Farbkörper",
    "pgsrd-trc": "Plywood Gravel Sand Road Dust (TRC)",
  };

  const seriesTitle =
    ser?.title || seriesMap[series!] || series || "Unknown Series";

  // --- 2) Основные поля работы ---
  const workTitle = work?.title || "Untitled";
  const year = String(work?.year ?? "");
  const medium = work?.technique || work?.medium || "";
  const dimensions = work?.dimensions || "";
  const price = work?.price || "";
  const availability = work?.availability || "";

  // Описание: сначала work.about (массив строк), иначе — intro серии
  const seriesIntro =
    typeof ser?.intro === "string" ? (ser!.intro as string) : "";
  const description: string[] =
    Array.isArray(work?.about) && work!.about.length > 0
      ? (work!.about as string[])
      : seriesIntro
      ? [seriesIntro]
      : [];

  // --- 3) Изображения работы ---
  const imgs = Array.isArray(work?.images) ? (work!.images as any[]) : [];
  const artworkImages =
    imgs.length > 0
      ? (imgs
          .map((it: any, idx: number) => {
            const raw = typeof it === "string" ? it : it?.url || it?.src || "";
            const normalized = cleanImageUrl(raw);
            const role =
              (it && typeof it === "object" && it.role) ||
              (idx === 0 ? "main" : "detail");

            // Если путь «наследный»/пустой — подставляем нейтральный плейсхолдер
            const finalUrl = normalized ? assetUrl(normalized) : BLANK_PLACEHOLDER;

            return {
              url: finalUrl,
              role: role as
                | "main"
                | "detail"
                | "angle"
                | "poster"
                | "installation-view",
              alt: `${workTitle} - ${role}`,
            };
          })
          .filter(Boolean) as { url: string; role: any; alt: string }[])
      : [
          {
            url: BLANK_PLACEHOLDER,
            role: "main" as const,
            alt: `${workTitle} - main view`,
          },
        ];

  // --- 4) Prev/Next в серии (по порядку в массиве works) ---
  let prevWork: { title: string; slug: string } | undefined;
  let nextWork: { title: string; slug: string } | undefined;
  if (ser?.works && Array.isArray(ser.works)) {
    const idx = ser.works.findIndex((w: any) => w.slug === slug);
    if (idx >= 0) {
      const p = ser.works[idx - 1];
      const n = ser.works[idx + 1];
      prevWork = p ? { title: p.title || "Previous", slug: p.slug } : undefined;
      nextWork = n ? { title: n.title || "Next", slug: n.slug } : undefined;
    }
  }

  // --- 5) Related: из этой же серии ---
  const relatedInSeries = (ser?.works || [])
    .filter((w: any) => w.slug !== slug)
    .map((w: any, i: number) => {
      const first =
        Array.isArray(w.images) && w.images[0] ? w.images[0] : undefined;
      const raw = typeof first === "string" ? first : first?.src || first?.url || "";
      const normalized = cleanImageUrl(raw);
      const imageUrl = normalized ? assetUrl(normalized) : BLANK_PLACEHOLDER;

      return {
        id: w.slug || `related-${i + 1}`,
        title: w.title || "Untitled",
        year: String(w.year ?? ""),
        medium: w.technique || w.medium || "",
        imageUrl,
        linkUrl: `#/gallery/${series}/${w.slug || ""}`,
        type: "artwork" as const,
      };
    })
    .slice(0, 8);

  // --- 6) Related: из других серий (берём первые работы) ---
  const relatedGlobal = (content?.series || [])
    .filter((s: any) => s.slug !== series)
    .flatMap((s: any) => (Array.isArray(s.works) ? s.works.slice(0, 1) : []))
    .map((w: any, i: number) => {
      const first =
        Array.isArray(w.images) && w.images[0] ? w.images[0] : undefined;
      const raw = typeof first === "string" ? first : first?.src || first?.url || "";
      const normalized = cleanImageUrl(raw);
      const imageUrl = normalized ? assetUrl(normalized) : BLANK_PLACEHOLDER;

      // нужно знать серию для линка
      const parentSeries = (content?.series || []).find((s: any) =>
        Array.isArray(s.works)
          ? s.works.some((it: any) => it.slug === w.slug)
          : false
      );
      const parentSlug = parentSeries?.slug || "gallery";

      return {
        id: w.slug || `global-${i + 1}`,
        title: w.title || "Untitled",
        year: String(w.year ?? ""),
        medium: w.technique || w.medium || "",
        imageUrl,
        linkUrl: `#/gallery/${parentSlug}/${w.slug || ""}`,
        type: "artwork" as const,
      };
    })
    .slice(0, 8);

  const portfolioPdfUrl = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(
    /^\/+/,
    ""
  );

  // --- 7) Analytics event ---
  useEffect(() => {
    if (series && slug && typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "view_artwork", { series, work: slug });
    }
  }, [series, slug]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="site-container section-py">
          <Breadcrumbs
            items={[
              { label: "Home", href: "#/", testId: "link-bc-home" },
              { label: "Gallery", href: "#/gallery", testId: "link-bc-gallery" },
              { label: seriesTitle, href: `#/gallery/${series}`, testId: "link-bc-series" },
              { label: workTitle, testId: "text-bc-current" },
            ]}
          />
        </div>

        <ArtworkDetail
          title={workTitle}
          seriesTitle={seriesTitle}
          year={year}
          medium={medium}
          dimensions={dimensions}
          price={price}
          availability={availability}
          description={description}
          images={artworkImages}
          prevWork={prevWork}
          nextWork={nextWork}
        />

        {/* Related Works in Series */}
        {relatedInSeries.length > 0 && (
          <section>
            <GalleryGrid
              items={relatedInSeries}
              heading={`More from ${seriesTitle}`}
              linkUrl={`#/gallery/${series}`}
              columns={4}
            />
          </section>
        )}

        {/* Related Works from Other Series */}
        {relatedGlobal.length > 0 && (
          <section style={{ marginTop: "var(--section-py-lg)" }}>
            <GalleryGrid
              items={relatedGlobal}
              heading="From other series & projects"
              linkUrl="#/gallery"
              columns={4}
            />
          </section>
        )}
      </main>

      <Footer year={new Date().getFullYear()} portfolioPdfUrl={portfolioPdfUrl} />
    </div>
  );
}
