import { Link } from "wouter";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";
import { assetUrl } from "@/lib/assetUrl";

export default function Gallery() {
  const { content } = useContent();

  const seriesList = Array.isArray(content?.series) ? content!.series : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 section-py">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gallery" }]} />

          {seriesList.map((s: any) => {
            const works = s.works || [];
            const thumbs = (s.artworkImages || []).slice(0, 3).map((t: any) => assetUrl(typeof t === "string" ? t : t?.url || "")).filter(Boolean);
            const intro = Array.isArray(s.intro) ? s.intro.join("\n\n") : s.intro || "";
            const workCount = works.length;

            return (
              <article key={s.slug} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-16 mb-16 border-b border-border last:border-b-0 last:mb-0 last:pb-0">
                <Link href={`/gallery/${s.slug}`}>
                  <div className="grid grid-cols-3 gap-2 cursor-pointer">
                    {thumbs.map((src: string, i: number) => (
                      <img key={i} src={src} alt="" className="aspect-[4/5] object-cover rounded-sm w-full transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
                    ))}
                  </div>
                </Link>
                <div className="flex flex-col justify-center gap-3">
                  <span className="text-type-small text-muted-foreground uppercase tracking-wide">Series · {s.year || ""}</span>
                  <Link href={`/gallery/${s.slug}`}>
                    <span className="text-type-h2 font-semibold text-foreground cursor-pointer">{s.title}</span>
                  </Link>
                  {intro && <p className="text-type-body text-foreground leading-relaxed max-w-md whitespace-pre-line">{intro}</p>}
                  <p className="text-type-small text-muted-foreground">{workCount} work{workCount !== 1 ? "s" : ""}</p>
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
