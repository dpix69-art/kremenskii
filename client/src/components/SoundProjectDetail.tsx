import { assetUrl } from "@/lib/assetUrl";

type Block =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "p"; text: string };

type Track = { title: string; duration?: string; externalLink?: string };

interface Location {
  city?: string;
  country?: string;
  institution?: string;
}

interface Meta {
  label?: string;
  platforms?: string[];
}

interface Props {
  title: string;
  year?: string;
  location?: Location;
  coverImageUrl?: string;
  bodyBlocks?: Block[];
  tracks?: Track[];
  meta?: Meta;
  embeddedPlayerUrl?: string;
  /** скрыть обложку */
  hideCover?: boolean;
  /** компактная высота плеера */
  compactPlayer?: boolean;
}

export default function SoundProjectDetail({
  title,
  year,
  location,
  coverImageUrl,
  bodyBlocks = [],
  tracks = [],
  meta = {},
  embeddedPlayerUrl,
  hideCover = false,
  compactPlayer = false,
}: Props) {
  const hasCover = !!coverImageUrl && !hideCover;

  return (
    <section className="section-py">
      <div className="site-container">
        {/* Заголовок и мета */}
        <header className="block-gap">
          <div>
            <h1 className="text-type-h1 font-semibold text-foreground h1-spacing">{title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-type-body text-muted-foreground">
              {year && <span>{year}</span>}
              {location && (location.city || location.country || location.institution) && (
                <span>
                  {location.city ? `${location.city}` : ""}
                  {location.city && location.country ? ", " : ""}
                  {location.country ? `${location.country}` : ""}
                  {location.institution ? ` • ${location.institution}` : ""}
                </span>
              )}
              {meta?.label && <span>Label: {meta.label}</span>}
              {meta?.platforms?.length ? <span>{meta.platforms.join(" / ")}</span> : null}
            </div>
          </div>
        </header>

        {/* Обложка (по желанию) + Текст + Плеер */}
        <div className="grid-12 block-gap">
          {/* Cover (optional) */}
          {hasCover && (
            <div className="col-span-12 lg:col-span-5">
              <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
                <img
                  src={assetUrl(coverImageUrl!)}
                  alt={`${title} cover`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          )}

          {/* Text + Player */}
          <div className={`col-span-12 ${hasCover ? "lg:col-span-7" : "lg:col-span-8"}`}>
            {/* Текстовые блоки */}
            {bodyBlocks.length > 0 && (
              <div className="prose prose-lg max-w-none space-y-4">
                {bodyBlocks.map((b, i) => {
                  if (b.type === "p") {
                    return (
                      <p key={i} className="text-type-body text-foreground leading-relaxed">
                        {b.text}
                      </p>
                    );
                  }
                  const Tag = b.type as "h1" | "h2" | "h3";
                  const cls =
                    b.type === "h1"
                      ? "text-type-h2 font-semibold mt-6"
                      : b.type === "h2"
                      ? "text-type-h3 font-semibold mt-6"
                      : "text-type-h4 font-semibold mt-4";
                  return (
                    <Tag key={i} className={cls}>
                      {b.text}
                    </Tag>
                  );
                })}
              </div>
            )}

            {/* Встроенный плеер */}
            {embeddedPlayerUrl && (
              <div className="mt-6">
                <div
                  className={compactPlayer ? "w-full overflow-hidden rounded-md" : "w-full overflow-hidden rounded-md"}
                  style={{
                    // Жёстко задаём высоту для компактного режима
                    height: compactPlayer ? 132 : 360
                  }}
                >
                  <iframe
                    title={`${title} player`}
                    src={embeddedPlayerUrl}
                    width="100%"
                    height="100%"
                    frameBorder={0}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* Треки */}
            {tracks.length > 0 && (
              <div className="mt-6 space-y-2">
                {tracks.map((t, i) => (
                  <div key={i} className="flex items-baseline gap-3">
                    <span className="text-type-body text-foreground">{t.title}</span>
                    {t.duration && (
                      <span className="text-type-small text-muted-foreground">{t.duration}</span>
                    )}
                    {t.externalLink && (
                      <a
                        href={t.externalLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-type-small underline text-muted-foreground hover:text-foreground"
                      >
                        open
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
