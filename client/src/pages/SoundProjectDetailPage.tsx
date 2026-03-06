import { useParams } from "wouter";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";
import { assetUrl } from "@/lib/assetUrl";

export default function SoundProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { content } = useContent();

  const s = (content?.sounds || []).find((x: any) => x.slug === slug);

  if (!s) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 section-py">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sounds", href: "/sounds" }, { label: "Not Found" }]} />
            <h1 className="text-type-h2 font-semibold mt-6">Project not found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = s.title || "Untitled";
  const year = String(s.year ?? "");
  const platform = (s.platform || "").toLowerCase();
  const embedUrl = (s.embed || "").trim();
  const iframeHeight = platform.includes("soundcloud") ? 166 : 120;

  // Video embed (YouTube etc.)
  const videoEmbed = (s.video || "").trim();

  // Body blocks
  const blocks = Array.isArray(s.bodyBlocks)
    ? s.bodyBlocks
    : typeof s.bodyBlocks === "string" && s.bodyBlocks.trim()
    ? [{ type: "p", text: s.bodyBlocks }]
    : Array.isArray(s.about)
    ? s.about.map((t: string) => ({ type: "p", text: t }))
    : [];

  // Photos
  const photos = Array.isArray(s.photos)
    ? s.photos.map((p: any) => typeof p === "string" ? { url: p, alt: "" } : p).filter((p: any) => p?.url)
    : [];

  // Meta
  const label = s.meta?.label || "";
  const platforms = Array.isArray(s.meta?.platforms) ? s.meta.platforms : s.platform ? [s.platform] : [];

  // Related
  const related = (content?.sounds || [])
    .filter((x: any) => x.slug !== slug)
    .map((x: any) => ({
      id: x.slug,
      title: x.title || "Untitled",
      year: String(x.year ?? ""),
      medium: (x.meta?.label || x.platform || "").toString().trim(),
      imageUrl: typeof x.cover === "string" ? x.cover : undefined,
      linkUrl: `/sounds/${x.slug}`,
      type: "sound_project" as const,
    }))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="site-container section-py">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sounds", href: "/sounds" }, { label: title }]} />

          <h1 className="text-type-h1 font-semibold text-foreground leading-tight" style={{ marginBottom: "var(--h1-mb)" }}>
            {title}
          </h1>

          <div className="text-type-small text-muted-foreground" style={{ marginBottom: "var(--heading-gap-sm)" }}>
            {year}{s.location ? ` · ${s.location}` : ""}{label ? ` · ${label}` : ""}
            {platforms.length ? ` · ${platforms.join(", ")}` : ""}
          </div>

          {/* Audio embed player */}
          {embedUrl && (
            <div style={{ marginBottom: "var(--block-gap-lg)" }}>
              <iframe
                src={embedUrl}
                className="w-full border-0 rounded-sm"
                style={{ height: iframeHeight }}
                allow="autoplay"
                loading="lazy"
                title={title}
              />
            </div>
          )}

          {/* Body text */}
          <div className="max-w-2xl">
            {blocks.map((b: any, i: number) => (
              <p key={i} className="text-type-body text-foreground leading-relaxed whitespace-pre-line" style={{ marginBottom: "var(--paragraph-gap)" }}>
                {b.text || ""}
              </p>
            ))}
          </div>

          {/* YouTube / video embed */}
          {videoEmbed && (
            <div className="mt-8" style={{ marginBottom: "var(--block-gap-lg)" }}>
              <div className="relative w-full" style={{ paddingBottom: "56.25%", height: 0 }}>
                <iframe
                  src={videoEmbed}
                  className="absolute top-0 left-0 w-full h-full rounded-sm"
                  style={{ border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                  title={`${title} — video`}
                />
              </div>
            </div>
          )}

          {/* Photos */}
          {photos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: "var(--block-gap-sm)" }}>
              {photos.map((p: any, i: number) => (
                <img
                  key={i}
                  src={assetUrl(p.url)}
                  alt={p.alt || ""}
                  className="w-full aspect-[3/2] object-cover rounded-sm transition-transform duration-500 hover:scale-[1.02]"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <GalleryGrid items={related} heading="More Sound Projects" linkUrl="/sounds" columns={4} />
        )}
      </main>
      <Footer />
    </div>
  );
}
