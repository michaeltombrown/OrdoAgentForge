import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  console.log('🔍 Verifying Supabase Database Setup...\n');

  const requiredTables = [
    'users',
    'organizations',
    'workspaces',
    'workspace_members',
    'tools',
    'tool_access',
    'documents',
    'usage_analytics',
  ];

  let allTablesExist = true;

  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);

      if (error) {
        console.log(`❌ Table "${table}" - ERROR: ${error.message}`);
        allTablesExist = false;
      } else {
        console.log(`✅ Table "${table}" - EXISTS`);
      }
    } catch (err) {
      console.log(`❌ Table "${table}" - ERROR: ${err}`);
      allTablesExist = false;
    }
  }

  console.log('\n' + '='.repeat(50));

  if (allTablesExist) {
    console.log('✅ ALL TABLES VERIFIED - Database is ready!');
    console.log('\n📋 Next Step: Start Phase 2 (Project Structure Setup)');
  } else {
    console.log('❌ MISSING TABLES - Database setup incomplete!');
    console.log('\n📋 Action Required:');
    console.log('1. Open Supabase SQL Editor');
    console.log('2. Run "Ordo AgentForge Set-Up Files/001_initial_schema.sql"');
    console.log('3. Run "Ordo AgentForge Set-Up Files/002_functions.sql"');
    console.log('4. Run "Ordo AgentForge Set-Up Files/003_rls.sql"');
    console.log('5. Create Storage bucket "documents"');
    console.log('6. Re-run this verification script');
  }

  console.log('='.repeat(50) + '\n');
}

verifyDatabase().catch(console.error);
