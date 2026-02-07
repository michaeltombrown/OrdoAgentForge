import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, StopCircle } from 'lucide-react';

interface StreamingResponseProps {
  content: string;
  isStreaming: boolean;
  onCancel?: () => void;
  title?: string;
}

export const StreamingResponse: React.FC<StreamingResponseProps> = ({
  content,
  isStreaming,
  onCancel,
  title = 'Response',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as new content arrives
  useEffect(() => {
    if (contentRef.current && isStreaming) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content, isStreaming]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {isStreaming && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Streaming...</span>
            </div>
            {onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="text-red-600 hover:text-red-700"
              >
                <StopCircle className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div
          ref={contentRef}
          className="max-h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap"
        >
          {content || (
            <div className="text-gray-400 italic">Waiting for response...</div>
          )}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
