# Vercel Deployment Guide

## Setup Complete! ✅

Your project is now configured for Vercel deployment at:
**https://vercel.com/michaeltombrowns-projects/ordoagentforge**

## What's Been Configured:

1. ✅ Vercel CLI installed as dev dependency
2. ✅ `vercel.json` configuration created
3. ✅ Deployment scripts added to package.json
4. ✅ Vercel VS Code extension installed

## Configuration Details:

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

## How to Connect & Deploy:

### Option 1: Using Vercel CLI (Recommended)

1. **Login to Vercel:**

   ```bash
   npx vercel login
   ```

2. **Link to your existing project:**

   ```bash
   npx vercel link
   ```

   - Select your scope: `michaeltombrowns-projects`
   - Link to existing project: `Yes`
   - Project name: `ordoagentforge`

3. **Deploy to preview:**

   ```bash
   npm run deploy
   # or
   npx vercel
   ```

4. **Deploy to production:**
   ```bash
   npm run deploy:prod
   # or
   npx vercel --prod
   ```

### Option 2: Using GitHub Integration (Automatic)

1. **Push your code to GitHub:**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. Vercel will automatically detect the push and deploy your project

3. Every push to `main` = Production deployment
4. Every pull request = Preview deployment

### Option 3: Using VS Code Extension

1. Open the Vercel extension in VS Code (already installed)
2. Sign in to your Vercel account
3. Link to your existing project
4. Deploy with one click!

## Environment Variables

If you need environment variables:

1. Create `.env.local` for local development
2. Add to Vercel Dashboard:
   - Go to: https://vercel.com/michaeltombrowns-projects/ordoagentforge/settings/environment-variables
   - Add your variables there

## Important Files

- `vercel.json` - Vercel configuration
- `.env.example` - Template for environment variables
- `dist/` - Build output directory (auto-deployed)

## Deployment Commands

```bash
# Development
npm run dev              # Start local dev server

# Build
npm run build            # Build for production
npm run preview          # Preview production build locally

# Deploy
npm run deploy           # Deploy to preview
npm run deploy:prod      # Deploy to production
```

## Next Steps:

1. Run `npx vercel login` to authenticate
2. Run `npx vercel link` to link to your existing project
3. Run `npm run deploy` to deploy!

## Useful Links:

- Your Project: https://vercel.com/michaeltombrowns-projects/ordoagentforge
- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs

---

**Ready to deploy!** 🚀
