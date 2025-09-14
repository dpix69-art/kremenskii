// Генерирует src/srcSet/sizes по пути из content.json
// Пример входа: "images/farbkoerper/fkb-04.jpg"
// Плагин кладёт: fkb-04@800w.avif, fkb-04@1600w.webp и т.п.

export function buildImageSet(rawUrl: string) {
  // убираем ведущий слэш и пробелы
  const clean = String(rawUrl || "").trim().replace(/^\/+/, "");
  // base без расширения
  const base = clean.replace(/\.[^.]+$/, "");

  // srcset под naming от vite-plugin-image-optimizer: "@<width>w"
  const avif = `/${base}@800w.avif 800w, /${base}@1600w.avif 1600w, /${base}@2400w.avif 2400w`;
  const webp = `/${base}@800w.webp 800w, /${base}@1600w.webp 1600w, /${base}@2400w.webp 2400w`;

  // оригинал как fallback (jpg/png/webp — что в content.json)
  const fallback = `/${clean}`;

  // адаптив: мобильным 100vw, на десктопе ~70vw (левая колонка)
  const sizes = "(max-width: 768px) 100vw, 70vw";

  return { fallback, avif, webp, sizes };
}
