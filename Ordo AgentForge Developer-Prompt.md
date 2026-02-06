# Multi-Tenant AI Dashboard - Complete Developer Prompt

## Project Overview

You are building a multi-tenant AI dashboard platform similar to Pickaxe, where organizations can manage workspaces, users, and AI agents/tools with role-based access control. The system follows strict MVC (Model-View-Controller) architecture patterns.

## Critical Requirements

### Technology Stack

- **Frontend**: React 18+ with TypeScript, Tailwind CSS, shadcn/ui components, Vite
- **Backend**: Express.js (Node.js) with TypeScript
- **Database**: MongoDB with Mongoose ODM
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

## Database Schemas (MongoDB with Mongoose)

### Users Collection

```typescript
interface IUser {
  clerkId: string; // Unique, required
  email: string; // Unique, required
  firstName?: string;
  lastName?: string;
  role: 'SYSTEM_ADMIN' | 'ORG_OWNER' | 'WORKSPACE_ADMIN' | 'MEMBER';
  organizationId?: ObjectId; // Reference to Organization
  workspaceIds: ObjectId[]; // Array of Workspace references
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
UserSchema.index({ clerkId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ organizationId: 1 });
```

### Organizations Collection

```typescript
interface IOrganization {
  name: string; // Required
  slug: string; // Unique, required (URL-safe)
  ownerId: ObjectId; // Reference to User (ORG_OWNER)
  settings: {
    logo?: string;
    primaryColor?: string;
    timezone?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
OrganizationSchema.index({ slug: 1 });
OrganizationSchema.index({ ownerId: 1 });
```

### Workspaces Collection

```typescript
interface IWorkspace {
  name: string; // Required
  slug: string; // Required (unique within org)
  organizationId: ObjectId; // Reference to Organization
  adminId?: ObjectId; // Reference to User (WORKSPACE_ADMIN)
  memberIds: ObjectId[]; // Array of User references
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
WorkspaceSchema.index({ organizationId: 1, slug: 1 });
WorkspaceSchema.index({ organizationId: 1 });
```

### Tools Collection

```typescript
interface ITool {
  name: string; // Required
  slug: string; // Unique, required (URL-safe)
  description?: string;
  icon?: string; // URL or icon identifier
  type: 'internal' | 'iframe'; // Required
  route?: string; // For internal: /app/tools/[slug]
  url?: string; // For iframe: external URL
  tags: string[]; // For filtering
  isTemplate: boolean; // Template vs. custom tool
  config: any; // Tool-specific configuration (Mixed type)
  createdBy: ObjectId; // Reference to User (SYSTEM_ADMIN)
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
ToolSchema.index({ slug: 1 });
ToolSchema.index({ tags: 1 });
ToolSchema.index({ type: 1 });
```

### ToolAccess Collection (CRITICAL for access control)

```typescript
interface IToolAccess {
  toolId: ObjectId; // Reference to Tool
  organizationId?: ObjectId; // If assigned to org
  workspaceId?: ObjectId; // If assigned to workspace
  userId?: ObjectId; // If assigned to individual user
  grantedBy: ObjectId; // Reference to User who granted access
  grantedAt: Date;
}

// CRITICAL: Exactly ONE of (organizationId, workspaceId, userId) must be set
// Compound indexes for efficient access checks
ToolAccessSchema.index({ toolId: 1, organizationId: 1 });
ToolAccessSchema.index({ toolId: 1, workspaceId: 1 });
ToolAccessSchema.index({ toolId: 1, userId: 1 });
ToolAccessSchema.index({ organizationId: 1 });
ToolAccessSchema.index({ workspaceId: 1 });
ToolAccessSchema.index({ userId: 1 });
```

### Documents Collection (Knowledge Base - Hybrid Model)

```typescript
interface IDocument {
  name: string; // Required
  filename: string;
  fileType: string; // mime type
  fileSize: number; // bytes
  storageUrl: string; // S3/cloud storage URL
  scope: 'global' | 'agent-specific'; // Required
  organizationId: ObjectId; // Reference to Organization (required)
  toolId?: ObjectId; // Reference to Tool (null for global docs)
  uploadedBy: ObjectId; // Reference to User
  metadata: any; // Custom metadata (Mixed type)
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
DocumentSchema.index({ organizationId: 1, scope: 1 });
DocumentSchema.index({ toolId: 1 });
DocumentSchema.index({ organizationId: 1, toolId: 1 });
```

