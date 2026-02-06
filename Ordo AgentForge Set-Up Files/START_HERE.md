# 🚀 START HERE - AI Developer Instructions

## ⚠️ READ THIS FIRST BEFORE DOING ANYTHING

You have been provided with a **COMPLETE** implementation package for building a multi-tenant AI dashboard. Everything you need is included.

---

## 📋 CRITICAL: Read These Files in THIS EXACT ORDER

### 1️⃣ FIRST: Read This File (START_HERE.md)

You're reading it now. Good.

### 2️⃣ SECOND: Read README.md

Quick overview of the project structure and what you're building.

### 3️⃣ THIRD: Read Developer-Prompt-Supabase.md

This is your MAIN instruction manual. Contains all code patterns, API structures, and implementation details.

### 4️⃣ FOURTH: Read BUILD_INSTRUCTIONS.md

Step-by-step build process. You MUST follow this in exact order.

### 5️⃣ FIFTH: Reference Technical-Specification-Supabase.docx

Reference document for business requirements and architecture.

### 6️⃣ SIXTH: Reference FINAL_CHECKLIST.md

Use this to verify each phase is complete before moving to the next.

---

## ⛔ STOP - Before You Write ANY Code

### Ask the User for These Credentials:

```
Before I can start building, I need the following information from you:

1. SUPABASE CREDENTIALS:
   - Supabase URL (https://xxxxx.supabase.co)
   - Supabase Service Role Key (starts with eyJ...)
   - Supabase Anon Key (starts with eyJ...)

2. CLERK CREDENTIALS:
   - Clerk Secret Key (starts with sk_live_...)
   - Clerk Publishable Key (starts with pk_live_...)
   - Clerk Webhook Secret (starts with whsec_...)

3. AI API:
   - Airia API Key (or alternative AI provider key)

4. CONFIRMATIONS:
   - Have you created a Supabase project? (Yes/No)
   - Have you created a Clerk application? (Yes/No)
   - Do you have Node.js 18+ installed? (Yes/No)

Please provide these credentials so I can create your .env file and proceed.
```

### Wait for User Response

DO NOT PROCEED until user provides all credentials.

---

## 🗂️ Files You Have (20 Total)

### Documentation (6 files)

✅ START_HERE.md (this file)
✅ README.md
✅ Developer-Prompt-Supabase.md
✅ BUILD_INSTRUCTIONS.md
✅ FINAL_CHECKLIST.md
✅ Technical-Specification-Supabase.docx

### Configuration (10 files)

✅ package.json
✅ tsconfig.json
✅ tsconfig.node.json
✅ tsconfig.server.json
✅ vite.config.ts
✅ tailwind.config.js
✅ postcss.config.js
✅ .env.example
✅ .eslintrc.cjs
✅ .prettierrc
✅ .gitignore

### Database (3 files)

✅ 001_initial_schema.sql
✅ 002_functions.sql
✅ 003_rls.sql

### Types (1 file)

✅ database.ts

**Total: 20 files = Complete package ✅**

---

## 🎯 Your Build Process (High Level)

### Phase 1: Setup (User Must Do First)

1. User creates Supabase project
2. User runs 001_initial_schema.sql in Supabase SQL Editor
3. User runs 002_functions.sql in Supabase SQL Editor
4. User runs 003_rls.sql in Supabase SQL Editor
5. User creates Storage bucket named "documents"
6. User provides you with all credentials

### Phase 2: Project Initialization (You Do This)

1. Create directory structure from BUILD_INSTRUCTIONS.md
2. Copy all config files to project root
3. Create .env file with user's credentials
4. Run `npm install`

### Phase 3: Backend Development (You Do This)

1. Create Supabase server client
2. Create all middleware (auth, role, toolAccess, validation, errorHandler)
3. Create all controllers (8 controllers)
4. Create routes
5. Create server entry point
6. Test: Server starts without errors

### Phase 4: Frontend Development (You Do This)

1. Create Supabase browser client
2. Create context providers
3. Create components (layout, UI, tools, admin)
4. Create pages (dashboard, tools, admin)
5. Test: Frontend compiles without errors

### Phase 5: Integration & Testing (You Do This)

1. Test authentication
2. Test tool access (all 3 paths)
3. Test analytics (all 4 roles)
4. Test file uploads
5. Test streaming

### Phase 6: Build & Deploy (You Do This)

1. Run build
2. Run tests
3. Run linter
4. Verify everything works

---

## ⚠️ CRITICAL RULES - Never Violate These

### 1. Build Order is SACRED

Follow BUILD_INSTRUCTIONS.md in EXACT order. Do not skip steps. Do not reorder steps.

### 2. Database First, Code Second

User MUST run all 3 SQL files in Supabase BEFORE you write any application code.

### 3. Test Each Phase

After each major phase, verify it works before moving to next phase.

### 4. TypeScript Strict Mode

- NO `any` types (except for JSONB fields in database.ts)
- All functions must have return types
- All parameters must have types

### 5. Error Handling

