# 🚀 OrdoAgentForge - Baseline Template

## Overview

This project serves as a **production-ready baseline template** for modern web applications with authentication, database, and AI integrations.

## ✨ What Makes This a Great Baseline

This configuration includes everything you need to start a new web app project:

### 🎯 Core Stack

- ⚛️ **React 19** with TypeScript
- ⚡ **Vite** - Fast build tool and dev server
- 🎨 **Modern CSS** with CSS Modules support

### 🔐 Authentication

- **Clerk** - Production-ready auth system
  - Social logins (Google, GitHub, etc.)
  - Email/password authentication
  - User management and profiles
  - Session handling

### 🗄️ Database Options

- **Supabase** - PostgreSQL with real-time features
- **MongoDB** - NoSQL document database
- Ready-to-use client configurations

### 🤖 AI Integration

- **Airia API** - Type-safe AI client
- OpenAPI-generated TypeScript types
- Example implementations

### 🛠️ Development Tools

- **TypeScript** - Type safety throughout
- **ESLint** - Code quality enforcement
- **Prettier** - Consistent code formatting
- **Vitest** - Fast unit testing
- **Husky** - Git hooks for quality checks
- **lint-staged** - Pre-commit linting

### 🚀 Deployment

- **Vercel** - One-click deployment
- **GitHub Actions** ready
- Environment variable management
- Automatic version bumping

---

## 📦 Using This as a Template

### Option 1: Clone for New Project

```bash
# Clone this repo as a template
git clone https://github.com/michaeltombrown/OrdoAgentForge.git my-new-project
cd my-new-project

# Remove git history and start fresh
rm -rf .git
git init
git add -A
git commit -m "Initial commit from OrdoAgentForge template"

# Create new GitHub repo and push
git remote add origin https://github.com/yourusername/my-new-project.git
git branch -M main
git push -u origin main
```

### Option 2: Use GitHub Template

1. Go to: https://github.com/michaeltombrown/OrdoAgentForge
2. Click **"Use this template"**
3. Create your new repository
4. Clone and start building!

### Option 3: Manual Setup Checklist

Use the configuration files from this project:

```bash
# Core config files to copy
├── .vscode/settings.json          # VS Code configuration
├── .gitignore                     # Git ignore patterns
├── .prettierrc.json               # Prettier config
├── .lintstagedrc.json            # Lint-staged config
├── eslint.config.js               # ESLint configuration
├── tsconfig.json                  # TypeScript config
├── tsconfig.node.json             # TypeScript Node config
├── vite.config.ts                 # Vite configuration
├── vitest.config.ts               # Vitest configuration
├── vercel.json                    # Vercel deployment config
└── package.json                   # Dependencies and scripts
```

---

## 🔧 Quick Start for New Project

### 1. Copy Configuration Files

```bash
# From your OrdoAgentForge directory
cp .vscode/settings.json ../my-new-project/.vscode/
cp .gitignore ../my-new-project/
cp .prettierrc.json ../my-new-project/
cp .lintstagedrc.json ../my-new-project/
cp eslint.config.js ../my-new-project/
cp tsconfig.json ../my-new-project/
cp tsconfig.node.json ../my-new-project/
cp vite.config.ts ../my-new-project/
cp vitest.config.ts ../my-new-project/
cp vercel.json ../my-new-project/
cp -r scripts/ ../my-new-project/
```

### 2. Copy Package.json (or merge dependencies)

```json
{
  "dependencies": {
    "@clerk/clerk-react": "^5.60.0",
    "@supabase/supabase-js": "^2.95.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.13",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.3",
    "@typescript-eslint/eslint-plugin": "^8.54.0",
    "@typescript-eslint/parser": "^8.54.0",
    "eslint": "^9.39.2",
    "prettier": "^3.5.3",
    "typescript": "~5.8.4",
    "vite": "^7.3.1",
    "vitest": "^4.0.18"
  }
}
```

### 3. Copy Helper Files

```bash
# Copy utility/helper files
cp -r src/lib/ ../my-new-project/src/
cp src/vite-env.d.ts ../my-new-project/src/
cp src/test/setup.ts ../my-new-project/src/test/
```

### 4. Set Up Environment Variables

```bash
# Copy .env.example as template
cp .env.example ../my-new-project/

# Update with your own keys
# - Clerk keys from dashboard.clerk.com
# - Supabase keys from app.supabase.com
# - Any other API keys
```

### 5. Initialize Git and Husky

```bash
cd ../my-new-project
npm install
npx husky init
git add -A
git commit -m "Initial commit from template"
```

---

## 🎨 Customization Guide

### Update Project Name

1. **package.json**: Change `"name"` field
2. **README.md**: Update title and description
3. **index.html**: Update `<title>` tag
4. **Vercel**: Update project name in deployment

### Remove Unwanted Integrations

#### Don't need Clerk?

```bash
npm uninstall @clerk/clerk-react @clerk/clerk-sdk-node
# Remove src/lib/clerk-helpers.tsx
# Remove ClerkProvider from src/main.tsx
# Delete CLERK_*.md documentation files
```

#### Don't need Supabase?

```bash
npm uninstall @supabase/supabase-js
# Remove src/lib/supabase.ts
# Delete SUPABASE_*.md documentation files
```

#### Don't need Airia?

```bash
# Remove src/lib/airia-client.ts
# Remove src/lib/airia-api-types.ts
# Delete airia-openapi.json
# Delete AIRIA_*.md documentation files
```

### Add New Integrations

Follow the same pattern as existing integrations:

1. Create helper file in `src/lib/`
2. Add environment variables to `.env.example`
3. Create documentation in `INTEGRATION_NAME_SETUP.md`
4. Add example component if needed

---

## 📋 Features to Keep for Every Project

