#!/usr/bin/env node
/**
 * prerender.js v3 — reads split content files, generates full HTML
 */

import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
const CONTENT_DIR = path.resolve("client/public/content");
const DOMAIN = "https://kremenskii.art";

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, name), "utf-8"));
}

// Load all content files
let siteData, seriesArr, soundsArr, statement, contacts, impressum;
try {
  siteData = readJson("site.json");
  const sd = readJson("series.json");
  seriesArr = sd.series || sd;
  const snd = readJson("sounds.json");
  soundsArr = snd.sounds || snd;
  statement = readJson("statement.json");
  contacts = readJson("contacts.json");
  impressum = readJson("impressum.json");
} catch (e) {
  console.error("❌ Cannot read content files from", CONTENT_DIR, e.message);
  process.exit(1);
}

const site = siteData.site || {};
const nav = siteData.nav || [];
const series = Array.isArray(seriesArr) ? seriesArr : [];
const sounds = Array.isArray(soundsArr) ? soundsArr : [];

const artistName = site.artistName || "Dmitrii Kremenskii";

function esc(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function headerHtml() {
  const links = nav.filter(n => n.label && n.href).map(n => {
    const href = n.href.replace(/^#/, "");
    return `<a href="${esc(href)}">${esc(n.label)}</a>`;
  }).join(" ");
  return `<header><nav><a href="/"><strong>${esc(artistName)}</strong></a> ${links}</nav></header>`;
}

function footerHtml() {
  const copy = siteData.footer?.copyright || `© ${artistName}`;
  const email = contacts.email || "";
  return `<footer><p>${esc(copy)}</p>${email ? `<p><a href="mailto:${esc(email)}">${esc(email)}</a></p>` : ""}</footer>`;
}

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
      ? (typeof w.images[0] === "string" ? w.images[0] : w.images[0].url || "") : "";
    featured += `<article><a href="/gallery/${esc(s.slug)}/${esc(w.slug)}">
      ${img ? `<img src="/${esc(img)}" alt="${esc(w.title)}" loading="lazy" width="600" height="750">` : ""}
      <h3>${esc(w.title)}</h3><p>${esc(String(w.year || ""))} · ${esc(w.technique || w.medium || "")}</p>
    </a></article>`;
  }

  let sound = "";
  if (sounds[0]) {
    const s = sounds[0];
    sound = `<section><h2>Sounds</h2><a href="/sounds/${esc(s.slug)}">${esc(s.title)}</a><p>${esc(s.summary || "")}</p></section>`;
  }

  return `<section><p>${esc(role)}</p><p>${esc(stmt)}</p>
    ${openTo ? `<p>${esc(openTo)}${email ? ` — <a href="mailto:${esc(email)}">${esc(email)}</a>` : ""}</p>` : ""}
  </section><section>${featured}</section>${sound}`;
}

function galleryContent() {
  let html = `<h1>Gallery</h1>`;
  for (const s of series) {
    const intro = Array.isArray(s.intro) ? s.intro.join(" ") : s.intro || "";
    html += `<article><h2><a href="/gallery/${esc(s.slug)}">${esc(s.title)}</a></h2>
      <p>${esc(String(s.year || ""))}</p><p>${esc(intro)}</p>
      <p>${(s.works||[]).length} work${(s.works||[]).length !== 1 ? "s" : ""}</p></article>`;
  }
  return html;
}

function seriesContent(s) {
  const intro = Array.isArray(s.intro) ? s.intro.join(" ") : s.intro || "";
  let html = `<h1>${esc(s.title)}</h1><p>${esc(String(s.year || ""))}</p><p>${esc(intro)}</p>`;
  for (const w of (s.works || [])) {
    const img = Array.isArray(w.images) && w.images[0]
      ? (typeof w.images[0] === "string" ? w.images[0] : w.images[0].url || "") : "";
    html += `<article><a href="/gallery/${esc(s.slug)}/${esc(w.slug)}">
      ${img ? `<img src="/${esc(img)}" alt="${esc(w.title)}" loading="lazy" width="400" height="500">` : ""}
      <h3>${esc(w.title)}</h3><p>${esc(String(w.year || ""))} · ${esc(w.technique || "")}</p>
    </a></article>`;
  }
  return html;
}

function artworkContent(s, w) {
  const img = Array.isArray(w.images) && w.images[0]
    ? (typeof w.images[0] === "string" ? w.images[0] : w.images[0].url || "") : "";
  const avail = w.sale?.availability || "";
  return `<article>
    ${img ? `<img src="/${esc(img)}" alt="${esc(w.title)}" width="800" height="1000">` : ""}
    <h1>${esc(w.title)}</h1>
    <dl>
      <dt>Series</dt><dd><a href="/gallery/${esc(s.slug)}">${esc(s.title)}</a></dd>
      <dt>Year</dt><dd>${esc(String(w.year || ""))}</dd>
      ${w.technique ? `<dt>Technique</dt><dd>${esc(w.technique)}</dd>` : ""}
      ${w.dimensions ? `<dt>Dimensions</dt><dd>${esc(w.dimensions)}</dd>` : ""}
      ${avail ? `<dt>Status</dt><dd>${esc(avail === "available" ? "Available" : avail === "sold" ? "Sold" : avail)}</dd>` : ""}
    </dl>
    ${avail === "available" && contacts.email ? `<p>For inquiries — <a href="mailto:${esc(contacts.email)}">${esc(contacts.email)}</a></p>` : ""}
  </article>`;
}