### UsageAnalytics Collection

```typescript
interface IUsageAnalytics {
  toolId: ObjectId; // Reference to Tool
  userId: ObjectId; // Reference to User
  workspaceId?: ObjectId; // Reference to Workspace
  organizationId: ObjectId; // Reference to Organization
  executionTime: number; // milliseconds
  success: boolean;
  errorMessage?: string;
  apiCost?: number; // ONLY visible to SYSTEM_ADMIN
  timestamp: Date;
}

// Indexes for analytics queries
UsageAnalyticsSchema.index({ timestamp: -1 });
UsageAnalyticsSchema.index({ toolId: 1, timestamp: -1 });
UsageAnalyticsSchema.index({ userId: 1, timestamp: -1 });
UsageAnalyticsSchema.index({ workspaceId: 1, timestamp: -1 });
UsageAnalyticsSchema.index({ organizationId: 1, timestamp: -1 });
```

---

## API Structure (Express.js with MVC Pattern)

### Middleware (Create these FIRST)

#### authMiddleware.ts

```typescript
// Validates Clerk JWT token and attaches user to request
// Sets req.user with full user document from database
// Returns 401 if token invalid or user not found
```

#### roleMiddleware.ts

```typescript
// Factory function: requireRole(['SYSTEM_ADMIN', 'ORG_OWNER'])
// Checks if req.user.role matches allowed roles
// Returns 403 if unauthorized
```

#### toolAccessMiddleware.ts

```typescript
// Verifies user has access to specific tool
// Checks BOTH individual assignment AND workspace membership
// Query: ToolAccess where (userId = req.user._id OR workspaceId IN req.user.workspaceIds)
// Returns 403 if no access found
```

#### validationMiddleware.ts

```typescript
// Uses Zod schemas to validate request bodies
// Returns 400 with detailed validation errors
```

#### errorHandler.ts

```typescript
// Centralized error handling
// Logs errors and returns consistent error responses
// Different responses for dev vs. production
```

### Controllers & Routes

#### AuthController (/api/auth)

```typescript
POST / webhook; // Clerk webhook handler (user created/updated/deleted)
GET / me; // Get current user profile
PUT / me; // Update current user profile

// Middleware: All routes use authMiddleware
```

#### OrganizationController (/api/organizations)

```typescript
POST   /                     // Create organization [SYSTEM_ADMIN]
GET    /                     // List organizations (filtered by role)
GET    /:id                  // Get organization details [ORG_OWNER+]
PUT    /:id                  // Update organization [ORG_OWNER]
DELETE /:id                  // Delete organization [SYSTEM_ADMIN]

// Middleware stack examples:
// POST: authMiddleware → requireRole(['SYSTEM_ADMIN']) → validationMiddleware
// GET /:id: authMiddleware → (custom: verify user owns or is admin)
```

#### WorkspaceController (/api/workspaces)

```typescript
POST   /                     // Create workspace [ORG_OWNER]
GET    /                     // List user's workspaces (filtered by user's workspaceIds)
GET    /:id                  // Get workspace details [MEMBER+]
PUT    /:id                  // Update workspace [ORG_OWNER, WORKSPACE_ADMIN]
DELETE /:id                  // Delete workspace [ORG_OWNER]
POST   /:id/members          // Add member to workspace [ORG_OWNER, WORKSPACE_ADMIN]
DELETE /:id/members/:userId  // Remove member [ORG_OWNER, WORKSPACE_ADMIN]

// Important: When adding member, update User.workspaceIds array
```

#### UserController (/api/users)

```typescript
POST   /                     // Create user via Clerk invitation [SYSTEM_ADMIN, ORG_OWNER]
GET    /                     // List users (filtered by organizationId)
GET    /:id                  // Get user details [ORG_OWNER+]
PUT    /:id                  // Update user [ORG_OWNER, or self]
DELETE /:id                  // Delete user [SYSTEM_ADMIN, ORG_OWNER]

// Note: POST triggers Clerk invitation API
```

#### ToolController (/api/tools)

