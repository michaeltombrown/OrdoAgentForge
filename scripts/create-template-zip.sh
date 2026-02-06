#!/bin/bash

# 🎯 Create Clean Template Zip
# Creates a zip file with only essential files (no node_modules, .git, etc.)

set -e

echo "🎯 Creating Clean Template Zip..."
echo ""

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
ZIP_NAME="ordoagentforge-template-v${VERSION}.zip"

echo "📦 Creating: $ZIP_NAME"
echo ""

# Create temporary directory
TEMP_DIR=$(mktemp -d)
PROJECT_NAME="ordoagentforge-template"

echo "📁 Copying essential files..."

# Create project structure
mkdir -p "$TEMP_DIR/$PROJECT_NAME"

# Copy essential config files
cp .gitignore "$TEMP_DIR/$PROJECT_NAME/"
cp .prettierrc.json "$TEMP_DIR/$PROJECT_NAME/"
cp .lintstagedrc.json "$TEMP_DIR/$PROJECT_NAME/"
cp eslint.config.js "$TEMP_DIR/$PROJECT_NAME/"
cp tsconfig.json "$TEMP_DIR/$PROJECT_NAME/"
cp tsconfig.node.json "$TEMP_DIR/$PROJECT_NAME/"
cp vite.config.ts "$TEMP_DIR/$PROJECT_NAME/"
cp vitest.config.ts "$TEMP_DIR/$PROJECT_NAME/"
cp vercel.json "$TEMP_DIR/$PROJECT_NAME/"
cp package.json "$TEMP_DIR/$PROJECT_NAME/"
cp package-lock.json "$TEMP_DIR/$PROJECT_NAME/"
cp index.html "$TEMP_DIR/$PROJECT_NAME/"

# Copy VS Code settings
mkdir -p "$TEMP_DIR/$PROJECT_NAME/.vscode"
cp .vscode/settings.json "$TEMP_DIR/$PROJECT_NAME/.vscode/"

# Copy scripts
mkdir -p "$TEMP_DIR/$PROJECT_NAME/scripts"
cp scripts/bump-version.js "$TEMP_DIR/$PROJECT_NAME/scripts/"

# Copy source files
echo "📂 Copying source files..."
cp -r src "$TEMP_DIR/$PROJECT_NAME/"

# Copy documentation
echo "📚 Copying documentation..."
cp README.md "$TEMP_DIR/$PROJECT_NAME/"
cp BASELINE_TEMPLATE.md "$TEMP_DIR/$PROJECT_NAME/"
cp TEMPLATE_GUIDE.md "$TEMP_DIR/$PROJECT_NAME/"
cp VERSION_MANAGEMENT.md "$TEMP_DIR/$PROJECT_NAME/"
cp CLERK_SETUP.md "$TEMP_DIR/$PROJECT_NAME/"
cp CLERK_READY.md "$TEMP_DIR/$PROJECT_NAME/"
cp SUPABASE_SETUP.md "$TEMP_DIR/$PROJECT_NAME/"
cp SUPABASE_READY.md "$TEMP_DIR/$PROJECT_NAME/"
cp VERCEL_SETUP.md "$TEMP_DIR/$PROJECT_NAME/"
cp GITHUB_TEMPLATE_SETUP.md "$TEMP_DIR/$PROJECT_NAME/"

# Copy environment template
cp .env.example "$TEMP_DIR/$PROJECT_NAME/"

# Copy setup script
cp create-from-template.sh "$TEMP_DIR/$PROJECT_NAME/"
chmod +x "$TEMP_DIR/$PROJECT_NAME/create-from-template.sh"

# Create the zip
echo "🗜️  Creating zip file..."
cd "$TEMP_DIR"
zip -r -q "$ZIP_NAME" "$PROJECT_NAME"
mv "$ZIP_NAME" "$OLDPWD/"

# Cleanup
cd "$OLDPWD"
rm -rf "$TEMP_DIR"

# Get zip size
SIZE=$(du -h "$ZIP_NAME" | cut -f1)

echo ""
echo "✅ Template zip created!"
echo ""
echo "📦 File: $ZIP_NAME"
echo "📊 Size: $SIZE"
echo ""
echo "📋 Contents:"
echo "   - All source files"
echo "   - Configuration files"
echo "   - Documentation"
echo "   - Setup scripts"
echo "   - NO node_modules (users run 'npm install')"
echo "   - NO .git directory"
echo "   - NO build artifacts"
echo ""
echo "🚀 To use:"
echo "   1. Unzip: unzip $ZIP_NAME"
echo "   2. cd ordoagentforge-template"
echo "   3. npm install"
echo "   4. npm run dev"
echo ""
