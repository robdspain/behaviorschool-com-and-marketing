const fs = require("fs");
const cp = require("child_process");

function sh(cmd) {
  return cp.execSync(cmd, { encoding: "utf8" }).trim();
}

const MAX_TITLE = 70;
const MIN_TITLE = 50;
const MAX_DESC = 160;
const MIN_DESC = 120;

function stripEmojis(str) {
  // Basic emoji removal
  return str.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\u2600-\u27BF]/gu, "").replace(/\s{2,}/g, " ").trim();
}

function smartTrim(str, max) {
  if (str.length <= max) return str;
  let s = str.slice(0, max + 1);
  // prefer cutting at punctuation or space
  const p = Math.max(s.lastIndexOf("."), s.lastIndexOf("!"), s.lastIndexOf("?"));
  const sp = s.lastIndexOf(" ");
  const cut = p > 40 ? p : sp > 40 ? sp : max;
  s = s.slice(0, cut).trim().replace(/[\.,;:!?-]+$/g, "");
  return s + ".";
}

function maybeAppendBrand(title) {
  if (/\bBehavior School\b/.test(title)) return title;
  const withBrand = `${title} | Behavior School`;
  if (withBrand.length <= MAX_TITLE) return withBrand;
  return title; // skip if it would exceed max
}

function syncField(objText, key, value) {
  // Replace first occurrence of key: "..." or key: `...`
  const dq = new RegExp(`(\\b${key}\\s*:\\s*")([\"\\n\\r]*?)(")`);
  const sq = new RegExp(`(\\b${key}\\s*:\\s*')([^'\\n\\r]*?)(')`);
  const bt = new RegExp(`(\\b${key}\\s*:\\s*\`)([^\`\\n\\r]*?)(\`)`);
  if (dq.test(objText)) return objText.replace(dq, `$1${value}$3`);
  if (sq.test(objText)) return objText.replace(sq, `$1${value}$3`);
  if (bt.test(objText)) return objText.replace(bt, `$1${value}$3`);
  // If key not present, insert near start
  return objText.replace(/\{/, `{\n  ${key}: "${value}",`);
}

function ensureOpenGraph(metadataText, title, description, canonicalUrl) {
  if (/openGraph\s*:\s*\{/.test(metadataText)) {
    // Update existing OG title/description/url
    metadataText = metadataText.replace(/openGraph\s*:\s*\{([\s\S]*?)\}/, (m, inner) => {
      let block = inner;
      block = syncField(block, "title", title);
      block = syncField(block, "description", description);
      if (canonicalUrl) block = syncField(block, "url", canonicalUrl);
      return `openGraph: {${block}}`;
    });
  } else {
    // Add OG block after description or at top
    const og = `openGraph: {\n    title: "${title}",\n    description: "${description}",\n    type: "website",\n    ${canonicalUrl ? `url: "${canonicalUrl}",\n    ` : ""}images: [{ url: "/optimized/og-image.webp", width: 1200, height: 630, alt: "${title}" }]\n  },`;
    metadataText = metadataText.replace(/(description\s*:\s*[\s\S]*?[,}])/, (m) => m.replace(/\}\s*$/, ",") + "\n  " + og);
  }
  return metadataText;
}

