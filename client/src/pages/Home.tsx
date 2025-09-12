import { Link } from "wouter";
import Header from "@/components/Header";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import blueAbstractImage from '@assets/generated_images/Blue_abstract_color_field_53f088fd.png';
import industrialSculptureImage from '@assets/generated_images/Industrial_sculpture_assemblage_2b04ef29.png';
import gesturalPaintingImage from '@assets/generated_images/Gestural_earth_tone_painting_554103d6.png';
import minimalistInstallationImage from '@assets/generated_images/White_minimalist_installation_e967bdd0.png';
import digitalPrintImage from '@assets/generated_images/Digital_glitch_print_392d678b.png';
import soundImage from '@assets/generated_images/Sound_art_installation_ace33df5.png';

export default function Home() {

  const mixedGalleryItems = [
    {
      id: "1",
      title: "Color Study #1",
      year: "2024",
      medium: "Oil on canvas",
      imageUrl: blueAbstractImage,
      linkUrl: "/gallery/farbkoerper/color-study-1",
      type: "artwork" as const
    },
    {
      id: "2",
      title: "Farbkoerper",
      year: "2022–",
      medium: "Ongoing series, 15 works",
      imageUrl: gesturalPaintingImage,
      linkUrl: "/gallery/farbkoerper",
      type: "series" as const
    },
    {
      id: "3",
      title: "Sound Installation",
      year: "2024",
      medium: "Audio installation", 
      imageUrl: soundImage,
      linkUrl: "/sounds/installation-project",
      type: "sound_project" as const
    },
    {
      id: "4",
      title: "PGSRD",
      year: "2021–",
      medium: "Series, 8 works",
      imageUrl: industrialSculptureImage,
      linkUrl: "/gallery/pgsrd",
      type: "series" as const
    },
    {
      id: "5",
      title: "Texture Analysis #3",
      year: "2023",
      medium: "Digital print",
      imageUrl: digitalPrintImage,
      linkUrl: "/gallery/graphics/texture-analysis-3",
      type: "artwork" as const
    },
    {
      id: "6",
      title: "Resonance Project",
      year: "2023",
      medium: "Live performance recording",
      imageUrl: soundImage,
      linkUrl: "/sounds/resonance-project",
      type: "sound_project" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header artistName="Dmitrii Kremenskii" />
      <main className="flex-1">
        {/* Text Header */}
        <section className="section-py">
          <div className="site-container">
            <div className="max-w-4xl">
              <h1 
                id="page-title"
                tabIndex={-1}
                className="text-type-h1 leading-tight font-semibold text-foreground h1-spacing"
                data-testid="text-artist-name"
              >
                Dmitrii Kremenskii
              </h1>
              <p className="text-type-small leading-snug font-semibold text-muted-foreground uppercase tracking-wide" style={{marginBottom: 'var(--paragraph-gap)'}}>
                Artist
              </p>
              <p className="text-type-body leading-relaxed text-foreground max-w-[48ch]">
                My practice investigates the intersection of material and meaning, exploring how physical substances carry cultural and emotional weight beyond their immediate visual properties. Through painting, sculpture, and sound, I examine the boundaries between the constructed and the found, seeking moments where these distinctions collapse or reveal their arbitrariness.
              </p>
            </div>
          </div>
        </section>
        
        {/* Two-column Grid */}
        <div style={{marginTop: 'var(--heading-gap-lg)'}}>
          <GalleryGrid
            items={mixedGalleryItems}
            columns={2}
            showArtworkBadge={true}
          />
        </div>
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