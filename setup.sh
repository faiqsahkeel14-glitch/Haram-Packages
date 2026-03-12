#!/bin/bash

# Haram Packages - Setup Script
# This script automates the setup process

echo "================================"
echo "Haram Packages - Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found"
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created. Please update it with your values:"
    echo "   - DATABASE_URL"
    echo "   - LOGIN_USERNAME"
    echo "   - LOGIN_PASSWORD"
    echo "   - JWT_SECRET"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📖 Next steps:"
echo "   1. Update .env.local with your configuration"
echo "   2. Run: npm run dev (to start development server)"
echo "   3. Visit: http://localhost:3000"
echo ""
echo "For deployment to Vercel, see DEPLOYMENT.md"
