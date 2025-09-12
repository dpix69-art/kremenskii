import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import StatementPage from "@/components/StatementPage";
import Footer from "@/components/Footer";
import portraitImage from '@assets/generated_images/Professional_artist_portrait_0c565b16.png';

export default function Statement() {
  const statementText = [
    "My practice investigates the intersection of material and meaning, exploring how physical substances carry cultural and emotional weight beyond their immediate visual properties.",
    "Through painting, sculpture, and sound, I examine the boundaries between the constructed and the found, the industrial and the organic, seeking moments where these distinctions collapse or reveal their arbitrariness.",
    "Recent work has focused on the materiality of color itself—not as representation or symbol, but as physical substance that occupies space and time, accumulates history, and bears the traces of its own making."
  ];

  const exhibitions = [
    { year: "2024", event: "Material Traces, Contemporary Art Gallery, Berlin" },
    { year: "2023", event: "Substance and Surface, Museum of Modern Art, Vienna" },
    { year: "2023", event: "Sound and Space, Kunstverein München, Munich" },
    { year: "2022", event: "Color Studies, Gallery XYZ, London" },
    { year: "2021", event: "Industrial Fragments, Biennale of Contemporary Art, Venice" },
    { year: "2021", event: "New Materialities, Tate Modern, London" },
    { year: "2020", event: "Between Object and Sound, Berlinische Galerie, Berlin" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header artistName="Dmitrii Kremenskii" />
      
      <main className="flex-1">
        <div className="site-container section-py">
          <Breadcrumbs 
            items={[
              { label: "Home", href: "/", testId: "link-bc-home" },
              { label: "Statement", testId: "text-bc-current" }
            ]} 
          />
        </div>
        <StatementPage
          portraitImageUrl={portraitImage}
          statement={statementText}
          exhibitions={exhibitions}
          portraitPosition="left"
          email="hi@example.art"
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