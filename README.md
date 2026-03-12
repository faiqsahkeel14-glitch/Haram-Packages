# Haram Packages - Full Stack Accounting System

A complete full-stack accounting and invoicing system built with Next.js 14+, TypeScript, React, and PostgreSQL. Ready for production deployment on Vercel.

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
- ✅ Environment-based configuration
- ✅ Automatic database migrations

## 🛠️ Tech Stack

**Frontend**
- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- Axios
- React Icons

**Backend**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Atomic transactions

**Deployment**
- Vercel
- PostgreSQL (Vercel Postgres or external)
- CI/CD ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install**
```bash
cd HaramPackages-NextJS
npm install
```

2. **Configure environment**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/haram_packages"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
JWT_SECRET="your_secret_key_minimum_32_characters_random_string"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

3. **Initialize database**
```bash
npx prisma generate
npx prisma db push
```

4. **Run development server**
```bash
npm run dev
```

Open http://localhost:3000 → Login with `admin` / `admin123`

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                      # API routes
│   │   ├── auth/login/           # Login endpoint
│   │   ├── auth/verify/          # Token verification
│   │   ├── customers/            # Customer CRUD
│   │   ├── customers/[id]/       # Customer update/delete
│   │   ├── accounts/             # Account management
│   │   ├── transactions/         # Transaction CRUD
│   │   ├── transactions/[id]/    # Transaction delete
│   │   ├── invoices/             # Invoice CRUD
│   │   ├── invoices/[id]/        # Invoice delete
│   │   └── stats/                # Statistics
│   ├── daybook/                  # Daily transactions view
│   ├── customers/                # Customers page
│   ├── invoices/                 # Invoices page
│   ├── accounts/                 # Accounts page
│   ├── balance/                  # Balance inquiry
│   ├── transactions/             # All transactions
│   ├── login/                    # Login page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home redirect
│   └── globals.css               # Global styles
├── components/
│   ├── pages/
│   │   ├── Daybook.tsx           # Daybook page
│   │   ├── CustomersPage.tsx     # Customers management
│   │   ├── AccountsPage.tsx      # Accounts management
│   │   ├── InvoicesPage.tsx      # Invoices management
│   │   ├── BalanceInquiryPage.tsx
│   │   └── AllTransactionsPage.tsx
│   ├── layout/
│   │   ├── AppLayout.tsx         # Main navigation layout
│   │   └── Header.tsx            # Header component
│   └── LoginForm.tsx             # Login form
├── lib/
│   ├── jwt.ts                    # JWT utilities
│   ├── api.ts                    # API client
│   └── prisma.ts                 # Prisma client
└── types/                        # TypeScript types

prisma/
└── schema.prisma                 # Database models

Configuration:
├── package.json
├── tsconfig.json
├── next.config.js
├── vercel.json
├── .env.example
├── .env.local (create manually)
└── README.md
```

## 🔌 API Endpoints

All endpoints require: `Authorization: Bearer <token>` header

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Customers
- `GET /api/customers` - List all
- `POST /api/customers` - Create
- `PUT /api/customers/:id` - Update
- `DELETE /api/customers/:id` - Delete

### Accounts  
- `GET /api/accounts` - List all
- `POST /api/accounts` - Create

### Transactions
- `GET /api/transactions` - List all
- `POST /api/transactions` - Create (updates balances)
- `DELETE /api/transactions/:id` - Delete (reverses balances)

### Invoices
- `GET /api/invoices` - List all  
- `POST /api/invoices` - Create (updates ledger)
- `DELETE /api/invoices/:id` - Delete (reverses ledger)

### Statistics
- `GET /api/stats` - Monthly statistics

## 🗄️ Database Schema

**Models:**
- `User` - User accounts
- `Session` - Active sessions
- `Customer` - Customers & suppliers
- `CustomerLedger` - Individual balances
- `Account` - Bank/cash accounts
- `Transaction` - Income/expense
- `Invoice` - Customer & supplier invoices
- `Bank` - Legacy model

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Environment variable credentials
- ✅ Protected API routes
- ✅ Transactional database operations
- ✅ HTTPS ready (Vercel)
- ✅ Secure token storage

## 📤 Vercel Deployment

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

Quick steps:
1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables (DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET)
4. Deploy

## 💻 Development

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
npm run start
```

### Database
```bash
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to DB
npx prisma migrate dev   # Create migration
npx prisma studio       # Open GUI
```

### Lint
```bash
npm run lint
```

## 📝 Environment Variables

Create `.env.local`:

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection | postgresql://... |
| ADMIN_USERNAME | Admin login username | admin |
| ADMIN_PASSWORD | Admin login password | secure_password |
| JWT_SECRET | JWT signing secret (min 32 chars) | random_string_32+ |
| JWT_EXPIRES_IN | Token expiration | 7d |
| NEXT_PUBLIC_APP_URL | Application URL | http://localhost:3000 |
| NODE_ENV | Environment | development/production |

## 🐛 Troubleshooting

**Database Connection Error**
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Ensure firewall allows connections

