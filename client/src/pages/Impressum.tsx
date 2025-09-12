import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="section-py flex-1">
        <div className="site-container heading-gap-lg">
          <Breadcrumbs 
            items={[
              { label: "Home", href: "/", testId: "link-bc-home" },
              { label: "Impressum", testId: "text-bc-current" }
            ]} 
          />
          <h1 className="text-type-h1 font-semibold text-foreground h1-spacing">
            Impressum
          </h1>
        </div>
        
        <div className="w-full">
          <div className="site-container">
            <div className="block-gap-lg">
              {/* Information according to § 5 TMG */}
              <div className="grid-12">
                <div className="col-span-12 lg:col-span-6 block-gap">
                  <div className="block-gap">
                    <h2 className="text-type-h3 font-medium text-foreground h3-spacing">Information according to § 5 TMG</h2>
                    <div className="text-type-body text-foreground paragraph-stack">
                      <p>Dmitrii Kremenskii</p>
                      <p>Street Address 123</p>
                      <p>12345 Berlin</p>
                      <p>Germany</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-6 block-gap">
                  <h2 className="text-type-h3 font-medium text-foreground h3-spacing">Contact</h2>
                  <div className="text-type-body text-foreground paragraph-stack">
                    <p>Email: hi@example.art</p>
                    <p>Phone: +49 (0) 123 456789</p>
                  </div>
                </div>
              </div>

              {/* Liability and Copyright */}
              <div className="grid-12">
                <div className="col-span-12 lg:col-span-6 block-gap">
                  <h2 className="text-type-h3 font-medium text-foreground h3-spacing">Liability for Contents</h2>
                  <p className="text-type-body text-foreground leading-relaxed">
                    As service providers, we are liable for own contents of these websites according to Sec. 7, para.1 German Telemedia Act (TMG). However, according to Sec. 8 to 10 German Telemedia Act (TMG), service providers are not under obligation to monitor permanently the information, which they have transmitted or stored, nor to search for evidences of illegal activities.
                  </p>
                </div>

                <div className="col-span-12 lg:col-span-6 block-gap">
                  <h2 className="text-type-h3 font-medium text-foreground h3-spacing">Copyright</h2>
                  <p className="text-type-body text-foreground leading-relaxed">
                    The contents and works created by the site operators on these pages are subject to German copyright law. Duplication, processing, distribution, and any form of commercialization of such material beyond the scope of the copyright law shall require the prior written consent of its respective author or creator.
                  </p>
                </div>
              </div>
            </div>
          </div>
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