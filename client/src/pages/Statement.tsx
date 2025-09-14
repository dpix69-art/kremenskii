import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";
import { assetUrl } from "@/lib/assetUrl";

export default function Statement() {
  const { content } = useContent();
  const st = content?.statement;

  if (!st) return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 site-container section-py">
        <h1 id="page-title" className="text-type-h1 font-semibold mb-8">Statement</h1>
        <p className="text-muted-foreground">No statement</p>
      </main>
      <Footer />
    </div>
  );

  const artistName = content?.site?.artistName ?? "Artist";
  const portrait = st.portrait ? assetUrl(st.portrait) : "";
  const paragraphs: string[] = Array.isArray(st.paragraphs) ? st.paragraphs : [];

  // Унифицированный список выставок: поддерживаем строки, {year,event}, {year,title,venue,city,country}
  const exhibitions = Array.isArray(st.exhibitions) ? st.exhibitions : [];
  const exhibitionsNormalized: string[] = exhibitions.map((ex: any) => {
    if (typeof ex === "string") return ex;
    if (ex && typeof ex === "object") {
      if (ex.event) return `${ex.year ?? ""} — ${ex.event}`.trim();
      const parts = [
        ex.year,
        ex.title,
        ex.venue,
        ex.city,
        ex.country,
      ].filter(Boolean);
      // Формат: "YEAR — Title, Venue, City, Country"
      if (parts.length > 0) {
        const [year, ...rest] = parts;
        return `${year ?? ""}${rest.length ? " — " + rest.join(", ") : ""}`;
      }
    }
    return "";
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 site-container section-py">
        <h1 id="page-title" className="text-type-h1 font-semibold mb-8">
          Statement
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            {portrait ? (
              <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
                <img
                  src={portrait}
                  alt={`Portrait of ${artistName}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2 space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-type-body text-foreground leading-relaxed">
                {p}
              </p>
            ))}

            {exhibitionsNormalized.length > 0 && (
              <div className="mt-6">
                <h3 className="text-type-h3 font-medium mb-4">Exhibitions</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {exhibitionsNormalized.map((line, i) => (
                    <li key={i}>{line}</li>
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
