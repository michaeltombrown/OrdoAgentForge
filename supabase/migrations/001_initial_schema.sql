-- ============================================
-- 001_initial_schema.sql
-- Multi-Tenant AI Dashboard - Initial Database Schema
-- Run this in Supabase SQL Editor BEFORE any application code
-- ============================================

-- ============================================
-- ENABLE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CREATE TABLES
-- ============================================

-- Organizations Table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  owner_id UUID,
  logo TEXT,
  primary_color VARCHAR(7),
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL CHECK (role IN ('SYSTEM_ADMIN', 'ORG_OWNER', 'WORKSPACE_ADMIN', 'MEMBER')),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for organization owner after users table exists
ALTER TABLE organizations ADD CONSTRAINT fk_organizations_owner 
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL;

-- Workspaces Table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, slug)
);

-- Workspace Members Junction Table
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Tools Table
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('internal', 'iframe')),
  route TEXT,
  url TEXT,
  tags TEXT[],
  is_template BOOLEAN DEFAULT FALSE,
  config JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tool Access Table (CRITICAL for access control)
CREATE TABLE tool_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  granted_by UUID NOT NULL REFERENCES users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (
    (organization_id IS NOT NULL AND workspace_id IS NULL AND user_id IS NULL) OR
    (organization_id IS NULL AND workspace_id IS NOT NULL AND user_id IS NULL) OR
    (organization_id IS NULL AND workspace_id IS NULL AND user_id IS NOT NULL)
  )
);

-- Documents Table (Knowledge Base)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  filename VARCHAR(255),
  file_type VARCHAR(100),
  file_size BIGINT,
  storage_url TEXT,
  scope VARCHAR(20) NOT NULL CHECK (scope IN ('global', 'agent-specific')),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES users(id),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Analytics Table
CREATE TABLE usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  execution_time INTEGER,
  success BOOLEAN,
  error_message TEXT,
  api_cost DECIMAL(10, 4),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES
-- ============================================

-- Users indexes
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org_id ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);

-- Organizations indexes
CREATE INDEX idx_orgs_slug ON organizations(slug);
CREATE INDEX idx_orgs_owner ON organizations(owner_id);

-- Workspaces indexes
CREATE INDEX idx_workspaces_org ON workspaces(organization_id);
CREATE INDEX idx_workspaces_admin ON workspaces(admin_id);
CREATE INDEX idx_workspaces_slug ON workspaces(organization_id, slug);

-- Workspace Members indexes
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);

-- Tools indexes
CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_type ON tools(type);
CREATE INDEX idx_tools_tags ON tools USING GIN(tags);
CREATE INDEX idx_tools_created_by ON tools(created_by);

-- Tool Access indexes (CRITICAL for performance)
CREATE INDEX idx_tool_access_tool_org ON tool_access(tool_id, organization_id);
CREATE INDEX idx_tool_access_tool_workspace ON tool_access(tool_id, workspace_id);
CREATE INDEX idx_tool_access_tool_user ON tool_access(tool_id, user_id);
CREATE INDEX idx_tool_access_org ON tool_access(organization_id);
CREATE INDEX idx_tool_access_workspace ON tool_access(workspace_id);
CREATE INDEX idx_tool_access_user ON tool_access(user_id);

-- Documents indexes
CREATE INDEX idx_documents_org_scope ON documents(organization_id, scope);
CREATE INDEX idx_documents_tool ON documents(tool_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);

-- Usage Analytics indexes
CREATE INDEX idx_analytics_timestamp ON usage_analytics(timestamp DESC);
CREATE INDEX idx_analytics_tool_time ON usage_analytics(tool_id, timestamp DESC);
CREATE INDEX idx_analytics_user_time ON usage_analytics(user_id, timestamp DESC);
CREATE INDEX idx_analytics_workspace_time ON usage_analytics(workspace_id, timestamp DESC);
CREATE INDEX idx_analytics_org_time ON usage_analytics(organization_id, timestamp DESC);

-- ============================================
-- CREATE TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFY SCHEMA
-- ============================================

-- Verify all tables exist
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN ('users', 'organizations', 'workspaces', 'workspace_members', 
                     'tools', 'tool_access', 'documents', 'usage_analytics');
  
  IF table_count = 8 THEN
    RAISE NOTICE 'SUCCESS: All 8 tables created successfully';
  ELSE
    RAISE EXCEPTION 'ERROR: Expected 8 tables, found %', table_count;
  END IF;
END $$;

-- ============================================
-- END OF INITIAL SCHEMA
-- ============================================
-- Next: Run 002_functions.sql
-- ============================================
