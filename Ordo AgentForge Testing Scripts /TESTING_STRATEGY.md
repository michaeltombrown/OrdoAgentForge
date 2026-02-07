# 🧪 COMPREHENSIVE TESTING STRATEGY & AI PROMPTS

# Multi-Tenant AI Dashboard - Complete Test Suite

## 📋 TESTING FRAMEWORK OVERVIEW

Your testing stack:

- **Vitest**: Fast unit test runner
- **@vitest/ui**: Visual test interface
- **@vitest/coverage-v8**: Code coverage reporting
- **happy-dom**: Lightweight DOM for testing
- **@testing-library/react**: React component testing
- **@testing-library/user-event**: User interaction simulation

---

## 🎯 TESTING STRATEGY

### Testing Pyramid

```
        /\
       /E2E\          10% - End-to-End (User Workflows)
      /------\
     /Integration\    30% - Integration (API + DB)
    /------------\
   /  Unit Tests  \   60% - Unit (Functions + Components)
  /----------------\
```

### Coverage Goals

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **E2E Tests**: Critical user paths only
- **Overall**: 85%+ code coverage

---

## 📁 TEST FILE STRUCTURE

```
src/
├── server/
│   ├── controllers/
│   │   ├── AuthController.ts
│   │   └── AuthController.test.ts          ← Unit tests
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   └── authMiddleware.test.ts
│   └── __tests__/
│       ├── integration/
│       │   ├── auth.integration.test.ts    ← API integration
│       │   ├── tools.integration.test.ts
│       │   └── workspaces.integration.test.ts
│       └── e2e/
│           └── user-workflows.e2e.test.ts  ← End-to-end
├── components/
│   ├── ToolCard.tsx
│   └── ToolCard.test.tsx                   ← Component tests
└── __tests__/
    └── setup.ts                             ← Test configuration
```

---

## 🤖 AI PROMPT 1: TEST SETUP & CONFIGURATION

````markdown
# PROMPT: Create Test Configuration

I need you to create the complete test setup for our multi-tenant AI dashboard.

## Requirements:

### 1. Create vitest.config.ts

- Configure for TypeScript
- Set up happy-dom environment
- Configure path aliases (@/ imports)
- Set up coverage thresholds (85% minimum)
- Include/exclude patterns
- Mock Supabase client
- Mock Clerk authentication

### 2. Create src/**tests**/setup.ts

- Configure @testing-library/react
- Set up global test utilities
- Mock environment variables
- Mock fetch API
- Configure test database (use test Supabase project or mock)

### 3. Create src/**tests**/utils/testUtils.tsx

- Custom render function with all providers
- Mock user context
- Mock workspace context
- Mock tools context
- Helper functions for common test scenarios

### 4. Create src/**tests**/mocks/

- supabaseMock.ts - Mock Supabase client
- clerkMock.ts - Mock Clerk authentication
- apiMocks.ts - Mock API responses

## Example Structure:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/types/**',
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```
````

Please create all configuration files with comprehensive mocking setup.

````

---

## 🤖 AI PROMPT 2: BACKEND UNIT TESTS

```markdown
# PROMPT: Create Backend Unit Tests

Create comprehensive unit tests for ALL backend components.

## Test Files to Create:

### 1. Middleware Tests

#### src/server/middleware/authMiddleware.test.ts
Test cases:
- ✅ Should attach user to request with valid Clerk token
- ✅ Should return 401 with missing token
- ✅ Should return 401 with invalid token
- ✅ Should return 401 when user not found in database
- ✅ Should handle Clerk API errors gracefully
- ✅ Should validate token signature
- ✅ Should check token expiration

#### src/server/middleware/roleMiddleware.test.ts
Test cases:
- ✅ Should allow access for authorized roles
- ✅ Should deny access for unauthorized roles
- ✅ Should return 403 for missing role
- ✅ Should handle multiple allowed roles
- ✅ Should work with SYSTEM_ADMIN role
- ✅ Should work with ORG_OWNER role
- ✅ Should work with WORKSPACE_ADMIN role
- ✅ Should work with MEMBER role

#### src/server/middleware/toolAccessMiddleware.test.ts
Test cases:
- ✅ Should grant access for direct user assignment
- ✅ Should grant access for workspace membership
- ✅ Should grant access for organization membership
- ✅ Should deny access when no assignment exists
- ✅ Should call check_tool_access database function
- ✅ Should handle database errors
- ✅ Should validate tool ID format (UUID)

