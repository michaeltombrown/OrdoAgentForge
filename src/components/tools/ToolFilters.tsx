import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface ToolFiltersProps {
  onSearch?: (query: string) => void;
  onCategoryChange?: (category: string | null) => void;
  onTypeChange?: (type: string | null) => void;
  categories?: string[];
}

export const ToolFilters: React.FC<ToolFiltersProps> = ({
  onSearch,
  onCategoryChange,
  onTypeChange,
  categories = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleCategoryChange = (value: string) => {
    const category = value === 'all' ? null : value;
    setSelectedCategory(category);
    onCategoryChange?.(category);
  };

  const handleTypeChange = (value: string) => {
    const type = value === 'all' ? null : value;
    setSelectedType(type);
    onTypeChange?.(type);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedType(null);
    onSearch?.('');
    onCategoryChange?.(null);
    onTypeChange?.(null);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedType;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <Select
            value={selectedCategory || 'all'}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Type Filter */}
        <Select value={selectedType || 'all'} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="iframe">External</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={clearFilters}
            title="Clear filters"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
          {searchQuery && (
            <Badge variant="secondary">
              Search: {searchQuery}
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSearch?.('');
                }}
                className="ml-1 hover:text-gray-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary">
              Category: {selectedCategory}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  onCategoryChange?.(null);
                }}
                className="ml-1 hover:text-gray-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedType && (
            <Badge variant="secondary">
              Type: {selectedType}
              <button
                onClick={() => {
                  setSelectedType(null);
                  onTypeChange?.(null);
                }}
                className="ml-1 hover:text-gray-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
