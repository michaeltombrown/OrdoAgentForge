import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { Briefcase, Plus, Users, Calendar } from 'lucide-react';

export const WorkspacesPage: React.FC = () => {
  const navigate = useNavigate();
  const { workspaces, currentWorkspace, loading, setCurrentWorkspace } =
    useWorkspaces();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
          <p className="text-gray-600 mt-1">
            Manage your workspaces and collaborate with team members
          </p>
        </div>
        <Button
          onClick={() => {
            /* TODO: Open create modal */
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Workspace
        </Button>
      </div>

      {/* Workspaces Grid */}
      {workspaces.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No workspaces
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Get started by creating your first workspace
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Workspace
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                currentWorkspace?.id === workspace.id
                  ? 'ring-2 ring-blue-600'
                  : ''
              }`}
              onClick={() => {
                setCurrentWorkspace(workspace);
                navigate(`/dashboard/workspaces/${workspace.id}`);
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {workspace.name}
                      </CardTitle>
                      {currentWorkspace?.id === workspace.id && (
                        <Badge variant="default" className="mt-1">
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Members: N/A</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDate(workspace.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
