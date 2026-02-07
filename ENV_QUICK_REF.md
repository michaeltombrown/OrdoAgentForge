# 🎯 .env Quick Reference Card

## ✅ Status: Template Created

**Files Created:**

- `.env` (3.5KB) - Your environment configuration file
- `ENV_SETUP_GUIDE.md` (8.7KB) - Comprehensive setup guide

---

## 📋 What You Need (10-15 minutes)

### 1. Supabase Keys (5 minutes)

**Dashboard:** https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs/settings/api

| Variable                    | Where to Find                        | Type         |
| --------------------------- | ------------------------------------ | ------------ |
| `VITE_SUPABASE_ANON_KEY`    | API Settings → anon (public)         | Copy & paste |
| `SUPABASE_SERVICE_ROLE_KEY` | API Settings → service_role (secret) | Copy & paste |

### 2. Clerk Keys (5 minutes)

**Dashboard:** https://dashboard.clerk.com

| Variable                     | Where to Find                               | Type         |
| ---------------------------- | ------------------------------------------- | ------------ |
| `VITE_CLERK_PUBLISHABLE_KEY` | API Keys → Publishable keys                 | Copy & paste |
| `CLERK_SECRET_KEY`           | API Keys → Secret keys                      | Copy & paste |
| `CLERK_WEBHOOK_SECRET`       | Webhooks → Create endpoint → Signing Secret | Copy & paste |

**Webhook Setup:**

- Endpoint URL: `http://localhost:3001/api/auth/webhook`
- Events: ✅ user.created, ✅ user.updated, ✅ user.deleted

### 3. Airia API Key (2 minutes)

**Dashboard:** https://airia.ai

| Variable        | Where to Find        | Type         |
| --------------- | -------------------- | ------------ |
| `AIRIA_API_KEY` | API Keys or Settings | Copy & paste |

---

## 🔧 How to Fill In Credentials

### Option 1: Edit Directly

```bash
# Open .env in your editor
open /Users/Michael/OrdoAgentForge/.env

# Or use vim/nano/code
code .env
```

### Option 2: Use sed (Command Line)

```bash
# Example: Replace Supabase anon key
sed -i '' 's/VITE_SUPABASE_ANON_KEY=.*/VITE_SUPABASE_ANON_KEY=your-actual-key/' .env

# Repeat for each variable
```

---

## ✅ Verification Steps

### Step 1: Check for Placeholders

```bash
# Should return nothing if all filled
grep -E "(your-|here)" .env
```

### Step 2: Run Verification Script

```bash
bash scripts/verify-env.sh
```

Expected output:

```
✅ All required environment variables are set
✅ Supabase configuration valid
✅ Clerk configuration valid
✅ Server configuration valid
```

### Step 3: Count Variables

```bash
# Should show 11 variables
grep -c "=" .env | grep -v "^#"
```

---

## 🔒 Security Reminders

- ✅ `.env` is in `.gitignore` (won't be committed)
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` = full database access
- ⚠️ Never expose secret keys in frontend
- ⚠️ Use different keys for dev vs production

---

## 📚 Need More Help?

**Detailed Instructions:**

```bash
open ENV_SETUP_GUIDE.md
```

**Key Information:**

- Your Supabase URL: `https://ydebgchglotcdjfegbhs.supabase.co`
- Backend Port: `3001`
- Frontend Port: `3000`

---

## 🚀 After .env is Complete

```bash
# 1. Verify configuration
bash scripts/verify-env.sh

# 2. Run database migrations (Phase 2)
# Open Supabase SQL Editor and run:
# - supabase/migrations/001_initial_schema.sql
# - supabase/migrations/002_functions.sql

# 3. Start development servers
bash scripts/start-dev.sh

# 4. Test the application
# See PHASE_7_TESTING_GUIDE.md
```

---

## 📋 Variables Summary

| #   | Variable                     | Status    | Notes                          |
| --- | ---------------------------- | --------- | ------------------------------ |
| 1   | `SUPABASE_URL`               | ✅ Set    | Already configured             |
| 2   | `SUPABASE_SERVICE_ROLE_KEY`  | ⏳ Needed | Get from Supabase API settings |
| 3   | `VITE_SUPABASE_URL`          | ✅ Set    | Already configured             |
| 4   | `VITE_SUPABASE_ANON_KEY`     | ⏳ Needed | Get from Supabase API settings |
| 5   | `CLERK_SECRET_KEY`           | ⏳ Needed | Get from Clerk API Keys        |
| 6   | `VITE_CLERK_PUBLISHABLE_KEY` | ⏳ Needed | Get from Clerk API Keys        |
| 7   | `CLERK_WEBHOOK_SECRET`       | ⏳ Needed | Get from Clerk Webhooks        |
| 8   | `AIRIA_API_KEY`              | ⏳ Needed | Get from Airia dashboard       |
| 9   | `NODE_ENV`                   | ✅ Set    | development                    |
| 10  | `PORT`                       | ✅ Set    | 3001                           |
| 11  | `FRONTEND_URL`               | ✅ Set    | http://localhost:3000          |

**Progress:** 4/11 configured (36%) → Need 7 more credentials

---

## 🎯 Quick Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs
- **Clerk Dashboard:** https://dashboard.clerk.com
- **Airia Dashboard:** https://airia.ai
- **Detailed Guide:** ENV_SETUP_GUIDE.md
- **Build Instructions:** BUILD_INSTRUCTIONS.md (Phase 3)

---

**Created:** February 6, 2026  
**BUILD_INSTRUCTIONS.md:** Phase 3 Complete (Template)  
**Next Step:** Fill in credentials (10-15 minutes)