function ensureTwitter(metadataText, title, description) {
  if (/twitter\s*:\s*\{/.test(metadataText)) {
    metadataText = metadataText.replace(/twitter\s*:\s*\{([\s\S]*?)\}/, (m, inner) => {
      let block = inner;
      block = syncField(block, "title", title);
      block = syncField(block, "description", description);
      return `twitter: {${block}}`;
    });
  } else {
    const tw = `twitter: {\n    card: "summary_large_image",\n    title: "${title}",\n    description: "${description}",\n    images: ["/optimized/og-image.webp"],\n  },`;
    metadataText = metadataText.replace(/(openGraph\s*:\s*\{[\s\S]*?\},?)/, `$1\n  ${tw}`);
  }
  return metadataText;
}

function processFile(f) {
  let s = fs.readFileSync(f, "utf8");
  if (!/export\s+const\s+metadata\s*:\s*Metadata\s*=\s*\{/.test(s) && !/export\s+const\s+metadata\s*=\s*\{/.test(s)) return null;

  // Extract metadata object text
  const metaStart = s.indexOf("export const metadata");
  const braceStart = s.indexOf("{", metaStart);
  let i = braceStart, depth = 0;
  for (; i < s.length; i++) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}") { depth--; if (depth === 0) { i++; break; } }
  }
  if (depth !== 0) return null;
  const metaText = s.slice(braceStart, i);

  // Find title/description
  const titleMatch = metaText.match(/\btitle\s*:\s*(?:`([^`]+)`|"([^"]+)"|'([^']+)')/);
  const descMatch = metaText.match(/\bdescription\s*:\s*(?:`([^`]+)`|"([^"]+)"|'([^']+)')/);
  let title = titleMatch ? (titleMatch[1] || titleMatch[2] || titleMatch[3] || "").trim() : null;
  let description = descMatch ? (descMatch[1] || descMatch[2] || descMatch[3] || "").trim() : null;

  // Canonical URL if present
  const canonMatch = metaText.match(/alternates\s*:\s*\{[\s\S]*?canonical\s*:\s*(?:`([^`]+)`|"([^"]+)"|'([^']+)')/);
  const canonicalUrl = canonMatch ? (canonMatch[1] || canonMatch[2] || canonMatch[3] || "").trim() : null;

  let changed = false;
  if (title) {
    const originalTitle = title;
    title = stripEmojis(title);
    if (title.length > MAX_TITLE) {
      // Remove trailing brand if present before trimming
      title = title.replace(/\s*\|\s*Behavior School\s*$/, "");
      if (title.length > MAX_TITLE) title = smartTrim(title, 60).replace(/\.$/, "");
    } else if (title.length < MIN_TITLE) {
      const t2 = maybeAppendBrand(title);
      if (t2 !== title) title = t2;
    }
    if (title !== originalTitle) {
      let newMetaText = metaText;
      newMetaText = syncField(newMetaText, "title", title);
      // Keep OG/Twitter in sync later
      s = s.slice(0, braceStart) + newMetaText + s.slice(i);
      changed = true;
    }
  }

  if (description) {
    const originalDesc = description;
    if (description.length > MAX_DESC) description = smartTrim(description, 160);
    else if (description.length < MIN_DESC) {
      // leave as-is; we can't safely expand content
    }
    if (description !== originalDesc) {
      let newMetaText = s.slice(braceStart, i);
      newMetaText = syncField(newMetaText, "description", description);
      s = s.slice(0, braceStart) + newMetaText + s.slice(i);
      changed = true;
    }
  }

  // Re-extract updated metadata text
  const braceStart2 = s.indexOf("{", s.indexOf("export const metadata"));
  let j = braceStart2, d2 = 0;
  for (; j < s.length; j++) {
    if (s[j] === "{") d2++;
    else if (s[j] === "}") { d2--; if (d2 === 0) { j++; break; } }
  }
  let metaText2 = s.slice(braceStart2, j);

  // Keep OG/Twitter synced and add OG if missing
  if (title || description) {
    const finalTitle = title || (metaText2.match(/\btitle\s*:\s*(?:`([^`]+)`|"([^"]+)"|'([^']+)')/) || [])[1];
    const finalDesc = description || (metaText2.match(/\bdescription\s*:\s*(?:`([^`]+)`|"([^"]+)"|'([^']+)')/) || [])[1];
    if (finalTitle && finalDesc) {
      const before = metaText2;
      metaText2 = ensureOpenGraph(metaText2, finalTitle, finalDesc, canonicalUrl);
      metaText2 = ensureTwitter(metaText2, finalTitle, finalDesc);
      if (metaText2 !== before) {
        s = s.slice(0, braceStart2) + metaText2 + s.slice(j);
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(f, s);
    return true;
  }
  return false;
}

const files = sh("rg --files src/app | rg /page\\.tsx$ ").split(/\n/).filter(Boolean);
let changedCount = 0;
for (const f of files) {
  try {
    if (processFile(f)) changedCount++;
  } catch (e) {
    // ignore parse errors
  }
}
console.log(`Updated files: ${changedCount}`);

