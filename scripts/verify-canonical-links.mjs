import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

// These paths are retained only as redirect targets for old inbound links.
// Public pages must link directly to their canonical destinations instead.
const legacyPaths = new Set([
  "/study",
  "/bcba-study-tools",
  "/behavior-study-tools",
  "/bcba-exam-prep",
  "/bcba-practice-exam",
  "/free-bcba-mock-exam",
  "/bcba-test-questions",
  "/bcba-exam-practice-questions",
  "/bcba-6th-edition-practice-questions",
  "/free-bcba-practice-exam",
  "/free-bcba-practice-test",
  "/bcba-mock-exam-6th-edition",
  "/bcba-mock-practice-test",
  "/free-bcba-mock-practice-test",
  "/school-based-bcba",
  "/bcbas-in-schools",
  "/values-goal-assistant-landing",
  "/iep-behavior-goals/widget",
  "/iep-goal-writer",
  "/school-based-behavior-support",
  "/community",
]);

const ignoredDirectories = new Set([".git", ".next", "node_modules"]);
const ignoredPathFragments = [
  `${path.sep}src${path.sep}app${path.sep}admin${path.sep}`,
  `${path.sep}src${path.sep}app${path.sep}api${path.sep}`,
  `${path.sep}src${path.sep}components${path.sep}admin${path.sep}`,
  `${path.sep}src${path.sep}app${path.sep}sitemap.ts`,
];

function collectFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(absolutePath));
    } else if (/\.(?:ts|tsx|md|mdx)$/.test(entry.name)) {
      files.push(absolutePath);
    }
  }
  return files;
}

function routeFromValue(value) {
  if (value.startsWith("/")) return value.split(/[?#]/, 1)[0].replace(/\/$/, "") || "/";
  try {
    const url = new URL(value);
    if (url.hostname !== "behaviorschool.com" && url.hostname !== "www.behaviorschool.com") return null;
    return url.pathname.replace(/\/$/, "") || "/";
  } catch {
    return null;
  }
}

const violations = [];
const literalUrlPattern = /(?:href|url|item|canonical|target)\s*[:=]\s*["'`]([^"'`]+)["'`]/g;

for (const file of collectFiles(path.join(root, "src")).concat(collectFiles(path.join(root, "content")))) {
  if (ignoredPathFragments.some((fragment) => file.includes(fragment))) continue;

  const relativePath = path.relative(root, file);
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(literalUrlPattern)) {
    const route = routeFromValue(match[1]);
    if (!route || !legacyPaths.has(route)) continue;
    const line = source.slice(0, match.index).split("\n").length;
    violations.push(`${relativePath}:${line} links to redirect-only route ${route}`);
  }
}

if (violations.length > 0) {
  console.error("Canonical-link check failed:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log("Canonical-link check passed: no public literal links target known redirects.");
