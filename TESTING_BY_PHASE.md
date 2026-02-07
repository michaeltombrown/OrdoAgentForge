# Complete Phase-by-Phase Testing Guide

**Last Updated**: February 6, 2026  
**Purpose**: Test each phase as you build to catch issues early

---

## 🎯 Why Test Each Phase?

**DO NOT wait until the end!** Testing after each phase:

- ✅ Catches errors immediately when context is fresh
- ✅ Prevents cascading failures
- ✅ Makes debugging much easier
- ✅ Ensures dependencies work before building on them
- ✅ Saves hours of debugging later

---

## Phase 1: Project Initialization Testing

### What to Test

Basic project structure and dependencies

### Tests

#### 1.1: Directory Structure

```bash
# Run from project root
ls -la src/
ls -la src/app/
ls -la src/server/
ls -la supabase/migrations/
```

**Expected**: All directories exist

#### 1.2: Configuration Files

```bash
# Check files exist
ls -la package.json tsconfig.json vite.config.ts .env.example
```

**Expected**: All config files present

#### 1.3: Dependencies Installed

```bash
npm list --depth=0
```

**Expected**:

- ✅ No error messages
- ✅ All packages installed
- ✅ No peer dependency warnings

#### 1.4: TypeScript Configuration

```bash
npx tsc --version
npm run type-check
```

**Expected**:

