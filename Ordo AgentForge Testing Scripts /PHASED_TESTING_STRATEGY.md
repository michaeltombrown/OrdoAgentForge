# 🧪 PHASED TESTING STRATEGY - Test as You Build

## 📋 OVERVIEW

This document provides **incremental testing prompts** that correspond to each phase of BUILD_INSTRUCTIONS.md.

**Philosophy**: Test each component IMMEDIATELY after building it, not at the end.

---

## 🎯 TESTING APPROACH

### Three-Tier Testing Strategy:

```
┌─────────────────────────────────────────────────────────┐
│ TIER 1: IMMEDIATE TESTS (During Build)                 │
│ → Test each component right after creating it          │
│ → Catch errors early                                   │
│ → Verify before moving to next component               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TIER 2: PHASE COMPLETION TESTS (After Each Phase)      │
│ → Integration tests for the completed phase            │
│ → Verify phase works as a whole                        │
│ → Checkpoint before next phase                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TIER 3: FULL APPLICATION TESTS (After All Phases)      │
│ → E2E user workflows                                   │
│ → Complete system verification                         │
│ → Production readiness check                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 PHASE 1: PROJECT SETUP - Testing

### When: After completing Phase 1 in BUILD_INSTRUCTIONS.md

### AI Prompt:

````markdown
# TEST PHASE 1: Project Setup Verification

Now that project setup is complete, create these verification tests:

## Create: src/**tests**/setup/project-setup.test.ts

Test cases:
✅ All dependencies installed correctly
✅ TypeScript compiles without errors
✅ Path aliases resolve correctly (@/ imports)
✅ Environment variables load properly
✅ Vitest configuration works

```typescript
import { describe, it, expect } from 'vitest';
import { resolve } from 'path';
import { existsSync } from 'fs';

describe('Project Setup', () => {
  it('should have all required config files', () => {
    expect(existsSync(resolve(__dirname, '../../package.json'))).toBe(true);
    expect(existsSync(resolve(__dirname, '../../tsconfig.json'))).toBe(true);
    expect(existsSync(resolve(__dirname, '../../vite.config.ts'))).toBe(true);
    expect(existsSync(resolve(__dirname, '../../tailwind.config.js'))).toBe(
      true
    );
  });

  it('should have correct directory structure', () => {
    expect(existsSync(resolve(__dirname, '../../src/server'))).toBe(true);
    expect(existsSync(resolve(__dirname, '../../src/app'))).toBe(true);
    expect(existsSync(resolve(__dirname, '../../src/components'))).toBe(true);
    expect(existsSync(resolve(__dirname, '../../src/types'))).toBe(true);
  });

  it('should resolve path aliases', () => {
    // Import using @ alias should work
    expect(() => require('@/types/database')).not.toThrow();
  });
});
```
````

Run: `npm run test:unit`
Expected: All tests pass ✅

````

---

## 🗄️ PHASE 2: DATABASE SETUP - Testing

### When: After running all SQL migrations in Supabase

### AI Prompt:
```markdown
# TEST PHASE 2: Database Schema Verification

Create tests to verify database is set up correctly:

## Create: src/server/__tests__/database/schema-verification.test.ts

Test cases:
✅ All 8 tables exist
✅ All foreign keys configured correctly
✅ All indexes created
✅ All triggers working
✅ All 4 database functions exist and work
✅ RLS enabled on all tables
✅ Storage bucket exists

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { supabase } from '../../lib/supabase/server';

describe('Database Schema', () => {
  it('should have all required tables', async () => {
    const tables = [
      'users',
      'organizations',
      'workspaces',
      'workspace_members',
      'tools',
      'tool_access',
      'documents',
      'usage_analytics'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(0);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    }
  });

  it('should have get_user_tools function', async () => {
    const { data, error } = await supabase.rpc('get_user_tools', {
      user_id_param: '00000000-0000-0000-0000-000000000000'
    });

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should have check_tool_access function', async () => {
    const { data, error } = await supabase.rpc('check_tool_access', {
      user_id_param: '00000000-0000-0000-0000-000000000000',
      tool_id_param: '00000000-0000-0000-0000-000000000000'
    });

    expect(error).toBeNull();
    expect(typeof data).toBe('boolean');
  });

  it('should have RLS enabled on all tables', async () => {
    // This would query pg_tables or information_schema
    // to verify RLS is enabled
    // Implementation depends on Supabase admin access
  });
});
````

