# 📋 TESTING COMPLIANCE CHECKLIST

## Quick Reference for OrdoAgentForge Testing Status

**Last Updated:** 2024  
**Overall Compliance:** 🔴 **16.7%** (6 of 36+ files)

---

## ✅ COMPLETED

### Test Infrastructure (4/4 files - 100%)

- [x] `vitest.config.ts` - Fully configured
- [x] `src/__tests__/setup.ts` - Global mocks and utilities
- [x] `src/__tests__/utils/testUtils.tsx` - Custom render helpers
- [x] `src/__tests__/mocks/` - All 3 mock files created

### Phase 1: Project Setup (1/1 files - 100%)

- [x] `src/__tests__/project-setup.test.ts` - Config and structure verification

### Phase 6: Frontend Components (1/15+ files - ~7%)

- [x] `src/App.test.tsx` - Basic App component tests (has Clerk mock issues to fix)

---

## ❌ MISSING - CRITICAL PRIORITY

### 🚨 Phase 5: Backend Integration (0/1 files - 0%)

**⚠️ HIGHEST PRIORITY - MUST BE DONE FIRST**

- [ ] `src/server/__tests__/integration/critical-flows.integration.test.ts`
  - [ ] Test: Tool access via organization assignment
  - [ ] Test: Tool access via workspace assignment
  - [ ] Test: Tool access via individual assignment
  - [ ] Test: **CRITICAL** - Additive access (all 3 paths simultaneously)
  - [ ] Test: **CRITICAL** - Access persists when one path removed
  - [ ] Test: Deduplication (tool appears once despite multiple paths)
  - [ ] Test: access_type returned correctly
  - [ ] Test: Non-members cannot access organization tools
  - [ ] Test: Non-workspace-members cannot access workspace tools

**Why Critical:** Per PHASED_TESTING_STRATEGY.md:

> "Test the MOST CRITICAL flow first: Additive Tool Access"
> "If this test fails, DO NOT proceed to frontend! Fix backend first."

---

## ❌ MISSING - HIGH PRIORITY

### Phase 2: Database Setup (0/1 files - 0%)

- [ ] `src/server/__tests__/database/schema-verification.test.ts`
  - [ ] Test: All 8 tables exist (users, organizations, workspaces, workspace_members, tools, tool_access, documents, usage_analytics)
  - [ ] Test: Foreign keys configured correctly
  - [ ] Test: Indexes created
  - [ ] Test: Triggers working (update_updated_at_column)
  - [ ] Test: get_user_tools function exists and works
  - [ ] Test: check_tool_access function exists and works
  - [ ] Test: get_workspace_analytics function exists and works
  - [ ] Test: get_organization_analytics function exists and works
  - [ ] Test: RLS enabled on all tables
  - [ ] Test: Storage bucket 'documents' exists

### Phase 3: Backend Middleware (0/5 files - 0%)

- [ ] `src/server/middleware/authMiddleware.test.ts`
  - [ ] Test: Attach user to request with valid token
  - [ ] Test: Return 401 with missing token
  - [ ] Test: Return 401 with invalid token
  - [ ] Test: Return 401 when user not found
  - [ ] Test: Verify Clerk session correctly
  - [ ] Test: Query Supabase users table

- [ ] `src/server/middleware/roleMiddleware.test.ts`
  - [ ] Test: Allow access for matching role
  - [ ] Test: Deny access for non-matching role
  - [ ] Test: Work as factory function (requireRole('ADMIN'))
  - [ ] Test: Handle multiple allowed roles
  - [ ] Test: Return 403 for insufficient permissions

- [ ] `src/server/middleware/toolAccessMiddleware.test.ts`
  - [ ] Test: Allow access when check_tool_access returns true
  - [ ] Test: Deny access when check_tool_access returns false
  - [ ] Test: Call check_tool_access with correct parameters
  - [ ] Test: Handle database errors gracefully
  - [ ] Test: Work for organization-level access
  - [ ] Test: Work for workspace-level access
  - [ ] Test: Work for individual-level access

