import { useParams } from "wouter";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

export default function SeriesPage() {
  const { series } = useParams<{ series: string }>();
  const { content } = useContent();

  const ser = (content?.series || []).find((s: any) => s.slug === series);

  if (!ser) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 section-py">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gallery", href: "/gallery" }, { label: "Not found" }]} />
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

  const works = (Array.isArray(ser.works) ? ser.works : []).map((w: any, i: number) => {
    const first = Array.isArray(w.images) && w.images[0]
      ? (typeof w.images[0] === "string" ? w.images[0] : w.images[0]?.url || "")
      : "";
    return {
      id: w.slug || `w${i}`,
      title: w.title || "Untitled",
      year: String(w.year ?? ""),
      medium: w.technique || w.medium || "",
      imageUrl: first,
      linkUrl: `/gallery/${series}/${w.slug || ""}`,
      type: "artwork" as const,
    };
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="section-py">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gallery", href: "/gallery" }, { label: seriesTitle }]} />
            <div className="space-y-4">
              <span className="text-type-small text-muted-foreground uppercase tracking-wide">Series</span>
              <h1 className="text-type-h1 font-semibold text-foreground">{seriesTitle}</h1>
              {seriesYear && <p className="text-type-body text-muted-foreground">{seriesYear}</p>}
              <div className="max-w-2xl">
                {Array.isArray(seriesIntro) ? (
                  seriesIntro.map((p: string, idx: number) => (
                    <p key={idx} className="text-type-body text-foreground leading-relaxed mb-3">{p}</p>
                  ))
                ) : seriesIntro ? (
                  <p className="text-type-body text-foreground leading-relaxed">{seriesIntro}</p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <GalleryGrid items={works} columns={3} imageAspect="portrait" />
      </main>
      <Footer />
    </div>
  );
}
