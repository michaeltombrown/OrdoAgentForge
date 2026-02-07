import { z } from 'zod';

/**
 * Create User Schema
 */
export const createUserSchema = z.object({
  body: z.object({
    clerk_id: z.string().min(1, 'Clerk ID is required'),
    email: z.string().email('Invalid email address'),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    role: z.enum(['SYSTEM_ADMIN', 'ORG_OWNER', 'WORKSPACE_ADMIN', 'MEMBER']),
    organization_id: z.string().uuid('Invalid organization ID').optional(),
  }),
});

/**
 * Update User Schema
 */
export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    role: z
      .enum(['SYSTEM_ADMIN', 'ORG_OWNER', 'WORKSPACE_ADMIN', 'MEMBER'])
      .optional(),
    organization_id: z.string().uuid('Invalid organization ID').optional(),
  }),
});

/**
 * Get User Schema
 */
export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
});

/**
 * Delete User Schema
 */
export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
});
