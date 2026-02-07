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

// Mock tools data for demo when API is not available
function getMockTools(): Tool[] {
  return [
    {
      id: 'demo-tool-1',
      name: 'Text Summarizer',
      slug: 'text-summarizer',
      description: 'Summarize long text into concise paragraphs',
      type: 'internal',
      tags: ['ai', 'text', 'nlp'],
      is_template: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-tool-2',
      name: 'Code Generator',
      slug: 'code-generator',
      description:
        'Generate code snippets based on natural language descriptions',
      type: 'internal',
      tags: ['ai', 'code', 'developer'],
      is_template: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-tool-3',
      name: 'Data Analyzer',
      slug: 'data-analyzer',
      description: 'Analyze datasets and provide insights',
      type: 'internal',
      tags: ['ai', 'data', 'analytics'],
      is_template: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-tool-4',
      name: 'Image Describer',
      slug: 'image-describer',
      description: 'Generate detailed descriptions of images',
      type: 'iframe',
      tags: ['ai', 'vision', 'image'],
      is_template: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
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
        // If API is not available, use mock data for demo
        console.warn('API not available, using mock data');
        setTools(getMockTools());
        setLoading(false);
        return;
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('API returned non-JSON response, using mock data');
        setTools(getMockTools());
        setLoading(false);
        return;
      }

      const data = await response.json();
      setTools(data || []);
    } catch (err) {
      console.error('Error fetching tools:', err);
      // Use mock data as fallback
      console.warn('Using mock data due to error');
      setTools(getMockTools());
      setError(null); // Don't show error when using mock data
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
          // Check if response is JSON before parsing
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to execute tool');
          } else {
            throw new Error('API endpoint not available');
          }
        }

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API returned non-JSON response');
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