- ✅ TypeScript version shown
- ✅ No compilation errors (may have warnings about missing files - that's OK)

### ✅ Phase 1 Complete When:

- [ ] All directories created
- [ ] All config files present
- [ ] `npm install` completes without errors
- [ ] TypeScript works

**Time**: ~5 minutes  
**If this fails**: Stop and fix before Phase 2

---

## Phase 2: Database Setup Testing

### What to Test

Supabase database schema and functions

### Prerequisites

- Supabase project created
- Supabase credentials available

### Tests

#### 2.1: Migration Files Created

```bash
# Check migration files exist
ls -la supabase/migrations/
cat supabase/migrations/001_initial_schema.sql | head -20
cat supabase/migrations/002_functions.sql | head -20
```

**Expected**:

- ✅ Both SQL files exist
- ✅ Files contain SQL statements

#### 2.2: Schema Migration

1. Open Supabase Dashboard → SQL Editor
2. Run `001_initial_schema.sql`
3. Check Table Editor

**Expected Tables**:

```
✅ users
✅ organizations
✅ workspaces
✅ workspace_members
✅ tools
✅ tool_access
✅ documents
✅ usage_analytics
```

#### 2.3: Functions Installed

```sql
-- Run in Supabase SQL Editor
SELECT proname FROM pg_proc WHERE proname IN ('get_user_tools', 'check_tool_access');
```

**Expected**:

```
 proname
-----------------
 get_user_tools
 check_tool_access
```

#### 2.4: Test Function

```sql
-- Create test user (will delete after)
INSERT INTO users (id, clerk_id, email, role)
VALUES (gen_random_uuid(), 'test_clerk_id', 'test@test.com', 'MEMBER')
RETURNING id;

-- Should return empty set (no tools yet)
SELECT * FROM get_user_tools('<paste-user-id-here>');
```

**Expected**: Query runs without errors (even if empty)

#### 2.5: Test Relationships

```sql
-- Check foreign key constraints work
INSERT INTO workspaces (id, name, slug, organization_id)
VALUES (gen_random_uuid(), 'Test', 'test', gen_random_uuid());
-- Should fail with foreign key constraint error
```

**Expected**: Error about foreign key constraint (this is GOOD - constraints work!)

#### 2.6: Clean Up Test Data

```sql
DELETE FROM users WHERE clerk_id = 'test_clerk_id';
```

### ✅ Phase 2 Complete When:

- [ ] All 8 tables exist in Supabase
- [ ] Both functions installed
- [ ] Foreign key constraints work
- [ ] Test queries run without errors

**Time**: ~15 minutes  
**If this fails**: Fix database before Phase 3

---

## Phase 3: TypeScript Types Testing

### What to Test

Type definitions compile and export correctly

### Tests

#### 3.1: Types File Created

```bash
cat src/types/database.ts | head -50
```

**Expected**: File exists with interface definitions

#### 3.2: Request Types Created

```bash
cat src/types/requests.ts | head -30
```

**Expected**: File exists with AuthRequest interface

#### 3.3: TypeScript Compilation

```bash
npm run type-check
```

**Expected**:

- ✅ No errors in `src/types/` files
- ⚠️ May have errors in other files (we haven't created them yet)

#### 3.4: Import Test

Create temporary test file:

```bash
cat > src/test-types.ts << 'EOF'
import { User, Organization, Tool } from './types/database';

const testUser: User = {
  id: '123',
  clerk_id: 'test',
  email: 'test@test.com',
  role: 'MEMBER',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

console.log('Types work!', testUser);
EOF

# Test it compiles
npx tsc src/test-types.ts --noEmit

# Clean up
rm src/test-types.ts
```

**Expected**: No compilation errors

### ✅ Phase 3 Complete When:

- [ ] `src/types/database.ts` created
- [ ] `src/types/requests.ts` created
- [ ] Types compile without errors
- [ ] Can import and use types

**Time**: ~5 minutes  
**If this fails**: Fix types before Phase 4

---

## Phase 4: Scripts Testing

### What to Test

Helper scripts work correctly

### Tests

#### 4.1: Scripts Created

```bash
ls -la scripts/
```

**Expected**:

- ✅ `bump-version.js`
- ✅ `verify-database.ts`
- ✅ Other scripts from Phase 7

#### 4.2: Version Bump Script

```bash
# Test patch version bump
node scripts/bump-version.js patch

# Check package.json was updated
grep '"version"' package.json
```

**Expected**: Version incremented (e.g., 1.0.0 → 1.0.1)

#### 4.3: Database Verification Script

```bash
# First, add credentials to .env
cp .env.example .env
# Edit .env with your Supabase credentials

# Run verification
npm run verify:database
```

**Expected**:

- ✅ Connects to Supabase
- ✅ Lists all 8 tables
- ✅ Shows functions
- ✅ No connection errors

### ✅ Phase 4 Complete When:

- [ ] All scripts created
- [ ] Version bump works
- [ ] Database verification works
- [ ] No runtime errors

**Time**: ~5 minutes  
**If this fails**: Fix scripts before Phase 5

---

## Phase 5: Backend Foundation Testing

### What to Test

Server starts, routes work, middleware functions

### Tests

#### 5.1: Supabase Server Client

```bash
cat src/server/lib/supabase/server.ts
```

**Expected**: File exists, exports `supabase` client

#### 5.2: Middleware Files Created

```bash
ls -la src/server/middleware/
```

**Expected**:

- ✅ authMiddleware.ts
- ✅ roleMiddleware.ts
- ✅ validationMiddleware.ts
- ✅ errorHandler.ts
- ✅ toolAccessMiddleware.ts
- ✅ clerkWebhookMiddleware.ts

#### 5.3: Controllers Created

```bash
ls -la src/server/controllers/
```

**Expected**: All 6 controllers present

#### 5.4: Schemas Created

```bash
ls -la src/server/schemas/
```

**Expected**: All validation schemas present

#### 5.5: TypeScript Compilation (Server)

```bash
npm run build:server
```

**Expected**:

- ✅ Compiles without errors
- ✅ Creates `dist/` directory
- ✅ All files transpiled

#### 5.6: Start Server Test

```bash
# Make sure .env is configured
npm run dev:server
```

**Expected**:

```
🚀 Server running on port 3001
📊 Environment: development
🔗 API URL: http://localhost:3001/api
```

Press Ctrl+C to stop, then test endpoints:

#### 5.7: Health Check Endpoint

```bash
# Start server in background
npm run dev:server &
sleep 3

# Test health endpoint
curl http://localhost:3001/health

# Expected response:
# {"status":"ok","timestamp":"...","uptime":...}

# Stop server
pkill -f "tsx watch"
```

#### 5.8: Test Protected Route (Should Fail)

```bash
npm run dev:server &
sleep 3

curl http://localhost:3001/api/auth/me

# Expected: 401 Unauthorized (correct - no token provided)

pkill -f "tsx watch"
```

### ✅ Phase 5 Complete When:

- [ ] All backend files created
- [ ] Server compiles without errors
- [ ] Server starts on port 3001
- [ ] Health endpoint responds
- [ ] Protected routes require auth
- [ ] No runtime errors

**Time**: ~10 minutes  
**If this fails**: Fix backend before Phase 6

---

## Phase 6: Frontend Foundation Testing

### What to Test

React app renders, Clerk provider works, routing works

### Tests

#### 6.1: Supabase Browser Client

```bash
cat src/lib/supabase/client.ts
```

**Expected**: File exists, exports browser client

#### 6.2: Context Providers Created

```bash
ls -la src/lib/context/
```

**Expected**:

- ✅ UserContext.tsx
- ✅ WorkspaceContext.tsx
- ✅ ToolsContext.tsx

#### 6.3: Hooks Created

```bash
ls -la src/hooks/
```

**Expected**: All custom hooks present

#### 6.4: Components Created

```bash
ls -la src/components/layout/
ls -la src/components/ui/
ls -la src/components/tools/
```

**Expected**: All component directories and files

#### 6.5: Pages Created

```bash
ls -la src/app/
ls -la src/app/\(dashboard\)/
```

**Expected**: All 10 pages present

#### 6.6: TypeScript Compilation (Client)

```bash
npm run type-check
```

**Expected**: ✅ No TypeScript errors

#### 6.7: Vite Build Test

```bash
npm run build:client
```

**Expected**:

- ✅ Build completes
- ✅ Creates `dist/` directory
- ✅ No build errors

#### 6.8: Start Frontend Test

```bash
# Configure .env first with Clerk keys
npm run dev:client
```

**Expected**:

```
VITE vX.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open browser to http://localhost:5173

**Expected**:

- ✅ Page loads (may show Clerk sign-in)
- ✅ No console errors
- ✅ Clerk provider initialized

Press Ctrl+C to stop

#### 6.9: Routing Test

```bash
npm run dev:client &
sleep 5

# Test different routes (should redirect to auth if not signed in)
curl -I http://localhost:5173/
curl -I http://localhost:5173/dashboard
curl -I http://localhost:5173/tools

pkill -f "vite"
```

**Expected**: 200 OK responses (or redirects - both OK)

### ✅ Phase 6 Complete When:

- [ ] All frontend files created
- [ ] Client compiles without errors
- [ ] Vite build succeeds
- [ ] Frontend starts on port 5173
- [ ] Page renders in browser
- [ ] Clerk provider works
- [ ] No console errors
- [ ] Routing works

**Time**: ~10 minutes  
**If this fails**: Fix frontend before Phase 7

---

## Phase 7: Integration Testing (CURRENT PHASE)

### What to Test

Full authentication flow, webhook, tool access, analytics

This is where you are now! Follow these guides:

### Quick Test Path

#### 7.A: Readiness Check

```bash
./scripts/phase7-check.sh
```

**Expected**: All checks pass (except .env warnings)

#### 7.B: Start Both Servers

```bash
./scripts/start-dev.sh
```

**Expected**:

- ✅ Backend on 3001
- ✅ Frontend on 5173
- ✅ No startup errors

#### 7.C: Sign Up Test

1. Open http://localhost:5173
2. Click Sign Up
3. Create account
4. Check Supabase → users table

**Expected**: New user row created via webhook

#### 7.D: Tool Access Test

1. Run `scripts/test-data-setup.sql` in Supabase
2. Log in to app
3. Go to Tools page
4. Verify tools appear

**Expected**: Tools visible based on access rules

### Full Testing

See **PHASE_7_TESTING_GUIDE.md** for comprehensive tests:

- ✅ Step 7.1: Webhook (code complete)
- 🧪 Step 7.2: Authentication
- 🧪 Step 7.3: Tool Access (CRITICAL)
- 🧪 Step 7.4: Analytics
- 🧪 Step 7.5: Tool Execution
- 🧪 Step 7.6: Knowledge Base

### ✅ Phase 7 Complete When:

- [ ] Webhook verified
- [ ] Auth flow works end-to-end
- [ ] Tool access rules enforced
- [ ] Analytics visible by role
- [ ] Tool execution works
- [ ] Knowledge base works

**Time**: ~30 minutes  
**If this fails**: Fix issues before Phase 8

---

## Phase 8: Build & Deploy Testing

### What to Test

Production build, deployment, live site

### Tests

#### 8.1: Production Build

```bash
npm run build
```

**Expected**:

- ✅ Server builds successfully
- ✅ Client builds successfully
- ✅ No build errors
- ✅ No warnings (or only minor ones)

#### 8.2: Linting

```bash
npm run lint
```

**Expected**: No linting errors

#### 8.3: Build Output Check

```bash
ls -la dist/
```

**Expected**:

- ✅ `dist/` directory exists
- ✅ Contains server files
- ✅ Contains client assets

#### 8.4: Vercel Deployment (Dry Run)

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Preview deployment (don't use --prod yet)
vercel
```

**Expected**: Deployment succeeds to preview URL

#### 8.5: Test Production Deployment

1. Visit preview URL
2. Test sign-up
3. Test authentication
4. Test tool access
5. Test one tool execution

**Expected**: Everything works on live URL

#### 8.6: Production Deploy

```bash
# Only after preview works!
vercel --prod
```

**Expected**: Live on production domain

### ✅ Phase 8 Complete When:

- [ ] Production build succeeds
- [ ] No linting errors
- [ ] Preview deployment works
- [ ] All features work on preview
- [ ] Production deployment succeeds
- [ ] Live site fully functional

**Time**: ~10 minutes  
**If this fails**: Review build errors

---

## 🎯 Summary: When to Test

| Phase       | Test Timing          | Why                        |
| ----------- | -------------------- | -------------------------- |
| **Phase 1** | After npm install    | Verify dependencies        |
| **Phase 2** | After each migration | Verify schema              |
| **Phase 3** | After creating types | Verify TypeScript          |
| **Phase 4** | After each script    | Verify tools work          |
| **Phase 5** | After server code    | Verify backend             |
| **Phase 6** | After frontend code  | Verify UI                  |
| **Phase 7** | After integration    | Verify everything together |
| **Phase 8** | Before deploy        | Verify production ready    |

---

## 🆘 What to Do When Tests Fail

### Phase 1 Fails

- Check Node.js version: `node --version` (need 18+)
- Delete `node_modules` and retry: `rm -rf node_modules && npm install`
- Check for typos in config files

### Phase 2 Fails

- Check Supabase credentials in .env
- Verify SQL syntax (no typos)
- Check table order (dependencies first)
- Review Supabase logs for errors

### Phase 3-4 Fail

- Check for TypeScript syntax errors
- Verify imports use correct paths
- Check file naming (case-sensitive)

### Phase 5 Fails

- Check .env has all server variables
- Verify port 3001 is available: `lsof -i :3001`
- Check server logs for errors
- Verify Supabase connection

### Phase 6 Fails

- Check .env has all client variables (VITE\_ prefix)
- Verify port 5173 available: `lsof -i :5173`
- Check browser console for errors
- Verify Clerk configuration

### Phase 7 Fails

- Check webhook secret is correct
- Verify ngrok is running (for local)
- Check both servers are running
- Review PHASE_7_TESTING_GUIDE.md

### Phase 8 Fails

- Fix all Phase 7 issues first
- Check Vercel environment variables
- Review build logs
- Test preview before production

---

## ✅ Complete Testing Checklist

```
Pre-Build:
□ Node.js 18+ installed
□ Supabase project created
□ Clerk app created
□ Airia API key obtained
□ Git initialized

Phase 1:
□ Directories created
□ Config files present
□ Dependencies installed
□ TypeScript works

Phase 2:
□ Migrations created
□ Schema deployed
□ Functions installed
□ Constraints work

Phase 3:
□ Types defined
□ Types compile
□ Can import types

Phase 4:
□ Scripts created
□ Scripts executable
□ Scripts work

Phase 5:
□ Server files created
□ Server compiles
□ Server starts
□ Endpoints respond

Phase 6:
□ Frontend files created
□ Client compiles
□ Client starts
□ Page renders

Phase 7:
□ Webhook works
□ Auth flow works
□ Tool access works
□ Analytics work
□ Execution works
□ KB works

Phase 8:
□ Build succeeds
□ Lint passes
□ Deploy succeeds
□ Site works live
```

---

## 🎓 Testing Best Practices

1. **Test incrementally** - Don't skip phases
2. **Document failures** - Note what broke and why
3. **Keep test data** - Save test queries/accounts
4. **Use version control** - Commit after each phase passes
5. **Read error messages** - They usually tell you what's wrong
6. **Check logs** - Server/browser console logs are your friend
7. **One thing at a time** - Fix one error before moving on

---

**Current Status**: You're at Phase 7 with all code complete! 🎉

**Next Test**: Run `./scripts/phase7-check.sh` to verify Phase 7 readiness

**Then**: Follow PHASE_7_TESTING_GUIDE.md for integration testing

---

_Happy testing! Remember: Test early, test often! 🧪_
