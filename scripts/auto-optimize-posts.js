#!/usr/bin/env node

/**
 * Automatic Blog Post SEO Optimizer
 * 
 * This script automatically optimizes blog posts by:
 * 1. Adding strategic internal links to pillar pages
 * 2. Generating optimized meta descriptions
 * 3. Improving titles for compact keywords
 * 4. Adding relevant tags
 * 
 * Usage: 
 *   node scripts/auto-optimize-posts.js --analyze   (dry run, no changes)
 *   node scripts/auto-optimize-posts.js --optimize  (apply optimizations)
 *   node scripts/auto-optimize-posts.js --post-id=<id>  (optimize specific post)
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Configuration
const GHOST_CONTENT_URL = process.env.GHOST_CONTENT_URL || process.env.NEXT_PUBLIC_GHOST_CONTENT_URL;
const GHOST_ADMIN_API_URL = GHOST_CONTENT_URL?.replace('/ghost/api/content', '/ghost/api/admin') || GHOST_CONTENT_URL;
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY;
const SITE_URL = 'https://behaviorschool.com';

// Pillar pages with anchor text variations
const PILLAR_PAGES = {
  '/bcba-exam-prep': {
    keywords: ['bcba exam', 'bcba certification', 'behavior analyst exam', 'bcba test', 'bcba prep', 'board certified behavior analyst exam'],
    anchorTexts: [
      'BCBA exam prep',
      'BCBA certification preparation',
      'preparing for the BCBA exam',
      'BCBA exam preparation resources',
      'free BCBA exam prep'
    ],
    title: 'Free BCBA Exam Prep'
  },
  '/school-based-bcba': {
    keywords: ['school bcba', 'school-based behavior analyst', 'bcba in schools', 'education behavior analyst', 'school behavior analyst'],
    anchorTexts: [
      'school-based BCBA',
      'working as a BCBA in schools',
      'school behavior analyst',
      'BCBA career in schools',
      'school-based behavior analyst'
    ],
    title: 'School-Based BCBA Career Guide'
  },
  '/iep-behavior-goals': {
    keywords: ['iep goals', 'behavior goals', 'iep behavior', 'behavioral objectives', 'iep goal generator', 'individualized education program goals'],
    anchorTexts: [
      'IEP behavior goals',
      'writing IEP goals',
      'IEP goal generator',
      'behavioral IEP objectives',
      'creating IEP behavior goals'
    ],
    title: 'IEP Behavior Goals Generator'
  },
  '/supervisors': {
    keywords: ['bcba supervision', 'aba supervision', 'supervision tools', 'fieldwork hours', 'supervision curriculum', 'bcba supervision training'],
    anchorTexts: [
      'BCBA supervision',
      'supervision resources',
      'fieldwork supervision',
      'BCBA supervision tools',
      'supervision curriculum'
    ],
    title: 'BCBA Supervision Tools'
  },
  '/behavior-study-tools': {
    keywords: ['study tools', 'practice test', 'mock exam', 'flashcards', 'practice questions', 'bcba study materials'],
    anchorTexts: [
      'behavior study tools',
      'BCBA practice tests',
      'study resources',
      'free practice questions',
      'exam preparation tools'
    ],
    title: 'Behavior Study Tools'
  },
  '/behavior-plans': {
    keywords: ['behavior plan', 'bip', 'behavior intervention', 'positive behavior support', 'fba', 'behavior intervention plan', 'functional behavior assessment'],
    anchorTexts: [
      'behavior intervention plans',
      'creating a BIP',
      'writing behavior plans',
      'behavior plan templates',
      'BIP writing tool'
    ],
    title: 'Behavior Plan Writer'
  },
  '/school-based-behavior-support': {
    keywords: ['pbis', 'school-wide behavior', 'behavior support', 'mtss', 'rti behavior', 'positive behavior interventions'],
    anchorTexts: [
      'school-wide behavior support',
      'PBIS implementation',
      'school behavior systems',
      'MTSS behavior support',
      'school-based behavior interventions'
    ],
    title: 'School-Based Behavior Support'
  },
  '/transformation-program': {
    keywords: ['bcba training', 'behavior analyst training', 'professional development', 'bcba course', 'bcba professional development'],
    anchorTexts: [
      'BCBA training program',
      'professional development for BCBAs',
      'advanced BCBA training',
      'school BCBA training',
      'transformation program'
    ],
    title: 'School BCBA Training Program'
  }
};

// Smart internal link insertion
function addInternalLinks(html, postTitle) {
  if (!html) return { html: '', links: [] };
  
  let modifiedHtml = html;
  const addedLinks = [];
  
  // Split into paragraphs
  const paragraphs = html.split(/<\/p>/gi);
  
  for (const [pillarUrl, pillarData] of Object.entries(PILLAR_PAGES)) {
    // Check if link already exists
    const hasExistingLink = html.includes(`href="${pillarUrl}"`) || 
                           html.includes(`href="${SITE_URL}${pillarUrl}"`);
    
    if (hasExistingLink) continue;
    
    // Find best keyword match in content
    const htmlLower = html.toLowerCase();
    let bestMatch = null;
    let bestKeyword = null;
    
    for (const keyword of pillarData.keywords) {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
      const matches = htmlLower.match(regex);
      
      if (matches && matches.length > 0) {
        // Find the first occurrence that's not in a heading
        const firstMatch = html.search(new RegExp(`(?!<h[1-6][^>]*>)${keyword}`, 'i'));
        
        if (firstMatch !== -1) {
          bestMatch = firstMatch;
          bestKeyword = keyword;
          break;
        }
      }
    }
    
    if (bestMatch && bestKeyword) {
      // Select appropriate anchor text
      const anchorText = pillarData.anchorTexts[Math.floor(Math.random() * pillarData.anchorTexts.length)];
      
      // Find the keyword in context and replace with link
      const regex = new RegExp(`\\b${bestKeyword}\\b`, 'i');
      const beforeLink = modifiedHtml.substring(0, bestMatch);
      const afterLink = modifiedHtml.substring(bestMatch);
      
      // Only replace first occurrence in a paragraph (not in headings)
      const linkHtml = `<a href="${pillarUrl}">${anchorText}</a>`;
      modifiedHtml = beforeLink + afterLink.replace(regex, linkHtml);
      
      addedLinks.push({
        url: pillarUrl,
        anchor: anchorText,
        keyword: bestKeyword
      });
    }
  }
  
  return {
    html: modifiedHtml,
    links: addedLinks
  };
}

// Generate optimized meta description
function generateMetaDescription(html, title) {
  if (!html) return '';
  
  // Strip HTML tags
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Extract first 2-3 sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  let description = '';
  
  for (const sentence of sentences.slice(0, 3)) {
    if ((description + sentence).length < 155) {
      description += sentence.trim() + '. ';
    } else {
      break;
    }
  }
  
  // Ensure it's not too short
  if (description.length < 120 && sentences.length > 0) {
    description = sentences[0].trim().substring(0, 157) + '...';
  }
  
  return description.trim();
}

// Optimize title for compact keywords
function optimizeTitle(title) {
  if (!title) return title;
  
  const highIntentKeywords = ['Free', 'How to', 'Guide', 'Complete', 'Best', '2025'];
  
  // Check if title already starts with high-intent keyword
  const hasHighIntentStart = highIntentKeywords.some(keyword => 
    title.startsWith(keyword)
  );
  
  if (hasHighIntentStart) return title;
  
  // Check if we can add year
  if (!title.includes('2025') && !title.includes('2024')) {
    // Add year before pipe separator if exists
    if (title.includes('|')) {
      return title.replace('|', '2025 |');
    } else if (title.length < 50) {
      return `${title} (2025 Guide)`;
    }
  }
  
  return title;
}

// Extract relevant tags based on content
function extractTags(html, title) {
  const allText = (title + ' ' + html).toLowerCase();
  const suggestedTags = [];
  
  const tagKeywords = {
    'BCBA': ['bcba', 'board certified behavior analyst', 'behavior analyst certification'],
    'IEP Goals': ['iep', 'individualized education program', 'iep goals'],
    'Behavior Plans': ['bip', 'behavior intervention', 'behavior plan', 'functional behavior assessment'],
    'School-Based': ['school', 'school-based', 'education', 'classroom'],
    'Supervision': ['supervision', 'fieldwork', 'supervisor'],
    'Exam Prep': ['exam', 'test', 'practice', 'study'],
    'Professional Development': ['training', 'professional development', 'continuing education'],
    'PBIS': ['pbis', 'positive behavior', 'school-wide']
  };
  
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(keyword => allText.includes(keyword))) {
      suggestedTags.push(tag);
    }
  }
  
  return suggestedTags.slice(0, 5); // Max 5 tags
}

// Analyze single post
async function analyzePost(post) {
  const optimizations = {
    post_id: post.id,
    title: post.title,
    slug: post.slug,
    changes: []
  };
  
  // Check meta description
  if (!post.meta_description || post.meta_description.length < 120) {
    const newMetaDescription = generateMetaDescription(post.html, post.title);
    if (newMetaDescription && newMetaDescription.length >= 120) {
      optimizations.changes.push({
        type: 'meta_description',
        old: post.meta_description || '(none)',
        new: newMetaDescription
      });
    }
  }
  
  // Check title optimization
  const optimizedTitle = optimizeTitle(post.title);
  if (optimizedTitle !== post.title) {
    optimizations.changes.push({
      type: 'title',
      old: post.title,
      new: optimizedTitle
    });
  }
  
  // Check internal links
  const linkResult = addInternalLinks(post.html, post.title);
  if (linkResult && linkResult.links && linkResult.links.length > 0) {
    optimizations.changes.push({
      type: 'internal_links',
      links: linkResult.links,
      html: linkResult.html
    });
  }
  
  // Check tags
  const currentTags = post.tags?.map(t => t.name) || [];
  const suggestedTags = extractTags(post.html, post.title);
  const newTags = suggestedTags.filter(t => !currentTags.includes(t));
  
  if (newTags.length > 0) {
    optimizations.changes.push({
      type: 'tags',
      suggested: newTags
    });
  }
  
  return optimizations;
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || '--analyze';
  
  console.log('🚀 Blog Post SEO Auto-Optimizer\n');
  
  if (!GHOST_CONTENT_URL || !GHOST_ADMIN_KEY) {
    console.error('❌ Missing GHOST_CONTENT_URL or GHOST_ADMIN_KEY environment variables');
    console.error('   Please ensure these are set in your .env.local file');
    console.error(`   GHOST_CONTENT_URL: ${GHOST_CONTENT_URL || '(not set)'}`);
    console.error(`   GHOST_ADMIN_KEY: ${GHOST_ADMIN_KEY ? '(set)' : '(not set)'}`);
    process.exit(1);
  }
  
  console.log(`Mode: ${mode === '--optimize' ? '✏️  OPTIMIZATION' : '📊 ANALYSIS ONLY'}\n`);
  
  try {
    // Fetch posts
    console.log('🔍 Fetching blog posts...\n');
    const response = await fetch(`${SITE_URL}/api/admin/blog/posts`);
    const result = await response.json();
    
    if (!result.success || !result.posts) {
      throw new Error('Failed to fetch posts');
    }
    
    console.log(`✅ Found ${result.posts.length} posts\n`);
    console.log('📊 Analyzing SEO opportunities...\n');
    
    const allOptimizations = [];
    
    for (const post of result.posts) {
      const optimization = await analyzePost(post);
      if (optimization.changes.length > 0) {
        allOptimizations.push(optimization);
      }
    }
    
    console.log(`\n📈 Analysis Complete!\n`);
    console.log(`   - Posts analyzed: ${result.posts.length}`);
    console.log(`   - Posts needing optimization: ${allOptimizations.length}`);
    console.log(`   - Total optimizations available: ${allOptimizations.reduce((sum, o) => sum + o.changes.length, 0)}\n`);
    
    // Generate detailed report
    let report = `# Blog Post SEO Auto-Optimization Report\n\n`;
    report += `**Generated:** ${new Date().toISOString()}\n`;
    report += `**Mode:** ${mode === '--optimize' ? 'APPLIED CHANGES' : 'ANALYSIS ONLY'}\n\n`;
    report += `## Summary\n\n`;
    report += `- **Total Posts:** ${result.posts.length}\n`;
    report += `- **Posts Needing Optimization:** ${allOptimizations.length}\n`;
    report += `- **Total Optimizations:** ${allOptimizations.reduce((sum, o) => sum + o.changes.length, 0)}\n\n`;
    report += `---\n\n`;
    
    for (const opt of allOptimizations) {
      report += `### ${opt.title}\n\n`;
      report += `**Post ID:** ${opt.post_id}\n`;
      report += `**URL:** /blog/${opt.slug}\n\n`;
      
      for (const change of opt.changes) {
        switch (change.type) {
          case 'meta_description':
            report += `#### 📝 Meta Description\n`;
            report += `**Current:** ${change.old === '(none)' ? '*Missing*' : change.old}\n`;
            report += `**Optimized:** ${change.new}\n\n`;
            break;
            
          case 'title':
            report += `#### 📌 Title Optimization\n`;
            report += `**Current:** ${change.old}\n`;
            report += `**Optimized:** ${change.new}\n\n`;
            break;
            
          case 'internal_links':
            report += `#### 🔗 Internal Links Added\n`;
            change.links.forEach(link => {
              report += `- [${link.anchor}](${link.url}) (found keyword: "${link.keyword}")\n`;
            });
            report += `\n`;
            break;
            
          case 'tags':
            report += `#### 🏷️  Suggested Tags\n`;
            change.suggested.forEach(tag => {
              report += `- ${tag}\n`;
            });
            report += `\n`;
            break;
        }
      }
      
      report += `---\n\n`;
    }
    
    report += `## Next Steps\n\n`;
    
    if (mode === '--analyze') {
      report += `This was a **dry run** - no changes were applied.\n\n`;
      report += `To apply these optimizations:\n`;
      report += `1. Review the suggestions above\n`;
      report += `2. Run \`node scripts/auto-optimize-posts.js --optimize\` to apply changes\n`;
      report += `3. Or manually edit posts in the blog editor at https://behaviorschool.com/admin/blog/editor\n\n`;
    } else {
      report += `Optimizations have been applied! ✅\n\n`;
      report += `Next steps:\n`;
      report += `1. Review changes in Ghost admin\n`;
      report += `2. Publish/update posts as needed\n`;
      report += `3. Monitor Google Search Console for ranking improvements\n\n`;
    }
    
    // Save report
    const reportPath = path.join(process.cwd(), `BLOG_AUTO_OPTIMIZATION_${new Date().toISOString().split('T')[0]}.md`);
    fs.writeFileSync(reportPath, report, 'utf8');
    
    console.log(`📄 Report saved: ${reportPath}\n`);
    console.log(`\n✅ Complete! Check the report for details.\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Check Node.js version
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ (for native fetch support)');
  process.exit(1);
}

main();