Run: `npm run test`
Expected: All database tests pass ✅

````

---

## ⚙️ PHASE 3: BACKEND MIDDLEWARE - Testing

### When: After creating EACH middleware file

### AI Prompt for Each Middleware:
```markdown
# TEST PHASE 3A: Auth Middleware

Just created authMiddleware.ts - now create its test file:

## Create: src/server/middleware/authMiddleware.test.ts

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authMiddleware } from './authMiddleware';
import { supabase } from '../lib/supabase/server';
import { clerkClient } from '@clerk/clerk-sdk-node';

vi.mock('../lib/supabase/server');
vi.mock('@clerk/clerk-sdk-node');

describe('authMiddleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {
      headers: { authorization: 'Bearer valid-token' }
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  it('should attach user to request with valid token', async () => {
    const mockUser = {
      id: 'user-123',
      clerk_id: 'clerk-123',
      email: 'test@example.com',
      role: 'MEMBER'
    };

    vi.mocked(clerkClient.sessions.verifySession).mockResolvedValue({
      userId: 'clerk-123'
    } as any);

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockUser, error: null })
    } as any);

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 401 with missing token', async () => {
    mockReq.headers = {};

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 with invalid token', async () => {
    vi.mocked(clerkClient.sessions.verifySession).mockRejectedValue(
      new Error('Invalid token')
    );

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 when user not found', async () => {
    vi.mocked(clerkClient.sessions.verifySession).mockResolvedValue({
      userId: 'clerk-123'
    } as any);

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') })
    } as any);

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
  });
});
````

Run: `npm run test src/server/middleware/authMiddleware.test.ts`
Expected: All tests pass ✅

**REPEAT for each middleware:**

- roleMiddleware.test.ts
- toolAccessMiddleware.test.ts
- validationMiddleware.test.ts
- errorHandler.test.ts

After ALL middleware tested:
Run: `npm run test src/server/middleware/`
Expected: All middleware tests pass ✅

````

---

## 🎮 PHASE 4: BACKEND CONTROLLERS - Testing

### When: After creating EACH controller

### AI Prompt Pattern (for EACH controller):
```markdown
# TEST PHASE 4A: ToolController

Just created ToolController.ts - now test it:

## Create: src/server/controllers/ToolController.test.ts

Test each method:
✅ getUserTools
✅ createTool
✅ getTool
✅ updateTool
✅ deleteTool
✅ executeTool

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToolController } from './ToolController';
import { supabase } from '../lib/supabase/server';

vi.mock('../lib/supabase/server');

describe('ToolController', () => {
  describe('getUserTools', () => {
    it('should return user tools', async () => {
      const mockTools = [
        { tool_id: '1', tool_name: 'Tool 1', access_type: 'individual' }
      ];

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockTools,
        error: null
      });

      const req = { user: { id: 'user-123' } } as any;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis()
      } as any;

      await ToolController.getUserTools(req, res);

      expect(supabase.rpc).toHaveBeenCalledWith('get_user_tools', {
        user_id_param: 'user-123'
      });
      expect(res.json).toHaveBeenCalledWith({ data: mockTools });
    });

    it('should handle database errors', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: new Error('DB error')
      });

      const req = { user: { id: 'user-123' } } as any;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis()
      } as any;

      await ToolController.getUserTools(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('createTool', () => {
    it('should create tool with valid data', async () => {
      const mockTool = {
        id: 'tool-1',
        name: 'New Tool',
        slug: 'new-tool',
        type: 'internal'
      };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockTool, error: null })
      } as any);

      const req = {
        user: { id: 'admin-123' },
        body: { name: 'New Tool', slug: 'new-tool', type: 'internal' }
      } as any;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis()
      } as any;

      await ToolController.createTool(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: mockTool });
    });

    it('should validate required fields', async () => {
      const req = {
        user: { id: 'admin-123' },
        body: { name: 'Tool' } // Missing required fields
      } as any;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis()
      } as any;

      await ToolController.createTool(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // Add tests for: getTool, updateTool, deleteTool, executeTool
});
````

