import { z } from 'zod';

/**
 * Create Tool Schema
 */
export const createToolSchema = z.object({
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
    description: z.string().optional(),
    icon: z.string().optional(),
    type: z.enum(['internal', 'iframe']),
    route: z.string().optional(),
    url: z.string().url('Invalid URL').optional(),
    tags: z.array(z.string()).optional(),
    is_template: z.boolean().optional(),
    config: z.record(z.string(), z.unknown()).optional(),
  }),
});

/**
 * Update Tool Schema
 */
export const updateToolSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid tool ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    slug: z
      .string()
      .min(1)
      .max(255)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    type: z.enum(['internal', 'iframe']).optional(),
    route: z.string().optional(),
    url: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    is_template: z.boolean().optional(),
    config: z.record(z.string(), z.unknown()).optional(),
  }),
});

/**
 * Get Tool Schema
 */
export const getToolSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid tool ID'),
  }),
});

/**
 * Delete Tool Schema
 */
export const deleteToolSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid tool ID'),
  }),
});

/**
 * Execute Tool Schema
 */
export const executeToolSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid tool ID'),
  }),
  body: z.object({
    input: z.string().min(1, 'Input is required'),
    context: z.record(z.string(), z.unknown()).optional(),
  }),
});
