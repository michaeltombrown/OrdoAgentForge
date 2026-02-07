# Phase 7 - Integration & Testing Guide

## Date: February 6, 2026

---

## 📋 PREREQUISITES

Before proceeding with Phase 7 testing, ensure:

- [x] Phase 1-6 completed
- [x] Step 7.1 completed (Clerk webhook configured)
- [ ] `.env` file created with all required variables
- [ ] Supabase database migrations run
- [ ] Dependencies installed (`npm install`)

---

## 🚀 STEP 7.1: Configure Clerk Webhook (COMPLETED ✅)

**Status**: ✅ Code implementation complete  
**File**: `PHASE_7_STEP_1_COMPLETE.md`

### Remaining Manual Tasks:

1. Create `.env` file: `cp .env.example .env`
2. Add actual Clerk webhook secret to `.env`
3. Configure webhook endpoint in Clerk Dashboard
4. Test webhook with Clerk's test feature

---

## 🧪 STEP 7.2: Test Authentication Flow

### Prerequisites

- [ ] Server running: `npm run dev:server`
- [ ] Client running: `npm run dev:client`
- [ ] Both servers healthy (check console for errors)

### Test Cases

#### Test 7.2.1: Sign Up New User

1. **Action**: Open browser to `http://localhost:5173`
2. **Action**: Click "Sign Up" or navigate to sign-up page
3. **Action**: Create new account with:
   - Email: `testuser@example.com`
   - Password: (secure password)
4. **Expected**:
   - ✅ Clerk sign-up form appears
   - ✅ Account created successfully
   - ✅ Redirected to dashboard/home
   - ✅ Webhook triggers (check server logs)

#### Test 7.2.2: Verify User Created in Supabase

1. **Action**: Open Supabase Dashboard → Table Editor → `users` table
2. **Expected**:
   - ✅ New row with:
     - `clerk_id`: matches Clerk user ID
     - `email`: `testuser@example.com`
     - `created_at`: recent timestamp
     - `role`: `MEMBER` (default)
     - `organization_id`: NULL (no org yet)

#### Test 7.2.3: Test Login

1. **Action**: Log out from application
2. **Action**: Log in with same credentials
3. **Expected**:
   - ✅ Login successful
   - ✅ Redirected to dashboard
   - ✅ No errors in console

#### Test 7.2.4: Verify JWT Token Validation

1. **Action**: Open browser DevTools → Network tab
2. **Action**: Refresh dashboard
3. **Action**: Find API request to `/api/auth/me`
4. **Expected**:
   - ✅ Request includes `Authorization` header
   - ✅ Response: 200 OK
   - ✅ Response body contains user data
   ```json
   {
     "id": "uuid",
     "clerk_id": "user_xxx",
     "email": "testuser@example.com",
     "role": "MEMBER"
   }
   ```

#### Test 7.2.5: Verify User Data Loads in Dashboard

1. **Action**: Navigate to dashboard
2. **Expected**:
   - ✅ User name/email displays correctly
   - ✅ User avatar/initials show
   - ✅ No "unauthorized" errors
   - ✅ Dashboard components render

### API Testing (Optional - Advanced)

```bash
# Get JWT token from Clerk (in browser console)
const token = await window.Clerk.session.getToken();
console.log(token);

# Test API with curl
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3001/api/auth/me
```

### Troubleshooting 7.2

| Issue                | Solution                             |
| -------------------- | ------------------------------------ |
| Webhook not firing   | Check CLERK_WEBHOOK_SECRET in `.env` |
| User not in Supabase | Check server logs for webhook errors |
| JWT validation fails | Verify CLERK_SECRET_KEY in `.env`    |
| CORS errors          | Check server CORS configuration      |

---

## 🔧 STEP 7.3: Test Tool Access (CRITICAL)

### Prerequisites

- [ ] Test user created (from Step 7.2)
- [ ] Supabase SQL Editor open

### Setup Test Data

Run this SQL in Supabase SQL Editor:

