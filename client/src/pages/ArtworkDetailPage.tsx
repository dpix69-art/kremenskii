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

// SVG-заглушка (4:5) на случай отсутствия изображений у работы
const BLANK_SVG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="100%" height="100%" fill="%23f2f2f2"/></svg>';

// helper: форматировать цену из sale
function formatPriceLabel(sale: any): string | "" {
  const mode = sale?.price?.mode;
  if (mode === "on_request") return "Price on request";
  if (mode === "fixed" && typeof sale?.price?.amount === "number") {
    const amount = sale.price.amount;
    const currency = sale.price.currency || "EUR";
    try {
      return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(amount);
    } catch {
      return `${amount} ${currency}`;
    }
  }
  return "";
}

export default function ArtworkDetailPage() {
  const { series, slug } = useParams<RouteParams>();
  const { content } = useContent();

  // 1) Найти серию и работу
  const ser = (content?.series || []).find((s: any) => s.slug === series);
  const work = ser?.works?.find((w: any) => w.slug === slug);

  const seriesMap: Record<string, string> = {
    farbkoerper: "Farbkörper",
    "pgsrd-trc": "Plywood Gravel Sand Road Dust (TRC)",
  };

  const seriesTitle = ser?.title || seriesMap[series!] || series || "Unknown Series";

  // 2) Основные поля
  const workTitle = work?.title || "Untitled";
  const year = String(work?.year ?? "");
  const medium = work?.technique || work?.medium || "";
  const dimensions = work?.dimensions || "";

  // Читаем sale (с поддержкой legacy)
  const sale = (work as any)?.sale;
  const legacyAvailability = work?.availability;
  const legacyPrice = work?.price;

  const availabilityRaw =
    (sale?.availability as string) ||
    (typeof legacyAvailability === "string" ? legacyAvailability : "") ||
    "";

  const availability = (availabilityRaw || "") as
    | "available"
    | "reserved"
    | "sold"
    | "not_for_sale"
    | "";

  const priceFromSale = sale ? formatPriceLabel(sale) : "";
  const priceLegacy = typeof legacyPrice === "string" ? legacyPrice : "";

  // Показываем цену только если доступно
  const hidePrice =
    availability === "sold" ||
    availability === "reserved" ||
    availability === "not_for_sale";

  const price: string | undefined =
    hidePrice ? undefined : (priceFromSale || priceLegacy || undefined);

  // 3) Описание: work.about[] или intro серии (string | string[])
  const seriesIntroParts: string[] = Array.isArray(ser?.intro)
    ? ser!.intro
    : ser?.intro
    ? [String(ser!.intro)]
    : [];

  const description: string[] =
    Array.isArray(work?.about) && work!.about.length > 0
      ? (work!.about as string[])
      : seriesIntroParts;

  // 4) Изображения: нормализуем и гарантируем минимум 1 плейсхолдер
  const imgs = Array.isArray(work?.images) ? (work!.images as any[]) : [];
  let artworkImages =
    imgs
      .map((it: any, idx: number) => {
        const raw = typeof it === "string" ? it : it?.url || it?.src || "";
        if (!raw) return null;
        const normalized = String(raw).replace(/^\/+/, "");
        const role =
          (it && typeof it === "object" && it.role) || (idx === 0 ? "main" : "detail");
        return {
          url: assetUrl(normalized),
          role: (role || "detail") as "main" | "detail" | "angle" | "poster" | "installation-view",
          alt: `${workTitle} - ${role || "detail"}`,
        };
      })
      .filter(Boolean) as { url: string; role: any; alt: string }[];

  if (artworkImages.length === 0) {
    artworkImages = [
      { url: BLANK_SVG, role: "main" as const, alt: `${workTitle} - placeholder` },
    ];
  }

  // 5) Prev/Next в серии
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

  // 6) Related
  const relatedInSeries =
    (ser?.works || [])
      .filter((w: any) => w.slug !== slug)
      .map((w: any, i: number) => {
        const first = Array.isArray(w.images) && w.images[0] ? w.images[0] : undefined;
        const raw = typeof first === "string" ? first : first?.src || first?.url || "";
        const normalized = raw ? String(raw).replace(/^\/+/, "") : "";
        const imageUrl = normalized ? assetUrl(normalized) : BLANK_SVG;
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

  const relatedGlobal =
    (content?.series || [])
      .filter((s: any) => s.slug !== series)
      .flatMap((s: any) => (Array.isArray(s.works) ? s.works.slice(0, 1) : []))
      .map((w: any, i: number) => {
        const first = Array.isArray(w.images) && w.images[0] ? w.images[0] : undefined;
        const raw = typeof first === "string" ? first : first?.src || first?.url || "";
        const normalized = raw ? String(raw).replace(/^\/+/, "") : "";
        const imageUrl = normalized ? assetUrl(normalized) : BLANK_SVG;

        const parentSeries = (content?.series || []).find((s: any) =>
          Array.isArray(s.works) ? s.works.some((it: any) => it.slug === w.slug) : false
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

  // 7) Analytics
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
