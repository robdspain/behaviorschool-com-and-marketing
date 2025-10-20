#!/usr/bin/env node

/**
 * Blog Post SEO Optimizer
 * 
 * This script analyzes all existing blog posts and:
 * 1. Identifies SEO optimization opportunities
 * 2. Suggests internal links to pillar pages
 * 3. Generates optimized metadata
 * 4. Provides keyword recommendations
 * 5. Creates a report for manual review
 * 
 * Usage: node scripts/optimize-blog-posts-seo.js
 */

const fs = require('fs');
const path = require('path');

// Pillar pages and their target keywords
const PILLAR_PAGES = {
  '/bcba-exam-prep': {
    keywords: ['bcba exam', 'bcba certification', 'behavior analyst exam', 'bcba test', 'bcba prep'],
    title: 'Free BCBA Exam Prep',
    description: 'Comprehensive BCBA exam preparation with practice questions and study tools'
  },
  '/school-based-bcba': {
    keywords: ['school bcba', 'school-based behavior analyst', 'bcba in schools', 'education behavior analyst'],
    title: 'School-Based BCBA Career Guide',
    description: 'Complete guide to working as a BCBA in school settings'
  },
  '/iep-behavior-goals': {
    keywords: ['iep goals', 'behavior goals', 'iep behavior', 'behavioral objectives', 'iep goal generator'],
    title: 'IEP Behavior Goals Generator',
    description: 'AI-powered IEP behavior goal generator with templates'
  },
  '/supervisors': {
    keywords: ['bcba supervision', 'aba supervision', 'supervision tools', 'fieldwork hours', 'supervision curriculum'],
    title: 'BCBA Supervision Tools',
    description: 'Free BCBA supervision resources and tracking tools'
  },
  '/behavior-study-tools': {
    keywords: ['study tools', 'practice test', 'mock exam', 'flashcards', 'practice questions'],
    title: 'Behavior Study Tools',
    description: 'Free study tools for BCBA exam preparation'
  },
  '/behavior-plans': {
    keywords: ['behavior plan', 'bip', 'behavior intervention', 'positive behavior support', 'fba'],
    title: 'Behavior Plan Writer',
    description: 'AI-powered behavior intervention plan (BIP) generator'
  },
  '/school-based-behavior-support': {
    keywords: ['pbis', 'school-wide behavior', 'behavior support', 'mtss', 'rti behavior'],
    title: 'School-Based Behavior Support',
    description: 'Comprehensive school-wide behavior support systems'
  },
  '/transformation-program': {
    keywords: ['bcba training', 'behavior analyst training', 'professional development', 'bcba course'],
    title: 'School BCBA Training Program',
    description: '8-week transformation program for school-based BCBAs'
  }
};

// SEO best practices checklist
function analyzeSEO(post) {
  const issues = [];
  const recommendations = [];
  
  // Title analysis
  if (!post.title) {
    issues.push('Missing title');
  } else if (post.title.length < 30) {
    issues.push(`Title too short (${post.title.length} chars, recommended: 30-60)`);
  } else if (post.title.length > 60) {
    issues.push(`Title too long (${post.title.length} chars, recommended: 30-60)`);
  }
  
  // Meta description analysis
  if (!post.meta_description && !post.excerpt) {
    issues.push('Missing meta description');
  } else {
    const metaLength = (post.meta_description || post.excerpt || '').length;
    if (metaLength < 120) {
      issues.push(`Meta description too short (${metaLength} chars, recommended: 120-160)`);
    } else if (metaLength > 160) {
      issues.push(`Meta description too long (${metaLength} chars, recommended: 120-160)`);
    }
  }
  
  // Content analysis
  if (!post.html) {
    issues.push('Missing content');
  } else {
    const wordCount = post.html.replace(/<[^>]*>/g, '').split(/\s+/).length;
    if (wordCount < 300) {
      issues.push(`Content too short (${wordCount} words, recommended: 800+)`);
    }
    
    // Check for internal links to pillar pages
    const missingLinks = [];
    for (const [pillarUrl, pillarData] of Object.entries(PILLAR_PAGES)) {
      const hasLink = post.html.includes(`href="${pillarUrl}"`) || 
                     post.html.includes(`href="https://behaviorschool.com${pillarUrl}"`);
      
      if (!hasLink) {
        // Check if post content mentions relevant keywords
        const contentLower = post.html.toLowerCase();
        const hasRelevantKeywords = pillarData.keywords.some(keyword => 
          contentLower.includes(keyword.toLowerCase())
        );
        
        if (hasRelevantKeywords) {
          missingLinks.push({
            url: pillarUrl,
            title: pillarData.title,
            reason: `Post mentions keywords: ${pillarData.keywords.filter(k => contentLower.includes(k.toLowerCase())).join(', ')}`
          });
        }
      }
    }
    
    if (missingLinks.length > 0) {
      recommendations.push({
        type: 'internal_links',
        links: missingLinks
      });
    }
  }
  
  // Featured image check
  if (!post.feature_image) {
    issues.push('Missing featured image');
  }
  
  // Tags analysis
  if (!post.tags || post.tags.length === 0) {
    issues.push('No tags assigned');
  } else if (post.tags.length > 5) {
    issues.push(`Too many tags (${post.tags.length}, recommended: 3-5)`);
  }
  
  return {
    score: calculateSEOScore(issues, recommendations),
    issues,
    recommendations
  };
}