```typescript
POST   /                     // Create tool [SYSTEM_ADMIN]
GET    /                     // List available tools for current user (complex query)
GET    /:id                  // Get tool details
PUT    /:id                  // Update tool [SYSTEM_ADMIN]
DELETE /:id                  // Delete tool [SYSTEM_ADMIN]
POST   /:id/execute          // Execute tool (streams response)

// GET / Implementation (CRITICAL):
// 1. Get user's organizationId and workspaceIds
// 2. Query ToolAccess for:
//    - organizationId matches
//    - workspaceId IN user's workspaceIds
//    - userId matches
// 3. Get unique toolIds from results
// 4. Return Tool documents with those IDs
// 5. Include user's access path metadata (individual vs. workspace)

// POST /:id/execute Implementation:
// 1. Verify tool access with toolAccessMiddleware
// 2. Call appropriate tool handler (internal or proxy to external API)
// 3. Stream response using Server-Sent Events (SSE)
// 4. Log usage to UsageAnalytics collection
```

#### ToolAccessController (/api/tool-access)

```typescript
POST   /organization         // Assign tool to organization [SYSTEM_ADMIN]
POST   /workspace            // Assign tool to workspace [ORG_OWNER]
POST   /user                 // Assign tool to individual user [ORG_OWNER]
DELETE /:id                  // Remove tool access [SYSTEM_ADMIN, ORG_OWNER]
GET    /audit/:toolId        // Get access audit trail [SYSTEM_ADMIN, ORG_OWNER]

// POST /organization body: { toolId, organizationId }
// POST /workspace body: { toolId, workspaceId }
// POST /user body: { toolId, userId }

// Important: Check that workspaceId/userId belong to requester's organization
```

#### DocumentController (/api/documents)

```typescript
POST   /                     // Upload document (multipart/form-data)
GET    /                     // List documents (filtered by scope and access)
GET    /:id                  // Get document details and download URL
DELETE /:id                  // Delete document

// POST body: file, name, scope ('global' | 'agent-specific'), toolId (if agent-specific)
// Store files in cloud storage (S3, Cloudflare R2, etc.)
// GET / returns:
//   - Global docs from user's organization
//   - Agent-specific docs for tools user has access to
```

#### AnalyticsController (/api/analytics)

```typescript
GET    /user                 // Personal analytics (simple: 3 metrics)
GET    /workspace/:id        // Workspace analytics [WORKSPACE_ADMIN+]
GET    /organization/:id     // Organization analytics [ORG_OWNER+]
GET    /system               // System-wide analytics [SYSTEM_ADMIN]

// User analytics response (simple):
// { totalRuns: number, topTools: [{ name, count }], period: 'month' }

// Workspace/Org analytics response (detailed):
// {
//   totalRuns, activeUsers, topTools: [...],
//   runsByDay: [{ date, count }],
//   successRate: number,
//   avgExecutionTime: number
// }

// System analytics (includes costs):
// { ...above, totalCost, costByOrg: [...], costByTool: [...] }

// CRITICAL: Filter out apiCost field unless user is SYSTEM_ADMIN
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
    └── (proxy endpoints)
```

### Core Components

#### Layout Components

**DashboardLayout** (`(dashboard)/layout.tsx`)

```typescript
// Structure:
// <div className="flex h-screen bg-black">
//   <Sidebar />
//   <div className="flex-1 flex flex-col">
//     <TopNav />
//     <main className="flex-1 overflow-auto p-6">
//       {children}
//     </main>
//   </div>
// </div>

// Fetches user on mount, provides UserContext
```

**TopNav** (`components/TopNav.tsx`)

```typescript
// Left: Logo
// Center: WorkspaceSelector (modal trigger)
// Right: User menu dropdown

// WorkspaceSelector behavior:
// - Click → open modal
// - Modal shows searchable list of user's workspaces
// - Shows workspace name, member count
// - Click workspace → navigate to /dashboard?workspace={id}
// - Stores selected workspace in state/context
```

**Sidebar** (`components/Sidebar.tsx`)

```typescript
// Navigation items (role-based visibility):
// - My Tools (all users)
// - Knowledge Base (all users)
// - Analytics (all users)
// - Workspaces (ORG_OWNER, WORKSPACE_ADMIN)
// - Settings (all users)
// --- Divider ---
// - Organizations (SYSTEM_ADMIN only)
// - Global Tools (SYSTEM_ADMIN only)
// - System Analytics (SYSTEM_ADMIN only)

// Active state based on current route
// Use shadcn/ui Navigation components
```

#### Tool Components

**ToolGrid** (`(dashboard)/page.tsx`)

