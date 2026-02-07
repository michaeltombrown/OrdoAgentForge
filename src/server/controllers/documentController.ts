import { Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase/server';
import { AuthRequest } from '../../types/requests';

/**
 * Document Controller
 * Handles document/file upload and management
 */

/**
 * Upload a document to Supabase Storage
 */
export const uploadDocument = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, file_path, file_size, file_type, scope, agent_id, metadata } =
      req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Create document record
    const { data, error } = await supabase
      .from('documents')
      .insert({
        name,
        file_path,
        file_size,
        file_type,
        scope: scope || 'global',
        agent_id,
        uploaded_by: req.user.id,
        organization_id: req.user.organization_id,
        metadata,
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
 * List documents accessible to the current user
 */
export const listDocuments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { scope, agent_id } = req.query;

    let query = supabase
      .from('documents')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    // Filter by scope if provided
    if (scope) {
      query = query.eq('scope', scope as string);
    }

    // Filter by agent if provided
    if (agent_id) {
      query = query.eq('agent_id', agent_id as string);
    }

    // If not SYSTEM_ADMIN, filter by organization
    if (req.user.role !== 'SYSTEM_ADMIN') {
      query = query.or(
        `organization_id.eq.${req.user.organization_id},scope.eq.global`
      );
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
 * Get a specific document by ID
 */
export const getDocument = async (
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
      .from('documents')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    // Check permissions
    if (
      req.user.role !== 'SYSTEM_ADMIN' &&
      data.scope !== 'global' &&
      data.organization_id !== req.user.organization_id
    ) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a document (soft delete)
 */
export const deleteDocument = async (
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

    // Check if document exists
    const { data: existingDoc } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!existingDoc) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    // Check permissions: only uploader or system admin can delete
    if (
      req.user.role !== 'SYSTEM_ADMIN' &&
      existingDoc.uploaded_by !== req.user.id
    ) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    // Soft delete the document record
    const { error } = await supabase
      .from('documents')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, message: 'Document deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a signed URL for document download
 */
export const getDocumentUrl = async (
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

    // Get document record
    const { data: document } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    // Check permissions
    if (
      req.user.role !== 'SYSTEM_ADMIN' &&
      document.scope !== 'global' &&
      document.organization_id !== req.user.organization_id
    ) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Generate signed URL (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(document.file_path, 3600);

    if (error) {
      throw error;
    }

    res.status(200).json({ signedUrl: data.signedUrl });
  } catch (error) {
    next(error);
  }
};
