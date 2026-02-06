-- ============================================
-- 003_rls.sql
-- Multi-Tenant AI Dashboard - Row Level Security Policies
-- Run this AFTER 001_initial_schema.sql and 002_functions.sql
-- ============================================

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "users_select_own"
ON users FOR SELECT
USING (clerk_id = auth.jwt()->>'sub');

-- Users can update their own profile
CREATE POLICY "users_update_own"
ON users FOR UPDATE
USING (clerk_id = auth.jwt()->>'sub');

-- Org owners can view users in their organization
CREATE POLICY "users_select_org_owner"
ON users FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'ORG_OWNER'
  )
);

-- System admins can view all users
CREATE POLICY "users_select_system_admin"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'SYSTEM_ADMIN'
  )
);

-- System admins and org owners can insert users
CREATE POLICY "users_insert_admin_owner"
ON users FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = auth.jwt()->>'sub' 
    AND role IN ('SYSTEM_ADMIN', 'ORG_OWNER')
  )
);

-- ============================================
-- ORGANIZATIONS TABLE POLICIES
-- ============================================

-- Users can view their own organization
CREATE POLICY "orgs_select_own"
ON organizations FOR SELECT
USING (
  id IN (
    SELECT organization_id FROM users
    WHERE clerk_id = auth.jwt()->>'sub'
  )
);

-- System admins can view all organizations
CREATE POLICY "orgs_select_system_admin"
ON organizations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'SYSTEM_ADMIN'
  )
);

-- Only system admins can create organizations
CREATE POLICY "orgs_insert_system_admin"
ON organizations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'SYSTEM_ADMIN'
  )
);

-- Org owners and system admins can update organizations
CREATE POLICY "orgs_update_owner_admin"
ON organizations FOR UPDATE
USING (
  owner_id IN (
    SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'
  )
  OR EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'SYSTEM_ADMIN'
  )
);

-- ============================================
-- WORKSPACES TABLE POLICIES
-- ============================================

-- Users can view workspaces they belong to
CREATE POLICY "workspaces_select_member"
ON workspaces FOR SELECT
USING (
  id IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'
    )
  )
);

-- Org owners can view all workspaces in their org
CREATE POLICY "workspaces_select_org_owner"
ON workspaces FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'ORG_OWNER'
  )
);

-- Org owners can create workspaces in their org
CREATE POLICY "workspaces_insert_org_owner"
ON workspaces FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'ORG_OWNER'
  )
);

-- Org owners and workspace admins can update workspaces
CREATE POLICY "workspaces_update_owner_admin"
ON workspaces FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'ORG_OWNER'
  )
  OR admin_id IN (
    SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'
  )
);

-- ============================================
-- WORKSPACE MEMBERS TABLE POLICIES
-- ============================================

-- Users can view members of workspaces they belong to
CREATE POLICY "workspace_members_select"
ON workspace_members FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'
    )
  )
);

-- Org owners and workspace admins can manage members
CREATE POLICY "workspace_members_insert_admin"
ON workspace_members FOR INSERT
WITH CHECK (
  workspace_id IN (
    SELECT w.id FROM workspaces w
    JOIN users u ON u.organization_id = w.organization_id
    WHERE u.clerk_id = auth.jwt()->>'sub' AND u.role IN ('ORG_OWNER', 'WORKSPACE_ADMIN')
  )
);

CREATE POLICY "workspace_members_delete_admin"
ON workspace_members FOR DELETE
USING (
  workspace_id IN (
    SELECT w.id FROM workspaces w
    JOIN users u ON u.organization_id = w.organization_id
    WHERE u.clerk_id = auth.jwt()->>'sub' AND u.role IN ('ORG_OWNER', 'WORKSPACE_ADMIN')
  )
);

-- ============================================
-- TOOLS TABLE POLICIES
-- ============================================

-- Users can view tools they have access to
CREATE POLICY "tools_select_accessible"
ON tools FOR SELECT
USING (
  id IN (
    SELECT tool_id FROM get_user_tools(
      (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub')
    )
  )
);

-- System admins can manage all tools
CREATE POLICY "tools_insert_system_admin"
ON tools FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'SYSTEM_ADMIN'
  )
);

