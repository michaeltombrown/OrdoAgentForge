import { vi } from 'vitest';
import {
  Tool,
  Workspace,
  Organization,
  User,
  UsageAnalytics,
  Document,
} from '@/types/database';

/**
 * Mock tool data
 */
export const mockTool: Tool = {
  id: 'tool-test-123',
  name: 'Test AI Tool',
  slug: 'test-ai-tool',
  description: 'A test AI tool for testing',
  icon: '/icons/test.svg',
  type: 'internal',
  tags: ['test', 'ai'],
  config: undefined,
  is_template: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Mock organization data
 */
export const mockOrganization: Organization = {
  id: 'org-test-123',
  name: 'Test Organization',
  slug: 'test-org',
  timezone: 'America/New_York',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Mock workspace data
 */
export const mockWorkspace: Workspace = {
  id: 'workspace-test-123',
  name: 'Test Workspace',
  slug: 'test-workspace',
  organization_id: mockOrganization.id,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Mock user data
 */
export const mockUser: User = {
  id: 'user-test-123',
  clerk_id: 'clerk_test_user_123',
  email: 'test@example.com',
  role: 'MEMBER',
  organization_id: mockOrganization.id,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Mock admin user data
 */
export const mockAdminUser: User = {
  ...mockUser,
  id: 'user-admin-123',
  clerk_id: 'clerk_admin_123',
  email: 'admin@example.com',
  role: 'SYSTEM_ADMIN',
};

/**
 * Mock org owner user data
 */
export const mockOrgOwner: User = {
  ...mockUser,
  id: 'user-owner-123',
  clerk_id: 'clerk_owner_123',
  email: 'owner@example.com',
  role: 'ORG_OWNER',
};

/**
 * Mock analytics data
 */
export const mockAnalytics: UsageAnalytics = {
  id: 'analytics-test-123',
  user_id: mockUser.id,
  tool_id: mockTool.id,
  organization_id: mockOrganization.id,
  workspace_id: undefined,
  execution_time: 1500,
  success: true,
  error_message: undefined,
  api_cost: 0.05,
  timestamp: new Date().toISOString(),
};

/**
 * Mock document data
 */
export const mockDocument: Document = {
  id: 'doc-test-123',
  name: 'test-document.pdf',
  filename: 'test-document.pdf',
  organization_id: mockOrganization.id,
  tool_id: undefined,
  uploaded_by: mockUser.id,
  storage_url: '/documents/test-document.pdf',
  file_size: 1024000,
  file_type: 'application/pdf',
  scope: 'global',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Mock API fetch function
 */
export const mockFetch = vi.fn();

/**
 * Helper to mock successful API response
 */
export function mockApiSuccess<T>(data: T, status = 200) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status,
    json: async () => ({ data }),
    headers: new Headers(),
  });
}

/**
 * Helper to mock API error response
 */
export function mockApiError(error: string, status = 500) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({ error }),
    headers: new Headers(),
  });
}

/**
 * Helper to mock network error
 */
export function mockNetworkError() {
  mockFetch.mockRejectedValueOnce(new Error('Network error'));
}

/**
 * Mock tool API responses
 */
export const toolsAPI = {
  getUserTools: vi.fn().mockResolvedValue({ data: [mockTool] }),
  getTool: vi.fn().mockResolvedValue({ data: mockTool }),
  createTool: vi.fn().mockResolvedValue({ data: mockTool }),
  updateTool: vi.fn().mockResolvedValue({ data: mockTool }),
  deleteTool: vi.fn().mockResolvedValue({ success: true }),
  executeTool: vi
    .fn()
    .mockResolvedValue({ data: { result: 'Test execution result' } }),
};

/**
 * Mock workspace API responses
 */
export const workspacesAPI = {
  getUserWorkspaces: vi.fn().mockResolvedValue({ data: [mockWorkspace] }),
  getWorkspace: vi.fn().mockResolvedValue({ data: mockWorkspace }),
  createWorkspace: vi.fn().mockResolvedValue({ data: mockWorkspace }),
  updateWorkspace: vi.fn().mockResolvedValue({ data: mockWorkspace }),
  deleteWorkspace: vi.fn().mockResolvedValue({ success: true }),
  addMember: vi.fn().mockResolvedValue({ success: true }),
  removeMember: vi.fn().mockResolvedValue({ success: true }),
};

/**
 * Mock analytics API responses
 */
export const analyticsAPI = {
  getUserAnalytics: vi.fn().mockResolvedValue({ data: [mockAnalytics] }),
  getWorkspaceAnalytics: vi.fn().mockResolvedValue({ data: [mockAnalytics] }),
  getOrganizationAnalytics: vi
    .fn()
    .mockResolvedValue({ data: [mockAnalytics] }),
  getSystemAnalytics: vi.fn().mockResolvedValue({ data: [mockAnalytics] }),
};

/**
 * Mock document API responses
 */
export const documentsAPI = {
  listDocuments: vi.fn().mockResolvedValue({ data: [mockDocument] }),
  getDocument: vi.fn().mockResolvedValue({ data: mockDocument }),
  uploadDocument: vi.fn().mockResolvedValue({ data: mockDocument }),
  deleteDocument: vi.fn().mockResolvedValue({ success: true }),
};

/**
 * Helper to reset all API mocks
 */
export function resetAPIMocks() {
  vi.clearAllMocks();
}
