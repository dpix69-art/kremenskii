// client/src/pages/Impressum.tsx
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

export default function Impressum() {
  const { content } = useContent();
  const paras: string[] =
    Array.isArray(content?.impressum?.paragraphs) ? content!.impressum.paragraphs : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 section-py">
        <div className="site-container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "#/", testId: "link-bc-home" },
              { label: "Impressum", testId: "text-bc-current" },
            ]}
          />

          <h1 id="page-title" tabIndex={-1} className="text-type-h1 font-semibold text-foreground h1-spacing">
            Impressum
          </h1>

          <div className="prose max-w-none">
            {paras.length > 0 ? (
              paras.map((t, i) => (
                <p key={i} className="text-type-body text-foreground leading-relaxed mb-4">
                  {t}
                </p>
              ))
            ) : (
              <p className="text-type-body text-muted-foreground">
                No impressum content provided in <code>content.json</code>.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
