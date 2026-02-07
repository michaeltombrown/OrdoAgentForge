import React, { useState } from 'react';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { ChevronDown, Check, Plus, Briefcase } from 'lucide-react';

export const WorkspaceSelector: React.FC = () => {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspaces();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      setIsOpen(false);
    }
  };

  if (!currentWorkspace && workspaces.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Briefcase className="w-4 h-4" />
        <span>No workspaces</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Current Workspace Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <Briefcase className="w-4 h-4 text-gray-600" />
        <span className="font-medium text-sm text-gray-900">
          {currentWorkspace?.name || 'Select Workspace'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-y-auto">
            {/* Workspace List */}
            <div className="py-2">
              {workspaces.length > 0 ? (
                workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => handleSelectWorkspace(workspace.id)}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {workspace.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {workspace.slug}
                      </div>
                    </div>
                    {currentWorkspace?.id === workspace.id && (
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No workspaces available
                </div>
              )}
            </div>

            {/* Create New Workspace */}
            <div className="border-t border-gray-200 py-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Open create workspace modal
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <Plus className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  Create Workspace
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
