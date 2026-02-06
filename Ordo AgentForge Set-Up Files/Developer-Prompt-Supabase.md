# Multi-Tenant AI Dashboard - Complete Developer Prompt (Supabase Edition)

## Project Overview

You are building a multi-tenant AI dashboard platform similar to Pickaxe, where organizations can manage workspaces, users, and AI agents/tools with role-based access control. The system uses Supabase (PostgreSQL) as the database and follows strict MVC (Model-View-Controller) architecture patterns.

## Critical Requirements

### Technology Stack

- **Frontend**: React 18+ with TypeScript, Tailwind CSS, shadcn/ui components, Vite
- **Backend**: Express.js (Node.js) with TypeScript
- **Database**: Supabase (PostgreSQL)
- **ORM/Client**: Supabase-js client or Prisma ORM
- **Authentication**: Clerk (invitation-only)
- **Deployment**: Vercel
- **Security**: Helmet, Zod validation, bcrypt, jsonwebtoken, CORS, express-rate-limit
- **Testing**: Vitest, @testing-library/react
- **Code Quality**: ESLint, Prettier, Husky (git hooks)

### Multi-Tenancy Structure (Three Levels)

1. **Organizations** (Top Level) - Independent tenants
2. **Workspaces** (Middle Level) - Teams/departments within organizations
3. **Users** (Bottom Level) - Individual members within workspaces

### User Roles & Permissions

#### SYSTEM_ADMIN

- Creates, installs, deletes, and manages all AI agents and tools
- Assigns tools to organizations
- Views all organizations and their data
- Only role that sees financial/cost data
- Has additional sidebar navigation items

#### ORG_OWNER

- Manages their organization settings
- Creates and manages workspaces within org
- Assigns tools to individual users OR entire workspaces
- Invites users to organization
- Views organization-wide analytics (NO financial data)

#### WORKSPACE_ADMIN

- Manages workspace members
- Views workspace analytics (NO financial data)
- Cannot assign tools (only Org Owner can)

#### MEMBER

- Uses assigned AI tools
- Views personal analytics (runs, top tools - NO financial data)
- Minimal dashboard with simplified metrics

### Access Control Model (CRITICAL)

**Additive Model**: Users gain access to tools through EITHER path:

1. Direct individual assignment by Org Owner
2. Workspace membership (if tool assigned to workspace)

**Implementation Rules**:

- System Admin assigns tools → Organizations
- Org Owner assigns tools → Individual Users OR Workspaces
- If tool assigned to Workspace, ALL workspace members get access
- Both access paths are independent and additive
- Removing workspace access doesn't remove individual access
- Audit trail must track both assignment types

### Authentication Flow (Clerk - Invitation Only)

1. System Admin creates Organization → invites Org Owner via Clerk
2. Org Owner invites members to organization via Clerk
3. Members are added to specific workspaces
4. No public sign-up allowed

---

## Database Schema (PostgreSQL via Supabase)

### 1. Users Table

```sql
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

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org_id ON users(organization_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Organizations Table

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  logo TEXT,
  primary_color VARCHAR(7),
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orgs_slug ON organizations(slug);
CREATE INDEX idx_orgs_owner ON organizations(owner_id);

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Workspaces Table

```sql
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

CREATE INDEX idx_workspaces_org ON workspaces(organization_id);
CREATE INDEX idx_workspaces_admin ON workspaces(admin_id);

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4. Workspace Members (Junction Table)

```sql
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
```

### 5. Tools Table

```sql
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

CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_type ON tools(type);
CREATE INDEX idx_tools_tags ON tools USING GIN(tags);

CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 6. Tool Access Table (CRITICAL for access control)

```sql
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

-- Indexes for efficient access checks
CREATE INDEX idx_tool_access_tool_org ON tool_access(tool_id, organization_id);
CREATE INDEX idx_tool_access_tool_workspace ON tool_access(tool_id, workspace_id);
CREATE INDEX idx_tool_access_tool_user ON tool_access(tool_id, user_id);
CREATE INDEX idx_tool_access_org ON tool_access(organization_id);
CREATE INDEX idx_tool_access_workspace ON tool_access(workspace_id);
CREATE INDEX idx_tool_access_user ON tool_access(user_id);
```

### 7. Documents Table (Knowledge Base - Hybrid)

```sql
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

