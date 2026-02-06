# Build Instructions for AI Developer

## ⚠️ CRITICAL: Read This Entire Document Before Writing Any Code

This document provides the exact order of operations for building the multi-tenant AI dashboard. Following this order is MANDATORY to avoid errors and circular dependencies.

---

## Prerequisites (Manual - User Must Complete)

Before starting, ensure you have:

- [ ] Supabase project created
- [ ] Supabase URL, Service Role Key, and Anon Key
- [ ] Clerk application created
- [ ] Clerk Secret Key, Publishable Key, and Webhook Secret
- [ ] Airia API key
- [ ] Node.js 18+ installed
- [ ] Git initialized in project directory

---

## Phase 1: Project Initialization (5 minutes)

### Step 1.1: Create Directory Structure

```bash
mkdir -p src/{app,server,components,hooks,lib,types}
mkdir -p src/app/{(dashboard),tools,api}
mkdir -p src/app/(dashboard)/{knowledge,analytics,workspaces,settings,admin}
mkdir -p src/app/tools/{_components,_templates,airia-chat}
mkdir -p src/server/{controllers,middleware,routes,lib}
mkdir -p src/server/lib/supabase
mkdir -p supabase/migrations
mkdir -p public
```

### Step 1.2: Copy Configuration Files

Copy these files to project root:

- `package.json`
- `tsconfig.json`
- `tsconfig.node.json`
- `vite.config.ts`
- `tailwind.config.js`
- `postcss.config.js`
- `.env.example`

### Step 1.3: Install Dependencies

```bash
npm install
```

**VERIFY**: Run `npm list` - all dependencies should install without errors.

---

## Phase 2: Database Setup (15 minutes)

### Step 2.1: Create SQL Migration File

Create `supabase/migrations/001_initial_schema.sql` with ALL CREATE TABLE statements from the technical specification in this exact order:

1. `users` table
2. `organizations` table
3. `workspaces` table
4. `workspace_members` table
5. `tools` table
6. `tool_access` table
7. `documents` table
8. `usage_analytics` table
9. All indexes
10. All triggers (update_updated_at_column)

### Step 2.2: Run Migration in Supabase

1. Open Supabase SQL Editor
2. Copy entire contents of `001_initial_schema.sql`
3. Execute
4. **VERIFY**: Check "Table Editor" - all 8 tables should exist

### Step 2.3: Create Database Functions

Create `supabase/migrations/002_functions.sql`:

```sql
-- Function: get_user_tools
CREATE OR REPLACE FUNCTION get_user_tools(user_id_param UUID)
RETURNS TABLE (
  tool_id UUID,
  tool_name VARCHAR,
  tool_slug VARCHAR,
  tool_description TEXT,
  tool_icon TEXT,
  tool_type VARCHAR,
  tool_tags TEXT[],
  access_type VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    t.id,
    t.name,
    t.slug,
    t.description,
    t.icon,
    t.type,
    t.tags,
    CASE
      WHEN ta.user_id IS NOT NULL THEN 'individual'
      WHEN ta.workspace_id IS NOT NULL THEN 'workspace'
      ELSE 'organization'
    END as access_type
  FROM tools t
  JOIN tool_access ta ON t.id = ta.tool_id
  LEFT JOIN users u ON u.id = user_id_param
  LEFT JOIN workspace_members wm ON wm.user_id = user_id_param AND wm.workspace_id = ta.workspace_id
  WHERE
    ta.user_id = user_id_param OR
    ta.workspace_id = wm.workspace_id OR
    ta.organization_id = u.organization_id;
END;
$$ LANGUAGE plpgsql;

-- Function: check_tool_access
CREATE OR REPLACE FUNCTION check_tool_access(
  user_id_param UUID,
  tool_id_param UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM tool_access ta
    LEFT JOIN users u ON u.id = user_id_param
    LEFT JOIN workspace_members wm ON wm.user_id = user_id_param AND wm.workspace_id = ta.workspace_id
    WHERE ta.tool_id = tool_id_param
    AND (
      ta.user_id = user_id_param OR
      ta.workspace_id = wm.workspace_id OR
      ta.organization_id = u.organization_id
    )
  ) INTO has_access;

  RETURN has_access;
END;
$$ LANGUAGE plpgsql;
```

