#!/bin/bash

# Ghost Setup Script for Headless Newsletter Management
# This script helps set up Ghost CMS in headless mode for newsletter functionality

set -e

echo "🚀 Ghost Headless Setup for Newsletter Management"
echo "================================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env.ghost ]; then
    echo "📝 Creating .env.ghost file from template..."
    cp .env.ghost.example .env.ghost
    echo "✅ Created .env.ghost file"
    echo ""
    echo "⚠️  Please edit .env.ghost and update the following:"
    echo "   - GHOST_URL (your Ghost instance URL)"
    echo "   - Mail configuration (SMTP settings)"
    echo ""
    read -p "Press Enter after updating .env.ghost to continue..."
fi

# Load environment variables
export $(cat .env.ghost | grep -v '^#' | xargs)

# Start Ghost
echo ""
echo "🐳 Starting Ghost with Docker Compose..."
docker-compose up -d

# Wait for Ghost to be ready
echo "⏳ Waiting for Ghost to initialize (this may take a minute)..."
sleep 30

# Check if Ghost is running
if curl -s -o /dev/null -w "%{http_code}" http://localhost:2368 | grep -q "200\|301\|302"; then
    echo "✅ Ghost is running!"
else
    echo "⚠️  Ghost might still be initializing. Waiting a bit more..."
    sleep 20
fi

echo ""
echo "🎉 Ghost Setup Complete!"
echo "========================"
echo ""
echo "📌 Next Steps:"
echo ""
echo "1. Access Ghost Admin at: http://localhost:2368/ghost"
echo "2. Complete the setup wizard to create your admin account"
echo "3. Go to Settings > Integrations > Add custom integration"
echo "4. Name it 'Newsletter API' and save"
echo "5. Copy the Admin API Key and Content API Key"
echo "6. Update your .env.local file with:"
echo "   GHOST_ADMIN_KEY=<admin_api_key>"
echo "   GHOST_CONTENT_KEY=<content_api_key>"
echo "   GHOST_CONTENT_URL=http://localhost:2368"
echo ""
echo "📧 Newsletter Configuration:"
echo "1. Go to Settings > Email newsletter"
echo "2. Configure your newsletter settings"
echo "3. Create newsletters in Settings > Newsletters"
echo "4. Test the signup forms on your landing pages"
echo ""
echo "🔧 Useful Commands:"
echo "   docker-compose logs -f ghost    # View Ghost logs"
echo "   docker-compose down              # Stop Ghost"
echo "   docker-compose up -d             # Start Ghost"
echo "   docker-compose restart ghost     # Restart Ghost"
echo ""
echo "📚 Documentation:"
echo "   Ghost Admin API: https://ghost.org/docs/admin-api/"
echo "   Ghost Content API: https://ghost.org/docs/content-api/"
echo "   Newsletter Setup: https://ghost.org/docs/newsletters/"
echo ""