CREATE INDEX idx_documents_org_scope ON documents(organization_id, scope);
CREATE INDEX idx_documents_tool ON documents(tool_id);

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 8. Usage Analytics Table

```sql
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

-- Indexes for analytics queries
CREATE INDEX idx_analytics_timestamp ON usage_analytics(timestamp DESC);
CREATE INDEX idx_analytics_tool_time ON usage_analytics(tool_id, timestamp DESC);
CREATE INDEX idx_analytics_user_time ON usage_analytics(user_id, timestamp DESC);
CREATE INDEX idx_analytics_workspace_time ON usage_analytics(workspace_id, timestamp DESC);
CREATE INDEX idx_analytics_org_time ON usage_analytics(organization_id, timestamp DESC);
```

---

## Database Functions (PostgreSQL)

### Function: Get User's Available Tools

```sql
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
```

### Function: Check Tool Access

```sql
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

---

## Supabase Client Setup

### Backend (Server-Side)

```typescript
// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
```

### Frontend (Browser-Side)

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Row Level Security (RLS) Policies

### Enable RLS on All Tables

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;
```

### Example RLS Policies

#### Users Table

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (clerk_id = auth.jwt()->>'sub');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (clerk_id = auth.jwt()->>'sub');

-- Org owners can view users in their org
CREATE POLICY "Org owners can view org users"
ON users FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'ORG_OWNER'
  )
);
```

#### Tools Table

```sql
-- Users can view tools they have access to
CREATE POLICY "Users can view accessible tools"
ON tools FOR SELECT
USING (
  id IN (
    SELECT tool_id FROM get_user_tools(
      (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub')
    )
  )
);

-- System admins can manage all tools
CREATE POLICY "System admins can manage tools"
ON tools FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'SYSTEM_ADMIN'
  )
);
```

#### Workspaces Table

```sql
-- Users can view workspaces they belong to
CREATE POLICY "Users can view their workspaces"
ON workspaces FOR SELECT
USING (
  id IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub')
  )
);

-- Org owners can manage workspaces in their org
CREATE POLICY "Org owners can manage workspaces"
ON workspaces FOR ALL
USING (
  organization_id IN (
    SELECT organization_id FROM users
    WHERE clerk_id = auth.jwt()->>'sub' AND role = 'ORG_OWNER'
  )
);
```

---

## API Structure (Express.js with MVC Pattern)

### Middleware

#### authMiddleware.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { supabase } from '../lib/supabase/server';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify Clerk token
    const session = await clerkClient.sessions.verifySession(token);

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', session.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

#### roleMiddleware.ts

```typescript
import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
};
```

#### toolAccessMiddleware.ts

```typescript
import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { supabase } from '../lib/supabase/server';

export const verifyToolAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { toolId } = req.params;
    const userId = req.user.id;

    // Call database function to check access
    const { data, error } = await supabase.rpc('check_tool_access', {
      user_id_param: userId,
      tool_id_param: toolId,
    });

    if (error || !data) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Error checking access' });
  }
};
```

#### validationMiddleware.ts

```typescript
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
};
```

---

## Controllers & Routes

### ToolController

```typescript
// controllers/ToolController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { supabase } from '../lib/supabase/server';

export class ToolController {
  // Get user's available tools
  static async getUserTools(req: AuthRequest, res: Response) {
    try {
      const { data, error } = await supabase.rpc('get_user_tools', {
        user_id_param: req.user.id,
      });

      if (error) throw error;

      res.json({ data });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tools' });
    }
  }

  // Create tool (SYSTEM_ADMIN only)
  static async createTool(req: AuthRequest, res: Response) {
    try {
      const { name, slug, description, icon, type, route, url, tags } =
        req.body;

      const { data, error } = await supabase
        .from('tools')
        .insert({
          name,
          slug,
          description,
          icon,
          type,
          route,
          url,
          tags,
          created_by: req.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ data });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create tool' });
    }
  }

  // Execute tool with streaming
  static async executeTool(req: AuthRequest, res: Response) {
    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const { toolId } = req.params;
      const { input } = req.body;

      // Get tool config
      const { data: tool } = await supabase
        .from('tools')
        .select('*')
        .eq('id', toolId)
        .single();

      // Call Airia API (or other AI provider) with streaming
      const response = await fetch('https://api.airia.com/chat', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.AIRIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          stream: true,
        }),
      });

      // Stream response chunks to client
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      }

      // Log usage
      await supabase.from('usage_analytics').insert({
        tool_id: toolId,
        user_id: req.user.id,
        organization_id: req.user.organization_id,
        success: true,
      });

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: 'Execution failed' })}\n\n`);
      res.end();
    }
  }
}
```