### ✅ Always Include:

- TypeScript configuration
- ESLint + Prettier
- Git hooks (Husky)
- Version management system
- Basic project structure
- Development scripts
- Testing setup
- Environment variable template

### 🔄 Customize Per Project:

- Authentication provider (Clerk, Auth0, etc.)
- Database choice (Supabase, MongoDB, PostgreSQL, etc.)
- API integrations
- UI framework/library
- State management
- Routing solution

---

## 🗂️ Project Structure

```
my-new-project/
├── .vscode/                  # VS Code settings
├── .husky/                   # Git hooks
├── scripts/                  # Build scripts
│   └── bump-version.js       # Auto-versioning
├── src/
│   ├── lib/                  # Helper functions
│   │   ├── clerk-helpers.tsx
│   │   ├── supabase.ts
│   │   └── airia-client.ts
│   ├── test/                 # Test setup
│   ├── main.tsx             # App entry point
│   ├── App.tsx              # Main component
│   └── version.ts           # Auto-generated version
├── .env.example             # Environment template
├── .env.local               # Local secrets (not committed)
├── .gitignore
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 🚦 Recommended Workflow

### Starting a New Project

1. **Clone Template**

   ```bash
   git clone https://github.com/michaeltombrown/OrdoAgentForge.git my-project
   cd my-project
   rm -rf .git
   git init
   ```

2. **Clean Up**
   - Remove example components you don't need
   - Delete unused documentation files
   - Update package.json name/description

3. **Configure**
   - Set up environment variables
   - Get API keys for services you'll use
   - Update README with your project details

4. **Start Development**

   ```bash
   npm install
   npm run dev
   ```

5. **First Commit**
   ```bash
   git add -A
   git commit -m "Initial commit from OrdoAgentForge template"
   ```

---

## 🎯 Use Cases

This baseline is perfect for:

### ✅ SaaS Applications

- User authentication built-in
- Database ready
- Payment integration ready (add Stripe)

### ✅ AI-Powered Apps

- Airia API integration
- Type-safe API clients
- Example implementations

### ✅ Dashboard/Admin Panels

- User management
- Real-time data (Supabase)
- Protected routes

### ✅ Mobile-First Web Apps

- Responsive setup
- PWA-ready
- Fast performance (Vite)

### ✅ MVPs and Prototypes

- Quick setup
- All integrations ready
- Deploy in minutes

---

## 📦 What You Get Out of the Box

### Instant Features

✅ User authentication (Clerk)  
✅ Database connectivity (Supabase/MongoDB)  
✅ Type-safe development (TypeScript)  
✅ Code quality checks (ESLint/Prettier)  
✅ Automated testing (Vitest)  
✅ Version management (auto-bump)  
✅ Git hooks (pre-commit checks)  
✅ Deployment config (Vercel)  
✅ Environment management  
✅ Documentation templates

### Developer Experience

✅ Hot Module Replacement (HMR)  
✅ Fast builds (Vite)  
✅ IntelliSense support  
✅ Auto-formatting on save  
✅ Pre-commit linting  
✅ Comprehensive error messages

---

## 🔐 Security Best Practices Included

✅ Environment variables in `.env.local` (not tracked)  
✅ `.gitignore` configured properly  
✅ Secret key validation  
✅ CORS configuration  
✅ TypeScript strict mode  
✅ ESLint security rules

---

## 📚 Documentation as Template

All documentation files can be used as templates:

- `README.md` - Main project documentation
- `SETUP_COMPLETE.md` - Setup checklist
- `CLERK_SETUP.md` - Authentication guide
- `SUPABASE_SETUP.md` - Database guide
- `VERSION_MANAGEMENT.md` - Versioning system
- `VERCEL_SETUP.md` - Deployment guide

Simply find/replace "OrdoAgentForge" with your project name!

---

## 🎓 Learning Resource

This baseline also serves as:

- **Reference Implementation** - See how integrations work
- **Best Practices Guide** - Learn proper project structure
- **Configuration Examples** - Copy configs for new tools
- **Documentation Template** - Learn how to document projects

---

## 🔄 Keeping Your Template Updated

### To update your template with new features:

```bash
# In your OrdoAgentForge directory
git pull origin main

# Copy updated files to your projects
cp vite.config.ts ../my-project/
cp package.json ../my-project/  # (merge dependencies)
```

### Version This Template

Consider tagging versions of your baseline:

```bash
git tag -a v1.0.0 -m "Baseline template v1.0.0"
git push origin v1.0.0
```

---

## 🚀 Next Steps

### For Your Next Project:

1. ✅ Clone this repo or use as GitHub template
2. ✅ Customize for your specific needs
3. ✅ Add project-specific features
4. ✅ Deploy and ship!

### Enhancements to Consider:

- 🔄 Add React Router for multi-page apps
- 🎨 Add Tailwind CSS or styled-components
- 📱 Add PWA support
- 💳 Add Stripe for payments
- 📧 Add email service (SendGrid, Resend)
- 🔍 Add analytics (Vercel Analytics, Google Analytics)
- 🌍 Add i18n for internationalization
- 📊 Add logging service (Sentry, LogRocket)

---

## ✨ Summary

**YES, absolutely use this as your baseline!**

This configuration includes:

- ✅ Modern, production-ready tech stack
- ✅ All essential integrations configured
- ✅ Comprehensive documentation
- ✅ Best practices implemented
- ✅ Ready to clone and customize
- ✅ Saves hours/days of setup time

Every new project will benefit from this solid foundation!

---

**Created by**: Michael  
**Date**: February 6, 2026  
**Version**: 1.0.2  
**License**: Use freely for any project  
**Repository**: https://github.com/michaeltombrown/OrdoAgentForge
