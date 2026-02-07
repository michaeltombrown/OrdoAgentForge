# TESTING GUIDE & LOGIN CREDENTIALS

**Generated**: February 7, 2026  
**Application**: OrdoAgentForge Multi-Tenant AI Dashboard  
**Status**: Ready for Testing

---

## 🚀 HOW TO START THE APPLICATION

### Option 1: Development Mode (Recommended for Testing)

```bash
# Terminal 1: Start Backend Server
cd /Users/Michael/OrdoAgentForge
npm run dev:server

# Terminal 2: Start Frontend
cd /Users/Michael/OrdoAgentForge
npm run dev:client
```

**Access**: http://localhost:3000

### Option 2: Production Build

```bash
# Build
npm run build

# Start (requires additional configuration)
npm run preview
```

---

## 👤 USER ACCOUNTS & LOGIN CREDENTIALS

### IMPORTANT: Clerk Authentication Setup Required

**Before you can log in, you need to create users in Clerk:**

1. **Go to Clerk Dashboard**: https://dashboard.clerk.com
2. **Navigate to**: Your Application → Users
3. **Create test users** with the following profiles:

---

## 🔐 TEST USER PROFILES TO CREATE

### 1. SYSTEM ADMIN User

**Create in Clerk**:

- **Email**: `admin@ordoagentforge.com`
- **Name**: System Administrator
- **Password**: Choose a secure password

**Then Update in Supabase**:

```sql
-- After Clerk user is created, get their clerk_id from Clerk dashboard
-- Then run this in Supabase SQL Editor:

UPDATE users
SET role = 'SYSTEM_ADMIN',
    organization_id = NULL
WHERE clerk_id = '<clerk_id_from_dashboard>';
```

**Access Level**:

- ✅ Full system access
- ✅ Create/manage all organizations
- ✅ Create/manage all tools
- ✅ View system-wide analytics with costs
- ✅ Manage all users

---

### 2. ORG OWNER User

**Create in Clerk**:

- **Email**: `owner@acmecorp.com`
- **Name**: John Owner
- **Password**: Choose a secure password

**Then Setup in Supabase**:

```sql
-- 1. Create organization
INSERT INTO organizations (name, slug, settings)
VALUES ('Acme Corp', 'acme-corp', '{}')
RETURNING id;
-- Save the returned id as <org_id>

-- 2. Update user role
UPDATE users
SET role = 'ORG_OWNER',
    organization_id = '<org_id>'
WHERE clerk_id = '<clerk_id_from_dashboard>';
```

**Access Level**:

- ✅ Manage own organization
- ✅ Create/manage workspaces
- ✅ Invite/manage org members
- ✅ View detailed org analytics (no costs)
- ✅ Assign tools to org/workspaces

---

### 3. WORKSPACE ADMIN User

**Create in Clerk**:

- **Email**: `wsadmin@acmecorp.com`
- **Name**: Jane Admin
- **Password**: Choose a secure password

**Then Setup in Supabase**:

```sql
-- 1. Create workspace (or use existing from Org Owner setup)
INSERT INTO workspaces (name, slug, organization_id)
VALUES ('Engineering Team', 'engineering', '<org_id>')
RETURNING id;
-- Save the returned id as <workspace_id>

-- 2. Update user role
UPDATE users
SET role = 'WORKSPACE_ADMIN',
    organization_id = '<org_id>'
WHERE clerk_id = '<clerk_id_from_dashboard>';

-- 3. Add user to workspace
INSERT INTO workspace_members (workspace_id, user_id, role)
VALUES (
  '<workspace_id>',
  (SELECT id FROM users WHERE clerk_id = '<clerk_id_from_dashboard>'),
  'admin'
);
```

**Access Level**:

- ✅ Manage assigned workspace
- ✅ Invite members to workspace
- ✅ View workspace analytics (no costs)
- ✅ Use tools assigned to workspace

---

### 4. MEMBER User

**Create in Clerk**:

- **Email**: `member@acmecorp.com`
- **Name**: Bob Member
- **Password**: Choose a secure password

**Then Setup in Supabase**:

```sql
-- 1. Update user role
UPDATE users
SET role = 'MEMBER',
    organization_id = '<org_id>'
WHERE clerk_id = '<clerk_id_from_dashboard>';

-- 2. Add to workspace (optional)
INSERT INTO workspace_members (workspace_id, user_id, role)
VALUES (
  '<workspace_id>',
  (SELECT id FROM users WHERE clerk_id = '<clerk_id_from_dashboard>'),
  'member'
);
```