#### src/server/middleware/validationMiddleware.test.ts
Test cases:
- ✅ Should validate request body with Zod schema
- ✅ Should return 400 with validation errors
- ✅ Should pass valid data to next middleware
- ✅ Should handle nested object validation
- ✅ Should handle array validation
- ✅ Should provide detailed error messages

### 2. Controller Tests

#### src/server/controllers/ToolController.test.ts
Test cases:
- ✅ getUserTools: Should return user's accessible tools
- ✅ getUserTools: Should include access_type (individual/workspace/org)
- ✅ getUserTools: Should handle empty results
- ✅ getUserTools: Should handle database errors
- ✅ createTool: Should create tool with valid data (SYSTEM_ADMIN)
- ✅ createTool: Should reject non-admin users
- ✅ createTool: Should validate required fields
- ✅ createTool: Should generate unique slug
- ✅ executeTool: Should stream responses
- ✅ executeTool: Should verify tool access first
- ✅ executeTool: Should log usage to analytics
- ✅ executeTool: Should handle AI API errors

#### src/server/controllers/WorkspaceController.test.ts
Test cases:
- ✅ createWorkspace: Should create with valid data (ORG_OWNER)
- ✅ createWorkspace: Should enforce unique slug per org
- ✅ createWorkspace: Should reject non-owner users
- ✅ getUserWorkspaces: Should return user's workspaces
- ✅ getUserWorkspaces: Should include member counts
- ✅ addMember: Should add user to workspace
- ✅ addMember: Should prevent duplicate members
- ✅ addMember: Should verify user in same org
- ✅ removeMember: Should remove user from workspace
- ✅ removeMember: Should NOT remove individual tool access

#### src/server/controllers/ToolAccessController.test.ts
Test cases:
- ✅ assignToOrganization: Should work for SYSTEM_ADMIN
- ✅ assignToOrganization: Should reject non-admin
- ✅ assignToWorkspace: Should work for ORG_OWNER
- ✅ assignToWorkspace: Should verify workspace in owner's org
- ✅ assignToUser: Should work for ORG_OWNER
- ✅ assignToUser: Should verify user in owner's org
- ✅ assignToUser: Should create individual access record
- ✅ removeAccess: Should remove access by ID
- ✅ removeAccess: Should verify requester is granter or admin
- ✅ CHECK constraint: Should prevent multiple assignment types

#### src/server/controllers/AnalyticsController.test.ts
Test cases:
- ✅ getUserAnalytics: Should return simple metrics for MEMBER
- ✅ getUserAnalytics: Should include total runs
- ✅ getUserAnalytics: Should include top 3 tools
- ✅ getUserAnalytics: Should NOT include costs
- ✅ getWorkspaceAnalytics: Should return detailed metrics
- ✅ getWorkspaceAnalytics: Should verify workspace access
- ✅ getWorkspaceAnalytics: Should NOT include costs (unless SYSTEM_ADMIN)
- ✅ getSystemAnalytics: Should ONLY work for SYSTEM_ADMIN
- ✅ getSystemAnalytics: Should include cost breakdowns
- ✅ getSystemAnalytics: Should aggregate by org and tool

### 3. Database Function Tests

#### src/server/__tests__/unit/database-functions.test.ts
Test cases:
- ✅ get_user_tools: Should return tools for org assignment
- ✅ get_user_tools: Should return tools for workspace assignment
- ✅ get_user_tools: Should return tools for individual assignment
- ✅ get_user_tools: Should return correct access_type
- ✅ get_user_tools: Should deduplicate tools with multiple paths
- ✅ check_tool_access: Should return true for valid access
- ✅ check_tool_access: Should return false for no access
- ✅ get_workspace_member_count: Should count correctly

## Test Template:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ToolController } from './ToolController';
import { supabase } from '../lib/supabase/server';

// Mock Supabase
vi.mock('../lib/supabase/server', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

describe('ToolController', () => {
  describe('getUserTools', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return user tools with access types', async () => {
      const mockTools = [
        { tool_id: '1', tool_name: 'Tool 1', access_type: 'individual' },
        { tool_id: '2', tool_name: 'Tool 2', access_type: 'workspace' },
      ];

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockTools,
        error: null,
      });

      const req = { user: { id: 'user-123' } } as any;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as any;

      await ToolController.getUserTools(req, res);

      expect(supabase.rpc).toHaveBeenCalledWith('get_user_tools', {
        user_id_param: 'user-123',
      });
      expect(res.json).toHaveBeenCalledWith({ data: mockTools });
    });

    it('should handle database errors', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      });

      const req = { user: { id: 'user-123' } } as any;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as any;

      await ToolController.getUserTools(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch tools',
      });
    });
  });
});
````

