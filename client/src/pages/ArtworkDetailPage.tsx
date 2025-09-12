import { useParams } from "wouter";
import { useEffect } from "react";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArtworkDetail from "@/components/ArtworkDetail";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

import blueAbstractImage from "@assets/generated_images/Blue_abstract_color_field_53f088fd.png";
import industrialSculptureImage from "@assets/generated_images/Industrial_sculpture_assemblage_2b04ef29.png";
import gesturalPaintingImage from "@assets/generated_images/Gestural_earth_tone_painting_554103d6.png";
import minimalistInstallationImage from "@assets/generated_images/White_minimalist_installation_e967bdd0.png";
import digitalPrintImage from "@assets/generated_images/Digital_glitch_print_392d678b.png";

type RouteParams = { series: string; slug: string };

export default function ArtworkDetailPage() {
  const { series, slug } = useParams<RouteParams>();
  const { content } = useContent();

  // --- 1) Найдём серию и работу в content.json ---
  const ser = (content?.series || []).find((s: any) => s.slug === series);
  const work = ser?.works?.find((w: any) => w.slug === slug);

  // Мап серий для заголовка (если серии нет в JSON)
  const seriesMap: Record<string, string> = {
    farbkoerper: "Farbkoerper",
    pgsrd: "Plywood-Gravel-Sand-Road-Dust (PGSRD)",
    singles: "Singles",
    graphics: "Graphics",
  };

  const seriesTitle = ser?.title || seriesMap[series!] || series || "Unknown Series";

  // --- 2) Основные поля работы ---
  const workTitle = work?.title || "Untitled Study #12";
  const year = String(work?.year ?? "2024");
  const medium = work?.technique || work?.medium || "Mixed media on canvas";
  const dimensions = work?.dimensions || "120 × 90 cm";
  const price = work?.price || "€3,200";
  const availability = work?.availability || "available";

  // Описание: поддерживаем work.about (массив строк). Иначе — фолбэк.
  const description: string[] =
    (Array.isArray(work?.about) && work!.about.length > 0
      ? (work!.about as string[])
      : [
          "This work continues the exploration of color as material substance, investigating how pigment can occupy and define space beyond the traditional boundaries of painting.",
          "The composition emerges from a process of layering and excavation, where each application of paint both conceals and reveals the surface beneath.",
          "Part of the ongoing Farbkoerper series, this piece questions the relationship between color perception and physical presence.",
        ]);

  // --- 3) Изображения работы ---
  const imgs = Array.isArray(work?.images) ? (work!.images as any[]) : [];
  const artworkImages =
    imgs.length > 0
      ? imgs
          .map((it: any, idx: number) => {
            const url =
              typeof it === "string"
                ? it
                : (it?.url || it?.src || "");
            const role =
              (it && typeof it === "object" && it.role) || (idx === 0 ? "main" : "detail");
            return {
              url: (url || "").replace(/^\/+/, ""),
              role: role as "main" | "detail" | "angle" | "poster" | "installation-view",
              alt: `${workTitle} - ${role}`,
            };
          })
          .filter((x) => x.url)
      : [
          { url: blueAbstractImage, role: "main" as const, alt: `${workTitle} - main view` },
          { url: gesturalPaintingImage, role: "detail" as const, alt: `${workTitle} - detail` },
        ];

  // --- 4) Prev/Next в серии (по порядку в массиве works) ---
  let prevWork: { title: string; slug: string } | undefined;
  let nextWork: { title: string; slug: string } | undefined;
  if (ser?.works && Array.isArray(ser.works)) {
    const idx = ser.works.findIndex((w: any) => w.slug === slug);
    if (idx >= 0) {
      const p = ser.works[idx - 1];
      const n = ser.works[idx + 1];
      prevWork = p ? { title: p.title || "Previous", slug: p.slug } : undefined;
      nextWork = n ? { title: n.title || "Next", slug: n.slug } : undefined;
    }
  } else {
    // фолбэк
    prevWork = { title: "Study #11", slug: "study-11" };
    nextWork = { title: "Study #13", slug: "study-13" };
  }

  // --- 5) Related: из этой же серии ---
  const relatedInSeries =
    (ser?.works || [])
      .filter((w: any) => w.slug !== slug)
      .map((w: any, i: number) => {
        const thumb =
          Array.isArray(w.images) && w.images[0]
            ? (typeof w.images[0] === "string"
                ? w.images[0]
                : w.images[0]?.src || w.images[0]?.url || "")
            : "";
        const imageUrl = (thumb || minimalistInstallationImage).replace?.(/^\/+/, "") || minimalistInstallationImage;
        return {
          id: w.slug || `related-${i + 1}`,
          title: w.title || "Untitled",
          year: String(w.year ?? ""),
          medium: w.technique || w.medium || "",
          imageUrl,
          linkUrl: `#/gallery/${series}/${w.slug || ""}`,
          type: "artwork" as const,
        };
      })
      .slice(0, 8) || [
      // фолбэк
      {
        id: "related-1",
        title: "Study #11",
        year: "2024",
        medium: "Mixed media on canvas",
        imageUrl: minimalistInstallationImage,
        linkUrl: "#/gallery/farbkoerper/study-11",
        type: "artwork" as const,
      },
      {
        id: "related-2",
        title: "Study #13",
        year: "2024",
        medium: "Mixed media on canvas",
        imageUrl: industrialSculptureImage,
        linkUrl: "#/gallery/farbkoerper/study-13",
        type: "artwork" as const,
      },
    ];

  // --- 6) Related: из других серий (берём первые работы) ---
  const relatedGlobal =
    (content?.series || [])
      .filter((s: any) => s.slug !== series)
      .flatMap((s: any) => (Array.isArray(s.works) ? s.works.slice(0, 1) : []))
      .map((w: any, i: number) => {
        const thumb =
          Array.isArray(w.images) && w.images[0]
            ? (typeof w.images[0] === "string"
                ? w.images[0]
                : w.images[0]?.src || w.images[0]?.url || "")
            : "";
        const imageUrl = (thumb || digitalPrintImage).replace?.(/^\/+/, "") || digitalPrintImage;

        // нужно знать серию для линка
        const parentSeries = (content?.series || []).find((s: any) =>
          Array.isArray(s.works) ? s.works.some((it: any) => it.slug === w.slug) : false
        );
        const parentSlug = parentSeries?.slug || "gallery";

        return {
          id: w.slug || `global-${i + 1}`,
          title: w.title || "Material Fragment",
          year: String(w.year ?? ""),
          medium: w.technique || w.medium || "",
          imageUrl,
          linkUrl: `#/gallery/${parentSlug}/${w.slug || ""}`,
          type: "artwork" as const,
        };
      })
      .slice(0, 8) || [
      // фолбэк
      {
        id: "global-1",
        title: "Material Fragment",
        year: "2023",
        medium: "Plywood assemblage",
        imageUrl: industrialSculptureImage,
        linkUrl: "#/gallery/pgsrd/material-fragment",
        type: "artwork" as const,
      },
    ];

  const portfolioPdfUrl = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(
    /^\/+/,
    ""
  );

  // --- 7) Analytics event (сохраняем твою логику) ---
  useEffect(() => {
    if (series && slug && typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "view_artwork", { series, work: slug });
    }
  }, [series, slug]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="site-container section-py">
          <Breadcrumbs
            items={[
              { label: "Home", href: "#/", testId: "link-bc-home" },
              { label: "Gallery", href: "#/gallery", testId: "link-bc-gallery" },
              { label: seriesTitle, href: `#/gallery/${series}`, testId: "link-bc-series" },
              { label: workTitle, testId: "text-bc-current" },
            ]}
          />
        </div>

        <ArtworkDetail
          title={workTitle}
          seriesTitle={seriesTitle}
          year={year}
          medium={medium}
          dimensions={dimensions}
          price={price}
          availability={availability}
          description={description}
          images={artworkImages}
          prevWork={prevWork}
          nextWork={nextWork}
        />

        {/* Related Works in Series */}
        {relatedInSeries.length > 0 && (
          <section>
            <GalleryGrid
              items={relatedInSeries}
              heading={`More from ${seriesTitle}`}
              linkUrl={`#/gallery/${series}`}
              columns={4}
            />
          </section>
        )}

        {/* Related Works from Other Series */}
        {relatedGlobal.length > 0 && (
          <section style={{ marginTop: "var(--section-py-lg)" }}>
            <GalleryGrid
              items={relatedGlobal}
              heading="From other series & projects"
              linkUrl="#/gallery"
              columns={4}
            />
          </section>
        )}
      </main>

      <Footer year={new Date().getFullYear()} portfolioPdfUrl={portfolioPdfUrl} />
    </div>
  );
}
