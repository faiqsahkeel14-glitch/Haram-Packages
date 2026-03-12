# Haram Packages - Setup Script (Windows)
# This script automates the setup process for Windows users

Write-Host "================================" -ForegroundColor Green
Write-Host "Haram Packages - Setup Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if .env.local exists
if (!(Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found" -ForegroundColor Yellow
    Write-Host "📝 Creating .env.local from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ .env.local created. Please update it with your values:" -ForegroundColor Green
    Write-Host "   - DATABASE_URL" -ForegroundColor Cyan
    Write-Host "   - LOGIN_USERNAME" -ForegroundColor Cyan
    Write-Host "   - LOGIN_PASSWORD" -ForegroundColor Cyan
    Write-Host "   - JWT_SECRET" -ForegroundColor Cyan
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Update .env.local with your configuration" -ForegroundColor White
Write-Host "   2. Run: npm run dev (to start development server)" -ForegroundColor White
Write-Host "   3. Visit: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "For deployment to Vercel, see DEPLOYMENT.md" -ForegroundColor Cyan
