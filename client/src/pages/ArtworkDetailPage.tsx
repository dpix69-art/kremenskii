import { useParams, Link } from "wouter";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import GalleryGrid from "@/components/GalleryGrid";
import ImageZoom from "@/components/ImageZoom";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";
import { assetUrl } from "@/lib/assetUrl";

function formatPrice(sale: any): string {
  const mode = sale?.price?.mode;
  if (mode === "on_request") return "Price on request";
  if (mode === "fixed" && typeof sale?.price?.amount === "number") {
    const amount = sale.price.amount;
    const currency = sale.price.currency || "EUR";
    try { return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(amount); }
    catch { return `${amount} ${currency}`; }
  }
  return "";
}

/**
 * Given an image URL like "images/farbkoerper/fkb-01.jpg"
 * returns the thumb version: "images/farbkoerper/fkb-01-thumb.jpg"
 * Falls back to original if thumb doesn't follow convention.
 */
function thumbUrl(src: string): string {
  if (!src) return "";
  const dot = src.lastIndexOf(".");
  if (dot === -1) return assetUrl(src);
  const base = src.slice(0, dot);
  const ext = src.slice(dot);
  // Don't double-thumb
  if (base.endsWith("-thumb")) return assetUrl(src);
  return assetUrl(`${base}-thumb${ext}`);
}

function rawUrl(imgObj: any): string {
  if (!imgObj) return "";
  return typeof imgObj === "string" ? imgObj : imgObj.url || imgObj.src || "";
}

export default function ArtworkDetailPage() {
  const { series, slug } = useParams<{ series: string; slug: string }>();
  const { content } = useContent();

  const ser = (content?.series || []).find((s: any) => s.slug === series);
  const work = ser?.works?.find((w: any) => w.slug === slug);
  const seriesTitle = ser?.title || series || "Series";
  const email = content?.contacts?.email || "hi@kremenskii.art";

  if (!work) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 section-py">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gallery", href: "/gallery" }, { label: "Not found" }]} />
            <h1 className="text-type-h2 font-semibold mt-6">Artwork not found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = work.title || "Untitled";
  const year = String(work.year ?? "");
  const technique = work.technique || work.medium || "";
  const dimensions = work.dimensions || "";
  const sale = work.sale;
  const availability = sale?.availability || "";
  const price = availability === "available" ? formatPrice(sale) : "";

  // Images
  const imgs = Array.isArray(work.images) ? work.images : [];
  const mainRaw = rawUrl(imgs[0]);
  const mainFull = mainRaw ? assetUrl(mainRaw) : "";
  const mainThumb = mainRaw ? thumbUrl(mainRaw) : "";
  const details = imgs.slice(1).map((im: any) => rawUrl(im)).filter(Boolean);

  // Related
  const related = (ser?.works || [])
    .filter((w: any) => w.slug !== slug)
    .map((w: any, i: number) => {
      const first = Array.isArray(w.images) && w.images[0];
      const url = rawUrl(first);
      return {
        id: w.slug || `r${i}`,
        title: w.title || "Untitled",
        year: String(w.year ?? ""),
        medium: w.technique || w.medium || "",
        imageUrl: url,
        linkUrl: `/gallery/${series}/${w.slug}`,
        type: "artwork" as const,
      };
    })
    .slice(0, 8);

  // Prev/Next
  const workIdx = (ser?.works || []).findIndex((w: any) => w.slug === slug);
  const prevWork = workIdx > 0 ? ser.works[workIdx - 1] : null;
  const nextWork = workIdx >= 0 && workIdx < (ser?.works?.length || 0) - 1 ? ser.works[workIdx + 1] : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="site-container section-py">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Gallery", href: "/gallery" },
            { label: seriesTitle, href: `/gallery/${series}` },
            { label: title },
          ]} />

          {/* Layout: image + meta */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Main image with zoom */}
            <div className="lg:col-span-7">
              {mainFull ? (
                <ImageZoom
                  thumbSrc={mainThumb}
                  fullSrc={mainFull}
                  alt={title}
                  zoomScale={2.5}
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-muted rounded-sm" />
              )}
            </div>

            {/* Meta panel */}
            <div className="lg:col-span-5 pt-2">
              <h1 className="text-type-h1 font-semibold text-foreground leading-tight" style={{ marginBottom: "var(--h1-mb)" }}>
                {title}
              </h1>

              {/* Availability badge */}
              {availability === "available" && (
                <span className="inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide border rounded-sm text-green-700 border-green-700 mb-6">
                  Available
                </span>
              )}
              {availability === "sold" && (
                <span className="inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide border rounded-sm text-muted-foreground border-muted-foreground/30 mb-6">
                  Sold
                </span>
              )}

              <dl className="space-y-5">
                {seriesTitle && (
                  <div>
                    <dt className="text-type-small font-semibold text-foreground">Series</dt>
                    <dd className="text-type-body text-foreground">{seriesTitle}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-type-small font-semibold text-foreground">Year</dt>
                  <dd className="text-type-body text-foreground">{year}</dd>
                </div>
                {technique && (
                  <div>
                    <dt className="text-type-small font-semibold text-foreground">Technique</dt>
                    <dd className="text-type-body text-foreground">{technique}</dd>
                  </div>
                )}
                {dimensions && (
                  <div>
                    <dt className="text-type-small font-semibold text-foreground">Dimensions</dt>
                    <dd className="text-type-body text-foreground">{dimensions}</dd>
                  </div>
                )}
                {price && (
                  <div>
                    <dt className="text-type-small font-semibold text-foreground">Price</dt>
                    <dd className="text-type-body text-foreground">{price}</dd>
                  </div>
                )}
              </dl>

              {/* Soft inquiry — only for available works */}
              {availability === "available" && (
                <p className="mt-8 pt-6 border-t border-border">
                  <a
                    href={`mailto:${email}?subject=${encodeURIComponent(`Inquiry: ${title}`)}`}
                    className="inquiry-link text-type-small"
                  >
                    For inquiries — {email}
                  </a>
                </p>
              )}

              {/* Prev / Next */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-border">
                {prevWork && (
                  <Link href={`/gallery/${series}/${prevWork.slug}`}>
                    <span className="text-type-small text-muted-foreground hover:text-foreground transition-colors cursor-pointer">← {prevWork.title}</span>
                  </Link>
                )}
                <div className="flex-1" />
                {nextWork && (
                  <Link href={`/gallery/${series}/${nextWork.slug}`}>
                    <span className="text-type-small text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{nextWork.title} →</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detail images */}
        {details.length > 0 && (
          <section className="section-py">
            <div className="site-container">
              <h2 className="text-type-h3 font-semibold" style={{ marginBottom: "var(--h2-mb)" }}>Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {details.map((src: string, i: number) => (
                  <img key={i} src={thumbUrl(src)} alt="Detail" className="w-full aspect-square object-cover rounded-sm transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <GalleryGrid items={related} heading={`More from ${seriesTitle}`} linkUrl={`/gallery/${series}`} columns={4} />
        )}
      </main>
      <Footer />
    </div>
  );
}