```sql
-- Step 1: Create test organization
INSERT INTO organizations (id, name, slug, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Test Organization',
  'test-org',
  NOW(),
  NOW()
)
RETURNING id;
-- Save the returned ID as <org_id>

-- Step 2: Create test users with different roles
-- Update existing user to be ORG_OWNER
UPDATE users
SET role = 'ORG_OWNER',
    organization_id = '<org_id>'  -- Replace with actual org_id
WHERE email = 'testuser@example.com';

-- Create additional test users (optional)
INSERT INTO users (id, clerk_id, email, role, organization_id, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'test_admin', 'admin@test.com', 'SYSTEM_ADMIN', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'test_member', 'member@test.com', 'MEMBER', '<org_id>', NOW(), NOW())
RETURNING id;
-- Save member user ID as <member_id>

-- Step 3: Create test workspace
INSERT INTO workspaces (id, name, slug, organization_id, created_by, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Engineering',
  'engineering',
  '<org_id>',  -- Replace with actual org_id
  (SELECT id FROM users WHERE email = 'testuser@example.com'),
  NOW(),
  NOW()
)
RETURNING id;
-- Save workspace ID as <workspace_id>

-- Step 4: Add member to workspace
INSERT INTO workspace_members (workspace_id, user_id, role, added_by, added_at)
VALUES (
  '<workspace_id>',  -- Replace with actual workspace_id
  '<member_id>',     -- Replace with actual member_id
  'MEMBER',
  (SELECT id FROM users WHERE email = 'testuser@example.com'),
  NOW()
);

-- Step 5: Create test tool
INSERT INTO tools (id, name, slug, description, type, icon, tags, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Test AI Tool',
  'test-ai-tool',
  'A test tool for validation',
  'internal',
  'bot',
  ARRAY['test', 'ai', 'validation'],
  NOW(),
  NOW()
)
RETURNING id;
-- Save tool ID as <tool_id>
```

### Test Cases

#### Test 7.3.1: Organization-Level Tool Access

```sql
-- Grant tool access to entire organization
INSERT INTO tool_access (tool_id, organization_id, granted_by, granted_at)
VALUES (
  '<tool_id>',  -- Replace with actual tool_id
  '<org_id>',   -- Replace with actual org_id
  (SELECT id FROM users WHERE email = 'testuser@example.com'),
  NOW()
);
```

**Expected**:

- ✅ All organization members see the tool
- ✅ Tool appears in tools list for `testuser@example.com`
- ✅ Tool appears in tools list for `member@test.com`

#### Test 7.3.2: Workspace-Level Tool Access

```sql
-- Create another test tool
INSERT INTO tools (id, name, slug, description, type, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Workspace Tool',
  'workspace-tool',
  'Tool for workspace only',
  'internal',
  NOW(),
  NOW()
)
RETURNING id;
-- Save as <workspace_tool_id>

-- Grant to workspace only
INSERT INTO tool_access (tool_id, workspace_id, granted_by, granted_at)
VALUES (
  '<workspace_tool_id>',
  '<workspace_id>',
  (SELECT id FROM users WHERE email = 'testuser@example.com'),
  NOW()
);
```

**Expected**:

- ✅ Only workspace members see this tool
- ✅ Users not in workspace do NOT see this tool

#### Test 7.3.3: Individual User Tool Access

```sql
-- Create another test tool
INSERT INTO tools (id, name, slug, description, type, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Personal Tool',
  'personal-tool',
  'Tool for specific user',
  'internal',
  NOW(),
  NOW()
)
RETURNING id;
-- Save as <personal_tool_id>

-- Grant to specific user only
INSERT INTO tool_access (tool_id, user_id, granted_by, granted_at)
VALUES (
  '<personal_tool_id>',
  '<member_id>',
  (SELECT id FROM users WHERE email = 'testuser@example.com'),
  NOW()
);
```

**Expected**:

- ✅ Only the specific user sees this tool
- ✅ Other org members do NOT see this tool

#### Test 7.3.4: Permission Testing

**Test ORG_OWNER can assign tools**:

1. Log in as `testuser@example.com` (ORG_OWNER)
2. Navigate to Admin → Tools
3. Assign tool to user/workspace/org
4. **Expected**: ✅ Assignment succeeds

**Test SYSTEM_ADMIN can create tools**:

