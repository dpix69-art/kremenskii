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
      ? [{ type: "p" a]()