```typescript
// Main tools view (tools-first approach)
// Structure:
// - Search bar at top
// - Tag filters (multi-select chips)
// - Grid of ToolCards (responsive: 3-4 columns)
// - Empty state if no tools

// Fetches tools from /api/tools
// Filters locally by selected tags and search term
// Shows loading skeleton while fetching
```

**ToolCard** (`components/ToolCard.tsx`)

```typescript
// Card displaying:
// - Tool icon
// - Tool name
// - Short description (truncated)
// - Tags (show first 2-3)
// - Click → navigate to /tools/[slug]

// Hover effect: subtle elevation and border color change
// Use shadcn/ui Card component
```

**ToolFilters** (`components/ToolFilters.tsx`)

```typescript
// Tag-based filtering UI
// Structure:
// - Row of tag chips (from all available tools)
// - Multi-select behavior
// - "Clear all" button
// - Shows count of active filters

// Extracts unique tags from tools array
// Emits selected tags to parent
```

**ToolExecutionPage** (`tools/[slug]/page.tsx`)

```typescript
// Full-page tool runner
// Structure:
// - ToolHeader (name, description, back button)
// - Tool-specific UI (based on tool.type)
// - If 'internal': render React component for that tool
// - If 'iframe': render secured iframe (sandbox, CSP)
// - StreamingResponse component for AI outputs

// Fetches tool details from /api/tools/:id
// Handles tool execution via /api/tools/:id/execute
// Shows loading/error states
```

**StreamingResponse** (`tools/_components/StreamingResponse.tsx`)

```typescript
// Real-time response display
// Uses EventSource (Server-Sent Events) or fetch with ReadableStream
// Renders markdown as it arrives
// Shows typing indicator while streaming
// Auto-scrolls to bottom
// "Stop generating" button

// Implementation:
const eventSource = new EventSource('/api/tools/:id/execute');
eventSource.onmessage = (event) => {
  const chunk = JSON.parse(event.data);
  setResponse((prev) => prev + chunk.text);
};
```

#### Analytics Components

**SimpleAnalyticsCard** (`components/analytics/SimpleAnalyticsCard.tsx`)

```typescript
// Member view (3 metrics in cards)
// Cards show:
// 1. Total runs this month
// 2. Top 3 most-used tools (with icons)
// 3. Period indicator ("Last 30 days")

// Fetches from /api/analytics/user
// Simple, clean card layout
// No charts, just big numbers
```

**DetailedAnalyticsDashboard** (`components/analytics/DetailedAnalyticsDashboard.tsx`)

```typescript
// Admin view (ORG_OWNER, WORKSPACE_ADMIN)
// Sections:
// 1. Key metrics (cards): Total runs, Active users, Success rate, Avg time
// 2. Runs by day (line chart - Recharts)
// 3. Top tools (bar chart)
// 4. Recent activity (table)

// Fetches from /api/analytics/workspace/:id or /api/analytics/organization/:id
// Date range selector (7d, 30d, 90d)
// Export button (CSV download)
```

**SystemAnalyticsDashboard** (`(dashboard)/admin/analytics/page.tsx`)

```typescript
// SYSTEM_ADMIN only
// Everything from DetailedAnalyticsDashboard PLUS:
// - Total cost metrics
// - Cost by organization (table)
// - Cost by tool (chart)
// - Cost trends over time

// Fetches from /api/analytics/system
```

#### Admin Components

**OrgList** (`(dashboard)/admin/organizations/page.tsx`)

```typescript
// SYSTEM_ADMIN only
// Table showing all organizations
// Columns: Name, Owner, Workspaces, Users, Created
// Actions: View details, Delete (with confirmation)
// Search and pagination
// "Create Organization" button → modal/form
```

**OrgDetails** (`(dashboard)/admin/organizations/[id]/page.tsx`)

```typescript
// Tabs:
// 1. Overview (org info, settings)
// 2. Workspaces (list with member counts)
// 3. Users (list with roles)
// 4. Tool Access (assigned tools)
// 5. Analytics (org dashboard)

// Each tab fetches relevant data
// Edit buttons for ORG_OWNER or SYSTEM_ADMIN
```

**ToolAccessManager** (`components/admin/ToolAccessManager.tsx`)

```typescript
// UI for assigning tools
// Three modes (tabs):
// 1. Assign to Organization (SYSTEM_ADMIN only)
// 2. Assign to Workspace (ORG_OWNER)
// 3. Assign to User (ORG_OWNER)

// Each mode shows:
// - Tool selector (searchable dropdown)
// - Target selector (org/workspace/user dropdown)
// - "Grant Access" button
// - Current assignments table with "Remove" actions

// Calls /api/tool-access endpoints
```

