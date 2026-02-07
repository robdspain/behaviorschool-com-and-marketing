#!/bin/bash
###
# Import CALABA 2026 Symposium Presentation
# 
# Beyond Observable Behavior: Measuring and Modifying the Function of Thought
# 47 slides, corporate template, professional academic style
###

set -e

echo "🎯 CALABA 2026 Symposium Import"
echo "═══════════════════════════════════════"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "❌ Missing .env.local file!"
    echo ""
    echo "Create .env.local with:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
    echo ""
    echo "Get credentials from: https://supabase.com/dashboard"
    echo "→ Your Project → Settings → API"
    echo ""
    exit 1
fi

# Load environment
set -a
source .env.local
set +a

# Verify credentials
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Missing credentials in .env.local"
    exit 1
fi

echo "✅ Environment loaded"
echo "   URL: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent @supabase/supabase-js tsx 2>&1 | grep -v "npm warn" || true
echo ""

# Run import
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Importing CALABA 2026 Symposium..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npx tsx scripts/import-calaba-presentation.ts

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ IMPORT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Access your presentation:"
echo ""
echo "   Admin: https://behaviorschool.com/admin/presentations"
echo "   → Click 'Library' tab"
echo "   → Find 'Beyond Observable Behavior'"
echo "   → Click 'Present' for fullscreen mode"
echo ""
echo "🎨 Template: Corporate (deep blue/navy)"
echo "📊 Slides: 47"
echo "📅 Event: CALABA 2026, March 7, 2:55-3:55 PM"
echo ""
echo "💡 Tip: Export PPTX backup before the conference!"
echo ""
