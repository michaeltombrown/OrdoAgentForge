import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import type { Tool } from '../../types/database';

export interface ToolExecutionInput {
  [key: string]: unknown;
}

export interface ToolExecutionContext {
  [key: string]: unknown;
}

export interface ToolsContextType {
  tools: Tool[];
  loading: boolean;
  error: string | null;
  fetchTools: () => Promise<void>;
  executeTool: (
    toolId: string,
    input: ToolExecutionInput,
    context?: ToolExecutionContext
  ) => Promise<unknown>;
}

export const ToolsContext = createContext<ToolsContextType | undefined>(
  undefined
);

export const ToolsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getToken, isSignedIn } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = useCallback(async () => {
    if (!isSignedIn) {
      setTools([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      const response = await fetch('/api/tools', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }

      const data = await response.json();
      setTools(data || []);
    } catch (err) {
      console.error('Error fetching tools:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tools');
    } finally {
      setLoading(false);
    }
  }, [getToken, isSignedIn]);

  const executeTool = useCallback(
    async (
      toolId: string,
      input: ToolExecutionInput,
      context?: ToolExecutionContext
    ): Promise<unknown> => {
      try {
        setError(null);
        const token = await getToken();

        const response = await fetch(`/api/tools/${toolId}/execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ input, context }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to execute tool');
        }

        return await response.json();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to execute tool';
        setError(errorMessage);
        throw err;
      }
    },
    [getToken]
  );

  useEffect(() => {
    if (isSignedIn) {
      fetchTools();
    } else {
      setTools([]);
      setLoading(false);
    }
  }, [isSignedIn, fetchTools]);

  const value: ToolsContextType = {
    tools,
    loading,
    error,
    fetchTools,
    executeTool,
  };

  return (
    <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>
  );
};
