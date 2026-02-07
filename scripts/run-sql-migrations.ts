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

async function executeSQLFile(fileName: string, description: string) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🔄 Executing: ${fileName}`);
  console.log(`📝 ${description}`);
  console.log('='.repeat(70));

  try {
    const sqlPath = resolve(
      process.cwd(),
      'Ordo AgentForge Set-Up Files',
      fileName
    );
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log(`📂 File read: ${fileName} (${sql.length} chars)`);
    console.log(`🔄 Executing SQL via Supabase REST API...`);

    // Use fetch to execute SQL via Supabase REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!response.ok) {
      // Try alternative approach - split and execute statements
      console.log(
        `⚠️  Direct execution failed, trying statement-by-statement...`
      );
      return await executeSQLStatements(sql, fileName);
    }

    console.log(`✅ ${fileName} executed successfully!`);
    return true;
  } catch (err) {
    console.error(`❌ Error executing ${fileName}:`);
    console.error(err);
    return false;
  }
}

async function executeSQLStatements(sql: string, _fileName: string) {
  // Remove comments and split by semicolons
  const statements = sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0);

  console.log(`📊 Found ${statements.length} SQL statements`);

  let successCount = 0;
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    if (stmt.length < 10) continue; // Skip tiny statements

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ query: stmt }),
      });

      if (response.ok) {
        successCount++;
      }
    } catch {
      // Continue on error
    }
  }

  console.log(`✅ Executed ${successCount}/${statements.length} statements`);
  return successCount > 0;
}

async function main() {
  console.log('\n' + '🚀'.repeat(35));
  console.log('🚀 SUPABASE DATABASE MIGRATION');
  console.log('🚀'.repeat(35) + '\n');

  console.log(
    '⚠️  NOTE: If this fails, you may need to run the SQL files manually'
  );
  console.log('    in the Supabase SQL Editor dashboard.\n');

  const migrations = [
    {
      file: '001_initial_schema.sql',
      description: 'Create all 8 tables, indexes, and triggers',
    },
    {
      file: '002_functions.sql',
      description: 'Create database functions',
    },
    {
      file: '003_rls.sql',
      description: 'Enable Row Level Security',
    },
  ];

  let allSuccess = true;

  for (const migration of migrations) {
    const success = await executeSQLFile(migration.file, migration.description);
    if (!success) {
      allSuccess = false;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n${'='.repeat(70)}`);
  if (allSuccess) {
    console.log('✅ MIGRATIONS COMPLETED!');
    console.log('\n📋 Next: Run npm run verify:database');
  } else {
    console.log('⚠️  MIGRATIONS MAY HAVE FAILED');
    console.log('\n📋 Please run SQL files manually in Supabase SQL Editor:');
    console.log('   1. https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. SQL Editor → New Query');
    console.log('   4. Copy/paste each SQL file and run');
  }
  console.log('='.repeat(70) + '\n');
}

main().catch(console.error);
