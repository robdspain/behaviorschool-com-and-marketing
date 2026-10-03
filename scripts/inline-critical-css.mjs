import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import Critters from "critters";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appDir = path.join(root, ".next", "server", "app");
const requiredPages = ["index.html", "transformation-program.html"];

function blockingStylesheetTags(html) {
  const withoutNoscript = html.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "");
  return [...withoutNoscript.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => {
      if (!/\brel\s*=\s*["']stylesheet["']/i.test(tag)) return false;
      const media = tag.match(/\bmedia\s*=\s*["']([^"']+)["']/i);
      return !media || media[1].toLowerCase() !== "print";
    });
}

function inlineStyleText(html) {
  return [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1])
    .join("");
}

async function collectHtmlFiles(directory) {
  const files = [];
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") return files;
    throw error;
  }
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(absolutePath)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(absolutePath);
    }
  }
  return files;
}

const critters = new Critters({
  path: path.join(root, ".next"),
  publicPath: "/_next/",
  preload: "media",
  fonts: false,
  pruneSource: false,
  reduceInlineStyles: false,
  logLevel: "warn",
});

const htmlFiles = await collectHtmlFiles(appDir);
if (htmlFiles.length === 0) {
  console.error("inline-critical-css: no prerendered HTML under .next/server/app");
  process.exit(1);
}

let processed = 0;
let skipped = 0;
const failures = [];

for (const filePath of htmlFiles) {
  const html = await readFile(filePath, "utf8");
  if (!/<link\b[^>]*rel\s*=\s*["']stylesheet["']/i.test(html)) {
    skipped += 1;
    continue;
  }
  try {
    const nextHtml = (await critters.process(html)).replaceAll(" data-critters-container", "");
    await writeFile(filePath, nextHtml);
    processed += 1;
  } catch (error) {
    failures.push(`${path.relative(root, filePath)}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log(
  `inline-critical-css: processed ${processed}, skipped ${skipped}, failed ${failures.length}, scanned ${htmlFiles.length}`,
);

for (const failure of failures) {
  console.error(`inline-critical-css: ${failure}`);
}

const cssDir = path.join(root, ".next", "static", "css");
try {
  const cssFiles = (await readdir(cssDir)).filter((name) => name.endsWith(".css"));
  for (const name of cssFiles) {
    const bytes = await readFile(path.join(cssDir, name));
    console.log(
      `inline-critical-css: stylesheet ${name} raw=${bytes.length} gzip=${gzipSync(bytes).length}`,
    );
  }
} catch (error) {
  console.error(`inline-critical-css: could not measure CSS files: ${error instanceof Error ? error.message : String(error)}`);
}

let exitCode = failures.length > 0 ? 1 : 0;
for (const page of requiredPages) {
  const filePath = path.join(appDir, page);
  let html;
  try {
    html = await readFile(filePath, "utf8");
  } catch {
    console.error(`inline-critical-css: missing ${page}`);
    exitCode = 1;
    continue;
  }
  const blocking = blockingStylesheetTags(html);
  const inlined = inlineStyleText(html);
  console.log(
    `inline-critical-css: ${page} inline_style_raw=${inlined.length} inline_style_gzip=${gzipSync(inlined).length} blocking_stylesheets=${blocking.length} stylesheet_links=${[...html.matchAll(/<link\b[^>]*rel\s*=\s*["']stylesheet["'][^>]*>/gi)].length}`,
  );
  if (blocking.length > 0 || inlined.length < 500) {
    console.error(`inline-critical-css: ${page} still has a render-blocking stylesheet or almost no inlined CSS`);
    exitCode = 1;
  }
}

process.exit(exitCode);
