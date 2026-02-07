import { Response, NextFunction } from 'express';
import { AuthRequest, ErrorResponse } from '../../types/requests.js';
import supabase from '../lib/supabase/server.js';

/**
 * Tool Access Middleware
 *
 * Verifies user has access to a specific tool
 * Uses check_tool_access database function
 * Must be used AFTER authMiddleware
 */
export const toolAccessMiddleware = async (
  req: AuthRequest,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Authentication required',
      });
    }

    // Get tool_id from params or body
    const toolId = req.params.toolId || req.body.tool_id;

    if (!toolId) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request - tool_id is required',
      });
    }

    // System Admin has access to all tools
    if (req.user.role === 'SYSTEM_ADMIN') {
      return next();
    }

    // Check tool access using database function
    const { data, error } = await supabase.rpc('check_tool_access', {
      user_id_param: req.user.id,
      tool_id_param: toolId,
    });

    if (error) {
      console.error('Tool access check error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error checking tool access',
      });
    }

    if (!data) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - You do not have access to this tool',
      });
    }

    next();
  } catch (error) {
    console.error('Tool access middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error in tool access middleware',
    });
  }
};

export default toolAccessMiddleware;
