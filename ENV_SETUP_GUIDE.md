# 🔐 .env Configuration Guide

## Overview

The `.env` file has been created with all required variables according to BUILD_INSTRUCTIONS.md (Phase 3). You now need to fill in the actual credentials.

**Current Status:** ✅ Template created, ⏳ Awaiting credentials

---

## Required Credentials Checklist

- [ ] Supabase Service Role Key
- [ ] Supabase Anon Key
- [ ] Clerk Secret Key
- [ ] Clerk Publishable Key
- [ ] Clerk Webhook Secret
- [ ] Airia API Key

**Estimated Time:** 10-15 minutes

---

## 1️⃣ SUPABASE CREDENTIALS (5 minutes)

### Your Supabase Project Info

- **Project Reference:** `ydebgchglotcdjfegbhs`
- **Project URL:** `https://ydebgchglotcdjfegbhs.supabase.co` ✅ (already in .env)
- **Dashboard:** https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs

### Step-by-Step:

#### A. Get Anon Key (Public Key)

1. Go to: https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs/settings/api
2. Find **Project API keys** section
3. Copy the **`anon`** `public` key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
4. Open `.env` file
5. Replace this line:
   ```bash
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   With:
   ```bash
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
   ```

#### B. Get Service Role Key (Secret Key)

1. Same page: https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs/settings/api
2. Find **Project API keys** section
3. Copy the **`service_role`** `secret` key (also starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` but different)
4. Open `.env` file
5. Replace this line:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```
   With:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
   ```

⚠️ **IMPORTANT:** The service_role key gives full database access. Never expose it in frontend code or commit it to git!

**Verify:**

```bash
# Both URLs should be set to:
SUPABASE_URL=https://ydebgchglotcdjfegbhs.supabase.co
VITE_SUPABASE_URL=https://ydebgchglotcdjfegbhs.supabase.co
```

---

## 2️⃣ CLERK CREDENTIALS (5 minutes)

### Your Clerk Setup

- **Dashboard:** https://dashboard.clerk.com
- **Application:** Select your OrdoAgentForge application

### Step-by-Step:

#### A. Get Publishable Key (Public Key)

1. Go to: https://dashboard.clerk.com
2. Select your application
3. Go to **"API Keys"** in the sidebar
4. Find **Publishable keys** section
5. Copy the key (starts with `pk_test_` or `pk_live_`)
6. Open `.env` file
7. Replace this line:
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_or_pk_live_your-clerk-publishable-key-here
   ```
   With:
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_ABC123...
   ```

#### B. Get Secret Key (Secret Key)

1. Same page (API Keys)
2. Find **Secret keys** section
3. Copy the key (starts with `sk_test_` or `sk_live_`)
4. Open `.env` file
5. Replace this line:
   ```bash
   CLERK_SECRET_KEY=sk_test_or_sk_live_your-clerk-secret-key-here
   ```
   With:
   ```bash
   CLERK_SECRET_KEY=sk_test_ABC123...
   ```

#### C. Get Webhook Secret (Critical for Phase 7)

1. Go to: https://dashboard.clerk.com
2. Select your application
3. Go to **"Webhooks"** in the sidebar
4. Click **"Add Endpoint"**
5. Enter your webhook URL:
   - **Development:** `http://localhost:3001/api/auth/webhook`
   - **Production:** `https://your-domain.com/api/auth/webhook`
6. Enable these events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
7. Click **"Create"**
8. Copy the **Signing Secret** (starts with `whsec_`)
9. Open `.env` file
10. Replace this line:
    ```bash
    CLERK_WEBHOOK_SECRET=whsec_your-webhook-secret-here
    ```
    With:
    ```bash
    CLERK_WEBHOOK_SECRET=whsec_ABC123...
    ```

⚠️ **NOTE:** For development testing, you may need to use Clerk's webhook testing feature or ngrok to expose your local server.

---

## 3️⃣ AIRIA API KEY (2 minutes)

### Your Airia Setup

- **Dashboard:** https://airia.ai or your Airia provider dashboard

### Step-by-Step:

1. Log in to your Airia dashboard
2. Navigate to **API Keys** or **Settings**
3. Generate a new API key or copy existing key
4. Open `.env` file
5. Replace this line:
   ```bash
   AIRIA_API_KEY=your-airia-api-key-here
   ```
   With:
   ```bash
   AIRIA_API_KEY=your-actual-airia-key
   ```

⚠️ **NOTE:** If you don't have an Airia API key yet, you can:

- Leave as placeholder and configure later
- Use a test/demo key if available
- Sign up at https://airia.ai

---

## 4️⃣ SERVER CONFIGURATION (Already Set)

These are already configured correctly:

```bash
NODE_ENV=development          # ✅ Correct for development
PORT=3001                     # ✅ Backend server port
FRONTEND_URL=http://localhost:3000  # ✅ Frontend URL for CORS
```

