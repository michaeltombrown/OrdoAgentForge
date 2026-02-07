import { z } from 'zod';

/**
 * Create Organization Schema
 */
export const createOrganizationSchema = z.object({
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
    owner_id: z.string().uuid('Invalid owner ID'),
    logo: z.string().url('Invalid logo URL').optional(),
    primary_color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
      .optional(),
    timezone: z.string().optional(),
  }),
});

/**
 * Update Organization Schema
 */
export const updateOrganizationSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid organization ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    slug: z
      .string()
      .min(1)
      .max(255)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    logo: z.string().url().optional(),
    primary_color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
    timezone: z.string().optional(),
  }),
});

/**
 * Get Organization Schema
 */
export const getOrganizationSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid organization ID'),
  }),
});

/**
 * Delete Organization Schema
 */
export const deleteOrganizationSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid organization ID'),
  }),
});
