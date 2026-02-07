import { useContext } from 'react';
import {
  ToolsContext,
  type ToolsContextType,
} from '../lib/context/ToolsContext';

export function useTools(): ToolsContextType {
  const context = useContext(ToolsContext);

  if (context === undefined) {
    throw new Error('useTools must be used within a ToolsProvider');
  }

  return context;
}
