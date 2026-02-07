import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import {
  Home,
  Wrench,
  FileText,
  BarChart3,
  Briefcase,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Tools', href: '/dashboard/tools', icon: Wrench },
  { name: 'Knowledge Base', href: '/dashboard/knowledge', icon: FileText },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Workspaces', href: '/dashboard/workspaces', icon: Briefcase },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  {
    name: 'Admin',
    href: '/dashboard/admin',
    icon: Shield,
    roles: ['SYSTEM_ADMIN', 'ORG_OWNER'],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { user } = useUser();

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside
      className={`
        bg-gray-900 text-white transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-16'}
        relative
      `}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
              O
            </div>
            <span className="font-bold text-lg">OrdoAgentForge</span>
          </div>
        )}
        {!isOpen && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold mx-auto">
            O
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
                ${!isOpen ? 'justify-center' : ''}
              `}
              title={!isOpen ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 bg-gray-900 border border-gray-700 rounded-full p-1 hover:bg-gray-800 transition-colors"
        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Version Info */}
      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-800">
          <div className="text-xs text-gray-400">Version 1.0.0</div>
        </div>
      )}
    </aside>
  );
};
