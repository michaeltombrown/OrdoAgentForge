import { Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase/server';
import { AuthRequest } from '../../types/requests';

/**
 * Analytics Controller
 * Handles usage analytics and reporting
 */

/**
 * Get analytics for the current user
 */
export const getUserAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { startDate, endDate, toolId } = req.query;

    let query = supabase
      .from('usage_analytics')
      .select('*')
      .eq('user_id', req.user.id)
      .order('timestamp', { ascending: false });

    if (startDate) {
      query = query.gte('timestamp', startDate as string);
    }

    if (endDate) {
      query = query.lte('timestamp', endDate as string);
    }

    if (toolId) {
      query = query.eq('tool_id', toolId as string);
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
 * Get analytics for a workspace
 */
export const getWorkspaceAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const { startDate, endDate, toolId } = req.query;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if user has access to this workspace
    if (req.user.role !== 'SYSTEM_ADMIN') {
      const { data: membership } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('user_id', req.user.id)
        .single();

      if (!membership || membership.role !== 'WORKSPACE_ADMIN') {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }
    }

    let query = supabase
      .from('usage_analytics')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('timestamp', { ascending: false });

    if (startDate) {
      query = query.gte('timestamp', startDate as string);
    }

    if (endDate) {
      query = query.lte('timestamp', endDate as string);
    }

    if (toolId) {
      query = query.eq('tool_id', toolId as string);
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
 * Get analytics for an organization
 */
export const getOrganizationAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { organizationId } = req.params;
    const { startDate, endDate, toolId } = req.query;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check permissions
    if (
      req.user.role !== 'SYSTEM_ADMIN' &&
      (req.user.role !== 'ORG_OWNER' ||
        req.user.organization_id !== organizationId)
    ) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    let query = supabase
      .from('usage_analytics')
      .select('*')
      .eq('organization_id', organizationId)
      .order('timestamp', { ascending: false });

    if (startDate) {
      query = query.gte('timestamp', startDate as string);
    }

    if (endDate) {
      query = query.lte('timestamp', endDate as string);
    }

    if (toolId) {
      query = query.eq('tool_id', toolId as string);
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
 * Get system-wide analytics (SYSTEM_ADMIN only)
 */
export const getSystemAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Only SYSTEM_ADMIN can view system analytics
    if (req.user.role !== 'SYSTEM_ADMIN') {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    const { startDate, endDate, toolId, action } = req.query;

    let query = supabase
      .from('usage_analytics')
      .select('*')
      .order('timestamp', { ascending: false });

    if (startDate) {
      query = query.gte('timestamp', startDate as string);
    }

    if (endDate) {
      query = query.lte('timestamp', endDate as string);
    }

    if (toolId) {
      query = query.eq('tool_id', toolId as string);
    }

    if (action) {
      query = query.eq('action', action as string);
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
