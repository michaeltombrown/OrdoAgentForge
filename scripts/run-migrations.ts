import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function runMigration(fileName: string, description: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔄 Running: ${fileName}`);
  console.log(`📝 ${description}`);
  console.log('='.repeat(60));

  try {
    const sqlPath = resolve(
      process.cwd(),
      'Ordo AgentForge Set-Up Files',
      fileName
    );
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log(`📂 Reading file: ${fileName}`);
    console.log(`📊 SQL length: ${sql.length} characters`);

    // Execute SQL using Supabase RPC
    const { error } = await supabase.rpc('exec_sql', { sql_string: sql });

    if (error) {
      console.error(`❌ Error executing ${fileName}:`);
      console.error(error);
      return false;
    }

    console.log(`✅ ${fileName} executed successfully!`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to read or execute ${fileName}:`);
    console.error(err);
    return false;
  }
}

async function runAllMigrations() {
  console.log('\n' + '🚀'.repeat(30));
  console.log('🚀 SUPABASE DATABASE MIGRATION');
  console.log('🚀'.repeat(30) + '\n');

  const migrations = [
    {
      file: '001_initial_schema.sql',
      description: 'Create all 8 tables, indexes, and triggers',
    },
    {
      file: '002_functions.sql',
      description: 'Create database functions for tool access',
    },
    {
      file: '003_rls.sql',
      description: 'Enable Row Level Security policies',
    },
  ];

  let allSuccess = true;

  for (const migration of migrations) {
    const success = await runMigration(migration.file, migration.description);
    if (!success) {
      allSuccess = false;
      console.log(`\n⛔ Migration stopped at ${migration.file}`);
      break;
    }
    // Wait a bit between migrations
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n${'='.repeat(60)}`);
  if (allSuccess) {
    console.log('✅ ALL MIGRATIONS COMPLETED SUCCESSFULLY!');
    console.log('✅ Database is ready for application development');
    console.log('\n📋 Next steps:');
    console.log('   1. Run: npm run verify:database');
    console.log(
      '   2. Create Storage bucket "documents" in Supabase dashboard'
    );
    console.log('   3. Start building the application!');
  } else {
    console.log('❌ MIGRATIONS FAILED');
    console.log('📋 Please check errors above and try again');
  }
  console.log('='.repeat(60) + '\n');
}

runAllMigrations().catch((err) => {
  console.error('❌ Fatal error running migrations:', err);
  process.exit(1);
});
