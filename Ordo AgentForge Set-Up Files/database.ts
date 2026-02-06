/**
 * Database Type Definitions
 *
 * These types match the PostgreSQL schema in Supabase
 * and should be kept in sync with database migrations.
 */

// ============================================
// ENUMS
// ============================================

export type UserRole =
  | 'SYSTEM_ADMIN'
  | 'ORG_OWNER'
  | 'WORKSPACE_ADMIN'
  | 'MEMBER';

export type ToolType = 'internal' | 'iframe';

export type DocumentScope = 'global' | 'agent-specific';

export type AccessType = 'individual' | 'workspace' | 'organization';

// ============================================
// DATABASE TABLES
// ============================================

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_id?: string;
  logo?: string;
  primary_color?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  organization_id: string;
  admin_id?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  joined_at: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  type: ToolType;
  route?: string;
  url?: string;
  tags: string[];
  is_template: boolean;
  config?: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ToolAccess {
  id: string;
  tool_id: string;
  organization_id?: string;
  workspace_id?: string;
  user_id?: string;
  granted_by: string;
  granted_at: string;
}

export interface Document {
  id: string;
  name: string;
  filename?: string;
  file_type?: string;
  file_size?: number;
  storage_url?: string;
  scope: DocumentScope;
  organization_id: string;
  tool_id?: string;
  uploaded_by?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UsageAnalytics {
  id: string;
  tool_id: string;
  user_id: string;
  workspace_id?: string;
  organization_id: string;
  execution_time?: number;
  success?: boolean;
  error_message?: string;
  api_cost?: number;
  timestamp: string;
}

// ============================================
// EXTENDED TYPES (with relations)
// ============================================

export interface UserWithOrganization extends User {
  organization?: Organization;
}

export interface WorkspaceWithMembers extends Workspace {
  members?: User[];
  member_count?: number;
  admin?: User;
}

export interface ToolWithAccess extends Tool {
  access_type?: AccessType;
  granted_at?: string;
}

export interface OrganizationWithOwner extends Organization {
  owner?: User;
  workspace_count?: number;
  user_count?: number;
}

export interface DocumentWithRelations extends Document {
  tool?: Tool;
  uploaded_by_user?: User;
}

export interface UsageAnalyticsWithRelations extends UsageAnalytics {
  tool?: Tool;
  user?: User;
  workspace?: Workspace;
  organization?: Organization;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
  owner_id: string;
  logo?: string;
  primary_color?: string;
  timezone?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  slug?: string;
  logo?: string;
  primary_color?: string;
  timezone?: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  slug: string;
  organization_id: string;
  admin_id?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  slug?: string;
  admin_id?: string;
}

export interface AddWorkspaceMemberRequest {
  user_id: string;
}

export interface CreateToolRequest {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  type: ToolType;
  route?: string;
  url?: string;
  tags?: string[];
  is_template?: boolean;
  config?: Record<string, any>;
}

export interface UpdateToolRequest {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  type?: ToolType;
  route?: string;
  url?: string;
  tags?: string[];
  is_template?: boolean;
  config?: Record<string, any>;
}

export interface AssignToolToOrganizationRequest {
  tool_id: string;
  organization_id: string;
}

export interface AssignToolToWorkspaceRequest {
  tool_id: string;
  workspace_id: string;
}

export interface AssignToolToUserRequest {
  tool_id: string;
  user_id: string;
}

export interface ExecuteToolRequest {
  input: string;
  context?: Record<string, any>;
}

export interface UploadDocumentRequest {
  name: string;
  scope: DocumentScope;
  tool_id?: string;
}

export interface AnalyticsQueryParams {
  start_date?: string;
  end_date?: string;
  tool_id?: string;
  user_id?: string;
  workspace_id?: string;
  organization_id?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface SimpleAnalytics {
  total_runs: number;
  top_tools: Array<{
    tool_id: string;
    tool_name: string;
    tool_icon?: string;
    run_count: number;
  }>;
  period: string;
}

export interface DetailedAnalytics {
  total_runs: number;
  active_users: number;
  success_rate: number;
  avg_execution_time: number;
  runs_by_day: Array<{
    date: string;
    count: number;
  }>;
  top_tools: Array<{
    tool_id: string;
    tool_name: string;
    run_count: number;
  }>;
}

export interface SystemAnalytics extends DetailedAnalytics {
  total_cost: number;
  cost_by_organization: Array<{
    organization_id: string;
    organization_name: string;
    cost: number;
  }>;
  cost_by_tool: Array<{
    tool_id: string;
    tool_name: string;
    cost: number;
  }>;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================
// CONTEXT TYPES
// ============================================

export interface UserContextValue {
  user: User | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export interface WorkspaceContextValue {
  selectedWorkspace: Workspace | null;
  workspaces: Workspace[];
  loading: boolean;
  selectWorkspace: (workspaceId: string) => void;
  refetch: () => Promise<void>;
}

export interface ToolsContextValue {
  tools: ToolWithAccess[];
  loading: boolean;
  refetch: () => Promise<void>;
  filterByTags: (tags: string[]) => void;
  searchTools: (query: string) => void;
}

// ============================================
// FORM TYPES
// ============================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface OrganizationFormData {
  name: string;
  slug: string;
  logo?: string;
  primary_color?: string;
  timezone?: string;
}

export interface WorkspaceFormData {
  name: string;
  slug: string;
}

export interface ToolFormData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  type: ToolType;
  route?: string;
  url?: string;
  tags: string[];
  is_template: boolean;
  config?: Record<string, any>;
}

// ============================================
// ERROR TYPES
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  error: string;
  details?: ValidationError[];
  status: number;
}

// ============================================
// STREAMING TYPES
// ============================================

export interface StreamChunk {
  text?: string;
  done?: boolean;
  error?: string;
}

export interface ToolExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  execution_time: number;
}

// ============================================
// DATABASE FUNCTION RETURN TYPES
// ============================================

export interface GetUserToolsResult {
  tool_id: string;
  tool_name: string;
  tool_slug: string;
  tool_description?: string;
  tool_icon?: string;
  tool_type: ToolType;
  tool_tags: string[];
  access_type: AccessType;
}

export interface CheckToolAccessResult {
  has_access: boolean;
}

// ============================================
// EXPORT ALL
// ============================================

export type {
  User,
  Organization,
  Workspace,
  WorkspaceMember,
  Tool,
  ToolAccess,
  Document,
  UsageAnalytics,
};
