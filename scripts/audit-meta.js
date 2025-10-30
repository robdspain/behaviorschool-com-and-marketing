const fs = require("fs");
const cp = require("child_process");

function sh(cmd) {
  return cp.execSync(cmd, { encoding: "utf8" }).trim();
}

const pageFiles = sh("rg --files src/app | rg /page\\.tsx$ ")
  .split(/\n/)
  .filter(Boolean)
  .sort();

const results = [];
for (const f of pageFiles) {
  const s = fs.readFileSync(f, "utf8");
  const hasMeta = /export\s+const\s+metadata/.test(s);
  let title = null,
    desc = null;
  const titleMatch = [...s.matchAll(/\btitle:\s*`([^`]+)`|\btitle:\s*"([^"]+)"|\btitle:\s*'([^']+)'/g)];
  const descMatch = [...s.matchAll(/\bdescription:\s*`([^`]+)`|\bdescription:\s*"([^"]+)"|\bdescription:\s*'([^']+)'/g)];
  if (titleMatch.length) title = titleMatch[0][1] || titleMatch[0][2] || titleMatch[0][3] || "";
  if (descMatch.length) desc = descMatch[0][1] || descMatch[0][2] || descMatch[0][3] || "";
  results.push({
    f,
    hasMeta,
    titleLen: title ? title.length : 0,
    title,
    descLen: desc ? desc.length : 0,
    hasTitle: !!title,
    hasDesc: !!desc,
  });
}

function list(label, arr) {
  console.log(`\n-- ${label} (${arr.length})`);
  for (const r of arr) console.log(`${r.f} | TL=${r.titleLen} DL=${r.descLen}`);
}

const tooLongTitle = results.filter((r) => r.titleLen > 70);
const tooShortTitle = results.filter((r) => r.titleLen > 0 && r.titleLen < 50);
const missingTitle = results.filter((r) => !r.hasTitle);
const tooLongDesc = results.filter((r) => r.descLen > 160);
const tooShortDesc = results.filter((r) => r.descLen > 0 && r.descLen < 120);
const missingDesc = results.filter((r) => !r.hasDesc);

list("Titles >70", tooLongTitle);
list("Titles <50 (but present)", tooShortTitle);
list("Missing title", missingTitle);
list("Descriptions >160", tooLongDesc);
list("Descriptions <120 (but present)", tooShortDesc);
list("Missing description", missingDesc);

