#!/usr/bin/env node
/**
 * sitemap.js — Generates sitemap.xml and robots.txt from content.json
 */

import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
const CONTENT_PATH = path.resolve("client/public/content.json");
const DOMAIN = "https://kremenskii.art";

let content;
try {
  content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf-8"));
} catch {
  console.error("❌ Cannot read content.json");
  process.exit(1);
}

const series = content.series || [];
const sounds = content.sounds || [];

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
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
`;

fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap, "utf-8");
fs.writeFileSync(path.join(DIST, "robots.txt"), robots, "utf-8");

console.log(`\n🗺️  Generated sitemap.xml (${urls.length} URLs) + robots.txt\n`);
