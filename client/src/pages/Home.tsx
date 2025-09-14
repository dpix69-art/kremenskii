import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import { useContent } from "@/content/ContentProvider";

export default function Home() {
  const { content } = useContent();
  const portfolioPdfUrl = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(/^\/+/, "");

  const artworks = (content?.series || []).flatMap((s: any) =>
    (s.works || []).map((w: any) => ({
      id: w.slug,
      title: w.title,
      year: w.year,
      medium: w.technique,
      imageUrl: w.images?.[0]?.url || w.images?.[0],
      linkUrl: `#/gallery/${s.slug}/${w.slug}`,
      type: "artwork" as const,
    }))
  );

  const sounds = (content?.sounds || []).map((p: any) => ({
    id: p.slug,
    title: p.title,
    year: p.year,
    imageUrl: p.cover,
    linkUrl: `#/sounds/${p.slug}`,
    type: "sound" as const,
  }));

  const cards = [...artworks, ...sounds].sort(() => 0.5 - Math.random()).slice(0, 6);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <GalleryGrid items={cards} heading="Selected Works & Sounds" />
      </main>
      <Footer />
    </div>
  );
}