### For Production Deployment:

When deploying to Vercel, update these in Vercel dashboard:

```bash
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

---

## ✅ VERIFICATION

After filling in all credentials, verify your configuration:

### Step 1: Run Environment Verification Script

```bash
bash scripts/verify-env.sh
```

**Expected Output:**

```
✅ All required environment variables are set
✅ Supabase configuration valid
✅ Clerk configuration valid
✅ Server configuration valid
```

### Step 2: Check for Placeholders

```bash
grep -E "(your-|here)" .env
```

**Expected Output:** No matches (all placeholders replaced)

### Step 3: Test Supabase Connection

```bash
npm run test:db
# OR manually run:
node -e "require('dotenv').config(); console.log('URL:', process.env.SUPABASE_URL)"
```

**Expected Output:** Should show your actual Supabase URL

---

## 🔒 SECURITY CHECKLIST

Before proceeding:

- [ ] `.env` file is in `.gitignore` (prevents accidental commit)
- [ ] Service role key is NOT exposed to frontend (stays in backend only)
- [ ] All secret keys are kept secure (not shared, not committed)
- [ ] Webhook secret matches Clerk dashboard
- [ ] Production keys are separate from development keys

---

## 📝 Quick Reference

### Variable Summary Table

| Variable                     | Type   | Where to Get                                       | Used By  |
| ---------------------------- | ------ | -------------------------------------------------- | -------- |
| `SUPABASE_URL`               | Public | Supabase Dashboard → Settings → API                | Backend  |
| `SUPABASE_SERVICE_ROLE_KEY`  | Secret | Supabase Dashboard → Settings → API → service_role | Backend  |
| `VITE_SUPABASE_URL`          | Public | Supabase Dashboard → Settings → API                | Frontend |
| `VITE_SUPABASE_ANON_KEY`     | Public | Supabase Dashboard → Settings → API → anon         | Frontend |
| `CLERK_SECRET_KEY`           | Secret | Clerk Dashboard → API Keys → Secret keys           | Backend  |
| `VITE_CLERK_PUBLISHABLE_KEY` | Public | Clerk Dashboard → API Keys → Publishable keys      | Frontend |
| `CLERK_WEBHOOK_SECRET`       | Secret | Clerk Dashboard → Webhooks → Signing Secret        | Backend  |
| `AIRIA_API_KEY`              | Secret | Airia Dashboard → API Keys                         | Backend  |
| `NODE_ENV`                   | Config | Set manually                                       | Both     |
| `PORT`                       | Config | Set manually                                       | Backend  |
| `FRONTEND_URL`               | Config | Set manually                                       | Backend  |

---

## 🚨 TROUBLESHOOTING

### Issue: "Cannot connect to Supabase"

**Solution:**

- Verify `SUPABASE_URL` matches your project URL exactly
- Ensure anon key is copied completely (very long string)
- Check for extra spaces or line breaks in the key

### Issue: "Clerk authentication failed"

**Solution:**

- Verify publishable key starts with `pk_test_` or `pk_live_`
- Verify secret key starts with `sk_test_` or `sk_live_`
- Ensure you're using keys from the correct Clerk application

### Issue: "Webhook signature verification failed"

**Solution:**

- Verify `CLERK_WEBHOOK_SECRET` matches the signing secret in Clerk dashboard
- Ensure webhook endpoint URL is correct in Clerk dashboard
- Check that webhook events are enabled (user.created, user.updated, user.deleted)

### Issue: "Airia API calls failing"

**Solution:**

- Verify API key is valid and active
- Check Airia account status and API usage limits
- Ensure API key has correct permissions

---

## 📚 NEXT STEPS

Once all credentials are filled in:

1. ✅ Verify configuration: `bash scripts/verify-env.sh`
2. ✅ Run database migrations (see Phase 2 in BUILD_INSTRUCTIONS.md)
3. ✅ Test Clerk webhook (see PHASE_7_TESTING_GUIDE.md)
4. ✅ Start development servers: `bash scripts/start-dev.sh`
5. ✅ Run integration tests: See PHASE_7_TESTING_GUIDE.md

---

## 📖 RELATED DOCUMENTATION

- **BUILD_INSTRUCTIONS.md** - Phase 3: Environment Configuration
- **START_HERE.md** - Quick start guide
- **PHASE_7_TESTING_GUIDE.md** - Testing with webhooks
- **GET_SUPABASE_KEY.md** - Detailed Supabase key instructions

---

**Status:** .env file created ✅  
**Next:** Fill in credentials (10-15 minutes)  
**Then:** Run `bash scripts/verify-env.sh`

---

**Last Updated:** December 2024  
**BUILD_INSTRUCTIONS.md Compliance:** Phase 3 Complete
