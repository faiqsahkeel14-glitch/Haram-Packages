# Haram Packages - Full Stack Accounting System

A complete full-stack accounting and invoicing system built with Next.js 14+, TypeScript, React, and PostgreSQL. **FREE PostgreSQL database included with Vercel deployment.**

## ✨ Features

**Core Functionality:**
- 🔐 Secure JWT-based authentication with environment variable credentials
- 💰 Complete transaction management (income and expenses)
- 📄 Invoice creation and tracking  
- 👥 Customer and supplier management
- 🏦 Multi-account support (bank and cash)
- 📊 Real-time balance calculation and inquiry
- 📅 Daily daybook with transaction summaries
- 📈 Monthly statistics and reporting

**Technical:**
- ✅ Full-Stack Next.js 14+ with App Router
- ✅ TypeScript for type safety
- ✅ Prisma ORM with PostgreSQL
- ✅ JWT authentication
- ✅ Vercel ready for deployment
- ✅ **FREE PostgreSQL database (Vercel Postgres)**
- ✅ Automatic database migrations
- ✅ One-click Vercel deployment

## 🛠️ Tech Stack

**Frontend**: Next.js 14+ | React 18+ | TypeScript | Tailwind CSS | Axios  
**Backend**: Next.js API Routes | Prisma ORM | PostgreSQL | JWT Auth  
**Deployment**: Vercel (with free PostgreSQL)

---

## 🚀 Quick Start (5 minutes)

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local

# 3. Edit .env.local with your database (see options below)
# DATABASE_URL="..."

# 4. Initialize database
npx prisma generate
npx prisma db push

# 5. Run development server
npm run dev
```

📍 **Open**: http://localhost:3000  
🔐 **Login**: `admin` / `admin123`

---

## 🗄️ Database Setup - Choose One Option

### ⭐ Option 1: Vercel Postgres (RECOMMENDED - Easiest)

**Perfect for**: Production deployment on Vercel

#### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Create a new project

#### Step 2: Create Free PostgreSQL Database
1. Click **"Storage"** in your Vercel project
2. Click **"Create"** → Select **"Postgres"**
3. Choose your region
4. Name it `haram-packages-db`
5. Click **"Create"**
6. **Copy the `POSTGRES_URL_NONPOOL` connection string**

#### Step 3: Use in Local Development
Add to `.env.local`:
```env
DATABASE_URL="paste_POSTGRES_URL_NONPOOL_here"
```

Then:
```bash
npx prisma generate
npx prisma db push
npm run dev
```

---

### Option 2: Supabase (Free - 2GB)

[supabase.com](https://supabase.com) - Free PostgreSQL with great UI

1. Click **"New Project"**
2. Enter project name and password
3. Choose region and create
4. Go to **Settings** → **Database**
5. Copy the **Psql connection string**
6. Replace `[YOUR-PASSWORD]` with your password

Add to `.env.local`:
```env
DATABASE_URL="postgresql://postgres:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
```

---

### Option 3: Neon (Free - 3GB)

[neon.tech](https://neon.tech) - Serverless PostgreSQL

1. Sign up and create project
2. Go to **Connection Details**
3. Copy the connection string

Add to `.env.local`:
```env
DATABASE_URL="postgresql://[user]:[password]@ep-[id].neon.tech/[db]"
```

---

### Option 4: Railway (Free Trial)

[railway.app](https://railway.app) - Simple and quick

1. Click **"Start Project"** → **"PostgreSQL"**
2. Copy the **Postgres Connection URL**

Add to `.env.local`:
```env
DATABASE_URL="postgresql://postgres:[password]@containers-us-west-xxx.railway.app:7812/railway"
```

---

### Option 5: Local PostgreSQL

**For development without internet:**

1. **[Install PostgreSQL](https://www.postgresql.org/download/)**
2. Create database:
   ```bash
   psql -U postgres
   CREATE DATABASE haram_packages;
   \q
   ```
3. Add to `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/haram_packages"
   ```

---

## 📚 Environment Variables

### Create `.env.local`:

```env
# DATABASE (Choose from options above)
DATABASE_URL="postgresql://user:password@host:5432/db"

# AUTHENTICATION (Change password!)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"

# JWT CONFIGURATION
JWT_SECRET="paste_random_32_chars_here"
JWT_EXPIRES_IN="7d"

# APPLICATION
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Copy the output → paste into `JWT_SECRET`**

---

## 🚀 Deploy to Vercel (Free)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Haram Packages - Full Stack"
git push origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository
4. Click **"Import"**

### Step 3: Create Database
1. Click **"Storage"** tab
2. Create **"Postgres"** database
3. **Copy `POSTGRES_URL_NONPOOL`**

### Step 4: Add Environment Variables
Click **"Settings"** → **"Environment Variables"**

