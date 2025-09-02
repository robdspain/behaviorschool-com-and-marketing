#!/usr/bin/env node

const jwt = require('jsonwebtoken');
const fs = require('fs');

// Ghost Admin API configuration
const GHOST_URL = 'http://localhost:3000';
const ADMIN_API_KEY = '675e5c4d3a1b2c8d9f0e4a5d:675e5c4d3a1b2c8d9f0e4a5c675e5c4d3a1b2c8d9f0e4a5c675e5c4d3a1b2c8e';

// Parse the API key
const [keyId, keySecret] = ADMIN_API_KEY.split(':');

// Create JWT token for authentication
function createToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now,
    exp: now + 300, // 5 minutes
    aud: '/admin/'
  };
  
  return jwt.sign(payload, Buffer.from(keySecret, 'hex'), {
    algorithm: 'HS256',
    keyid: keyId
  });
}

// Create a new post
async function createPost(postData) {
  const token = createToken();
  
  const response = await fetch(`${GHOST_URL}/ghost/api/admin/posts/`, {
    method: 'POST',
    headers: {
      'Authorization': `Ghost ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      posts: [{
        title: postData.title,
        html: postData.content,
        status: postData.status || 'draft',
        featured: postData.featured || false,
        excerpt: postData.excerpt || '',
        tags: postData.tags || []
      }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create post: ${error}`);
  }

  const result = await response.json();
  return result.posts[0];
}

// Example usage
async function main() {
  try {
    const newPost = await createPost({
      title: "My New Blog Post",
      content: "<p>This is the content of my new blog post created via the Ghost Admin API!</p>",
      status: "draft", // or "published"
      excerpt: "A short description of the post",
      tags: ["Blog", "Test"]
    });
    
    console.log('Post created successfully!');
    console.log('Post ID:', newPost.id);
    console.log('Post URL:', newPost.url);
  } catch (error) {
    console.error('Error creating post:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createPost };