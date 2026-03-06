#!/usr/bin/env node
/**
 * optimize-images.js
 * 
 * Creates optimized thumbnail versions of all images in client/public/images/
 * Original files are kept for zoom/full-res viewing.
 * Thumbnails get a -thumb suffix: fkb-01.jpg → fkb-01-thumb.jpg
 * 
 * Usage: node scripts/optimize-images.js
 * Requires: npm install sharp --save-dev
 */

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const IMAGES_DIR = path.resolve("client/public/images");
const THUMB_MAX_WIDTH = 1600;
const THUMB_QUALITY = 80;
const EXTENSIONS = [".jpg", ".jpeg", ".png"];

// Skip files that are already thumbnails or details
function shouldProcess(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes("-thumb")) return false;
  const ext = path.extname(lower);
  return EXTENSIONS.includes(ext);
}

async function processFile(filePath) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const thumbPath = path.join(dir, `${base}-thumb${ext}`);

  // Skip if thumb already exists and is newer than original
  if (fs.existsSync(thumbPath)) {
    const origStat = fs.statSync(filePath);
    const thumbStat = fs.statSync(thumbPath);
    if (thumbStat.mtimeMs >= origStat.mtimeMs) {
      return { skipped: true, path: filePath };
    }
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Only resize if wider than threshold
    if (metadata.width && metadata.width > THUMB_MAX_WIDTH) {
      await image
        .resize(THUMB_MAX_WIDTH, null, { withoutEnlargement: true })
        .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
        .toFile(thumbPath);
    } else {
      // Still recompress even if small enough
      await image
        .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
        .toFile(thumbPath);
    }

    const origSize = fs.statSync(filePath).size;
    const thumbSize = fs.statSync(thumbPath).size;
    const saved = Math.round((1 - thumbSize / origSize) * 100);

    return { skipped: false, path: filePath, origSize, thumbSize, saved };
  } catch (err) {
    return { skipped: false, path: filePath, error: err.message };
  }
}

function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (shouldProcess(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Directory not found: ${IMAGES_DIR}`);
    process.exit(1);
  }

  const files = walkDir(IMAGES_DIR);
  console.log(`\n🖼️  Optimizing ${files.length} images...\n`);

  let totalOrigSize = 0;
  let totalThumbSize = 0;
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const result = await processFile(file);
    const rel = path.relative(IMAGES_DIR, file);

    if (result.skipped) {
      skipped++;
      console.log(`  ⏭️  ${rel} (up to date)`);
    } else if (result.error) {
      errors++;
      console.log(`  ❌ ${rel}: ${result.error}`);
    } else {
      processed++;
      totalOrigSize += result.origSize;
      totalThumbSize += result.thumbSize;
      console.log(`  ✓  ${rel}  ${formatBytes(result.origSize)} → ${formatBytes(result.thumbSize)}  (-${result.saved}%)`);
    }
  }

  console.log(`\n✅ Done: ${processed} optimized, ${skipped} skipped, ${errors} errors`);
  if (processed > 0) {
    console.log(`   Total: ${formatBytes(totalOrigSize)} → ${formatBytes(totalThumbSize)} (-${Math.round((1 - totalThumbSize / totalOrigSize) * 100)}%)\n`);
  }
}

main();
