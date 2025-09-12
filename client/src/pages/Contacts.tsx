import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactsPage from "@/components/ContactsPage";
import Footer from "@/components/Footer";

export default function Contacts() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header artistName="Artist Name" />
      
      <main className="section-py flex-1">
        <div className="site-container heading-gap-lg">
          <Breadcrumbs 
            items={[
              { label: "Home", href: "/", testId: "link-bc-home" },
              { label: "Contacts", testId: "text-bc-current" }
            ]} 
          />
          <h1 className="text-type-h1 font-semibold text-foreground h1-spacing">
            Contacts
          </h1>
        </div>
        
        <ContactsPage
          email="hi@example.art"
          city="Berlin"
          country="Germany"
          introText="If you have an idea or proposal, please write an email."
          openToText="Open for exhibitions, collaborations and commissions. Please email."
        />
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