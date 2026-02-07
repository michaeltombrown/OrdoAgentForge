import { Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase/server';
import { AuthRequest } from '../../types/requests';

/**
 * Tool Controller
 * Handles tool management and execution operations
 */

/**
 * Create a new tool
 */
export const createTool = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, slug, description, icon, type, config, tags } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Only SYSTEM_ADMIN can create tools
    if (req.user.role !== 'SYSTEM_ADMIN') {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    const { data, error } = await supabase
      .from('tools')
      .insert({
        name,
        slug,
        description,
        icon,
        type,
        config,
        tags,
        is_active: true,
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
 * Get tools accessible to the current user
 * Uses the get_user_tools database function
 */
export const getUserTools = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Call the database function
    const { data, error } = await supabase.rpc('get_user_tools', {
      user_id_param: req.user.id,
    });

    if (error) {
      throw error;
    }

    res.status(200).json(data || []);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific tool by ID
 */
export const getTool = async (
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
      .from('tools')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      res.status(404).json({ error: 'Tool not found' });
      return;
    }

    // Check if user has access to this tool
    if (req.user.role !== 'SYSTEM_ADMIN') {
      const { data: hasAccess } = await supabase.rpc('check_tool_access', {
        user_id_param: req.user.id,
        tool_id_param: id,
      });

      if (!hasAccess) {
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
 * Update a tool
 */
export const updateTool = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, type, config, tags, is_active } =
      req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Only SYSTEM_ADMIN can update tools
    if (req.user.role !== 'SYSTEM_ADMIN') {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Check if tool exists
    const { data: existingTool } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!existingTool) {
      res.status(404).json({ error: 'Tool not found' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (type !== undefined) updateData.type = type;
    if (config !== undefined) updateData.config = config;
    if (tags !== undefined) updateData.tags = tags;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabase
      .from('tools')
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
 * Delete a tool (soft delete)
 */
export const deleteTool = async (
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

    // Only SYSTEM_ADMIN can delete tools
    if (req.user.role !== 'SYSTEM_ADMIN') {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Check if tool exists
    const { data: existingTool } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!existingTool) {
      res.status(404).json({ error: 'Tool not found' });
      return;
    }

    const { error } = await supabase
      .from('tools')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, message: 'Tool deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * Execute a tool (with streaming support)
 */
export const executeTool = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { input, context } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get tool details
    const { data: tool, error: toolError } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (toolError) {
      throw toolError;
    }

    if (!tool) {
      res.status(404).json({ error: 'Tool not found' });
      return;
    }

    // Check access
    if (req.user.role !== 'SYSTEM_ADMIN') {
      const { data: hasAccess } = await supabase.rpc('check_tool_access', {
        user_id_param: req.user.id,
        tool_id_param: id,
      });

      if (!hasAccess) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
    }

    // Log usage
    await supabase.from('usage_analytics').insert({
      user_id: req.user.id,
      tool_id: id,
      workspace_id: context?.workspace_id,
      organization_id: req.user.organization_id,
      action: 'tool_execution',
      metadata: { input, context },
    });

    // Handle tool execution based on type
    if (tool.type === 'internal') {
      // For internal tools, return config and let frontend handle execution
      res.status(200).json({
        tool,
        message: 'Execute tool on client side',
      });
    } else if (tool.type === 'iframe') {
      // For iframe tools, return the iframe URL
      res.status(200).json({
        tool,
        iframeUrl: tool.config?.iframe_url,
      });
    } else {
      res.status(400).json({ error: 'Unsupported tool type' });
    }
  } catch (error) {
    next(error);
  }
};
