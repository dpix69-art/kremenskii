import { useParams } from "wouter";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import SoundProjectDetail from "@/components/SoundProjectDetail";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";
import { assetUrl } from "@/lib/assetUrl";

type RouteParams = { slug: string };

function makeCompactEmbed(platform: string | undefined, raw: string | undefined): string {
  const url = (raw || "").trim();
  if (!url) return "";

  // SoundCloud: ключевое — visual=false и выключить всё лишнее
  if (platform === "soundcloud" || /soundcloud\.com/i.test(url)) {
    const u = new URL(url);
    // если это уже w.soundcloud.com/player - перезапишем параметры
    if (/w\.soundcloud\.com\/player/i.test(u.host + u.pathname)) {
      const params = u.searchParams;
      params.set("visual", "false");
      params.set("auto_play", "false");
      params.set("hide_related", "true");
      params.set("show_comments", "false");
      params.set("show_user", "false");
      params.set("show_reposts", "false");
      params.set("show_teaser", "false");
      return u.toString();
    }
    // иначе не трогаем структуру, но добавляем стандартные параметры если это player
    try {
      const maybe = new URL(url);
      const p = maybe.searchParams;
      p.set("visual", "false");
      p.set("auto_play", "false");
      p.set("hide_related", "true");
      p.set("show_comments", "false");
      p.set("show_user", "false");
      p.set("show_reposts", "false");
      p.set("show_teaser", "false");
      return maybe.toString();
    } catch {
      return url;
    }
  }

  // Bandcamp: уменьшаем size и убираем artwork
  if (platform === "bandcamp" || /bandcamp\.com/i.test(url)) {
    // заменим параметры в query-строке, если это embed URL
    try {
      const u = new URL(url);
      const p = u.searchParams;
      // типичный embed bandcamp — параметры часто в path-части. Если их нет в query — оставим url как есть.
      // но попробуем подменить size/artwork если присутствуют:
      if (p.has("size")) p.set("size", "small");
      if (p.has("artwork")) p.set("artwork", "none");
      if (p.has("tracklist")) p.set("tracklist", "false");
      return u.toString();
    } catch {
      // если это строка вида ...EmbeddedPlayer/...size=large... — просто заменим токены
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

  // Найти проект по slug
  const s = (content?.sounds || []).find((x: any) => x.slug === slug);
  if (!s) {
    // если нет такого — минимальный Not Found
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

  // обложку прячем — не передаём вовсе
  const coverImageUrl: string | undefined = undefined;

  // Текстовые блоки: bodyBlocks предпочтительнее; иначе about[], иначе пусто
  const bodyBlocks =
    (Array.isArray(s.bodyBlocks) && s.bodyBlocks.length > 0
      ? s.bodyBlocks
      : Array.isArray(s.about) && s.about.length > 0
      ? (s.about as string[]).map((text) => ({ type: "p" as const, text }))
      : []);

  // Треки — как есть из JSON
  const tracks = Array.isArray(s.tracks) ? s.tracks : [];

  // Метаданные — компактно
  const meta = {
    label: s?.meta?.label || "",
    platforms: Array.isArray(s?.meta?.platforms)
      ? s.meta.platforms
      : s?.platform
      ? [s.platform]
      : [],
  };

  // Компактный плеер
  const embeddedPlayerUrl = makeCompactEmbed(s?.platform, s?.embed);

  // Related: остальные проекты
  const relatedSounds = (content?.sounds || [])
    .filter((x: any) => x.slug !== slug)
    .map((x: any, idx: number) => {
      const cover = typeof x.cover === "string" ? x.cover.replace(/^\/+/, "") : "";
      const medium = (x?.meta?.label || x?.platform || "").toString().trim();
      return {
        id: x.slug || `sound-related-${idx + 1}`,
        title: x.title || "Untitled",
        year: String(x.year ?? ""),
        medium,
        imageUrl: cover ? assetUrl(cover) : "",
        linkUrl: `#/sounds/${x.slug || ""}`,
        type: "sound_project" as const,
      };
    })
    .slice(0, 6);

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
          /* coverImageUrl опускаем — скрываем обложку */
          bodyBlocks={bodyBlocks}
          tracks={tracks}
          meta={meta}
          embeddedPlayerUrl={embeddedPlayerUrl}
          compactPlayer
          hideCover
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