Execute in Supabase SQL Editor.

**VERIFY**: Run `SELECT get_user_tools('00000000-0000-0000-0000-000000000000');` - should return empty result without errors.

### Step 2.4: Enable Row Level Security

Create `supabase/migrations/003_rls.sql` with ALL RLS policies from the technical specification.

Execute in Supabase SQL Editor.

**VERIFY**: Check that RLS is enabled on all tables in Supabase dashboard.

### Step 2.5: Create Storage Bucket

1. Go to Supabase Storage
2. Create new bucket named `documents`
3. Set to Public: No
4. Create policy: Authenticated users can upload
5. Create policy: Users can read their org's documents

---

## Phase 3: Environment Configuration (2 minutes)

### Step 3.1: Create .env File

Copy `.env.example` to `.env` and fill in:

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Clerk
CLERK_SECRET_KEY=sk_live_...
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_WEBHOOK_SECRET=whsec_...

# AI APIs
AIRIA_API_KEY=your-key-here

# Server
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**VERIFY**: All values are filled, no placeholder text remains.

---

## Phase 4: Type Definitions (5 minutes)

### Step 4.1: Create Database Types

Create `src/types/database.ts` with all TypeScript interfaces from type definitions file.

### Step 4.2: Create Request Types

Create `src/types/requests.ts`:

```typescript
import { Request } from 'express';
import { User } from './database';

export interface AuthRequest extends Request {
  user?: User;
}
```

**VERIFY**: Run `npx tsc --noEmit` - should compile without errors.

---

## Phase 5: Backend Foundation (20 minutes)

### Step 5.1: Create Supabase Server Client

Create `src/server/lib/supabase/server.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
```

### Step 5.2: Create Middleware (In This Order)

#### 1. Error Handler Middleware

Create `src/server/middleware/errorHandler.ts`

#### 2. Auth Middleware

Create `src/server/middleware/authMiddleware.ts`

- Must import Clerk
- Must query users table
- Must attach user to req.user

#### 3. Role Middleware

Create `src/server/middleware/roleMiddleware.ts`

- Must check req.user.role
- Must return factory function

#### 4. Tool Access Middleware

Create `src/server/middleware/toolAccessMiddleware.ts`

- Must call check_tool_access function
- Must verify result is true

#### 5. Validation Middleware

Create `src/server/middleware/validationMiddleware.ts`

- Must use Zod
- Must return validation errors in consistent format

**VERIFY**: All middleware files compile without errors.

### Step 5.3: Create Validation Schemas

Create `src/server/schemas/` directory with Zod schemas for:

- `workspaceSchemas.ts`
- `toolSchemas.ts`
- `toolAccessSchemas.ts`
- `userSchemas.ts`

### Step 5.4: Create Controllers (In This Order)

Build each controller completely before moving to the next:

1. **AuthController** (`src/server/controllers/AuthController.ts`)
   - handleWebhook
   - getCurrentUser
   - updateCurrentUser

2. **OrganizationController** (`src/server/controllers/OrganizationController.ts`)
   - createOrganization
   - listOrganizations
   - getOrganization
   - updateOrganization
   - deleteOrganization

3. **WorkspaceController** (`src/server/controllers/WorkspaceController.ts`)
   - createWorkspace
   - getUserWorkspaces
   - getWorkspace
   - updateWorkspace
   - deleteWorkspace
   - addMember
   - removeMember

4. **UserController** (`src/server/controllers/UserController.ts`)
   - createUser (triggers Clerk invitation)
   - listUsers
   - getUser
   - updateUser
   - deleteUser

