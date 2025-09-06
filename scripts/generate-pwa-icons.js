/**
 * Generate PWA icons from existing logo
 * This script creates the required PNG icons for PWA compliance
 */

const fs = require('fs');
const path = require('path');

// Create PWA icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// For now, we'll create a simple manifest with proper icon references
// In production, you'd want to use a tool like sharp or imagemagick to convert WebP to PNG

const manifest = {
  "name": "Behavior School",
  "short_name": "Behavior School",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1F4D3F",
  "description": "Tools, training, and community for school-based BCBAs, psychologists, and educators.",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    },
    {
      "src": "/Logos/Logo.webp",
      "sizes": "192x192",
      "type": "image/webp",
      "purpose": "any"
    },
    {
      "src": "/Logos/Logo.webp",
      "sizes": "512x512",
      "type": "image/webp",
      "purpose": "any"
    },
    {
      "src": "/Logos/Logo.webp",
      "sizes": "192x192",
      "type": "image/webp",
      "purpose": "maskable"
    },
    {
      "src": "/Logos/Logo.webp",
      "sizes": "512x512",
      "type": "image/webp",
      "purpose": "maskable"
    }
  ],
  "categories": ["education", "productivity", "utilities"],
  "lang": "en",
  "orientation": "portrait-primary",
  "scope": "/",
  "id": "behavior-school"
};

// Write the updated manifest
fs.writeFileSync(
  path.join(__dirname, '../public/manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('✅ PWA manifest updated with proper icon references');
console.log('📝 Note: For full PWA compliance, convert WebP logos to PNG format');
console.log('🔧 Consider using tools like sharp or imagemagick for icon conversion');
