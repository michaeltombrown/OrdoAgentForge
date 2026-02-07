import { describe, it, expect } from 'vitest';
import App from './App';

// Using global Clerk mock from setup.ts - no need to mock here

describe('App', () => {
  it('should be defined', () => {
    // Simple smoke test - just verify the component exists
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });

  it('should export a valid React component', () => {
    // Verify it's a function that can be used as a component
    expect(App).toBeInstanceOf(Function);
    const element = App();
    expect(element).toBeDefined();
  });
});
