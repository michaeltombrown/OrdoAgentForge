-- ============================================================
-- QUICK SETUP SCRIPT FOR TESTING
-- Run this in Supabase SQL Editor AFTER creating Clerk users
-- ============================================================

-- INSTRUCTIONS:
-- 1. Create 4 users in Clerk Dashboard (https://dashboard.clerk.com)
-- 2. Get their Clerk IDs from the dashboard
-- 3. Replace the placeholders below with actual Clerk IDs
-- 4. Run this entire script in Supabase SQL Editor

-- ============================================================
-- REPLACE THESE WITH YOUR ACTUAL CLERK IDs
-- ============================================================
\set clerk_id_admin 'user_XXXXXXXXXXXXXXXXXXXX'
\set clerk_id_owner 'user_YYYYYYYYYYYYYYYYYYYY'
\set clerk_id_wsadmin 'user_ZZZZZZZZZZZZZZZZZZZZ'
\set clerk_id_member 'user_WWWWWWWWWWWWWWWWWWWW'

-- ============================================================
-- STEP 1: Create Organization
-- ============================================================
INSERT INTO organizations (id, name, slug, settings)
VALUES (
  'org_acme_001',
  'Acme Corp',
  'acme-corp',
  '{"features": ["tools", "analytics", "workspaces"]}'::jsonb
);

-- ============================================================
-- STEP 2: Create Workspace
-- ============================================================
INSERT INTO workspaces (id, name, slug, organization_id, settings)
VALUES (
  'ws_eng_001',
  'Engineering Team',
  'engineering',
  'org_acme_001',
  '{"features": ["collaboration", "tools"]}'::jsonb
);

-- ============================================================
-- STEP 3: Update User Roles
-- ============================================================

-- System Admin (no organization)
UPDATE users 
SET 
  role = 'SYSTEM_ADMIN',
  organization_id = NULL,
  updated_at = NOW()
WHERE clerk_id = :'clerk_id_admin';

-- Org Owner
UPDATE users 
SET 
  role = 'ORG_OWNER',
  organization_id = 'org_acme_001',
  updated_at = NOW()
WHERE clerk_id = :'clerk_id_owner';

-- Workspace Admin
UPDATE users 
SET 
  role = 'WORKSPACE_ADMIN',
  organization_id = 'org_acme_001',
  updated_at = NOW()
WHERE clerk_id = :'clerk_id_wsadmin';

-- Member
UPDATE users 
SET 
  role = 'MEMBER',
  organization_id = 'org_acme_001',
  updated_at = NOW()
WHERE clerk_id = :'clerk_id_member';

-- ============================================================
-- STEP 4: Add Users to Workspace
-- ============================================================

-- Add Workspace Admin to workspace
INSERT INTO workspace_members (workspace_id, user_id, role)
VALUES (
  'ws_eng_001',
  (SELECT id FROM users WHERE clerk_id = :'clerk_id_wsadmin'),
  'admin'
);

-- Add Member to workspace
INSERT INTO workspace_members (workspace_id, user_id, role)
VALUES (
  'ws_eng_001',
  (SELECT id FROM users WHERE clerk_id = :'clerk_id_member'),
  'member'
);

-- ============================================================
-- STEP 5: Create Sample Tools
-- ============================================================

-- Tool 1: AI Content Writer
INSERT INTO tools (id, name, slug, description, type, config, tags)
VALUES (
  'tool_writer_001',
  'AI Content Writer',
  'ai-content-writer',
  'Generate high-quality content using AI',
  'airia',
  '{"model": "gpt-4", "max_tokens": 2000, "temperature": 0.7}'::jsonb,
  ARRAY['content', 'writing', 'ai', 'gpt-4']
);

-- Tool 2: Code Assistant
INSERT INTO tools (id, name, slug, description, type, config, tags)
VALUES (
  'tool_code_001',
  'Code Assistant',
  'code-assistant',
  'AI-powered coding help and code generation',
  'airia',
  '{"model": "gpt-4", "max_tokens": 4000, "temperature": 0.3}'::jsonb,
  ARRAY['code', 'programming', 'ai', 'development']
);

-- Tool 3: Data Analyzer
INSERT INTO tools (id, name, slug, description, type, config, tags)
VALUES (
  'tool_data_001',
  'Data Analyzer',
  'data-analyzer',
  'Analyze and visualize data with AI insights',
  'airia',
  '{"model": "gpt-4", "max_tokens": 3000, "temperature": 0.5}'::jsonb,
  ARRAY['data', 'analysis', 'ai', 'insights']
);

-- ============================================================
-- STEP 6: Assign Tools to Organization
-- ============================================================

-- Assign all tools to Acme Corp organization
INSERT INTO tool_access (tool_id, organization_id, granted_by, granted_at)
VALUES 
  (
    'tool_writer_001',
    'org_acme_001',
    (SELECT id FROM users WHERE clerk_id = :'clerk_id_admin'),
    NOW()
  ),
  (
    'tool_code_001',
    'org_acme_001',
    (SELECT id FROM users WHERE clerk_id = :'clerk_id_admin'),
    NOW()
  ),
  (
    'tool_data_001',
    'org_acme_001',
    (SELECT id FROM users WHERE clerk_id = :'clerk_id_admin'),
    NOW()
  );

-- ============================================================
-- STEP 7: Create Sample Usage Analytics (for testing)
-- ============================================================

-- Add some sample usage data for analytics testing
INSERT INTO usage_analytics (
  user_id,
  tool_id,
  workspace_id,
  organization_id,
  execution_time_ms,
  tokens_used,
  cost,
  success
)
SELECT
  u.id,
  'tool_writer_001',
  'ws_eng_001',
  'org_acme_001',
  floor(random() * 3000 + 500)::integer,
  floor(random() * 2000 + 100)::integer,
  random() * 0.50,
  true
FROM users u
WHERE u.organization_id = 'org_acme_001'
AND u.role IN ('MEMBER', 'WORKSPACE_ADMIN')
LIMIT 10;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- View all users and their roles
SELECT 
  clerk_id,
  email,
  name,
  role,
  organization_id
FROM users
ORDER BY role;

-- View organization and workspace structure
SELECT 
  o.name as org_name,
  w.name as workspace_name,
  COUNT(wm.user_id) as member_count
FROM organizations o
LEFT JOIN workspaces w ON w.organization_id = o.id
LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
GROUP BY o.id, o.name, w.id, w.name;

-- View tool assignments
SELECT 
  t.name as tool_name,
  CASE 
    WHEN ta.organization_id IS NOT NULL THEN 'Organization: ' || o.name
    WHEN ta.workspace_id IS NOT NULL THEN 'Workspace: ' || w.name
    WHEN ta.user_id IS NOT NULL THEN 'User: ' || u.email
  END as assigned_to
FROM tools t
JOIN tool_access ta ON t.id = ta.tool_id
LEFT JOIN organizations o ON ta.organization_id = o.id
LEFT JOIN workspaces w ON ta.workspace_id = w.id
LEFT JOIN users u ON ta.user_id = u.id
ORDER BY t.name;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Setup Complete! You can now test with these users:';
  RAISE NOTICE '   - System Admin: admin@ordoagentforge.com';
  RAISE NOTICE '   - Org Owner: owner@acmecorp.com';
  RAISE NOTICE '   - Workspace Admin: wsadmin@acmecorp.com';
  RAISE NOTICE '   - Member: member@acmecorp.com';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Created:';
  RAISE NOTICE '   - 1 Organization (Acme Corp)';
  RAISE NOTICE '   - 1 Workspace (Engineering Team)';
  RAISE NOTICE '   - 3 Tools (AI Content Writer, Code Assistant, Data Analyzer)';
  RAISE NOTICE '   - Sample usage analytics';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Start the app: npm run dev';
END $$;