Add these:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Paste `POSTGRES_URL_NONPOOL` from Step 3 |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | Your secure password |
| `JWT_SECRET` | Generate random 32+ chars |
| `JWT_EXPIRES_IN` | `7d` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel domain |
| `NODE_ENV` | `production` |

### Step 5: Deploy
Click **"Deploy"** button

✅ **Done!** Your app is live in 3-5 minutes

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                  # API endpoints
│   │   ├── auth/login        # Login endpoint
│   │   ├── auth/verify       # Token verify
│   │   ├── customers/        # Customer CRUD
│   │   ├── accounts/         # Account CRUD
│   │   ├── transactions/     # Transaction CRUD
│   │   ├── invoices/         # Invoice CRUD
│   │   └── stats/            # Statistics
│   ├── daybook/              # Daily transactions
│   ├── customers/            # Customers page
│   ├── invoices/             # Invoices page
│   ├── accounts/             # Accounts page
│   ├── balance/              # Balance inquiry
│   ├── transactions/         # All transactions
│   ├── login/                # Login page
│   └── layout.tsx            # Root layout
├── components/
│   ├── pages/                # Page components
│   ├── layout/               # Navigation layout
│   └── LoginForm.tsx         # Login form
├── lib/
│   ├── jwt.ts                # JWT utilities
│   ├── api.ts                # API client
│   └── prisma.ts             # Prisma client
└── types/                    # TypeScript types

prisma/
└── schema.prisma             # Database models

Configuration:
├── .env.local                # (Create this - see above)
├── .env.example              # Template
├── vercel.json               # Vercel config
├── next.config.js
├── package.json
└── README.md                 # You are here
```

---

## 🔌 API Endpoints

All endpoints require: `Authorization: Bearer <token>`

### Authentication
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/verify` - Verify token

### Customers
- `GET /api/customers` - List all
- `POST /api/customers` - Create new
- `PUT /api/customers/:id` - Update
- `DELETE /api/customers/:id` - Delete

### Accounts
- `GET /api/accounts` - List all
- `POST /api/accounts` - Create new

### Transactions
- `GET /api/transactions` - List all
- `POST /api/transactions` - Create (auto-updates balances)
- `DELETE /api/transactions/:id` - Delete (reverses balances)

### Invoices
- `GET /api/invoices` - List all
- `POST /api/invoices` - Create (updates ledger)
- `DELETE /api/invoices/:id` - Delete (reverses ledger)

### Statistics
- `GET /api/stats` - Monthly statistics

---

## 🗄️ Database Models

- **User** - User accounts
- **Session** - User sessions & tokens
- **Customer** - Customers & suppliers
- **CustomerLedger** - Individual balances
- **Account** - Bank & cash accounts
- **Transaction** - Income/expense
- **Invoice** - Customer & supplier invoices
- **Bank** - Legacy bank data

---

## 💻 Development Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Run production
npm run lint             # Check code quality

# Database
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema to DB
npx prisma studio      # Visual database editor
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Verify `DATABASE_URL` in `.env.local`
- Check database server is running
- Restart dev server after changing .env

### "Prisma client not found"
```bash
npx prisma generate
npm run build
```

### "Login fails"
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` match exactly
- Check `.env.local` has no extra spaces
- Clear localStorage in browser

### "Tables don't exist"
```bash
npx prisma db push
```

### "Vercel build fails"
- Check all env vars are set in Vercel dashboard
- Verify `DATABASE_URL` (use `POSTGRES_URL_NONPOOL`)
- Review Vercel build logs

---

## 🔐 Security

- ✅ JWT tokens with expiration
- ✅ Environment variable secrets
- ✅ Protected API routes
- ✅ Transactional database ops
- ✅ HTTPS on Vercel
- ✅ No hardcoded credentials

**Production Tips:**
1. Use strong password (20+ chars)
2. Generate unique JWT_SECRET
3. Enable database encryption
4. Regular backups
5. Monitor logs

---

## 📚 Additional Resources

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **PostgreSQL**: https://www.postgresql.org/docs
- **React**: https://react.dev
- **JWT**: https://jwt.io

---

## 📖 More Documentation

- [NEXT_STEPS.md](./NEXT_STEPS.md) - Complete setup guide
- [COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md) - What's included
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Deploy guide
- [.env.example](./.env.example) - Environment template

---

## 📄 License

Proprietary - Haram Packages

---

## 🎉 Ready to Get Started?

1. **Clone**: `git clone <your-repo>`
2. **Install**: `npm install`
3. **Database**: Pick an option above ⬆️
4. **Configure**: Create `.env.local`
5. **Run**: `npm run dev`
6. **Deploy**: Push to GitHub → Import to Vercel
7. **Live**: Share your URL! 🚀

**Happy coding!**