### WorkspaceController

```typescript
// controllers/WorkspaceController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { supabase } from '../lib/supabase/server';

export class WorkspaceController {
  // Create workspace
  static async createWorkspace(req: AuthRequest, res: Response) {
    try {
      const { name, slug, organizationId, adminId } = req.body;

      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          name,
          slug,
          organization_id: organizationId,
          admin_id: adminId,
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ data });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create workspace' });
    }
  }

  // Get user's workspaces
  static async getUserWorkspaces(req: AuthRequest, res: Response) {
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select(
          `
          workspace:workspaces(
            *,
            member_count:workspace_members(count)
          )
        `
        )
        .eq('user_id', req.user.id);

      if (error) throw error;

      res.json({ data: data.map((item) => item.workspace) });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch workspaces' });
    }
  }

  // Add member to workspace
  static async addMember(req: AuthRequest, res: Response) {
    try {
      const { workspaceId } = req.params;
      const { userId } = req.body;

      const { error } = await supabase.from('workspace_members').insert({
        workspace_id: workspaceId,
        user_id: userId,
      });

      if (error) throw error;

      res.status(201).json({ message: 'Member added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add member' });
    }
  }

  // Remove member from workspace
  static async removeMember(req: AuthRequest, res: Response) {
    try {
      const { workspaceId, userId } = req.params;

      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId);

      if (error) throw error;

      res.json({ message: 'Member removed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove member' });
    }
  }
}
```

### ToolAccessController

```typescript
// controllers/ToolAccessController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { supabase } from '../lib/supabase/server';

export class ToolAccessController {
  // Assign tool to organization (SYSTEM_ADMIN)
  static async assignToOrganization(req: AuthRequest, res: Response) {
    try {
      const { toolId, organizationId } = req.body;

      const { data, error } = await supabase
        .from('tool_access')
        .insert({
          tool_id: toolId,
          organization_id: organizationId,
          granted_by: req.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ data });
    } catch (error) {
      res.status(500).json({ error: 'Failed to assign tool' });
    }
  }

  // Assign tool to workspace (ORG_OWNER)
  static async assignToWorkspace(req: AuthRequest, res: Response) {
    try {
      const { toolId, workspaceId } = req.body;

      // Verify workspace belongs to user's organization
      const { data: workspace } = await supabase
        .from('workspaces')
        .select('organization_id')
        .eq('id', workspaceId)
        .single();

      if (workspace?.organization_id !== req.user.organization_id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const { data, error } = await supabase
        .from('tool_access')
        .insert({
          tool_id: toolId,
          workspace_id: workspaceId,
          granted_by: req.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ data });
    } catch (error) {
      res.status(500).json({ error: 'Failed to assign tool' });
    }
  }

  // Assign tool to individual user (ORG_OWNER)
  static async assignToUser(req: AuthRequest, res: Response) {
    try {
      const { toolId, userId } = req.body;

      // Verify user belongs to same organization
      const { data: targetUser } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', userId)
        .single();

      if (targetUser?.organization_id !== req.user.organization_id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const { data, error } = await supabase
        .from('tool_access')
        .insert({
          tool_id: toolId,
          user_id: userId,
          granted_by: req.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ data });
    } catch (error) {
      res.status(500).json({ error: 'Failed to assign tool' });
    }
  }

  // Remove tool access
  static async removeAccess(req: AuthRequest, res: Response) {
    try {
      const { accessId } = req.params;

      const { error } = await supabase
        .from('tool_access')
        .delete()
        .eq('id', accessId);

      if (error) throw error;

      res.json({ message: 'Access removed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove access' });
    }
  }
}
```

### AnalyticsController

