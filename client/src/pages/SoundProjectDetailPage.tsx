import { useParams } from "wouter";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import SoundProjectDetail from "@/components/SoundProjectDetail";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import soundImage from '@assets/generated_images/Sound_art_installation_ace33df5.png';

export default function SoundProjectDetailPage() {
  const { slug } = useParams();
  
  const projectTitle = "Industrial Resonance";
  const bodyBlocks = [
    {
      type: 'h2' as const,
      text: 'Concept'
    },
    {
      type: 'p' as const,
      text: 'This installation explores the acoustic properties of industrial spaces, using field recordings and live processing to create an immersive sound environment that responds to the physical architecture.'
    },
    {
      type: 'p' as const,
      text: 'The work was developed during a residency at the former factory space, incorporating both the building\'s natural acoustics and its industrial heritage into the composition.'
    },
    {
      type: 'h2' as const,
      text: 'Process'
    },
    {
      type: 'p' as const,
      text: 'Over the course of three weeks, I recorded the ambient sounds of the space at different times of day, capturing both the building\'s silence and the urban environment filtering through its walls.'
    }
  ];

  const tracks = [
    {
      title: "Factory Floor",
      duration: "12:34",
      externalLink: "https://soundcloud.com/artist/factory-floor"
    },
    {
      title: "Resonance Study #1",
      duration: "08:21"
    },
    {
      title: "Ambient Reconstruction",
      duration: "15:07",
      externalLink: "https://soundcloud.com/artist/ambient-reconstruction"
    }
  ];

  // Related sound projects
  const relatedSounds = [
    {
      id: "sound-related-1",
      title: "Spatial Frequencies",
      year: "2022",
      medium: "Vienna, Austria • Museum of Applied Arts",
      imageUrl: soundImage,
      linkUrl: "/sounds/spatial-frequencies",
      type: "sound_project" as const
    },
    {
      id: "sound-related-2",
      title: "Material Voices", 
      year: "2022",
      medium: "Munich, Germany • Kunstverein München",
      imageUrl: soundImage,
      linkUrl: "/sounds/material-voices",
      type: "sound_project" as const
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
              { label: "Sounds", href: "/sounds", testId: "link-bc-sounds" },
              { label: projectTitle, testId: "text-bc-current" }
            ]}
          />
        </div>
        <SoundProjectDetail
          title="Industrial Resonance"
          year="2023"
          location={{
            city: "Berlin",
            country: "Germany",
            institution: "Künstlerhaus Bethanien"
          }}
          coverImageUrl={soundImage}
          bodyBlocks={bodyBlocks}
          tracks={tracks}
          meta={{
            label: "Experimental Sounds",
            platforms: ["Bandcamp", "SoundCloud"]
          }}
          embeddedPlayerUrl="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/123456789&color=%23000000&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
        />

        {/* Related Sound Projects */}
        <section>
          <GalleryGrid
            items={relatedSounds}
            heading="Related Sound Projects"
            linkUrl="/sounds"
            columns={2}
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