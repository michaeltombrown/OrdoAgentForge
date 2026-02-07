import { Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase/server';
import { AuthRequest } from '../../types/requests';

/**
 * Tool Access Controller
 * Handles tool access assignment and management
 */

/**
 * Assign tool access to an organization
 */
export const assignToOrganization = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tool_id, organization_id } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Only SYSTEM_ADMIN can assign tool access
    if (req.user.role !== 'SYSTEM_ADMIN') {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Verify tool exists
    const { data: tool } = await supabase
      .from('tools')
      .select('id')
      .eq('id', tool_id)
      .is('deleted_at', null)
      .single();

    if (!tool) {
      res.status(404).json({ error: 'Tool not found' });
      return;
    }

    // Verify organization exists
    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', organization_id)
      .is('deleted_at', null)
      .single();

    if (!org) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    const { data, error } = await supabase
      .from('tool_access')
      .insert({
        tool_id,
        access_type: 'organization',
        organization_id,
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
 * Assign tool access to a workspace
 */
export const assignToWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tool_id, workspace_id } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Only SYSTEM_ADMIN or ORG_OWNER can assign tool access
    if (req.user.role !== 'SYSTEM_ADMIN' && req.user.role !== 'ORG_OWNER') {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Verify tool exists
    const { data: tool } = await supabase
      .from('tools')
      .select('id')
      .eq('id', tool_id)
      .is('deleted_at', null)
      .single();

    if (!tool) {
      res.status(404).json({ error: 'Tool not found' });
      return;
    }

    // Verify workspace exists
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspace_id)
      .is('deleted_at', null)
      .single();

    if (!workspace) {
      res.status(404).json({ error: 'Workspace not found' });
      return;
    }

    // If ORG_OWNER, ensure workspace is in their organization
    if (
      req.user.role === 'ORG_OWNER' &&
      workspace.organization_id !== req.user.organization_id
    ) {
      res.status(403).json({
        error: 'Cannot assign access to workspace in another organization',
      });
      return;
    }

    const { data, error } = await supabase
      .from('tool_access')
      .insert({
        tool_id,
        access_type: 'workspace',
        workspace_id,
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
 * Assign tool access to a specific user
 */
export const assignToUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tool_id, user_id } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Only SYSTEM_ADMIN or ORG_OWNER can assign tool access
    if (req.user.role !== 'SYSTEM_ADMIN' && req.user.role !== 'ORG_OWNER') {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Verify tool exists
    const { data: tool } = await supabase
      .from('tools')
      .select('id')
      .eq('id', tool_id)
      .is('deleted_at', null)
      .single();

    if (!tool) {
      res.status(404).json({ error: 'Tool not found' });
      return;
    }

    // Verify user exists
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .is('deleted_at', null)
      .single();

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // If ORG_OWNER, ensure user is in their organization
    if (
      req.user.role === 'ORG_OWNER' &&
      user.organization_id !== req.user.organization_id
    ) {
      res.status(403).json({
        error: 'Cannot assign access to user in another organization',
      });
      return;
    }

    const { data, error } = await supabase
      .from('tool_access')
      .insert({
        tool_id,
        access_type: 'individual',
        user_id,
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
 * Remove tool access
 */
export const removeAccess = async (
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

    // Only SYSTEM_ADMIN or ORG_OWNER can remove tool access
    if (req.user.role !== 'SYSTEM_ADMIN' && req.user.role !== 'ORG_OWNER') {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Get the access record
    const { data: accessRecord } = await supabase
      .from('tool_access')
      .select('*')
      .eq('id', id)
      .single();

    if (!accessRecord) {
      res.status(404).json({ error: 'Access record not found' });
      return;
    }

    // If ORG_OWNER, verify they have permission to remove this access
    if (req.user.role === 'ORG_OWNER') {
      if (accessRecord.access_type === 'organization') {
        if (accessRecord.organization_id !== req.user.organization_id) {
          res.status(403).json({ error: 'Insufficient permissions' });
          return;
        }
      } else if (accessRecord.access_type === 'workspace') {
        const { data: workspace } = await supabase
          .from('workspaces')
          .select('organization_id')
          .eq('id', accessRecord.workspace_id!)
          .single();

        if (workspace?.organization_id !== req.user.organization_id) {
          res.status(403).json({ error: 'Insufficient permissions' });
          return;
        }
      } else if (accessRecord.access_type === 'individual') {
        const { data: user } = await supabase
          .from('users')
          .select('organization_id')
          .eq('id', accessRecord.user_id!)
          .single();

        if (user?.organization_id !== req.user.organization_id) {
          res.status(403).json({ error: 'Insufficient permissions' });
          return;
        }
      }
    }

    const { error } = await supabase.from('tool_access').delete().eq('id', id);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, message: 'Access removed' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get access audit for a tool
 */
export const getAccessAudit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { toolId } = req.params;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Only SYSTEM_ADMIN can view access audit
    if (req.user.role !== 'SYSTEM_ADMIN') {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    const { data, error } = await supabase
      .from('tool_access')
      .select(
        `
        *,
        tool:tools(name, slug),
        organization:organizations(name),
        workspace:workspaces(name),
        user:users(email, first_name, last_name)
      `
      )
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
