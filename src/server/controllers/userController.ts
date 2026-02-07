import { Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase/server';
import { AuthRequest } from '../../types/requests';
import { clerkClient } from '@clerk/clerk-sdk-node';

/**
 * User Controller
 * Handles user management operations
 */

/**
 * Create a new user and send Clerk invitation
 */
export const createUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, first_name, last_name, role, organization_id } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Only SYSTEM_ADMIN or ORG_OWNER can create users
    if (req.user.role !== 'SYSTEM_ADMIN' && req.user.role !== 'ORG_OWNER') {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Create user invitation in Clerk
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName: first_name,
      lastName: last_name,
    });

    // Create user record in Supabase
    const { data, error } = await supabase
      .from('users')
      .insert({
        clerk_id: clerkUser.id,
        email,
        first_name,
        last_name,
        role: role || 'MEMBER',
        organization_id,
      })
      .select()
      .single();

    if (error) {
      // If Supabase insert fails, delete the Clerk user
      await clerkClient.users.deleteUser(clerkUser.id);
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * List all users (with optional filters)
 */
export const listUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { organization_id, role, search } = req.query;

    let query = supabase
      .from('users')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    // Filter by organization if provided
    if (organization_id) {
      query = query.eq('organization_id', organization_id as string);
    }

    // Filter by role if provided
    if (role) {
      query = query.eq('role', role as string);
    }

    // Search by email, first_name, or last_name if provided
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.or(
        `email.ilike.${searchTerm},first_name.ilike.${searchTerm},last_name.ilike.${searchTerm}`
      );
    }

    // If user is ORG_OWNER, only show users in their organization
    if (req.user.role === 'ORG_OWNER') {
      query = query.eq('organization_id', req.user.organization_id!);
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
 * Get a specific user by ID
 */
export const getUser = async (
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
      .from('users')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check permissions: user can view their own profile or admins can view any
    if (
      data.id !== req.user.id &&
      req.user.role !== 'SYSTEM_ADMIN' &&
      req.user.role !== 'ORG_OWNER'
    ) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a user
 */
export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { first_name, last_name, role, organization_id } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Permission check
    const canUpdate =
      req.user.id === id || // User updating themselves
      req.user.role === 'SYSTEM_ADMIN' || // System admin
      (req.user.role === 'ORG_OWNER' &&
        req.user.organization_id === existingUser.organization_id); // Org owner updating their org members

    if (!canUpdate) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Prepare update data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;

    // Only admins can change role and organization
    if (req.user.role === 'SYSTEM_ADMIN' || req.user.role === 'ORG_OWNER') {
      if (role !== undefined) updateData.role = role;
      if (organization_id !== undefined)
        updateData.organization_id = organization_id;
    }

    const { data, error } = await supabase
      .from('users')
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
 * Delete a user (soft delete)
 */
export const deleteUser = async (
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

    // Only SYSTEM_ADMIN or ORG_OWNER can delete users
    if (req.user.role !== 'SYSTEM_ADMIN' && req.user.role !== 'ORG_OWNER') {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Org owners can only delete users in their organization
    if (
      req.user.role === 'ORG_OWNER' &&
      req.user.organization_id !== existingUser.organization_id
    ) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Soft delete in Supabase
    const { error: supabaseError } = await supabase
      .from('users')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (supabaseError) {
      throw supabaseError;
    }

    // Delete from Clerk
    try {
      await clerkClient.users.deleteUser(existingUser.clerk_id);
    } catch (clerkError) {
      console.error('Failed to delete user from Clerk:', clerkError);
      // Continue even if Clerk deletion fails
    }

    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
