// src/pages/Gallery.tsx
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import SeriesIndex from "@/components/SeriesIndex";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";
import { assetUrl } from "@/lib/assetUrl";

type SeriesCard = {
  title: string;
  slug: string;
  year: string;
  intro: string;          // ← SeriesIndex ожидает строку
  artworkImages: string[];
  workCount: number;
};

/** Нейтральный плейсхолдер (4:5) — без внешних файлов */
const BLANK_SVG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="100%" height="100%" fill="%23f2f2f2"/></svg>';

function isLegacyAsset(raw: string) {
  const s = raw.toLowerCase();
  return (
    s.includes("generated_images") ||
    s.startsWith("@assets") ||
    s.includes("/assets/generated_images")
  );
}

function cleanImage(raw?: any): string {
  const src = typeof raw === "string" ? raw : raw?.url || raw?.src || "";
  if (!src) return "";
  if (isLegacyAsset(src)) return "";
  return assetUrl(String(src).replace(/^\/+/, ""));
}

export default function Gallery() {
  const { content } = useContent();

  // 1) Собираем серии из JSON безопасно
  const seriesFromJson: SeriesCard[] = Array.isArray(content?.series)
    ? content!.series.map((s: any) => {
        // Берём до 3 превью для карточки серии
        let imgs: any[] = [];
        if (Array.isArray(s.artworkImages) && s.artworkImages.length) {
          imgs = s.artworkImages;
        } else if (Array.isArray(s.works)) {
          imgs = s.works
            .map((w: any) => (Array.isArray(w.images) ? w.images[0] : w.images))
            .filter(Boolean)
            .slice(0, 3);
        }

        // Нормализуем пути и фильтруем «наследие»
        const normalized = imgs
          .map((it) => cleanImage(it))
          .filter(Boolean);

        // Если карточке нужно ровно 3 превью — мягко дополним плейсхолдерами
        while (normalized.length < 3) normalized.push(BLANK_SVG);

        const workCount =
          typeof s.workCount === "number"
            ? s.workCount
            : Array.isArray(s.works)
            ? s.works.length
            : 0;

        // ✅ Фикс: поддерживаем string | string[] у series.intro
        const introText =
          Array.isArray(s.intro)
            ? s.intro
                .filter((p: any) => typeof p === "string" && p.trim().length > 0)
                .join("\n\n")
            : typeof s.intro === "string"
            ? s.intro
            : "";

        return {
          title: s.title || s.slug || "Untitled series",
          slug: s.slug || "",
