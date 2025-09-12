import { useContent } from "@/content/ContentProvider";

interface Exhibition {
  year: string;
  event: string;
}

interface StatementPageProps {
  portraitImageUrl?: string;
  statement?: string[];
  exhibitions?: Exhibition[];
  portraitPosition?: "left" | "right";
  email?: string;
  pressKitPdfUrl?: string;
  /** По умолчанию скрываем Press/Contact */
  showPressContact?: boolean;
}

function withBase(p?: string) {
  if (!p) return "";
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  return `${base}/${String(p).replace(/^\/+/, "")}`;
}

export default function StatementPage({
  portraitImageUrl,
  statement,
  exhibitions,
  portraitPosition = "left",
  email,
  pressKitPdfUrl,
  showPressContact = false
}: StatementPageProps) {
  const { content } = useContent();

  // Фолбэки из content.json
  const usedPortrait =
    portraitImageUrl ||
    content?.statement?.portrait ||
    "images/portrait.jpg";

  const usedStatement: string[] =
    statement ||
    (Array.isArray(content?.statement?.paragraphs)
      ? content.statement.paragraphs
      : []);

  const usedExhibitions: Exhibition[] =
    exhibitions ||
    (Array.isArray(content?.statement?.exhibitions)
      ? content.statement.exhibitions
      : []);

  const usedEmail =
    email || content?.contacts?.email || ""; // пустая строка — не рендерим кнопку

  const usedPressKit =
    pressKitPdfUrl || content?.statement?.pressKitPdf || ""; // пустая строка — не рендерим кнопку

  const handleDownloadPressKit = () => {
    if (!usedPressKit) return;
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "press_kit_open", { method: "statement_page" });
    }
    const link = document.createElement("a");
    link.href = withBase(usedPressKit);
    link.download = "press-kit.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyEmail = async () => {
    if (!usedEmail) return;
    try {
      await navigator.clipboard.writeText(usedEmail);
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "copy_email", { method: "statement_page" });
      }
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <div className="w-full py-12 pt-[0px] pb-[0px]">
      <div className="site-container">
        {/* Portrait and Statement */}
        <div className="grid-12 mb-16">
          {/* Portrait Image */}
          <div
            className={`col-span-12 lg:col-span-5 space-y-4 ${
              portraitPosition === "right" ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
              <img
                src={withBase(usedPortrait)}
                alt="Artist portrait"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                data-testid="img-artist-portrait"
              />
            </div>
          </div>

          {/* Statement Text */}
          <div
            className={`col-span-12 lg:col-span-7 space-y-6 ${
              portraitPosition === "right" ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <h1
              id="page-title"
              tabIndex={-1}
              className="text-type-h1 font-semibold text-foreground"
            >
              Statement
            </h1>

            <div className="prose prose-lg max-w-none">
              {usedStatement.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-type-body text-foreground leading-relaxed mb-6"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Exhibitions */}
        {usedExhibitions.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-type-h2 font-semibold text-foreground">
              Selected Exhibitions & Performances
            </h2>
            <div className="space-y-4">
              {usedExhibitions.map((ex, i) => (
                <div
                  key={`${ex.year}-${i}`}
                  className="flex flex-col sm:flex-row sm:gap-8"
                  data-testid={`exhibition-${i}`}
                >
                  <div className="text-type-body text-muted-foreground font-medium min-w-[4rem]">
                    {ex.year}
                  </div>
                  <div className="text-type-body text-foreground">{ex.event}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Press & Contact — СКРЫТО по умолчанию */}
        {showPressContact && (usedPressKit || usedEmail) && (
          <div className="grid-12 pt-8 border-t border-border mt-12">
            {/* Press */}
            {usedPressKit && (
              <div className="col-span-12 lg:col-span-6 space-y-4">
                <h2 className="text-type-h2 font-semibold text-foreground">Press</h2>
                <p className="text-type-body text-muted-foreground">
                  Statement PDF + high-resolution press images
                </p>
                <button
                  onClick={handleDownloadPressKit}
                  className="text-type-body text-foreground underline hover:text-muted-foreground transition-colors"
                  data-testid="button-press-kit"
                >
                  Download press kit
                </button>
              </div>
            )}

            {/* Contact */}
            {usedEmail && (
              <div className="col-span-12 lg:col-span-6 space-y-4">
                <h2 className="text-type-h2 font-semibold text-foreground">Contact</h2>
                <button
                  onClick={handleCopyEmail}
                  className="text-type-body text-foreground underline hover:text-muted-foreground transition-colors"
                  data-testid="button-copy-email-statement"
                  title="Copy email"
                >
                  {usedEmail}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
