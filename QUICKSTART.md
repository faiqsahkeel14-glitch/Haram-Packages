# Quick Start Guide

Get up and running in 5 minutes! 🚀

## 1. Installation (1 min)

```bash
cd HaramPackages-NextJS
npm install
```

## 2. Configuration (1 min)

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your settings (for development, defaults are fine):

```env
DATABASE_URL="file:./dev.db"
LOGIN_USERNAME="admin"
LOGIN_PASSWORD="admin123"
JWT_SECRET="dev_secret_key_should_be_min_32_chars_long"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
```

## 3. Start Development Server (1 min)

```bash
npm run dev
```

Visit: **http://localhost:3000**

## 4. Login (1 min)

You'll be redirected to login. Use:
- **Username**: `admin`
- **Password**: `admin123`

(Change these in `.env.local` if needed)

## 5. Explore (1 min)

You're now in the Dashboard! 🎉

- See packages after login
- Check browser console for API calls
- Logout to return to login page

## Common Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Run production server

# Database
npx prisma studio         # Open database UI
npm run db:push           # Sync schema
npm run db:migrate        # Create migration

# Code Quality
npm run lint              # Run linter
```

## Project Structure Quick Look

```
src/
├── app/api/              # Backend API routes
├── app/[page]/          # Frontend pages
├── components/          # React components
└── lib/                 # Utilities
```

## API Quick Test

```bash
# Login (get token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get packages with token
curl http://localhost:3000/api/packages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

**Port already in use?**
```bash
npm run dev -- -p 3001
```

**Database error?**
```bash
npx prisma db push
```

**Changes not showing?**
```bash
# Restart server: Ctrl+C then npm run dev
# Clear .next: rm -rf .next
```

## Next Steps

1. ✅ Read [README.md](./README.md) for full documentation
2. ⏭️ Check [DEVELOPMENT.md](./DEVELOPMENT.md) for dev guide
3. ⏭️ Review [API_DOCS.md](./API_DOCS.md) for API details
4. ⏭️ See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel setup

## Deploy to Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to vercel.com
# 3. Import your repository
# 4. Add environment variables
# 5. Deploy! 🚀
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed steps.

---

**That's it!** Your Next.js full-stack app is ready. Enjoy! 🎉