**CreateToolForm** (`(dashboard)/admin/tools/create/page.tsx`)

```typescript
// SYSTEM_ADMIN only
// Form fields:
// - Name (required)
// - Slug (auto-generated from name, editable)
// - Description (textarea)
// - Icon (URL or upload)
// - Type: 'internal' or 'iframe' (radio)
// - If internal: Route (text input, defaults to /tools/[slug])
// - If iframe: URL (text input)
// - Tags (comma-separated or tag input)
// - Is Template (checkbox)

// On submit:
// - Validate with Zod
// - POST to /api/tools
// - Redirect to tool detail page

// "Cancel" button returns to tools list
```

---

## Design System (Tailwind + shadcn/ui)

### Color Palette (Based on ordodigital.com)

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Dark mode base
        background: '#0A0A0A',
        surface: '#1A1A1A',
        'surface-elevated': '#2A2A2A',

        // Text
        'text-primary': '#FFFFFF',
        'text-secondary': '#E5E5E5',
        'text-tertiary': '#A3A3A3',

        // Accents
        'accent-purple': '#8B5CF6',
        'accent-pink': '#EC4899',
        'accent-orange': '#F97316',

        // Borders
        'border-subtle': '#2A2A2A',
        'border-default': '#3A3A3A',
      },
    },
  },
};
```

### Component Styling Guidelines

**Buttons**

```typescript
// Primary CTA
className =
  'bg-gradient-to-r from-accent-purple to-accent-pink text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity';

// Secondary
className =
  'bg-surface-elevated text-text-primary border border-border-default px-4 py-2 rounded-lg hover:bg-surface hover:border-border-subtle transition-colors';

// Ghost
className =
  'text-text-secondary hover:text-text-primary hover:bg-surface-elevated px-4 py-2 rounded-lg transition-colors';
```

**Cards**

```typescript
className =
  'bg-surface border border-border-subtle rounded-lg p-6 hover:border-border-default transition-colors';
```

**Inputs**

```typescript
className =
  'bg-surface-elevated border border-border-default rounded-lg px-4 py-2 text-text-primary placeholder:text-text-tertiary focus:border-accent-purple focus:outline-none transition-colors';
```

**Typography**

```typescript
// Heading 1
className = 'text-4xl font-bold text-text-primary tracking-tight';

// Heading 2
className = 'text-2xl font-semibold text-text-primary';

// Body
className = 'text-base text-text-secondary leading-relaxed';

// Caption
className = 'text-sm text-text-tertiary';
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

## Security Implementation

### Helmet Configuration

```typescript
import helmet from 'helmet';

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.clerk.dev'],
        frameSrc: ["'self'"], // Restrict iframes
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.',
});

// Tool execution rate limit (more restrictive)
const toolLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 executions per minute
  keyGenerator: (req) => req.user._id, // Per user
});

app.use('/api/', apiLimiter);
app.use('/api/tools/:id/execute', toolLimiter);
```

### Input Validation with Zod

```typescript
import { z } from 'zod';

// Example: Create workspace schema
const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  organizationId: z.string().length(24), // MongoDB ObjectId
  adminId: z.string().length(24).optional(),
});

// Validation middleware
export const validate = (schema: z.ZodSchema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
  };
};

// Usage in route
router.post(
  '/workspaces',
  authMiddleware,
  requireRole(['ORG_OWNER']),
  validate(createWorkspaceSchema),
  WorkspaceController.create
);
```

### Clerk Integration

