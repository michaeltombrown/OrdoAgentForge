#!/bin/bash
# Comprehensive BUILD_INSTRUCTIONS.md Compliance Audit
# Generated: February 7, 2026

echo "=============================================="
echo "COMPREHENSIVE BUILD_INSTRUCTIONS.md AUDIT"
echo "=============================================="
echo ""

PASS=0
FAIL=0
WARN=0

check_pass() {
    echo "  ✅ $1"
    ((PASS++))
}

check_fail() {
    echo "  ❌ $1"
    ((FAIL++))
}

check_warn() {
    echo "  ⚠️  $1"
    ((WARN++))
}

echo "PHASE 1: PROJECT INITIALIZATION"
echo "================================"
echo ""

echo "Step 1.1: Directory Structure"
echo "------------------------------"

REQUIRED_DIRS=(
    "src/app"
    "src/server"
    "src/components"
    "src/hooks"
    "src/lib"
    "src/types"
    "src/app/(dashboard)"
    "src/app/tools"
    "src/app/api"
    "src/app/(dashboard)/knowledge"
    "src/app/(dashboard)/analytics"
    "src/app/(dashboard)/workspaces"
    "src/app/(dashboard)/settings"
    "src/app/(dashboard)/admin"
    "src/app/tools/_components"
    "src/app/tools/_templates"
    "src/app/tools/airia-chat"
    "src/app/tools/[slug]"
    "src/server/controllers"
    "src/server/middleware"
    "src/server/routes"
    "src/server/lib"
    "src/server/lib/supabase"
    "src/server/schemas"
    "supabase/migrations"
    "public"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        check_pass "$dir exists"
    else
        check_fail "$dir MISSING"
    fi
done

echo ""
echo "Step 1.2: Configuration Files"
echo "------------------------------"

REQUIRED_CONFIG=(
    "package.json"
    "tsconfig.json"
    "tsconfig.node.json"
    "vite.config.ts"
    "tailwind.config.js"
    "postcss.config.js"
    ".env.example"
)

for file in "${REQUIRED_CONFIG[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$file exists"
    else
        check_fail "$file MISSING"
    fi
done

echo ""
echo "PHASE 2: DATABASE SETUP"
echo "======================="
echo ""

echo "Step 2.1-2.4: Migration Files"
echo "------------------------------"

REQUIRED_MIGRATIONS=(
    "supabase/migrations/001_initial_schema.sql"
    "supabase/migrations/002_functions.sql"
    "supabase/migrations/003_rls.sql"
)

for file in "${REQUIRED_MIGRATIONS[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$file exists"
    else
        check_fail "$file MISSING"
    fi
done

echo ""
echo "PHASE 3: ENVIRONMENT CONFIGURATION"
echo "==================================="
echo ""

if [ -f ".env" ]; then
    check_pass ".env file exists"
    
    ENV_VARS=(
        "SUPABASE_URL"
        "SUPABASE_SERVICE_ROLE_KEY"
        "VITE_SUPABASE_URL"
        "VITE_SUPABASE_ANON_KEY"
        "CLERK_SECRET_KEY"
        "VITE_CLERK_PUBLISHABLE_KEY"
        "CLERK_WEBHOOK_SECRET"
        "AIRIA_API_KEY"
        "NODE_ENV"
        "PORT"
        "FRONTEND_URL"
    )
    
    for var in "${ENV_VARS[@]}"; do
        if grep -q "^$var=" .env; then
            check_pass "$var configured"
        else
            check_fail "$var MISSING in .env"
        fi
    done
else
    check_fail ".env file MISSING"
fi

echo ""
echo "PHASE 4: TYPE DEFINITIONS"
echo "========================="
echo ""

TYPE_FILES=(
    "src/types/database.ts"
    "src/types/requests.ts"
)

for file in "${TYPE_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$file exists"
    else
        check_fail "$file MISSING"
    fi
done

echo ""
echo "PHASE 5: BACKEND FOUNDATION"
echo "==========================="
echo ""

echo "Step 5.1: Supabase Server Client"
echo "---------------------------------"
if [ -f "src/server/lib/supabase/server.ts" ]; then
    check_pass "Supabase server client exists"
else
    check_fail "Supabase server client MISSING"
fi

echo ""
echo "Step 5.2: Middleware (Required Order)"
echo "--------------------------------------"

REQUIRED_MIDDLEWARE=(
    "src/server/middleware/errorHandler.ts"
    "src/server/middleware/authMiddleware.ts"
    "src/server/middleware/roleMiddleware.ts"
    "src/server/middleware/toolAccessMiddleware.ts"
    "src/server/middleware/validationMiddleware.ts"
)

for file in "${REQUIRED_MIDDLEWARE[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$(basename $file) exists"
    else
        check_fail "$(basename $file) MISSING"
    fi
done

echo ""
echo "Step 5.3: Validation Schemas"
echo "----------------------------"

REQUIRED_SCHEMAS=(
    "src/server/schemas/workspaceSchemas.ts"
    "src/server/schemas/toolSchemas.ts"
    "src/server/schemas/toolAccessSchemas.ts"
    "src/server/schemas/userSchemas.ts"
)

for file in "${REQUIRED_SCHEMAS[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$(basename $file) exists"
    else
        check_fail "$(basename $file) MISSING"
    fi
done

echo ""
echo "Step 5.4: Controllers (Required Order)"
echo "---------------------------------------"

REQUIRED_CONTROLLERS=(
    "src/server/controllers/authController.ts"
    "src/server/controllers/organizationController.ts"
    "src/server/controllers/workspaceController.ts"
    "src/server/controllers/userController.ts"
    "src/server/controllers/toolController.ts"
    "src/server/controllers/toolAccessController.ts"
    "src/server/controllers/documentController.ts"
    "src/server/controllers/analyticsController.ts"
)

for file in "${REQUIRED_CONTROLLERS[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$(basename $file) exists"
    else
        check_fail "$(basename $file) MISSING"
    fi
done

echo ""
echo "Step 5.5-5.6: Routes and Server"
echo "--------------------------------"

if [ -f "src/server/routes/index.ts" ]; then
    check_pass "Routes file exists"
else
    check_fail "Routes file MISSING"
fi

if [ -f "src/server/index.ts" ]; then
    check_pass "Server entry point exists"
else
    check_fail "Server entry point MISSING"
fi

echo ""
echo "PHASE 6: FRONTEND FOUNDATION"
echo "============================"
echo ""

echo "Step 6.1: Supabase Client"
echo "-------------------------"
if [ -f "src/lib/supabase/client.ts" ]; then
    check_pass "Supabase client exists"
else
    check_fail "Supabase client MISSING"
fi

echo ""
echo "Step 6.2: React Context"
echo "-----------------------"

REQUIRED_CONTEXTS=(
    "src/lib/context/UserContext.tsx"
    "src/lib/context/WorkspaceContext.tsx"
    "src/lib/context/ToolsContext.tsx"
)

for file in "${REQUIRED_CONTEXTS[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$(basename $file) exists"
    else
        check_fail "$(basename $file) MISSING"
    fi
done

echo ""
echo "Step 6.3: Custom Hooks"
echo "----------------------"

REQUIRED_HOOKS=(
    "src/hooks/useUser.ts"
    "src/hooks/useTools.ts"
    "src/hooks/useWorkspaces.ts"
    "src/hooks/useAnalytics.ts"
    "src/hooks/useToolExecution.ts"
)

for file in "${REQUIRED_HOOKS[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$(basename $file) exists"
    else
        check_fail "$(basename $file) MISSING"
    fi
done

echo ""
echo "Step 6.4: Layout Components"
echo "---------------------------"

REQUIRED_LAYOUT=(
    "src/components/layout/DashboardLayout.tsx"
    "src/components/layout/TopNav.tsx"
    "src/components/layout/Sidebar.tsx"
    "src/components/layout/WorkspaceSelector.tsx"
)

for file in "${REQUIRED_LAYOUT[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$(basename $file) exists"
    else
        check_fail "$(basename $file) MISSING"
    fi
done

echo ""
echo "Step 6.5: Pages"
echo "---------------"

REQUIRED_PAGES=(
    "src/app/layout.tsx"
    "src/app/page.tsx"
    "src/app/(dashboard)/layout.tsx"
    "src/app/(dashboard)/page.tsx"
    "src/app/tools/[slug]/page.tsx"
    "src/app/(dashboard)/knowledge/page.tsx"
    "src/app/(dashboard)/analytics/page.tsx"
    "src/app/(dashboard)/workspaces/page.tsx"
    "src/app/(dashboard)/settings/page.tsx"
    "src/app/(dashboard)/admin/page.tsx"
)

for file in "${REQUIRED_PAGES[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$(basename $file) exists"
    else
        check_fail "$(basename $file) MISSING"
    fi
done

echo ""
echo "PHASE 8: BUILD & DEPLOY"
echo "======================="
echo ""

echo "Step 8.1: Production Build"
echo "--------------------------"
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    check_pass "Production build succeeds"
else
    check_fail "Production build FAILS"
fi

echo ""
echo "Step 8.2: Linter"
echo "----------------"
npx eslint src --ext ts,tsx 2>&1 | grep -q "0 errors" 
if [ $? -eq 0 ]; then
    check_pass "Linter shows 0 errors"
else
    check_fail "Linter has errors"
fi

echo ""
echo "Step 8.3: Tests"
echo "---------------"
npx vitest run > /dev/null 2>&1
if [ $? -eq 0 ]; then
    check_pass "All tests pass"
else
    check_fail "Tests FAIL"
fi

echo ""
echo "Step 8.4: TypeScript Compilation"
echo "---------------------------------"
npx tsc --noEmit > /dev/null 2>&1
if [ $? -eq 0 ]; then
    check_pass "TypeScript compiles with 0 errors"
else
    check_fail "TypeScript has compilation errors"
fi

echo ""
echo "=============================================="
echo "AUDIT SUMMARY"
echo "=============================================="
echo ""
echo "✅ Passed: $PASS"
echo "❌ Failed: $FAIL"
echo "⚠️  Warnings: $WARN"
echo ""

TOTAL=$((PASS + FAIL + WARN))
SCORE=$((PASS * 100 / TOTAL))

echo "Compliance Score: $SCORE%"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 STATUS: ✅ FULLY COMPLIANT"
    echo ""
    echo "All BUILD_INSTRUCTIONS.md requirements met!"
    exit 0
else
    echo "⚠️  STATUS: ISSUES FOUND"
    echo ""
    echo "Please address the failed checks above."
    exit 1
fi
