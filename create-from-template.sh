#!/bin/bash

# 🚀 OrdoAgentForge Template Cloner
# Quick script to set up a new project from this baseline

set -e  # Exit on error

echo "🚀 OrdoAgentForge Template Cloner"
echo "=================================="
echo ""

# Get project name
read -p "Enter new project name: " PROJECT_NAME

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Project name cannot be empty"
    exit 1
fi

# Create project directory
echo ""
echo "📁 Creating project directory: $PROJECT_NAME"
mkdir -p "../$PROJECT_NAME"

# Copy essential files
echo "📋 Copying configuration files..."

# Core configs
cp .gitignore "../$PROJECT_NAME/"
cp .prettierrc.json "../$PROJECT_NAME/"
cp .lintstagedrc.json "../$PROJECT_NAME/"
cp eslint.config.js "../$PROJECT_NAME/"
cp tsconfig.json "../$PROJECT_NAME/"
cp tsconfig.node.json "../$PROJECT_NAME/"
cp vite.config.ts "../$PROJECT_NAME/"
cp vitest.config.ts "../$PROJECT_NAME/"
cp vercel.json "../$PROJECT_NAME/"
cp index.html "../$PROJECT_NAME/"

# VS Code settings
mkdir -p "../$PROJECT_NAME/.vscode"
cp .vscode/settings.json "../$PROJECT_NAME/.vscode/"

# Scripts
mkdir -p "../$PROJECT_NAME/scripts"
cp scripts/bump-version.js "../$PROJECT_NAME/scripts/"

# Create package.json with updated name
echo "📦 Creating package.json..."
cat package.json | sed "s/\"ordoagentforge\"/\"$PROJECT_NAME\"/" > "../$PROJECT_NAME/package.json"

# Copy source structure
echo "📂 Copying source files..."
mkdir -p "../$PROJECT_NAME/src"
mkdir -p "../$PROJECT_NAME/src/lib"
mkdir -p "../$PROJECT_NAME/src/test"

cp src/main.tsx "../$PROJECT_NAME/src/"
cp src/App.tsx "../$PROJECT_NAME/src/"
cp src/App.css "../$PROJECT_NAME/src/"
cp src/index.css "../$PROJECT_NAME/src/"
cp src/vite-env.d.ts "../$PROJECT_NAME/src/"
cp src/version.ts "../$PROJECT_NAME/src/"
cp src/test/setup.ts "../$PROJECT_NAME/src/test/"

# Ask about integrations
echo ""
echo "🔧 Which integrations do you want?"
echo ""

read -p "Include Clerk authentication? (y/n): " INCLUDE_CLERK
read -p "Include Supabase database? (y/n): " INCLUDE_SUPABASE
read -p "Include Airia API client? (y/n): " INCLUDE_AIRIA

# Copy integration files based on choices
if [ "$INCLUDE_CLERK" = "y" ]; then
    echo "✅ Adding Clerk..."
    cp src/lib/clerk-helpers.tsx "../$PROJECT_NAME/src/lib/"
    cp CLERK_SETUP.md "../$PROJECT_NAME/"
    cp CLERK_READY.md "../$PROJECT_NAME/"
fi

if [ "$INCLUDE_SUPABASE" = "y" ]; then
    echo "✅ Adding Supabase..."
    cp src/lib/supabase.ts "../$PROJECT_NAME/src/lib/"
    cp SUPABASE_SETUP.md "../$PROJECT_NAME/"
    cp SUPABASE_READY.md "../$PROJECT_NAME/"
fi

if [ "$INCLUDE_AIRIA" = "y" ]; then
    echo "✅ Adding Airia..."
    cp src/lib/airia-client.ts "../$PROJECT_NAME/src/lib/"
    cp src/lib/airia-api-types.ts "../$PROJECT_NAME/src/lib/"
    cp airia-openapi.json "../$PROJECT_NAME/"
    cp AIRIA_SDK.md "../$PROJECT_NAME/"
fi

# Copy documentation
echo "📚 Copying documentation..."
cp VERSION_MANAGEMENT.md "../$PROJECT_NAME/"
cp VERCEL_SETUP.md "../$PROJECT_NAME/"
cp BASELINE_TEMPLATE.md "../$PROJECT_NAME/"

# Create .env.example
echo "🔐 Creating .env.example..."
cat > "../$PROJECT_NAME/.env.example" << 'EOF'
# Environment Variables Template

# Vite
VITE_API_URL=http://localhost:5000

EOF

if [ "$INCLUDE_CLERK" = "y" ]; then
    cat >> "../$PROJECT_NAME/.env.example" << 'EOF'
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key-here
CLERK_SECRET_KEY=your-clerk-secret-key-here

EOF
fi

if [ "$INCLUDE_SUPABASE" = "y" ]; then
    cat >> "../$PROJECT_NAME/.env.example" << 'EOF'
# Supabase
VITE_SUPABASE_URL=your-supabase-url-here
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

EOF
fi

if [ "$INCLUDE_AIRIA" = "y" ]; then
    cat >> "../$PROJECT_NAME/.env.example" << 'EOF'
# Airia API
VITE_AIRIA_API_URL=https://api.airia.ai
VITE_AIRIA_API_KEY=your-airia-api-key-here

EOF
fi

# Create README
echo "📝 Creating README.md..."
cat > "../$PROJECT_NAME/README.md" << EOF
# $PROJECT_NAME

> Built from OrdoAgentForge baseline template

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
\`\`\`

## 🛠️ Tech Stack

- ⚛️ React 19 + TypeScript
- ⚡ Vite
- 🎨 ESLint + Prettier
- 🧪 Vitest
EOF

if [ "$INCLUDE_CLERK" = "y" ]; then
    echo "- 🔐 Clerk Authentication" >> "../$PROJECT_NAME/README.md"
fi

if [ "$INCLUDE_SUPABASE" = "y" ]; then
    echo "- 🗄️ Supabase Database" >> "../$PROJECT_NAME/README.md"
fi

if [ "$INCLUDE_AIRIA" = "y" ]; then
    echo "- 🤖 Airia API" >> "../$PROJECT_NAME/README.md"
fi

cat >> "../$PROJECT_NAME/README.md" << 'EOF'

## 📦 Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production (auto-bumps version)
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code
```

## 📚 Documentation

- [Version Management](./VERSION_MANAGEMENT.md)
- [Deployment Guide](./VERCEL_SETUP.md)
- [Template Guide](./BASELINE_TEMPLATE.md)

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys.

## 📝 License

MIT
EOF

# Initialize git
echo ""
echo "🔧 Setting up git..."
cd "../$PROJECT_NAME"
git init

# Install dependencies
echo ""
read -p "Install npm dependencies now? (y/n): " INSTALL_DEPS

if [ "$INSTALL_DEPS" = "y" ]; then
    echo "📦 Installing dependencies (this may take a few minutes)..."
    npm install
    
    # Initialize Husky
    echo "🐕 Setting up Husky..."
    npx husky init
fi

# Create initial commit (after Husky setup, skip hooks to avoid hanging)
echo "💾 Creating initial commit..."
git add -A
git commit -m "Initial commit from OrdoAgentForge template" --no-verify

echo ""
echo "✅ Project created successfully!"
echo ""
echo "📁 Location: ../$PROJECT_NAME"
echo ""
echo "🚀 Next steps:"
echo "   1. cd ../$PROJECT_NAME"
echo "   2. Update .env.local with your API keys"
echo "   3. npm run dev"
echo ""
echo "Happy coding! 🎉"