function soundsContent() {
  let html = `<h1>Sounds</h1>`;
  for (const s of sounds) {
    html += `<article><h2><a href="/sounds/${esc(s.slug)}">${esc(s.title)}</a></h2>
      <p>${esc(String(s.year || ""))}${s.meta?.label ? ` · ${esc(s.meta.label)}` : ""}</p>
      <p>${esc(s.summary || "")}</p></article>`;
  }
  return html;
}

function soundDetailContent(s) {
  const blocks = Array.isArray(s.bodyBlocks) ? s.bodyBlocks
    : typeof s.bodyBlocks === "string" ? [{ type: "p", text: s.bodyBlocks }] : [];
  const text = blocks.map(b => `<p>${esc(typeof b === "string" ? b : b.text || "")}</p>`).join("");
  return `<article><h1>${esc(s.title)}</h1>
    <p>${esc(String(s.year || ""))}${s.location ? ` · ${esc(s.location)}` : ""}</p>${text}</article>`;
}

function statementContent() {
  const paras = (statement.paragraphs || []).filter(p => p.trim());
  const exh = statement.exhibitions || [];
  let html = `<h1>Statement</h1>` + paras.map(p => `<p>${esc(p)}</p>`).join("");
  if (exh.length) {
    html += `<h2>Selected Exhibitions & Performances</h2><ul>` +
      exh.map(e => `<li>${esc(String(e.year || ""))} — ${esc(e.event || "")}</li>`).join("") + `</ul>`;
  }
  return html;
}

function contactsContent() {
  const socials = (contacts.socials || []).map(s => `<a href="${esc(s.href)}">${esc(s.label)}</a>`).join(" · ");
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

// Routes
const routes = [
  { path: "/", title: `${artistName} — ${site.role || "Visual & Sound Artist"}`, desc: site.statement || "", html: homeContent },
  { path: "/gallery", title: `Gallery — ${artistName}`, desc: "Artwork series and collections.", html: galleryContent },
  { path: "/sounds", title: `Sounds — ${artistName}`, desc: "Sound projects and performances.", html: soundsContent },
  { path: "/statement", title: `Statement — ${artistName}`, desc: statement.paragraphs?.[0] || "", html: statementContent },
  { path: "/contacts", title: `Contacts — ${artistName}`, desc: contacts.openToText || "Get in touch.", html: contactsContent },
  { path: "/impressum", title: `Impressum — ${artistName}`, desc: "Legal information.", html: impressumContent },
];

for (const s of series) {
  const intro = Array.isArray(s.intro) ? s.intro[0] : s.intro || "";
  routes.push({ path: `/gallery/${s.slug}`, title: `${s.title} — ${artistName}`, desc: intro.slice(0, 160), html: () => seriesContent(s) });
  for (const w of (s.works || [])) {
    routes.push({ path: `/gallery/${s.slug}/${w.slug}`, title: `${w.title} — ${s.title} — ${artistName}`,
      desc: `${w.title}, ${w.technique || ""}, ${w.year || ""}`.trim(), html: () => artworkContent(s, w) });
  }
}
for (const s of sounds) {
  routes.push({ path: `/sounds/${s.slug}`, title: `${s.title} — ${artistName}`, desc: s.summary || "", html: () => soundDetailContent(s) });
}

// Build
const indexHtml = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

function buildPage(route) {
  const title = esc(route.title);
  const desc = esc((route.desc || "").slice(0, 160));
  const canonical = `${DOMAIN}${route.path === "/" ? "" : route.path}`;
  const content = typeof route.html === "function" ? route.html() : "";

  let html = indexHtml;
  html = html.replace('<div id="root"></div>', `<div id="root">${headerHtml()}<main>${content}</main>${footerHtml()}</div>`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/,`$1${desc}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/,`$1${title}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/,`$1${desc}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/,`$1${canonical}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/,`$1${canonical}$2`);
  return html;
}

console.log("\n🔨 Pre-rendering...\n");
let count = 0;
for (const route of routes) {
  const html = buildPage(route);
  const dirPath = route.path === "/" ? DIST : path.join(DIST, route.path);
  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(route.path === "/" ? path.join(DIST, "index.html") : path.join(dirPath, "index.html"), html, "utf-8");
  count++;
  console.log(`  ✓ ${route.path}`);
}

const notFoundHtml = buildPage({ path: "/404", title: `Not Found — ${artistName}`, desc: "", html: () => `<h1>404</h1><p><a href="/">Back home</a></p>` });
fs.writeFileSync(path.join(DIST, "404.html"), notFoundHtml, "utf-8");
console.log(`  ✓ /404\n\n✅ ${count + 1} pages\n`);
