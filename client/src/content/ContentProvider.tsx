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

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // No cache-busting — let Cloudflare and browser cache normally.
        // content.json changes rarely; cache is fine.
        const res = await fetch("/content.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ContentData = await res.json();
        if (!cancelled) setContent(json);
      } catch (e: any) {
        console.warn("[ContentProvider] Using fallback content:", e?.message);
        if (!cancelled) {
          setContent(defaultContent as ContentData);
          setError(e?.message || "Failed to load content.json");
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