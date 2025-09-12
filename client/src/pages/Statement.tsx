import { useContent } from "@/content/ContentProvider";

export default function Statement() {
  const { content } = useContent();

  const portrait = content?.statement?.portrait; // можно позже поменять на images/…
  const paras: string[] = content?.statement?.paragraphs ?? [
    "Artist statement paragraph 1.",
    "Artist statement paragraph 2.",
  ];
  const pressKit = (content?.statement?.pressKitPdf ?? "files/press-kit.pdf").replace(/^\/+/, "");

  return (
    <div className="site-container section-py">
      <h1 id="page-title" tabIndex={-1} className="text-type-h1 font-semibold">
        Statement
      </h1>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Portrait (optional) */}
        <div className="md:col-span-4">
          {portrait && (
            <img
              src={portrait.replace(/^\/+/, "")}
              alt="Artist portrait"
              className="w-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        {/* Text */}
        <div className="md:col-span-8 text-type-body leading-relaxed space-y-[var(--paragraph-gap)]">
          {paras.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <div className="mt-6">
            <a href={pressKit} className="underline underline-offset-4">
              Press kit (PDF)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
