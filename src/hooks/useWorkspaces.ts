import { useContext } from 'react';
import {
  WorkspaceContext,
  type WorkspaceContextType,
} from '../lib/context/WorkspaceContext';

export function useWorkspaces(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);

  if (context === undefined) {
    throw new Error('useWorkspaces must be used within a WorkspaceProvider');
  }

  return context;
}
