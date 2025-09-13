import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Сбрасывает скролл к началу при каждом изменении маршрута.
 * Дополнительно пытается фокуснуть #page-title для доступности.
 */
export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // мгновенно наверх
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // аккуратно фокуснём заголовок, если есть
    const id = "page-title";
    const el = document.getElementById(id) as HTMLElement | null;
    if (el) {
      // даём кадр на рендер
      requestAnimationFrame(() => el.focus?.());
    }
  }, [location]);

  return null;
}
