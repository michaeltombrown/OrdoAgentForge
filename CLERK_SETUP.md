# Clerk Authentication Setup Guide

## ✅ INTEGRATION COMPLETE!

Clerk is fully integrated and ready to use! The authentication UI has been added to the main app.

## 🎯 Overview

Clerk is fully integrated into your OrdoAgentForge application! This guide covers configuration, usage, and best practices.

## 📦 Installed Packages

- `@clerk/clerk-react` (v5.60.0) - React SDK for Clerk authentication
- `@clerk/clerk-sdk-node` (v4.13.23) - Node.js SDK for server-side operations

## ✨ What's Already Done

✅ ClerkProvider wrapped around the app in `src/main.tsx`
✅ Authentication UI components integrated in `src/App.tsx`
✅ Sign-in/Sign-out buttons with modal
✅ User profile dropdown with UserButton
✅ Conditional rendering for authenticated/non-authenticated users
✅ User data display (name, email, username)

## 🔐 Configuration

### 1. Get Your Clerk API Keys

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign up or log in
3. Create a new application or select an existing one
4. Go to **API Keys** in the sidebar
5. Copy your **Publishable Key** and **Secret Key**

### 2. Add Environment Variables

Update your `.env.local` file:

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

⚠️ **Important**:

- The `VITE_` prefix exposes the variable to the client-side
- Never commit your `.env.local` file to version control
- Only use test keys for development

### 3. Configure Clerk Dashboard

In your Clerk dashboard, configure:

#### **Allowed Origins** (Under Settings → Domains)

- `http://localhost:5173` (Vite dev server)
- Your production domain

#### **Sign-in Options** (Under User & Authentication → Email, Phone, Username)

- Email address (recommended)
- Social logins (Google, GitHub, etc.)
- Username
- Phone number

#### **User Profile** (Under User & Authentication → Profile)

- Required fields
- Optional fields
- Custom metadata

## 🚀 Usage

### Basic Authentication

The app is already wrapped with `ClerkProvider` in `src/main.tsx`:

```tsx
import { ClerkProvider } from '@clerk/clerk-react';

<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
  <App />
</ClerkProvider>;
```

### Using Clerk Components

```tsx
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  useAuth,
} from '@clerk/clerk-react';

function MyComponent() {
  return (
    <>
      <SignedOut>
        <button onClick={() => clerk.openSignIn()}>Sign In</button>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
```

### Using Custom Hooks

We've created helper functions in `src/lib/clerk-helpers.ts`:

```tsx
import { useAuthHelpers } from './lib/clerk-helpers';

function MyComponent() {
  const { isSignedIn, userName, userEmail, signOut, openSignIn } =
    useAuthHelpers();

  return (
    <div>
      {isSignedIn ? (
        <>
          <p>Welcome, {userName}!</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={openSignIn}>Sign In</button>
      )}
    </div>
  );
}
```

### Protected Content

```tsx
import { ProtectedContent } from './lib/clerk-helpers';

function MyComponent() {
  return (
    <ProtectedContent fallback={<p>Please sign in</p>}>
      <p>Secret content only for authenticated users!</p>
    </ProtectedContent>
  );
}
```

### Role-Based Access Control

```tsx
import { RoleProtectedContent, useHasRole } from './lib/clerk-helpers';

function AdminPanel() {
  return (
    <RoleProtectedContent
      requiredRole="admin"
      fallback={<p>Admin access required</p>}
    >
      <div>Admin Panel Content</div>
    </RoleProtectedContent>
  );
}
```

## 🎨 Pre-built Components

Clerk provides styled components you can drop in:

### Sign In Component

```tsx
import { SignIn } from '@clerk/clerk-react';

<SignIn />;
```

### Sign Up Component

```tsx
import { SignUp } from '@clerk/clerk-react';

<SignUp />;
```

### User Button

```tsx
import { UserButton } from '@clerk/clerk-react';

<UserButton />;
```

## 🔧 Advanced Features

### Custom User Metadata

Add custom data to users in Clerk Dashboard or via API:

```tsx
// Read metadata
import { useUser } from '@clerk/clerk-react';

function MyComponent() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  const preferences = user?.unsafeMetadata?.preferences;
}
```

```tsx
// Update metadata (client-side)
const { user } = useUser();

await user?.update({
  unsafeMetadata: {
    preferences: { theme: 'dark' },
  },
});
```

