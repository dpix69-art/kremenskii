import { useParams } from "wouter";
import { useEffect } from "react";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import blueAbstractImage from '@assets/generated_images/Blue_abstract_color_field_53f088fd.png';
import industrialSculptureImage from '@assets/generated_images/Industrial_sculpture_assemblage_2b04ef29.png';
import gesturalPaintingImage from '@assets/generated_images/Gestural_earth_tone_painting_554103d6.png';
import minimalistInstallationImage from '@assets/generated_images/White_minimalist_installation_e967bdd0.png';
import digitalPrintImage from '@assets/generated_images/Digital_glitch_print_392d678b.png';

interface SeriesWork {
  id: string;
  title: string;
  year: string;
  medium: string;
  imageUrl: string;
  linkUrl: string;
  type: 'artwork';
}

interface SeriesData {
  title: string;
  year: string;
  intro: string;
  works: SeriesWork[];
}

export default function SeriesPage() {
  const { series } = useParams();
  
  // Analytics event for series view
  useEffect(() => {
    if (series && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_series', {
        series: series
      });
    }
  }, [series]);
  
  const seriesData: Record<string, SeriesData> = {
    farbkoerper: {
      title: "Farbkoerper",
      year: "2022–",
      intro: "An ongoing exploration of color as physical form, investigating the materiality of pigment and its relationship to space and light.",
      works: [
        {
          id: "1",
          title: "Untitled Study #12",
          year: "2024",
          medium: "Mixed media on canvas",
          imageUrl: blueAbstractImage,
          linkUrl: "/gallery/farbkoerper/untitled-study-12",
          type: "artwork" as const
        },
        {
          id: "2",
          title: "Color Study #1",
          year: "2024",
          medium: "Oil on canvas",
          imageUrl: gesturalPaintingImage,
          linkUrl: "/gallery/farbkoerper/color-study-1",
          type: "artwork" as const
        },
        {
          id: "3",
          title: "Red Fragment",
          year: "2023",
          medium: "Acrylic on wood panel",
          imageUrl: minimalistInstallationImage,
          linkUrl: "/gallery/farbkoerper/red-fragment",
          type: "artwork" as const
        },
        {
          id: "4",
          title: "Blue Composition",
          year: "2023",
          medium: "Mixed media",
          imageUrl: blueAbstractImage,
          linkUrl: "/gallery/farbkoerper/blue-composition",
          type: "artwork" as const
        },
        {
          id: "5",
          title: "Color Field #7",
          year: "2022",
          medium: "Oil and pigment on canvas",
          imageUrl: blueAbstractImage,
          linkUrl: "/gallery/farbkoerper/color-field-7",
          type: "artwork" as const
        },
        {
          id: "6",
          title: "Material Study",
          year: "2022",
          medium: "Mixed media on panel",
          imageUrl: blueAbstractImage,
          linkUrl: "/gallery/farbkoerper/material-study",
          type: "artwork" as const
        }
      ]
    },
    pgsrd: {
      title: "Plywood-Gravel-Sand-Road-Dust (PGSRD)",
      year: "2021–",
      intro: "A series examining industrial and organic materials, their intersection in urban environments, and the traces they leave behind.",
      works: [
        {
          id: "1",
          title: "Material Research",
          year: "2023",
          medium: "Plywood, gravel, sand",
          imageUrl: industrialSculptureImage,
          linkUrl: "/gallery/pgsrd/material-research",
          type: "artwork" as const
        },
        {
          id: "2",
          title: "Urban Fragment #3",
          year: "2023",
          medium: "Road dust, mixed media",
          imageUrl: industrialSculptureImage,
          linkUrl: "/gallery/pgsrd/urban-fragment-3",
          type: "artwork" as const
        },
        {
          id: "3",
          title: "Construction Study",
          year: "2022",
          medium: "Plywood, concrete",
          imageUrl: industrialSculptureImage,
          linkUrl: "/gallery/pgsrd/construction-study",
          type: "artwork" as const
        },
        {
          id: "4",
          title: "Aggregate #12",
          year: "2022",
          medium: "Gravel, sand, resin",
          imageUrl: industrialSculptureImage,
          linkUrl: "/gallery/pgsrd/aggregate-12",
          type: "artwork" as const
        }
      ]
    },
    singles: {
      title: "Singles",
      year: "2020–",
      intro: "Individual works that explore various media and concepts outside of larger series, unified by an interest in material experimentation.",
      works: [
        {
          id: "1",
          title: "Fragment Study",
          year: "2024",
          medium: "Mixed media",
          imageUrl: digitalPrintImage,
          linkUrl: "/gallery/singles/fragment-study",
          type: "artwork" as const
        },
        {
          id: "2",
          title: "Meditation #5",
          year: "2023",
          medium: "Oil on canvas",
          imageUrl: gesturalPaintingImage,
          linkUrl: "/gallery/singles/meditation-5",
          type: "artwork" as const
        },
        {
          id: "3",
          title: "Untitled (Black)",
          year: "2023",
          medium: "Charcoal on paper",
          imageUrl: minimalistInstallationImage,
          linkUrl: "/gallery/singles/untitled-black",
          type: "artwork" as const
        }
      ]
    },
    graphics: {
      title: "Graphics",
      year: "2019–",
      intro: "Print-based works investigating digital and analog reproduction techniques, examining the transformation of images through various media.",
      works: [
        {
          id: "1",
          title: "Texture Analysis #3",
          year: "2023",
          medium: "Digital print",
          imageUrl: industrialSculptureImage,
          linkUrl: "/gallery/graphics/texture-analysis-3",
          type: "artwork" as const
        },
        {
          id: "2",
          title: "Print Study #8",
          year: "2022",
          medium: "Screen print on paper",
          imageUrl: industrialSculptureImage,
          linkUrl: "/gallery/graphics/print-study-8",
          type: "artwork" as const
        },
        {
          id: "3",
          title: "Digital Fragment",
          year: "2021",
          medium: "Inkjet print, mixed media",
          imageUrl: industrialSculptureImage,
          linkUrl: "/gallery/graphics/digital-fragment",
          type: "artwork" as const
        }
      ]
    }
  };

  const currentSeries = seriesData[series as string];
  
  if (!currentSeries) {
    return <div>Series not found</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header artistName="Dmitrii Kremenskii" />
      
      <main className="flex-1">
        {/* Series Header */}
        <section className="w-full section-py">
          <div className="site-container">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/", testId: "link-bc-home" },
                { label: "Gallery", href: "/gallery", testId: "link-bc-gallery" },
                { label: currentSeries.title, testId: "text-bc-current" }
              ]}
            />
            <div className="block-gap">
              <div>
                <span className="text-type-small text-muted-foreground uppercase tracking-wide">
                  Series
                </span>
                <h1 
                  id="series-title"
                  tabIndex={-1}
                  className="text-type-h1 font-semibold text-foreground h1-spacing"
                >
                  {currentSeries.title}
                </h1>
                <p className="text-type-body text-muted-foreground">{currentSeries.year}</p>
              </div>
              <div className="max-w-2xl">
                <p className="text-type-body text-foreground leading-relaxed">
                  {currentSeries.intro}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Works Grid */}
        <GalleryGrid
          items={currentSeries.works}
          columns={3}
        />
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