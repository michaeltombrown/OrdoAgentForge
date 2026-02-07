import { z } from 'zod';

/**
 * Create Workspace Schema
 */
export const createWorkspaceSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
    slug: z
      .string()
      .min(1, 'Slug is required')
      .max(255, 'Slug too long')
      .regex(
        /^[a-z0-9-]+$/,
        'Slug must contain only lowercase letters, numbers, and hyphens'
      ),
    organization_id: z.string().uuid('Invalid organization ID'),
    admin_id: z.string().uuid('Invalid admin ID').optional(),
  }),
});

/**
 * Update Workspace Schema
 */
export const updateWorkspaceSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid workspace ID'),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(255, 'Name too long')
      .optional(),
    slug: z
      .string()
      .min(1, 'Slug is required')
      .max(255, 'Slug too long')
      .regex(
        /^[a-z0-9-]+$/,
        'Slug must contain only lowercase letters, numbers, and hyphens'
      )
      .optional(),
    admin_id: z.string().uuid('Invalid admin ID').optional(),
  }),
});

/**
 * Get Workspace Schema
 */
export const getWorkspaceSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid workspace ID'),
  }),
});

/**
 * Delete Workspace Schema
 */
export const deleteWorkspaceSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid workspace ID'),
  }),
});

/**
 * Add Workspace Member Schema
 */
export const addWorkspaceMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid workspace ID'),
  }),
  body: z.object({
    user_id: z.string().uuid('Invalid user ID'),
  }),
});

/**
 * Remove Workspace Member Schema
 */
export const removeWorkspaceMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid workspace ID'),
    userId: z.string().uuid('Invalid user ID'),
  }),
});
