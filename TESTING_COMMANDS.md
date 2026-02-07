# Quick Testing Commands Reference

**Last Updated**: February 6, 2026  
**Purpose**: Fast command lookup for testing each phase

---

## 🚀 Phase 1: Project Initialization

```bash
# Verify directories
ls -la src/ src/app/ src/server/ supabase/migrations/

# Check config files
ls -la package.json tsconfig.json vite.config.ts

# Install dependencies
npm install

# Verify install
npm list --depth=0

# Check TypeScript
npm run type-check
```

---

## 🗄️ Phase 2: Database Setup

```bash
# Check migration files
ls -la supabase/migrations/

# In Supabase SQL Editor, run:
# 1. Copy/paste 001_initial_schema.sql
# 2. Copy/paste 002_functions.sql
```

**Verify in Supabase Table Editor**: All 8 tables exist

**SQL Verification**:

```sql
-- Check functions
SELECT proname FROM pg_proc
WHERE proname IN ('get_user_tools', 'check_tool_access');

-- List all tables
SELECT tablename FROM pg_tables
WHERE schemaname = 'public';
```

---

## 📝 Phase 3: TypeScript Types

```bash
# Check types created
cat src/types/database.ts | head -50
cat src/types/requests.ts | head -30

# Verify compilation
npm run type-check
```

---

## 🛠️ Phase 4: Scripts

```bash
# List scripts
ls -la scripts/

# Test version bump
node scripts/bump-version.js patch

# Check version changed
grep '"version"' package.json

# Test database verification (needs .env)
npm run verify:database
```

---

## ⚙️ Phase 5: Backend Foundation

```bash
# Check all backend files
ls -la src/server/middleware/
ls -la src/server/controllers/
ls -la src/server/schemas/

# Compile server
npm run build:server

# Start server
npm run dev:server
# Expected: "🚀 Server running on port 3001"

# In another terminal, test health endpoint
curl http://localhost:3001/health
# Expected: {"status":"ok",...}

# Test protected endpoint (should fail with 401)
curl http://localhost:3001/api/auth/me
# Expected: 401 Unauthorized (correct!)

# Stop server
pkill -f "tsx watch"
```

---

## 🎨 Phase 6: Frontend Foundation

```bash
# Check frontend files
ls -la src/lib/context/
ls -la src/hooks/
ls -la src/components/layout/
ls -la src/app/

# Verify TypeScript
npm run type-check

# Build client
npm run build:client

# Start frontend
npm run dev:client
# Expected: "Local: http://localhost:5173/"

# Open browser
open http://localhost:5173
# Expected: Page loads, Clerk sign-in shows

# Stop frontend
pkill -f "vite"
```

---

## 🔗 Phase 7: Integration & Testing

```bash
# Check Phase 7 readiness
./scripts/phase7-check.sh

# Verify environment
./scripts/verify-env.sh

# Start both servers
./scripts/start-dev.sh
# Backend: http://localhost:3001
# Frontend: http://localhost:5173

# In another terminal, create test data
# 1. Open Supabase SQL Editor
# 2. Run scripts/test-data-setup.sql
```

**Manual Tests**:

1. Sign up at http://localhost:5173
2. Check user in Supabase → users table
3. Test tool access
4. Test analytics
5. Test tool execution

**See**: PHASE_7_TESTING_GUIDE.md for detailed steps

---

## 📦 Phase 8: Build & Deploy

```bash
# Production build
npm run build
# Expected: Both server and client build successfully

# Lint check
npm run lint
# Expected: No errors

# Check build output
ls -la dist/

# Preview deployment
vercel
# Test preview URL

# Production deployment (only after preview works!)
vercel --prod
```

---

## 🔍 Quick Diagnostics

### Check What's Running

```bash
# Check if server is running
lsof -i :3001

# Check if frontend is running
lsof -i :5173

# Kill server
pkill -f "tsx watch"

# Kill frontend
pkill -f "vite"
```

### Check Logs

```bash
# Server logs (when running with npm run dev:server)
# Just look at terminal output

# Check for errors
# Look for red text or stack traces
```

### Environment Check

```bash
# Quick check
cat .env | grep "="

# Detailed check
./scripts/verify-env.sh
```

### TypeScript Errors

```bash
# Full check
npm run type-check

# Build (shows errors too)
npm run build
```

### Clean Install

```bash
# Remove everything and reinstall
rm -rf node_modules package-lock.json dist/
npm install
```

---

## 🧪 Testing Shortcuts

### Quick Full Stack Test

```bash
# Terminal 1: Start backend
npm run dev:server

# Terminal 2: Start frontend
npm run dev:client

# Terminal 3: Test
curl http://localhost:3001/health
open http://localhost:5173
```

### Quick Build Test

```bash
# Test everything compiles
npm run type-check && npm run build && npm run lint
```

### Quick Server Test

```bash
# Start, test health, stop
npm run dev:server &
sleep 3
curl http://localhost:3001/health
pkill -f "tsx watch"
```

---

## 📊 Status Checks

### Check Current Phase Status

```bash
# Phase 7 check
./scripts/phase7-check.sh

# Manual check
ls -la PHASE_*.md
```

### Check Dependencies

```bash
# List installed packages
npm list --depth=0

# Check for updates
npm outdated
```

### Check Git Status

```bash
# See what's been created/changed
git status

# See file count
git ls-files | wc -l
```

---

## 🆘 Emergency Commands

### Server Won't Start

```bash
# Kill any process on port 3001
lsof -ti:3001 | xargs kill -9

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Check .env
cat .env | grep -v "^#" | grep "="
```

### Frontend Won't Start

```bash
# Kill any process on port 5173
lsof -ti:5173 | xargs kill -9

# Clear Vite cache
rm -rf node_modules/.vite

# Restart
npm run dev:client
```

### TypeScript Errors

```bash
# Show detailed errors
npm run type-check 2>&1 | more

# Try rebuilding
npm run build
```

### Database Connection Issues

```bash
# Test connection
npm run verify:database

# Check credentials
grep "SUPABASE" .env
```

---

## 📚 Documentation Quick Links

| Guide                      | Purpose                           |
| -------------------------- | --------------------------------- |
| `TESTING_BY_PHASE.md`      | Complete testing guide (this doc) |
| `PHASE_7_SUMMARY.md`       | Phase 7 overview                  |
| `PHASE_7_QUICKSTART.md`    | Fast Phase 7 setup                |
| `PHASE_7_TESTING_GUIDE.md` | Detailed Phase 7 tests            |
| `BUILD_INSTRUCTIONS.md`    | Original build instructions       |

---

## ✅ One-Liner Checks

```bash
# Phase 1: Deps installed?
npm list --depth=0 > /dev/null && echo "✅ OK" || echo "❌ FAIL"

# Phase 2: Database ready?
npm run verify:database

# Phase 3-4: Types + Scripts?
npm run type-check && echo "✅ OK" || echo "❌ FAIL"

# Phase 5: Server works?
npm run dev:server & sleep 3 && curl -f http://localhost:3001/health && pkill -f "tsx watch" && echo "✅ OK" || echo "❌ FAIL"

# Phase 6: Client builds?
npm run build:client > /dev/null && echo "✅ OK" || echo "❌ FAIL"

# Phase 7: Ready?
./scripts/phase7-check.sh

# Phase 8: Production ready?
npm run build && npm run lint && echo "✅ OK" || echo "❌ FAIL"
```

---

**Quick Start**: Run `./scripts/phase7-check.sh` to see current status!

**Need Help?**: Check `TESTING_BY_PHASE.md` for detailed instructions

**Current Phase**: Phase 7 - Ready for integration testing! 🚀
