#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
const CONTENT_DIR = path.resolve("client/public/content");
const DOMAIN = "https://kremenskii.art";

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, name), "utf-8"));
}

const sd = readJson("series.json");
const snd = readJson("sounds.json");
const series = sd.series || sd;
const sounds = snd.sounds || snd;

const urls = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/gallery", priority: "0.9", changefreq: "weekly" },
  { loc: "/sounds", priority: "0.8", changefreq: "weekly" },
  { loc: "/statement", priority: "0.6", changefreq: "monthly" },
  { loc: "/contacts", priority: "0.5", changefreq: "monthly" },
];

for (const s of series) {
  urls.push({ loc: `/gallery/${s.slug}`, priority: "0.8", changefreq: "weekly" });
  for (const w of (s.works || [])) {
    urls.push({ loc: `/gallery/${s.slug}/${w.slug}`, priority: "0.7", changefreq: "monthly" });
  }
}
for (const s of sounds) {
  urls.push({ loc: `/sounds/${s.slug}`, priority: "0.7", changefreq: "monthly" });
}

const today = new Date().toISOString().split("T")[0];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${DOMAIN}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap, "utf-8");
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml\n`, "utf-8");
console.log(`\n🗺️  sitemap.xml (${urls.length} URLs) + robots.txt\n`);
