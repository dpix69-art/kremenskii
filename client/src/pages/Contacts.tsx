import { useContent } from "@/content/ContentProvider";

export default function Contacts() {
  const { content } = useContent();

  const email = content?.contacts?.email ?? "hi@example.art";
  const city = content?.contacts?.city ?? "City";
  const country = content?.contacts?.country ?? "Country";
  const portfolio = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(/^\/+/, "");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      alert("Email copied"); // можно заменить на ваш toast, если есть
    } catch {
      // fallback: выделить и скопировать через prompt
      prompt("Copy email:", email);
    }
  };

  return (
    <div className="site-container section-py">
      <h1 id="page-title" tabIndex={-1} className="text-type-h1 font-semibold">
        Contacts
      </h1>

      <div className="text-type-body space-y-4 max-w-prose">
        <p>
          If you have ideas or proposals, please write to me.
        </p>
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
  );
}
