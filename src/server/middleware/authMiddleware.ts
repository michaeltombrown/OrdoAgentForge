import { Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { AuthRequest, ErrorResponse } from '../../types/requests.js';
import supabase from '../lib/supabase/server.js';
import { User } from '../../types/database.js';

/**
 * Auth Middleware
 *
 * Verifies Clerk session and attaches user to request
 * Queries Supabase users table to get full user data
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response<ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized - No token provided',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Clerk
    try {
      const session = await clerkClient.sessions.verifySession(token, token);

      if (!session) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized - Invalid session',
        });
        return;
      }

      // Get user from Supabase using Clerk ID
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', session.userId)
        .single();

      if (error || !user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized - User not found',
        });
        return;
      }

      // Attach user to request
      req.user = user as User;
      next();
    } catch (clerkError) {
      console.error('Clerk verification error:', clerkError);
      res.status(401).json({
        success: false,
        error: 'Unauthorized - Token verification failed',
      });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during authentication',
    });
    return;
  }
};

export default authMiddleware;
