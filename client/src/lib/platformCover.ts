// client/src/lib/platformCover.ts

/**
 * Возвращает URL обложки по платформе/встроенному плееру.
 * Без внешних API угадать реальную обложку SoundCloud/Bandcamp надёжно нельзя,
 * поэтому функция пытается:
 * - использовать локальную "cover" (если она уже подставлена где-то выше),
 * - либо вернуть пустую строку, чтобы грид отрендерил заглушку.
 *
 * Если позже добавишь серверный прокси или oEmbed — сюда легко вкрутить извлечение thumb.
 */
export function platformCover(
  platform?: string,
  embedUrl?: string
): string {
  const p = (platform || "").toLowerCase();
  const u = (embedUrl || "").toLowerCase();

  // Пример эвристик: если embedUrl уже содержит ссылку на картинку — отдать её.
  // (сейчас для SC/Bandcamp это редко встречается, оставим задел)
  if (/\.(png|jpe?g|webp|avif)(\?|#|$)/i.test(u)) {
    return embedUrl!;
  }

  // Для SoundCloud и Bandcamp без API/оEmbed безопасно вернуть пусто —
  // тогда GalleryGrid покажет мутед-заглушку.
  if (p.includes("soundcloud") || /soundcloud\.com/.test(u)) return "";
  if (p.includes("bandcamp") || /bandcamp\.com/.test(u)) return "";

  // На прочие случаи — пустая строка.
  return "";
}

export default platformCover;