1. Update a test user to SYSTEM_ADMIN role
2. Log in as admin
3. Navigate to Admin → Tools
4. Create new tool
5. **Expected**: ✅ Tool creation succeeds

**Test MEMBER cannot create tools**:

1. Log in as regular member
2. Try to access Admin → Tools → Create
3. **Expected**: ✅ Denied or UI hidden

### Verification Queries

```sql
-- View all tool access for a user
SELECT t.name, t.slug, ta.organization_id, ta.workspace_id, ta.user_id
FROM tools t
JOIN tool_access ta ON t.id = ta.tool_id
WHERE ta.user_id = '<member_id>'
   OR ta.organization_id = (SELECT organization_id FROM users WHERE id = '<member_id>')
   OR ta.workspace_id IN (
       SELECT workspace_id FROM workspace_members WHERE user_id = '<member_id>'
   );

-- Count tools visible to user
SELECT COUNT(DISTINCT t.id)
FROM tools t
LEFT JOIN tool_access ta ON t.id = ta.tool_id
LEFT JOIN users u ON u.id = '<user_id>'
LEFT JOIN workspace_members wm ON wm.user_id = u.id
WHERE ta.user_id = u.id
   OR ta.organization_id = u.organization_id
   OR ta.workspace_id = wm.workspace_id;
```

---

## 📊 STEP 7.4: Test Analytics

### Test Cases

#### Test 7.4.1: Member Sees Basic Metrics Only

1. Log in as MEMBER user
2. Navigate to Analytics page
3. **Expected**:
   - ✅ Shows 3 simple metrics:
     - Total tool executions
     - Active tools count
     - Average execution time
   - ❌ Does NOT show cost data
   - ❌ Does NOT show detailed breakdowns

#### Test 7.4.2: Org Owner Sees Detailed Analytics

1. Log in as ORG_OWNER
2. Navigate to Analytics page
3. **Expected**:
   - ✅ Shows detailed analytics:
     - Usage by tool
     - Usage by user
     - Usage trends over time
   - ❌ Does NOT show cost data
   - ✅ Shows org-wide data

#### Test 7.4.3: System Admin Sees All Analytics

1. Update test user to SYSTEM_ADMIN role
2. Log in as admin
3. Navigate to Analytics page
4. **Expected**:
   - ✅ Shows all analytics including:
     - Cost data
     - Revenue metrics
     - System-wide statistics
     - All organizations' data

#### Test 7.4.4: Workspace Admin Sees Workspace Analytics

1. Create user with WORKSPACE_ADMIN role in a workspace
2. Log in as workspace admin
3. Navigate to Analytics page
4. **Expected**:
   - ✅ Shows workspace analytics
   - ✅ Filtered to workspace only
   - ❌ Does NOT show cost data
   - ❌ Does NOT see other workspaces' data

### Create Test Analytics Data

```sql
-- Generate sample usage data
INSERT INTO usage_analytics (
  user_id,
  tool_id,
  workspace_id,
  organization_id,
  execution_time_ms,
  tokens_used,
  cost_usd,
  request_data,
  response_data,
  created_at
)
SELECT
  u.id,
  t.id,
  w.id,
  u.organization_id,
  (random() * 5000)::int,  -- Random execution time 0-5000ms
  (random() * 1000)::int,  -- Random tokens 0-1000
  (random() * 0.50)::numeric(10,4),  -- Random cost $0-0.50
  '{"query": "test"}',
  '{"result": "success"}',
  NOW() - (random() * interval '30 days')  -- Random date in last 30 days
FROM users u
CROSS JOIN tools t
CROSS JOIN workspaces w
WHERE u.organization_id = w.organization_id
LIMIT 100;  -- Generate 100 sample records
```

---

## 🤖 STEP 7.5: Test Tool Execution

### Prerequisites

- [ ] Airia API key configured in `.env`
- [ ] Test tool created (from Step 7.3)

### Test Cases

#### Test 7.5.1: Configure Tool with Airia Integration

1. Navigate to Admin → Tools
2. Edit "Test AI Tool"
3. Configure:
   - Type: `airia`
   - Configuration: Add Airia settings
   - Model: Select appropriate model
4. Save
5. **Expected**: ✅ Configuration saved successfully

#### Test 7.5.2: Execute Tool with Test Input

