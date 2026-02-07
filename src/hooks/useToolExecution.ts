import { useState, useCallback, useRef } from 'react';
import { useUser } from './useUser';
import { useWorkspaces } from './useWorkspaces';

interface ToolExecutionOptions {
  toolId: string;
  input: Record<string, unknown>;
  workspaceId?: string;
}

interface ExecutionResult {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: unknown;
  error?: string;
  created_at: string;
  completed_at?: string;
}

interface StreamChunk {
  type: 'token' | 'result' | 'error' | 'metadata';
  content: unknown;
}

export function useToolExecution() {
  const userContext = useUser();
  const workspaceContext = useWorkspaces();
  const user = userContext?.user || null;
  const currentWorkspace = workspaceContext?.currentWorkspace || null;
  const [executing, setExecuting] = useState(false);
  const [streamingOutput, setStreamingOutput] = useState<string>('');
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const executeTool = useCallback(
    async ({ toolId, input, workspaceId }: ToolExecutionOptions) => {
      if (!user) {
        setError(new Error('User not authenticated'));
        return null;
      }

      const targetWorkspaceId = workspaceId || currentWorkspace?.id;
      if (!targetWorkspaceId) {
        setError(new Error('No workspace selected'));
        return null;
      }

      setExecuting(true);
      setError(null);
      setStreamingOutput('');
      setResult(null);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(`/api/tools/${toolId}/execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          signal: abortControllerRef.current.signal,
          body: JSON.stringify({
            input,
            workspace_id: targetWorkspaceId,
          }),
        });

        if (!response.ok) {
          // Check if response is JSON before parsing
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Tool execution failed');
          } else {
            throw new Error('API endpoint not available');
          }
        }

        // Check if response is streaming
        const contentType = response.headers.get('content-type');
        if (
          contentType?.includes('text/event-stream') ||
          contentType?.includes('application/x-ndjson')
        ) {
          // Handle streaming response
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            throw new Error('Response body is not readable');
          }

          let accumulatedOutput = '';

          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter((line) => line.trim());

            for (const line of lines) {
              try {
                // Handle SSE format (data: {...})
                const jsonStr = line.startsWith('data: ')
                  ? line.slice(6)
                  : line;

                if (jsonStr === '[DONE]') {
                  continue;
                }

                const data: StreamChunk = JSON.parse(jsonStr);

                if (data.type === 'token') {
                  accumulatedOutput += data.content;
                  setStreamingOutput(accumulatedOutput);
                } else if (data.type === 'result') {
                  setResult(data.content as ExecutionResult);
                } else if (data.type === 'error') {
                  throw new Error(String(data.content));
                } else if (data.type === 'metadata') {
                  // Handle metadata if needed
                  console.log('Execution metadata:', data.content);
                }
              } catch (parseError) {
                console.warn('Failed to parse stream chunk:', line, parseError);
              }
            }
          }

          return result;
        } else {
          // Handle non-streaming response
          const data = await response.json();
          setResult(data);
          return data;
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            setError(new Error('Execution cancelled'));
          } else {
            setError(err);
          }
        } else {
          setError(new Error('Unknown error during execution'));
        }
        return null;
      } finally {
        setExecuting(false);
        abortControllerRef.current = null;
      }
    },
    [user, currentWorkspace, result]
  );

  const cancelExecution = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const resetExecution = useCallback(() => {
    setExecuting(false);
    setStreamingOutput('');
    setResult(null);
    setError(null);
    abortControllerRef.current = null;
  }, []);

  return {
    executing,
    streamingOutput,
    result,
    error,
    executeTool,
    cancelExecution,
    resetExecution,
  };
}
