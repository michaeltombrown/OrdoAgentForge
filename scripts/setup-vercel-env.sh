#!/bin/bash

# Script to add environment variables to Vercel
# This script helps you add all required environment variables to your Vercel project

set -e

echo "🔧 Vercel Environment Variable Setup"
echo "======================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "   npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📋 This script will help you add environment variables to Vercel"
echo ""
echo "You can either:"
echo "  1. Use the Vercel CLI (automated, but one at a time)"
echo "  2. Use the Vercel Dashboard (manual, but faster for multiple vars)"
echo ""

read -p "Choose method (1 for CLI, 2 for Dashboard): " method

if [ "$method" == "1" ]; then
    echo ""
    echo "🚀 Using Vercel CLI Method"
    echo "=========================="
    echo ""
    echo "I'll help you add each variable one by one."
    echo "You'll need to paste the values when prompted."
    echo ""
    
    # Read from .env.local
    if [ -f ".env.local" ]; then
        echo "✅ Found .env.local file"
        echo ""
        echo "Current variables in .env.local:"
        echo "================================"
        grep -v "^#" .env.local | grep -v "^$" | grep "=" | cut -d'=' -f1 | sed 's/^/  - /'
        echo ""
    fi
    
    echo "📝 Adding variables to Vercel..."
    echo ""
    echo "Note: Each variable will be added to Production, Preview, and Development"
    echo ""
    
    # Array of required variables
    declare -a vars=(
        "VITE_SUPABASE_URL"
        "VITE_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "VITE_CLERK_PUBLISHABLE_KEY"
        "CLERK_SECRET_KEY"
        "CLERK_WEBHOOK_SECRET"
    )
    
    for var in "${vars[@]}"; do
        echo "---"
        echo "Variable: $var"
        
        # Check if it exists in .env.local
        if [ -f ".env.local" ] && grep -q "^${var}=" .env.local; then
            value=$(grep "^${var}=" .env.local | cut -d'=' -f2- | tr -d '"')
            if [ ! -z "$value" ] && [[ "$value" != *"[YOUR"* ]] && [[ "$value" != *"your-"* ]]; then
                echo "Found in .env.local"
                read -p "Use this value? (y/n): " use_value
                if [ "$use_value" == "y" ]; then
                    echo "Adding $var to Vercel..."
                    vercel env add "$var" production preview development <<< "$value"
                    echo "✅ Added $var"
                    echo ""
                    continue
                fi
            fi
        fi
        
        echo "Please enter value for $var:"
        read -s var_value
        echo ""
        
        if [ ! -z "$var_value" ]; then
            echo "Adding $var to Vercel..."
            vercel env add "$var" production preview development <<< "$var_value"
            echo "✅ Added $var"
        else
            echo "⚠️  Skipped $var (empty value)"
        fi
        echo ""
    done
    
    echo ""
    echo "✅ Environment variables setup complete!"
    echo ""
    echo "🔄 Next step: Redeploy your application"
    echo "   Run: vercel --prod"
    
elif [ "$method" == "2" ]; then
    echo ""
    echo "🌐 Using Vercel Dashboard Method"
    echo "================================"
    echo ""
    echo "Here's what you need to do:"
    echo ""
    echo "1. Open your browser and go to:"
    echo "   https://vercel.com/michaeltombrowns-projects/ordoagentforge/settings/environment-variables"
    echo ""
    echo "2. Click 'Add New' for each variable below"
    echo ""
    echo "3. Set 'Environments' to: Production, Preview, Development (all three)"
    echo ""
    echo "📋 VARIABLES TO ADD:"
    echo "===================="
    echo ""
    
    # Read from .env.local and display
    if [ -f ".env.local" ]; then
        echo "From your .env.local file:"
        echo ""
        
        # Extract VITE_SUPABASE_URL
        if grep -q "^VITE_SUPABASE_URL=" .env.local; then
            value=$(grep "^VITE_SUPABASE_URL=" .env.local | cut -d'=' -f2-)
            echo "✓ VITE_SUPABASE_URL"
            echo "  $value"
            echo ""
        fi
        
        # Extract VITE_SUPABASE_ANON_KEY
        if grep -q "^VITE_SUPABASE_ANON_KEY=" .env.local; then
            value=$(grep "^VITE_SUPABASE_ANON_KEY=" .env.local | cut -d'=' -f2-)
            echo "✓ VITE_SUPABASE_ANON_KEY"
            echo "  $value"
            echo ""
        fi
        
        # Extract VITE_CLERK_PUBLISHABLE_KEY
        if grep -q "^VITE_CLERK_PUBLISHABLE_KEY=" .env.local; then
            value=$(grep "^VITE_CLERK_PUBLISHABLE_KEY=" .env.local | cut -d'=' -f2-)
            echo "✓ VITE_CLERK_PUBLISHABLE_KEY"
            echo "  $value"
            echo ""
        fi
        
        # Extract CLERK_SECRET_KEY
        if grep -q "^CLERK_SECRET_KEY=" .env.local; then
            value=$(grep "^CLERK_SECRET_KEY=" .env.local | cut -d'=' -f2-)
            echo "✓ CLERK_SECRET_KEY"
            echo "  $value"
            echo ""
        fi
    fi
    
    echo "⚠️  MISSING - You need to get these:"
    echo ""
    echo "✗ SUPABASE_SERVICE_ROLE_KEY"
    echo "  Where: Supabase Dashboard → Settings → API → service_role (secret)"
    echo "  URL: https://supabase.com/dashboard/project/ydebgchglotcdjfegbhs/settings/api"
    echo ""
    echo "✗ CLERK_WEBHOOK_SECRET"
    echo "  Where: Clerk Dashboard → Webhooks → Your Endpoint → Signing Secret"
    echo "  (You'll get this after creating the webhook endpoint)"
    echo ""
    
    echo "📋 OPTIONAL (if you have it):"
    echo ""
    echo "○ VITE_AIRIA_API_KEY"
    echo "  Your Airia API key"
    echo ""
    
    echo "---"
    echo ""
    echo "After adding all variables in the Vercel Dashboard:"
    echo "1. Save all variables"
    echo "2. Redeploy your application: vercel --prod"
    echo ""
    
    read -p "Press Enter to open the Vercel Dashboard..."
    
    # Try to open the browser
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "https://vercel.com/michaeltombrowns-projects/ordoagentforge/settings/environment-variables"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open "https://vercel.com/michaeltombrowns-projects/ordoagentforge/settings/environment-variables"
    else
        echo "Please open this URL manually:"
        echo "https://vercel.com/michaeltombrowns-projects/ordoagentforge/settings/environment-variables"
    fi
    
else
    echo "❌ Invalid choice. Please run the script again and choose 1 or 2."
    exit 1
fi

echo ""
echo "✨ Done!"
