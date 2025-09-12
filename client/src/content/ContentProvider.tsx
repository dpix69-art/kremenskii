import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import defaultContent from "./defaultContent"; // наш фолбэк на случай 404

type ContentContextValue = {
  content: any | null;
  loading: boolean;
  error?: string | null;
};

const ContentContext = createContext<ContentContextValue>({
  content: null,
  loading: true,
  error: null,
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      // BASE_URL корректно работает на GitHub Pages (обычно "/")
      const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");

      // Пробуем несколько кандидатов (hash-роутер не мешает статике)
      const candidates = [
        `${base}/content.json?ts=${Math.floor(Date.now() / 3600_000)}`, // с часовым cache-bust
        `${base}/content.json`,
        `content.json`,
      ];

      let data: any | null = null;

      for (const url of candidates) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (res.ok) {
            const ct = res.headers.get("content-type") || "";
            if (ct.includes("application/json")) {
              data = await res.json();
              break;
            }
          }
        } catch {
          // ignore and try next
        }
      }

      if (!data) {
        console.warn(
          "[ContentProvider] content.json не найден в public. Использую встроенный fallback."
        );
        data = defaultContent;
        // Пояснительная ошибка (в UI не показываем, только в контексте)
        setError("content.json not found, using fallback");
      }

      if (!cancelled) {
        setContent(data);
        setLoading(false);
      }
    })();

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
