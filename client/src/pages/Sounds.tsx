import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";
import { buildImageSet } from "@/lib/imageSet";
import { Link } from "wouter";

export default function Sounds() {
  const { content } = useContent();
  const projects = content?.sounds || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 site-container section-py">
        <h1 id="page-title" className="text-type-h1 font-semibold mb-8">
          Sounds
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {projects.map((p: any) => {
            const set = buildImageSet(p.cover);
            return (
              <Link key={p.slug} href={`#/sounds/${p.slug}`}>
                <a className="block group">
                  <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
                    <picture>
                      <source type="image/avif" srcSet={set.avif} sizes={set.sizes} />
                      <source type="image/webp" srcSet={set.webp} sizes={set.sizes} />
                      <img
                        src={set.fallback}
                        srcSet={set.webp}
                        sizes={set.sizes}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </picture>
                  </div>
                  <div className="mt-3">
                    <span className="block text-xs font-light text-muted-foreground">SOUNDS</span>
                    <h3 className="text-type-body font-medium text-foreground group-hover:underline">{p.title}</h3>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
