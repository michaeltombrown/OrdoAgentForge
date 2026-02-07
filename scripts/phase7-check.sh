#!/bin/bash

# Phase 7 Readiness Check Script
# Verifies that all code and dependencies are ready for testing

echo "=========================================="
echo "Phase 7 Readiness Check"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success=0
warnings=0
errors=0

# Function to check file existence
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        ((success++))
    else
        echo -e "${RED}❌${NC} $1 (missing)"
        ((errors++))
    fi
}

# Function to check directory existence
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        ((success++))
    else
        echo -e "${RED}❌${NC} $1/ (missing)"
        ((errors++))
    fi
}

echo "1. Checking Core Files..."
echo "------------------------"
check_file "package.json"
check_file "tsconfig.json"
check_file "vite.config.ts"
check_file ".env.example"
echo ""

echo "2. Checking Backend Files..."
echo "------------------------"
check_file "src/server/index.ts"
check_file "src/server/routes/index.ts"
check_file "src/server/middleware/clerkWebhookMiddleware.ts"
check_file "src/server/middleware/authMiddleware.ts"
check_file "src/server/controllers/authController.ts"
check_file "src/server/lib/supabase/server.ts"
echo ""

echo "3. Checking Frontend Files..."
echo "------------------------"
check_file "src/main.tsx"
check_file "src/App.tsx"
check_file "src/lib/supabase/client.ts"
check_file "src/lib/context/UserContext.tsx"
check_file "src/hooks/useUser.ts"
echo ""

echo "4. Checking Scripts..."
echo "------------------------"
check_file "scripts/verify-env.sh"
check_file "scripts/start-dev.sh"
check_file "scripts/test-data-setup.sql"
echo ""

echo "5. Checking Documentation..."
echo "------------------------"
check_file "PHASE_7_STEP_1_COMPLETE.md"
check_file "PHASE_7_TESTING_GUIDE.md"
check_file "PHASE_7_QUICKSTART.md"
check_file "PHASE_7_STATUS.md"
check_file "PHASE_7_SUMMARY.md"
echo ""

echo "6. Checking Node Modules..."
echo "------------------------"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} node_modules/ (installed)"
    ((success++))
else
    echo -e "${YELLOW}⚠️${NC}  node_modules/ (not installed - run: npm install)"
    ((warnings++))
fi
echo ""

echo "7. Checking TypeScript Compilation..."
echo "------------------------"
if npm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} TypeScript compilation successful"
    ((success++))
else
    echo -e "${RED}❌${NC} TypeScript compilation failed"
    echo "   Run: npm run type-check"
    ((errors++))
fi
echo ""

echo "8. Checking Environment Configuration..."
echo "------------------------"
if [ -f ".env" ]; then
    echo -e "${GREEN}✅${NC} .env file exists"
    ((success++))
    
    # Check for required variables
    source .env 2>/dev/null
    
    required_vars=(
        "VITE_SUPABASE_URL"
        "VITE_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "VITE_CLERK_PUBLISHABLE_KEY"
        "CLERK_SECRET_KEY"
        "CLERK_WEBHOOK_SECRET"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -n "${!var}" ] && [[ ! "${!var}" == *"your-"* ]] && [[ ! "${!var}" == *"paste-"* ]]; then
            echo -e "${GREEN}✅${NC} $var is configured"
            ((success++))
        else
            echo -e "${YELLOW}⚠️${NC}  $var needs configuration"
            ((warnings++))
        fi
    done
else
    echo -e "${YELLOW}⚠️${NC}  .env file not found"
    echo "   Run: cp .env.example .env"
    ((warnings++))
fi
echo ""

echo "=========================================="
echo "Summary"
echo "=========================================="
echo -e "${GREEN}✅ Passed:${NC} $success"
echo -e "${YELLOW}⚠️  Warnings:${NC} $warnings"
echo -e "${RED}❌ Errors:${NC} $errors"
echo ""

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}🎉 Phase 7 is READY for testing!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start servers: ./scripts/start-dev.sh"
    echo "2. Open browser: http://localhost:5173"
    echo "3. Follow: PHASE_7_TESTING_GUIDE.md"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Phase 7 is almost ready!${NC}"
    echo ""
    echo "Address the warnings above, then:"
    echo "1. Configure .env file"
    echo "2. Run this script again"
    echo "3. Start testing!"
    exit 1
else
    echo -e "${RED}❌ Phase 7 has errors that need to be fixed${NC}"
    echo ""
    echo "Fix the errors above, then run this script again."
    exit 2
fi
