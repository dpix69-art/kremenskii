// client/src/content/ContentProvider.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ContentData = any;

interface ContentContextValue {
  content: ContentData | null;
  loading: boolean;
  error: string | null;
}

const ContentContext = createContext<ContentContextValue>({
  content: null,
  loading: true,
  error: null,
});

function withBase(p?: string) {
  if (!p) return "";
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  return `${base}/${String(p).replace(/^\/+/, "")}`;
}

// Попытка получить thumbnail с oEmbed (SoundCloud).
async function fetchSoundCloudThumbnail(pageUrl: string): Promise<string | null> {
  try {
    const url = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(pageUrl)}`;
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.thumbnail_url === "string" ? data.thumbnail_url : null;
  } catch {
    return null;
  }
}

// Обогащаем sounds: если platform=soundcloud и cover отсутствует, но есть pageUrl — тянем thumbnail.
async function enrichSoundsCovers(data: ContentData): Promise<ContentData> {
  if (!data || !Array.isArray(data.sounds)) return data;

  const cloned = { ...data, sounds: [...data.sounds] };

  await Promise.all(
    cloned.sounds.map(async (s: any, idx: number) => {
      const isSC =
        String(s.platform || "").toLowerCase() === "soundcloud" ||
        /soundcloud\.com/i.test(String(s.embed || ""));

      const hasCover = typeof s.cover === "string" && s.cover.trim().length > 0;
      const hasPageUrl = typeof s.pageUrl === "string" && s.pageUrl.trim().length > 0;

      if (isSC && !hasCover && hasPageUrl) {
        const thumb = await fetchSoundCloudThumbnail(s.pageUrl);
        if (thumb) {
          cloned.sounds[idx] = { ...s, cover: thumb };
        }
      }
    })
  );

  return cloned;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const ts = Date.now();
        const res = await fetch(withBase(`content.json?ts=${ts}`), { cache: "no-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        // обогатим sound-проекты обложками по pageUrl (если нужно)
        const enriched = await enrichSoundsCovers(json);

        if (!cancelled) setContent(enriched);
      } catch (e: any) {
        console.warn("[ContentProvider] fallback content used. Reason:", e?.message || e);
        if (!cancelled) {
          setContent(null);
          setError(e?.message || "Failed to load content.json");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, error }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