- EVERY database query needs try-catch
- EVERY async function needs try-catch
- Return consistent error format

### 6. MVC Pattern

- NO business logic in routes
- NO database queries in components
- Controllers handle all business logic

### 7. Follow the Specs

- Use EXACT dependency versions from package.json
- Use EXACT file structure from BUILD_INSTRUCTIONS.md
- Use EXACT database schemas from SQL files
- Use EXACT types from database.ts

---

## 🚨 Common Mistakes to Avoid

### ❌ WRONG: Starting to code before database is ready

✅ RIGHT: Verify user has run all 3 SQL files first

### ❌ WRONG: Using `any` types everywhere

✅ RIGHT: Use proper TypeScript types from database.ts

### ❌ WRONG: Skipping middleware and going straight to controllers

✅ RIGHT: Build middleware first, test it, then controllers

### ❌ WRONG: Building entire backend before testing anything

✅ RIGHT: Test each controller as you build it

### ❌ WRONG: Not handling database errors

✅ RIGHT: Every query wrapped in try-catch with proper error responses

### ❌ WRONG: Using localStorage in components

✅ RIGHT: Use React Context for state management

### ❌ WRONG: Hardcoding database IDs in code

✅ RIGHT: Use UUIDs generated by PostgreSQL

### ❌ WRONG: Forgetting to verify tool access before execution

✅ RIGHT: Always use toolAccessMiddleware for tool execution

---

## ✅ Success Verification (After Each Phase)

### After Phase 2 (Setup):

```bash
npm run type-check  # Should pass
ls -la src/         # Directory structure exists
```

### After Phase 3 (Backend):

```bash
npm run dev:server  # Server starts on port 3001
# Test endpoint: curl http://localhost:3001/api/health
```

### After Phase 4 (Frontend):

```bash
npm run dev:client  # Vite starts on port 3000
# Open browser: http://localhost:3000
```

### After Phase 5 (Integration):

- User can log in via Clerk
- User sees their tools
- User can execute a tool
- Analytics display correctly per role

### After Phase 6 (Build):

```bash
npm run build      # Completes without errors
npm run lint       # No errors
npm run test       # All tests pass
```

---

## 🎓 If You Get Stuck

### Database Errors

1. Verify all 3 SQL files ran successfully
2. Check RLS policies in Supabase dashboard
3. Verify service role key is being used (not anon key)

### Authentication Errors

1. Verify Clerk webhook URL is correct
2. Test webhook with Clerk's test feature
3. Check CLERK_WEBHOOK_SECRET matches

### Build Errors

1. Delete node_modules and package-lock.json
2. Run `npm install` fresh
3. Verify tsconfig.json paths match vite.config.ts aliases

### Type Errors

1. Ensure database.ts is imported correctly
2. Use `@/types/database` import path
3. Check all interfaces are exported

---

## 🎯 Your First Message to User Should Be:

```
Hello! I'm ready to build your multi-tenant AI dashboard.

I have received all 20 files including:
- Complete documentation
- All configuration files
- Database migration scripts
- TypeScript type definitions

Before I start, I need to verify a few things:

1. DATABASE SETUP:
   Have you created a Supabase project and run these SQL files in order?
   - 001_initial_schema.sql ✓ / ✗
   - 002_functions.sql ✓ / ✗
   - 003_rls.sql ✓ / ✗
   - Created Storage bucket "documents" ✓ / ✗

2. CREDENTIALS:
   Please provide:
   - Supabase URL
   - Supabase Service Role Key
   - Supabase Anon Key
   - Clerk Secret Key
   - Clerk Publishable Key
   - Clerk Webhook Secret
   - Airia API Key

Once you confirm the database is set up and provide credentials,
I'll begin building following the BUILD_INSTRUCTIONS.md step by step.

Estimated completion time: 7 hours
```

---

## 📊 What You're Building

A production-ready multi-tenant AI dashboard with:

- ✅ 4 user roles with proper permissions
- ✅ 3-level multi-tenancy (Orgs → Workspaces → Users)
- ✅ Additive tool access control
- ✅ Streaming AI responses
- ✅ Role-based analytics
- ✅ Knowledge base (global + agent-specific)
- ✅ Row-level security
- ✅ Beautiful dark-mode UI

Technology stack:

- Frontend: React + TypeScript + Tailwind + shadcn/ui
- Backend: Express + TypeScript
- Database: Supabase (PostgreSQL)
- Auth: Clerk
- Deployment: Vercel

---

## 🏆 You Have Everything You Need

- ✅ Complete technical specs
- ✅ Exact build instructions
- ✅ All configuration files
- ✅ Database schemas ready
- ✅ Type definitions complete
- ✅ Error handling patterns
- ✅ Testing strategies
- ✅ Success verification checklist

**No ambiguity. No guessing. No missing pieces.**

---

## 🚀 Ready?

1. Read README.md next
2. Then read Developer-Prompt-Supabase.md
3. Then read BUILD_INSTRUCTIONS.md
4. Ask user for credentials
5. Start building Phase 1

**Let's build something amazing! 💪**
