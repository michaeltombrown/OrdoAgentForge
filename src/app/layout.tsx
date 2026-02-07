import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { UserProvider } from '@/lib/context/UserContext';
import { WorkspaceProvider } from '@/lib/context/WorkspaceContext';
import { ToolsProvider } from '@/lib/context/ToolsContext';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <UserProvider>
      <WorkspaceProvider>
        <ToolsProvider>
          <div className="min-h-screen bg-background">{children}</div>
          <Toaster />
        </ToolsProvider>
      </WorkspaceProvider>
    </UserProvider>
  );
};
