import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase credentials not found. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.'
  );
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Helper functions for common operations

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in a user
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current session
 */
export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

// Database helpers

/**
 * Fetch data from a table
 */
export async function fetchData<T>(
  table: string,
  query?: {
    select?: string;
    filter?: Record<string, unknown>;
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
  }
) {
  let queryBuilder = supabase.from(table).select(query?.select || '*');

  if (query?.filter) {
    Object.entries(query.filter).forEach(([key, value]) => {
      queryBuilder = queryBuilder.eq(key, value);
    });
  }

  if (query?.orderBy) {
    queryBuilder = queryBuilder.order(query.orderBy.column, {
      ascending: query.orderBy.ascending ?? true,
    });
  }

  if (query?.limit) {
    queryBuilder = queryBuilder.limit(query.limit);
  }

  const { data, error } = await queryBuilder;

  if (error) throw error;
  return data as T[];
}

/**
 * Insert data into a table
 */
export async function insertData<T>(table: string, data: T | T[]) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select();

  if (error) throw error;
  return result;
}

/**
 * Update data in a table
 */
export async function updateData<T>(
  table: string,
  id: string,
  data: Partial<T>
) {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select();

  if (error) throw error;
  return result;
}

/**
 * Delete data from a table
 */
export async function deleteData(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);

  if (error) throw error;
}

/**
 * Subscribe to real-time changes
 */
export function subscribeToTable(
  table: string,
  callback: (payload: unknown) => void
) {
  return supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
}

export default supabase;
