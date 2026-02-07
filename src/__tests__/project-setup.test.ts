import { describe, it, expect } from 'vitest';
import { resolve } from 'path';
import { existsSync } from 'fs';

describe('Project Setup Verification', () => {
  it('should have all required config files', () => {
    const rootDir = resolve(__dirname, '../..');

    expect(existsSync(resolve(rootDir, 'package.json'))).toBe(true);
    expect(existsSync(resolve(rootDir, 'tsconfig.json'))).toBe(true);
    expect(existsSync(resolve(rootDir, 'vite.config.ts'))).toBe(true);
    expect(existsSync(resolve(rootDir, 'tailwind.config.js'))).toBe(true);
    expect(existsSync(resolve(rootDir, 'vitest.config.ts'))).toBe(true);
  });

  it('should have correct directory structure', () => {
    const srcDir = resolve(__dirname, '..');

    expect(existsSync(resolve(srcDir, 'server'))).toBe(true);
    expect(existsSync(resolve(srcDir, 'app'))).toBe(true);
    expect(existsSync(resolve(srcDir, 'components'))).toBe(true);
    expect(existsSync(resolve(srcDir, 'types'))).toBe(true);
    expect(existsSync(resolve(srcDir, 'hooks'))).toBe(true);
    expect(existsSync(resolve(srcDir, 'lib'))).toBe(true);
  });

  it('should have test infrastructure files', () => {
    const testDir = resolve(__dirname);

    expect(existsSync(resolve(testDir, 'setup.ts'))).toBe(true);
    expect(existsSync(resolve(testDir, 'utils/testUtils.tsx'))).toBe(true);
    expect(existsSync(resolve(testDir, 'mocks/supabaseMock.ts'))).toBe(true);
    expect(existsSync(resolve(testDir, 'mocks/clerkMock.ts'))).toBe(true);
    expect(existsSync(resolve(testDir, 'mocks/apiMocks.ts'))).toBe(true);
  });

  it('should have environment variables configured', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.VITE_SUPABASE_URL).toBeDefined();
    expect(process.env.VITE_CLERK_PUBLISHABLE_KEY).toBeDefined();
  });
});