5. **ToolController** (`src/server/controllers/ToolController.ts`)
   - createTool
   - getUserTools (uses get_user_tools function)
   - getTool
   - updateTool
   - deleteTool
   - executeTool (with streaming)

6. **ToolAccessController** (`src/server/controllers/ToolAccessController.ts`)
   - assignToOrganization
   - assignToWorkspace
   - assignToUser
   - removeAccess
   - getAccessAudit

7. **DocumentController** (`src/server/controllers/DocumentController.ts`)
   - uploadDocument
   - listDocuments
   - getDocument
   - deleteDocument

8. **AnalyticsController** (`src/server/controllers/AnalyticsController.ts`)
   - getUserAnalytics
   - getWorkspaceAnalytics
   - getOrganizationAnalytics
   - getSystemAnalytics

**VERIFY**: After each controller, test endpoints with curl or Postman.

### Step 5.5: Create Routes

Create `src/server/routes/index.ts` that imports all controllers and sets up routes with proper middleware chains.

**VERIFY**: Server can import routes without circular dependency errors.

### Step 5.6: Create Server Entry Point

Create `src/server/index.ts`:

- Initialize Express
- Apply global middleware (helmet, cors, rate limiting)
- Mount routes at /api
- Start server on PORT
- Handle graceful shutdown

**VERIFY**: Run `npm run dev:server` - server starts without errors.

---

## Phase 6: Frontend Foundation (30 minutes)

### Step 6.1: Create Supabase Client

Create `src/lib/supabase/client.ts` for browser-side Supabase client.

### Step 6.2: Create React Context

Create `src/lib/context/`:

- `UserContext.tsx`
- `WorkspaceContext.tsx`
- `ToolsContext.tsx`

### Step 6.3: Create Custom Hooks

Create `src/hooks/`:

- `useUser.ts`
- `useTools.ts`
- `useWorkspaces.ts`
- `useAnalytics.ts`
- `useToolExecution.ts`

### Step 6.4: Create Shared Components

Create `src/components/` in this order:

1. **Layout Components**
   - `DashboardLayout.tsx`
   - `TopNav.tsx`
   - `Sidebar.tsx`
   - `WorkspaceSelector.tsx`

2. **UI Components** (using shadcn/ui)
   - Install: `npx shadcn-ui@latest init`
   - Add: button, card, dialog, dropdown-menu, input, label, select, table, tabs, toast, form, badge, separator

3. **Tool Components**
   - `ToolCard.tsx`
   - `ToolGrid.tsx`
   - `ToolFilters.tsx`
   - `StreamingResponse.tsx`

4. **Analytics Components**
   - `SimpleAnalyticsCard.tsx`
   - `DetailedAnalyticsDashboard.tsx`
   - `SystemAnalyticsDashboard.tsx`

5. **Admin Components**
   - `OrgList.tsx`
   - `OrgDetails.tsx`
   - `ToolAccessManager.tsx`
   - `CreateToolForm.tsx`

**VERIFY**: Each component renders without errors in Storybook or dev environment.

### Step 6.5: Create Pages (In This Order)

1. **Root Layout** (`src/app/layout.tsx`)
   - Clerk Provider
   - Global styles
   - Toast provider

2. **Landing Page** (`src/app/page.tsx`)
   - Sign in/Sign up UI
   - Redirect if authenticated

3. **Dashboard Layout** (`src/app/(dashboard)/layout.tsx`)
   - Protected route wrapper
   - DashboardLayout component
   - Context providers

4. **Main Dashboard** (`src/app/(dashboard)/page.tsx`)
   - ToolGrid component
   - Tools-first view

5. **Tool Pages** (`src/app/tools/[slug]/page.tsx`)
   - Dynamic routing
   - Tool execution
   - Streaming responses

6. **Knowledge Base** (`src/app/(dashboard)/knowledge/page.tsx`)
   - Document upload
   - Document list
   - Global vs agent-specific toggle

