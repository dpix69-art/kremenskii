import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";
import { useParams } from "wouter";
import { buildImageSet } from "@/lib/imageSet";

type RouteParams = { slug: string };

export default function SoundProjectDetailPage() {
  const { slug } = useParams<RouteParams>();
  const { content } = useContent();
  const project = (content?.sounds || []).find((p: any) => p.slug === slug);

  if (!project) return <div>Sound project not found</div>;

  const portfolioPdfUrl = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(/^\/+/, "");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 site-container section-py">
        <h1 id="project-title" className="text-type-h1 font-semibold mb-8">
          {project.title}
        </h1>
        {project.bodyBlocks?.map((block: string, i: number) => (
          <p key={i} className="mb-4 text-type-body text-foreground leading-relaxed">
            {block}
          </p>
        ))}

        {project.embed && (
          <div className="my-6">
            <iframe
              src={project.embed}
              className="w-full"
              height="120"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              title={project.title}
            ></iframe>
          </div>
        )}

        {project.photos?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
            {project.photos.map((ph: string, i: number) => {
              const set = buildImageSet(ph);
              return (
                <picture key={i}>
                  <source type="image/avif" srcSet={set.avif} sizes={set.sizes} />
                  <source type="image/webp" srcSet={set.webp} sizes={set.sizes} />
                  <img
                    src={set.fallback}
                    srcSet={set.webp}
                    sizes={set.sizes}
                    alt={`Photo ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-contain rounded"
                  />
                </picture>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
