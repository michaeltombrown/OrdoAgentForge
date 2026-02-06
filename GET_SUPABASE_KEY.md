# 🔑 Get Your Supabase Anon Key

Your Supabase project is identified! Now you just need the **anon key**.

## Your Supabase Project:

**Project Reference:** `ydebgchglotcdjfegbhs`  
**Project URL:** `https://ydebgchglotcdjfegbhs.supabase.co`  
**Region:** Already set up!

## ✅ Already Added to .env.local:

```bash
VITE_SUPABASE_URL=https://ydebgchglotcdjfegbhs.supabase.co
```

## 🔐 Get Your Anon Key (2 minutes):

### Step 1: Go to Supabase Dashboard

Visit: https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs

### Step 2: Navigate to API Settings

1. Click on **Settings** (⚙️ gear icon in sidebar)
2. Click on **API** in the left menu

### Step 3: Copy the Anon Key

Look for the section labeled **Project API keys**

You'll see two keys:

- 🔑 **anon** `public` - This is the one you need!
- 🔒 **service_role** `secret` - DON'T use this one in the frontend

Copy the **anon** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 4: Add to .env.local

Open `.env.local` and replace the placeholder:

```bash
# Find this line:
VITE_SUPABASE_ANON_KEY=your-anon-key-here-get-from-supabase-dashboard

# Replace with your actual key:
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...your-actual-key
```

### Step 5: Restart Dev Server

```bash
# Stop the server (Ctrl+C) then:
npm run dev
```

## 🎯 Quick Link:

Direct link to your API settings:
https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs/settings/api

## ✅ After Adding the Key:

Your `.env.local` should look like this:

```bash
# Vercel (already there)
VERCEL_OIDC_TOKEN=eyJhbGci...

# Supabase Configuration
VITE_SUPABASE_URL=https://ydebgchglotcdjfegbhs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Database (for server-side if needed)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ydebgchglotcdjfegbhs.supabase.co:5432/postgres
```

## 🧪 Test the Connection:

Once you add the key and restart, test it:

```typescript
import { supabase } from './lib/supabase';

// Test connection
const { data, error } = await supabase.from('_test').select('*').limit(1);
if (!error) {
  console.log('✅ Supabase connected!');
}
```

## 🚀 Next Steps:

1. ✅ Project URL added
2. ⏳ **Get anon key from dashboard**
3. ⏳ Add key to `.env.local`
4. ⏳ Restart dev server
5. ✅ Start building!

## 📖 Need Help?

- **Dashboard**: https://supabase.com/dashboard
- **API Docs**: https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs/settings/api
- **Setup Guide**: See `SUPABASE_SETUP.md`

---

**Almost there!** Just grab that anon key and you're ready to go! 🎉