7. **Analytics** (`src/app/(dashboard)/analytics/page.tsx`)
   - Role-based rendering
   - Simple for members
   - Detailed for admins

8. **Workspaces** (`src/app/(dashboard)/workspaces/page.tsx` and `[id]/page.tsx`)
   - List view
   - Detail view with tabs

9. **Settings** (`src/app/(dashboard)/settings/page.tsx`)
   - User profile
   - Preferences

10. **Admin Pages** (`src/app/(dashboard)/admin/...`)
    - Organizations list and detail
    - Tools management
    - System analytics

**VERIFY**: All pages render and routing works correctly.

---

## Phase 7: Integration & Testing (20 minutes)

### Step 7.1: Configure Clerk Webhook

1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/auth/webhook`
3. Enable events: user.created, user.updated, user.deleted
4. Copy webhook secret to .env

**VERIFY**: Test webhook with Clerk's test event feature.

### Step 7.2: Test Authentication Flow

1. Sign up new user via Clerk
2. Verify user created in Supabase users table
3. Verify user can log in
4. Verify JWT token is validated
5. Verify user data loads in dashboard

### Step 7.3: Test Tool Access (CRITICAL)

Create test data:

```sql
-- Create test organization
INSERT INTO organizations (name, slug) VALUES ('Test Org', 'test-org');

-- Create test users with different roles
INSERT INTO users (clerk_id, email, role, organization_id) VALUES
  ('test_admin', 'admin@test.com', 'SYSTEM_ADMIN', NULL),
  ('test_owner', 'owner@test.com', 'ORG_OWNER', '<org_id>'),
  ('test_member', 'member@test.com', 'MEMBER', '<org_id>');

-- Create test workspace
INSERT INTO workspaces (name, slug, organization_id) VALUES ('Engineering', 'engineering', '<org_id>');

-- Add member to workspace
INSERT INTO workspace_members (workspace_id, user_id) VALUES ('<workspace_id>', '<member_user_id>');

-- Create test tool
INSERT INTO tools (name, slug, type) VALUES ('Test Tool', 'test-tool', 'internal');

-- Test 1: Assign to organization
INSERT INTO tool_access (tool_id, organization_id, granted_by) VALUES ('<tool_id>', '<org_id>', '<admin_id>');

-- Test 2: Assign to workspace
INSERT INTO tool_access (tool_id, workspace_id, granted_by) VALUES ('<tool_id>', '<workspace_id>', '<owner_id>');

