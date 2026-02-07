-- Phase 7.3 Test Data Setup Script
-- Run this script in Supabase SQL Editor to create test data for tool access testing
-- Last updated: February 6, 2026

-- ============================================
-- STEP 1: Create Test Organization
-- ============================================

DO $$
DECLARE
    v_org_id UUID;
    v_owner_id UUID;
    v_member_id UUID;
    v_workspace_id UUID;
    v_tool1_id UUID;
    v_tool2_id UUID;
    v_tool3_id UUID;
BEGIN
    -- Create test organization
    INSERT INTO organizations (name, slug, created_at, updated_at)
    VALUES ('Test Organization', 'test-org', NOW(), NOW())
    RETURNING id INTO v_org_id;
    
    RAISE NOTICE 'Created organization: %', v_org_id;

    -- ============================================
    -- STEP 2: Update Existing User to ORG_OWNER
    -- ============================================
    
    -- Find the first user created (from sign-up test)
    SELECT id INTO v_owner_id
    FROM users
    WHERE deleted_at IS NULL
    ORDER BY created_at ASC
    LIMIT 1;
    
    IF v_owner_id IS NOT NULL THEN
        UPDATE users
        SET role = 'ORG_OWNER',
            organization_id = v_org_id,
            updated_at = NOW()
        WHERE id = v_owner_id;
        
        RAISE NOTICE 'Updated user to ORG_OWNER: %', v_owner_id;
    ELSE
        RAISE NOTICE 'No existing user found. Please sign up first via Clerk.';
    END IF;

    -- ============================================
    -- STEP 3: Create Additional Test Users
    -- ============================================
    
    -- Create test member
    INSERT INTO users (clerk_id, email, role, organization_id, created_at, updated_at)
    VALUES ('test_member_' || gen_random_uuid()::text, 'member@testorg.local', 'MEMBER', v_org_id, NOW(), NOW())
    RETURNING id INTO v_member_id;
    
    RAISE NOTICE 'Created member user: %', v_member_id;
    
    -- Create system admin (not in org)
    INSERT INTO users (clerk_id, email, role, organization_id, created_at, updated_at)
    VALUES ('test_admin_' || gen_random_uuid()::text, 'admin@system.local', 'SYSTEM_ADMIN', NULL, NOW(), NOW());
    
    RAISE NOTICE 'Created system admin user';

    -- ============================================
    -- STEP 4: Create Test Workspace
    -- ============================================
    
    INSERT INTO workspaces (name, slug, organization_id, created_by, created_at, updated_at)
    VALUES ('Engineering', 'engineering', v_org_id, v_owner_id, NOW(), NOW())
    RETURNING id INTO v_workspace_id;
    
    RAISE NOTICE 'Created workspace: %', v_workspace_id;

    -- ============================================
    -- STEP 5: Add Member to Workspace
    -- ============================================
    
    IF v_member_id IS NOT NULL THEN
        INSERT INTO workspace_members (workspace_id, user_id, role, added_by, added_at)
        VALUES (v_workspace_id, v_member_id, 'MEMBER', v_owner_id, NOW());
        
        RAISE NOTICE 'Added member to workspace';
    END IF;

    -- ============================================
    -- STEP 6: Create Test Tools
    -- ============================================
    
    -- Tool 1: Organization-level access
    INSERT INTO tools (name, slug, description, type, icon, tags, created_at, updated_at)
    VALUES (
        'Organization AI Assistant',
        'org-ai-assistant',
        'AI assistant available to all organization members',
        'internal',
        '🏢',
        ARRAY['ai', 'assistant', 'org-wide'],
        NOW(),
        NOW()
    )
    RETURNING id INTO v_tool1_id;
    
    RAISE NOTICE 'Created tool 1 (org-level): %', v_tool1_id;
    
    -- Tool 2: Workspace-level access
    INSERT INTO tools (name, slug, description, type, icon, tags, created_at, updated_at)
    VALUES (
        'Engineering Code Assistant',
        'eng-code-assistant',
        'Code assistant for engineering workspace only',
        'internal',
        '💻',
        ARRAY['code', 'workspace', 'engineering'],
        NOW(),
        NOW()
    )
    RETURNING id INTO v_tool2_id;
    
    RAISE NOTICE 'Created tool 2 (workspace-level): %', v_tool2_id;
    
    -- Tool 3: User-level access
    INSERT INTO tools (name, slug, description, type, icon, tags, created_at, updated_at)
    VALUES (
        'Personal Research Assistant',
        'personal-research',
        'Personal research tool for specific users',
        'internal',
        '🔬',
        ARRAY['research', 'personal'],
        NOW(),
        NOW()
    )
    RETURNING id INTO v_tool3_id;
    
    RAISE NOTICE 'Created tool 3 (user-level): %', v_tool3_id;

    -- ============================================
    -- STEP 7: Grant Tool Access
    -- ============================================
    
    -- Grant Tool 1 to entire organization
    INSERT INTO tool_access (tool_id, organization_id, granted_by, granted_at)
    VALUES (v_tool1_id, v_org_id, v_owner_id, NOW());
    
    RAISE NOTICE 'Granted Tool 1 to organization';
    
    -- Grant Tool 2 to workspace
    INSERT INTO tool_access (tool_id, workspace_id, granted_by, granted_at)
    VALUES (v_tool2_id, v_workspace_id, v_owner_id, NOW());
    
    RAISE NOTICE 'Granted Tool 2 to workspace';
    
    -- Grant Tool 3 to specific member
    IF v_member_id IS NOT NULL THEN
        INSERT INTO tool_access (tool_id, user_id, granted_by, granted_at)
        VALUES (v_tool3_id, v_member_id, v_owner_id, NOW());
        
        RAISE NOTICE 'Granted Tool 3 to specific user';
    END IF;

    -- ============================================
    -- STEP 8: Create Sample Usage Analytics
    -- ============================================
    
    -- Generate 50 sample usage records
    FOR i IN 1..50 LOOP
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
        VALUES (
            CASE WHEN random() < 0.5 THEN v_owner_id ELSE v_member_id END,
            CASE 
                WHEN random() < 0.33 THEN v_tool1_id
                WHEN random() < 0.66 THEN v_tool2_id
                ELSE v_tool3_id
            END,
            v_workspace_id,
            v_org_id,
            (random() * 5000)::int,
            (random() * 1000)::int,
            (random() * 0.50)::numeric(10,4),
            jsonb_build_object('query', 'test query ' || i),
            jsonb_build_object('result', 'success', 'output', 'test response'),
            NOW() - (random() * interval '30 days')
        );
    END LOOP;
    
    RAISE NOTICE 'Created 50 sample usage analytics records';

    -- ============================================
    -- SUMMARY
    -- ============================================
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Test Data Setup Complete!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Organization ID: %', v_org_id;
    RAISE NOTICE 'Owner User ID: %', v_owner_id;
    RAISE NOTICE 'Member User ID: %', v_member_id;
    RAISE NOTICE 'Workspace ID: %', v_workspace_id;
    RAISE NOTICE 'Tool 1 (Org): %', v_tool1_id;
    RAISE NOTICE 'Tool 2 (Workspace): %', v_tool2_id;
    RAISE NOTICE 'Tool 3 (User): %', v_tool3_id;
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Log in as owner user and verify Tool 1 is visible';
    RAISE NOTICE '2. Check that member user sees Tools 1, 2, and 3';
    RAISE NOTICE '3. Verify analytics data is visible';
    RAISE NOTICE '========================================';

