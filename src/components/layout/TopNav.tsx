import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { WorkspaceSelector } from './WorkspaceSelector';
import { useUser } from '../../hooks/useUser';
import { Menu, Bell, Search } from 'lucide-react';

interface TopNavProps {
  onMenuClick: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuClick }) => {
  const { user } = useUser();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <WorkspaceSelector />
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tools, documents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className="p-2 rounded-md hover:bg-gray-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Info */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {user.role.toLowerCase().replace('_', ' ')}
                </div>
              </div>
            </div>
          )}

          {/* Clerk User Button */}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};
