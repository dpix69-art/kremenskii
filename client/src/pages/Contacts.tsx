import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactsPage from "@/components/ContactsPage";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

type SocialLinks = {
  instagram?: string;
  soundcloud?: string;
  bandcamp?: string;
};

export default function Contacts() {
  const { content } = useContent();

  const email = content?.contacts?.email ?? "hi@example.art";
  const city = content?.contacts?.city ?? "Berlin";
  const country = content?.contacts?.country ?? "Germany";

  const introText =
    content?.contacts?.introText ??
    "If you have an idea or proposal, please write an email.";

  const openToText =
    content?.contacts?.openToText ??
    "Open for exhibitions, collaborations and commissions. Please email.";

  const portfolioPdfUrl = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(
    /^\/+/,
    ""
  );

  const socialLinks: SocialLinks = (content?.contacts?.socials || []).reduce(
    (acc: SocialLinks, s: any) => {
      const key = String(s.label || "").toLowerCase();
      if (["instagram", "soundcloud", "bandcamp"].includes(key)) {
        (acc as any)[key] = s.href;
      }
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="section-py flex-1">
        <div className="site-container heading-gap-lg">
          <Breadcrumbs
            items={[
              { label: "Home", href: "#/", testId: "link-bc-home" },
              { label: "Contacts", testId: "text-bc-current" }
            ]}
          />
          <h1 className="text-type-h1 font-semibold text-foreground h1-spacing">
            Contacts
          </h1>
        </div>

        <ContactsPage
          email={email}
          city={city}
          country={country}
          introText={introText}
          openToText={openToText}
        />
      </main>

      <Footer
        year={new Date().getFullYear()}
        portfolioPdfUrl={portfolioPdfUrl}
        socialLinks={socialLinks}
      />
    </div>
  );
}