END $$;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- View all organizations
SELECT id, name, slug, created_at FROM organizations ORDER BY created_at DESC LIMIT 5;

-- View all users
SELECT id, email, role, organization_id, created_at FROM users ORDER BY created_at DESC LIMIT 10;

-- View all workspaces
SELECT w.id, w.name, w.slug, o.name as organization_name 
FROM workspaces w
JOIN organizations o ON w.organization_id = o.id
ORDER BY w.created_at DESC LIMIT 5;

-- View all tools
SELECT id, name, slug, type, tags FROM tools ORDER BY created_at DESC LIMIT 10;

-- View all tool access grants
SELECT 
    t.name as tool_name,
    CASE 
        WHEN ta.organization_id IS NOT NULL THEN 'Organization: ' || o.name
        WHEN ta.workspace_id IS NOT NULL THEN 'Workspace: ' || w.name
        WHEN ta.user_id IS NOT NULL THEN 'User: ' || u.email
    END as access_scope
FROM tool_access ta
LEFT JOIN tools t ON ta.tool_id = t.id
LEFT JOIN organizations o ON ta.organization_id = o.id
LEFT JOIN workspaces w ON ta.workspace_id = w.id
LEFT JOIN users u ON ta.user_id = u.id
ORDER BY ta.granted_at DESC;

-- View sample analytics
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
LIMIT 10;
