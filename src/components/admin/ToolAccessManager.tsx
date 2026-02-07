import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Shield, Trash2 } from 'lucide-react';
import { Tool } from '@/types/database';

interface ToolAccess {
  id: string;
  tool_id: string;
  tool_name: string;
  scope: 'organization' | 'workspace' | 'user';
  scope_id: string;
  scope_name: string;
  granted_at: string;
}

interface ToolAccessManagerProps {
  tools: Tool[];
  currentAccess: ToolAccess[];
  onGrant?: (data: {
    tool_id: string;
    scope: string;
    scope_id: string;
  }) => Promise<void>;
  onRevoke?: (accessId: string) => Promise<void>;
  loading?: boolean;
}

export const ToolAccessManager: React.FC<ToolAccessManagerProps> = ({
  tools,
  currentAccess,
  onGrant,
  onRevoke,
  loading = false,
}) => {
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [selectedScope, setSelectedScope] = useState<string>('organization');
  const [granting, setGranting] = useState(false);

  const handleGrant = async () => {
    if (!selectedTool || !onGrant) return;

    setGranting(true);
    try {
      await onGrant({
        tool_id: selectedTool,
        scope: selectedScope,
        scope_id: 'placeholder', // TODO: Get actual scope ID
      });
      setSelectedTool('');
    } catch (error) {
      console.error('Failed to grant access:', error);
    } finally {
      setGranting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Grant Tool Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a tool" />
              </SelectTrigger>
              <SelectContent>
                {tools.map((tool) => (
                  <SelectItem key={tool.id} value={tool.id}>
                    {tool.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedScope} onValueChange={setSelectedScope}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="workspace">Workspace</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleGrant} disabled={!selectedTool || granting}>
              {granting ? 'Granting...' : 'Grant Access'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Access</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading access data...
            </div>
          ) : currentAccess.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tool access granted yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Granted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAccess.map((access) => (
                  <TableRow key={access.id}>
                    <TableCell className="font-medium">
                      {access.tool_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{access.scope}</Badge>
                    </TableCell>
                    <TableCell>{access.scope_name}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(access.granted_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRevoke?.(access.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
