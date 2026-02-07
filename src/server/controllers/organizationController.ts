import { Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase/server';
import { AuthRequest } from '../../types/requests';

/**
 * Organization Controller
 * Handles organization management operations
 */

/**
 * Create a new organization
 */
export const createOrganization = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, slug, logo, settings } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Only SYSTEM_ADMIN can create organizations
    if (req.user.role !== 'SYSTEM_ADMIN') {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    const { data, error } = await supabase
      .from('organizations')
      .insert({
        name,
        slug,
        owner_id: req.user.id,
        logo,
        settings,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * List all organizations
 */
export const listOrganizations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let query = supabase
      .from('organizations')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    // If user is ORG_OWNER, only show their organization
    if (req.user.role === 'ORG_OWNER') {
      query = query.eq('id', req.user.organization_id!);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific organization by ID
 */
export const getOrganization = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    // Check permissions: only system admins or members of the org can view
    if (req.user.role !== 'SYSTEM_ADMIN' && req.user.organization_id !== id) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an organization
 */
export const updateOrganization = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, logo, settings } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if organization exists
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!existingOrg) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    // Permission check: only system admin or org owner can update
    if (
      req.user.role !== 'SYSTEM_ADMIN' &&
      existingOrg.owner_id !== req.user.id
    ) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (logo !== undefined) updateData.logo = logo;
    if (settings !== undefined) updateData.settings = settings;

    const { data, error } = await supabase
      .from('organizations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an organization (soft delete)
 */
export const deleteOrganization = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Only SYSTEM_ADMIN can delete organizations
    if (req.user.role !== 'SYSTEM_ADMIN') {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Check if organization exists
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!existingOrg) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    // Soft delete the organization
    const { error } = await supabase
      .from('organizations')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, message: 'Organization deleted' });
  } catch (error) {
    next(error);
  }
};
