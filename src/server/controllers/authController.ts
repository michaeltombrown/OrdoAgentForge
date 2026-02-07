import { Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase/server';
import { AuthRequest } from '../../types/requests';

/**
 * Auth Controller
 * Handles authentication-related operations
 */

/**
 * Handle Clerk webhook events (user.created, user.updated, user.deleted)
 */
export const handleWebhook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, data } = req.body;

    switch (type) {
      case 'user.created':
      case 'user.updated': {
        const { id, email_addresses, first_name, last_name } = data;

        // Get primary email
        const primaryEmail = email_addresses.find(
          (email: { id: string; email_address: string }) =>
            email.id === data.primary_email_address_id
        );

        if (!primaryEmail) {
          res.status(400).json({ error: 'No primary email found' });
          return;
        }

        // Upsert user in Supabase
        const { data: userData, error } = await supabase
          .from('users')
          .upsert(
            {
              clerk_id: id,
              email: primaryEmail.email_address,
              first_name: first_name || null,
              last_name: last_name || null,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'clerk_id',
            }
          )
          .select()
          .single();

        if (error) {
          throw error;
        }

        res.status(200).json({ success: true, user: userData });
        break;
      }

      case 'user.deleted': {
        const { id } = data;

        // Soft delete user
        const { error } = await supabase
          .from('users')
          .update({ deleted_at: new Date().toISOString() })
          .eq('clerk_id', id);

        if (error) {
          throw error;
        }

        res.status(200).json({ success: true });
        break;
      }

      default:
        res.status(400).json({ error: 'Unsupported webhook event type' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', req.user.clerk_id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user profile
 */
export const updateCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { first_name, last_name } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        first_name,
        last_name,
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_id', req.user.clerk_id)
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