Create ALL backend unit tests following this pattern.

````

---

## 🤖 AI PROMPT 3: FRONTEND COMPONENT TESTS

```markdown
# PROMPT: Create Frontend Component Tests

Create comprehensive tests for ALL React components.

## Test Files to Create:

### 1. Layout Component Tests

#### src/components/DashboardLayout.test.tsx
Test cases:
- ✅ Should render TopNav component
- ✅ Should render Sidebar component
- ✅ Should render children content
- ✅ Should apply correct layout classes
- ✅ Should handle responsive design
- ✅ Should load user context on mount
- ✅ Should redirect if not authenticated

#### src/components/TopNav.test.tsx
Test cases:
- ✅ Should display user email
- ✅ Should render WorkspaceSelector button
- ✅ Should open workspace modal on click
- ✅ Should render user menu dropdown
- ✅ Should handle logout action
- ✅ Should show current workspace name

#### src/components/Sidebar.test.tsx
Test cases:
- ✅ Should show role-appropriate navigation items
- ✅ MEMBER: Should see Tools, Knowledge, Analytics, Settings
- ✅ ORG_OWNER: Should see + Workspaces management
- ✅ WORKSPACE_ADMIN: Should see workspace management
- ✅ SYSTEM_ADMIN: Should see + Organizations, Global Tools, System
- ✅ Should highlight active route
- ✅ Should collapse on mobile

### 2. Tool Component Tests

#### src/components/ToolCard.test.tsx
Test cases:
- ✅ Should display tool name
- ✅ Should display tool description
- ✅ Should display tool icon
- ✅ Should display tool tags
- ✅ Should show access indicator (individual/workspace/org)
- ✅ Should navigate to tool page on click
- ✅ Should handle missing optional fields gracefully
- ✅ Should apply hover styles

#### src/components/ToolGrid.test.tsx
Test cases:
- ✅ Should render grid of ToolCards
- ✅ Should display loading skeleton while fetching
- ✅ Should show empty state when no tools
- ✅ Should filter tools by selected tags
- ✅ Should search tools by name
- ✅ Should handle error states
- ✅ Should use responsive grid columns

#### src/components/ToolFilters.test.tsx
Test cases:
- ✅ Should display all unique tags
- ✅ Should allow multi-select tags
- ✅ Should emit selected tags to parent
- ✅ Should show "Clear all" button
- ✅ Should display active filter count
- ✅ Should handle empty tags array

#### src/components/StreamingResponse.test.tsx
Test cases:
- ✅ Should display streamed text chunks
- ✅ Should auto-scroll to bottom
- ✅ Should show typing indicator while streaming
- ✅ Should render markdown formatting
- ✅ Should handle "Stop generating" button
- ✅ Should close EventSource on unmount
- ✅ Should handle connection errors

### 3. Analytics Component Tests

#### src/components/analytics/SimpleAnalyticsCard.test.tsx
Test cases:
- ✅ Should display total runs count
- ✅ Should display top 3 tools with icons
- ✅ Should display period text
- ✅ Should show loading state
- ✅ Should NOT display cost information
- ✅ Should handle zero runs gracefully

#### src/components/analytics/DetailedAnalyticsDashboard.test.tsx
Test cases:
- ✅ Should display key metrics cards
- ✅ Should render runs-by-day chart
- ✅ Should render top tools chart
- ✅ Should allow date range selection
- ✅ Should NOT show costs for ORG_OWNER
- ✅ Should export data to CSV
- ✅ Should refresh on date change

#### src/components/analytics/SystemAnalyticsDashboard.test.tsx
Test cases:
- ✅ Should ONLY render for SYSTEM_ADMIN
- ✅ Should display total cost
- ✅ Should show cost by organization table
- ✅ Should show cost by tool chart
- ✅ Should show cost trends over time
- ✅ Should allow drilling into org details

### 4. Admin Component Tests

#### src/components/admin/ToolAccessManager.test.tsx
Test cases:
- ✅ Should show three assignment tabs
- ✅ Org tab: Should only show for SYSTEM_ADMIN
- ✅ Workspace tab: Should work for ORG_OWNER
- ✅ User tab: Should work for ORG_OWNER
- ✅ Should display current assignments table
- ✅ Should show remove buttons
- ✅ Should validate assignments before submitting
- ✅ Should show success toast on grant
- ✅ Should show error toast on failure

## Component Test Template:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToolCard } from './ToolCard';
import { BrowserRouter } from 'react-router-dom';

const mockTool = {
  id: 'tool-1',
  name: 'AI Writer',
  slug: 'ai-writer',
  description: 'Generate content with AI',
  icon: '/icons/writer.svg',
  tags: ['writing', 'ai'],
  access_type: 'workspace',
};

describe('ToolCard', () => {
  it('should display tool information', () => {
    render(
      <BrowserRouter>
        <ToolCard tool={mockTool} />
      </BrowserRouter>
    );

    expect(screen.getByText('AI Writer')).toBeInTheDocument();
    expect(screen.getByText('Generate content with AI')).toBeInTheDocument();
    expect(screen.getByText('writing')).toBeInTheDocument();
    expect(screen.getByText('ai')).toBeInTheDocument();
  });

  it('should navigate on click', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <ToolCard tool={mockTool} />
      </BrowserRouter>
    );

    const card = screen.getByRole('button');
    await user.click(card);

    await waitFor(() => {
      expect(window.location.pathname).toBe('/tools/ai-writer');
    });
  });

  it('should show access type badge', () => {
    render(
      <BrowserRouter>
        <ToolCard tool={mockTool} />
      </BrowserRouter>
    );

    expect(screen.getByText(/workspace/i)).toBeInTheDocument();
  });
});
````

Create ALL component tests following this pattern.

````

---

## 🤖 AI PROMPT 4: INTEGRATION TESTS

```markdown
# PROMPT: Create Integration Tests

