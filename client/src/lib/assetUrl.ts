export function assetUrl(p?: string) {
  if (!p) return "";
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  const v = import.meta.env.VITE_BUILD_ID || "";
  const url = `${base}/${String(p).replace(/^\/+/, "")}`;
  return v ? `${url}${url.includes("?") ? "&" : "?"}v=${v}` : url;
}
