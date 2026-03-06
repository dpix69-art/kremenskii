import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

export default function Contacts() {
  const { content } = useContent();

  const email = content?.contacts?.email ?? "hi@kremenskii.art";
  const city = content?.contacts?.city ?? "Stuttgart";
  const country = content?.contacts?.country ?? "Germany";
  const introText = content?.contacts?.introText ?? "Idea? Please write an email.";
  const openToText = content?.contacts?.openToText ?? "";
  const socials = content?.contacts?.socials || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 section-py">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contacts" }]} />

          <div className="max-w-lg">
            <h1 className="text-type-h1 font-semibold text-foreground mb-8">Contacts</h1>

            {introText && <p className="text-type-body text-foreground mb-3">{introText}</p>}
            {openToText && <p className="text-type-body text-muted-foreground mb-6">{openToText}</p>}

            <p className="mb-2">
              <a href={`mailto:${email}`} className="text-type-body text-foreground underline underline-offset-3 hover:opacity-70 transition-opacity">
                {email}
              </a>
            </p>

            <p className="text-type-small text-muted-foreground mb-8">
              {[city, country].filter(Boolean).join(", ")}
            </p>

            {/* Socials */}
            {socials.length > 0 && (
              <div className="flex gap-6 flex-wrap">
                {socials.map((s: any) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-type-small text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
