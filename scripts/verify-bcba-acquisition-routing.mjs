#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = join(root, "src");
const errors = [];
const expectedAcquisitionRedirects = new Map([
  ["/study", "https://behaviorstudytools.com/"],
  ["/bcba-study-tools", "https://behaviorstudytools.com/"],
  ["/bcba-exam-prep", "https://study.behaviorschool.com/free-practice/"],
  ["/bcba-practice-exam", "https://study.behaviorschool.com/free-mock-exam/"],
  ["/free-bcba-mock-exam", "https://study.behaviorschool.com/free-mock-exam/"],
  ["/bcba-test-questions", "https://study.behaviorschool.com/free-practice/"],
  ["/bcba-exam-practice-questions", "https://study.behaviorschool.com/free-practice/"],
  ["/bcba-6th-edition-practice-questions", "https://study.behaviorschool.com/free-practice/"],
  ["/free-bcba-practice-exam", "https://study.behaviorschool.com/free-practice/"],
  ["/bcba-mock-exam-6th-edition", "https://study.behaviorschool.com/free-mock-exam/"],
]);

const allowedAccountFlowFiles = new Set([
  "src/app/calaba40/page.tsx",
  "src/app/free-bcba-practice-test/FreePracticeTestWidget.tsx",
  "src/components/GuestResultsModal.tsx",
]);

function filesUnder(directory, extensions = new Set([".ts", ".tsx", ".js", ".jsx"])) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    const absolutePath = join(directory, entry);
    if (statSync(absolutePath).isDirectory()) {
      files.push(...filesUnder(absolutePath, extensions));
    } else if (extensions.has(extname(entry))) {
      files.push(absolutePath);
    }
  }
  return files;
}

function expect(condition, message) {
  if (!condition) errors.push(message);
}

for (const absolutePath of filesUnder(srcRoot)) {
  const path = relative(root, absolutePath);
  const contents = readFileSync(absolutePath, "utf8");

  expect(
    !contents.includes('behaviorStudyToolsAppHref("/onboarding/bcba"'),
    `${path} must use free practice or free mock instead of BCBA onboarding`
  );
  expect(
    !contents.includes('trackedStudyUrl("/onboarding/bcba"'),
    `${path} must use free practice or free mock instead of BCBA onboarding`
  );

  const isOperationalCode = path.startsWith("src/app/admin/") || path.startsWith("src/app/api/");
  const hasDirectAuthLink = contents.includes("https://study.behaviorschool.com/auth");
  if (hasDirectAuthLink && !isOperationalCode && !allowedAccountFlowFiles.has(path)) {
    errors.push(`${path} must not send public acquisition traffic directly to auth`);
  }
}

const helper = readFileSync(join(root, "src/lib/behavior-study-tools/links.ts"), "utf8");
expect(
  /path\s*=\s*["']\/free-practice\/["']/.test(helper),
  "The shared Behavior Study Tools URL helper must default to /free-practice/"
);

const marketingData = readFileSync(join(root, "src/data/behaviorStudyToolsMarketing.ts"), "utf8");
expect(
  marketingData.includes('trackedStudyUrl("/free-practice/"'),
  "Behavior Study Tools marketing data must include the canonical free-practice destination"
);
expect(
  marketingData.includes('trackedStudyUrl("/free-mock-exam/"'),
  "Behavior Study Tools marketing data must include the canonical free-mock destination"
);

const bcbaToolsPage = readFileSync(
  join(root, "src/app/bcba-study-tools/BCBAStudyToolsClient.tsx"),
  "utf8"
);
expect(
  !bcbaToolsPage.includes("/quiz/guest"),
  "The public BCBA study tools page must route acquisition traffic through /free-practice/"
);

const sitemapBodyPath = join(root, ".next/server/app/sitemap.xml.body");
expect(existsSync(sitemapBodyPath), "The production sitemap artifact must exist before routing verification");

const routesManifestPath = join(root, ".next/routes-manifest.json");
expect(existsSync(routesManifestPath), "The production routes manifest must exist before routing verification");

if (existsSync(routesManifestPath)) {
  const routesManifest = JSON.parse(readFileSync(routesManifestPath, "utf8"));
  for (const [source, destination] of expectedAcquisitionRedirects) {
    const redirect = routesManifest.redirects?.find((candidate) => candidate.source === source);
    expect(
      redirect?.destination === destination && redirect?.statusCode === 308,
      `${source} must permanently redirect to ${destination}`
    );
  }
}

if (existsSync(sitemapBodyPath)) {
  const sitemapBody = readFileSync(sitemapBodyPath, "utf8");
  const sitemapUrls = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const sitemapPaths = new Set(sitemapUrls.map((url) => new URL(url).pathname.replace(/\/$/, "") || "/"));
  for (const source of expectedAcquisitionRedirects.keys()) {
    expect(!sitemapPaths.has(source), `${source} must not remain in the sitemap after redirecting`);
  }
  const allowedStudyPaths = new Set([
    "/free-practice/",
    "/free-mock-exam/",
    "/support/",
    "/contact",
  ]);

  for (const sitemapUrl of sitemapUrls) {
    const pageUrl = new URL(sitemapUrl);
    const relativeHtmlPath = pageUrl.pathname === "/"
      ? "index.html"
      : `${pageUrl.pathname.replace(/^\//, "")}.html`;
    const htmlPath = join(root, ".next/server/app", relativeHtmlPath);
    if (!existsSync(htmlPath)) continue;

    const html = readFileSync(htmlPath, "utf8");
    const studyLinks = [...html.matchAll(/href=["'](https:\/\/study\.behaviorschool\.com[^"']*)/gi)]
      .map((match) => match[1].replaceAll("&amp;", "&"));

    for (const studyLink of new Set(studyLinks)) {
      const destination = new URL(studyLink);
      expect(
        allowedStudyPaths.has(destination.pathname),
        `${pageUrl.pathname} must not pass crawlable link equity to noncanonical study path ${destination.pathname}`
      );
    }
  }
}

for (const markdownPath of filesUnder(join(root, "content/blog"), new Set([".md"]))) {
  const contents = readFileSync(markdownPath, "utf8");
  expect(
    !contents.includes("](https://study.behaviorschool.com)"),
    `${relative(root, markdownPath)} must link to a canonical study acquisition page instead of the noindex root`
  );
}

if (errors.length > 0) {
  console.error("BCBA acquisition routing verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("BCBA acquisition routing verified: public CTAs use free practice or free mock.");