Create integration tests that test the full API flow (request → middleware → controller → database).

## Test Files to Create:

### src/server/__tests__/integration/auth.integration.test.ts

Test complete authentication flows:
- ✅ POST /api/auth/webhook - User created via Clerk
- ✅ POST /api/auth/webhook - User updated via Clerk
- ✅ POST /api/auth/webhook - User deleted via Clerk
- ✅ POST /api/auth/webhook - Invalid signature rejected
- ✅ GET /api/auth/me - Returns current user
- ✅ GET /api/auth/me - Requires authentication
- ✅ PUT /api/auth/me - Updates user profile

### src/server/__tests__/integration/tools.integration.test.ts

Test complete tool workflows:
- ✅ GET /api/tools - Returns user's accessible tools
- ✅ GET /api/tools - Filters by user's access (org + workspace + individual)
- ✅ POST /api/tools - SYSTEM_ADMIN can create
- ✅ POST /api/tools - Non-admin rejected (403)
- ✅ PUT /api/tools/:id - SYSTEM_ADMIN can update
- ✅ DELETE /api/tools/:id - SYSTEM_ADMIN can delete
- ✅ POST /api/tools/:id/execute - Streams response
- ✅ POST /api/tools/:id/execute - Verifies access first
- ✅ POST /api/tools/:id/execute - Logs to analytics

### src/server/__tests__/integration/tool-access.integration.test.ts

Test additive access control (CRITICAL):
- ✅ User assigned to org → sees org tools
- ✅ User in workspace → sees workspace tools
- ✅ User individually assigned → sees personal tools
- ✅ User sees ALL tools from all three paths (additive)
- ✅ Removing workspace access → keeps individual access
- ✅ Duplicate assignments prevented
- ✅ Access audit trail maintained

### src/server/__tests__/integration/workspaces.integration.test.ts

Test workspace management:
- ✅ POST /api/workspaces - ORG_OWNER creates workspace
- ✅ POST /api/workspaces - Enforces unique slug per org
- ✅ POST /api/workspaces/:id/members - Adds member
- ✅ DELETE /api/workspaces/:id/members/:userId - Removes member
- ✅ GET /api/workspaces - Returns user's workspaces with counts
- ✅ PUT /api/workspaces/:id - Updates workspace
- ✅ DELETE /api/workspaces/:id - Deletes workspace (cascade)

### src/server/__tests__/integration/analytics.integration.test.ts

