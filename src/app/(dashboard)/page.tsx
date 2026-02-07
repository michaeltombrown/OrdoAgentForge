import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { ToolFilters } from '@/components/tools/ToolFilters';
import { useTools } from '@/hooks/useTools';
import { Tool } from '@/types/database';
import { Wrench } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { tools, loading, error, fetchTools } = useTools();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Fetch tools on mount
  useEffect(() => {
    fetchTools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter tools based on search and filters (computed value, no effect needed)
  const filteredTools = React.useMemo(() => {
    let result = [...tools];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          (tool.description?.toLowerCase() || '').includes(query)
      );
    }

    // Category filter (not implemented yet)
    if (selectedCategory) {
      // TODO: Add category field to Tool type when available
    }

    // Type filter
    if (selectedType) {
      result = result.filter((tool) => tool.type === selectedType);
    }

    return result;
  }, [tools, searchQuery, selectedCategory, selectedType]);

  // Get unique categories from tools
  const categories: string[] = [];
  // TODO: Implement categories when category field is added to Tool type

  const handleToolClick = (tool: Tool) => {
    navigate(`/tools/${tool.id}`);
  };

  const handleToolExecute = (tool: Tool) => {
    navigate(`/tools/${tool.id}?execute=true`);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Wrench className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Failed to load tools
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchTools}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tools Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Access and execute AI-powered tools for your workflows
        </p>
      </div>

      {/* Filters */}
      <ToolFilters
        onSearch={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onTypeChange={setSelectedType}
        categories={categories}
      />

      {/* Tools Grid */}
      <ToolGrid
        tools={filteredTools}
        onExecute={handleToolExecute}
        onClick={handleToolClick}
        loading={loading}
        emptyMessage={
          searchQuery || selectedCategory || selectedType
            ? 'No tools match your filters'
            : 'No tools available'
        }
      />
    </div>
  );
};
