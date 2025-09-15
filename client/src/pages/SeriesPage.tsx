// client/src/pages/SeriesPage.tsx
import { useParams } from "wouter";
import { useEffect } from "react";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

interface SeriesWork {
  id: string;
  title: string;
  year: string;
  medium: string;
  imageUrl: string;
  linkUrl: string;
  type: "artwork";
}

interface SeriesData {
  title: string;
  year: string;
  intro: string | string[];
  works: SeriesWork[];
}

export default function SeriesPage() {
  const { series } = useParams();
  const { content } = useContent();

  // analytics
  useEffect(() => {
    if (series && typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "view_series", { series });
    }
  }, [series]);

  // Берём серию из content.json
  const ser = (content?.series || []).find((s: any) => s.slug === series);

  if (!ser) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header artistName={content?.site?.artistName || "Dmitrii Kremenskii"} />
        <main className="flex-1 section-py">
          <div className="site-container">
            <Breadcrumbs
              items={[
                { label: "Home", href: "#/", testId: "link-bc-home" },
                { label: "Gallery", href: "#/gallery", testId: "link-bc-gallery" },
                { label: "Not found", testId: "text-bc-current" },
              ]}
            />
            <h1 className="text-type-h2 font-semibold mt-6">Series not found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const seriesTitle = ser.title || series || "Series";
  const seriesYear = ser.year || "";
  const seriesIntro = ser.intro;

  // Сформируем карточки работ
  const works: SeriesWork[] = (Array.isArray(ser.works) ? ser.works : []).map((w: any, i: number) => {
    const first = Array.isArray(w.images) && w.images[0]
      ? (typeof w.images[0] === "string" ? w.images[0] : w.images[0]?.url || w.images[0]?.src || "")
      : "";
    return {
      id: w.slug || `w${i}`,
      title: w.title || "Untitled",
      year: String(w.year ?? ""),
      medium: w.technique || w.medium || "",
      imageUrl: first,
      linkUrl: `#/gallery/${series}/${w.slug || ""}`,
      type: "artwork" as const,
    };
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header artistName={content?.site?.artistName || "Dmitrii Kremenskii"} />

      <main className="flex-1">
        {/* Заголовок серии */}
        <section className="w-full section-py">
          <div className="site-container">
            <Breadcrumbs
              items={[
                { label: "Home", href: "#/", testId: "link-bc-home" },
                { label: "Gallery", href: "#/gallery", testId: "link-bc-gallery" },
                { label: seriesTitle, testId: "text-bc-current" },
              ]}
            />
            <div className="block-gap">
              <div>
                <span className="text-type-small text-muted-foreground uppercase tracking-wide">Series</span>
                <h1 id="series-title" tabIndex={-1} className="text-type-h1 font-semibold text-foreground h1-spacing">
                  {seriesTitle}
                </h1>
                {seriesYear && <p className="text-type-body text-muted-foreground">{seriesYear}</p>}
              </div>
              <div className="max-w-2xl">
                {Array.isArray(seriesIntro) ? (
                  seriesIntro.map((p: string, idx: number) => (
                    <p key={idx} className="text-type-body text-foreground leading-relaxed mb-3">{p}</p>
                  ))
                ) : (
                  <p className="text-type-body text-foreground leading-relaxed">{seriesIntro}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Сетка работ — портретные карточки */}
        <GalleryGrid
          items={works}
          columns={3}
          imageAspect="portrait" 
          imageAspectClass="aspect-[2/3]"   // <<< ВАЖНО: вертикальные карточки
        />
      </main>

      <Footer
        artistName={content?.site?.artistName || "Dmitrii Kremenskii"}
        year={new Date().getFullYear()}
        portfolioPdfUrl={content?.contacts?.portfolioPdf || "/files/kremenskii-portfolio.pdf"}
        socialLinks={{
          instagram: content?.contacts?.socials?.find((s: any) => /instagram/i.test(s.label))?.href,
          soundcloud: content?.contacts?.socials?.find((s: any) => /soundcloud/i.test(s.label))?.href,
          bandcamp: content?.contacts?.socials?.find((s: any) => /bandcamp/i.test(s.label))?.href,
        }}
      />
    </div>
  );
}
