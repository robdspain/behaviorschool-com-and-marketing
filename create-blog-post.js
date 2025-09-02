#!/usr/bin/env node

// Simple script to create Ghost blog posts via direct database insertion
// Usage: node create-blog-post.js "Post Title" "Post content here" "excerpt" "tag1,tag2"

const { execSync } = require('child_process');

function createPost(title, content, excerpt = '', tags = '') {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const uuid = require('crypto').randomUUID();
  const postId = Buffer.from(uuid.replace(/-/g, '')).toString('hex').substring(0, 24);
  
  // Convert simple markdown-like syntax to HTML
  let html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
  const sql = `
    INSERT INTO posts (
      id, uuid, title, slug, html, plaintext, excerpt,
      status, visibility, published_at, created_at, updated_at,
      created_by, updated_by
    ) VALUES (
      '${postId}',
      '${uuid}',
      '${title.replace(/'/g, "\\'")}',
      '${slug}',
      '${html.replace(/'/g, "\\'")}',
      '${content.replace(/'/g, "\\'")}',
      '${excerpt.replace(/'/g, "\\'")}',
      'published',
      'public',
      '${now}',
      '${now}',
      '${now}',
      '1',
      '1'
    );
  `;

  console.log('Creating blog post...');
  console.log('Title:', title);
  console.log('Slug:', slug);
  
  try {
    // Execute SQL via SSH to the Ghost database
    const command = `ssh root@146.190.162.121 "docker exec mysql mysql -u root -pRootPass_9rJr9uLr2Gm4 ghost_bs -e \\"${sql.replace(/"/g, '\\"')}\\"" 2>/dev/null`;
    
    execSync(command, { stdio: 'inherit' });
    
    console.log('✅ Blog post created successfully!');
    console.log('URL: http://localhost:3000/blog/' + slug + '/');
    console.log('Admin API will pick this up automatically');
    
  } catch (error) {
    console.error('❌ Error creating blog post:', error.message);
  }
}

// CLI usage
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node create-blog-post.js "Title" "Content" "Excerpt" "tag1,tag2"');
  console.log('Example: node create-blog-post.js "My New Post" "This is **bold** content" "Short description"');
  process.exit(1);
}

const [title, content, excerpt, tags] = args;
createPost(title, content, excerpt || '', tags || '');