**Login Issues**
- Verify credentials in .env.local
- Clear browser cache & localStorage
- Check JWT_SECRET is 32+ characters

**API Errors**
- Check Authorization header
- Verify token hasn't expired
- Check Vercel logs

## 📦 Package Scripts

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run start         # Start prod server
npm run lint          # Run ESLint
npm run db:migrate    # Run migrations
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to DB
npm run db:studio     # Open Prisma Studio
```

## 🎯 Key Features Explained

### Transaction Management
- Automatic balance updates for accounts and ledgers
- Atomic transactions for data integrity
- Ability to reverse and recalculate balances
- Inward (income) and outward (expense) categorization

### Invoice System
- Automatic ledger balance adjustments
- Customer invoices (sales) increase receivables
- Supplier invoices (purchases) increase payables
- Invoice deletion reverses all changes

### Balance Inquiry
- Real-time calculations
- Separate receivables vs payables views
- Color-coded balance indicators
- Ledger tracking

### Daily Daybook
- View day's transactions
- Quick add modal
- Transaction details
- Net flow calculation

## 📄 License

Proprietary - Haram Packages

## 📞 Support

For deployment issues, see VERCEL_DEPLOYMENT.md
For code issues, check the main project documentation
├── vercel.json                # Vercel deployment config
├── .env.example               # Environment template
└── .gitignore                 # Git ignore rules
```

## 🔑 Default Login Credentials

The application uses environment variables for credentials:

- **Username**: Set via `LOGIN_USERNAME`
- **Password**: Set via `LOGIN_PASSWORD`

Change these in your `.env.local` file for development.

## 🛣️ API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Packages

- `GET /api/packages` - Get all packages (requires auth)
- `POST /api/packages` - Create new package (requires auth)

### Users

- `GET /api/users` - Get current user profile (requires auth)

## 🗄️ Database Schema

### Models

- **User**: User accounts and authentication
- **Session**: Active user sessions
- **Package**: Product packages
- **Order**: User orders

See `prisma/schema.prisma` for detailed schema.

## 🌐 Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/haram-packages.git
git push -u origin main
```

### 2. Create Database in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Storage"** in the top navigation
3. Click **"Create"** and select **"Postgres"**
4. Choose a region and click **"Continue"**
5. Name it `haram-packages-db` and click **"Create"**
6. Copy the **"POSTGRES_URL_NONPOOL"** connection string (you'll need this)

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository
4. Under **"Environment Variables"**, add these:
   - `DATABASE_URL`: Paste the connection string from step 2.6
   - `LOGIN_USERNAME`: `admin` (or your chosen username)
   - `LOGIN_PASSWORD`: Your secure password
   - `JWT_SECRET`: Generate a random 32+ character string (use [this tool](https://www.uuidgenerator.net/))
   - `NEXT_PUBLIC_API_URL`: `https://<your-vercel-domain>.vercel.app` (you'll get this after deployment)

5. Click **"Deploy"**

### 4. Run Database Migrations (after first deployment)

After your app deploys successfully:

1. Go to your Vercel project **"Deployments"** tab
2. Click the latest deployment
3. Open the **"Functions"** logs
4. Your database is ready - Prisma will auto-sync the schema on first deploy

**Note:** If you need to run migrations manually later, use:
```bash
DATABASE_URL="your_connection_string" npm run db:push
```

## 📦 Database Migration

### Run migrations locally:

```bash
npm run db:migrate
```

### Generate Prisma client:

```bash
npm run db:generate
```

### Push schema to database:

```bash
npm run db:push
```

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env.local`
2. **JWT Secret**: Use a strong, random secret (32+ characters)
3. **Password**: Use strong passwords in production
4. **HTTPS**: Always use HTTPS in production
5. **Database**: Use strong database credentials
6. **CORS**: Configure CORS appropriately in `next.config.js`

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Database commands
npm run db:migrate    # Run database migrations
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema without migrations
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `LOGIN_USERNAME` | Admin username for login | `admin` |
| `LOGIN_PASSWORD` | Admin password for login | `secure_password_123` |
| `JWT_SECRET` | Secret key for JWT signing | `random_key_min_32_chars` |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL | `https://yourapp.vercel.app` |
| `NODE_ENV` | Environment type | `production` |

## 🚨 Troubleshooting

### Login not working?
- Check `.env.local` for `LOGIN_USERNAME` and `LOGIN_PASSWORD`
- Ensure credentials match exactly (case-sensitive)

### Database errors?
- Verify `DATABASE_URL` is correct
- Run `npm run db:push` to sync schema
- Check database connection permissions

### Vercel deployment issues?
- Check all environment variables are set in Vercel dashboard
- Review build logs in Vercel for errors
- Ensure `NODE_ENV=production` is not set (Vercel sets automatically)

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Vercel Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)
- [JWT Basics](https://jwt.io)

## 📄 License

This project is created for Haram Packages.

## 👤 Support

For issues or questions, please create an issue in the repository.

---

**Ready to deploy?** Follow the Vercel Deployment section above!
