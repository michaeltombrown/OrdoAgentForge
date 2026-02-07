# 🚀 Phase 2 & Startup Guide - Database Migrations & Development Servers

## Current Status

✅ Phase 1: Project Initialization - COMPLETE  
✅ Phase 3: Environment Configuration - COMPLETE (all credentials added)  
⏳ Phase 2: Database Setup - IN PROGRESS  
⏳ Development Servers - READY TO START

---

## STEP 1: Run Database Migrations (Phase 2) - 10 minutes

### Migration Files Ready:

```
✅ supabase/migrations/001_initial_schema.sql (237 lines)
✅ supabase/migrations/002_functions.sql
✅ supabase/migrations/003_rls.sql
```

### How to Run Migrations:

#### Option A: Using Supabase Dashboard (Recommended)

1. **Open Supabase SQL Editor:**

   ```
   https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs/sql/new
   ```

2. **Run Migration 1 - Initial Schema:**

   ```bash
   # Copy contents of this file:
   cat supabase/migrations/001_initial_schema.sql
   ```

   - Paste into Supabase SQL Editor
   - Click **"Run"** button
   - Should see: **"Success. No rows returned"**

   **Creates:**
   - ✅ 8 tables (organizations, users, workspaces, workspace_members, tools, tool_access, documents, usage_analytics)
   - ✅ All indexes
   - ✅ All triggers

3. **Run Migration 2 - Database Functions:**

   ```bash
   # Copy contents of this file:
   cat supabase/migrations/002_functions.sql
   ```

   - Paste into Supabase SQL Editor
   - Click **"Run"** button
   - Should see: **"Success"** with function creation notices

   **Creates:**
   - ✅ get_user_tools() function
   - ✅ check_tool_access() function
   - ✅ Helper functions

4. **Run Migration 3 - Row Level Security:**

   ```bash
   # Copy contents of this file:
   cat supabase/migrations/003_rls.sql
   ```

   - Paste into Supabase SQL Editor
   - Click **"Run"** button
   - Should see: **"Success"**

   **Creates:**
   - ✅ RLS policies for all tables
   - ✅ Security rules for multi-tenancy

#### Option B: Using Supabase CLI (Advanced)

```bash
# If you have Supabase CLI installed
supabase db push
```

### Verify Migrations:

After running all migrations, verify in Supabase Dashboard:

**Check Tables:**

```
https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs/editor
```

Should see 8 tables:

- ✅ organizations
- ✅ users
- ✅ workspaces
- ✅ workspace_members
- ✅ tools
- ✅ tool_access
- ✅ documents
- ✅ usage_analytics

**Check Functions:**
Run this in SQL Editor:

```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('get_user_tools', 'check_tool_access');
```

Should return 2 functions.

**Check RLS:**
Go to Table Editor → Select any table → Click "RLS" tab
Should show: ✅ RLS enabled with policies

---

## STEP 2: Create Storage Bucket (Phase 2.5) - 2 minutes

### Create Documents Bucket:

1. **Open Supabase Storage:**

   ```
   https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs/storage/buckets
   ```

2. **Create New Bucket:**
   - Click **"New bucket"**
   - Name: `documents`
   - Public: **No** (private)
   - Click **"Create bucket"**

3. **Add Policies:**

   Go to bucket → Policies → Add these:

   **Policy 1: Authenticated Upload**

   ```sql
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'documents');
   ```

   **Policy 2: Organization Read**

   ```sql
   CREATE POLICY "Users can read org documents"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (bucket_id = 'documents');
   ```

---

## STEP 3: Start Development Servers - 2 minutes

### Prerequisites:

✅ .env file complete (14/14 variables)
✅ Database migrations run
✅ Node modules installed

### Start Both Servers:

```bash
bash scripts/start-dev.sh
```

This will start:

- 🔧 **Backend API:** http://localhost:3001
- 🎨 **Frontend:** http://localhost:5173

### What You'll See:

```
==========================================
Starting Development Servers
==========================================

✅ Environment configured

Starting servers...
  📊 Backend API: http://localhost:3001
  🎨 Frontend:    http://localhost:5173

Press Ctrl+C to stop both servers
==========================================

> ordoagentforge@1.0.0 dev
> concurrently "npm run dev:server" "npm run dev:client"

[0] > ordoagentforge@1.0.0 dev:server
[0] > tsx watch src/server/index.ts
[1] > ordoagentforge@1.0.0 dev:client
[1] > vite

[0] Server running on http://localhost:3001
[1] VITE v5.x.x ready in 1234 ms
[1] ➜  Local:   http://localhost:5173/
```