Test analytics with role-based filtering:
- ✅ GET /api/analytics/user - MEMBER sees simple metrics (no costs)
- ✅ GET /api/analytics/workspace/:id - WORKSPACE_ADMIN sees details (no costs)
- ✅ GET /api/analytics/organization/:id - ORG_OWNER sees org metrics (no costs)
- ✅ GET /api/analytics/system - SYSTEM_ADMIN sees all + costs
- ✅ Cost data NEVER returned to non-admin roles
- ✅ Metrics calculated correctly (runs, success rate, avg time)

## Integration Test Template:

```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../index';
import { supabase } from '../../lib/supabase/server';

describe('Tool Access Integration Tests', () => {
  let testOrg: any;
  let testUser: any;
  let testWorkspace: any;
  let testTool: any;
  let authToken: string;

  beforeAll(async () => {
    // Create test data
    const { data: org } = await supabase
      .from('organizations')
      .insert({ name: 'Test Org', slug: 'test-org' })
      .select()
      .single();
    testOrg = org;

    const { data: user } = await supabase
      .from('users')
      .insert({
        clerk_id: 'test-user-123',
        email: 'test@example.com',
        role: 'MEMBER',
        organization_id: testOrg.id,
      })
      .select()
      .single();
    testUser = user;

    const { data: workspace } = await supabase
      .from('workspaces')
      .insert({
        name: 'Engineering',
        slug: 'engineering',
        organization_id: testOrg.id,
      })
      .select()
      .single();
    testWorkspace = workspace;

    const { data: tool } = await supabase
      .from('tools')
      .insert({
        name: 'Test Tool',
        slug: 'test-tool',
        type: 'internal',
      })
      .select()
      .single();
    testTool = tool;

    // Generate mock auth token
    authToken = 'mock-jwt-token';
  });

  afterAll(async () => {
    // Cleanup test data
    await supabase.from('organizations').delete().eq('id', testOrg.id);
  });

  beforeEach(async () => {
    // Clear tool access before each test
    await supabase.from('tool_access').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  });

  describe('Additive Access Control', () => {
    it('should grant access via organization assignment', async () => {
      // Assign tool to organization
      await supabase.from('tool_access').insert({
        tool_id: testTool.id,
        organization_id: testOrg.id,
        granted_by: testUser.id,
      });

      // Get user's tools
      const response = await request(app)
        .get('/api/tools')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].tool_id).toBe(testTool.id);
      expect(response.body.data[0].access_type).toBe('organization');
    });

    it('should grant access via workspace assignment', async () => {
      // Add user to workspace
      await supabase.from('workspace_members').insert({
        workspace_id: testWorkspace.id,
        user_id: testUser.id,
      });

      // Assign tool to workspace
      await supabase.from('tool_access').insert({
        tool_id: testTool.id,
        workspace_id: testWorkspace.id,
        granted_by: testUser.id,
      });

      const response = await request(app)
        .get('/api/tools')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].access_type).toBe('workspace');
    });

    it('should grant access via individual assignment', async () => {
      // Assign tool directly to user
      await supabase.from('tool_access').insert({
        tool_id: testTool.id,
        user_id: testUser.id,
        granted_by: testUser.id,
      });

      const response = await request(app)
        .get('/api/tools')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].access_type).toBe('individual');
    });

    it('should show tool from ALL access paths (additive)', async () => {
      // Assign via all three paths
      await supabase.from('workspace_members').insert({
        workspace_id: testWorkspace.id,
        user_id: testUser.id,
      });

      await supabase.from('tool_access').insert([
        { tool_id: testTool.id, organization_id: testOrg.id, granted_by: testUser.id },
        { tool_id: testTool.id, workspace_id: testWorkspace.id, granted_by: testUser.id },
        { tool_id: testTool.id, user_id: testUser.id, granted_by: testUser.id },
      ]);

      const response = await request(app)
        .get('/api/tools')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Should still return only ONE tool (deduplicated)
      expect(response.body.data).toHaveLength(1);
    });

    it('should maintain individual access after removing workspace', async () => {
      // Set up both workspace and individual access
      await supabase.from('workspace_members').insert({
        workspace_id: testWorkspace.id,
        user_id: testUser.id,
      });

      const { data: workspaceAccess } = await supabase
        .from('tool_access')
        .insert({
          tool_id: testTool.id,
          workspace_id: testWorkspace.id,
          granted_by: testUser.id,
        })
        .select()
        .single();

      await supabase.from('tool_access').insert({
        tool_id: testTool.id,
        user_id: testUser.id,
        granted_by: testUser.id,
      });

      // User should see tool
      let response = await request(app)
        .get('/api/tools')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(response.body.data).toHaveLength(1);

      // Remove workspace access
      await supabase
        .from('tool_access')
        .delete()
        .eq('id', workspaceAccess.id);

      // User should STILL see tool (via individual access)
      response = await request(app)
        .get('/api/tools')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].access_type).toBe('individual');
    });
  });
});
````

Create ALL integration tests following this pattern.

````

---

## 🤖 AI PROMPT 5: END-TO-END TESTS

```markdown
# PROMPT: Create End-to-End User Workflow Tests

