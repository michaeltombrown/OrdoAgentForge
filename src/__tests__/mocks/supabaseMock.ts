import { vi } from 'vitest';

/**
 * Mock Supabase client for testing
 */
export const supabaseMock = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    rangeGte: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  })),
  rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
  auth: {
    signIn: vi.fn().mockResolvedValue({ data: null, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: null, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    getSession: vi
      .fn()
      .mockResolvedValue({ data: { session: null }, error: null }),
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
  },
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: null, error: null }),
      download: vi.fn().mockResolvedValue({ data: null, error: null }),
      remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      list: vi.fn().mockResolvedValue({ data: [], error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: '' } }),
    })),
  },
};

/**
 * Mock Supabase module
 */
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => supabaseMock),
}));

/**
 * Mock server Supabase client
 */
vi.mock('@/server/lib/supabase/server', () => ({
  supabase: supabaseMock,
}));

/**
 * Mock client Supabase client
 */
vi.mock('@/lib/supabase/client', () => ({
  supabase: supabaseMock,
}));

/**
 * Helper to mock successful database responses
 */
export function mockSupabaseSuccess(data: unknown) {
  supabaseMock.from = vi.fn(() => ({
    ...supabaseMock.from(),
    single: vi.fn().mockResolvedValue({ data, error: null }),
  })) as typeof supabaseMock.from;
}

/**
 * Helper to mock database errors
 */
export function mockSupabaseError(error: Error) {
  supabaseMock.from = vi.fn(() => ({
    ...supabaseMock.from(),
    single: vi.fn().mockResolvedValue({ data: null, error }),
  })) as typeof supabaseMock.from;
}

/**
 * Helper to reset all Supabase mocks
 */
export function resetSupabaseMocks() {
  vi.clearAllMocks();
}
