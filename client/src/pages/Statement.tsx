import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import StatementPage from "@/components/StatementPage";
import Footer from "@/components/Footer";
import portraitFallback from "@assets/generated_images/Professional_artist_portrait_0c565b16.png";
import { useContent } from "@/content/ContentProvider";

export default function Statement() {
  const { content } = useContent();

  const statementText: string[] =
    content?.statement?.paragraphs ?? [
      "My practice investigates the intersection of material and meaning, exploring how physical substances carry cultural and emotional weight beyond their immediate visual properties.",
      "Through painting, sculpture, and sound, I examine the boundaries between the constructed and the found, the industrial and the organic, seeking moments where these distinctions collapse or reveal their arbitrariness.",
      "Recent work has focused on the materiality of color itself—not as representation or symbol, but as physical substance that occupies space and time, accumulates history, and bears the traces of its own making."
    ];

  const exhibitions:
    | { year: string; event: string }[]
    | undefined = content?.statement?.exhibitions ?? [
      { year: "2024", event: "Material Traces, Contemporary Art Gallery, Berlin" },
      { year: "2023", event: "Substance and Surface, Museum of Modern Art, Vienna" }
    ];

  const portraitFromJson =
    content?.statement?.portrait && content.statement.portrait.replace(/^\/+/, "");
  const portraitImageUrl = portraitFromJson || portraitFallback;

  const email = content?.contacts?.email ?? "hi@example.art";
  const portfolioPdfUrl = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(
    /^\/+/,
    ""
  );

  const socialLinks = (content?.contacts?.socials || []).reduce((acc: any, s: any) => {
    const key = String(s.label || "").toLowerCase();
    if (["instagram", "soundcloud", "bandcamp"].includes(key)) acc[key] = s.href;
    return acc;
  }, {}) as any;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="site-container section-py">
          <Breadcrumbs
            items={[
              { label: "Home", href: "#/", testId: "link-bc-home" },
              { label: "Statement", testId: "text-bc-current" }
            ]}
          />
        </div>

        <StatementPage
          portraitImageUrl={portraitImageUrl}
          statement={statementText}
          exhibitions={exhibitions}
          portraitPosition="left"
        />
      </main>

      <Footer
        year={new Date().getFullYear()}
        portfolioPdfUrl={portfolioPdfUrl}
        socialLinks={socialLinks}
      />
    </div>
  );
}
