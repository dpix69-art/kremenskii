// src/lib/imageSet.ts
export function buildImageSet(rawUrl: string) {
  // Пример: "images/farbkoerper/fkb-01.jpg"
  const clean = rawUrl.replace(/^\/+/, "");
  const base = clean.replace(/\.[^.]+$/, ""); // без расширения
  const ext = clean.split(".").pop() || "jpg";

  return {
    fallback: `/${clean}`, // оригинал (jpg/png)
    webp: `
      /${base}-800w.webp 800w,
      /${base}-1600w.webp 1600w,
      /${base}-2400w.webp 2400w
    `,
    avif: `
      /${base}-800w.avif 800w,
      /${base}-1600w.avif 1600w,
      /${base}-2400w.avif 2400w
    `,
    sizes: "(max-width: 768px) 100vw, 70vw",
  };
}
