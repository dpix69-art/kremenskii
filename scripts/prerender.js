#!/usr/bin/env node
/**
 * prerender.js — Post-build pre-rendering for SEO
 * 
 * After `vite build`, this script:
 * 1. Reads content.json to discover all routes
 * 2. For each route, copies dist/index.html with injected meta tags
 * 3. Creates proper directory structure for clean URLs
 * 
 * This is a lightweight alternative to Puppeteer-based prerendering.
 * The React app hydrates on top of this shell, giving instant FCP + SEO.
 */

import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
const CONTENT_PATH = path.resolve("client/public/content.json");
const DOMAIN = "https://kremenskii.art";

// Read content.json
let content;
try {
  content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf-8"));
} catch {
  console.error("❌ Cannot read client/public/content.json");
  process.exit(1);
}

const site = content.site || {};
const series = content.series || [];
const sounds = content.sounds || [];

// Collect all routes with their meta
const routes = [
  {
    path: "/",
    title: `${site.artistName || "Dmitrii Kremenskii"} — ${site.role || "Visual & Sound Artist"}`,
    description: site.statement || "",
  },
  {
    path: "/gallery",
    title: `Gallery — ${site.artistName}`,
    description: "Artwork series and collections.",
  },
  {
    path: "/sounds",
    title: `Sounds — ${site.artistName}`,
    description: "Sound projects, field recordings, and performances.",
  },
  {
    path: "/statement",
    title: `Statement — ${site.artistName}`,
    description: content.statement?.paragraphs?.[0] || "Artist statement.",
  },
  {
    path: "/contacts",
    title: `Contacts — ${site.artistName}`,
    description: content.contacts?.openToText || "Get in touch.",
  },
  {
    path: "/impressum",
    title: `Impressum — ${site.artistName}`,
    description: "Legal information.",
  },
];

// Series pages
for (const s of series) {
  const intro = Array.isArray(s.intro) ? s.intro[0] : s.intro || "";
  routes.push({
    path: `/gallery/${s.slug}`,
    title: `${s.title} — ${site.artistName}`,
    description: intro.slice(0, 160),
  });

  // Individual artwork pages
  for (const w of (s.works || [])) {
    routes.push({
      path: `/gallery/${s.slug}/${w.slug}`,
      title: `${w.title} — ${s.title} — ${site.artistName}`,
      description: `${w.title}, ${w.technique || ""}, ${w.year || ""}`.trim(),
    });
  }
}

// Sound project pages
for (const s of sounds) {
  routes.push({
    path: `/sounds/${s.slug}`,
    title: `${s.title} — ${site.artistName}`,
    description: s.summary || "",
  });
}

// Read the built index.html
const indexHtml = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function injectMeta(html, route) {
  const title = esc(route.title);
  const desc = esc(route.description.slice(0, 160));
  const canonical = `${DOMAIN}${route.path === "/" ? "" : route.path}`;

  // Replace <title> tag
  let result = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${title}</title>`
  );

  // Replace/add meta description
  if (result.includes('name="description"')) {
    result = result.replace(
      /(<meta name="description" content=")[^"]*(")/,
      `$1${desc}$2`
    );
  }

  // Replace OG tags
  result = result.replace(
    /(<meta property="og:title" content=")[^"]*(")/,
    `$1${title}$2`
  );
  result = result.replace(
    /(<meta property="og:description" content=")[^"]*(")/,
    `$1${desc}$2`
  );
  result = result.replace(
    /(<meta property="og:url" content=")[^"]*(")/,
    `$1${canonical}$2`
  );

  // Replace canonical
  result = result.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${canonical}$2`
  );

  return result;
}

console.log("\n🔍 Pre-rendering routes...\n");

let count = 0;
for (const route of routes) {
  const html = injectMeta(indexHtml, route);
  
  // Write to proper directory structure
  // /gallery → dist/gallery/index.html
  // /gallery/farbkoerper → dist/gallery/farbkoerper/index.html
  const dirPath = route.path === "/" 
    ? DIST 
    : path.join(DIST, route.path);
  
  fs.mkdirSync(dirPath, { recursive: true });
  
  const filePath = route.path === "/"
    ? path.join(DIST, "index.html")
    : path.join(dirPath, "index.html");
  
  fs.writeFileSync(filePath, html, "utf-8");
  count++;
  console.log(`  ✓ ${route.path}`);
}

// Also write 404.html (copy of index.html with 404 meta)
const notFoundHtml = injectMeta(indexHtml, {
  path: "/404",
  title: `Page Not Found — ${site.artistName}`,
  description: "The page you're looking for doesn't exist.",
});
fs.writeFileSync(path.join(DIST, "404.html"), notFoundHtml, "utf-8");
console.log("  ✓ /404");

console.log(`\n✅ Pre-rendered ${count + 1} pages\n`);
