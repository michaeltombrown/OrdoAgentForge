import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StreamingResponse } from '@/components/tools/StreamingResponse';
import { useTools } from '@/hooks/useTools';
import { useToolExecution } from '@/hooks/useToolExecution';
import { ArrowLeft, Play } from 'lucide-react';

export const ToolPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { tools, loading: toolsLoading } = useTools();
  const {
    executing,
    streamingOutput,
    result,
    error: executionError,
    executeTool,
    cancelExecution,
    resetExecution,
  } = useToolExecution();

  const [toolInput, setToolInput] = useState<Record<string, string>>({});
  const tool = tools.find((t) => t.id === slug);
  const shouldAutoExecute = searchParams.get('execute') === 'true';

  const handleExecute = async () => {
    if (!tool) return;

    resetExecution();
    await executeTool({
      toolId: tool.id,
      input: toolInput,
    });
  };

  useEffect(() => {
    if (tool && shouldAutoExecute && Object.keys(toolInput).length === 0) {
      // Auto-execute with empty input if requested
      handleExecute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, shouldAutoExecute]);

  const handleInputChange = (key: string, value: string) => {
    setToolInput((prev) => ({ ...prev, [key]: value }));
  };

  if (toolsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading tool...</p>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tool not found
        </h2>
        <p className="text-gray-600 mb-4">
          The tool you're looking for doesn't exist or you don't have access.
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
          {tool.description && (
            <p className="text-gray-600 mt-1">{tool.description}</p>
          )}
        </div>
      </div>

      {/* Tool Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Generic input fields - in real app, this would be dynamic based on tool config */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Input
                id="prompt"
                value={toolInput.prompt || ''}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                placeholder="Enter your prompt..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Context (Optional)</Label>
              <Input
                id="context"
                value={toolInput.context || ''}
                onChange={(e) => handleInputChange('context', e.target.value)}
                placeholder="Additional context..."
              />
            </div>

            <Button
              onClick={handleExecute}
              disabled={executing}
              className="w-full"
            >
              {executing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Execute Tool
                </>
              )}
            </Button>

            {executionError && (
              <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
                {executionError.message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output Section */}
        <StreamingResponse
          content={streamingOutput || result?.output?.toString() || ''}
          isStreaming={executing}
          onCancel={cancelExecution}
          title="Output"
        />
      </div>
    </div>
  );
};