```typescript
// controllers/AnalyticsController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { supabase } from '../lib/supabase/server';

export class AnalyticsController {
  // Get user's personal analytics (simple)
  static async getUserAnalytics(req: AuthRequest, res: Response) {
    try {
      // Get total runs this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from('usage_analytics')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', req.user.id)
        .gte('timestamp', startOfMonth.toISOString());

      // Get top 3 tools
      const { data: topTools } = await supabase
        .from('usage_analytics')
        .select(
          `
          tool_id,
          tools(name, icon)
        `
        )
        .eq('user_id', req.user.id)
        .gte('timestamp', startOfMonth.toISOString())
        .limit(3);

      res.json({
        data: {
          totalRuns: count || 0,
          topTools: topTools || [],
          period: 'Last 30 days',
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }

  // Get workspace analytics (detailed)
  static async getWorkspaceAnalytics(req: AuthRequest, res: Response) {
    try {
      const { workspaceId } = req.params;
      const { startDate, endDate } = req.query;

      // Verify access to workspace
      const { data: member } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('user_id', req.user.id)
        .single();

      if (!member) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Get analytics data
      const { data, error } = await supabase
        .from('usage_analytics')
        .select(
          `
          *,
          tools(name),
          users(first_name, last_name)
        `
        )
        .eq('workspace_id', workspaceId)
        .gte('timestamp', startDate as string)
        .lte('timestamp', endDate as string);

      if (error) throw error;

      // Calculate metrics
      const totalRuns = data.length;
      const successRate = data.filter((d) => d.success).length / totalRuns;
      const avgExecutionTime =
        data.reduce((sum, d) => sum + d.execution_time, 0) / totalRuns;

      res.json({
        data: {
          totalRuns,
          successRate,
          avgExecutionTime,
          runs: data,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }

  // Get system analytics (SYSTEM_ADMIN only - includes costs)
  static async getSystemAnalytics(req: AuthRequest, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const { data, error } = await supabase
        .from('usage_analytics')
        .select(
          `
          *,
          tools(name),
          organizations(name)
        `
        )
        .gte('timestamp', startDate as string)
        .lte('timestamp', endDate as string);

      if (error) throw error;

      // Calculate metrics including costs
      const totalCost = data.reduce((sum, d) => sum + (d.api_cost || 0), 0);
      const costByOrg = {}; // Group by organization
      const costByTool = {}; // Group by tool

      res.json({
        data: {
          totalRuns: data.length,
          totalCost,
          costByOrg,
          costByTool,
          runs: data,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }
}
```

---

## Routes Setup

```typescript
// routes/index.ts
import express from 'express';
import { authMiddleware } from './middleware/authMiddleware';
import { requireRole } from './middleware/roleMiddleware';
import { verifyToolAccess } from './middleware/toolAccessMiddleware';
import { validate } from './middleware/validationMiddleware';
import { ToolController } from './controllers/ToolController';
import { WorkspaceController } from './controllers/WorkspaceController';
import { ToolAccessController } from './controllers/ToolAccessController';
import { AnalyticsController } from './controllers/AnalyticsController';

const router = express.Router();

// Tool routes
router.get('/tools', authMiddleware, ToolController.getUserTools);
router.post(
  '/tools',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN']),
  ToolController.createTool
);
router.post(
  '/tools/:toolId/execute',
  authMiddleware,
  verifyToolAccess,
  ToolController.executeTool
);

// Workspace routes
router.post(
  '/workspaces',
  authMiddleware,
  requireRole(['ORG_OWNER']),
  WorkspaceController.createWorkspace
);
router.get(
  '/workspaces',
  authMiddleware,
  WorkspaceController.getUserWorkspaces
);
router.post(
  '/workspaces/:workspaceId/members',
  authMiddleware,
  WorkspaceController.addMember
);
router.delete(
  '/workspaces/:workspaceId/members/:userId',
  authMiddleware,
  WorkspaceController.removeMember
);

// Tool access routes
router.post(
  '/tool-access/organization',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN']),
  ToolAccessController.assignToOrganization
);
router.post(
  '/tool-access/workspace',
  authMiddleware,
  requireRole(['ORG_OWNER']),
  ToolAccessController.assignToWorkspace
);
router.post(
  '/tool-access/user',
  authMiddleware,
  requireRole(['ORG_OWNER']),
  ToolAccessController.assignToUser
);
router.delete(
  '/tool-access/:accessId',
  authMiddleware,
  ToolAccessController.removeAccess
);

// Analytics routes
router.get(
  '/analytics/user',
  authMiddleware,
  AnalyticsController.getUserAnalytics
);
router.get(
  '/analytics/workspace/:workspaceId',
  authMiddleware,
  AnalyticsController.getWorkspaceAnalytics
);
router.get(
  '/analytics/system',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN']),
  AnalyticsController.getSystemAnalytics
);

export default router;
```

