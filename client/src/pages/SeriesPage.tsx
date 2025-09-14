import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import { useContent } from "@/content/ContentProvider";
import { useParams } from "wouter";

type RouteParams = { slug: string };

export default function SeriesPage() {
  const { slug } = useParams<RouteParams>();
  const { content } = useContent();
  const series = (content?.series || []).find((s: any) => s.slug === slug);

  if (!series) return <div>Series not found</div>;

  const items = (series.works || []).map((w: any) => ({
    id: w.slug,
    title: w.title,
    year: w.year,
    medium: w.technique,
    imageUrl: w.images?.[0]?.url || w.images?.[0],
    linkUrl: `#/gallery/${series.slug}/${w.slug}`,
    type: "artwork" as const,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="site-container section-py">
          <h1 id="series-title" className="text-type-h1 font-semibold mb-8">
            {series.title}
          </h1>
          {series.intro && <p className="mb-6 text-muted-foreground">{series.intro}</p>}
          <GalleryGrid items={items} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