### Alternative: Start Separately

**Backend only:**

```bash
npm run dev:server
```

**Frontend only:**

```bash
npm run dev:client
```

---

## STEP 4: Verify Application - 5 minutes

### Check Backend Health:

```bash
curl http://localhost:3001/health
```

**Expected Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-02-06T...",
  "uptime": 1.234
}
```

### Check Frontend:

Open browser to: http://localhost:5173

**Expected:**

- ✅ Clerk sign-in page loads
- ✅ Sign-up button visible
- ✅ No console errors

### Test Supabase Connection:

```bash
curl http://localhost:3001/api/tools
```

**Expected:**

- Returns empty array `[]` or authentication error (normal)
- No database connection errors

---

## STEP 5: Test Authentication Flow - 5 minutes

### Create Test User:

1. **Open Frontend:** http://localhost:5173
2. **Click "Sign Up"**
3. **Enter test credentials:**
   - Email: test@example.com
   - Password: TestPassword123!
4. **Complete sign-up**

### Verify Webhook Executed:

Check Supabase database:

```sql
-- Should see new user
SELECT * FROM users ORDER BY created_at DESC LIMIT 1;

-- Should see new organization
SELECT * FROM organizations ORDER BY created_at DESC LIMIT 1;
```

### Check Clerk Dashboard:

```
https://dashboard.clerk.com → Webhooks
```

- Should show recent webhook delivery
- Status: 200 OK

---

## TROUBLESHOOTING

### Issue: "Cannot connect to database"

**Solution:**

- Verify SUPABASE_URL in .env is correct
- Check Supabase project is active
- Verify service role key is correct

### Issue: "Port 3001 already in use"

**Solution:**

```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change PORT in .env
```

### Issue: "Clerk authentication failed"

**Solution:**

- Verify CLERK_SECRET_KEY and VITE_CLERK_PUBLISHABLE_KEY
- Check keys match your Clerk application
- Ensure using correct environment (test vs live)

### Issue: "Webhook not working"

**Solution:**

- For local development, use ngrok or Clerk's testing feature
- Verify CLERK_WEBHOOK_SECRET matches Clerk dashboard
- Check webhook endpoint is accessible

### Issue: "Module not found"

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## QUICK COMMANDS REFERENCE

```bash
# Check environment variables
bash scripts/verify-env.sh

# Install dependencies
npm install

# Start both servers
bash scripts/start-dev.sh

# Start backend only
npm run dev:server

# Start frontend only
npm run dev:client

# Run TypeScript check
npx tsc --noEmit

# Run linter
npm run lint

# Check server health
curl http://localhost:3001/health
```

---

## NEXT STEPS AFTER SERVERS START

1. ✅ Test user sign-up and authentication
2. ✅ Verify webhook creates database records
3. ✅ Test dashboard access (Phase 6)
4. ✅ Test tool access system (Phase 7)
5. ✅ Run integration tests (PHASE_7_TESTING_GUIDE.md)
6. ✅ Deploy to Vercel (Phase 8)

---

## FILES TO REFERENCE

- **Database Migrations:** `supabase/migrations/*.sql`
- **Start Script:** `scripts/start-dev.sh`
- **Testing Guide:** `PHASE_7_TESTING_GUIDE.md`
- **Environment Verification:** `scripts/verify-env.sh`
- **Build Instructions:** `BUILD_INSTRUCTIONS.md` (Phase 2, 6, 7, 8)

---

## PHASE COMPLETION CHECKLIST

### Phase 2: Database Setup

- [ ] Run 001_initial_schema.sql (8 tables)
- [ ] Run 002_functions.sql (2 functions)
- [ ] Run 003_rls.sql (RLS policies)
- [ ] Create 'documents' storage bucket
- [ ] Verify all tables exist
- [ ] Verify functions exist
- [ ] Verify RLS enabled

### Phase 6 & 7: Start & Test

- [ ] Start development servers
- [ ] Backend responds on :3001
- [ ] Frontend loads on :5173
- [ ] Create test user via Clerk
- [ ] Verify webhook creates DB records
- [ ] Test dashboard access
- [ ] Test tool access

---

**Status:** Ready to execute  
**Estimated Time:** 20 minutes total  
**Difficulty:** Easy (copy & paste SQL, run commands)

**Let's get started! 🚀**
