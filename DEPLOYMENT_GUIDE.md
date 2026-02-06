# Vercel Deployment Guide - OrdoAgentForge

## 🎯 Pre-Deployment Checklist

✅ **Completed:**

- [x] Code committed and pushed to GitHub
- [x] All tests passing (3/3 green)
- [x] TypeScript compiling successfully
- [x] Production build working
- [x] Webhook endpoint created
- [x] Template zip created (v1.0.3)
- [x] Vercel CLI installed
- [x] Logged in to Vercel as `michaeltombrown`

⏳ **Pending:**

- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Get deployment URL
- [ ] Configure Clerk webhook
- [ ] Add webhook secret
- [ ] Test webhook

## 🚀 Deployment Steps

### Step 1: Deploy to Vercel

```bash
cd /Users/Michael/OrdoAgentForge
vercel --prod
```

This will:

1. Link your project to Vercel (first time)
2. Build your application
3. Deploy to production
4. Give you a deployment URL

### Step 2: Configure Environment Variables

After deployment, add these environment variables in the Vercel dashboard:

1. Go to: https://vercel.com/michaeltombrown
2. Select your project: `OrdoAgentForge`
3. Go to Settings → Environment Variables
4. Add the following:

```bash
# Supabase
VITE_SUPABASE_URL=https://ydebgchglotcdjfegbhs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZWJnY2hnbG90Y2RqZmVnYmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3MDQ3NDMsImV4cCI6MjA1MjI4MDc0M30.8ohQl1hWiF8A3X2XVbSQTXK8g08bYuZV6Mx5cI5czyk
SUPABASE_SERVICE_ROLE_KEY=[Your Service Role Key - from Supabase Dashboard]

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=[Your Clerk Publishable Key]
CLERK_SECRET_KEY=[Your Clerk Secret Key]

# Airia
VITE_AIRIA_API_KEY=[Your Airia API Key]
```

**Important:** For each variable, set the environment to "Production, Preview, Development" (all three).

### Step 3: Get Your Webhook Secret

After deployment, your webhook URL will be:

```
https://[your-project-name].vercel.app/api/webhooks/clerk
```

1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Navigate to: Webhooks → Add Endpoint
3. Enter your webhook URL
4. Select events:
   - ✅ user.created
   - ✅ user.updated
   - ✅ user.deleted
5. **Copy the webhook secret** (starts with `whsec_`)

### Step 4: Add Webhook Secret to Vercel

1. Go back to Vercel Environment Variables
2. Add:
   ```
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Redeploy: `vercel --prod`

### Step 5: Test the Deployment

1. Visit your deployment URL
2. Sign up a new test user
3. Check Supabase tables:
   ```sql
   SELECT * FROM users ORDER BY created_at DESC LIMIT 1;
   SELECT * FROM organizations ORDER BY created_at DESC LIMIT 1;
   SELECT * FROM organization_members ORDER BY created_at DESC LIMIT 1;
   ```

## 🔍 Monitoring

### Vercel Dashboard

- View deployment logs
- Monitor function execution
- Check build status
- View analytics

### Clerk Dashboard

- View webhook delivery logs
- Monitor authentication events
- Check user statistics

### Supabase Dashboard

- Monitor database activity
- View table data
- Check API usage

## 🐛 Troubleshooting

### Build Fails

```bash
# Check build locally first
npm run build

# View Vercel build logs
vercel logs
```

### Environment Variables Not Working

- Ensure all variables are set for "Production, Preview, Development"
- No extra spaces or newlines
- Redeploy after adding variables

### Webhook Not Receiving Events

- Verify webhook URL is correct
- Check Clerk webhook logs
- Verify CLERK_WEBHOOK_SECRET is set
- Check Vercel function logs

### Database Connection Issues

- Verify SUPABASE_SERVICE_ROLE_KEY is correct
- Check Supabase RLS policies
- Verify tables exist

## 📊 Deployment Info

### Project Details

- **Name:** OrdoAgentForge
- **Framework:** React + Vite
- **Node Version:** 18.x (recommended)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Serverless Functions

- **Webhook Handler:** `/api/webhooks/clerk.ts`
- **Runtime:** Node.js
- **Region:** Auto (closest to users)

### Build Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

## 🔐 Security Checklist

- [x] All secrets in environment variables
- [x] No `.env` files in Git
- [x] Webhook signatures verified
- [x] HTTPS enforced
- [x] Service role key server-side only
- [x] CORS properly configured

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ App loads at deployment URL
2. ✅ Users can sign up/sign in
3. ✅ Webhook creates users in database
4. ✅ Organizations are auto-created
5. ✅ No errors in Vercel logs
6. ✅ No errors in Clerk webhook logs

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Clerk Integration Guide](https://clerk.com/docs/deployments/vercel)
- [Supabase + Vercel](https://supabase.com/docs/guides/hosting/vercel)

## 🔄 Continuous Deployment

After initial setup, every push to `main` branch will automatically:

1. Trigger a new build
2. Run tests
3. Deploy to production
4. Update your live site

To disable auto-deploy:

1. Go to Vercel Project Settings
2. Git → Deployment Protection
3. Configure as needed

## 🎯 Next Steps After Deployment

1. ✅ Verify deployment working
2. ✅ Test user registration
3. ✅ Verify webhook functionality
4. 📋 Build dashboard UI (from BUILD_INSTRUCTIONS.md)
5. 📋 Add agent management features
6. 📋 Implement team collaboration
7. 📋 Add analytics and monitoring

---

**Ready to deploy?** Run: `vercel --prod`