Create E2E tests for critical user journeys using React Testing Library.

## Test Files to Create:

### src/__tests__/e2e/system-admin-workflow.e2e.test.ts

Test complete System Admin workflow:
1. ✅ System Admin logs in via Clerk
2. ✅ Navigates to Organizations page
3. ✅ Creates new organization "Acme Corp"
4. ✅ Invites user as Org Owner
5. ✅ Navigates to Global Tools page
6. ✅ Creates new tool "AI Writer"
7. ✅ Assigns tool to "Acme Corp" organization
8. ✅ Navigates to System Analytics
9. ✅ Verifies cost data is visible
10. ✅ Logs out successfully

### src/__tests__/e2e/org-owner-workflow.e2e.test.ts

Test complete Org Owner workflow:
1. ✅ Org Owner logs in via Clerk
2. ✅ Sees their organization dashboard
3. ✅ Creates workspace "Engineering"
4. ✅ Invites member to workspace
5. ✅ Sees available tools (assigned by System Admin)
6. ✅ Assigns tool to Engineering workspace
7. ✅ Assigns tool to individual member
8. ✅ Navigates to Analytics
9. ✅ Verifies NO cost data visible
10. ✅ Views workspace details with member list

### src/__tests__/e2e/member-workflow.e2e.test.ts

Test complete Member workflow:
1. ✅ Member logs in via Clerk
2. ✅ Sees dashboard with assigned tools
3. ✅ Verifies tools from all access paths visible
4. ✅ Clicks on tool "AI Writer"
5. ✅ Tool execution page loads
6. ✅ Enters input and executes tool
7. ✅ Sees streaming response
8. ✅ Response completes successfully
9. ✅ Navigates to Analytics
10. ✅ Sees simple metrics (total runs, top tools)
11. ✅ Verifies NO cost information

### src/__tests__/e2e/tool-execution-workflow.e2e.test.ts

Test tool execution and streaming:
1. ✅ User navigates to tool page
2. ✅ Tool input form displays
3. ✅ User enters test input
4. ✅ User clicks "Execute"
5. ✅ Streaming starts immediately
6. ✅ Text chunks appear progressively
7. ✅ Auto-scroll works
8. ✅ Markdown renders correctly
9. ✅ "Stop" button appears while streaming
10. ✅ Can stop generation mid-stream
11. ✅ Execution logged to analytics

### src/__tests__/e2e/access-control-workflow.e2e.test.ts

Test access control scenarios:
1. ✅ Member sees ONLY assigned tools
2. ✅ Member cannot access unassigned tool
3. ✅ Member added to workspace → sees workspace tools
4. ✅ Member removed from workspace → loses workspace tools
5. ✅ Member with individual access → keeps access even after workspace removal
6. ✅ Org Owner cannot see System Admin pages
7. ✅ Member cannot see Admin pages
8. ✅ Tool access verified on every execution

## E2E Test Template:

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from '../App';

