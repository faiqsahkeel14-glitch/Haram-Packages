# Haram Packages - Full Stack Accounting System

A complete full-stack accounting and invoicing system built with Next.js 14+, TypeScript, React, and PostgreSQL. **Database: Neon (FREE Serverless PostgreSQL 3GB)**

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
- ✅ Prisma ORM with PostgreSQL (Neon)
- ✅ JWT authentication
- ✅ Vercel ready for deployment
- ✅ **Neon Database (FREE 3GB Serverless PostgreSQL)**
- ✅ Automatic database migrations
- ✅ One-click Vercel deployment

## 🛠️ Tech Stack

**Frontend**: Next.js 14+ | React 18+ | TypeScript | Tailwind CSS | Axios  
**Backend**: Next.js API Routes | Prisma ORM | PostgreSQL (Neon)  
**Database**: Neon - Serverless PostgreSQL (3GB FREE)  
**Deployment**: Vercel (with Neon database)

---

## 🚀 Quick Start (5 minutes)

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Setup environment (database already configured in Neon)
cp .env.example .env.local

# 3. Edit .env.local with Neon credentials:
# DATABASE_URL=postgresql://neon:password@ep-xxx.neon.tech/neon_db
# ADMIN_USERNAME=admin
# ADMIN_PASSWORD=your_password
# JWT_SECRET=your_secret_32_chars

# 4. Initialize database
npx prisma generate
npx prisma db push

# 5. Run development server
npm run dev
```

📍 **Open**: http://localhost:3000  
🔐 **Login**: Your ADMIN_USERNAME / ADMIN_PASSWORD

---

## 🗄️ Database - Neon Configuration

**Database**: Neon (Serverless PostgreSQL)  
**Tier**: FREE - 3GB storage  
**Provider**: Neon.tech (available via Vercel Storage Marketplace)  
**Status**: ✅ Already Configured

### Your Neon Connection Details

You'll need these values from your Neon dashboard:

```env
DATABASE_URL="postgresql://neon_user:password@ep-xxxxx.neon.tech/neon_db"
```

This is already set up. Just add it to:
1. `.env.local` (local development)
2. Vercel Environment Variables (production)

---

## 📚 Environment Variables

### Create `.env.local` for Local Development:

```env
# DATABASE (From your Neon dashboard)
DATABASE_URL="postgresql://neon_user:password@ep-xxxxx.neon.tech/neon_db"

# AUTHENTICATION (Change these!)
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

## 🚀 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Haram Packages - Full Stack with Neon DB"
git push origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository
4. Click **"Import"**

### Step 3: Add Environment Variables
In Vercel dashboard → **"Settings"** → **"Environment Variables"**

Add these 7 variables:

| Name | Value | Example |
|------|-------|---------|
| `DATABASE_URL` | Your Neon connection string | `postgresql://neon:pass@ep-xxx.neon.tech/neon_db` |
| `ADMIN_USERNAME` | Your login username | `admin` |
| `ADMIN_PASSWORD` | Your login password | `MySecurePass123!` |
| `JWT_SECRET` | Random 32+ characters | Generate with command above ↑ |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel domain | `https://haram-packages.vercel.app` |
| `NODE_ENV` | Environment | `production` |

### Step 4: Deploy
Click **"Deploy"** button

✅ **Done!** Your app is live in 3-5 minutes

📍 **Your App URL**: https://haram-packages-[random].vercel.app  
🔐 **Login**: Use your ADMIN_USERNAME and ADMIN_PASSWORD from env vars

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
