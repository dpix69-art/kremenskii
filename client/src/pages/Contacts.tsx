import { useContent } from "@/content/ContentProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contacts() {
  const { content } = useContent();

  const artistName = content?.site?.artistName ?? "Artist Name";
  const email = content?.contacts?.email ?? "hi@example.art";
  const city = content?.contacts?.city ?? "City";
  const country = content?.contacts?.country ?? "Country";
  const portfolio = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(/^\/+/, "");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      alert("Email copied"); // при желании замени на свой toast
    } catch {
      prompt("Copy email:", email);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header artistName={artistName} />

      <main className="flex-1">
        <section className="section-py">
          <div className="site-container">
            <h1 id="page-title" tabIndex={-1} className="text-type-h1 font-semibold h1-spacing">
              Contacts
            </h1>

            <div className="text-type-body space-y-4 max-w-prose">
              <p>If you have ideas or proposals, please write to me.</p>

              <p>
                <button
                  onClick={copyEmail}
                  className="underline underline-offset-4"
                  aria-label="Copy email"
                >
                  {email}
                </button>
              </p>

              <p>
                {city}, {country}
              </p>

              <p>
                <a href={portfolio} download className="underline underline-offset-4">
                  Download portfolio (PDF)
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer
        artistName={artistName}
        year={new Date().getFullYear()}
        portfolioPdfUrl={portfolio}
        socialLinks={
          (content?.contacts?.socials || []).reduce((acc: any, s: any) => {
            const key = String(s.label || "").toLowerCase();
            if (["instagram", "soundcloud", "bandcamp"].includes(key)) acc[key] = s.href;
            return acc;
          }, {}) as any
        }
      />
    </div>
  );
}
