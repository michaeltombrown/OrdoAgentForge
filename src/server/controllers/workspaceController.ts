import { Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase/server';
import { AuthRequest } from '../../types/requests';

/**
 * Workspace Controller
 * Handles workspace management operations
 */

/**
 * Create a new workspace
 */
export const createWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, slug, organization_id, settings } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check permissions
    if (
      req.user.role !== 'SYSTEM_ADMIN' &&
      req.user.role !== 'ORG_OWNER' &&
      req.user.role !== 'WORKSPACE_ADMIN'
    ) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // If not system admin, ensure workspace is in user's organization
    if (
      req.user.role !== 'SYSTEM_ADMIN' &&
      req.user.organization_id !== organization_id
    ) {
      res
        .status(403)
        .json({ error: 'Cannot create workspace in another organization' });
      return;
    }

    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name,
        slug,
        organization_id,
        created_by: req.user.id,
        settings,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Automatically add creator as workspace member with admin role
    await supabase.from('workspace_members').insert({
      workspace_id: data.id,
      user_id: req.user.id,
      role: 'WORKSPACE_ADMIN',
    });

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all workspaces for the current user
 */
export const getUserWorkspaces = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // System admins can see all workspaces
    if (req.user.role === 'SYSTEM_ADMIN') {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      res.status(200).json(data);
      return;
    }

    // Get workspaces where user is a member
    const { data, error } = await supabase
      .from('workspace_members')
      .select('workspace:workspaces(*)')
      .eq('user_id', req.user.id)
      .is('workspace.deleted_at', null);

    if (error) {
      throw error;
    }

    const workspaces = data.map((item) => item.workspace).filter(Boolean);

    res.status(200).json(workspaces);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific workspace by ID
 */
export const getWorkspace = async (
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
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      res.status(404).json({ error: 'Workspace not found' });
      return;
    }

    // Check if user has access to this workspace
    if (req.user.role !== 'SYSTEM_ADMIN') {
      const { data: membership } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', id)
        .eq('user_id', req.user.id)
        .single();

      if (!membership) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a workspace
 */
export const updateWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, settings } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if workspace exists
    const { data: existingWorkspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!existingWorkspace) {
      res.status(404).json({ error: 'Workspace not found' });
      return;
    }

    // Check permissions
    let hasPermission = req.user.role === 'SYSTEM_ADMIN';

    if (!hasPermission) {
      // Check if user is workspace admin
      const { data: membership } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', id)
        .eq('user_id', req.user.id)
        .single();

      hasPermission = membership?.role === 'WORKSPACE_ADMIN';
    }

    if (!hasPermission) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (settings !== undefined) updateData.settings = settings;

    const { data, error } = await supabase
      .from('workspaces')
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
 * Delete a workspace (soft delete)
 */
export const deleteWorkspace = async (
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

    // Check if workspace exists
    const { data: existingWorkspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!existingWorkspace) {
      res.status(404).json({ error: 'Workspace not found' });
      return;
    }

    // Only system admin or workspace creator can delete
    if (
      req.user.role !== 'SYSTEM_ADMIN' &&
      existingWorkspace.created_by !== req.user.id
    ) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    const { error } = await supabase
      .from('workspaces')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, message: 'Workspace deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a member to a workspace
 */
export const addMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { user_id, role } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if workspace exists
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!workspace) {
      res.status(404).json({ error: 'Workspace not found' });
      return;
    }

    // Check permissions
    let hasPermission = req.user.role === 'SYSTEM_ADMIN';

    if (!hasPermission) {
      const { data: membership } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', id)
        .eq('user_id', req.user.id)
        .single();

      hasPermission = membership?.role === 'WORKSPACE_ADMIN';
    }

    if (!hasPermission) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Check if user exists
    const { data: userExists } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .is('deleted_at', null)
      .single();

    if (!userExists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Add member
    const { data, error } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: id,
        user_id,
        role: role || 'MEMBER',
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
 * Remove a member from a workspace
 */
export const removeMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, userId } = req.params;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if workspace exists
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!workspace) {
      res.status(404).json({ error: 'Workspace not found' });
      return;
    }

    // Check permissions
    let hasPermission = req.user.role === 'SYSTEM_ADMIN';

    if (!hasPermission) {
      const { data: membership } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', id)
        .eq('user_id', req.user.id)
        .single();

      hasPermission = membership?.role === 'WORKSPACE_ADMIN';
    }

    if (!hasPermission) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Remove member
    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('workspace_id', id)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, message: 'Member removed' });
  } catch (error) {
    next(error);
  }
};
