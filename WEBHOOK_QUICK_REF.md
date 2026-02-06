# Clerk Webhook - Quick Reference

## Webhook URL

```
https://your-app-name.vercel.app/api/webhooks/clerk
```

## Required Environment Variables

```bash
# In .env.local and Vercel
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_SUPABASE_URL=https://ydebgchglotcdjfegbhs.supabase.co
```

## Events to Enable in Clerk Dashboard

- ✅ `user.created`
- ✅ `user.updated`
- ✅ `user.deleted`

## Setup Steps (Quick)

### 1. Deploy to Vercel

```bash
git push origin main
# Then deploy via Vercel dashboard
```

### 2. Configure Webhook in Clerk

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Navigate to Webhooks → Add Endpoint
3. Enter: `https://your-app-name.vercel.app/api/webhooks/clerk`
4. Select events: `user.created`, `user.updated`, `user.deleted`
5. Copy the webhook secret (starts with `whsec_`)

### 3. Add Secret to Environment

**Vercel:**

- Go to Project Settings → Environment Variables
- Add: `CLERK_WEBHOOK_SECRET=whsec_...`
- Redeploy

**Local:**

```bash
# Add to .env.local
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Test

- Sign up a new user
- Check Supabase tables: `users`, `organizations`, `organization_members`

## What the Webhook Does

### On `user.created`:

1. Creates user in `users` table
2. Creates default organization in `organizations` table
3. Adds user as admin in `organization_members` table

### On `user.updated`:

1. Updates user info in `users` table (email, name, avatar)

### On `user.deleted`:

1. Deletes user from `users` table
2. Cascades to related records

## Troubleshooting

| Issue           | Solution                                           |
| --------------- | -------------------------------------------------- |
| 400 Error       | Check webhook secret is correct                    |
| 500 Error       | Check Supabase credentials and RLS policies        |
| No events       | Verify webhook URL is publicly accessible          |
| Signature fails | Ensure `CLERK_WEBHOOK_SECRET` starts with `whsec_` |

## Testing Locally

```bash
# Install ngrok
npm install -g ngrok

# Start dev server
npm run dev

# Expose to internet (in new terminal)
ngrok http 5173

# Use ngrok URL in Clerk webhook settings
https://xxxx.ngrok.io/api/webhooks/clerk
```

## Monitoring

- **Clerk Dashboard**: Webhooks → Your Endpoint → View Logs
- **Vercel**: Project → Logs → Filter by `api/webhooks/clerk`
- **Supabase**: Check table data directly

## Security ✅

- ✅ Signature verification using Svix
- ✅ HTTPS required
- ✅ Service role key for database access
- ✅ No secrets exposed to client

## Need Help?

See [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md) for detailed instructions.

---

**Status**: Ready to deploy and test! 🚀
