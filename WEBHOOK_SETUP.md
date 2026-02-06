# Clerk Webhook Setup Guide

This guide will walk you through setting up the Clerk webhook endpoint for your application.

## Overview

The webhook endpoint (`/api/webhooks/clerk`) handles Clerk user events and synchronizes user data with your Supabase database. It automatically:

- **Creates users** in Supabase when they sign up in Clerk
- **Creates a default organization** for each new user
- **Adds users as admin** to their default organization
- **Updates user data** when changes are made in Clerk
- **Handles user deletion** when users are removed from Clerk

## Prerequisites

Before setting up the webhook, ensure you have:

1. ✅ Clerk account set up with your application
2. ✅ Supabase project with database tables created (users, organizations, organization_members)
3. ✅ All environment variables configured in `.env.local`

## Step 1: Deploy Your Application to Vercel

The webhook endpoint needs to be publicly accessible for Clerk to send events to it.

1. **Push your code to GitHub** (if not already done):

   ```bash
   git add .
   git commit -m "Add Clerk webhook endpoint"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Configure environment variables (see below)
   - Deploy

3. **Configure Environment Variables in Vercel**:
   Go to your project settings and add these environment variables:

   ```
   VITE_SUPABASE_URL=https://ydebgchglotcdjfegbhs.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZWJnY2hnbG90Y2RqZmVnYmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3MDQ3NDMsImV4cCI6MjA1MjI4MDc0M30.8ohQl1hWiF8A3X2XVbSQTXK8g08bYuZV6Mx5cI5czyk
   SUPABASE_SERVICE_ROLE_KEY=[Your Service Role Key]
   VITE_CLERK_PUBLISHABLE_KEY=[Your Clerk Publishable Key]
   CLERK_SECRET_KEY=[Your Clerk Secret Key]
   CLERK_WEBHOOK_SECRET=[You'll get this in Step 2]
   VITE_AIRIA_API_KEY=[Your Airia API Key]
   ```

4. **Note your deployment URL**:
   After deployment, your URL will be something like:
   ```
   https://your-app-name.vercel.app
   ```

## Step 2: Create Webhook in Clerk Dashboard

1. **Go to the Clerk Dashboard**:
   - Navigate to [dashboard.clerk.com](https://dashboard.clerk.com)
   - Select your application

2. **Configure the Webhook**:
   - Go to "Webhooks" in the left sidebar
   - Click "Add Endpoint"
   - Enter your webhook URL:
     ```
     https://your-app-name.vercel.app/api/webhooks/clerk
     ```
   - Select the following events:
     - ✅ `user.created`
     - ✅ `user.updated`
     - ✅ `user.deleted`
3. **Get the Webhook Secret**:
   - After creating the webhook, Clerk will show you a webhook signing secret
   - It starts with `whsec_`
   - **Copy this secret immediately** (you won't be able to see it again)
   - Example format: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

4. **Add the Secret to Vercel**:
   - Go back to your Vercel project settings
   - Add a new environment variable:
     ```
     CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
   - Redeploy your application for the changes to take effect

5. **Add the Secret to Local Development**:
   Update your `.env.local` file:
   ```bash
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## Step 3: Test the Webhook

### Option 1: Test with Clerk Dashboard

1. Go to your webhook in the Clerk Dashboard
2. Click "Testing" tab
3. Send a test `user.created` event
4. Check the webhook logs to see if it was successful

### Option 2: Test with Real User Signup

1. Go to your application
2. Sign up a new user
3. Check your Supabase database:
   ```sql
   SELECT * FROM users ORDER BY created_at DESC LIMIT 1;
   SELECT * FROM organizations ORDER BY created_at DESC LIMIT 1;
   SELECT * FROM organization_members ORDER BY created_at DESC LIMIT 1;
   ```
4. You should see:
   - A new user record with the Clerk user ID
   - A new organization created for that user
   - The user added as an admin member of the organization

## Webhook Endpoint Details

### URL Structure

```
POST /api/webhooks/clerk
```

### Headers Required

- `svix-id`: Message ID from Clerk
- `svix-timestamp`: Timestamp from Clerk
- `svix-signature`: Signature from Clerk for verification

### Events Handled

#### `user.created`

- Creates user in `users` table
- Creates default organization in `organizations` table
- Adds user as admin to organization in `organization_members` table

#### `user.updated`

- Updates user information in `users` table
- Syncs email, full name, and avatar URL

#### `user.deleted`

- Deletes user from `users` table
- Related records cascade due to foreign key constraints

### Response Codes

- `200`: Success
- `400`: Bad request (missing headers or invalid signature)
- `405`: Method not allowed (non-POST request)
- `500`: Server error (database issues, etc.)

## Troubleshooting

### Webhook Not Receiving Events

1. **Check Webhook URL**: Make sure it's publicly accessible

   ```bash
   curl https://your-app-name.vercel.app/api/webhooks/clerk
   ```

   Should return a 405 error (Method Not Allowed) for GET requests

2. **Verify Environment Variables**: Check Vercel dashboard
   - All required variables are set
   - No typos in variable names
   - Webhook secret is correct

3. **Check Clerk Dashboard**:
   - Webhook is enabled
   - Correct events are selected
   - No error messages in webhook logs

### Signature Verification Fails

- **Symptom**: 400 error with "Invalid signature"
- **Solution**:
  - Make sure `CLERK_WEBHOOK_SECRET` is correct
  - Verify it starts with `whsec_`
  - No extra spaces or newlines in the secret

### Database Errors

- **Symptom**: 500 error in webhook logs
- **Solution**:
  - Check Supabase credentials
  - Verify all database tables exist
  - Check RLS policies allow service role to insert/update/delete
  - Review Vercel function logs for detailed error messages

### User Not Created in Database

1. Check webhook execution in Clerk Dashboard
2. Check Vercel function logs for errors
3. Verify Supabase connection and credentials
4. Check database table structure matches expectations

## Local Development

For local webhook testing during development:

1. **Use Clerk's Test Mode**:
   - Clerk provides test mode for development
   - Uses a different publishable key
   - Can test webhooks without deploying

2. **Use ngrok for Local Testing**:

   ```bash
   # Install ngrok
   npm install -g ngrok

   # Start your dev server
   npm run dev

   # In another terminal, expose your local server
   ngrok http 5173

   # Use the ngrok URL in Clerk webhook settings
   https://xxxx-xx-xx-xx-xx.ngrok.io/api/webhooks/clerk
   ```

3. **Use Svix Play** (Clerk's Webhook Testing Tool):
   - Go to the webhook in Clerk Dashboard
   - Use the "Testing" tab to send test events

## Security Best Practices

1. ✅ **Always verify webhook signatures** - The endpoint already does this using the Svix library
2. ✅ **Use HTTPS** - Required for production webhooks
3. ✅ **Keep webhook secret secure** - Never commit to Git, only in environment variables
4. ✅ **Use service role key** - Required for bypassing RLS policies
5. ✅ **Log webhook events** - For debugging and audit trails
6. ✅ **Handle errors gracefully** - Return appropriate status codes

## Monitoring

### Check Webhook Health

1. **Clerk Dashboard**:
   - Go to Webhooks → Your Endpoint
   - View delivery history and success rate
   - Check for failed deliveries

2. **Vercel Logs**:
   - Go to your project → Logs
   - Filter by function: `api/webhooks/clerk`
   - Look for errors or warnings

3. **Supabase Logs**:
   - Check for database errors
   - Monitor table growth
   - Verify data integrity

## Next Steps

After setting up the webhook:

1. ✅ Test user registration flow end-to-end
2. ✅ Verify organization creation
3. ✅ Test user profile updates
4. ✅ Set up monitoring and alerting
5. ✅ Document your webhook events for your team

## Additional Resources

- [Clerk Webhooks Documentation](https://clerk.com/docs/integration/webhooks)
- [Svix Webhook Verification](https://docs.svix.com/receiving/verifying-payloads/how)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Supabase Service Role](https://supabase.com/docs/guides/api/using-service-key)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Vercel function logs
3. Check Clerk webhook delivery logs
4. Verify all environment variables are correct
5. Test with a fresh user signup

---

**Ready to proceed?** Once you have your webhook secret from Clerk, add it to both:

- Your `.env.local` file for local development
- Your Vercel environment variables for production

Then test the webhook by signing up a new user! 🚀
