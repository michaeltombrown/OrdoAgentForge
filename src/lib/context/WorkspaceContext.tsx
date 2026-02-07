import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '../supabase/client';
import type { Workspace } from '../../types/database';

export interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  createWorkspace: (data: {
    name: string;
    description?: string;
  }) => Promise<Workspace>;
  updateWorkspace: (id: string, data: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getToken, isSignedIn } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = useCallback(async () => {
    if (!isSignedIn) {
      setWorkspaces([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      setWorkspaces(data || []);

      // Set current workspace if not set
      if (!currentWorkspace && data && data.length > 0) {
        setCurrentWorkspace(data[0]);
      }
    } catch (err) {
      console.error('Error fetching workspaces:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch workspaces'
      );
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, currentWorkspace]);

  const createWorkspace = useCallback(
    async (data: {
      name: string;
      description?: string;
    }): Promise<Workspace> => {
      try {
        setError(null);
        const token = await getToken();

        const response = await fetch('/api/workspaces', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create workspace');
        }

        const workspace = await response.json();
        setWorkspaces((prev) => [workspace, ...prev]);

        return workspace;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create workspace';
        setError(errorMessage);
        throw err;
      }
    },
    [getToken]
  );

  const updateWorkspace = useCallback(
    async (id: string, data: Partial<Workspace>): Promise<void> => {
      try {
        setError(null);
        const token = await getToken();

        const response = await fetch(`/api/workspaces/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update workspace');
        }

        const updatedWorkspace = await response.json();
        setWorkspaces((prev) =>
          prev.map((w) => (w.id === id ? updatedWorkspace : w))
        );

        if (currentWorkspace?.id === id) {
          setCurrentWorkspace(updatedWorkspace);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update workspace';
        setError(errorMessage);
        throw err;
      }
    },
    [getToken, currentWorkspace]
  );

  const deleteWorkspace = useCallback(
    async (id: string): Promise<void> => {
      try {
        setError(null);
        const token = await getToken();

        const response = await fetch(`/api/workspaces/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete workspace');
        }

        setWorkspaces((prev) => prev.filter((w) => w.id !== id));

        if (currentWorkspace?.id === id) {
          setCurrentWorkspace(workspaces.length > 1 ? workspaces[0] : null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete workspace';
        setError(errorMessage);
        throw err;
      }
    },
    [getToken, currentWorkspace, workspaces]
  );

  useEffect(() => {
    if (isSignedIn) {
      fetchWorkspaces();
    } else {
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setLoading(false);
    }
  }, [isSignedIn, fetchWorkspaces]);

  const value: WorkspaceContextType = {
    workspaces,
    currentWorkspace,
    loading,
    error,
    fetchWorkspaces,
    setCurrentWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