function calculateSEOScore(issues, recommendations) {
  let score = 100;
  score -= issues.length * 10;
  score -= recommendations.length * 5;
  return Math.max(0, Math.min(100, score));
}

// Generate optimized metadata suggestions
function generateMetadataSuggestions(post) {
  const suggestions = {};
  
  // Optimize title for compact keywords
  if (post.title) {
    // Extract main topic
    const titleWords = post.title.split(/\s+/);
    
    // Check if title starts with high-intent keywords
    const highIntentKeywords = ['Free', 'How to', 'Guide', 'Complete', 'Best'];
    const hasHighIntentStart = highIntentKeywords.some(keyword => 
      post.title.startsWith(keyword)
    );
    
    if (!hasHighIntentStart && titleWords.length > 5) {
      suggestions.title = `Consider starting with high-intent keyword: "${titleWords.slice(0, 4).join(' ')}"`;
    }
  }
  
  // Generate meta description if missing
  if (!post.meta_description && post.html) {
    const firstParagraph = post.html
      .replace(/<[^>]*>/g, '')
      .split(/\.\s+/)[0];
    
    if (firstParagraph && firstParagraph.length > 50) {
      suggestions.meta_description = firstParagraph.substring(0, 157) + '...';
    }
  }
  
  return suggestions;
}

