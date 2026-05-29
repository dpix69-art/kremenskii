import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ContentData } from "./types";
import defaultContent from "./defaultContent";

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

const CONTENT_FILES = [
  "/content/site.json",
  "/content/series.json",
  "/content/sounds.json",
  "/content/statement.json",
  "/content/contacts.json",
  "/content/impressum.json",
] as const;

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [siteData, seriesData, soundsData, statementData, contactsData, impressumData] =
          await Promise.all(CONTENT_FILES.map(fetchJson));

        if (cancelled) return;

        const merged: ContentData = {
          site: siteData.site,
          nav: siteData.nav || [],
          footer: siteData.footer,
          series: seriesData.series || [],
          sounds: soundsData.sounds || [],
          statement: statementData,
          contacts: contactsData,
          impressum: impressumData,
        };

        setContent(merged);
      } catch (e: any) {
        console.warn("[ContentProvider] Using fallback:", e?.message);
        if (!cancelled) {
          setContent(defaultContent as ContentData);
          setError(e?.message || "Failed to load content");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
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
