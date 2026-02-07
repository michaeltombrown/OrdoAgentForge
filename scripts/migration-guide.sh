#!/bin/bash

# Database Migration Runner for OrdoAgentForge
# This script helps you run the SQL migrations in Supabase

echo ""
echo "🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀"
echo "🚀 SUPABASE DATABASE MIGRATION GUIDE"
echo "🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀"
echo ""
echo "This script will help you set up your Supabase database."
echo ""
echo "⚠️  IMPORTANT: You MUST run these SQL files in the Supabase SQL Editor"
echo "    because they require admin privileges that can't be done via API."
echo ""
echo "============================================================"
echo ""

# Check if files exist
SQL_DIR="Ordo AgentForge Set-Up Files"

if [ ! -d "$SQL_DIR" ]; then
    echo "❌ ERROR: Cannot find '$SQL_DIR' directory"
    exit 1
fi

echo "✅ Found SQL migration files"
echo ""

# Function to display migration info
show_migration() {
    local file=$1
    local num=$2
    local description=$3
    
    echo "=================================================="
    echo "MIGRATION $num: $file"
    echo "Description: $description"
    echo "=================================================="
    echo ""
    echo "📋 INSTRUCTIONS:"
    echo ""
    echo "1. Open Supabase Dashboard:"
    echo "   https://supabase.com/dashboard"
    echo ""
    echo "2. Select your project (ydebgchglotcdjfegbhs)"
    echo ""
    echo "3. Click 'SQL Editor' in the left sidebar"
    echo ""
    echo "4. Click 'New Query'"
    echo ""
    echo "5. Copy the SQL file content:"
    echo "   File location: $SQL_DIR/$file"
    echo ""
    
    # Ask if user wants to see the file
    read -p "   Would you like to open this file now? (y/n): " open_file
    
    if [ "$open_file" = "y" ]; then
        if command -v code &> /dev/null; then
            code "$SQL_DIR/$file"
            echo "   ✅ Opened in VS Code"
        elif command -v open &> /dev/null; then
            open "$SQL_DIR/$file"
            echo "   ✅ Opened file"
        else
            echo "   📂 File path: $(pwd)/$SQL_DIR/$file"
        fi
    fi
    
    echo ""
    echo "6. Copy the ENTIRE file contents"
    echo ""
    echo "7. Paste into Supabase SQL Editor"
    echo ""
    echo "8. Click 'RUN' button"
    echo ""
    echo "9. Wait for success message"
    echo ""
    
    read -p "Press ENTER when you've completed this migration..."
    echo ""
    echo "✅ Migration $num marked as complete"
    echo ""
}

# Run migrations in order
show_migration "001_initial_schema.sql" "1" "Create all 8 tables, indexes, and triggers"
show_migration "002_functions.sql" "2" "Create database functions for tool access"
show_migration "003_rls.sql" "3" "Enable Row Level Security policies"

# Storage bucket instructions
echo "=================================================="
echo "FINAL STEP: Create Storage Bucket"
echo "=================================================="
echo ""
echo "📋 INSTRUCTIONS:"
echo ""
echo "1. In Supabase Dashboard, click 'Storage' in left sidebar"
echo ""
echo "2. Click 'Create a new bucket'"
echo ""
echo "3. Bucket name: documents"
echo ""
echo "4. Public bucket: NO (leave unchecked)"
echo ""
echo "5. Click 'Create bucket'"
echo ""
echo "6. Click on the 'documents' bucket"
echo ""
echo "7. Click 'Policies' tab"
echo ""
echo "8. Add upload policy for authenticated users"
echo ""
read -p "Press ENTER when you've created the storage bucket..."
echo ""
echo "✅ Storage bucket created"
echo ""

# Verification
echo "=================================================="
echo "🔍 VERIFICATION"
echo "=================================================="
echo ""
echo "Now let's verify everything was set up correctly..."
echo ""

# Run verification script
if command -v npm &> /dev/null; then
    echo "Running: npm run verify:database"
    echo ""
    npm run verify:database
else
    echo "Running: npx tsx scripts/verify-database.ts"
    echo ""
    npx tsx scripts/verify-database.ts
fi

echo ""
echo "=================================================="
echo "🎉 MIGRATION PROCESS COMPLETE!"
echo "=================================================="
echo ""
echo "If verification passed, your database is ready!"
echo ""
echo "🚀 Next step: Start building the application"
echo ""