1. Navigate to Tools → Test AI Tool
2. Enter test input: "What is the weather today?"
3. Click Execute/Submit
4. **Expected**:
   - ✅ Loading indicator shows
   - ✅ Response streams in real-time
   - ✅ Complete response appears
   - ✅ No errors in console

#### Test 7.5.3: Verify Usage Logged in Database

```sql
-- Check latest usage entry
SELECT
  u.email,
  t.name as tool_name,
  ua.execution_time_ms,
  ua.tokens_used,
  ua.cost_usd,
  ua.created_at
FROM usage_analytics ua
JOIN users u ON ua.user_id = u.id
JOIN tools t ON ua.tool_id = t.id
ORDER BY ua.created_at DESC
LIMIT 5;
```

**Expected**:

- ✅ New row with recent timestamp
- ✅ Correct user_id and tool_id
- ✅ Execution time > 0
- ✅ Tokens used > 0 (if applicable)

#### Test 7.5.4: Test Streaming Response

1. Execute tool with longer query
2. Watch response area
3. **Expected**:
   - ✅ Text appears incrementally
   - ✅ Not all at once
   - ✅ Smooth streaming animation

---

## 📚 STEP 7.6: Test Knowledge Base

### Test Cases

#### Test 7.6.1: Upload Global Document

1. Navigate to Knowledge Base
2. Upload document (PDF/TXT/MD)
3. Set visibility: "Global" or "Organization"
4. **Expected**:
   - ✅ Upload succeeds
   - ✅ Document appears in list
   - ✅ All org members can see it

#### Test 7.6.2: Verify Global Visibility

1. Log in as different user in same org
2. Navigate to Knowledge Base
3. **Expected**:
   - ✅ Global document is visible
   - ✅ Can view/download document

#### Test 7.6.3: Upload Agent-Specific Document

1. Navigate to specific tool page
2. Go to Knowledge section
3. Upload document
4. Set visibility: "Tool-specific"
5. **Expected**:
   - ✅ Upload succeeds
   - ✅ Document linked to tool

#### Test 7.6.4: Verify Tool-Specific Visibility

1. Navigate to different tool
2. Check Knowledge section
3. **Expected**:
   - ❌ Tool-specific doc from other tool NOT visible
   - ✅ Only docs for current tool show

### Database Verification

```sql
-- View all documents
SELECT
  d.name,
  d.file_type,
  d.visibility,
  t.name as tool_name,
  u.email as uploaded_by
FROM documents d
LEFT JOIN tools t ON d.tool_id = t.id
JOIN users u ON d.uploaded_by = u.id
ORDER BY d.created_at DESC;
```

---

## 🎯 COMPLETION CHECKLIST

### Step 7.1: Clerk Webhook

- [x] Webhook middleware created
- [x] Route configured
- [ ] Webhook tested (MANUAL)

### Step 7.2: Authentication Flow

- [ ] User sign-up tested
- [ ] User appears in Supabase
- [ ] Login tested
- [ ] JWT validation works
- [ ] Dashboard loads user data

### Step 7.3: Tool Access

- [ ] Test data created
- [ ] Org-level access works
- [ ] Workspace-level access works
- [ ] User-level access works
- [ ] Permissions enforced

### Step 7.4: Analytics

- [ ] Member sees basic metrics
- [ ] Owner sees detailed analytics
- [ ] Admin sees cost data
- [ ] Workspace admin sees workspace data

### Step 7.5: Tool Execution

- [ ] Airia API configured
- [ ] Tool execution works
- [ ] Streaming response works
- [ ] Usage logged correctly

### Step 7.6: Knowledge Base

- [ ] Global document upload works
- [ ] Global visibility correct
- [ ] Tool-specific upload works
- [ ] Tool-specific visibility correct

---

## 🚀 NEXT PHASE

Once all Step 7 tests pass:

- **Phase 8**: Build & Deploy
  - Production build
  - Linting
  - Tests
  - Vercel deployment

---

## 📝 NOTES

- Run tests in order
- Fix issues before proceeding to next test
- Document any deviations or issues
- Keep test data for reference

**Phase 7 Status**: 🚧 IN PROGRESS
