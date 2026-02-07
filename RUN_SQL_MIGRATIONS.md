# 🚀 RUN SQL MIGRATIONS NOW - Step-by-Step Guide

## ⚠️ IMPORTANT: Manual Execution Required

Supabase SQL migrations must be run through the **Supabase SQL Editor** in your dashboard because they require admin-level database privileges.

---

## 📋 Quick Start (3 Steps)

### 1. Open Supabase SQL Editor

- Go to: https://supabase.com/dashboard
- Select project: `ydebgchglotcdjfegbhs`
- Click "SQL Editor" in left sidebar

### 2. Run Each SQL File

- Click "New Query"
- Copy the SQL from the sections below
- Paste into editor
- Click "RUN"
- Wait for success message

### 3. Verify

```bash
npm run verify:database
```

---

## 📁 SQL Files to Run (IN ORDER)

### ✅ MIGRATION 1: 001_initial_schema.sql

**What it does:** Creates all 8 database tables, indexes, and triggers

**Location:** `Ordo AgentForge Set-Up Files/001_initial_schema.sql`

**File size:** 8.4K

**Steps:**

1. Open the file in your editor or use the command:

   ```bash
   cat "Ordo AgentForge Set-Up Files/001_initial_schema.sql" | pbcopy
   ```

   _(This copies the entire file to your clipboard on Mac)_

2. In Supabase SQL Editor → New Query → Paste → RUN

3. Wait for success message: "SUCCESS: All 8 tables created successfully"

**Expected Result:**

- ✅ organizations table created
- ✅ users table created
- ✅ workspaces table created
- ✅ workspace_members table created
- ✅ tools table created
- ✅ tool_access table created
- ✅ documents table created
- ✅ usage_analytics table created

---

### ✅ MIGRATION 2: 002_functions.sql

**What it does:** Creates database functions for tool access control

**Location:** `Ordo AgentForge Set-Up Files/002_functions.sql`

**File size:** 4.3K

**Steps:**

1. Copy the file:

   ```bash
   cat "Ordo AgentForge Set-Up Files/002_functions.sql" | pbcopy
   ```

2. In Supabase SQL Editor → New Query → Paste → RUN

3. Wait for success message

**Expected Result:**

- ✅ `get_user_tools()` function created
- ✅ `check_tool_access()` function created

---

### ✅ MIGRATION 3: 003_rls.sql

**What it does:** Enables Row Level Security policies on all tables

**Location:** `Ordo AgentForge Set-Up Files/003_rls.sql`

**File size:** 10K

**Steps:**

1. Copy the file:

   ```bash
   cat "Ordo AgentForge Set-Up Files/003_rls.sql" | pbcopy
   ```

2. In Supabase SQL Editor → New Query → Paste → RUN

3. Wait for success message

**Expected Result:**

- ✅ RLS enabled on all tables
- ✅ Security policies created for all user roles

---

## 🪣 BONUS STEP: Create Storage Bucket

After running all 3 SQL files:

1. Click "Storage" in Supabase sidebar
2. Click "Create a new bucket"
3. Name: `documents`
4. Public: **NO** (leave unchecked)
5. Click "Create bucket"

---

## ✅ Verification

After completing all migrations, run:

```bash
npm run verify:database
```

**Expected Output:**

```
✅ Table "users" - EXISTS
✅ Table "organizations" - EXISTS
✅ Table "workspaces" - EXISTS
✅ Table "workspace_members" - EXISTS
✅ Table "tools" - EXISTS
✅ Table "tool_access" - EXISTS
✅ Table "documents" - EXISTS
✅ Table "usage_analytics" - EXISTS

✅ ALL TABLES VERIFIED - Database is ready!
```

---

## 🚨 Troubleshooting

### Issue: "Permission denied" error

**Solution:** Make sure you're using the Service Role Key, not the Anon Key

### Issue: "Table already exists" error

**Solution:** Tables already created! Skip to next migration or verification

### Issue: "Syntax error" error

**Solution:** Make sure you copied the ENTIRE file contents

### Issue: Function not showing up

**Solution:** Re-run 002_functions.sql and check for any error messages

---

## ⏱️ Time Required

- Migration 1: ~10 seconds
- Migration 2: ~5 seconds
- Migration 3: ~15 seconds
- Storage bucket: ~30 seconds
- Verification: ~5 seconds

**Total: ~1 minute**

---

## 🎯 After Completion

Once verification passes, I will:

1. ✅ Build complete backend API
2. ✅ Create all controllers and middleware
3. ✅ Build frontend dashboard
4. ✅ Implement role-based access control
5. ✅ Set up analytics dashboards
6. ✅ Test all functionality
7. ✅ Deploy to production

**Estimated build time:** 7 hours

---

## 📝 Ready to Start?

**Option 1: Copy Files Manually**

1. Open each SQL file
2. Copy contents
3. Paste in Supabase SQL Editor
4. Run

**Option 2: Use Terminal (Mac)**

```bash
# Copy file 1 to clipboard
cat "Ordo AgentForge Set-Up Files/001_initial_schema.sql" | pbcopy

# Then paste in Supabase and run
# Repeat for files 2 and 3
```

**Option 3: Use the Interactive Guide**

```bash
bash scripts/migration-guide.sh
```

---

**Let me know when all 3 migrations are complete and I'll immediately start building the full application!** 🚀
