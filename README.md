# OrdoAgentForge

> A modern, full-stack web application with authentication, AI integration, and database connectivity.

## 🔢 Version Management

**Automatic versioning on every build!**

Current version is automatically managed and increments with each build:

- Every `npm run build` → Patch version bumps (1.0.0 → 1.0.1)
- `npm run build:minor` → Minor version bumps (1.0.5 → 1.1.0)
- `npm run build:major` → Major version bumps (1.5.2 → 2.0.0)

See [VERSION_MANAGEMENT.md](./VERSION_MANAGEMENT.md) for details.

## 🚀 Tech Stack

### Frontend

- ⚛️ **React 19** with TypeScript
- ⚡ **Vite** for blazing fast development
- 🎨 **ESLint + Prettier** for code quality
- 🧪 **Vitest** with React Testing Library

### Authentication & Database

- � **Clerk** - Modern authentication (Social + Email)
- 🗄️ **Supabase** - PostgreSQL database with real-time capabilities
- 🍃 **MongoDB** - NoSQL database support

### AI & APIs

- 🤖 **Airia API** - AI-powered features with type-safe client
- 📄 **Document Processing** - PDF and Word document support

### DevOps & Deployment

- 🚢 **Vercel** - Production deployment
- 🐕 **Husky** - Git hooks for code quality
- 📦 **GitHub** - Version control

---

## ✅ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` and add your keys:

```bash
# Clerk Authentication (Get from https://dashboard.clerk.com)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Supabase (Get from https://app.supabase.com)
VITE_SUPABASE_URL=https://ydebgchglotcdjfegbhs.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Airia API (Get from your Airia account)
VITE_AIRIA_API_URL=https://api.airia.ai
VITE_AIRIA_API_KEY=your_airia_api_key_here
```

### 3. Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:5173**

---

## 📝 Available Scripts

| Command                 | Description               |
| ----------------------- | ------------------------- |
| `npm run dev`           | Start development server  |
| `npm run build`         | Build for production      |
| `npm run preview`       | Preview production build  |
| `npm test`              | Run tests                 |
| `npm run test:ui`       | Open Vitest UI            |
| `npm run test:coverage` | Generate coverage report  |
| `npm run lint`          | Lint code                 |
| `npm run format`        | Format code with Prettier |
| `npm run type-check`    | Check TypeScript types    |

---

## 🔐 Authentication

**Clerk** is fully integrated with:

- ✅ Sign-in/Sign-out UI components
- ✅ User profile management
- ✅ Social authentication support
- ✅ Email/password authentication
- ✅ Protected routes ready

**Usage:**

```tsx
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';

function MyComponent() {
  const { user } = useUser();

  return (
    <>
      <SignedIn>
        <UserButton />
        <p>Welcome, {user.firstName}!</p>
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  );
}
```

See `CLERK_SETUP.md` for full documentation.

---

## 🗄️ Database

### Supabase (Primary)

Type-safe PostgreSQL with real-time subscriptions.

```typescript
import { supabase } from './lib/supabase';

// Query data
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);
```

See `SUPABASE_SETUP.md` for full documentation.

### MongoDB (Optional)

NoSQL database support with Mongoose.

See `MONGODB_SETUP.md` for configuration.

---

## 🤖 AI Integration

**Airia API** with type-safe client:

```typescript
import { airiaClient } from './lib/airia-client';

// Make AI requests
const response = await airiaClient.chat({
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

See `AIRIA_SDK.md` for full API reference.

---

## 🚢 Deployment

### Vercel (Connected)

**Deploy to production:**

```bash
vercel --prod
```

**Deploy preview:**

```bash
vercel
```

Don't forget to add environment variables in Vercel Dashboard!

See `VERCEL_SETUP.md` for detailed instructions.

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test UI

```bash
npm run test:ui
```

### Coverage Report

```bash
npm run test:coverage
```

Tests are configured with:

- Vitest
- React Testing Library
- Happy DOM
- Coverage reporting

---

## 📚 Documentation

| File                    | Description                           |
| ----------------------- | ------------------------------------- |
| `PROJECT_STATUS.md`     | Complete project status and checklist |
| `CLERK_SETUP.md`        | Clerk authentication guide            |
| `SUPABASE_SETUP.md`     | Supabase database guide               |
| `MONGODB_SETUP.md`      | MongoDB configuration                 |
| `AIRIA_SDK.md`          | Airia API integration                 |
| `VERCEL_SETUP.md`       | Deployment guide                      |
| `SETUP_VERIFICATION.md` | Installation verification             |

---

## 🛠️ VS Code Extensions (All Installed)

1. ESLint - Code linting
2. Prettier - Code formatting
3. ES7+ React Snippets - React snippets
4. Vitest Explorer - Test runner
5. GitLens - Git integration
6. Error Lens - Inline errors
7. Thunder Client - API testing
8. MongoDB for VS Code - Database UI
9. Code Spell Checker - Spell checking
10. Path Intellisense - Path completion

---

## 🔧 Project Structure

```
OrdoAgentForge/
├── src/
│   ├── main.tsx              # App entry with ClerkProvider
│   ├── App.tsx               # Main app with authentication UI
│   ├── lib/
│   │   ├── airia-client.ts   # Airia API client
│   │   ├── airia-api-types.ts # AI API types
│   │   └── supabase.ts       # Supabase client
│   ├── models/               # Database models
│   ├── test/                 # Test utilities
│   └── AiriaExample.tsx      # AI integration example
├── dist/                     # Production build
├── .vscode/                  # VS Code settings
├── .husky/                   # Git hooks
└── *.config.ts              # Configuration files
```

---

## 📋 Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

See `.env.example` for all available variables.

---

## 🔐 Security

- ✅ Environment variables not committed
- ✅ Clerk handles auth securely
- ✅ Supabase row-level security
- ✅ Type-safe API clients
- ✅ Rate limiting ready
- ✅ Helmet security headers
- ✅ CORS configured

---

## 🆘 Troubleshooting

### Build Fails

```bash
npm run build
```

Check for TypeScript errors and environment variables.

### Authentication Not Working

- Verify Clerk keys in `.env.local`
- Add `http://localhost:5173` to Clerk dashboard
- Check browser console for errors

### Database Connection Issues

- Verify Supabase URL and key
- Check project status in Supabase dashboard
- Review network connectivity

---

## 📞 Support & Resources

- **Clerk Docs:** https://clerk.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev/
- **React Docs:** https://react.dev/
- **Vitest Docs:** https://vitest.dev/

---

## 🎯 Next Steps

1. ✅ All dependencies installed
2. ✅ All integrations configured
3. ✅ Authentication UI ready
4. 🔄 Add your API keys to `.env.local`
5. 🔄 Test authentication flow
6. 🔄 Test database connections
7. 🔄 Deploy to production

---

## 📄 License

MIT

---

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Built with ❤️ using React, TypeScript, and Vite**

_For detailed status, see `PROJECT_STATUS.md`_

- Prettier
- ES7+ React/Redux/React-Native snippets
- Vitest Explorer
- GitLens
- Error Lens
- Thunder Client
- MongoDB for VS Code
- Code Spell Checker
- Path Intellisense

## License

ISC
