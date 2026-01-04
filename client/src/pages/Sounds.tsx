// client/src/pages/Sounds.tsx
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

export default function Sounds() {
  const { content } = useContent();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="section-py flex-1">
        <div className="site-container heading-gap-lg">
          <Breadcrumbs
            items={[
              { label: "Home", href: "#/", testId: "link-bc-home" },
              { label: "Sounds", testId: "text-bc-current" },
            ]}
          />
          <h1
            id="page-title"
            tabIndex={-1}
            className="text-type-h1 font-semibold text-foreground h1-spacing"
          >
            {/* intentionally empty */}
          </h1>
        </div>

        <section style={{ marginTop: "var(--heading-gap-lg)", paddingBottom: "200px" }}>
          <div className="site-container">
            <h1 className="text-type-h1 font-semibold text-foreground h1-spacing">
              Sounds
            </h1>

            <p className="text-type-body leading-relaxed max-w-2xl pb-[72px]">
              Sound and surface as parallel practices. Field recordings, electromagnetic modulation, sample manipulation. Repetition, distortion, constraint. Both document action, not intention.
              <br />
              <br />
              Not constructed, performed. Composition forms during recording. No edits, no second takes. One take — one line. 
            </p>

            <div style={{ marginTop: "var(--paragraph-gap)" }} className="space-y-0">
              {(content?.sounds || []).map((s: any) => {
                const platform = String(s?.platform || "").toLowerCase();
                const iframeHeight = platform.includes("soundcloud") ? 166 : 120;

                return (
                  <div key={s.slug} className="space-y-2 pb-[72px]">
                    <div className="flex items-start justify-between gap-6">
                      <a
                        href={`#/sounds/${s.slug}`}
                        className="text-type-body leading-relaxed text-foreground hover:underline"
                      >
                        {s.title || "Untitled"}
                      </a>

                      <div className="text-type-small leading-snug text-muted-foreground whitespace-nowrap">
                        {s.year ? String(s.year) : ""}
                      </div>
                    </div>

                    {s.summary && (
                      <p className="text-type-small leading-relaxed text-muted-foreground max-w-[72ch]">
                        {s.summary}
                      </p>
                    )}  
                    <iframe
                      title={`${s.title || "Sound"} player`}
                      src={s.embed}
                      loading="lazy"
                      className="w-full border-0"
                      style={{ height: `${iframeHeight}px` }}
                      allow="encrypted-media; fullscreen"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