### Server-Side Operations

Use `@clerk/clerk-sdk-node` for backend operations:

```typescript
import { createClerkClient } from '@clerk/clerk-sdk-node';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Get user
const user = await clerkClient.users.getUser('user_id');

// Update metadata (server-side only)
await clerkClient.users.updateUserMetadata('user_id', {
  publicMetadata: { role: 'admin' },
  privateMetadata: { internalId: '12345' },
});
```

### Session Management

```tsx
import { useSession } from '@clerk/clerk-react';

function MyComponent() {
  const { session, isLoaded, isSignedIn } = useSession();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      Session ID: {session?.id}
      Active since: {session?.lastActiveAt}
    </div>
  );
}
```

### Multi-Factor Authentication

Enable in Clerk Dashboard under **User & Authentication → Multi-factor**.

Users can set up:

- SMS
- Authenticator app (TOTP)
- Backup codes

## 🌐 Routing Integration

For protected routes, create a wrapper component:

```tsx
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}

// Usage
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>;
```

## 🔄 Integration with Supabase

Clerk can work alongside Supabase. Here's how to sync users:

```tsx
import { useAuth } from '@clerk/clerk-react';
import { supabase } from './lib/supabase';

async function syncUserWithSupabase() {
  const { userId, getToken } = useAuth();

  // Get Clerk session token
  const token = await getToken({ template: 'supabase' });

  // Use token with Supabase
  const { data, error } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: token,
  });
}
```

## 📱 Webhooks

Set up webhooks to sync user data with your backend:

1. In Clerk Dashboard, go to **Webhooks**
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `session.created`

Example webhook handler:

```typescript
import { Webhook } from '@clerk/clerk-sdk-node';

export async function POST(req: Request) {
  const payload = await req.text();
  const headers = req.headers;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  const evt = wh.verify(payload, {
    'svix-id': headers.get('svix-id')!,
    'svix-timestamp': headers.get('svix-timestamp')!,
    'svix-signature': headers.get('svix-signature')!,
  });

  const { type, data } = evt;

  if (type === 'user.created') {
    // Sync user to your database
    console.log('User created:', data);
  }
}
```

## 🚀 Production Deployment (Vercel)

### Environment Variables

In Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add:
   - `VITE_CLERK_PUBLISHABLE_KEY` → Your production publishable key
   - `CLERK_SECRET_KEY` → Your production secret key

### Domain Configuration

1. Add your production domain to Clerk's allowed origins
2. Update redirect URLs in Clerk Dashboard

## 📝 Example Component

See `src/ClerkExample.tsx` for a complete working example with:

- Sign in/sign up buttons
- User profile display
- Protected content
- Session management

## 🔒 Security Best Practices

1. **Never expose secret keys** - Only use `VITE_` prefix for publishable keys
2. **Use separate keys** for development and production
3. **Enable MFA** for admin accounts
4. **Implement rate limiting** on auth endpoints
5. **Use role-based access control** for sensitive features
6. **Regularly rotate** API keys
7. **Monitor suspicious activity** in Clerk Dashboard

## 🐛 Troubleshooting

### "Missing Clerk Publishable Key" Error

- Ensure `VITE_CLERK_PUBLISHABLE_KEY` is in `.env.local`
- Restart dev server after adding env vars

### CORS Errors

- Add your domain to allowed origins in Clerk Dashboard
- Check that you're using the correct publishable key

### Sign-in Modal Not Opening

- Ensure ClerkProvider wraps your app
- Check browser console for errors
- Verify publishable key is valid

### User Data Not Loading

- Check network tab for API errors
- Ensure user is actually signed in
- Verify Clerk dashboard shows the user

## 📚 Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK Reference](https://clerk.com/docs/references/react/overview)
- [Clerk Dashboard](https://dashboard.clerk.com)
- [Clerk Discord Community](https://clerk.com/discord)

## ✅ Testing the Integration

1. Start your dev server: `npm run dev`
2. The app should load without errors
3. Try the example component: Import `ClerkExample` in your App
4. Create a test account
5. Verify sign in/sign out works
6. Check user data displays correctly

---

**Your Clerk integration is complete! 🎉**

For questions or issues, refer to the [Clerk documentation](https://clerk.com/docs) or check the example component.