**Access Level**:

- ✅ View and use assigned tools
- ✅ View simple analytics (3 metrics, no costs)
- ✅ Upload documents
- ✅ View workspace info

---

## 🧪 TESTING WORKFLOWS

### Workflow 1: System Admin Setup

1. **Login as**: `admin@ordoagentforge.com`
2. **Navigate to**: Admin Dashboard
3. **Create Organization**: "Acme Corp"
4. **Create Tool**: "AI Content Writer"
5. **Assign Tool**: To "Acme Corp" organization
6. **View Analytics**: System-wide with cost data

**Expected Results**:

- ✅ Can access `/admin` routes
- ✅ Can create organizations
- ✅ Can create tools
- ✅ Sees cost data in analytics

---

### Workflow 2: Org Owner Management

1. **Login as**: `owner@acmecorp.com`
2. **Navigate to**: Workspaces
3. **Create Workspace**: "Engineering Team"
4. **Invite Users**: To organization
5. **Assign Tools**: To workspace
6. **View Analytics**: Organization-level (no costs)

**Expected Results**:

- ✅ Can create workspaces
- ✅ Can invite users
- ✅ Can assign tools to workspaces
- ✅ Sees detailed analytics without costs

---

### Workflow 3: Workspace Admin Actions

1. **Login as**: `wsadmin@acmecorp.com`
2. **Navigate to**: Engineering Workspace
3. **Invite Members**: To workspace
4. **View Tools**: Assigned to workspace
5. **Execute Tool**: Test functionality
6. **View Analytics**: Workspace-level

**Expected Results**:

- ✅ Can manage workspace members
- ✅ Can see workspace tools
- ✅ Can execute tools
- ✅ Sees workspace analytics

---

### Workflow 4: Member Usage

1. **Login as**: `member@acmecorp.com`
2. **Navigate to**: Dashboard
3. **View Tools**: Available tools
4. **Execute Tool**: "AI Content Writer"
5. **View Analytics**: Simple metrics only
6. **Upload Document**: To knowledge base

**Expected Results**:

- ✅ Sees only assigned tools
- ✅ Can execute tools
- ✅ Sees 3 simple metrics (no costs)
- ✅ Can upload documents

---

## 🔄 AUTOMATED USER SETUP SCRIPT

For faster testing, use this script in Supabase SQL Editor:

```sql
-- Run this AFTER creating all 4 users in Clerk
-- Replace <clerk_id_X> with actual Clerk IDs from dashboard

-- 1. Create Organization
INSERT INTO organizations (name, slug, settings)
VALUES ('Acme Corp', 'acme-corp', '{}')
RETURNING id;
-- Copy the returned ID and replace <org_id> below

-- 2. Update System Admin
UPDATE users
SET role = 'SYSTEM_ADMIN', organization_id = NULL
WHERE clerk_id = '<clerk_id_admin>';

-- 3. Update Org Owner
UPDATE users
SET role = 'ORG_OWNER', organization_id = '<org_id>'
WHERE clerk_id = '<clerk_id_owner>';

-- 4. Create Workspace
INSERT INTO workspaces (name, slug, organization_id)
VALUES ('Engineering Team', 'engineering', '<org_id>')
RETURNING id;
-- Copy the returned ID and replace <workspace_id> below

-- 5. Update Workspace Admin
UPDATE users
SET role = 'WORKSPACE_ADMIN', organization_id = '<org_id>'
WHERE clerk_id = '<clerk_id_wsadmin>';

INSERT INTO workspace_members (workspace_id, user_id, role)
VALUES (
  '<workspace_id>',
  (SELECT id FROM users WHERE clerk_id = '<clerk_id_wsadmin>'),
  'admin'
);

-- 6. Update Member
UPDATE users
SET role = 'MEMBER', organization_id = '<org_id>'
WHERE clerk_id = '<clerk_id_member>';

INSERT INTO workspace_members (workspace_id, user_id, role)
VALUES (
  '<workspace_id>',
  (SELECT id FROM users WHERE clerk_id = '<clerk_id_member>'),
  'member'
);

-- 7. Create Sample Tool
INSERT INTO tools (name, slug, description, type, config, tags)
VALUES (
  'AI Content Writer',
  'ai-content-writer',
  'Generate high-quality content using AI',
  'airia',
  '{"model": "gpt-4", "max_tokens": 2000}',
  ARRAY['content', 'writing', 'ai']
)
RETURNING id;
-- Copy the returned ID and replace <tool_id> below

-- 8. Assign Tool to Organization
INSERT INTO tool_access (tool_id, organization_id, granted_by, granted_at)
VALUES (
  '<tool_id>',
  '<org_id>',
  (SELECT id FROM users WHERE clerk_id = '<clerk_id_admin>'),
  NOW()
);
```