---

## Frontend Structure (/app directory)

### Directory Layout

```
/app
├── layout.tsx                      # Root layout with Clerk provider
├── page.tsx                        # Landing/login page
├── (dashboard)/                   # Protected dashboard routes
│   ├── layout.tsx                 # Dashboard layout (TopNav + Sidebar)
│   ├── page.tsx                   # Main tools view (tools-first)
│   ├── knowledge/
│   │   └── page.tsx              # Knowledge base management
│   ├── analytics/
│   │   └── page.tsx              # Analytics dashboard (role-based)
│   ├── workspaces/
│   │   ├── page.tsx              # Workspace list
│   │   └── [id]/
│   │       └── page.tsx          # Workspace detail page
│   ├── settings/
│   │   └── page.tsx              # User settings
│   └── admin/                    # SYSTEM_ADMIN only routes
│       ├── organizations/
│       │   ├── page.tsx          # Org list
│       │   └── [id]/
│       │       └── page.tsx      # Org detail page
│       └── tools/
│           ├── page.tsx          # Tool management
│           └── create/
│               └── page.tsx      # Create tool form
├── tools/                         # Tool execution pages
│   ├── _components/              # Shared tool components
│   │   ├── ToolLayout.tsx
│   │   ├── ToolHeader.tsx
│   │   ├── StreamingResponse.tsx
│   │   └── ToolInputForm.tsx
│   ├── _templates/               # Tool templates
│   │   ├── ChatTemplate.tsx
│   │   ├── FormTemplate.tsx
│   │   └── DashboardTemplate.tsx
│   ├── airia-chat/               # Airia chatbot integration
│   │   └── page.tsx
│   └── [slug]/                   # Dynamic tool routes
│       └── page.tsx
└── api/                          # Next.js API routes (if needed)
```

### Key Frontend Components

#### Using Supabase Client in Frontend

```typescript
// hooks/useTools.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export const useTools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        // Get current user's ID from Clerk
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', clerkUserId)
          .single();

        // Call database function
        const { data, error } = await supabase.rpc('get_user_tools', {
          user_id_param: userData.id,
        });

        if (error) throw error;
        setTools(data);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  return { tools, loading };
};
```

#### Realtime Subscriptions

```typescript
// components/ToolsList.tsx
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export const ToolsList = () => {
  const { tools, setTools } = useTools();

  useEffect(() => {
    // Subscribe to tool changes
    const subscription = supabase
      .channel('tools-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tools' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTools(prev => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setTools(prev => prev.map(t => t.id === payload.new.id ? payload.new : t));
          } else if (payload.eventType === 'DELETE') {
            setTools(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
};
```

---

## Supabase Storage (Documents/Knowledge Base)

### Upload Document

```typescript
// services/documentService.ts
import { supabase } from '@/lib/supabase/server';

export const uploadDocument = async (
  file: File,
  organizationId: string,
  scope: 'global' | 'agent-specific',
  toolId?: string
) => {
  // Upload file to storage
  const filename = `${organizationId}/${Date.now()}-${file.name}`;

  const { data: storageData, error: storageError } = await supabase.storage
    .from('documents')
    .upload(filename, file);

  if (storageError) throw storageError;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(filename);

  // Create document record
  const { data, error } = await supabase
    .from('documents')
    .insert({
      name: file.name,
      filename: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_url: urlData.publicUrl,
      scope,
      organization_id: organizationId,
      tool_id: toolId,
      uploaded_by: userId,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};
```

### Download Document

```typescript
export const downloadDocument = async (documentId: string) => {
  // Get document record
  const { data: document } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single();

  if (!document) throw new Error('Document not found');

  // Get signed URL for download
  const { data: signedUrl } = await supabase.storage
    .from('documents')
    .createSignedUrl(document.storage_url, 60); // 60 second expiry

  return signedUrl;
};
```

---

## Design System (Tailwind + shadcn/ui)