// Generate markdown report
function generateReport(analysis) {
  const now = new Date().toISOString().split('T')[0];
  let report = `# Blog Post SEO Optimization Report\n\n`;
  report += `**Generated:** ${now}\n`;
  report += `**Total Posts Analyzed:** ${analysis.length}\n\n`;
  
  // Summary statistics
  const avgScore = analysis.reduce((sum, a) => sum + a.seo.score, 0) / analysis.length;
  const needsWork = analysis.filter(a => a.seo.score < 70).length;
  const excellent = analysis.filter(a => a.seo.score >= 90).length;
  
  report += `## Summary\n\n`;
  report += `- **Average SEO Score:** ${avgScore.toFixed(1)}/100\n`;
  report += `- **Excellent (90+):** ${excellent} posts\n`;
  report += `- **Needs Improvement (<70):** ${needsWork} posts\n\n`;
  
  report += `---\n\n`;
  
  // Priority posts (lowest scores first)
  const prioritized = [...analysis].sort((a, b) => a.seo.score - b.seo.score);
  
  report += `## Posts Requiring Optimization (Priority Order)\n\n`;
  
  for (const post of prioritized) {
    if (post.seo.score < 70) {
      report += `### ${post.title || 'Untitled'}\n\n`;
      report += `**SEO Score:** ${post.seo.score}/100\n`;
      report += `**URL:** ${post.slug}\n`;
      report += `**Published:** ${post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}\n\n`;
      
      if (post.seo.issues.length > 0) {
        report += `#### Issues:\n`;
        post.seo.issues.forEach(issue => {
          report += `- ❌ ${issue}\n`;
        });
        report += `\n`;
      }
      
      if (post.seo.recommendations.length > 0) {
        report += `#### Recommendations:\n`;
        post.seo.recommendations.forEach(rec => {
          if (rec.type === 'internal_links') {
            report += `\n**Add Internal Links:**\n`;
            rec.links.forEach(link => {
              report += `- 🔗 Link to [${link.title}](${link.url})\n`;
              report += `  - *Reason:* ${link.reason}\n`;
            });
          }
        });
        report += `\n`;
      }
      
      if (Object.keys(post.metadata_suggestions).length > 0) {
        report += `#### Metadata Suggestions:\n`;
        for (const [key, value] of Object.entries(post.metadata_suggestions)) {
          report += `- **${key}:** ${value}\n`;
        }
        report += `\n`;
      }
      
      report += `---\n\n`;
    }
  }
  
  // Top performing posts
  report += `## Top Performing Posts (SEO Score 90+)\n\n`;
  const topPosts = prioritized.filter(p => p.seo.score >= 90).reverse();
  
  if (topPosts.length > 0) {
    for (const post of topPosts) {
      report += `- ✅ **${post.title}** (${post.seo.score}/100) - ${post.slug}\n`;
    }
  } else {
    report += `*No posts currently scoring 90+ - opportunity for improvement across the board!*\n`;
  }
  
  report += `\n---\n\n`;
  
  // Action plan
  report += `## Recommended Action Plan\n\n`;
  report += `### Phase 1: Quick Wins (This Week)\n`;
  report += `1. Fix missing meta descriptions (${analysis.filter(a => a.seo.issues.some(i => i.includes('meta description'))).length} posts)\n`;
  report += `2. Add internal links to pillar pages\n`;
  report += `3. Optimize titles for compact keywords\n\n`;
  
  report += `### Phase 2: Content Enhancement (Next 2 Weeks)\n`;
  report += `1. Expand short posts (<300 words) to 800+ words\n`;
  report += `2. Add featured images to all posts\n`;
  report += `3. Optimize tag usage (3-5 tags per post)\n\n`;
  
  report += `### Phase 3: Advanced Optimization (Month 2)\n`;
  report += `1. Add FAQ schema to relevant posts\n`;
  report += `2. Create internal linking strategy across all posts\n`;
  report += `3. Update old posts with current year (2025)\n\n`;
  
  return report;
}

// Main function
async function main() {
  console.log('🔍 Fetching blog posts from Ghost...\n');
  
  try {
    // Fetch posts from API
    const response = await fetch('https://behaviorschool.com/api/admin/blog/posts');
    const result = await response.json();
    
    if (!result.success || !result.posts) {
      throw new Error('Failed to fetch posts from API');
    }
    
    console.log(`✅ Found ${result.posts.length} posts\n`);
    console.log('📊 Analyzing SEO...\n');
    
    // Analyze each post
    const analysis = result.posts.map(post => {
      const seo = analyzeSEO(post);
      const metadata_suggestions = generateMetadataSuggestions(post);
      
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        published_at: post.published_at,
        seo,
        metadata_suggestions
      };
    });
    
    // Generate report
    const report = generateReport(analysis);
    
    // Save report
    const reportPath = path.join(process.cwd(), `BLOG_SEO_OPTIMIZATION_REPORT_${new Date().toISOString().split('T')[0]}.md`);
    fs.writeFileSync(reportPath, report, 'utf8');
    
    console.log(`✅ Report generated: ${reportPath}\n`);
    console.log('📈 Summary:');
    console.log(`   - Average SEO Score: ${(analysis.reduce((sum, a) => sum + a.seo.score, 0) / analysis.length).toFixed(1)}/100`);
    console.log(`   - Posts needing work: ${analysis.filter(a => a.seo.score < 70).length}`);
    console.log(`   - Excellent posts: ${analysis.filter(a => a.seo.score >= 90).length}`);
    console.log(`\n📝 Next Steps:`);
    console.log(`   1. Review the generated report`);
    console.log(`   2. Prioritize posts with lowest SEO scores`);
    console.log(`   3. Use the blog editor to add recommended internal links`);
    console.log(`   4. Update metadata for posts missing descriptions\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// For Node.js < 18, add fetch polyfill check
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or a fetch polyfill');
  process.exit(1);
}

main();

