import { useContent } from "@/content/ContentProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Statement() {
  const { content } = useContent();

  const artistName = content?.site?.artistName ?? "Artist Name";
  const portrait = content?.statement?.portrait; // пока может быть attached_assets/..., позже сменим на images/...
  const paragraphs: string[] = content?.statement?.paragraphs ?? [
    "Artist statement paragraph 1.",
    "Artist statement paragraph 2.",
  ];
  const pressKit = (content?.statement?.pressKitPdf ?? "files/press-kit.pdf").replace(/^\/+/, "");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header artistName={artistName} />

      <main className="flex-1">
        <section className="section-py">
          <div className="site-container">
            <h1 id="page-title" tabIndex={-1} className="text-type-h1 font-semibold h1-spacing">
              Statement
            </h1>

            <div className="grid gap-8 md:grid-cols-12">
              {/* Portrait (optional) */}
              <div className="md:col-span-4">
                {portrait && (
                  <img
                    src={portrait.replace(/^\/+/, "")}
                    alt="Artist portrait"
                    className="w-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Text */}
              <div className="md:col-span-8 text-type-body leading-relaxed space-y-[var(--paragraph-gap)]">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}

                <div className="mt-6">
                  <a href={pressKit} className="underline underline-offset-4">
                    Press kit (PDF)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        artistName={artistName}
        year={new Date().getFullYear()}
        portfolioPdfUrl={(content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(/^\/+/, "")}
        socialLinks={
          (content?.contacts?.socials || []).reduce((acc: any, s: any) => {
            const key = String(s.label || "").toLowerCase();
            if (["instagram", "soundcloud", "bandcamp"].includes(key)) acc[key] = s.href;
            return acc;
          }, {}) as any
        }
      />
    </div>
  );
}
