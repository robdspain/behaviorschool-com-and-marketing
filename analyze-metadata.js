#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function getAllFiles(dir, ext = '.tsx') {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, ext));
    } else if (file === 'page.tsx') {
      results.push(filePath);
    }
  });

  return results;
}

const issues = {
  metaDescription: {
    tooLong: [],
    tooShort: [],
    missing: [],
  },
  title: {
    tooLong: [],
    tooShort: [],
  },
  h1: {
    missing: [],
    multiple: [],
  },
  openGraph: {
    incomplete: [],
    urlMismatch: [],
  },
};

function extractMetadata(content, filePath) {
  const result = {
    title: null,
    description: null,
    canonical: null,
    ogUrl: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    ogType: null,
    h1Count: 0,
  };

  // Extract title
  const titleMatch = content.match(/title:\s*["'](.+?)["']/);
  if (titleMatch) result.title = titleMatch[1];

  // Extract description (handle multi-line)
  const descMatch = content.match(/description:\s*\n?\s*["'](.+?)["']/s);
  if (descMatch) {
    result.description = descMatch[1].replace(/\s+/g, ' ').trim();
  }

  // Extract canonical URL
  const canonicalMatch = content.match(/canonical:\s*["']([^"']+?)["']/);
  if (canonicalMatch) result.canonical = canonicalMatch[1];

  // Extract OpenGraph data
  const ogUrlMatch = content.match(/openGraph:\s*{[^}]*?url:\s*["']([^"']+?)["']/s);
  if (ogUrlMatch) result.ogUrl = ogUrlMatch[1];

  const ogTitleMatch = content.match(/openGraph:\s*{[^}]*?title:\s*["'](.+?)["']/s);
  if (ogTitleMatch) result.ogTitle = ogTitleMatch[1];

  const ogDescMatch = content.match(/openGraph:\s*{[^}]*?description:\s*["'](.+?)["']/s);
  if (ogDescMatch) result.ogDescription = ogDescMatch[1];

  const ogImageMatch = content.match(/openGraph:\s*{[^}]*?images:/s);
  result.ogImage = !!ogImageMatch;

  const ogTypeMatch = content.match(/openGraph:\s*{[^}]*?type:\s*["']([^"']+?)["']/s);
  if (ogTypeMatch) result.ogType = ogTypeMatch[1];

  // Count H1 tags
  const h1Matches = content.match(/<h1[\s>]/g);
  if (h1Matches) result.h1Count = h1Matches.length;

  return result;
}

const srcAppDir = path.join(__dirname, 'src', 'app');
const pageFiles = getAllFiles(srcAppDir);

console.log(`\nAnalyzing ${pageFiles.length} page files...\n`);

pageFiles.forEach((fullPath) => {
  const file = path.relative(__dirname, fullPath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const metadata = extractMetadata(content, file);

  // Check meta description
  if (metadata.description) {
    const len = metadata.description.length;
    if (len > 160) {
      issues.metaDescription.tooLong.push({ file, len, desc: metadata.description });
    } else if (len < 120) {
      issues.metaDescription.tooShort.push({ file, len, desc: metadata.description });
    }
  } else {
    issues.metaDescription.missing.push({ file });
  }

  // Check title
  if (metadata.title) {
    const len = metadata.title.length;
    if (len > 70) {
      issues.title.tooLong.push({ file, len, title: metadata.title });
    } else if (len < 30) {
      issues.title.tooShort.push({ file, len, title: metadata.title });
    }
  }

  // Check H1
  if (metadata.h1Count === 0) {
    issues.h1.missing.push({ file });
  } else if (metadata.h1Count > 1) {
    issues.h1.multiple.push({ file, count: metadata.h1Count });
  }

  // Check OpenGraph
  const hasAllOgTags = metadata.ogTitle && metadata.ogDescription && metadata.ogImage && metadata.ogUrl && metadata.ogType;
  if (!hasAllOgTags) {
    issues.openGraph.incomplete.push({
      file,
      missing: {
        title: !metadata.ogTitle,
        description: !metadata.ogDescription,
        image: !metadata.ogImage,
        url: !metadata.ogUrl,
        type: !metadata.ogType,
      }
    });
  }

  // Check OG URL vs canonical
  if (metadata.ogUrl && metadata.canonical && metadata.ogUrl !== metadata.canonical) {
    issues.openGraph.urlMismatch.push({ file, ogUrl: metadata.ogUrl, canonical: metadata.canonical });
  }
});

// Report results
console.log('=== META DESCRIPTION ISSUES ===\n');
console.log(`Too Long (>160 chars): ${issues.metaDescription.tooLong.length}`);
issues.metaDescription.tooLong.slice(0, 10).forEach(({ file, len }) => {
  console.log(`  ${file} (${len} chars)`);
});
if (issues.metaDescription.tooLong.length > 10) {
  console.log(`  ... and ${issues.metaDescription.tooLong.length - 10} more`);
}

console.log(`\nToo Short (<120 chars): ${issues.metaDescription.tooShort.length}`);
issues.metaDescription.tooShort.slice(0, 10).forEach(({ file, len }) => {
  console.log(`  ${file} (${len} chars)`);
});
if (issues.metaDescription.tooShort.length > 10) {
  console.log(`  ... and ${issues.metaDescription.tooShort.length - 10} more`);
}

console.log(`\nMissing: ${issues.metaDescription.missing.length}`);
issues.metaDescription.missing.forEach(({ file }) => {
  console.log(`  ${file}`);
});

console.log('\n=== TITLE ISSUES ===\n');
console.log(`Too Long (>70 chars): ${issues.title.tooLong.length}`);
issues.title.tooLong.slice(0, 10).forEach(({ file, len }) => {
  console.log(`  ${file} (${len} chars)`);
});
if (issues.title.tooLong.length > 10) {
  console.log(`  ... and ${issues.title.tooLong.length - 10} more`);
}

console.log(`\nToo Short (<30 chars): ${issues.title.tooShort.length}`);
issues.title.tooShort.forEach(({ file, len }) => {
  console.log(`  ${file} (${len} chars)`);
});

console.log('\n=== H1 ISSUES ===\n');
console.log(`Missing H1: ${issues.h1.missing.length}`);
issues.h1.missing.forEach(({ file }) => {
  console.log(`  ${file}`);
});

console.log(`\nMultiple H1s: ${issues.h1.multiple.length}`);
issues.h1.multiple.forEach(({ file, count }) => {
  console.log(`  ${file} (${count} H1 tags)`);
});

console.log('\n=== OPEN GRAPH ISSUES ===\n');
console.log(`Incomplete OG Tags: ${issues.openGraph.incomplete.length}`);
issues.openGraph.incomplete.slice(0, 10).forEach(({ file, missing }) => {
  const missingTags = Object.entries(missing).filter(([, v]) => v).map(([k]) => k);
  console.log(`  ${file}: Missing ${missingTags.join(', ')}`);
});
if (issues.openGraph.incomplete.length > 10) {
  console.log(`  ... and ${issues.openGraph.incomplete.length - 10} more`);
}

console.log(`\nOG URL Mismatch: ${issues.openGraph.urlMismatch.length}`);
issues.openGraph.urlMismatch.forEach(({ file }) => {
  console.log(`  ${file}`);
});

console.log('\n=== SUMMARY ===\n');
const totalIssues =
  issues.metaDescription.tooLong.length +
  issues.metaDescription.tooShort.length +
  issues.metaDescription.missing.length +
  issues.title.tooLong.length +
  issues.title.tooShort.length +
  issues.h1.missing.length +
  issues.h1.multiple.length +
  issues.openGraph.incomplete.length +
  issues.openGraph.urlMismatch.length;

console.log(`Total Issues Found: ${totalIssues}`);
console.log(`  Meta Descriptions: ${issues.metaDescription.tooLong.length + issues.metaDescription.tooShort.length + issues.metaDescription.missing.length}`);
console.log(`  Titles: ${issues.title.tooLong.length + issues.title.tooShort.length}`);
console.log(`  H1 Tags: ${issues.h1.missing.length + issues.h1.multiple.length}`);
console.log(`  Open Graph: ${issues.openGraph.incomplete.length + issues.openGraph.urlMismatch.length}`);

// Write detailed report to file
fs.writeFileSync('seo-issues-report.json', JSON.stringify(issues, null, 2));
console.log('\nDetailed report saved to: seo-issues-report.json');
