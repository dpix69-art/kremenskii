import React, { createContext, useContext, useEffect, useState } from "react";

type Content = any; // можно расписать типы позже

type Ctx = { content: Content | null; loading: boolean; error?: string };
const ContentContext = createContext<Ctx>({ content: null, loading: true });

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Ctx>({ content: null, loading: true });

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}content.json`;
    fetch(url, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((json) => setState({ content: json, loading: false }))
      .catch((e) => setState({ content: null, loading: false, error: String(e) }));
  }, []);

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
