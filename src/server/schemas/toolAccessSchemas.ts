import { z } from 'zod';

/**
 * Assign Tool to Organization Schema
 */
export const assignToolToOrganizationSchema = z.object({
  body: z.object({
    tool_id: z.string().uuid('Invalid tool ID'),
    organization_id: z.string().uuid('Invalid organization ID'),
  }),
});

/**
 * Assign Tool to Workspace Schema
 */
export const assignToolToWorkspaceSchema = z.object({
  body: z.object({
    tool_id: z.string().uuid('Invalid tool ID'),
    workspace_id: z.string().uuid('Invalid workspace ID'),
  }),
});

/**
 * Assign Tool to User Schema
 */
export const assignToolToUserSchema = z.object({
  body: z.object({
    tool_id: z.string().uuid('Invalid tool ID'),
    user_id: z.string().uuid('Invalid user ID'),
  }),
});

/**
 * Revoke Tool Access Schema
 */
export const revokeToolAccessSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid tool access ID'),
  }),
});

/**
 * Get User Tools Schema
 */
export const getUserToolsSchema = z.object({
  params: z.object({
    userId: z.string().uuid('Invalid user ID'),
  }),
});