-- Test 3: Assign to individual
INSERT INTO tool_access (tool_id, user_id, granted_by) VALUES ('<tool_id>', '<member_id>', '<owner_id>');
```

**VERIFY**:

- [ ] Member sees tool assigned to organization
- [ ] Member sees tool assigned to their workspace
- [ ] Member sees tool assigned to them individually
- [ ] Member does NOT see tools without any assignment
- [ ] Org Owner can assign tools
- [ ] System Admin can create tools

### Step 7.4: Test Analytics

**VERIFY**:

- [ ] Member sees only 3 simple metrics (no cost data)
- [ ] Org Owner sees detailed analytics (no cost data)
- [ ] System Admin sees all analytics (with cost data)
- [ ] Workspace Admin sees workspace analytics (no cost data)

### Step 7.5: Test Tool Execution

1. Create Airia API test account
2. Configure tool with Airia integration
3. Execute tool with test input
4. **VERIFY**: Response streams in real-time
5. **VERIFY**: Usage logged in usage_analytics table

### Step 7.6: Test Knowledge Base

1. Upload global document
2. **VERIFY**: Visible to all org members
3. Upload agent-specific document
4. **VERIFY**: Only visible when viewing that tool

---

## Phase 8: Build & Deploy (10 minutes)

### Step 8.1: Run Production Build

```bash
npm run build
```

**VERIFY**: Build completes without errors or warnings.

### Step 8.2: Run Linter

```bash
npm run lint
```

**VERIFY**: No linting errors.

### Step 8.3: Run Tests

```bash
npm run test
```

**VERIFY**: All tests pass.

### Step 8.4: Deploy to Vercel

1. Connect GitHub repository
2. Configure environment variables
3. Deploy
4. **VERIFY**: Production deployment successful

---

## Common Errors & Solutions

### Error: "Cannot find module '@supabase/supabase-js'"

**Solution**: Run `npm install @supabase/supabase-js`

### Error: "Supabase client is not defined"

**Solution**: Check .env file has SUPABASE_URL and keys

### Error: "RLS policy prevents access"

**Solution**: Check RLS policies, ensure user has proper role

### Error: "Clerk webhook verification failed"

**Solution**: Verify CLERK_WEBHOOK_SECRET matches Clerk dashboard

### Error: "Tool access check returns false"

**Solution**: Debug with SQL: `SELECT check_tool_access('<user_id>', '<tool_id>');`

### Error: "Circular dependency detected"

**Solution**: Check import order, use type-only imports where possible

### Error: "CORS error in browser"

**Solution**: Verify FRONTEND_URL in .env matches actual frontend URL

### Error: "Database connection pool exhausted"

**Solution**: Supabase has connection limits, check for unclosed connections

---

## Performance Optimization Checklist

After build is complete:

- [ ] Add indexes to frequently queried columns
- [ ] Use database functions for complex queries
- [ ] Implement pagination on list endpoints
- [ ] Add caching for tool lists (5 minute TTL)
- [ ] Optimize RLS policies (avoid SELECT \*)
- [ ] Use React.memo for expensive components
- [ ] Implement virtual scrolling for long lists
- [ ] Lazy load tool execution pages
- [ ] Compress API responses
- [ ] Enable Supabase connection pooling

---

## Security Verification Checklist

Before going live:

- [ ] All tables have RLS enabled
- [ ] Service role key only used on backend
- [ ] No API keys in frontend code
- [ ] All inputs validated with Zod
- [ ] Rate limiting configured
- [ ] CORS limited to specific origin
- [ ] Helmet middleware configured
- [ ] Passwords never logged
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (React escaping)
- [ ] CSRF tokens on state-changing operations
- [ ] Webhook signatures verified
- [ ] File uploads sanitized
- [ ] User roles checked on every sensitive operation

---

## Final Verification

Run through this complete user journey:

1. System Admin logs in
2. Creates organization "Acme Corp"
3. Invites user as Org Owner
4. Org Owner logs in
5. Creates workspace "Engineering"
6. Invites member to workspace
7. System Admin creates tool "AI Writer"
8. System Admin assigns tool to "Acme Corp"
9. Member logs in
10. Sees "AI Writer" in their tools
11. Executes "AI Writer" with test input
12. Sees streaming response
13. Checks analytics - sees run count
14. Org Owner checks analytics - sees detailed stats (no costs)
15. System Admin checks analytics - sees costs

**If ALL steps work → BUILD COMPLETE ✅**

---

## Maintenance Notes

### Adding New Tool

1. Create tool record in database
2. Create internal page in `/app/tools/[slug]` OR configure iframe URL
3. Assign to test organization
4. Test execution
5. Document in tool catalog

### Adding New User Role

1. Add to role enum in users table
2. Update RLS policies
3. Update role middleware
4. Update frontend role checks
5. Update documentation

### Database Migrations

- Always create new migration file
- Never modify existing migrations
- Test migrations on staging first
- Keep migrations under 1000 lines
- Include rollback script

---

## Support Resources

- Supabase Docs: https://supabase.com/docs
- Clerk Docs: https://clerk.com/docs
- React Docs: https://react.dev
- Express Docs: https://expressjs.com
- TypeScript Docs: https://www.typescriptlang.org/docs

---

**END OF BUILD INSTRUCTIONS**
