# 🔐 Clerk Quick Start

## ✅ Status: Fully Configured

Clerk authentication is now integrated into your OrdoAgentForge app!

## 🚀 Quick Setup (3 Steps)

### 1. Get Your API Keys

1. Visit [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Create/select your application
3. Go to **API Keys** → Copy both keys

### 2. Add to `.env.local`

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

### 3. Test It

```bash
npm run dev
```

Import `ClerkExample` in your App to see it in action!

## 📦 What's Installed

✅ `@clerk/clerk-react` (v5.60.0)  
✅ `@clerk/clerk-sdk-node` (v4.13.23)  
✅ ClerkProvider configured in `main.tsx`  
✅ Helper functions in `src/lib/clerk-helpers.tsx`  
✅ Example component in `src/ClerkExample.tsx`

## 🎯 Common Use Cases

### Check if User is Signed In

```tsx
import { useAuth } from '@clerk/clerk-react';

function MyComponent() {
  const { isSignedIn } = useAuth();
  return <div>{isSignedIn ? 'Welcome!' : 'Please sign in'}</div>;
}
```

### Get User Info

```tsx
import { useUser } from '@clerk/clerk-react';

function MyComponent() {
  const { user } = useUser();
  return <div>Hello, {user?.firstName}!</div>;
}
```

### Show/Hide Based on Auth

```tsx
import { SignedIn, SignedOut } from '@clerk/clerk-react';

function MyComponent() {
  return (
    <>
      <SignedIn>
        <p>Secret content for logged-in users!</p>
      </SignedIn>
      <SignedOut>
        <p>Please sign in to continue.</p>
      </SignedOut>
    </>
  );
}
```

### User Profile Button

```tsx
import { UserButton } from '@clerk/clerk-react';

function Header() {
  return (
    <header>
      <UserButton />
    </header>
  );
}
```

### Sign Out

```tsx
import { useAuthHelpers } from './lib/clerk-helpers';

function MyComponent() {
  const { signOut } = useAuthHelpers();
  return <button onClick={signOut}>Sign Out</button>;
}
```

## 🔧 Pre-built Components

Clerk provides beautiful, pre-styled components:

- `<SignIn />` - Complete sign-in form
- `<SignUp />` - Complete sign-up form
- `<UserButton />` - User profile dropdown
- `<UserProfile />` - Full profile management

Just drop them in your components!

## 🛡️ Protected Routes

```tsx
import { useAuth } from '@clerk/clerk-react';

function ProtectedPage() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Access Denied</div>;

  return <div>Protected Content</div>;
}
```

## 🎨 Custom Hooks (Included)

We've created helper hooks in `src/lib/clerk-helpers.tsx`:

- `useAuthHelpers()` - All-in-one auth hook
- `useHasRole(role)` - Check user role
- `useHasAnyRole(roles)` - Check multiple roles
- `useUserMetadata()` - Get user metadata
- `<ProtectedContent>` - Wrapper for protected content
- `<RoleProtectedContent>` - Wrapper for role-based content

## 📚 Full Documentation

See `CLERK_SETUP.md` for:

- Advanced features
- Server-side operations
- Webhook setup
- Role-based access control
- Multi-factor authentication
- Supabase integration
- Production deployment
- Troubleshooting

## 🎉 Try the Example

```tsx
// In your App.tsx
import ClerkExample from './ClerkExample';

function App() {
  return <ClerkExample />;
}
```

## 🔒 Security Notes

- ✅ Never commit `.env.local` to git
- ✅ Use test keys for development
- ✅ Use production keys only in production
- ✅ Keep secret keys server-side only
- ✅ Use `VITE_` prefix only for public keys

## 🐛 Common Issues

**"Missing Clerk Publishable Key" error?**  
→ Add `VITE_CLERK_PUBLISHABLE_KEY` to `.env.local` and restart dev server

**CORS errors?**  
→ Add your domain to allowed origins in Clerk Dashboard

**Sign-in modal not opening?**  
→ Check browser console for errors and verify your publishable key

---

**Need Help?**

- 📖 [Full Documentation](./CLERK_SETUP.md)
- 🌐 [Clerk Docs](https://clerk.com/docs)
- 💬 [Clerk Discord](https://clerk.com/discord)

**Ready to go! 🚀**
