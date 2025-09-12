import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";
import soundImage from "@assets/generated_images/Sound_art_installation_ace33df5.png";

export default function Sounds() {
  const { content } = useContent();

  // Мапим sounds из content.json → формат карточек GalleryGrid
  const soundsFromJson =
    (content?.sounds || []).map((s: any, idx: number) => {
      const cover =
        typeof s.cover === "string" ? s.cover.replace(/^\/+/, "") : undefined;

      // medium: соберём краткую подпись из meta (если есть),
      // иначе оставим пустой (или можно подставить город/площадку, когда появится в JSON)
      const medium =
        (s?.meta?.label || s?.meta?.platform || s?.meta?.venue || "")
          .toString()
          .trim();

      return {
        id: s.slug || String(idx + 1),
        title: s.title || "Untitled",
        year: String(s.year ?? ""),
        medium,
        imageUrl: cover || soundImage,
        linkUrl: `#/sounds/${s.slug || ""}`,
        type: "sound_project" as const,
      };
    }) || [];

  // Фолбэк — твой прежний статический список (если в JSON пока пусто)
  const fallbackProjects = [
    {
      id: "1",
      title: "Industrial Resonance",
      year: "2023",
      medium: "Berlin, Germany • Künstlerhaus Bethanien",
      imageUrl: soundImage,
      linkUrl: "#/sounds/industrial-resonance",
      type: "sound_project" as const,
    },
    {
      id: "2",
      title: "Spatial Frequencies",
      year: "2022",
      medium: "Vienna, Austria • Museum of Applied Arts",
      imageUrl: soundImage,
      linkUrl: "#/sounds/spatial-frequencies",
      type: "sound_project" as const,
    },
    {
      id: "3",
      title: "Material Voices",
      year: "2022",
      medium: "Munich, Germany • Kunstverein München",
      imageUrl: soundImage,
      linkUrl: "#/sounds/material-voices",
      type: "sound_project" as const,
    },
    {
      id: "4",
      title: "Urban Field Studies",
      year: "2021",
      medium: "London, UK • ICA London",
      imageUrl: soundImage,
      linkUrl: "#/sounds/urban-field-studies",
      type: "sound_project" as const,
    },
  ];

  const soundProjects =
    soundsFromJson.length > 0 ? soundsFromJson : fallbackProjects;

  const portfolioPdfUrl = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(
    /^\/+/,
    ""
  );

  const soundProjects = (content?.sounds || []).map((s: any) => ({
  id: s.slug,
  title: s.title,
  year: String(s.year ?? ""),
  medium: s?.meta?.label || (s.platform ? s.platform.toUpperCase() : ""),
  imageUrl: s.cover ? s.cover.replace(/^\/+/, "") : undefined,
  linkUrl: `#/sounds/${s.slug}`,
  type: "sound_project" as const,
  platform: (s.platform || "").toLowerCase(),
  embedUrl: s.embed
}));


  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header сам возьмёт имя из content.json */}
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
            Sounds
          </h1>
        </div>

        <GalleryGrid items={soundProjects} columns={2} />
      </main>

      <Footer year={new Date().getFullYear()} portfolioPdfUrl={portfolioPdfUrl} />
    </div>
  );
}