```typescript
// Backend: Webhook handler
import { Webhook } from 'svix';

router.post('/auth/webhook', async (req, res) => {
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  try {
    const event = webhook.verify(req.body, req.headers);

    switch (event.type) {
      case 'user.created':
        // Create user in MongoDB
        await User.create({
          clerkId: event.data.id,
          email: event.data.email_addresses[0].email_address,
          firstName: event.data.first_name,
          lastName: event.data.last_name,
        });
        break;

      case 'user.updated':
        // Update user in MongoDB
        await User.findOneAndUpdate(
          { clerkId: event.data.id },
          { /* updated fields */ }
        );
        break;

      case 'user.deleted':
        // Delete user from MongoDB
        await User.findOneAndDelete({ clerkId: event.data.id });
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    res.status(400).json({ error: 'Webhook verification failed' });
  }
});

// Frontend: Clerk provider
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

## Tool Execution & Streaming

### Server-Sent Events (SSE) for Streaming

```typescript
// Backend: Tool execution controller
export const executeToolController = async (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const { toolId } = req.params;
    const { input } = req.body;

    // Verify tool access
    const hasAccess = await verifyToolAccess(req.user._id, toolId);
    if (!hasAccess) {
      res.write(`data: ${JSON.stringify({ error: 'Access denied' })}\n\n`);
      return res.end();
    }

    // Get tool config
    const tool = await Tool.findById(toolId);

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
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    // Log usage
    await UsageAnalytics.create({
      toolId,
      userId: req.user._id,
      workspaceId: req.user.workspaceIds[0],
      organizationId: req.user.organizationId,
      executionTime: Date.now() - startTime,
      success: true,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

// Frontend: Consuming SSE
const executeToolWithStreaming = async (toolId: string, input: string) => {
  const eventSource = new EventSource(`/api/tools/${toolId}/execute`);

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.error) {
      console.error(data.error);
      eventSource.close();
      return;
    }

    if (data.done) {
      eventSource.close();
      return;
    }

    // Update UI with streamed text
    setResponse((prev) => prev + data.text);
  };

  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    eventSource.close();
  };

  return eventSource;
};
```

---

## Environment Variables

Create `.env` file:

```bash
# Database
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/ai-dashboard

# Clerk Authentication
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_WEBHOOK_SECRET=whsec_...

# AI APIs
AIRIA_API_KEY=...

# Node Environment
NODE_ENV=development

# Server
PORT=3000
API_URL=http://localhost:3000/api
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured in Vercel
- [ ] MongoDB Atlas cluster created and IP whitelist configured
- [ ] Clerk production app created and configured
- [ ] All tests passing (`npm run test`)
- [ ] ESLint warnings resolved (`npm run lint`)
- [ ] Build succeeds locally (`npm run build`)

### Vercel Configuration

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist"
}
```

### Post-Deployment

- [ ] Verify Clerk webhooks are reaching the deployed endpoint
- [ ] Test authentication flow end-to-end
- [ ] Verify database connections
- [ ] Test tool execution and streaming
- [ ] Check error monitoring (set up Sentry or similar)
- [ ] Verify CORS settings
- [ ] Test on multiple browsers

---

## Development Workflow

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd ai-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Initialize database (run migration scripts if any)
npm run db:init

# Start development server
npm run dev
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Git Hooks (Husky)

```json
// .husky/pre-commit
npm run lint
npm run test
```

---

## Testing Strategy

### Unit Tests (Vitest)

Test individual functions and utilities:

```typescript
// Example: toolAccessMiddleware.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { toolAccessMiddleware } from './toolAccessMiddleware';

describe('toolAccessMiddleware', () => {
  it('should grant access for direct assignment', async () => {
    // Mock user with direct tool access
    // Mock ToolAccess query
    // Assert middleware calls next()
  });

  it('should grant access for workspace membership', async () => {
    // Mock user in workspace with tool access
    // Mock ToolAccess query
    // Assert middleware calls next()
  });

  it('should deny access when no assignment found', async () => {
    // Mock user without access
    // Assert middleware returns 403
  });
});
```

### Integration Tests

Test API endpoints end-to-end:

```typescript
// Example: workspaces.integration.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Workspace API', () => {
  it('should create workspace with valid ORG_OWNER token', async () => {
    const response = await request(app)
      .post('/api/workspaces')
      .set('Authorization', 'Bearer <mock-token>')
      .send({
        name: 'Engineering',
        slug: 'engineering',
        organizationId: '<mock-org-id>',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
  });

  it('should reject workspace creation for MEMBER role', async () => {
    const response = await request(app)
      .post('/api/workspaces')
      .set('Authorization', 'Bearer <member-token>')
      .send({
        /* ... */
      });

    expect(response.status).toBe(403);
  });
});
```

### Component Tests (React Testing Library)

```typescript
// Example: ToolCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToolCard } from './ToolCard';

