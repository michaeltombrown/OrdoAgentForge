import React from 'react';
import { Tool } from '@/types/database';
import { ToolCard } from './ToolCard';

interface ToolGridProps {
  tools: Tool[];
  onExecute?: (tool: Tool) => void;
  onClick?: (tool: Tool) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  tools,
  onExecute,
  onClick,
  loading = false,
  emptyMessage = 'No tools available',
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {emptyMessage}
        </h3>
        <p className="text-sm text-gray-500">
          Contact your administrator to get access to tools
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          onExecute={onExecute}
          onClick={onClick}
        />
      ))}
    </div>
  );
};
