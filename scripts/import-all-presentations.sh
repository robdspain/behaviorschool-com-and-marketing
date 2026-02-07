#!/bin/bash
###
# Import Both Conference Presentations to Supabase
# 
# This script imports:
# 1. PBIS Conference Presentation (32 slides)
# 2. CALABA 2026 Symposium Presentation (47 slides)
#
# Prerequisites:
# - .env.local file with Supabase credentials
# - npm/node installed
# - tsx or ts-node available
###

set -e  # Exit on error

echo "🎯 Presentation Import Script"
echo "=============================="
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "❌ Missing .env.local file!"
    echo ""
    echo "Please create .env.local with the following variables:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here"
    echo ""
    echo "You can find these in the Supabase dashboard:"
    echo "https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api"
    echo ""
    exit 1
fi

# Source the environment
set -a
source .env.local
set +a

# Check credentials are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Missing Supabase credentials in .env.local"
    echo "Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

echo "✅ Environment configured"
echo "   URL: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# Check if tsx is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js"
    exit 1
fi

echo "📦 Installing dependencies if needed..."
npm install --silent @supabase/supabase-js tsx dotenv 2>&1 | grep -v "npm warn" || true
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Importing PBIS Conference Presentation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
npx tsx scripts/import-pbis-presentation-full.ts
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Importing CALABA 2026 Symposium Presentation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
npx tsx scripts/import-calaba-presentation.ts
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ IMPORT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Both presentations have been imported to Supabase."
echo ""
echo "📱 Next Steps for Rob:"
echo ""
echo "1. Go to: https://behaviorschool.com/admin/presentations"
echo "2. Click the 'Library' tab"
echo "3. You should see both presentations listed"
echo "4. Click 'Present' to enter fullscreen mode"
echo "5. Use arrow keys or click to navigate slides"
echo "6. Press 'F' for fullscreen"
echo "7. Download as PPTX or PDF for backup"
echo ""
echo "🎨 Templates used:"
echo "   • PBIS: 'modern' (emerald/teal, Behavior School branding)"
echo "   • CALABA: 'corporate' (deep blue/navy, academic style)"
echo ""
