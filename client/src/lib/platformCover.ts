// client/src/lib/platformCover.ts
import { useEffect, useMemo, useState } from "react";

/** Проверка абсолютного URL */
const isAbs = (u?: string) => !!u && /^(https?:)?\/\//i.test(u);

/** Извлечь целевой URL из w.soundcloud.com/player?url=ENCODED */
function extractSoundCloudTarget(url: string): string {
  try {
    const u = new URL(url);
    if (/w\.soundcloud\.com\/player/i.test(u.host + u.pathname)) {
      const inner = u.searchParams.get("url");
      if (inner) return decodeURIComponent(inner);
    }
  } catch {}
  return url;
}

/** Получить thumbnail через oEmbed SoundCloud */
async function fetchSoundCloudThumb(targetUrl: string): Promise<string | undefined> {
  const t = extractSoundCloudTarget(targetUrl);
  const endpoint = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(t)}`;
  const res = await fetch(endpoint, { method: "GET" });
  if (!res.ok) return;
  const data = await res.json();
  return typeof data?.thumbnail_url === "string" ? data.thumbnail_url : undefined;
}

/** Асинхронно подобрать лучшую обложку (без заглушек) */
export async function resolvePlatformCover(opts: {
  platform?: "soundcloud" | "bandcamp";
  embedUrl?: string;
  cover?: string; // приоритет, если задан
}): Promise<string | undefined> {
  const { platform, embedUrl, cover } = opts;

  // Явный cover — главный
  if (cover) return cover;

  // SoundCloud — тянем через oEmbed
  if ((platform && platform.toLowerCase() === "soundcloud") || /soundcloud\.com/i.test(embedUrl || "")) {
    if (!embedUrl) return;
    try {
      const thumb = await fetchSoundCloudThumb(embedUrl);
      return thumb;
    } catch {
      return;
    }
  }

  // Bandcamp — без сервера авто-нормально не достать (CORS/нет стабильного oEmbed)
  // Используй cover из content.json
  return;
}

/** React-хук для карточек/гридов */
export function usePlatformCover(opts: {
  platform?: "soundcloud" | "bandcamp";
  embedUrl?: string;
  cover?: string;
}) {
  const [url, setUrl] = useState<string | undefined>(undefined);

  // Мгновенно берём cover, если он есть
  const initial = useMemo(() => {
    const c = opts.cover;
    return c ? c : undefined;
  }, [opts.cover]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (opts.cover) {
        setUrl(opts.cover);
        return;
      }
      const r = await resolvePlatformCover(opts);
      if (!cancelled) setUrl(r);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [opts.platform, opts.embedUrl, opts.cover]);

  // Если platformCover ещё не загрузился — покажем initial (если есть)
  return url || initial;
}
