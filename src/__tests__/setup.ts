import { afterEach, vi, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock Clerk BEFORE any imports that might use it
vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      'div',
      { 'data-testid': 'mock-clerk-provider' },
      children
    ),
  SignIn: () =>
    React.createElement('div', { 'data-testid': 'mock-sign-in' }, 'Sign In'),
  SignUp: () =>
    React.createElement('div', { 'data-testid': 'mock-sign-up' }, 'Sign Up'),
  UserButton: () =>
    React.createElement(
      'button',
      { 'data-testid': 'mock-user-button' },
      'User'
    ),
  useUser: vi.fn(() => ({
    isSignedIn: false,
    isLoaded: true,
    user: null,
  })),
  useAuth: vi.fn(() => ({
    isSignedIn: false,
    isLoaded: true,
    userId: null,
    sessionId: null,
    getToken: vi.fn().mockResolvedValue(null),
    signOut: vi.fn().mockResolvedValue(undefined),
  })),
  useClerk: vi.fn(() => ({
    client: null,
    session: null,
    user: null,
    openSignIn: vi.fn(),
    openSignUp: vi.fn(),
    closeSignIn: vi.fn(),
    closeSignUp: vi.fn(),
  })),
  RedirectToSignIn: () =>
    React.createElement('div', { 'data-testid': 'redirect-to-sign-in' }),
  useSignIn: vi.fn(() => ({
    isLoaded: true,
    signIn: null,
    setActive: vi.fn(),
  })),
  useSignUp: vi.fn(() => ({
    isLoaded: true,
    signUp: null,
    setActive: vi.fn(),
  })),
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock environment variables for testing
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.VITE_CLERK_PUBLISHABLE_KEY = 'pk_test_test';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.CLERK_SECRET_KEY = 'sk_test_test'; // Test key only, not a real Stripe key
process.env.CLERK_WEBHOOK_SECRET = 'whsec_test';
process.env.AIRIA_API_KEY = 'test-airia-key';
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.FRONTEND_URL = 'http://localhost:3000';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock global fetch to prevent actual API calls
global.fetch = vi.fn().mockImplementation((url: string) => {
  console.warn(`Unmocked fetch call to: ${url}`);
  return Promise.resolve({
    ok: false,
    status: 404,
    statusText: 'Not Found',
    json: () => Promise.resolve({ error: 'Not mocked' }),
    text: () => Promise.resolve(''),
    headers: new Headers(),
  } as Response);
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Suppress console errors in tests (unless you want to see them)
const originalError = console.error;
beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
