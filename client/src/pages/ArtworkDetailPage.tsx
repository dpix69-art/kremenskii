import { useParams } from "wouter";
import { useEffect } from "react";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArtworkDetail from "@/components/ArtworkDetail";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import blueAbstractImage from '@assets/generated_images/Blue_abstract_color_field_53f088fd.png';
import industrialSculptureImage from '@assets/generated_images/Industrial_sculpture_assemblage_2b04ef29.png';
import gesturalPaintingImage from '@assets/generated_images/Gestural_earth_tone_painting_554103d6.png';
import minimalistInstallationImage from '@assets/generated_images/White_minimalist_installation_e967bdd0.png';
import digitalPrintImage from '@assets/generated_images/Digital_glitch_print_392d678b.png';

export default function ArtworkDetailPage() {
  const { series, slug } = useParams();
  
  // Analytics event for artwork view
  useEffect(() => {
    if (series && slug && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_artwork', {
        series: series,
        work: slug
      });
    }
  }, [series, slug]);
  
  // Series slug to title mapping
  const seriesMap: Record<string, string> = {
    farbkoerper: "Farbkoerper",
    pgsrd: "Plywood-Gravel-Sand-Road-Dust (PGSRD)",
    singles: "Singles",
    graphics: "Graphics"
  };
  
  const seriesTitle = seriesMap[series as string] || series || "Unknown Series";
  
  const artworkImages = [
    {
      url: blueAbstractImage,
      role: 'main' as const,
      alt: 'Untitled Study #12 - main view'
    },
    {
      url: gesturalPaintingImage,
      role: 'angle' as const,
      alt: 'Untitled Study #12 - side angle'
    }
  ];

  const description = [
    "This work continues the exploration of color as material substance, investigating how pigment can occupy and define space beyond the traditional boundaries of painting.",
    "The composition emerges from a process of layering and excavation, where each application of paint both conceals and reveals the surface beneath.",
    "Part of the ongoing Farbkoerper series, this piece questions the relationship between color perception and physical presence."
  ];

  // Related works in the same series
  const relatedInSeries = [
    {
      id: "related-1",
      title: "Study #11",
      year: "2024",
      medium: "Mixed media on canvas",
      imageUrl: minimalistInstallationImage,
      linkUrl: "/gallery/farbkoerper/study-11",
      type: "artwork" as const
    },
    {
      id: "related-2",
      title: "Study #13",
      year: "2024",
      medium: "Mixed media on canvas",
      imageUrl: industrialSculptureImage,
      linkUrl: "/gallery/farbkoerper/study-13",
      type: "artwork" as const
    }
  ];

  // Related works from other series
  const relatedGlobal = [
    {
      id: "global-1",
      title: "Material Fragment",
      year: "2023", 
      medium: "Plywood assemblage",
      imageUrl: industrialSculptureImage,
      linkUrl: "/gallery/pgsrd/material-fragment",
      type: "artwork" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="site-container section-py">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/", testId: "link-bc-home" },
              { label: "Gallery", href: "/gallery", testId: "link-bc-gallery" },
              { label: seriesTitle, href: `/gallery/${series}`, testId: "link-bc-series" },
              { label: "Untitled Study #12", testId: "text-bc-current" }
            ]}
          />
        </div>
        <ArtworkDetail
          title="Untitled Study #12"
          seriesTitle={seriesTitle}
          year="2024"
          medium="Mixed media on canvas"
          dimensions="120 × 90 cm"
          price="€3,200"
          availability="available"
          description={description}
          images={artworkImages}
          prevWork={{ title: "Study #11", slug: "study-11" }}
          nextWork={{ title: "Study #13", slug: "study-13" }}
        />

        {/* Related Works in Series */}
        <section>
          <GalleryGrid
            items={relatedInSeries}
            heading="More from Farbkoerper"
            linkUrl="/gallery/farbkoerper"
            columns={4}
          />
        </section>

        {/* Related Works from Other Series */}
        <section style={{marginTop: 'var(--section-py-lg)'}}>
          <GalleryGrid
            items={relatedGlobal}
            heading="From other series & projects"
            linkUrl="/gallery"
            columns={4}
          />
        </section>
      </main>

      <Footer
        artistName="Dmitrii Kremenskii"
        year={2025}
        portfolioPdfUrl="/files/portfolio.pdf"
        socialLinks={{
          instagram: "https://instagram.com/artist",
          soundcloud: "https://soundcloud.com/artist",
          bandcamp: "https://artist.bandcamp.com"
        }}
      />
    </div>
  );
}