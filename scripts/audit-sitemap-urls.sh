#!/bin/bash

# Sitemap URL Auditor
# Tests every URL in your sitemap to find 404s and redirects
# Usage: ./scripts/audit-sitemap-urls.sh

echo "🔍 Auditing sitemap.xml URLs..."
echo "================================"
echo ""

# Extract all URLs from sitemap
urls=$(grep -o '<loc>[^<]*</loc>' public/sitemap.xml | sed 's/<loc>//g' | sed 's/<\/loc>//g')

# Counters
total=0
ok_count=0
redirect_count=0
not_found_count=0
error_count=0

# Arrays to store problematic URLs
declare -a redirects
declare -a not_founds
declare -a errors

echo "Testing $(echo "$urls" | wc -l | tr -d ' ') URLs..."
echo ""

# Test each URL
while IFS= read -r url; do
  ((total++))
  
  # Get HTTP status code
  status=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "$url" 2>/dev/null)
  
  # Get redirect URL if any
  redirect_url=$(curl -s -o /dev/null -w "%{redirect_url}" --max-time 10 "$url" 2>/dev/null)
  
  if [ "$status" = "200" ] && [ -z "$redirect_url" ]; then
    ((ok_count++))
    echo "✅ $url"
  elif [ "$status" = "301" ] || [ "$status" = "302" ] || [ ! -z "$redirect_url" ]; then
    ((redirect_count++))
    redirects+=("$url → $redirect_url")
    echo "🔀 REDIRECT: $url"
  elif [ "$status" = "404" ]; then
    ((not_found_count++))
    not_founds+=("$url")
    echo "❌ 404: $url"
  else
    ((error_count++))
    errors+=("$url (Status: $status)")
    echo "⚠️  ERROR: $url (Status: $status)"
  fi
done <<< "$urls"

echo ""
echo "================================"
echo "📊 SUMMARY"
echo "================================"
echo "Total URLs tested: $total"
echo "✅ Working (200 OK): $ok_count"
echo "🔀 Redirects: $redirect_count"
echo "❌ Not Found (404): $not_found_count"
echo "⚠️  Other Errors: $error_count"
echo ""

# Show problems
if [ $redirect_count -gt 0 ]; then
  echo "🔀 REDIRECTS TO FIX:"
  echo "===================="
  for item in "${redirects[@]}"; do
    echo "  $item"
  done
  echo ""
fi

if [ $not_found_count -gt 0 ]; then
  echo "❌ 404 ERRORS TO REMOVE:"
  echo "========================"
  for url in "${not_founds[@]}"; do
    echo "  $url"
  done
  echo ""
fi

if [ $error_count -gt 0 ]; then
  echo "⚠️  OTHER ERRORS:"
  echo "================"
  for item in "${errors[@]}"; do
    echo "  $item"
  done
  echo ""
fi

# Calculate health score
health_score=$((ok_count * 100 / total))
echo "🏥 Sitemap Health Score: $health_score%"
echo ""

if [ $health_score -lt 50 ]; then
  echo "🚨 CRITICAL: Your sitemap health is below 50%!"
  echo "   Action: Remove all 404s and redirects immediately"
elif [ $health_score -lt 80 ]; then
  echo "⚠️  WARNING: Your sitemap needs attention"
  echo "   Action: Clean up 404s and redirects this week"
else
  echo "✅ GOOD: Your sitemap is in decent shape"
  echo "   Action: Fix remaining issues when convenient"
fi

echo ""
echo "Next steps:"
echo "1. Remove all 404 URLs from public/sitemap.xml"
echo "2. Update redirect URLs to their final destinations"
echo "3. Re-run this script to verify"
echo "4. Submit updated sitemap to Google Search Console"