Run: `npm run test src/server/controllers/ToolController.test.ts`
Expected: All tests pass ✅

**REPEAT for ALL 8 controllers:**

1. AuthController.test.ts
2. OrganizationController.test.ts
3. WorkspaceController.test.ts
4. UserController.test.ts
5. ToolController.test.ts
6. ToolAccessController.test.ts
7. DocumentController.test.ts
8. AnalyticsController.test.ts

After ALL controllers tested:
Run: `npm run test src/server/controllers/`
Expected: All controller tests pass ✅

````

---

## 🔗 PHASE 5: BACKEND INTEGRATION - Testing

### When: After backend is complete and server starts successfully

### AI Prompt:
```markdown
# TEST PHASE 5: Backend Integration Tests

Backend is built - now test the full request flow:

## Create: src/server/__tests__/integration/critical-flows.integration.test.ts

Test the MOST CRITICAL flow first:

### CRITICAL: Additive Tool Access

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../index';
import { supabase } from '../../lib/supabase/server';

describe('CRITICAL: Additive Tool Access Integration', () => {
  let testOrg: any;
  let testUser: any;
  let testWorkspace: any;
  let testTool: any;
  let authToken: string;

  beforeAll(async () => {
    // Create test organization
    const { data: org } = await supabase
      .from('organizations')
      .insert({ name: 'Test Org', slug: 'test-org-integration' })
      .select()
      .single();
    testOrg = org;

    // Create test user
    const { data: user } = await supabase
      .from('users')
      .insert({
        clerk_id: 'integration-test-user',
        email: 'integration@test.com',
        role: 'MEMBER',
        organization_id: testOrg.id
      })
      .select()
      .single();
    testUser = user;

    // Create test workspace
    const { data: workspace } = await supabase
      .from('workspaces')
      .insert({
        name: 'Test Workspace',
        slug: 'test-workspace',
        organization_id: testOrg.id
      })
      .select()
      .single();
    testWorkspace = workspace;

    // Create test tool
    const { data: tool } = await supabase
      .from('tools')
      .insert({
        name: 'Integration Test Tool',
        slug: 'integration-test-tool',
        type: 'internal'
      })
      .select()
      .single();
    testTool = tool;

    // Mock auth token (replace with actual Clerk token generation in real test)
    authToken = 'mock-jwt-token';
  });

  afterAll(async () => {
    // Cleanup
    await supabase.from('organizations').delete().eq('id', testOrg.id);
  });

  it('should grant access via organization assignment', async () => {
    // Assign tool to organization
    await supabase.from('tool_access').insert({
      tool_id: testTool.id,
      organization_id: testOrg.id,
      granted_by: testUser.id
    });

    // Get user's tools via API
    const response = await request(app)
      .get('/api/tools')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].tool_id).toBe(testTool.id);
    expect(response.body.data[0].access_type).toBe('organization');

    // Cleanup
    await supabase.from('tool_access').delete().eq('organization_id', testOrg.id);
  });

  it('should grant access via workspace assignment', async () => {
    // Add user to workspace
    await supabase.from('workspace_members').insert({
      workspace_id: testWorkspace.id,
      user_id: testUser.id
    });

    // Assign tool to workspace
    await supabase.from('tool_access').insert({
      tool_id: testTool.id,
      workspace_id: testWorkspace.id,
      granted_by: testUser.id
    });

    const response = await request(app)
      .get('/api/tools')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].access_type).toBe('workspace');

    // Cleanup
    await supabase.from('tool_access').delete().eq('workspace_id', testWorkspace.id);
    await supabase.from('workspace_members').delete().eq('workspace_id', testWorkspace.id);
  });

  it('should grant access via individual assignment', async () => {
    // Assign tool directly to user
    await supabase.from('tool_access').insert({
      tool_id: testTool.id,
      user_id: testUser.id,
      granted_by: testUser.id
    });

    const response = await request(app)
      .get('/api/tools')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].access_type).toBe('individual');

    // Cleanup
    await supabase.from('tool_access').delete().eq('user_id', testUser.id);
  });

  it('CRITICAL: should show tool from ALL three paths (additive)', async () => {
    // Set up all three access paths
    await supabase.from('workspace_members').insert({
      workspace_id: testWorkspace.id,
      user_id: testUser.id
    });

    await supabase.from('tool_access').insert([
      { tool_id: testTool.id, organization_id: testOrg.id, granted_by: testUser.id },
      { tool_id: testTool.id, workspace_id: testWorkspace.id, granted_by: testUser.id },
      { tool_id: testTool.id, user_id: testUser.id, granted_by: testUser.id }
    ]);

    const response = await request(app)
      .get('/api/tools')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // Should deduplicate - only ONE tool returned
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].tool_id).toBe(testTool.id);
  });

  it('CRITICAL: removing workspace access should keep individual access', async () => {
    // Set up both workspace and individual access
    await supabase.from('workspace_members').insert({
      workspace_id: testWorkspace.id,
      user_id: testUser.id
    });

    const { data: workspaceAccess } = await supabase
      .from('tool_access')
      .insert({
        tool_id: testTool.id,
        workspace_id: testWorkspace.id,
        granted_by: testUser.id
      })
      .select()
      .single();

    await supabase.from('tool_access').insert({
      tool_id: testTool.id,
      user_id: testUser.id,
      granted_by: testUser.id
    });

    // Verify user has access
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

    // User should STILL have access via individual assignment
    response = await request(app)
      .get('/api/tools')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].access_type).toBe('individual');
  });
});
````

Run: `npm run test:integration`
Expected: ALL integration tests pass ✅

**If this test fails, DO NOT proceed to frontend!**
Fix backend first.

````

---

## 🎨 PHASE 6: FRONTEND COMPONENTS - Testing

### When: After creating EACH component

### AI Prompt Pattern (for each component):
```markdown
# TEST PHASE 6A: ToolCard Component

