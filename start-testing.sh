#!/bin/bash

# OrdoAgentForge - Quick Start Script
# This script starts the application in development mode for testing

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     OrdoAgentForge - Multi-Tenant AI Dashboard           ║"
echo "║                 Quick Start Script                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "   Please create .env file with required environment variables."
    echo "   See .env.example for reference."
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    npm install
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 TESTING INSTRUCTIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "BEFORE TESTING:"
echo "1. Create 4 test users in Clerk Dashboard"
echo "   - admin@ordoagentforge.com (System Admin)"
echo "   - owner@acmecorp.com (Org Owner)"
echo "   - wsadmin@acmecorp.com (Workspace Admin)"
echo "   - member@acmecorp.com (Member)"
echo ""
echo "2. Run setup-test-users.sql in Supabase SQL Editor"
echo "   (Replace Clerk IDs with your actual IDs)"
echo ""
echo "3. Access the app at: http://localhost:3000"
echo ""
echo "📖 Full guide: See TESTING_LOGIN_GUIDE.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 STARTING APPLICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⏳ Starting backend server and frontend..."
echo "   Backend will run on: http://localhost:3001"
echo "   Frontend will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Start the application
npm run dev
