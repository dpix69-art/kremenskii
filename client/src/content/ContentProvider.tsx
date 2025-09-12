import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Content = any;

type Ctx = {
  content: Content | null;
  loading: boolean;
  error: string | null;
};

const ContentCtx = createContext<Ctx>({ content: null, loading: true, error: null });

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
    const buildId = import.meta.env.VITE_BUILD_ID || Math.floor(Date.now() / 3600_000);
    const url = `${base}/content.json?v=${buildId}`;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setContent(json);
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(String(e?.message || e));
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return (
    <ContentCtx.Provider value={{ content, loading, error }}>
      {children}
    </ContentCtx.Provider>
  );
}

export const useContent = () => useContext(ContentCtx);
