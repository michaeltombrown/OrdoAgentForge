#!/bin/bash

# Start Development Servers Script
# Starts both backend (Express) and frontend (Vite) servers

echo "=========================================="
echo "Starting Development Servers"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found"
    echo "   Run: cp .env.example .env"
    echo "   Then configure all environment variables"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Environment configured"
echo ""
echo "Starting servers..."
echo "  📊 Backend API: http://localhost:3001"
echo "  🎨 Frontend:    http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=========================================="
echo ""

# Start both servers using npm script
npm run dev
