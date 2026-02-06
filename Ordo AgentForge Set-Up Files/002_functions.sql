-- ============================================
-- 002_functions.sql
-- Multi-Tenant AI Dashboard - Database Functions
-- Run this AFTER 001_initial_schema.sql
-- ============================================

-- ============================================
-- FUNCTION: get_user_tools
-- Returns all tools a user has access to (via org, workspace, or individual assignment)
-- ============================================

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

-- Test the function
DO $$
BEGIN
  RAISE NOTICE 'Function get_user_tools created successfully';
END $$;

-- ============================================
-- FUNCTION: check_tool_access
-- Returns true if user has access to a specific tool
-- ============================================

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

-- Test the function
DO $$
BEGIN
  RAISE NOTICE 'Function check_tool_access created successfully';
END $$;

-- ============================================
-- FUNCTION: get_workspace_member_count
-- Returns the number of members in a workspace
-- ============================================

CREATE OR REPLACE FUNCTION get_workspace_member_count(workspace_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  member_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO member_count
  FROM workspace_members
  WHERE workspace_id = workspace_id_param;
  
  RETURN member_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: get_user_workspaces
-- Returns all workspaces a user belongs to with member counts
-- ============================================

CREATE OR REPLACE FUNCTION get_user_workspaces(user_id_param UUID)
RETURNS TABLE (
  workspace_id UUID,
  workspace_name VARCHAR,
  workspace_slug VARCHAR,
  organization_id UUID,
  admin_id UUID,
  member_count BIGINT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id,
    w.name,
    w.slug,
    w.organization_id,
    w.admin_id,
    COUNT(wm2.id) as member_count,
    w.created_at
  FROM workspaces w
  JOIN workspace_members wm ON wm.workspace_id = w.id
  LEFT JOIN workspace_members wm2 ON wm2.workspace_id = w.id
  WHERE wm.user_id = user_id_param
  GROUP BY w.id, w.name, w.slug, w.organization_id, w.admin_id, w.created_at;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFY FUNCTIONS
-- ============================================

DO $$
DECLARE
  function_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO function_count
  FROM pg_proc
  WHERE proname IN ('get_user_tools', 'check_tool_access', 'get_workspace_member_count', 'get_user_workspaces');
  
  IF function_count = 4 THEN
    RAISE NOTICE 'SUCCESS: All 4 functions created successfully';
  ELSE
    RAISE EXCEPTION 'ERROR: Expected 4 functions, found %', function_count;
  END IF;
END $$;

-- ============================================
-- END OF FUNCTIONS
-- ============================================
-- Next: Run 003_rls.sql
-- ============================================
