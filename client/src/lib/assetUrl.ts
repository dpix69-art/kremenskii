/**
 * Normalize asset URL — ensures leading slash for absolute paths
 */
export function assetUrl(src: string): string {
  if (!src) return "";
  const s = src.replace(/^\/+/, "").replace(/\?url.*$/, "");
  if (s.startsWith("http") || s.startsWith("data:")) return s;
  return "/" + s;
}
