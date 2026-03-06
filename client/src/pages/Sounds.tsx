import { Link } from "wouter";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

export default function Sounds() {
  const { content } = useContent();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 section-py">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sounds" }]} />

          <h1 className="text-type-h1 font-semibold text-foreground mb-4">Sounds</h1>

          <p className="text-type-body leading-relaxed max-w-2xl mb-16 text-foreground">
            Sound and surface as parallel practices. Field recordings, electromagnetic modulation, sample manipulation.
            Repetition, distortion, constraint. Both document action, not intention.
            <br /><br />
            Not constructed, performed. Composition forms during recording. No edits, no second takes. One take — one line.
          </p>

          <div className="space-y-16">
            {(content?.sounds || []).map((s: any) => {
              const platform = String(s?.platform || "").toLowerCase();
              const iframeHeight = platform.includes("soundcloud") ? 166 : 120;

              return (
                <div key={s.slug}>
                  <div className="flex items-start justify-between gap-6 mb-2">
                    <Link href={`/sounds/${s.slug}`}>
                      <span className="text-type-body text-foreground hover:underline cursor-pointer">
                        {s.title || "Untitled"}
                      </span>
                    </Link>
                    <span className="text-type-small text-muted-foreground whitespace-nowrap">
                      {s.year ? String(s.year) : ""}
                      {s.meta?.label ? ` · ${s.meta.label}` : ""}
                    </span>
                  </div>

                  {s.summary && (
                    <p className="text-type-small text-muted-foreground mb-4">{s.summary}</p>
                  )}

                  {s.embed && (
                    <iframe
                      src={s.embed}
                      className="w-full border-0 rounded-sm"
                      style={{ height: iframeHeight }}
                      allow="autoplay"
                      loading="lazy"
                      title={s.title}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
