import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useContent } from "@/content/ContentProvider";
import { assetUrl } from "@/lib/assetUrl";

export default function Statement() {
  const { content } = useContent();
  const st = content?.statement;

  if (!st) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 section-py">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Statement" }]} />
            <h1 className="text-type-h1 font-semibold mb-8">Statement</h1>
            <p className="text-muted-foreground">No statement available.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const portrait = st.portrait ? assetUrl(st.portrait) : "";
  const paragraphs: string[] = Array.isArray(st.paragraphs) ? st.paragraphs : [];
  const pressKit = st.pressKitPdf || "";

  const exhibitions = (Array.isArray(st.exhibitions) ? st.exhibitions : [])
    .map((ex: any) => {
      if (typeof ex === "string") return ex;
      if (ex?.event) return `${ex.year ?? ""} — ${ex.event}`.trim();
      return "";
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="site-container section-py">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Statement" }]} />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
            {/* Portrait */}
            <div className="md:col-span-4">
              {portrait && (
                <img src={portrait} alt={content?.site?.artistName || ""} className="w-full max-w-[360px] aspect-[4/5] object-cover rounded-sm" />
              )}
            </div>

            {/* Text */}
            <div className="md:col-span-8">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-type-body text-foreground leading-relaxed mb-4">{p}</p>
              ))}

              {pressKit && (
                <p className="mt-8">
                  <a href={assetUrl(pressKit)} target="_blank" rel="noopener" className="text-type-small text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">
                    Download Press Kit (PDF)
                  </a>
                </p>
              )}

              {/* Exhibitions */}
              {exhibitions.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-type-h3 font-semibold mb-4">Exhibitions</h2>
                  <ul className="space-y-0">
                    {exhibitions.map((ex, i) => (
                      <li key={i} className="py-3 border-b border-border last:border-b-0 text-type-body text-foreground">
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
