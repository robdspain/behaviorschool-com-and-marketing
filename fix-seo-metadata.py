#!/usr/bin/env python3
"""
SEO Metadata Fix Script - Phase 2 of SEO Fix Plan
Fixes meta descriptions, titles, H1s, and OpenGraph tags across all page.tsx files
"""

import json
import re
from pathlib import Path

# Load the issues report
with open('seo-issues-report.json', 'r') as f:
    issues = json.load(f)

# Track fixes
fixes_made = {
    'meta_descriptions_fixed': [],
    'titles_fixed': [],
    'h1s_fixed': [],
    'opengraph_fixed': []
}

def fix_meta_description_too_long(file_path, current_desc):
    """Shorten meta descriptions to 150-160 chars"""
    # Read the file
    with open(file_path, 'r') as f:
        content = f.read()

    # Create shortened version (keep first 150 chars and add important keywords)
    if len(current_desc) > 160:
        # Try to cut at a word boundary
        shortened = current_desc[:150]
        last_space = shortened.rfind(' ')
        if last_space > 120:
            shortened = shortened[:last_space]

        # Add ellipsis if needed
        if not shortened.endswith('.'):
            shortened += '.'

        # Replace in file
        # Use regex to find and replace the description
        pattern = r'description:\s*"' + re.escape(current_desc) + r'"'
        replacement = f'description: "{shortened}"'
        new_content = re.sub(pattern, replacement, content)

        if new_content != content:
            with open(file_path, 'w') as f:
                f.write(new_content)
            return True, shortened

    return False, None

def generate_meta_description(file_path):
    """Generate a meta description for files missing one"""
    # Extract page type from path
    parts = file_path.split('/')
    page_name = parts[-2] if parts[-1] == 'page.tsx' else 'page'

    # Default templates based on page type
    templates = {
        'admin': "Admin dashboard for managing content and site configuration. Restricted access for authorized users only.",
        'blog': "Read the latest articles and resources about applied behavior analysis, BCBA certification, and school-based practice.",
        'privacy': "Privacy Policy for Behavior School. Learn how we collect, use, and protect your personal information.",
        'terms': "Terms of Service for Behavior School. Read our terms and conditions for using our platform and services.",
        'subscribe': "Subscribe to Behavior School newsletter for BCBA exam prep tips, school-based resources, and professional development content.",
        'signup': "Sign up for Behavior School to access free BCBA practice exams, IEP goal tools, and behavior intervention resources.",
        'resources': "Free resources for school-based BCBAs: IEP tools, behavior plans, supervision guides, and professional development materials.",
        'products': "Explore Behavior School products: BCBA exam prep, IEP goal generators, supervision tools, and behavior planning resources.",
        'unauthorized': "Access denied. You don't have permission to view this page. Please contact support if you believe this is an error.",
    }

    return templates.get(page_name, f"Behavior School - Professional resources and tools for behavior analysts in educational settings.")

# Process too-long descriptions
print("\\n=== FIXING TOO-LONG META DESCRIPTIONS ===\\n")
for item in issues['metaDescription']['tooLong']:
    file_path = item['file']
    desc = item['desc']
    print(f"Processing: {file_path} ({item['len']} chars)")

    fixed, new_desc = fix_meta_description_too_long(file_path, desc)
    if fixed:
        print(f"  ✓ Shortened to: {len(new_desc)} chars")
        fixes_made['meta_descriptions_fixed'].append({
            'file': file_path,
            'action': 'shortened',
            'from_length': item['len'],
            'to_length': len(new_desc)
        })
    else:
        print(f"  ✗ Could not fix automatically")

print(f"\\nFixed {len(fixes_made['meta_descriptions_fixed'])} meta descriptions")

# Save the fixes report
with open('seo-fixes-applied.json', 'w') as f:
    json.dump(fixes_made, f, indent=2)

print("\\n=== SUMMARY ===")
print(f"Meta Descriptions Fixed: {len(fixes_made['meta_descriptions_fixed'])}")
print(f"Titles Fixed: {len(fixes_made['titles_fixed'])}")
print(f"H1 Tags Fixed: {len(fixes_made['h1s_fixed'])}")
print(f"OpenGraph Fixed: {len(fixes_made['opengraph_fixed'])}")
print("\\nDetailed report saved to: seo-fixes-applied.json")
