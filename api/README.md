# API Routes

This directory contains serverless API routes that are deployed as Vercel Functions.

## Structure

```
api/
└── webhooks/
    └── clerk.ts          # Clerk webhook endpoint
```

## Webhooks

### Clerk Webhook (`/api/webhooks/clerk`)

Handles user lifecycle events from Clerk and synchronizes data with Supabase.

**Events Handled:**

- `user.created` - Creates user, organization, and membership in Supabase
- `user.updated` - Updates user information in Supabase
- `user.deleted` - Removes user from Supabase

**Setup:** See [WEBHOOK_SETUP.md](../WEBHOOK_SETUP.md) for complete setup instructions.

## Adding New API Routes

To add a new API route:

1. Create a TypeScript file in the `api/` directory
2. Export a default handler function:

   ```typescript
   import type { VercelRequest, VercelResponse } from '@vercel/node';

   export default async function handler(
     req: VercelRequest,
     res: VercelResponse
   ) {
     res.status(200).json({ message: 'Hello World' });
   }
   ```

3. The route will be available at `/api/[filename]`

## Environment Variables

All API routes have access to environment variables defined in:

- `.env.local` (local development)
- Vercel project settings (production)

**Required Variables:**

- `CLERK_WEBHOOK_SECRET` - For webhook signature verification
- `VITE_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (bypass RLS)

## Local Development

API routes are automatically served by Vercel CLI during development:

```bash
npm run dev
```

Routes are accessible at:

- `http://localhost:5173/api/webhooks/clerk`

## Deployment

API routes are automatically deployed as serverless functions when you deploy to Vercel:

```bash
vercel --prod
```

Each route becomes an individual serverless function with:

- 10-second execution timeout (default)
- 1024 MB memory limit (default)
- Automatic HTTPS
- Edge caching when appropriate

## Testing

### Test Webhooks Locally

Use tools like:

- **ngrok** - Expose local server to the internet
- **Clerk Dashboard** - Send test events
- **curl** - Manual HTTP requests

Example:

```bash
curl -X POST http://localhost:5173/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_test" \
  -H "svix-timestamp: $(date +%s)" \
  -H "svix-signature: v1,test" \
  -d '{"type":"user.created","data":{"id":"user_test"}}'
```

## Security

- ✅ All webhook signatures are verified using Svix
- ✅ Environment variables are never exposed to the client
- ✅ Service role key is only used server-side
- ✅ CORS headers can be added as needed

## Monitoring

View function logs in:

- **Local**: Terminal output
- **Production**: Vercel dashboard → Project → Logs

## Best Practices

1. **Always validate input** - Don't trust incoming data
2. **Use TypeScript** - Catch errors at compile time
3. **Handle errors gracefully** - Return appropriate HTTP status codes
4. **Log important events** - For debugging and monitoring
5. **Keep functions stateless** - No shared state between invocations
6. **Minimize cold starts** - Keep dependencies lean

## Documentation

- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Clerk Webhooks](https://clerk.com/docs/integration/webhooks)
- [Supabase Client](https://supabase.com/docs/reference/javascript/introduction)
