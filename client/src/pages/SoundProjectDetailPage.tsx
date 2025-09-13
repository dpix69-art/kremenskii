// client/src/pages/SoundProjectDetailPage.tsx
import { useParams } from "wouter";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import SoundProjectDetail from "@/components/SoundProjectDetail";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

type RouteParams = { slug: string };

// компактные параметры для плееров
function makeCompactEmbed(platform: string | undefined, raw: string | undefined): string {
  const url = (raw || "").trim();
  if (!url) return "";

  // SoundCloud — visual=false и выключаем лишнее
  if (platform === "soundcloud" || /soundcloud\.com/i.test(url)) {
    try {
      const u = new URL(url);
      const p = u.searchParams;
      p.set("visual", "false");
      p.set("auto_play", "false");
      p.set("hide_related", "true");
      p.set("show_comments", "false");
      p.set("show_user", "false");
      p.set("show_reposts", "false");
      p.set("show_teaser", "false");
      return u.toString();
    } catch {
      return url;
    }
  }

  // Bandcamp — ужимаем размер и убираем обложку/треклист
  if (platform === "bandcamp" || /bandcamp\.com/i.test(url)) {
    try {
      const u = new URL(url);
      const p = u.searchParams;
      if (p.has("size")) p.set("size", "small");
      if (p.has("artwork")) p.set("artwork", "none");
      if (p.has("tracklist")) p.set("tracklist", "false");
      return u.toString();
    } catch {
      return url
        .replace(/size=large/gi, "size=small")
        .replace(/artwork=(large|small)/gi, "artwork=none")
        .replace(/tracklist=true/gi, "tracklist=false");
    }
  }

  return url;
}

export default function SoundProjectDetailPage() {
  const { slug } = useParams<RouteParams>();
  const { content } = useContent();

  // найдём проект по slug
  const s = (content?.sounds || []).find((x: any) => x.slug === slug);
  if (!s) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 section-py">
          <div className="site-container">
            <Breadcrumbs
              items={[
                { label: "Home", href: "#/", testId: "link-bc-home" },
                { label: "Sounds", href: "#/sounds", testId: "link-bc-sounds" },
                { label: "Not Found", testId: "text-bc-current" },
              ]}
            />
            <h1 className="text-type-h2 font-semibold mt-6">Project not found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const projectTitle = s.title || "Untitled";
  const projectYear = String(s.year ?? "");
  const location = s.location || undefined;

  // --- текстовые блоки: массив/строка/резерв ---
  const bodyBlocks =
    Array.isArray(s.bodyBlocks) && s.bodyBlocks.length > 0
      ? s.bodyBlocks
      : typeof s.bodyBlocks === "string" && s.bodyBlocks.trim().length > 0
      ? [{ type: "p" as const, text: s.bodyBlocks }]
      : Array.isArray(s.about) && s.about.length > 0
      ? (s.about as string[]).map((text) => ({ type: "p" as const, text }))
      : [];

  // --- фото проекта: массив объектов {url, alt?} ---
  const photos =
    Array.isArray(s.photos)
      ? s.photos.filter((p: any) => typeof p?.url === "string" && p.url.trim().length > 0)
      : [];

  // треки — есть в JSON, но список мы скрываем в компоненте (showTracks=false по умолчанию)
  const tracks = Array.isArray(s.tracks) ? s.tracks : [];

  // метаданные
  const meta = {
    label: s?.meta?.label || "",
    platforms: Array.isArray(s?.meta?.platforms)
      ? s.meta.platforms
      : s?.platform
      ? [s.platform]
      : [],
  };

  // компактный плеер
  const embeddedPlayerUrl = makeCompactEmbed(s?.platform, s?.embed);

  // related — остальные проекты (до 12 шт.)
  const relatedSounds = (content?.sounds || [])
    .filter((x: any) => x.slug !== slug)
    .map((x: any, idx: number) => {
      const imageUrl = typeof x.cover === "string" ? x.cover.replace(/^\/+/, "") : undefined;
      const medium = (x?.meta?.label || x?.platform || "").toString().trim();
      return {
        id: x.slug || `sound-related-${idx + 1}`,
        title: x.title || "Untitled",
        year: String(x.year ?? ""),
        medium,
        imageUrl,
        linkUrl: `#/sounds/${x.slug || ""}`,
        type: "sound_project" as const,
        platform: (x.platform || "").toLowerCase(),
        embedUrl: x.embed,
      };
    })
    .slice(0, 12);

  const portfolioPdfUrl = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(/^\/+/, "");

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
          // cover скрыта:
          hideCover
          // текст
          bodyBlocks={bodyBlocks}
          // список треков не показываем: showTracks=false по умолчанию
          tracks={tracks}
          meta={meta}
          // компактный плеер
          embeddedPlayerUrl={embeddedPlayerUrl}
          compactPlayer
          // ВАЖНО: передаём фотографии!
          photos={photos}
        />

        {relatedSounds.length > 0 && (
          <section>
            <GalleryGrid
              items={relatedSounds}
              heading="Related Sound Projects"
              linkUrl="#/sounds"
              columns={4}
            />
          </section>
        )}
      </main>

      <Footer year={new Date().getFullYear()} portfolioPdfUrl={portfolioPdfUrl} />
    </div>
  );
}