- [ ] `src/server/middleware/validationMiddleware.test.ts`
  - [ ] Test: Validate request body with Zod schema
  - [ ] Test: Return 400 with validation errors
  - [ ] Test: Pass through valid data
  - [ ] Test: Format Zod errors correctly
  - [ ] Test: Validate query params
  - [ ] Test: Validate path params

- [ ] `src/server/middleware/errorHandler.test.ts`
  - [ ] Test: Catch and format errors
  - [ ] Test: Return 500 for unknown errors
  - [ ] Test: Preserve status codes from known errors
  - [ ] Test: Not leak sensitive info in production
  - [ ] Test: Log errors properly

### Phase 4: Backend Controllers (0/8 files - 0%)

- [ ] `src/server/controllers/AuthController.test.ts`
  - [ ] Test: handleWebhook with user.created event
  - [ ] Test: handleWebhook with user.updated event
  - [ ] Test: handleWebhook with user.deleted event
  - [ ] Test: getCurrentUser returns user data
  - [ ] Test: updateCurrentUser updates user
  - [ ] Test: Webhook signature verification

- [ ] `src/server/controllers/OrganizationController.test.ts`
  - [ ] Test: createOrganization (SYSTEM_ADMIN only)
  - [ ] Test: listOrganizations
  - [ ] Test: getOrganization
  - [ ] Test: updateOrganization (ORG_OWNER or SYSTEM_ADMIN)
  - [ ] Test: deleteOrganization (SYSTEM_ADMIN only)

- [ ] `src/server/controllers/WorkspaceController.test.ts`
  - [ ] Test: createWorkspace (ORG_OWNER or WORKSPACE_ADMIN)
  - [ ] Test: getUserWorkspaces
  - [ ] Test: getWorkspace
  - [ ] Test: updateWorkspace (WORKSPACE_ADMIN)
  - [ ] Test: deleteWorkspace
  - [ ] Test: addMember
  - [ ] Test: removeMember

- [ ] `src/server/controllers/UserController.test.ts`
  - [ ] Test: createUser triggers Clerk invitation
  - [ ] Test: listUsers (filtered by organization)
  - [ ] Test: getUser
  - [ ] Test: updateUser (role changes)
  - [ ] Test: deleteUser (cascade to workspace_members, tool_access)

- [ ] `src/server/controllers/ToolController.test.ts`
  - [ ] Test: getUserTools (calls get_user_tools function)
  - [ ] Test: createTool (SYSTEM_ADMIN only)
  - [ ] Test: getTool
  - [ ] Test: updateTool (SYSTEM_ADMIN only)
  - [ ] Test: deleteTool (cascade to tool_access)
  - [ ] Test: executeTool with streaming response
  - [ ] Test: executeTool logs usage_analytics

- [ ] `src/server/controllers/ToolAccessController.test.ts`
  - [ ] Test: assignToOrganization (SYSTEM_ADMIN only)
  - [ ] Test: assignToWorkspace (ORG_OWNER or WORKSPACE_ADMIN)
  - [ ] Test: assignToUser (ORG_OWNER or WORKSPACE_ADMIN)
  - [ ] Test: removeAccess
  - [ ] Test: getAccessAudit (shows all assignments)

- [ ] `src/server/controllers/DocumentController.test.ts`
  - [ ] Test: uploadDocument to Supabase Storage
  - [ ] Test: listDocuments (filtered by organization/tool)
  - [ ] Test: getDocument (with RLS check)
  - [ ] Test: deleteDocument
  - [ ] Test: Global vs agent-specific documents

