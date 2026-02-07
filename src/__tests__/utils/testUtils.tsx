import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '@/lib/context/UserContext';
import { WorkspaceProvider } from '@/lib/context/WorkspaceContext';
import { ToolsProvider } from '@/lib/context/ToolsContext';

/**
 * Custom render function that wraps components with all necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <UserProvider>
          <WorkspaceProvider>
            <ToolsProvider>{children}</ToolsProvider>
          </WorkspaceProvider>
        </UserProvider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Re-export everything from testing-library
 */
export * from '@testing-library/react';
export { renderWithProviders as render };
