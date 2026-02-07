#!/bin/bash

# Complete Phase Verification Script
# Checks that all files from BUILD_INSTRUCTIONS.md exist in correct order

echo "=============================================="
echo "Complete Build Instructions Verification"
echo "Checking all phases against BUILD_INSTRUCTIONS.md"
echo "=============================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

total_checks=0
passed_checks=0
failed_checks=0

check_file() {
    ((total_checks++))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        ((passed_checks++))
        return 0
    else
        echo -e "${RED}❌${NC} $1 (MISSING)"
        ((failed_checks++))
        return 1
    fi
}

check_dir() {
    ((total_checks++))
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        ((passed_checks++))
        return 0
    else
        echo -e "${RED}❌${NC} $1/ (MISSING)"
        ((failed_checks++))
        return 1
    fi
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 1: Project Initialization${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Step 1.1: Directory Structure"
echo "------------------------------"
check_dir "src/app"
check_dir "src/server"
check_dir "src/components"
check_dir "src/hooks"
check_dir "src/lib"
check_dir "src/types"
check_dir "src/app/(dashboard)"
check_dir "src/app/tools"
check_dir "src/app/api"
check_dir "src/app/(dashboard)/knowledge"
check_dir "src/app/(dashboard)/analytics"
check_dir "src/app/(dashboard)/workspaces"
check_dir "src/app/(dashboard)/settings"
check_dir "src/app/(dashboard)/admin"
check_dir "src/app/tools/_components"
check_dir "src/app/tools/_templates"
check_dir "src/app/tools/airia-chat"
check_dir "src/server/controllers"
check_dir "src/server/middleware"
check_dir "src/server/routes"
check_dir "src/server/lib"
check_dir "src/server/lib/supabase"
check_dir "supabase/migrations"
check_dir "public"
echo ""

echo "Step 1.2: Configuration Files"
echo "------------------------------"
check_file "package.json"
check_file "tsconfig.json"
check_file "tsconfig.node.json"
check_file "vite.config.ts"
check_file "tailwind.config.js"
check_file "postcss.config.js"
check_file ".env.example"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 2: Database Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Step 2.1-2.3: Migration Files"
echo "------------------------------"
check_file "supabase/migrations/001_initial_schema.sql"
check_file "supabase/migrations/002_functions.sql"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 3: Environment Configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Step 3.1: .env File"
echo "------------------------------"
if [ -f ".env" ]; then
    echo -e "${GREEN}✅${NC} .env (exists)"
    ((total_checks++))
    ((passed_checks++))
else
    echo -e "${YELLOW}⚠️${NC}  .env (should be created from .env.example)"
    ((total_checks++))
    ((failed_checks++))
fi
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 4: Type Definitions${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Step 4.1: Database Types"
echo "------------------------------"
check_file "src/types/database.ts"
echo ""

echo "Step 4.2: Request Types"
echo "------------------------------"
check_file "src/types/requests.ts"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 5: Backend Foundation${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Step 5.1: Supabase Server Client"
echo "------------------------------"
check_file "src/server/lib/supabase/server.ts"
echo ""

echo "Step 5.2: Middleware (IN ORDER)"
echo "------------------------------"
check_file "src/server/middleware/authMiddleware.ts"
check_file "src/server/middleware/roleMiddleware.ts"
check_file "src/server/middleware/validationMiddleware.ts"
check_file "src/server/middleware/errorHandler.ts"
check_file "src/server/middleware/toolAccessMiddleware.ts"
echo ""

echo "Step 5.3: Validation Schemas (IN ORDER)"
echo "------------------------------"
check_file "src/server/schemas/userSchemas.ts"
check_file "src/server/schemas/workspaceSchemas.ts"
check_file "src/server/schemas/toolSchemas.ts"
check_file "src/server/schemas/toolAccessSchemas.ts"
echo ""

echo "Step 5.4: Controllers (IN ORDER)"
echo "------------------------------"
check_file "src/server/controllers/authController.ts"
check_file "src/server/controllers/userController.ts"
check_file "src/server/controllers/organizationController.ts"
check_file "src/server/controllers/workspaceController.ts"
check_file "src/server/controllers/toolController.ts"
check_file "src/server/controllers/toolAccessController.ts"
check_file "src/server/controllers/analyticsController.ts"
check_file "src/server/controllers/documentController.ts"
echo ""

echo "Step 5.5: TypeScript Server Config"
echo "------------------------------"
check_file "tsconfig.server.json"
echo ""

echo "Step 5.6: Routes"
echo "------------------------------"
check_file "src/server/routes/index.ts"
echo ""

echo "Step 5.7: Server Entry Point"
echo "------------------------------"
check_file "src/server/index.ts"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 6: Frontend Foundation${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Step 6.1: Supabase Browser Client"
echo "------------------------------"
check_file "src/lib/supabase/client.ts"
echo ""

echo "Step 6.2: Context Providers (IN ORDER)"
echo "------------------------------"
check_file "src/lib/context/UserContext.tsx"
check_file "src/lib/context/WorkspaceContext.tsx"
check_file "src/lib/context/ToolsContext.tsx"
echo ""

echo "Step 6.3: Custom Hooks (IN ORDER)"
echo "------------------------------"
check_file "src/hooks/useUser.ts"
check_file "src/hooks/useTools.ts"
check_file "src/hooks/useWorkspaces.ts"
check_file "src/hooks/useAnalytics.ts"
check_file "src/hooks/useToolExecution.ts"
echo ""

echo "Step 6.4: Shared Components"
echo "------------------------------"
echo "Layout Components:"
check_file "src/components/layout/DashboardLayout.tsx"
check_file "src/components/layout/TopNav.tsx"
check_file "src/components/layout/Sidebar.tsx"
check_file "src/components/layout/WorkspaceSelector.tsx"
echo ""
echo "UI Components (shadcn/ui):"
check_file "src/components/ui/button.tsx"
check_file "src/components/ui/card.tsx"
check_file "src/components/ui/input.tsx"
check_file "src/components/ui/select.tsx"
check_file "src/components/ui/dialog.tsx"
check_file "src/components/ui/badge.tsx"
check_file "src/components/ui/tabs.tsx"
check_file "src/lib/utils.ts"
echo ""
echo "Tool Components:"
check_file "src/components/tools/ToolCard.tsx"
check_file "src/components/tools/ToolGrid.tsx"
check_file "src/components/tools/ToolFilters.tsx"
check_file "src/components/tools/StreamingResponse.tsx"
echo ""
echo "Analytics Components:"
check_file "src/components/analytics/SimpleAnalyticsCard.tsx"
check_file "src/components/analytics/DetailedAnalyticsDashboard.tsx"
check_file "src/components/analytics/SystemAnalyticsDashboard.tsx"
echo ""
echo "Admin Components:"
check_file "src/components/admin/OrgList.tsx"
check_file "src/components/admin/OrgDetails.tsx"
check_file "src/components/admin/ToolAccessManager.tsx"
check_file "src/components/admin/CreateToolForm.tsx"
echo ""

echo "Step 6.5: Pages (IN ORDER)"
echo "------------------------------"
check_file "src/app/page.tsx"
check_file "src/app/(dashboard)/page.tsx"
check_file "src/app/tools/[slug]/page.tsx"
check_file "src/app/(dashboard)/knowledge/page.tsx"
check_file "src/app/(dashboard)/analytics/page.tsx"
check_file "src/app/(dashboard)/workspaces/page.tsx"
check_file "src/app/(dashboard)/settings/page.tsx"
check_file "src/app/(dashboard)/admin/page.tsx"
echo ""

echo "Step 6.6: Main App"
echo "------------------------------"
check_file "src/App.tsx"
check_file "src/main.tsx"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 7: Integration & Testing${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Step 7.1: Clerk Webhook Middleware"
echo "------------------------------"
check_file "src/server/middleware/clerkWebhookMiddleware.ts"
echo ""

echo "Helper Scripts"
echo "------------------------------"
check_file "scripts/verify-env.sh"
check_file "scripts/start-dev.sh"
check_file "scripts/test-data-setup.sql"
check_file "scripts/phase7-check.sh"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}ADDITIONAL FILES (Not in BUILD_INSTRUCTIONS)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Additional Config Files"
echo "------------------------------"
check_file "components.json"
check_file "vercel.json"
check_file "vitest.config.ts"
check_file "eslint.config.js"
echo ""

echo "Additional Scripts"
echo "------------------------------"
check_file "scripts/bump-version.js"
check_file "scripts/verify-database.ts"
check_file "scripts/create-template-zip.sh"
echo ""

echo "=============================================="
echo "SUMMARY"
echo "=============================================="
echo -e "${GREEN}✅ Passed:${NC} $passed_checks / $total_checks"
echo -e "${RED}❌ Failed:${NC} $failed_checks / $total_checks"
echo ""

if [ $failed_checks -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL FILES VERIFIED!${NC}"
    echo -e "${GREEN}All files from BUILD_INSTRUCTIONS.md exist.${NC}"
    exit 0
elif [ $failed_checks -eq 1 ] && [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Almost Perfect!${NC}"
    echo -e "${YELLOW}Only missing .env file (expected - user creates this).${NC}"
    echo ""
    echo "To create .env:"
    echo "  cp .env.example .env"
    echo "  # Then edit with your credentials"
    exit 0
else
    echo -e "${RED}❌ MISSING FILES DETECTED${NC}"
    echo ""
    echo "Some required files are missing."
    echo "Review the failed checks above and create missing files."
    exit 1
fi