### Color Palette

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#1A1A1A',
        'surface-elevated': '#2A2A2A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#E5E5E5',
        'text-tertiary': '#A3A3A3',
        'accent-purple': '#8B5CF6',
        'accent-pink': '#EC4899',
        'accent-orange': '#F97316',
        'border-subtle': '#2A2A2A',
        'border-default': '#3A3A3A',
      },
    },
  },
};
```

### shadcn/ui Components to Install

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add form
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
```

---

## Environment Variables

```bash
# .env

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Clerk Authentication
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_WEBHOOK_SECRET=whsec_...

# AI APIs
AIRIA_API_KEY=your-airia-api-key

# Node Environment
NODE_ENV=development
PORT=3000
```

---

## Deployment Checklist

### Supabase Setup

1. Create Supabase project
2. Run all CREATE TABLE statements in SQL Editor
3. Create database functions (get_user_tools, check_tool_access)
4. Enable RLS on all tables
5. Create RLS policies
6. Set up Storage bucket for documents
7. Configure Storage policies

### Vercel Setup

1. Configure environment variables
2. Connect GitHub repository
3. Set up automatic deployments
4. Configure build command: `npm run build`
5. Set framework preset: Vite

### Clerk Setup

1. Create Clerk application
2. Configure webhook endpoint: `https://your-domain.com/api/auth/webhook`
3. Enable email/OAuth providers
4. Set up invitation-only mode

### Post-Deployment

1. Verify database connections
2. Test authentication flow
3. Test tool execution
4. Verify RLS policies
5. Test file uploads
6. Monitor error logs

---

## Testing Strategy

### Unit Tests

```typescript
// tests/toolAccess.test.ts
import { describe, it, expect } from 'vitest';
import { supabase } from '../lib/supabase/server';

describe('Tool Access', () => {
  it('should grant access for direct assignment', async () => {
    const { data } = await supabase.rpc('check_tool_access', {
      user_id_param: testUserId,
      tool_id_param: testToolId,
    });

    expect(data).toBe(true);
  });

  it('should grant access via workspace', async () => {
    // Add user to workspace
    await supabase
      .from('workspace_members')
      .insert({ workspace_id: testWorkspaceId, user_id: testUserId });

    // Assign tool to workspace
    await supabase
      .from('tool_access')
      .insert({ tool_id: testToolId, workspace_id: testWorkspaceId });

    const { data } = await supabase.rpc('check_tool_access', {
      user_id_param: testUserId,
      tool_id_param: testToolId,
    });

    expect(data).toBe(true);
  });
});
```

---

## Critical Implementation Notes

1. **Always use database functions for complex queries** - Better performance and maintainability
2. **RLS policies are critical** - Test thoroughly to ensure proper isolation
3. **Use transactions for multi-step operations** - Especially when creating workspaces with members
4. **Index strategically** - Tool access queries are the most common, optimize for those
5. **Monitor query performance** - Use Supabase dashboard to identify slow queries
6. **Handle connection pooling** - Supabase has built-in pooling, but be aware of limits
7. **Use prepared statements** - Supabase client handles this automatically
8. **Cascade deletes are configured** - Deleting an org will delete all related data
9. **Store sensitive data in Supabase Vault** - API keys, secrets, etc.
10. **Enable replication for production** - High availability and disaster recovery

---

## Success Criteria

Implementation is complete when:

- [ ] All user roles can authenticate via Clerk
- [ ] System Admin can create and assign tools to orgs
- [ ] Org Owner can assign tools to workspaces and users
- [ ] Members can execute their assigned tools
- [ ] Tool execution streams responses in real-time
- [ ] Analytics show appropriate data per role (no costs for non-admins)
- [ ] Knowledge base supports global and agent-specific docs
- [ ] RLS policies prevent unauthorized access
- [ ] UI matches ordodigital.com design aesthetic
- [ ] All tests pass
- [ ] Application deploys successfully to Vercel
- [ ] Database migrations are version controlled
- [ ] Monitoring and logging are configured

---

## Additional Resources

- Supabase Documentation: https://supabase.com/docs
- Supabase-js Client: https://supabase.com/docs/reference/javascript
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Clerk Documentation: https://clerk.com/docs
- shadcn/ui Components: https://ui.shadcn.com/
- Tailwind CSS: https://tailwindcss.com/docs

---

**START BUILDING**: Begin with Supabase setup (create project, run SQL migrations), then implement authentication with Clerk, then build API controllers with Supabase queries, then frontend components. Test RLS policies thoroughly at each step.

Good luck! 🚀
