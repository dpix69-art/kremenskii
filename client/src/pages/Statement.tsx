import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";
import { buildImageSet } from "@/lib/imageSet";

export default function Statement() {
  const { content } = useContent();
  const st = content?.statement;
  const portfolioPdfUrl = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(/^\/+/, "");

  if (!st) return <div>No statement</div>;

  const portrait = st.portrait;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 site-container section-py">
        <h1 id="page-title" className="text-type-h1 font-semibold mb-8">
          Statement
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            {portrait && (
              <picture>
                <source type="image/avif" srcSet={buildImageSet(portrait).avif} sizes="300px" />
                <source type="image/webp" srcSet={buildImageSet(portrait).webp} sizes="300px" />
                <img
                  src={buildImageSet(portrait).fallback}
                  srcSet={buildImageSet(portrait).webp}
                  sizes="300px"
                  alt="Portrait"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto rounded"
                />
              </picture>
            )}
          </div>
          <div className="md:col-span-2 space-y-4">
            {st.paragraphs?.map((p: string, i: number) => (
              <p key={i} className="text-type-body text-foreground leading-relaxed">
                {p}
              </p>
            ))}
            {st.exhibitions?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-type-h3 font-medium mb-4">Exhibitions</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {st.exhibitions.map((ex: any, i: number) => (
                    <li key={i}>
                      {typeof ex === "string"
                        ? ex
                        : `${ex.year} — ${ex.title}, ${ex.venue}, ${ex.city}, ${ex.country}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