CREATE POLICY "tools_update_system_admin"
ON tools FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'SYSTEM_ADMIN'
  )
);

CREATE POLICY "tools_delete_system_admin"
ON tools FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'SYSTEM_ADMIN'
  )
);

-- ============================================
-- TOOL ACCESS TABLE POLICIES
-- ============================================

-- Users can view tool access for tools they can see
CREATE POLICY "tool_access_select"
ON tool_access FOR SELECT
USING (
  tool_id IN (
    SELECT tool_id FROM get_user_tools(
      (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub')
    )
  )
);

-- System admins can assign tools to organizations
CREATE POLICY "tool_access_insert_system_admin_org"
ON tool_access FOR INSERT
WITH CHECK (
  organization_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'SYSTEM_ADMIN'
  )
);

-- Org owners can assign tools to workspaces and users in their org
CREATE POLICY "tool_access_insert_org_owner"
ON tool_access FOR INSERT
WITH CHECK (
  (workspace_id IS NOT NULL OR user_id IS NOT NULL)
  AND EXISTS (
    SELECT 1 FROM users u
    WHERE u.clerk_id = auth.jwt()->>'sub' 
    AND u.role = 'ORG_OWNER'
    AND (
      workspace_id IN (SELECT id FROM workspaces WHERE organization_id = u.organization_id)
      OR user_id IN (SELECT id FROM users WHERE organization_id = u.organization_id)
    )
  )
);

-- Admins and org owners can delete tool access
CREATE POLICY "tool_access_delete"
ON tool_access FOR DELETE
USING (
  granted_by IN (
    SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'
  )
  OR EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'SYSTEM_ADMIN'
  )
);

-- ============================================
-- DOCUMENTS TABLE POLICIES
-- ============================================

-- Users can view documents in their organization
CREATE POLICY "documents_select_org"
ON documents FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM users
    WHERE clerk_id = auth.jwt()->>'sub'
  )
);

-- Users can insert documents in their organization
CREATE POLICY "documents_insert_org"
ON documents FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM users
    WHERE clerk_id = auth.jwt()->>'sub'
  )
);

-- Users can delete their own uploaded documents
CREATE POLICY "documents_delete_own"
ON documents FOR DELETE
USING (
  uploaded_by IN (
    SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'
  )
);

-- ============================================
-- USAGE ANALYTICS TABLE POLICIES
-- ============================================

-- Users can view their own analytics
CREATE POLICY "analytics_select_own"
ON usage_analytics FOR SELECT
USING (
  user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'
  )
);

-- Workspace admins can view workspace analytics
CREATE POLICY "analytics_select_workspace_admin"
ON usage_analytics FOR SELECT
USING (
  workspace_id IN (
    SELECT w.id FROM workspaces w
    JOIN users u ON u.id = w.admin_id
    WHERE u.clerk_id = auth.jwt()->>'sub'
  )
);

-- Org owners can view organization analytics
CREATE POLICY "analytics_select_org_owner"
ON usage_analytics FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'ORG_OWNER'
  )
);

-- System admins can view all analytics
CREATE POLICY "analytics_select_system_admin"
ON usage_analytics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'SYSTEM_ADMIN'
  )
);

-- System can insert analytics (via service role)
CREATE POLICY "analytics_insert_system"
ON usage_analytics FOR INSERT
WITH CHECK (true);

-- ============================================
-- VERIFY RLS POLICIES
-- ============================================

DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public';
  
  IF policy_count >= 30 THEN
    RAISE NOTICE 'SUCCESS: % RLS policies created successfully', policy_count;
  ELSE
    RAISE WARNING 'WARNING: Only % RLS policies found, expected at least 30', policy_count;
  END IF;
END $$;

-- ============================================
-- END OF RLS POLICIES
-- ============================================
-- Next: Create Storage bucket and test the application
-- ============================================
