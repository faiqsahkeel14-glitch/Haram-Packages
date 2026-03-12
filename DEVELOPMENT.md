# Development Guide

## Local Development Setup

### 1. Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn
- PostgreSQL ([Download](https://www.postgresql.org/download/)) - optional for development
- A code editor (VS Code recommended)

### 2. Initial Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/haram-packages.git
cd haram-packages

# Run setup script (automatic)
./setup.sh      # macOS/Linux
./setup.ps1     # Windows PowerShell

# Or manually install
npm install
cp .env.example .env.local
```

### 3. Configure Environment Variables

Edit `.env.local`:

```env
# For development, you can use SQLite for quick setup:
DATABASE_URL="file:./dev.db"

# Or PostgreSQL (requires running PostgreSQL locally):
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/haram_packages"

# Login credentials
LOGIN_USERNAME="admin"
LOGIN_PASSWORD="admin123"

# JWT Secret (use anything for development)
JWT_SECRET="dev_secret_key_min_32_chars_here"

NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

You'll be automatically redirected to the login page.

## Development Workflow

### File Structure Overview

```
src/
├── app/                 # Next.js App Router pages and API routes
│   ├── api/            # API endpoint handlers
│   ├── dashboard/      # Protected dashboard page
│   ├── login/          # Login page
│   ├── layout.tsx      # Root layout wrapper
│   └── page.tsx        # Home page (redirects)
├── components/         # Reusable React components
├── lib/               # Utility functions
├── middleware/        # Authentication/request middleware
└── types/            # TypeScript type definitions
```

### Making Changes

#### Adding a New Page

1. Create a folder in `src/app/[page-name]/`
2. Add `page.tsx`:

```typescript
export default function MyPage() {
  return <div>My Page Content</div>;
}
```

#### Adding a New API Endpoint

1. Create a folder in `src/app/api/[resource]/`
2. Add `route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ data: 'your data' });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Handle POST
  return NextResponse.json({ success: true });
}
```

#### Adding a New Component

1. Create in `src/components/YourComponent.tsx`:

```typescript
'use client';

import styles from './component.module.css';

export default function YourComponent() {
  return <div className={styles.container}>Your Component</div>;
}
```

2. Create `src/components/component.module.css` for styles

#### Adding Styles

- Use **CSS Modules** for component-scoped styles: `component.module.css`
- Use global styles in `src/app/globals.css`
- CSS-in-JS libraries like `styled-components` work too

### Database Development

#### Using SQLite (Easiest for Development)

```env
DATABASE_URL="file:./dev.db"
```

No setup needed, database file is created automatically.

#### Using PostgreSQL

```bash
# macOS (with Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Windows
# Download and install from postgresql.org

# Linux
sudo apt-get install postgresql
sudo systemctl start postgresql
```

Create a database:

```bash
createdb haram_packages
```

Connect with URI:
```
postgresql://postgres:password@localhost:5432/haram_packages
```

#### Running Migrations

```bash
# Create migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy

# Sync schema (SQLite only)
npx prisma db push
```

#### Viewing Database

```bash
# Open Prisma Studio
npx prisma studio

# Visit http://localhost:5555
```

## Testing

### Manual Testing

1. **Test Login**:
   - Navigate to `http://localhost:3000/login`
   - Enter username: `admin`, password: `admin123`
   - Should redirect to dashboard

2. **Test API**:
   ```bash
   # Login
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'

   # Get packages with token
   curl http://localhost:3000/api/packages \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

3. **Test Protected Routes**:
   - Clear localStorage
   - Try accessing `/dashboard`
   - Should redirect to login

### Debugging

#### VS Code Debugger

1. Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

2. Press F5 to start debugging

#### Browser DevTools

- Open DevTools (F12)
- Check **Console** for JavaScript errors
- Check **Network** tab for API requests
- Check **Application** → **LocalStorage** for token

#### Server Logs

Check terminal where `npm run dev` is running for:
- API errors
- Database connection issues
- TypeScript compilation errors

### Common Issues

#### Port 3000 Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux

# Or use different port
npm run dev -- -p 3001
```

#### Database Connection Error

```
Error: Can't reach database server at `localhost:5432`
```

Solutions:
1. Check PostgreSQL is running: `psql -U postgres`
2. Verify DATABASE_URL is correct
3. Check credentials in connection string
4. Use SQLite for development: `DATABASE_URL="file:./dev.db"`

#### Token Invalid/Expired

- Clear localStorage: `localStorage.clear()` in console
- Login again to get a new token
- Check JWT_SECRET is consistent

#### Changes Not Reflecting

- Check if file was saved
- Restart dev server (`Ctrl+C` then `npm run dev`)
- Clear `.next` folder: `rm -rf .next`
- Clear browser cache

## Code Style & Linting

### Format Code

```bash
npx prettier --write .
```

### Run Linter

```bash
npm run lint
```

### Auto-fix Issues

```bash
npm run lint -- --fix
```

## Building for Production

```bash
# Build the app
npm run build

# Test the build locally
npm run start

# Visit http://localhost:3000
```

##Environment Variables Checklist

```
✅ DATABASE_URL          - Database connection string
✅ LOGIN_USERNAME        - Admin username
✅ LOGIN_PASSWORD        - Admin password
✅ JWT_SECRET           - Secret key for JWT (32+ chars)
✅ NEXT_PUBLIC_API_URL  - Frontend API URL
✅ NODE_ENV             - Environment (development/production)
```

## Performance Tips

1. **Image Optimization**: Use Next.js `Image` component
2. **Code Splitting**: Next.js does this automatically
3. **Database Indexing**: Add indexes in Prisma schema
4. **Caching**: Configure in `next.config.js`
5. **Monitoring**: Use Vercel Analytics

## Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:migrate   # Create database migration
npm run db:push      # Sync database schema
npm run db:generate  # Generate Prisma client
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

## Getting Help

1. Check console for errors
2. Review [Troubleshooting Guide](./README.md#-troubleshooting)
3. Check API docs in [API_DOCS.md](./API_DOCS.md)
4. Create GitHub issue with error logs

---

Happy coding! 🎉