describe('ToolCard', () => {
  it('should render tool name and description', () => {
    render(<ToolCard tool={{
      name: 'Airia Chat',
      description: 'AI chatbot',
      tags: ['chat', 'ai']
    }} />);

    expect(screen.getByText('Airia Chat')).toBeInTheDocument();
    expect(screen.getByText('AI chatbot')).toBeInTheDocument();
  });

  it('should navigate to tool page on click', async () => {
    const user = userEvent.setup();
    render(<ToolCard tool={{ slug: 'airia-chat', /* ... */ }} />);

    await user.click(screen.getByRole('button'));
    expect(window.location.pathname).toBe('/tools/airia-chat');
  });
});
```

---

## Common Implementation Patterns

### Error Handling Pattern

```typescript
// Consistent error responses across all controllers
try {
  // Controller logic
  const result = await Service.someMethod();
  res.status(200).json({ data: result });
} catch (error) {
  // Log error with context
  logger.error('Error in SomeController.method', {
    error,
    userId: req.user?._id,
    requestId: req.id,
  });

  // Return appropriate error response
  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details,
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }

  // Generic error
  res.status(500).json({
    error: 'Internal server error',
    requestId: req.id,
  });
}
```

### Access Control Pattern

```typescript
// Every protected resource should verify:
// 1. User is authenticated (authMiddleware)
// 2. User has appropriate role (roleMiddleware)
// 3. User has access to specific resource (custom check)

// Example: Get workspace details
router.get('/workspaces/:id', authMiddleware, async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);

  if (!workspace) {
    return res.status(404).json({ error: 'Workspace not found' });
  }

  // Verify user has access to this workspace
  if (!req.user.workspaceIds.includes(workspace._id)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json({ data: workspace });
});
```

### Data Fetching Pattern (Frontend)

```typescript
// Use custom hook for consistent error handling and loading states
const useTools = (filters?: { tags?: string[] }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tools?' + new URLSearchParams({
          tags: filters?.tags?.join(',') || '',
        }));

        if (!response.ok) throw new Error('Failed to fetch tools');

        const data = await response.json();
        setTools(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [filters]);

  return { tools, loading, error };
};

// Usage in component
const ToolsPage = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { tools, loading, error } = useTools({ tags: selectedTags });

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error} />;

  return <ToolGrid tools={tools} />;
};
```

---

## Critical Implementation Notes

1. **Tool Access Query Logic** (Most Complex)
   - Must check THREE sources: org assignment, workspace assignment, user assignment
   - Use MongoDB `$or` operator to query all three conditions efficiently
   - Cache tool access results for performance

2. **Workspace Selector**
   - Store selected workspace in React Context, NOT localStorage (security)
   - Filter tools based on selected workspace if needed
   - Default to "All Workspaces" view

3. **Analytics Filtering**
   - ALWAYS filter financial data based on user role
   - Use MongoDB aggregation pipelines for performance
   - Cache analytics results for 5 minutes

4. **Streaming Implementation**
   - Handle connection drops gracefully
   - Implement retry logic on client side
   - Store partial responses to prevent data loss

5. **Error Messages**
   - Never expose internal details (database, stack traces) in production
   - Log detailed errors server-side
   - Return user-friendly messages to client

6. **Type Safety**
   - Use TypeScript interfaces for ALL data structures
   - Validate API responses with Zod on frontend too
   - Never use `any` type except for truly dynamic data

---

## Success Criteria

Your implementation is complete when:

- [ ] All user roles can authenticate and see appropriate UI
- [ ] System Admin can create tools and assign to organizations
- [ ] Org Owner can assign tools to users and workspaces
- [ ] Members can see and execute their assigned tools
- [ ] Tool execution streams responses in real-time
- [ ] Analytics dashboard shows appropriate data per role
- [ ] Knowledge base supports both global and agent-specific docs
- [ ] All routes are protected with proper authorization
- [ ] UI matches the ordodigital.com design aesthetic
- [ ] No console errors or warnings in browser
- [ ] Application passes all tests
- [ ] Application deploys successfully to Vercel

---

## Additional Resources

- Clerk Documentation: https://clerk.com/docs
- Mongoose Documentation: https://mongoosejs.com/docs/
- shadcn/ui Components: https://ui.shadcn.com/
- Tailwind CSS: https://tailwindcss.com/docs
- Vitest: https://vitest.dev/
- React Testing Library: https://testing-library.com/react

---

**START BUILDING**: Begin with backend setup (database schemas and middleware), then build API controllers, then frontend components. Test each piece before moving to the next.

Good luck! 🚀
