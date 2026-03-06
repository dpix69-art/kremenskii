import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

export default function Impressum() {
  const { content } = useContent();
  const paras: string[] = Array.isArray(content?.impressum?.paragraphs) ? content!.impressum.paragraphs : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 section-py">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Impressum" }]} />
          <h1 className="text-type-h1 font-semibold text-foreground mb-8">Impressum</h1>
          <div className="max-w-lg">
            {paras.length > 0 ? (
              paras.map((t, i) => (
                <p key={i} className="text-type-body text-foreground leading-relaxed mb-4 whitespace-pre-line">{t}</p>
              ))
            ) : (
              <p className="text-type-body text-muted-foreground">No impressum content provided.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