- [ ] `src/server/controllers/AnalyticsController.test.ts`
  - [ ] Test: getUserAnalytics (MEMBER - 3 simple metrics, no cost)
  - [ ] Test: getWorkspaceAnalytics (WORKSPACE_ADMIN - detailed, no cost)
  - [ ] Test: getOrganizationAnalytics (ORG_OWNER - detailed, no cost)
  - [ ] Test: getSystemAnalytics (SYSTEM_ADMIN - all data with cost)

---

## ❌ MISSING - MEDIUM PRIORITY

### Phase 6: Frontend Components (14/15+ files - ~7%)

**Layout Components:**

- [ ] `src/components/layout/DashboardLayout.test.tsx`
  - [ ] Test: Renders with correct structure
  - [ ] Test: Shows TopNav and Sidebar
  - [ ] Test: Renders children content
  - [ ] Test: Responsive behavior

- [ ] `src/components/layout/TopNav.test.tsx`
  - [ ] Test: Shows user info
  - [ ] Test: UserButton renders
  - [ ] Test: Workspace selector visible
  - [ ] Test: Navigation links work

- [ ] `src/components/layout/Sidebar.test.tsx`
  - [ ] Test: Shows all navigation items
  - [ ] Test: Highlights active route
  - [ ] Test: Admin section only for admins
  - [ ] Test: Collapsible on mobile

- [ ] `src/components/layout/WorkspaceSelector.test.tsx`
  - [ ] Test: Lists user's workspaces
  - [ ] Test: Switches workspace on selection
  - [ ] Test: Shows current workspace
  - [ ] Test: Create new workspace button (if ORG_OWNER)

**Tool Components:**

- [ ] `src/components/tools/ToolCard.test.tsx`
  - [ ] Test: Renders tool information
  - [ ] Test: Navigates to tool page on click
  - [ ] Test: Displays access type badge
  - [ ] Test: Handles missing optional fields
  - [ ] Test: Shows tool icon
  - [ ] Test: Displays tags

- [ ] `src/components/tools/ToolGrid.test.tsx`
  - [ ] Test: Renders list of tools
  - [ ] Test: Empty state when no tools
  - [ ] Test: Filters apply correctly
  - [ ] Test: Grid layout responsive

- [ ] `src/components/tools/ToolFilters.test.tsx`
  - [ ] Test: Filter by type
  - [ ] Test: Filter by tags
  - [ ] Test: Filter by access type
  - [ ] Test: Clear filters button

- [ ] `src/components/tools/StreamingResponse.test.tsx`
  - [ ] Test: Shows loading state
  - [ ] Test: Streams text progressively
  - [ ] Test: Shows complete message
  - [ ] Test: Handles errors
  - [ ] Test: Copy to clipboard button

**Analytics Components:**

- [ ] `src/components/analytics/SimpleAnalyticsCard.test.tsx`
  - [ ] Test: Shows total runs
  - [ ] Test: Shows last used date
  - [ ] Test: Shows favorite tool
  - [ ] Test: Does NOT show cost data
  - [ ] Test: Formats numbers correctly

- [ ] `src/components/analytics/DetailedAnalyticsDashboard.test.tsx`
  - [ ] Test: Shows detailed metrics
  - [ ] Test: Charts render
  - [ ] Test: Does NOT show cost data (for ORG_OWNER)
  - [ ] Test: Date range selector works

- [ ] `src/components/analytics/SystemAnalyticsDashboard.test.tsx`
  - [ ] Test: Shows all system metrics
  - [ ] Test: DOES show cost data (SYSTEM_ADMIN only)
  - [ ] Test: Organization breakdown
  - [ ] Test: Export data button

**Admin Components:**

- [ ] `src/components/admin/OrgList.test.tsx`
  - [ ] Test: Lists all organizations
  - [ ] Test: Search functionality
  - [ ] Test: Click navigates to details
  - [ ] Test: Create organization button (SYSTEM_ADMIN)

- [ ] `src/components/admin/OrgDetails.test.tsx`
  - [ ] Test: Shows organization info
  - [ ] Test: Edit organization (SYSTEM_ADMIN)
  - [ ] Test: List members
  - [ ] Test: List workspaces
  - [ ] Test: Delete organization (with confirmation)

