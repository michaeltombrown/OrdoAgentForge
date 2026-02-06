# 🚀 Making OrdoAgentForge a GitHub Template

## Option 1: Via GitHub Web Interface

1. Go to: https://github.com/michaeltombrown/OrdoAgentForge
2. Click **Settings** (gear icon)
3. Check ☑️ **Template repository**
4. Save

Now for each new project:

1. Go to the repo
2. Click **"Use this template"** (green button)
3. Name your new project
4. Clone and start coding!

## Option 2: Keep Cloning Manually

```bash
# For each new project
git clone https://github.com/michaeltombrown/OrdoAgentForge.git project-name
cd project-name
rm -rf .git
git init
npm install
npm run dev
```

## What About a Zip File?

### ❌ DON'T Create a Full Zip

- Includes `node_modules` (100-500MB!)
- Includes `.git` history
- Includes build artifacts
- Hard to update
- Version confusion

### ✅ IF You Want a Zip, Create a Clean One

```bash
# Create a clean template zip (without node_modules, .git, etc.)
cd OrdoAgentForge
npm run create-template-zip  # (We can create this script)
```

## Recommended: Use Git Clone

**Best practice**: Always clone from GitHub

- Gets latest code
- No `node_modules` bloat
- Clean git history
- Easy to update template
- Industry standard

## Quick Reference

```bash
# New project from template (RECOMMENDED)
git clone https://github.com/michaeltombrown/OrdoAgentForge.git my-app
cd my-app
rm -rf .git
git init
npm install

# Or use the script
cd OrdoAgentForge
./create-from-template.sh
```

Don't zip unless you absolutely need offline access!
