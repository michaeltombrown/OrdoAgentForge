#!/bin/bash

# Phase 7.1 Environment Verification Script
# This script checks if all required environment variables are configured

echo "========================================"
echo "Phase 7.1 - Environment Verification"
echo "========================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found"
    echo "   Action: Run 'cp .env.example .env' and configure all variables"
    exit 1
else
    echo "✅ .env file exists"
fi

echo ""
echo "Checking required environment variables..."
echo ""

# Load .env file
source .env

# Array of required variables
declare -a required_vars=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "VITE_CLERK_PUBLISHABLE_KEY"
    "CLERK_SECRET_KEY"
    "CLERK_WEBHOOK_SECRET"
    "VITE_AIRIA_API_KEY"
)

# Check each variable
missing_vars=0
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ $var is not set"
        missing_vars=$((missing_vars + 1))
    elif [[ "${!var}" == *"your-"* ]] || [[ "${!var}" == *"paste-"* ]]; then
        echo "⚠️  $var contains placeholder value: ${!var}"
        missing_vars=$((missing_vars + 1))
    else
        # Show first 10 characters for security
        value_preview="${!var:0:10}..."
        echo "✅ $var is set ($value_preview)"
    fi
done

echo ""
echo "========================================"

if [ $missing_vars -eq 0 ]; then
    echo "✅ All environment variables configured!"
    echo "   Ready to proceed with Phase 7.2"
    exit 0
else
    echo "❌ $missing_vars variable(s) need configuration"
    echo "   Edit .env file and set all required values"
    exit 1
fi
