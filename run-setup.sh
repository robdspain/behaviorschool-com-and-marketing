#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up Supabase checkout tables...${NC}\n"

# Supabase project details - set via environment variables
PROJECT_REF="${SUPABASE_PROJECT_REF:-dugolglucuzolzvuqxmi}"
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}"

if [[ -z "$SERVICE_ROLE_KEY" ]]; then
    echo -e "${RED}Warning: SUPABASE_SERVICE_ROLE_KEY not set. Manual setup required.${NC}"
fi

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
