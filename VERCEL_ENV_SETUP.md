# Quick Setup: Add Environment Variables to Vercel

## 📋 Copy-Paste Ready Values

Use these values in the Vercel Dashboard:

### 1. VITE_SUPABASE_URL

```
https://ydebgchglotcdjfegbhs.supabase.co
```

**Environments:** Production, Preview, Development

### 2. VITE_SUPABASE_ANON_KEY

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZWJnY2hnbG90Y2RqZmVnYmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTE5MzcsImV4cCI6MjA4NTk4NzkzN30.6Ub4BoTKQUmFCUVEg9T4G2U8j0V__so_NJl3EWuUHZ0
```

**Environments:** Production, Preview, Development

### 3. VITE_CLERK_PUBLISHABLE_KEY

```
pk_test_cHJlY2lvdXMtc3RvcmstMi5jbGVyay5hY2NvdW50cy5kZXYk
```

**Environments:** Production, Preview, Development

### 4. CLERK_SECRET_KEY

```
sk_test_MhGBIDqLA3ZQHJHajs0NOvjEEzHlF6xKWzo0ic1gJm
```

**Environments:** Production, Preview, Development

---

## ⚠️ STILL NEEDED

### 5. SUPABASE_SERVICE_ROLE_KEY

**Where to get it:**

1. Go to: https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs/settings/api
2. Find the "service_role" key under "Project API keys"
3. Click "Reveal" and copy it
4. Paste it into Vercel

**Environments:** Production, Preview, Development

### 6. CLERK_WEBHOOK_SECRET

**Where to get it:**

1. Go to: https://dashboard.clerk.com
2. Navigate to: Webhooks
3. Click: "Add Endpoint"
4. Enter URL: `https://ordoagentforge.vercel.app/api/webhooks/clerk`
5. Select events: `user.created`, `user.updated`, `user.deleted`
6. Copy the webhook signing secret (starts with `whsec_`)
7. Paste it into Vercel

**Environments:** Production, Preview, Development

---

## 🚀 How to Add (Step-by-Step)

### Option 1: Use Vercel Dashboard (Recommended - Faster)

1. **Open Vercel Dashboard:**
   https://vercel.com/michaeltombrowns-projects/ordoagentforge/settings/environment-variables

2. **For each variable above:**
   - Click "Add New" button
   - Enter the variable name (e.g., `VITE_SUPABASE_URL`)
   - Paste the value
   - Select all three environments: Production, Preview, Development
   - Click "Save"

3. **After adding all variables:**
   - Go to the Deployments tab
   - Click "Redeploy" on the latest deployment
   - OR run: `vercel --prod` from terminal

### Option 2: Use Vercel CLI (One at a Time)

```bash
# Navigate to project
cd /Users/Michael/OrdoAgentForge

# Add each variable (you'll be prompted for the value)
vercel env add VITE_SUPABASE_URL production preview development
vercel env add VITE_SUPABASE_ANON_KEY production preview development
vercel env add VITE_CLERK_PUBLISHABLE_KEY production preview development
vercel env add CLERK_SECRET_KEY production preview development
vercel env add SUPABASE_SERVICE_ROLE_KEY production preview development
vercel env add CLERK_WEBHOOK_SECRET production preview development

# Redeploy
vercel --prod
```

---

## ✅ Verification Checklist

After adding all variables:

- [ ] All 6 variables added to Vercel
- [ ] Each variable is set for Production, Preview, and Development
- [ ] Application redeployed
- [ ] Visit https://ordoagentforge.vercel.app and test sign up
- [ ] Check Supabase to confirm user was created
- [ ] Check Clerk webhook logs for success

---

## 🐛 If Something Goes Wrong

### Environment variables not working?

- Make sure you selected all three environments (Production, Preview, Development)
- Redeploy after adding variables
- Check for typos in variable names (they're case-sensitive)
- Make sure there are no extra spaces or newlines

### Webhook not receiving events?

- Add CLERK_WEBHOOK_SECRET first
- Then redeploy
- Then test by signing up a new user

### Build fails after adding variables?

- Check Vercel deployment logs
- Verify all variable names match exactly
- Make sure SUPABASE_SERVICE_ROLE_KEY is the service_role key, not anon key

---

## 📊 What Each Variable Does

| Variable                     | Purpose              | Where It's Used      |
| ---------------------------- | -------------------- | -------------------- |
| `VITE_SUPABASE_URL`          | Supabase project URL | Frontend + Backend   |
| `VITE_SUPABASE_ANON_KEY`     | Public Supabase key  | Frontend queries     |
| `SUPABASE_SERVICE_ROLE_KEY`  | Admin Supabase key   | Webhook (bypass RLS) |
| `VITE_CLERK_PUBLISHABLE_KEY` | Public Clerk key     | Frontend auth        |
| `CLERK_SECRET_KEY`           | Private Clerk key    | Backend auth         |
| `CLERK_WEBHOOK_SECRET`       | Webhook signature    | Verify Clerk events  |

---

## 🎯 Next Steps After Setup

1. ✅ Add all environment variables
2. ✅ Redeploy: `vercel --prod`
3. ✅ Configure Clerk webhook
4. ✅ Test user signup
5. ✅ Verify database records created
6. 🎨 Start building dashboard UI

---

**Quick Links:**

- Vercel Env Variables: https://vercel.com/michaeltombrowns-projects/ordoagentforge/settings/environment-variables
- Supabase API Settings: https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs/settings/api
- Clerk Dashboard: https://dashboard.clerk.com
- Your Live App: https://ordoagentforge.vercel.app
