#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up Supabase checkout tables...${NC}\n"

# Supabase project details
PROJECT_REF="dugolglucuzolzvuqxmi"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1Z29sZ2x1Y3V6b2x6dnVxeG1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTAxNzM1OCwiZXhwIjoyMDcwNTkzMzU4fQ.qQJMOeKnCXbj6UNFRtUt-3jXTWiyHkvYYIwwbte2l0c"

# Read the SQL file
SQL_CONTENT=$(<supabase-checkout-setup.sql)

# Execute via Supabase REST API
echo -e "${BLUE}Executing SQL...${NC}\n"

# Note: Supabase REST API doesn't support direct SQL execution
# The best approach is to use the Supabase Dashboard SQL Editor

echo -e "${RED}⚠️  The Supabase REST API doesn't support direct SQL execution.${NC}\n"
echo -e "${GREEN}Please use one of these methods:${NC}\n"
echo -e "${BLUE}Method 1: Supabase Dashboard (RECOMMENDED)${NC}"
echo "  1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/editor"
echo "  2. Open the SQL Editor"
echo "  3. Copy the contents of 'supabase-checkout-setup.sql'"
echo "  4. Paste and click 'Run'"
echo ""
echo -e "${BLUE}Method 2: Use Supabase CLI with proper config${NC}"
echo "  1. Run: supabase login"
echo "  2. Run: supabase link --project-ref $PROJECT_REF"
echo "  3. Run: supabase db push"
echo ""
echo -e "${GREEN}After setup, visit:${NC}"
echo "  https://behaviorschool.com/admin/checkout-access"
