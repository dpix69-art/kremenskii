import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import SeriesIndex from "@/components/SeriesIndex";
import Footer from "@/components/Footer";
import blueAbstractImage from '@assets/generated_images/Blue_abstract_color_field_53f088fd.png';
import industrialSculptureImage from '@assets/generated_images/Industrial_sculpture_assemblage_2b04ef29.png';
import gesturalPaintingImage from '@assets/generated_images/Gestural_earth_tone_painting_554103d6.png';
import minimalistInstallationImage from '@assets/generated_images/White_minimalist_installation_e967bdd0.png';
import digitalPrintImage from '@assets/generated_images/Digital_glitch_print_392d678b.png';

export default function Gallery() {
  const seriesData = [
    {
      title: "Farbkoerper",
      slug: "farbkoerper",
      year: "2022–",
      intro: "An ongoing exploration of color as physical form, investigating the materiality of pigment and its relationship to space and light.",
      artworkImages: [blueAbstractImage, gesturalPaintingImage, minimalistInstallationImage],
      workCount: 15
    },
    {
      title: "Plywood-Gravel-Sand-Road-Dust (PGSRD)",
      slug: "pgsrd", 
      year: "2021–",
      intro: "A series examining industrial and organic materials, their intersection in urban environments, and the traces they leave behind.",
      artworkImages: [industrialSculptureImage, digitalPrintImage, blueAbstractImage],
      workCount: 8
    },
    {
      title: "Singles",
      slug: "singles",
      year: "2020–",
      intro: "Individual works that explore various media and concepts outside of larger series, unified by an interest in material experimentation.",
      artworkImages: [gesturalPaintingImage, minimalistInstallationImage, digitalPrintImage],
      workCount: 12
    },
    {
      title: "Graphics",
      slug: "graphics",
      year: "2019–",
      intro: "Print-based works investigating digital and analog reproduction techniques, examining the transformation of images through various media.",
      artworkImages: [digitalPrintImage, industrialSculptureImage, blueAbstractImage],
      workCount: 6
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header artistName="Artist Name" />
      
      <main className="section-py flex-1">
        <div className="site-container heading-gap-lg">
          <Breadcrumbs 
            items={[
              { label: "Home", href: "/", testId: "link-bc-home" },
              { label: "Gallery", testId: "text-bc-current" }
            ]} 
          />
          <h1 
            id="page-title"
            tabIndex={-1}
            className="text-type-h1 font-semibold text-foreground h1-spacing"
          >
            Gallery
          </h1>
        </div>
        
        <SeriesIndex series={seriesData} />
      </main>

      <Footer
        artistName="Artist Name"
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