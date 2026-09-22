import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

test("the public masterclass route is deleted so it cannot serve a free-CEU claim", () => {
  assert.equal(existsSync(path.join(root, "src/app/masterclass")), false);
  assert.equal(existsSync(path.join(root, "src/app/api/masterclass/enroll/route.ts")), false);
  assert.equal(
    existsSync(path.join(root, "src/app/api/masterclass/[...slug]/route.ts")),
    true,
  );
});

test("Next.js, Netlify, and middleware permanently send /masterclass to /ceus", async () => {
  const nextConfig = await readFile(path.join(root, "next.config.ts"), "utf8");
  const netlify = await readFile(path.join(root, "netlify.toml"), "utf8");
  const redirects = await readFile(path.join(root, "public/_redirects"), "utf8");
  const middleware = await readFile(path.join(root, "middleware.ts"), "utf8");

  assert.match(nextConfig, /source:\s*'\/masterclass'/);
  assert.match(nextConfig, /destination:\s*'\/ceus'/);
  assert.match(nextConfig, /source:\s*'\/masterclass\/:path\*'/);
  assert.match(nextConfig, /statusCode:\s*301/);

  assert.match(netlify, /from = "\/masterclass"/);
  assert.match(netlify, /to = "\/ceus"/);
  assert.match(netlify, /from = "\/masterclass\/\*"/);
  assert.match(netlify, /status = 301/);

  assert.match(redirects, /\/masterclass \/ceus 301!/);
  assert.match(redirects, /\/masterclass\/\* \/ceus 301!/);

  assert.match(middleware, /isRetiredMasterclassPath/);
  assert.match(middleware, /NextResponse\.redirect\(new URL\('\/ceus', request\.url\), 301\)/);
});

test("sitemap and admin sitemap no longer treat /masterclass as a live public page", async () => {
  const sitemap = await readFile(path.join(root, "src/app/sitemap.ts"), "utf8");
  const adminSitemap = await readFile(path.join(root, "src/app/admin/sitemap/page.tsx"), "utf8");

  assert.match(sitemap, /'\/masterclass'/);
  assert.match(sitemap, /legacyRedirectPaths/);
  assert.equal(adminSitemap.includes("path: '/masterclass'"), false);
  assert.equal(adminSitemap.includes("path: '/masterclass/enroll'"), false);
});
