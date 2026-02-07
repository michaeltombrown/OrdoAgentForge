import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tool } from '@/types/database';
import { ExternalLink, Wrench } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  onExecute?: (tool: Tool) => void;
  onClick?: (tool: Tool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onExecute,
  onClick,
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(tool);
    }
  };

  const handleExecuteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExecute) {
      onExecute(tool);
    }
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {tool.icon ? (
              <div className="text-3xl">{tool.icon}</div>
            ) : (
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={tool.type === 'internal' ? 'default' : 'secondary'}
                >
                  {tool.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 line-clamp-2">
          {tool.description || 'No description available'}
        </CardDescription>
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {tool.type === 'iframe' && tool.url && (
              <div className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                <span>External Tool</span>
              </div>
            )}
          </div>
          <Button size="sm" onClick={handleExecuteClick}>
            Execute
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
