import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Clerk hooks
vi.mock('@clerk/clerk-react', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignInButton: ({ children }: { children?: React.ReactNode }) => (
    <button>{children || 'Sign In'}</button>
  ),
  SignUpButton: ({ children }: { children?: React.ReactNode }) => (
    <button>{children || 'Sign Up'}</button>
  ),
  UserButton: () => <button>User</button>,
  useUser: () => ({
    user: null,
    isLoaded: true,
  }),
}));

describe('App', () => {
  it('renders the title', () => {
    render(<App />);
    expect(screen.getByText('OrdoAgentForge')).toBeInTheDocument();
  });

  it('renders authentication buttons', () => {
    render(<App />);
    // Check for sign in buttons (there may be multiple)
    const signInButtons = screen.getAllByRole('button');
    expect(signInButtons.length).toBeGreaterThan(0);
  });

  it('renders integrations status', () => {
    render(<App />);
    expect(screen.getByText(/Integrations Status/i)).toBeInTheDocument();
  });
});
