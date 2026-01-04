// client/src/pages/Sounds.tsx
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
// import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

export default function Sounds() {
  const { content } = useContent();

  const soundProjects = (content?.sounds || []).map((s: any) => ({
    id: s.slug,
    title: s.title || "Untitled",
    year: String(s.year ?? ""),
    medium: s?.meta?.label || (s.platform ? String(s.platform).toUpperCase() : ""),
    // локальная обложка, если задана; иначе автокавер подтянет GalleryGrid через usePlatformCover
    imageUrl: typeof s.cover === "string" ? s.cover.replace(/^\/+/, "") : undefined,
    linkUrl: `#/sounds/${s.slug}`,
    type: "sound_project" as const,
    platform: (s.platform || "").toLowerCase(), // "soundcloud" | "bandcamp"
    embedUrl: s.embed
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="section-py flex-1">
        <div className="site-container heading-gap-lg">
          <Breadcrumbs
            items={[
              { label: "Home", href: "#/", testId: "link-bc-home" },
              { label: "Sounds", testId: "text-bc-current" }
            ]}
          />
          <h1
            id="page-title"
            tabIndex={-1}
            className="text-type-h1 font-semibold text-foreground h1-spacing"
          >
            {/* Sounds */}
          </h1>
        </div>

        {/* <GalleryGrid
          items={soundProjects}
          columns={2} // хочешь крупнее/мельче: 2/3/4/6
        /> */}
        <section style={{ marginTop: "var(--heading-gap-lg)", paddingBottom: "200px" }}>
  <div className="site-container">
    <p className="text-type-small leading-snug font-semibold text-muted-foreground uppercase tracking-wide">
      Sounds
    </p>

    <div style={{ marginTop: "var(--paragraph-gap)" }} className="space-y-8">
      {(content?.sounds || []).map((s: any) => {
        const platform = String(s?.platform || "").toLowerCase();
        const iframeHeight =
          platform.includes("soundcloud") ? 166 : 120;

        return (
          <div key={s.slug} className="space-y-2 pb-[72px]">
            <div className="flex items-start justify-between gap-6">
              <a
                href={`#/sounds/${s.slug}`}
                className="text-type-body leading-relaxed text-foreground hover:underline"
              >
                {s.title || "Untitled"}
              </a>

              <div className="text-type-small leading-snug text-muted-foreground whitespace-nowrap">
                {s.year ? String(s.year) : ""}
              </div>
            </div>

            <iframe
              title={`${s.title || "Sound"} player`}
              src={s.embed}
              loading="lazy"
              className="w-full border-0"
              style={{ height: `${iframeHeight}px` }}
              allow="encrypted-media; fullscreen"
            />
          </div>
        );
      })}
    </div>
  </div>
</section>
      </main>
      <Footer />
    </div>
  );
}