Just created ToolCard.tsx - test it now:

## Create: src/components/ToolCard.test.tsx

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ToolCard } from './ToolCard';

const mockTool = {
  id: 'tool-1',
  name: 'AI Writer',
  slug: 'ai-writer',
  description: 'Generate content with AI',
  icon: '/icons/writer.svg',
  tags: ['writing', 'ai'],
  type: 'internal' as const,
  access_type: 'workspace' as const
};

describe('ToolCard', () => {
  it('should render tool information', () => {
    render(
      <BrowserRouter>
        <ToolCard tool={mockTool} />
      </BrowserRouter>
    );

    expect(screen.getByText('AI Writer')).toBeInTheDocument();
    expect(screen.getByText('Generate content with AI')).toBeInTheDocument();
    expect(screen.getByText('writing')).toBeInTheDocument();
  });

  it('should navigate to tool page on click', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <ToolCard tool={mockTool} />
      </BrowserRouter>
    );

    const card = screen.getByTestId('tool-card');
    await user.click(card);

    expect(window.location.pathname).toContain('/tools/ai-writer');
  });

  it('should display access type badge', () => {
    render(
      <BrowserRouter>
        <ToolCard tool={mockTool} />
      </BrowserRouter>
    );

    expect(screen.getByText(/workspace/i)).toBeInTheDocument();
  });

  it('should handle missing optional fields', () => {
    const minimalTool = {
      id: 'tool-2',
      name: 'Minimal Tool',
      slug: 'minimal',
      type: 'internal' as const
    };

    expect(() => {
      render(
        <BrowserRouter>
          <ToolCard tool={minimalTool as any} />
        </BrowserRouter>
      );
    }).not.toThrow();
  });
});
````

Run: `npm run test src/components/ToolCard.test.tsx`
Expected: All tests pass ✅

**REPEAT for ALL components as you build them:**

- DashboardLayout.test.tsx
- TopNav.test.tsx
- Sidebar.test.tsx
- ToolGrid.test.tsx
- ToolFilters.test.tsx
- StreamingResponse.test.tsx
- SimpleAnalyticsCard.test.tsx
- etc.

After each component tested:
Run: `npm run test src/components/`
Expected: All component tests pass ✅

````

---

