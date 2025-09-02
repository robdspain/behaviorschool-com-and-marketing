const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');

// Configuration
const GHOST_URL = 'https://ghost.behaviorschool.com';
const API_KEY = '67b19c0c5db7be0001c0e715:083ac197565fea2fd87f44a37204db0baa769791f4ba5102b9912a4b9beb82a3';

// JWT token for Ghost Admin API
const jwt = require('jsonwebtoken');

function generateToken() {
    // Ghost Admin API key format: id:secret
    // If API key doesn't contain ':', treat whole string as secret with default id
    if (API_KEY.includes(':')) {
        const [id, secret] = API_KEY.split(':');
        return jwt.sign({}, Buffer.from(secret, 'hex'), {
            keyid: id,
            algorithm: 'HS256',
            expiresIn: '5m',
            audience: '/admin/'
        });
    } else {
        // Alternative format - use API key as bearer token
        return API_KEY;
    }
}

async function fetchPosts() {
    const token = generateToken();
    const response = await fetch(`${GHOST_URL}/ghost/api/admin/posts/?formats=html&limit=all`, {
        headers: {
            'Authorization': `Ghost ${token}`,
            'Accept-Version': 'v5.0'
        }
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    
    const data = await response.json();
    return data.posts;
}

async function uploadImage(imagePath) {
    const token = generateToken();
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));
    
    const response = await fetch(`${GHOST_URL}/ghost/api/admin/images/upload/`, {
        method: 'POST',
        headers: {
            'Authorization': `Ghost ${token}`,
            'Accept-Version': 'v5.0'
        },
        body: form
    });
    
    if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.status}`);
    }
    
    const data = await response.json();
    return data.images[0].url;
}

async function updatePost(postId, updatedHtml) {
    const token = generateToken();
    const response = await fetch(`${GHOST_URL}/ghost/api/admin/posts/${postId}/`, {
        method: 'PUT',
        headers: {
            'Authorization': `Ghost ${token}`,
            'Accept-Version': 'v5.0',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            posts: [{
                html: updatedHtml,
                updated_at: new Date().toISOString()
            }]
        })
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update post: ${response.status}`);
    }
    
    return await response.json();
}

async function fixBrokenImages() {
    try {
        console.log('Fetching blog posts...');
        const posts = await fetchPosts();
        
        const brokenImageUrls = [
            'https://ghost.behaviorschool.com/content/images/2025/08/passthefreakinexam-1.png',
            'https://ghost.behaviorschool.com/content/images/2025/07/skinner90.jpeg',
            // Add more broken URLs as they are discovered
            'ghost.behaviorschool.com/content/images/2025/08/passthefreakinexam-1.png',
            'ghost.behaviorschool.com/content/images/2025/07/skinner90.jpeg'
        ];
        
        for (const post of posts) {
            let needsUpdate = false;
            let updatedHtml = post.html;
            
            // Check if post contains broken images
            for (const brokenUrl of brokenImageUrls) {
                if (post.html && post.html.includes(brokenUrl)) {
                    console.log(`Found broken image in post: ${post.title}`);
                    needsUpdate = true;
                    
                    // Replace broken image with a placeholder that explains the issue
                    const imgRegex = new RegExp(`<img[^>]*src="[^"]*${brokenUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"]*"[^>]*>`, 'gi');
                    updatedHtml = updatedHtml.replace(imgRegex, '<div style="background: #f3f4f6; border: 2px dashed #d1d5db; padding: 20px; text-align: center; border-radius: 8px; margin: 16px 0;"><p style="color: #6b7280; font-style: italic;">Image temporarily unavailable</p></div>');
                }
            }
            
            // Also fix any HTTP image URLs to use HTTPS
            if (post.html && post.html.includes('http://')) {
                console.log(`Fixing HTTP images in post: ${post.title}`);
                needsUpdate = true;
                updatedHtml = updatedHtml.replace(/(<img[^>]*src=")http:\/\//gi, '$1https://');
            }
            
            if (needsUpdate) {
                console.log(`Updating post: ${post.title}`);
                await updatePost(post.id, updatedHtml);
                console.log('Post updated successfully');
            }
        }
        
        console.log('Finished fixing broken images');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the fix
fixBrokenImages();