- [ ] `src/components/admin/ToolAccessManager.test.tsx`
  - [ ] Test: Shows all tools
  - [ ] Test: Assign to organization
  - [ ] Test: Assign to workspace
  - [ ] Test: Assign to user
  - [ ] Test: Remove access
  - [ ] Test: Shows access audit trail

- [ ] `src/components/admin/CreateToolForm.test.tsx`
  - [ ] Test: Form validation
  - [ ] Test: Submit creates tool
  - [ ] Test: Handles errors
  - [ ] Test: Internal vs external tool type
  - [ ] Test: Icon upload

### Phase 7: End-to-End Workflows (0/3 files - 0%)

- [ ] `src/__tests__/e2e/member-complete-workflow.e2e.test.ts`
  - [ ] Test: Login as member
  - [ ] Test: Dashboard loads with assigned tools
  - [ ] Test: Click tool and execute with input
  - [ ] Test: Streaming response displays
  - [ ] Test: Check analytics (verify no cost data visible)
  - [ ] Test: Upload document to knowledge base
  - [ ] Test: View workspace settings

- [ ] `src/__tests__/e2e/org-owner-workflow.e2e.test.ts`
  - [ ] Test: Login as org owner
  - [ ] Test: Create new workspace
  - [ ] Test: Invite member to workspace
  - [ ] Test: Assign tool to workspace
  - [ ] Test: View detailed analytics (no cost data)
  - [ ] Test: Manage workspace members
  - [ ] Test: View organization settings

- [ ] `src/__tests__/e2e/system-admin-workflow.e2e.test.ts`
  - [ ] Test: Login as system admin
  - [ ] Test: Create new organization
  - [ ] Test: Create new tool
  - [ ] Test: Assign tool to organization
  - [ ] Test: View system analytics (with cost data)
  - [ ] Test: Manage all organizations
  - [ ] Test: Access all admin features

---

## 🔧 ISSUES TO FIX

- [ ] Fix Clerk mock in `src/App.test.tsx` (currently failing)
- [ ] Verify all exports in `src/__tests__/setup.ts` work correctly

---

## 📊 VERIFICATION COMMANDS

### Run Tests by Phase

```bash
# Phase 1 - Setup
npm run test src/__tests__/project-setup.test.ts

# Phase 2 - Database
npm run test src/server/__tests__/database/

# Phase 3 - Middleware
npm run test src/server/middleware/

# Phase 4 - Controllers
npm run test src/server/controllers/

# Phase 5 - Integration (CRITICAL)
npm run test src/server/__tests__/integration/

# Phase 6 - Components
npm run test src/components/

# Phase 7 - E2E
npm run test src/__tests__/e2e/

# All tests
npm run test

# Coverage report
npm run test:coverage
```

### Success Criteria

- [ ] All phases pass: `npm run test`
- [ ] Coverage ≥ 85%: `npm run test:coverage`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Critical flows pass: `npm run test src/server/__tests__/integration/`
- [ ] E2E workflows pass: `npm run test src/__tests__/e2e/`

---

## 🎯 RECOMMENDED ORDER

1. **Fix existing** - App.test.tsx Clerk mock
2. **CRITICAL FIRST** - Phase 5 integration tests (additive tool access)
3. **Backend** - Phase 3 middleware tests
4. **Backend** - Phase 4 controller tests
5. **Database** - Phase 2 schema verification
6. **Frontend** - Phase 6 component tests
7. **E2E** - Phase 7 workflow tests
8. **Coverage** - Review and fill gaps

---

**Track Progress:** Update this file as tests are created.
**Goal:** 100% compliance before production deployment.
**Current Status:** 🔴 16.7% (6/36+ files)
**Target Status:** 🟢 100% (36+/36+ files)
