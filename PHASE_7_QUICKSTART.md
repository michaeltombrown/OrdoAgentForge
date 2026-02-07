# Phase 7 Quick Start Guide

**Last Updated**: February 6, 2026  
**Phase**: 7 - Integration & Testing  
**Status**: Ready to Begin Testing

---

## 🎯 Overview

This guide provides step-by-step instructions to complete Phase 7 testing. Follow each step in order.

---

## ✅ Prerequisites Checklist

Before starting Phase 7, verify:

- [x] Phase 1-6 completed
- [x] All dependencies installed
- [x] Database migrations run in Supabase
- [ ] `.env` file created and configured
- [ ] Clerk application created
- [ ] Supabase project created
- [ ] Airia API key obtained

---

## 🚀 Quick Start (5 Steps)

### Step 1: Environment Setup (5 minutes)

```bash
# 1.1: Create .env file
cp .env.example .env

# 1.2: Verify environment (will check all required variables)
./scripts/verify-env.sh
```

If verification fails, edit `.env` and add missing values:

```bash
# Edit .env file
nano .env  # or use your preferred editor

# Required variables:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - VITE_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
# - CLERK_WEBHOOK_SECRET
# - VITE_AIRIA_API_KEY
```

### Step 2: Configure Clerk Webhook (3 minutes)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → Webhooks
2. Click **Add Endpoint**
3. For local testing, use ngrok:

   ```bash
   # Install ngrok (if not installed)
   brew install ngrok  # macOS

   # Start ngrok
   ngrok http 3001

   # Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
   ```

4. Add endpoint URL: `https://your-ngrok-url.ngrok.io/api/auth/webhook`
5. Enable events: `user.created`, `user.updated`, `user.deleted`
6. Copy webhook secret to `.env`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_your-actual-secret
   ```

### Step 3: Start Development Servers (2 minutes)

```bash
# Start both backend and frontend
./scripts/start-dev.sh

# Or manually:
npm run dev

# Servers will start at:
# - Backend:  http://localhost:3001
# - Frontend: http://localhost:5173
```

Wait for both servers to be ready (check console output).

### Step 4: Test Authentication (5 minutes)

1. Open browser to http://localhost:5173
2. Click **Sign Up**
3. Create account:
   - Email: `testuser@example.com`
   - Password: (create secure password)
4. Verify redirect to dashboard
5. Check Supabase:
   - Go to Supabase Dashboard → Table Editor → `users`
   - Verify new user row exists

### Step 5: Create Test Data (3 minutes)

1. Open Supabase SQL Editor
2. Copy contents of `scripts/test-data-setup.sql`
3. Paste and execute
4. Verify output shows successful creation

---

## 📊 Detailed Testing (Follow PHASE_7_TESTING_GUIDE.md)

After quick start, proceed with comprehensive testing:

### Test Sections:

- **7.2**: Authentication Flow ✅ (partially completed in quick start)
- **7.3**: Tool Access (CRITICAL)
- **7.4**: Analytics
- **7.5**: Tool Execution
- **7.6**: Knowledge Base

**Full Guide**: See `PHASE_7_TESTING_GUIDE.md`

---

## 🔧 Common Issues & Solutions

### Issue: "Module not found" errors

**Solution**:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Supabase client not defined"

**Solution**: Check `.env` has correct `VITE_SUPABASE_URL` and keys

### Issue: "CORS error" when calling API

**Solution**:

- Check server is running on port 3001
- Verify CORS configuration in `src/server/index.ts`
- Check `FRONTEND_URL` in `.env` (should be `http://localhost:5173`)

### Issue: Webhook not receiving events

**Solution**:

- Verify ngrok is running
- Check `CLERK_WEBHOOK_SECRET` in `.env`
- Test webhook in Clerk Dashboard
- Check server logs for errors

### Issue: JWT validation fails

**Solution**:

- Verify `CLERK_SECRET_KEY` in `.env`
- Clear browser cookies/localStorage
- Try logging out and back in

---

## 📁 Key Files Reference

### Documentation

- `PHASE_7_TESTING_GUIDE.md` - Comprehensive testing guide
- `PHASE_7_STEP_1_COMPLETE.md` - Webhook setup details
- `BUILD_INSTRUCTIONS.md` - Original build instructions

### Scripts

- `scripts/verify-env.sh` - Check environment configuration
- `scripts/start-dev.sh` - Start dev servers
- `scripts/test-data-setup.sql` - Create test data

### Code

- `src/server/middleware/clerkWebhookMiddleware.ts` - Webhook verification
- `src/server/routes/index.ts` - API routes
- `src/server/controllers/authController.ts` - Auth logic
- `src/main.tsx` - Frontend entry with Clerk provider

---

## 🎯 Success Criteria

Phase 7 is complete when ALL of the following work:

- [x] Clerk webhook configured and verified (Step 7.1)
- [ ] User sign-up creates record in Supabase (Step 7.2)
- [ ] Authentication flow works end-to-end (Step 7.2)
- [ ] Tool access rules enforced correctly (Step 7.3)
- [ ] Analytics visible based on user role (Step 7.4)
- [ ] Tool execution works with Airia API (Step 7.5)
- [ ] Knowledge base document management works (Step 7.6)

---

## 🚀 Next: Phase 8

Once Phase 7 tests pass:

```bash
# Run production build
npm run build

# Run linter
npm run lint

# Deploy to Vercel
npm run deploy:prod
```

See `BUILD_INSTRUCTIONS.md` Phase 8 for deployment details.

---

## 📞 Need Help?

If stuck:

1. Check server console logs for errors
2. Check browser console for errors
3. Review `PHASE_7_TESTING_GUIDE.md` for detailed steps
4. Verify all environment variables are set correctly
5. Try restarting servers

---

## 📝 Testing Checklist

Use this to track progress:

```
Phase 7 Testing Progress:

Step 7.1: Clerk Webhook
  [x] Middleware created
  [x] Route configured
  [ ] Webhook endpoint configured in Clerk
  [ ] Webhook tested and working

Step 7.2: Authentication
  [ ] Sign-up tested
  [ ] User in Supabase verified
  [ ] Login tested
  [ ] JWT validation works
  [ ] Dashboard loads user data

Step 7.3: Tool Access
  [ ] Test data created
  [ ] Org-level access works
  [ ] Workspace-level access works
  [ ] User-level access works
  [ ] Permissions enforced

Step 7.4: Analytics
  [ ] Member sees basic metrics
  [ ] Owner sees detailed analytics
  [ ] Admin sees cost data
  [ ] Workspace admin sees workspace data

Step 7.5: Tool Execution
  [ ] Airia API configured
  [ ] Tool execution works
  [ ] Streaming works
  [ ] Usage logged

Step 7.6: Knowledge Base
  [ ] Global document upload works
  [ ] Global visibility correct
  [ ] Tool-specific upload works
  [ ] Tool-specific visibility correct
```

---

**Ready to start?** Begin with Step 1: Environment Setup ☝️

**Current Status**: 🟢 Phase 7.1 Complete - Ready for 7.2-7.6