describe('Member Workflow E2E', () => {
  beforeAll(async () => {
    // Set up test data in database
    // Create org, workspace, user, tool, assignments
  });

  it('should complete full member workflow', async () => {
    const user = userEvent.setup();

    // Render app
    render(
      <ClerkProvider publishableKey="test-key">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    );

    // Step 1: Login
    await waitFor(() => {
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'member@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(signInButton);

    // Step 2: Dashboard loads with tools
    await waitFor(() => {
      expect(screen.getByText(/my tools/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    const toolCards = screen.getAllByTestId('tool-card');
    expect(toolCards.length).toBeGreaterThan(0);

    // Step 3: Click on tool
    const aiWriterTool = screen.getByText('AI Writer');
    await user.click(aiWriterTool);

    // Step 4: Tool execution page
    await waitFor(() => {
      expect(screen.getByText(/execute tool/i)).toBeInTheDocument();
    });

    const inputArea = screen.getByRole('textbox');
    const executeButton = screen.getByRole('button', { name: /execute/i });

    await user.type(inputArea, 'Write a blog post about AI');
    await user.click(executeButton);

    // Step 5: Streaming response
    await waitFor(() => {
      expect(screen.getByText(/generating/i)).toBeInTheDocument();
    });

    // Wait for first chunk
    await waitFor(() => {
      const response = screen.getByTestId('streaming-response');
      expect(response.textContent).not.toBe('');
    }, { timeout: 10000 });

    // Step 6: Navigate to analytics
    const analyticsLink = screen.getByRole('link', { name: /analytics/i });
    await user.click(analyticsLink);

    // Step 7: Simple analytics visible
    await waitFor(() => {
      expect(screen.getByText(/total runs/i)).toBeInTheDocument();
      expect(screen.getByText(/top tools/i)).toBeInTheDocument();
    });

    // Step 8: Verify NO cost data
    expect(screen.queryByText(/cost/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
  });
});
````

Create ALL E2E workflow tests following this pattern.

````

---

## 🤖 AI PROMPT 6: CUSTOM HOOKS TESTS

```markdown
# PROMPT: Create Custom Hooks Tests

Test all custom React hooks.

## Test Files to Create:

### src/hooks/useTools.test.ts
- ✅ Should fetch tools on mount
- ✅ Should filter by tags
- ✅ Should search by name
- ✅ Should handle loading state
- ✅ Should handle error state
- ✅ Should refetch on demand
- ✅ Should cache results

### src/hooks/useUser.test.ts
- ✅ Should fetch current user on mount
- ✅ Should redirect if not authenticated
- ✅ Should update on profile change
- ✅ Should handle Clerk loading state

### src/hooks/useWorkspaces.test.ts
- ✅ Should fetch user's workspaces
- ✅ Should include member counts
- ✅ Should handle workspace selection
- ✅ Should persist selection

### src/hooks/useToolExecution.test.ts
- ✅ Should initialize EventSource for streaming
- ✅ Should handle incoming chunks
- ✅ Should close on unmount
- ✅ Should handle errors
- ✅ Should support stop generation

## Hook Test Template:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTools } from './useTools';
import { supabase } from '@/lib/supabase/client';

vi.mock('@/lib/supabase/client');

describe('useTools', () => {
  it('should fetch tools on mount', async () => {
    const mockTools = [
      { tool_id: '1', tool_name: 'Tool 1' },
      { tool_id: '2', tool_name: 'Tool 2' },
    ];

    vi.mocked(supabase.rpc).mockResolvedValue({
      data: mockTools,
      error: null,
    });

    const { result } = renderHook(() => useTools());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tools).toEqual(mockTools);
  });

  it('should filter tools by tags', async () => {
    const mockTools = [
      { tool_id: '1', tool_name: 'Tool 1', tool_tags: ['ai', 'writing'] },
      { tool_id: '2', tool_name: 'Tool 2', tool_tags: ['data'] },
    ];

    vi.mocked(supabase.rpc).mockResolvedValue({
      data: mockTools,
      error: null,
    });

    const { result } = renderHook(() => useTools());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    result.current.filterByTags(['ai']);

    expect(result.current.tools).toHaveLength(1);
    expect(result.current.tools[0].tool_id).toBe('1');
  });
});
````

````

---

## 🤖 AI PROMPT 7: RLS POLICY TESTS

```markdown
# PROMPT: Create RLS Policy Tests

Test that Row Level Security policies correctly enforce access control.

## Test File to Create:

### src/server/__tests__/integration/rls-policies.test.ts

Test each RLS policy:

#### Users Table:
- ✅ users_select_own: User can read own profile
- ✅ users_select_own: User CANNOT read other profiles
- ✅ users_select_org_owner: Org Owner sees org users
- ✅ users_select_system_admin: System Admin sees all
- ✅ users_update_own: User can update own profile
- ✅ users_update_own: User CANNOT update others

#### Tools Table:
- ✅ tools_select_accessible: User sees accessible tools
- ✅ tools_select_accessible: User CANNOT see unassigned tools
- ✅ tools_insert_system_admin: Only System Admin can create
- ✅ tools_update_system_admin: Only System Admin can update
- ✅ tools_delete_system_admin: Only System Admin can delete

#### Tool Access Table:
- ✅ tool_access_insert_system_admin_org: System Admin assigns to org
- ✅ tool_access_insert_org_owner: Org Owner assigns to workspace/user
- ✅ tool_access_insert_org_owner: Org Owner CANNOT assign to other org
- ✅ tool_access_delete: Only granter or admin can remove

#### Analytics Table:
- ✅ analytics_select_own: User sees own analytics
- ✅ analytics_select_own: User CANNOT see others' analytics
- ✅ analytics_select_workspace_admin: Workspace admin sees workspace analytics
- ✅ analytics_select_org_owner: Org owner sees org analytics
- ✅ analytics_select_system_admin: System admin sees all

## RLS Test Template:

```typescript
import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('RLS Policies', () => {
  describe('Tools Table', () => {
    it('should allow users to see only accessible tools', async () => {
      // Create client with user JWT
      const userClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
          auth: {
            persistSession: false,
          },
        }
      );

      // Set user context (mock JWT)
      await userClient.auth.setSession({
        access_token: 'mock-user-token',
        refresh_token: '',
      });

      // Try to fetch tools
      const { data, error } = await userClient
        .from('tools')
        .select('*');

      // Should only return tools user has access to
      expect(error).toBeNull();
      expect(data).toBeDefined();

      // Verify each tool has corresponding access record
      for (const tool of data!) {
        const { data: access } = await userClient.rpc('check_tool_access', {
          user_id_param: 'user-id',
          tool_id_param: tool.id,
        });
        expect(access).toBe(true);
      }
    });

    it('should prevent non-admins from creating tools', async () => {
      const memberClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );

      await memberClient.auth.setSession({
        access_token: 'mock-member-token',
        refresh_token: '',
      });

      const { data, error } = await memberClient
        .from('tools')
        .insert({
          name: 'Unauthorized Tool',
          slug: 'unauthorized',
          type: 'internal',
        });

      expect(error).toBeDefined();
      expect(error?.code).toBe('42501'); // Insufficient privilege
      expect(data).toBeNull();
    });
  });
});
````

````

---

## 📊 TEST COVERAGE REPORTING

```markdown
# PROMPT: Set Up Coverage Reporting

Create npm scripts and configuration for test coverage reporting.

Add to package.json:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:coverage:ui": "vitest --coverage --ui",
    "test:unit": "vitest run src/**/*.test.{ts,tsx}",
    "test:integration": "vitest run src/**/*.integration.test.ts",
    "test:e2e": "vitest run src/**/*.e2e.test.ts",
    "test:watch": "vitest --watch",
    "test:ci": "vitest run --coverage --reporter=verbose"
  }
}
````

Create coverage report viewer:

- HTML report at coverage/index.html
- Display coverage badges in README
- Set up GitHub Actions to run tests on PR

```

---

## ✅ FINAL TEST CHECKLIST

When all tests are created, verify:

### Unit Tests (60% of total)
- [ ] All middleware tested (4 files)
- [ ] All controllers tested (8 files)
- [ ] All database functions tested (4 functions)
- [ ] All React components tested (15+ components)
- [ ] All custom hooks tested (5 hooks)
- [ ] Coverage: 90%+ for units

### Integration Tests (30% of total)
- [ ] All API endpoints tested (30+ endpoints)
- [ ] Additive access control verified
- [ ] Role-based filtering verified
- [ ] Database cascades tested
- [ ] Coverage: 80%+ for integration

### E2E Tests (10% of total)
- [ ] System Admin workflow
- [ ] Org Owner workflow
- [ ] Member workflow
- [ ] Tool execution workflow
- [ ] Access control scenarios
- [ ] Coverage: Critical paths only

### Overall
- [ ] Total coverage: 85%+
- [ ] All tests passing
- [ ] No flaky tests
- [ ] Fast execution (<2 min for unit, <5 min for all)
- [ ] CI/CD integration ready

---

## 🎯 SUCCESS CRITERIA

Your test suite is complete when:
✅ 200+ test cases written
✅ 85%+ code coverage achieved
✅ All critical user workflows tested
✅ RLS policies verified
✅ Access control tested thoroughly
✅ All tests passing consistently
✅ Coverage report generated
✅ CI/CD integration working
```
