#!/usr/bin/env node
/**
 * prerender.js v2 — Full content pre-rendering for SEO
 *
 * After `vite build`, this script:
 * 1. Reads content.json to discover all routes
 * 2. For each route, injects REAL HTML content inside <div id="root">
 * 3. React hydrates on top — user gets instant content + interactivity
 *
 * This gives us:
 * - Full HTML for crawlers (Google, social previews, curl)
 * - Instant FCP (content visible before JS loads)
 * - React takes over seamlessly after hydration
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
  console.error("❌ Cannot read client/public/content.json");
  process.exit(1);
}

const site = content.site || {};
const nav = content.nav || [];
const series = content.series || [];
const sounds = content.sounds || [];
const statement = content.statement || {};
const contacts = content.contacts || {};
const impressum = content.impressum || {};

const artistName = site.artistName || "Dmitrii Kremenskii";

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Shared HTML fragments ────────────────────────────────

function headerHtml() {
  const links = nav
    .filter(n => n.label && n.href)
    .map(n => {
      const href = n.href.replace(/^#/, "");
      return `<a href="${esc(href)}">${esc(n.label)}</a>`;
    })
    .join(" ");
  return `<header><nav><a href="/"><strong>${esc(artistName)}</strong></a> ${links}</nav></header>`;
}

function footerHtml() {
  const copy = content.footer?.copyright || `© ${artistName}`;
  const email = contacts.email || "";
  return `<footer><p>${esc(copy)}</p>${email ? `<p><a href="mailto:${esc(email)}">${esc(email)}</a></p>` : ""}</footer>`;
}

// ── Page content generators ──────────────────────────────

function homeContent() {
  const role = site.role || "Visual & Sound Artist";
  const stmt = site.statement || "";
  const openTo = contacts.openToText || "";
  const email = contacts.email || "";

  let featured = "";
  for (const f of (site.homeFeatured || []).slice(0, 2)) {
    const s = series.find(x => x.slug === f.series);
    if (!s) continue;
    const w = (s.works || []).find(x => x.slug === f.work);
    if (!w) continue;
    const img = Array.isArray(w.images) && w.images[0]
      ? (typeof w.images[0] === "string" ? w.images[0] : w.images[0].url || "")
      : "";
    featured += `<article>
      <a href="/gallery/${esc(s.slug)}/${esc(w.slug)}">
        ${img ? `<img src="/${esc(img)}" alt="${esc(w.title)}" loading="lazy" width="600" height="750">` : ""}
        <h3>${esc(w.title)}</h3>
        <p>${esc(String(w.year || ""))} · ${esc(w.technique || w.medium || "")}</p>
      </a>
    </article>`;
  }

  let sound = "";
  if (sounds[0]) {
    const s = sounds[0];
    sound = `<section>
      <h2>Sounds</h2>
      <a href="/sounds/${esc(s.slug)}">${esc(s.title)}</a>
      <p>${esc(s.summary || "")}</p>
    </section>`;
  }

  return `<section>
    <p>${esc(role)}</p>
    <p>${esc(stmt)}</p>
    ${openTo ? `<p>${esc(openTo)}${email ? ` — <a href="mailto:${esc(email)}">${esc(email)}</a>` : ""}</p>` : ""}
  </section>
  <section>${featured}</section>
  ${sound}`;
}

function galleryContent() {
  let html = `<h1>Gallery</h1>`;
  for (const s of series) {
    const intro = Array.isArray(s.intro) ? s.intro.join(" ") : s.intro || "";
    const count = (s.works || []).length;
    html += `<article>
      <h2><a href="/gallery/${esc(s.slug)}">${esc(s.title)}</a></h2>
      <p>${esc(String(s.year || ""))}</p>
      <p>${esc(intro)}</p>
      <p>${count} work${count !== 1 ? "s" : ""}</p>
    </article>`;
  }
  return html;
}

function seriesContent(s) {
  const intro = Array.isArray(s.intro) ? s.intro.join(" ") : s.intro || "";
  let html = `<h1>${esc(s.title)}</h1><p>${esc(String(s.year || ""))}</p><p>${esc(intro)}</p>`;
  for (const w of (s.works || [])) {
    const img = Array.isArray(w.images) && w.images[0]
      ? (typeof w.images[0] === "string" ? w.images[0] : w.images[0].url || "")
      : "";
    html += `<article>
      <a href="/gallery/${esc(s.slug)}/${esc(w.slug)}">
        ${img ? `<img src="/${esc(img)}" alt="${esc(w.title)}" loading="lazy" width="400" height="500">` : ""}
        <h3>${esc(w.title)}</h3>
        <p>${esc(String(w.year || ""))} · ${esc(w.technique || "")}</p>
      </a>
    </article>`;
  }
  return html;
}

function artworkContent(s, w) {
  const img = Array.isArray(w.images) && w.images[0]
    ? (typeof w.images[0] === "string" ? w.images[0] : w.images[0].url || "")
    : "";
  const avail = w.sale?.availability || "";
  const technique = w.technique || w.medium || "";

  return `<article>
    ${img ? `<img src="/${esc(img)}" alt="${esc(w.title)}" width="800" height="1000">` : ""}
    <h1>${esc(w.title)}</h1>
    <dl>
      <dt>Series</dt><dd><a href="/gallery/${esc(s.slug)}">${esc(s.title)}</a></dd>
      <dt>Year</dt><dd>${esc(String(w.year || ""))}</dd>
      ${technique ? `<dt>Technique</dt><dd>${esc(technique)}</dd>` : ""}
      ${w.dimensions ? `<dt>Dimensions</dt><dd>${esc(w.dimensions)}</dd>` : ""}
      ${avail ? `<dt>Status</dt><dd>${esc(avail === "available" ? "Available" : avail === "sold" ? "Sold" : avail)}</dd>` : ""}
    </dl>
    ${avail === "available" ? `<p>For inquiries — <a href="mailto:${esc(contacts.email || "")}">${esc(contacts.email || "")}</a></p>` : ""}
  </article>`;
}

function soundsContent() {
  let html = `<h1>Sounds</h1>`;
  for (const s of sounds) {
    html += `<article>
      <h2><a href="/sounds/${esc(s.slug)}">${esc(s.title)}</a></h2>
      <p>${esc(String(s.year || ""))}${s.meta?.label ? ` · ${esc(s.meta.label)}` : ""}</p>
      <p>${esc(s.summary || "")}</p>
    </article>`;
  }
  return html;
}

function soundDetailContent(s) {
  const blocks = Array.isArray(s.bodyBlocks) ? s.bodyBlocks
    : typeof s.bodyBlocks === "string" ? [{ type: "p", text: s.bodyBlocks }]
    : [];
  const text = blocks.map(b => `<p>${esc(typeof b === "string" ? b : b.text || "")}</p>`).join("");
  return `<article>
    <h1>${esc(s.title)}</h1>
    <p>${esc(String(s.year || ""))}${s.location ? ` · ${esc(s.location)}` : ""}${s.meta?.label ? ` · ${esc(s.meta.label)}` : ""}</p>
    ${text}
  </article>`;
}

function statementContent() {
  const paras = (statement.paragraphs || []).filter(p => p.trim());
  const exhibitions = statement.exhibitions || [];
  let html = `<h1>Statement</h1>`;
  html += paras.map(p => `<p>${esc(p)}</p>`).join("");
  if (exhibitions.length) {
    html += `<h2>Selected Exhibitions & Performances</h2><ul>`;
    html += exhibitions.map(e => `<li>${esc(String(e.year || ""))} — ${esc(e.event || "")}</li>`).join("");
    html += `</ul>`;
  }
  return html;
}

function contactsContent() {
  const socials = (contacts.socials || []).map(s =>
    `<a href="${esc(s.href)}">${esc(s.label)}</a>`
  ).join(" · ");
  return `<h1>Contacts</h1>
    ${contacts.introText ? `<p>${esc(contacts.introText)}</p>` : ""}
    <p><a href="mailto:${esc(contacts.email || "")}">${esc(contacts.email || "")}</a></p>
    <p>${esc([contacts.city, contacts.country].filter(Boolean).join(", "))}</p>
    ${contacts.openToText ? `<p>${esc(contacts.openToText)}</p>` : ""}
    ${socials ? `<p>${socials}</p>` : ""}`;
}

function impressumContent() {
  const paras = impressum.paragraphs || [];
  return `<h1>Impressum</h1>${paras.map(p => `<p>${esc(p)}</p>`).join("")}`;
}

// ── Route definitions ────────────────────────────────────

const routes = [
  { path: "/", title: `${artistName} — ${site.role || "Visual & Sound Artist"}`, desc: site.statement || "", html: homeContent },
  { path: "/gallery", title: `Gallery — ${artistName}`, desc: "Artwork series and collections.", html: galleryContent },
  { path: "/sounds", title: `Sounds — ${artistName}`, desc: "Sound projects, field recordings, and performances.", html: soundsContent },
  { path: "/statement", title: `Statement — ${artistName}`, desc: statement.paragraphs?.[0] || "", html: statementContent },
  { path: "/contacts", title: `Contacts — ${artistName}`, desc: contacts.openToText || "Get in touch.", html: contactsContent },
  { path: "/impressum", title: `Impressum — ${artistName}`, desc: "Legal information.", html: impressumContent },
];

for (const s of series) {
  const intro = Array.isArray(s.intro) ? s.intro[0] : s.intro || "";
  routes.push({
    path: `/gallery/${s.slug}`,
    title: `${s.title} — ${artistName}`,
    desc: intro.slice(0, 160),
    html: () => seriesContent(s),
  });
  for (const w of (s.works || [])) {
    routes.push({
      path: `/gallery/${s.slug}/${w.slug}`,
      title: `${w.title} — ${s.title} — ${artistName}`,
      desc: `${w.title}, ${w.technique || ""}, ${w.year || ""}`.trim(),
      html: () => artworkContent(s, w),
    });
  }
}

for (const s of sounds) {
  routes.push({
    path: `/sounds/${s.slug}`,
    title: `${s.title} — ${artistName}`,
    desc: s.summary || "",
    html: () => soundDetailContent(s),
  });
}

// ── Build ────────────────────────────────────────────────

const indexHtml = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

function buildPage(route) {
  const title = esc(route.title);
  const desc = esc((route.desc || "").slice(0, 160));
  const canonical = `${DOMAIN}${route.path === "/" ? "" : route.path}`;

  // Generate the actual page content
  const pageContent = typeof route.html === "function" ? route.html() : "";
  const fullContent = `${headerHtml()}<main>${pageContent}</main>${footerHtml()}`;

  let html = indexHtml;

  // Inject content inside <div id="root">
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${fullContent}</div>`
  );

  // Update meta tags
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/,`$1${desc}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/,`$1${title}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/,`$1${desc}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/,`$1${canonical}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/,`$1${canonical}$2`);

  return html;
}

console.log("\n🔨 Pre-rendering with full HTML content...\n");

let count = 0;
for (const route of routes) {
  const html = buildPage(route);
  const dirPath = route.path === "/" ? DIST : path.join(DIST, route.path);
  fs.mkdirSync(dirPath, { recursive: true });
  const filePath = route.path === "/" ? path.join(DIST, "index.html") : path.join(dirPath, "index.html");
  fs.writeFileSync(filePath, html, "utf-8");
  count++;
  console.log(`  ✓ ${route.path}`);
}

// 404
const notFoundHtml = buildPage({
  path: "/404",
  title: `Page Not Found — ${artistName}`,
  desc: "The page you're looking for doesn't exist.",
  html: () => `<h1>404 — Page not found</h1><p><a href="/">Back home</a></p>`,
});
fs.writeFileSync(path.join(DIST, "404.html"), notFoundHtml, "utf-8");
console.log("  ✓ /404");

console.log(`\n✅ Pre-rendered ${count + 1} pages with full HTML content\n`);