## 🚀 PHASE 7: END-TO-END WORKFLOWS - Testing

### When: After ENTIRE application is built and working

### AI Prompt:
```markdown
# TEST PHASE 7: End-to-End User Workflows

Application is complete - test real user journeys:

## Create: src/__tests__/e2e/member-complete-workflow.e2e.test.ts

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Member Complete Workflow E2E', () => {
  beforeAll(async () => {
    // Seed database with test data
    // Create org, workspace, user, tool, assignments
  });

  it('should complete full member journey', async () => {
    const user = userEvent.setup();

    render(<App />);

    // Step 1: Login
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/email/i), 'member@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Step 2: Dashboard loads
    await waitFor(() => {
      expect(screen.getByText(/my tools/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Step 3: See assigned tools
    expect(screen.getAllByTestId('tool-card').length).toBeGreaterThan(0);

    // Step 4: Click tool
    await user.click(screen.getByText('AI Writer'));

    // Step 5: Tool page loads
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    // Step 6: Execute tool
    await user.type(screen.getByRole('textbox'), 'Test input');
    await user.click(screen.getByRole('button', { name: /execute/i }));

    // Step 7: Streaming starts
    await waitFor(() => {
      expect(screen.getByTestId('streaming-response').textContent).not.toBe('');
    }, { timeout: 10000 });

    // Step 8: Check analytics
    await user.click(screen.getByRole('link', { name: /analytics/i }));

    await waitFor(() => {
      expect(screen.getByText(/total runs/i)).toBeInTheDocument();
    });

    // Step 9: Verify NO cost data
    expect(screen.queryByText(/cost/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();

    // PASS: Member workflow complete ✅
  });
});
````

Run: `npm run test:e2e`
Expected: All E2E tests pass ✅

```

---

## 📊 TESTING CHECKPOINT SUMMARY

### After Each Phase, Verify:

**Phase 1 - Setup:**
- [ ] `npm run test` works
- [ ] TypeScript compiles
- [ ] All configs valid

**Phase 2 - Database:**
- [ ] All tables exist
- [ ] All functions work
- [ ] RLS enabled

**Phase 3 - Middleware:**
- [ ] All 5 middleware tested
- [ ] All tests passing
- [ ] Coverage >90%

**Phase 4 - Controllers:**
- [ ] All 8 controllers tested
- [ ] All methods tested
- [ ] Error handling verified

**Phase 5 - Backend Integration:**
- [ ] **CRITICAL: Additive access works**
- [ ] All API flows tested
- [ ] Server running stable

**Phase 6 - Frontend:**
- [ ] All components tested
- [ ] UI renders correctly
- [ ] User interactions work

**Phase 7 - E2E:**
- [ ] All user workflows pass
- [ ] Production ready

---

## ✅ FINAL SUCCESS CRITERIA

Your phased testing is complete when:

### During Build:
- [ ] Each component tested immediately after creation
- [ ] No component left untested
- [ ] Tests passing before moving to next

### After Each Phase:
- [ ] Phase checkpoint tests pass
- [ ] Integration verified
- [ ] No regressions

### Final Application:
- [ ] All E2E workflows pass
- [ ] 85%+ total coverage
- [ ] Production ready

---

## 🎯 KEY DIFFERENCE FROM TESTING_STRATEGY.md

| TESTING_STRATEGY.md | PHASED_TESTING_STRATEGY.md |
|---------------------|---------------------------|
| End-to-end testing after completion | Test during each build phase |
| 7 prompts for complete test suite | Incremental prompts per phase |
| 200+ tests at once | Test each component as built |
| Final verification | Continuous verification |
| Use AFTER building | Use WHILE building |

**Use BOTH:**
1. **PHASED_TESTING_STRATEGY.md** (this file) - During development
2. **TESTING_STRATEGY.md** - For comprehensive final verification

---

## 🚀 RECOMMENDATION

**Best approach:**
1. Follow BUILD_INSTRUCTIONS.md
2. After each phase, use prompts from this file to test that phase
3. Fix any issues before proceeding
4. After complete build, use TESTING_STRATEGY.md for full coverage

This ensures you **catch errors early** and **build with confidence**! ✅
```
