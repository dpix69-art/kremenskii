// client/src/lib/platformCover.ts
import { useEffect, useMemo, useState } from "react";
import { assetUrl } from "@/lib/assetUrl";

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

/** HEAD-проверка наличия файла (на нашем же домене работает, CORS ок) */
async function checkUrlOk(u: string): Promise<boolean> {
  try {
    const res = await fetch(u, { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
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

/** Асинхронно подобрать лучшую обложку (проверяем cover, если он битый — падаем на oEmbed) */
export async function resolvePlatformCover(opts: {
  platform?: "soundcloud" | "bandcamp";
  embedUrl?: string;
  cover?: string; // приоритет, если он существует физически
}): Promise<string | undefined> {
  const { platform, embedUrl, cover } = opts;

  // 1) если задан cover — проверим, что файл реально доступен
  if (cover) {
    const abs = assetUrl(cover.replace(/^\/+/, ""));
    if (await checkUrlOk(abs)) return cover;
    // если файл битый — не используем cover, идём дальше
  }

  // 2) SoundCloud — пытаемся достать через oEmbed
  if ((platform && platform.toLowerCase() === "soundcloud") || /soundcloud\.com/i.test(embedUrl || "")) {
    if (!embedUrl) return;
    try {
      const thumb = await fetchSoundCloudThumb(embedUrl);
      return thumb;
    } catch {
      return;
    }
  }

  // 3) Bandcamp — без сервера авто нельзя (оставляем пусто или cover из JSON)
  return;
}

/** React-хук для карточек/грида */
export function usePlatformCover(opts: {
  platform?: "soundcloud" | "bandcamp";
  embedUrl?: string;
  cover?: string;
}) {
  const [url, setUrl] = useState<string | undefined>(undefined);

  // быстрый первичный src (только если cover есть — для мгновенного рендера)
  const initial = useMemo(() => (opts.cover ? opts.cover : undefined), [opts.cover]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const r = await resolvePlatformCover(opts);
      if (!cancelled) setUrl(r);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [opts.platform, opts.embedUrl, opts.cover]);

  // если проверка ещё не завершилась — показываем initial (если он есть)
  return url || initial;
}
