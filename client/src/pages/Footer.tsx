import { useContent } from "@/content/ContentProvider";

type SocialLinks = {
  instagram?: string;
  soundcloud?: string;
  bandcamp?: string;
};

type Props = {
  artistName?: string;
  year?: number;
  portfolioPdfUrl?: string;
  socialLinks?: SocialLinks;
};

export default function Footer(props: Props) {
  const { content } = useContent();

  const artistName =
    props.artistName ?? content?.site?.artistName ?? "Artist Name";
  const year = props.year ?? new Date().getFullYear();

  // важно: без ведущего слэша (GitHub Pages)
  const portfolio =
    (props.portfolioPdfUrl || content?.contacts?.portfolioPdf || "files/portfolio.pdf").replace(
      /^\/+/,
      ""
    );

  const legal = content?.footer?.legal ?? "Images © … / Texts © … No reproduction.";
  const copyright =
    content?.footer?.copyright ?? `© ${artistName}. All rights reserved.`;

  const socialsFromJson =
    content?.contacts?.socials?.reduce((acc: SocialLinks, s: any) => {
      const key = String(s.label || "").toLowerCase();
      if (["instagram", "soundcloud", "bandcamp"].includes(key)) (acc as any)[key] = s.href;
      return acc;
    }, {}) ?? {};

  const socials: SocialLinks = { ...socialsFromJson, ...(props.socialLinks || {}) };

  return (
    <footer className="site-container py-6 border-t border-[var(--line)]">
      <div className="text-type-small text-muted-foreground space-y-2">
        <p>{legal}</p>
        <p>{copyright.replace(/\{year\}/g, String(year))}</p>
        <div className="flex gap-4">
          {socials.instagram && (
            <a href={socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
          )}
          {socials.soundcloud && (
            <a href={socials.soundcloud} target="_blank" rel="noreferrer">SoundCloud</a>
          )}
          {socials.bandcamp && (
            <a href={socials.bandcamp} target="_blank" rel="noreferrer">Bandcamp</a>
          )}
          <a href={portfolio} download>Download portfolio (PDF)</a>
        </div>
        <div className="text-[11px] opacity-70">
          {artistName} · {year}
        </div>
      </div>
    </footer>
  );
}
