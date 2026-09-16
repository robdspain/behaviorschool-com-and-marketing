#!/usr/bin/env node
// Checks every prerendered page in the production sitemap for <title> hygiene:
//  - 60 characters or fewer
//  - carries the brand as "Behavior School" (two words). "BehaviorSchool" is
//    reserved for product names and must not be used as the title suffix.
//  - no " - Behavior School" or " | BehaviorSchool" suffix variants
// Runs in postbuild against .next output, so CMS-driven routes (blog posts)
// that are rendered on demand are not covered here.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_TITLE_LENGTH = 60;
const errors = [];

const sitemapBodyPath = join(root, ".next/server/app/sitemap.xml.body");
if (!existsSync(sitemapBodyPath)) {
  console.error("Title hygiene check needs the production sitemap artifact (.next/server/app/sitemap.xml.body).");
  process.exit(1);
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

const sitemapBody = readFileSync(sitemapBodyPath, "utf8");
const sitemapUrls = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
let checked = 0;

for (const sitemapUrl of sitemapUrls) {
  const pathname = new URL(sitemapUrl).pathname;
  const relativeHtmlPath = pathname === "/" ? "index.html" : `${pathname.replace(/^\//, "")}.html`;
  const htmlPath = join(root, ".next/server/app", relativeHtmlPath);
  if (!existsSync(htmlPath)) continue;

  const html = readFileSync(htmlPath, "utf8");
  const match = html.match(/<title>([^<]*)<\/title>/);
  if (!match) {
    errors.push(`${pathname}: no <title> rendered`);
    continue;
  }
  checked += 1;
  const title = decodeEntities(match[1]).trim();

  if (title.length > MAX_TITLE_LENGTH) {
    errors.push(`${pathname}: title is ${title.length} chars (max ${MAX_TITLE_LENGTH}): "${title}"`);
  }
  if (!/Behavior School/.test(title)) {
    errors.push(`${pathname}: title must include the brand as "Behavior School": "${title}"`);
  }
  if (/\|\s*BehaviorSchool\s*$/.test(title) || /\s-\s*Behavior School\s*$/.test(title)) {
    errors.push(`${pathname}: use the " | Behavior School" suffix: "${title}"`);
  }
}

if (errors.length > 0) {
  console.error("Title hygiene check failed:");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Title hygiene verified: ${checked} prerendered titles are ${MAX_TITLE_LENGTH} chars or fewer and use "Behavior School".`);