---

## 🧪 TESTING CHECKLIST

### Initial Setup

- [ ] Clerk users created
- [ ] Supabase users updated with roles
- [ ] Organization created
- [ ] Workspace created
- [ ] Users added to workspace
- [ ] Sample tool created
- [ ] Tool assigned to organization

### System Admin Tests

- [ ] Can access admin dashboard
- [ ] Can create organizations
- [ ] Can create tools
- [ ] Can view all analytics with costs
- [ ] Can manage all users

### Org Owner Tests

- [ ] Can create workspaces
- [ ] Can invite users to organization
- [ ] Can assign tools to workspaces
- [ ] Can view org analytics without costs
- [ ] Cannot see system admin features

### Workspace Admin Tests

- [ ] Can manage workspace members
- [ ] Can view workspace tools
- [ ] Can execute tools
- [ ] Can view workspace analytics
- [ ] Cannot create new workspaces

### Member Tests

- [ ] Can view assigned tools only
- [ ] Can execute tools
- [ ] Can view simple analytics (3 metrics)
- [ ] Cannot see cost data
- [ ] Can upload documents

---

## 🐛 TROUBLESHOOTING

### Issue: "User not found after login"

**Solution**: User needs to be synced from Clerk to Supabase

```sql
-- Check if user exists
SELECT * FROM users WHERE clerk_id = '<your_clerk_id>';

-- If not, the webhook may not have fired
-- Manually create:
INSERT INTO users (clerk_id, email, name, role, organization_id)
VALUES ('<clerk_id>', 'user@example.com', 'User Name', 'MEMBER', '<org_id>');
```

### Issue: "Access denied" errors

**Solution**: Check user role and organization

```sql
-- Verify user role
SELECT clerk_id, email, role, organization_id
FROM users
WHERE email = 'user@example.com';

-- Update if needed
UPDATE users
SET role = 'ORG_OWNER', organization_id = '<org_id>'
WHERE email = 'user@example.com';
```

### Issue: "Tools not showing up"

**Solution**: Verify tool access assignments

```sql
-- Check tool access
SELECT t.name, ta.organization_id, ta.workspace_id, ta.user_id
FROM tools t
JOIN tool_access ta ON t.id = ta.tool_id
WHERE ta.organization_id = '<org_id>' OR ta.user_id = '<user_id>';

-- Assign tool to organization
INSERT INTO tool_access (tool_id, organization_id, granted_by)
VALUES ('<tool_id>', '<org_id>', '<admin_user_id>');
```

---

## 🌐 DEPLOYMENT URLS

### Development

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

### Production (After Vercel Deployment)

- **Frontend**: https://ordo-agent-forge.vercel.app
- **Backend API**: https://ordo-agent-forge.vercel.app/api

---

## 📝 QUICK START FOR TESTING

1. **Start the app**:

   ```bash
   npm run dev
   ```

2. **Create 4 users in Clerk** with emails:
   - admin@ordoagentforge.com (System Admin)
   - owner@acmecorp.com (Org Owner)
   - wsadmin@acmecorp.com (Workspace Admin)
   - member@acmecorp.com (Member)

3. **Run the setup script** in Supabase SQL Editor (above)

4. **Login and test** each user workflow

---

## 📊 EXPECTED TEST RESULTS

### System Admin Dashboard

```
✅ Can see "Admin" menu item
✅ Can access /admin routes
✅ Can create organizations
✅ Can create tools
✅ Analytics show cost data
✅ Can view all system metrics
```

### Org Owner Dashboard

```
✅ Can see "Workspaces" menu
✅ Can create new workspace
✅ Can invite users
✅ Can assign tools
✅ Analytics show detailed data (no costs)
✅ Cannot access /admin routes
```

### Workspace Admin Dashboard

```
✅ Can see assigned workspace
✅ Can manage workspace members
✅ Can view workspace tools
✅ Can execute tools
✅ Analytics show workspace data
✅ Cannot create new workspaces
```

### Member Dashboard

```
✅ Can see assigned tools
✅ Can execute tools
✅ Analytics show 3 simple metrics
✅ No cost data visible
✅ Cannot access admin features
```

---

**Ready to Test!** Start with `npm run dev` and follow the setup steps above.

**Questions?** Check troubleshooting section or review logs for errors.
