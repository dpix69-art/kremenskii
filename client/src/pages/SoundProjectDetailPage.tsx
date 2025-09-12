import { useParams } from "wouter";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import SoundProjectDetail from "@/components/SoundProjectDetail";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";
import soundImage from "@assets/generated_images/Sound_art_installation_ace33df5.png";

type RouteParams = { slug: string };

export default function SoundProjectDetailPage() {
  const { slug } = useParams<RouteParams>();
  const { content } = useContent();

  // Найдём проект по slug в content.json
  const s = (content?.sounds || []).find((x: any) => x.slug === slug);

  const fallbackBodyBlocks = [
    { type: "h2" as const, text: "Concept" },
    {
      type: "p" as const,
      text:
        "This installation explores the acoustic properties of industrial spaces, using field recordings and live processing to create an immersive sound environment that responds to the physical architecture.",
    },
    {
      type: "p" as const,
      text:
        "The work was developed during a residency at the former factory space, incorporating both the building's natural acoustics and its industrial heritage into the composition.",
    },
    { type: "h2" as const, text: "Process" },
    {
      type: "p" as const,
      text:
        "Over the course of three weeks, I recorded the ambient sounds of the space at different times of day, capturing both the building's silence and the urban environment filtering through its walls.",
    },
  ];

  // Title/Year
  const projectTitle = s?.title || "Industrial Resonance";
  const projectYear = String(s?.year ?? "2023");

  // Location: из s.location {city,country,institution}, если нет — попробуем meta.venue
  const location =
    s?.location ||
    (s?.meta?.venue
      ? { city: "", country: "", institution: s.meta.venue }
      : { city: "Berlin", country: "Germany", institution: "Künstlerhaus Bethanien" });

  // Cover
  const coverImageUrl =
    (typeof s?.cover === "string" ? s.cover.replace(/^\/+/, "") : undefined) || soundImage;

  // Body blocks: поддерживаем s.bodyBlocks (массив заголовков/параграфов) ИЛИ s.about (массив строк)
  const bodyBlocks =
    (Array.isArray(s?.bodyBlocks) && s!.bodyBlocks.length > 0
      ? s!.bodyBlocks
      : Array.isArray(s?.about) && s!.about.length > 0
      ? (s!.about as string[]).map((text) => ({ type: "p" as const, text }))
      : fallbackBodyBlocks);

  // Tracks: из JSON как есть (title, duration, externalLink)
  const tracks = Array.isArray(s?.tracks) && s!.tracks.length > 0
    ? s!.tracks
    : [
        { title: "Factory Floor", duration: "12:34", externalLink: "https://soundcloud.com/artist/factory-floor" },
        { title: "Resonance Study #1", duration: "08:21" },
        { title: "Ambient Reconstruction", duration: "15:07", externalLink: "https://soundcloud.com/artist/ambient-reconstruction" },
      ];

  // Meta + embed
  const meta = {
    label: s?.meta?.label || "Experimental Sounds",
    platforms: Array.isArray(s?.meta?.platforms)
      ? s!.meta.platforms
      : s?.meta?.platform
      ? [s!.meta.platform]
      : ["Bandcamp", "SoundCloud"],
  };

  const embeddedPlayerUrl =
    (typeof s?.embed === "string" && s.embed) ||
    (typeof s?.embedUrl === "string" && s.embedUrl) ||
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/123456789&color=%23000000&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true";

  // Related: остальные проекты
  const relatedSounds =
    (content?.sounds || [])
      .filter((x: any) => x.slug !== slug)
      .map((x: any, idx: number) => {
        const cover =
          typeof x.cover === "string" ? x.cover.replace(/^\/+/, "") : soundImage;
        const medium =
          (x?.meta?.label || x?.meta?.platform || x?.meta?.venue || "").toString().trim();
        return {
          id: x.slug || `sound-related-${idx + 1}`,
          title: x.title || "Untitled",
          year: String(x.year ?? ""),
          medium,
          imageUrl: cover,
          linkUrl: `#/sounds/${x.slug || ""}`,
          type: "sound_project" as const,
        };
      })
      .slice(0, 6) || [];

  const portfolioPdfUrl = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(
    /^\/+/,
    ""
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="site-container section-py">
          <Breadcrumbs
            items={[
              { label: "Home", href: "#/", testId: "link-bc-home" },
              { label: "Sounds", href: "#/sounds", testId: "link-bc-sounds" },
              { label: projectTitle, testId: "text-bc-current" },
            ]}
          />
        </div>

        <SoundProjectDetail
          title={projectTitle}
          year={projectYear}
          location={location}
          coverImageUrl={coverImageUrl}
          bodyBlocks={bodyBlocks}
          tracks={tracks}
          meta={meta}
          embeddedPlayerUrl={embeddedPlayerUrl}
        />

        {relatedSounds.length > 0 && (
          <section>
            <GalleryGrid
              items={relatedSounds}
              heading="Related Sound Projects"
              linkUrl="#/sounds"
              columns={2}
            />
          </section>
        )}
      </main>

      <Footer year={new Date().getFullYear()} portfolioPdfUrl={portfolioPdfUrl} />
    </div>
  );
}
