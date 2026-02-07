#!/bin/bash

# 🚀 OrdoAgentForge Quick Clone
# Non-interactive version - clones with all integrations

set -e

PROJECT_NAME=${1:-"NewWebApp"}

echo "🚀 Quick Cloning OrdoAgentForge Template"
echo "========================================"
echo ""
echo "📁 Project name: $PROJECT_NAME"
echo "✅ Including: Clerk + Supabase + Airia"
echo ""

# Navigate to parent directory
cd ..

# Clone the repo
echo "📥 Cloning repository..."
git clone https://github.com/michaeltombrown/OrdoAgentForge.git "$PROJECT_NAME"

cd "$PROJECT_NAME"

# Remove git history
echo "🔧 Setting up fresh git..."
rm -rf .git
git init

# Install dependencies
echo "📦 Installing dependencies (this may take a few minutes)..."
npm install

# Initialize Husky
echo "🐕 Setting up Husky..."
npx husky init

# Initial commit (skip hooks to avoid hanging)
echo "💾 Creating initial commit..."
git add -A
git commit -m "Initial commit from OrdoAgentForge template" --no-verify

echo ""
echo "✅ Project created successfully!"
echo ""
echo "📁 Location: /Users/Michael/$PROJECT_NAME"
echo ""
echo "🚀 Next steps:"
echo "   cd ../$PROJECT_NAME"
echo "   # Update .env.local with your API keys"
echo "   npm run dev"
echo ""
echo "🔑 Don't forget to add your API keys to .env.local:"
echo "   - VITE_CLERK_PUBLISHABLE_KEY"
echo "   - CLERK_SECRET_KEY"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo ""
echo "Happy coding! 🎉"
