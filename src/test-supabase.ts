import { supabase } from './lib/supabase';

/**
 * Test Supabase connection
 * Run this to verify your Supabase is properly configured
 */
export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...');

  try {
    // Test 1: Check if client is configured
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    console.log('✅ Supabase client initialized');

    // Test 2: Test connection with a simple query
    const { data, error } = await supabase
      .from('_test')
      .select('*')
      .limit(1);

    if (error && error.message.includes('relation "_test" does not exist')) {
      // This is expected - the table doesn't exist yet, but connection works!
      console.log('✅ Supabase connection successful!');
      console.log('ℹ️  No tables created yet - that\'s normal');
      return { success: true, message: 'Connection successful!' };
    }

    if (error) {
      throw error;
    }

    console.log('✅ Supabase connection successful!');
    console.log('📊 Data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Auto-run test in development
if (import.meta.env.DEV) {
  testSupabaseConnection().then((result) => {
    if (result.success) {
      console.log('🎉 Supabase is ready to use!');
    } else {
      console.error('⚠️  Supabase connection issue:', result.error);
    }
  });
}

export default testSupabaseConnection;
