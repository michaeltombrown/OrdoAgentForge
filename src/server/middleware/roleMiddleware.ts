import { Response, NextFunction } from 'express';
import { AuthRequest, ErrorResponse } from '../../types/requests.js';
import { UserRole } from '../../types/database.js';

/**
 * Role Middleware Factory
 *
 * Creates middleware that checks if user has required role(s)
 * Must be used AFTER authMiddleware
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (
    req: AuthRequest,
    res: Response<ErrorResponse>,
    next: NextFunction
  ): void => {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized - Authentication required',
      });
      return;
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Forbidden - Insufficient permissions',
        message: `Required role: ${allowedRoles.join(' or ')}`,
      });
      return;
    }

    next();
  };
};

/**
 * System Admin Only
 */
export const requireSystemAdmin = requireRole(['SYSTEM_ADMIN']);

/**
 * Org Owner or System Admin
 */
export const requireOrgOwner = requireRole(['SYSTEM_ADMIN', 'ORG_OWNER']);

/**
 * Workspace Admin, Org Owner, or System Admin
 */
export const requireWorkspaceAdmin = requireRole([
  'SYSTEM_ADMIN',
  'ORG_OWNER',
  'WORKSPACE_ADMIN',
]);

/**
 * Any authenticated user
 */
export const requireAuthenticated = requireRole([
  'SYSTEM_ADMIN',
  'ORG_OWNER',
  'WORKSPACE_ADMIN',
  'MEMBER',
]);

export default requireRole;
