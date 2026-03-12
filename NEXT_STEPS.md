# 🚀 Next Steps - Getting Started

Your complete Next.js full-stack application is ready! Follow these steps to run it locally and deploy to Vercel.

---

## ⚡ Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd HaramPackages-NextJS
npm install
```

### Step 2: Setup Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/haram_packages"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
JWT_SECRET="your_super_secret_key_at_least_32_characters_long_string"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Step 3: Setup Database
```bash
npx prisma generate
npx prisma db push
```

### Step 4: Run Development Server
```bash
npm run dev
```

### Step 5: Open Application
```
URL: http://localhost:3000
Username: admin
Password: admin123
```

**Done!** You should see the login page.

---

## 📋 Step-by-Step Details

### 1️⃣ Install Node Dependencies

```bash
npm install
```

Installs:
- Next.js 14+
- React 18+
- Prisma ORM
- TypeScript
- Tailwind CSS
- Axios
- jsonwebtoken
- And more...

**Time**: ~2-3 minutes

---

### 2️⃣ Setup PostgreSQL Database

You need a PostgreSQL database. Choose one:

#### Option A: Local PostgreSQL (Recommended for Testing)
```bash
# Install PostgreSQL
# Visit: https://www.postgresql.org/download/

# Create database
CREATE DATABASE haram_packages;

# Get connection string
postgresql://postgres:password@localhost:5432/haram_packages
```

#### Option B: Online PostgreSQL (Recommended for Learning)
- **Railway.app**: Free tier, easy setup → https://railway.app
- **Supabase.com**: Free PostgreSQL → https://supabase.com
- **Vercel Postgres**: When deploying → https://vercel.com/storage/postgres
- **Neon.tech**: Free PostgreSQL → https://neon.tech

---

### 3️⃣ Configure Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Database connection (REQUIRED)
DATABASE_URL="postgresql://your_db_user:your_db_password@your_db_host:5432/haram_packages"

# Login credentials (REQUIRED - Change admin password!)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"

# JWT configuration (REQUIRED - Generate random secret)
JWT_SECRET="copy_paste_a_random_32_character_string_here"
JWT_EXPIRES_IN="7d"

# Application settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**⚠️ Important**:
- Never commit `.env.local` to Git
- `.env.local` is in .gitignore (won't be uploaded)
- Change ADMIN_PASSWORD to something secure!
- JWT_SECRET should be 32+ random characters

---

### 4️⃣ Initialize Database

Generate Prisma client:
```bash
npx prisma generate
```

Create database tables:
```bash
npx prisma db push
```

This:
✅ Creates all 8 tables (User, Customer, Transaction, Invoice, Account, etc.)  
✅ Sets up relationships and constraints  
✅ Initializes the Prisma client  

**You should see**: "Your database is now in sync with your schema"

---

### 5️⃣ Run Development Server

```bash
npm run dev
```

You should see:
```
> next dev

⚡ Ready in 2.5s
🔲 Local:     http://localhost:3000
🔲 Environments: .env.local
```

---

### 6️⃣ Login to Application

1. Open http://localhost:3000
2. You'll see the Login page
3. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
4. Click "Login"
5. You'll see the Daybook page ✅

---

## 🧪 Test All Features (10 minutes)

### 1. Create a Customer
- Click "Customers" in sidebar
- Click "Add Customer" button
- Fill in:
  - Name: "Test Customer"
  - Phone: "1234567890"
  - Opening Balance: "1000" (or 0)
  - Type: "customer"
- Click "Add"
- ✅ Customer appears in list

### 2. Create an Account
- Click "Accounts" in sidebar
- Click "Add Account" button
- Fill in:
  - Account Name: "Test Account"
  - Account Type: "Bank"
  - Opening Balance: "5000"
- Click "Add"
- ✅ Account appears in list

### 3. Create a Transaction
- Click "Daybook" in sidebar
- Click "Add Inward Transaction"
- Fill in:
  - Title: "Test Transaction"
  - Customer: "Test Customer"
  - Amount: "500"
  - Account: "Test Account"
  - Description: "Test"
- Click "Add"
- ✅ Balance updates automatically:
  - Account balance: 5500 (added)
  - Customer balance: 1500 (increased receivable)

### 4. Create an Invoice
- Click "Invoices" in sidebar
- Click "Add Invoice"
- Fill in:
  - Invoice Number: "INV001"
  - Customer: "Test Customer"
  - Amount: "1000"
  - Type: "customer"
  - Date: Today
- Click "Create"
- ✅ ledger balance updates

### 5. Check Balance Inquiry
- Click "Balance Inquiry"
- See "Test Customer" under Receivables
- Amount should be: Opening + Transaction + Invoice
- ✅ Everything calculated correctly

### 6. View All Transactions
- Click "Transactions" in sidebar
- See all your transactions listed
- Click transaction to see details
- ✅ Can delete transactions (balances reverse)

### 7. Test Logout
- Click username in top-right
- Click "Logout"
- You're redirected to login page ✅

---

## 📱 What Each Page Does

| Page | Purpose | Location |
|------|---------|----------|
| **Daybook** | Daily transaction summary | `/daybook` |
| **Customers** | Manage customers & suppliers | `/customers` |
| **Accounts** | Manage bank & cash accounts | `/accounts` |
| **Invoices** | Create & manage invoices | `/invoices` |
| **Balance Inquiry** | View receivables & payables | `/balance` |
| **Transactions** | View all transactions | `/transactions` |
| **Login** | Authenticate with JWT | `/login` |

---

## 🎯 Common Tasks

### Change Admin Password
Edit `.env.local`:
```env
ADMIN_PASSWORD="your_new_secure_password"
```

Restart development server (Ctrl+C, then `npm run dev`).

### Change JWT Expiration
Edit `.env.local`:
```env
JWT_EXPIRES_IN="14d"    # Default: 7d
JWT_EXPIRES_IN="720h"   # Hours
JWT_EXPIRES_IN="43200m" # Minutes
```

### View Database
```bash
npx prisma studio
```
Opens http://localhost:5555 to browse your data visually.

### Reset Database
```bash
# WARNING: This deletes all data!
npx prisma migrate reset
```

### Generate New Database Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy and paste into JWT_SECRET.

---

## 🚨 Troubleshooting

### "Cannot find module 'next'"
```bash
npm install
```

### "ECONNREFUSED" - Database Connection Error
- Check DATABASE_URL is correct
- Verify PostgreSQL is running
- Verify database exists
- Try connection:
  ```bash
  psql "your_database_url"
  ```

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Tables don't exist"
```bash
npx prisma db push
```

### Login fails with "Invalid credentials"
- Check ADMIN_USERNAME and ADMIN_PASSWORD in `.env.local`
- Verify no extra spaces
- Restart dev server

### "NEXT_PUBLIC_APP_URL is not set"
- Make sure `.env.local` has `NEXT_PUBLIC_APP_URL="http://localhost:3000"`

---

## 📦 Project Structure

```
HaramPackages-NextJS/
├── src/
│   ├── app/
│   │   ├── api/              ← API endpoints
│   │   ├── daybook/          ← Pages & routes
│   │   ├── customers/
│   │   ├── invoices/
│   │   └── ...
│   ├── components/           ← React components
│   └── lib/                  ← Utilities (JWT, Prisma, API)
├── prisma/
│   └── schema.prisma         ← Database models
├── .env.example              ← Copy to .env.local
├── .env.local                ← Your secrets (NOT in Git)
├── package.json
└── README.md                 ← Full documentation
```

---

## 🚀 Deploy to Vercel

When ready to deploy:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial Next.js deployment"
   git push origin main
   ```

2. **Go to Vercel**
   - Visit https://vercel.com
   - Click "New Project"
   - Select your GitHub repo
   - Click "Import"

3. **Add Environment Variables**
   In Vercel dashboard, add:
   - `DATABASE_URL` = Your production PostgreSQL URL
   - `ADMIN_USERNAME` = "admin" (or your username)
   - `ADMIN_PASSWORD` = Your secure password
   - `JWT_SECRET` = Generate new 32+ char string
   - `JWT_EXPIRES_IN` = "7d"
   - `NEXT_PUBLIC_APP_URL` = Your Vercel domain
   - `NODE_ENV` = "production"

4. **Click Deploy**
   Vercel automatically:
   - Installs dependencies
   - Builds Next.js app
   - Generates Prisma client
   - Runs database migrations
   - Deploys to CDN

5. **Access Your App**
   - URL: `https://your-project.vercel.app`
   - Login with your credentials

---

## 📊 Build & Run Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build           # Build for production
npm run start           # Run production build
npm run lint            # Check TypeScript & ESLint
npm run format          # Format code with Prettier

# Database
npx prisma studio      # Browse data visually
npx prisma db push     # Sync database with schema
npx prisma generate    # Regenerate Prisma client
npx prisma migrate     # Create migration
```

---

## ✅ Final Checklist

- [ ] Node.js installed (v16+)
- [ ] PostgreSQL database created
- [ ] `.env.local` file created with variables
- [ ] `npm install` completed
- [ ] `npx prisma db push` successful
- [ ] `npm run dev` running
- [ ] Can login at http://localhost:3000
- [ ] Can create customer
- [ ] Can create account
- [ ] Can create transaction
- [ ] Balance updates correctly
- [ ] Can logout

---

## 🎓 Learn More

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **JWT**: https://jwt.io

---

## 📞 Need Help?

See:
- **README.md** - Full documentation
- **VERCEL_DEPLOYMENT.md** - Production deployment guide
- **COMPLETION_SUMMARY.md** - What was completed
- **API_DOCS.md** - API endpoint reference

---

**Ready to start?**

```bash
cd HaramPackages-NextJS
npm install
cp .env.example .env.local
# Edit .env.local with your database
npx prisma db push
npm run dev
```

**Then visit**: http://localhost:3000 ✅
→ Open **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### For API Details (⏱️ 15 min)
→ Open **[API_DOCS.md](./API_DOCS.md)**

---

## ✅ Validation Checklist

Run this to verify everything is set up:

```powershell
# Check Node.js version (should be 18+)
node --version

# List project files
dir src

# Check dependencies
cat package.json
```

---

## 🚀 Deployment When Ready

When you're ready to deploy to Vercel:

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Add Next.js migration"
   git push origin main
   ```

2. **Go to Vercel**: https://vercel.com

3. **Import Project** from GitHub

4. **Add Environment Variables**:
   - LOGIN_USERNAME: your_username
   - LOGIN_PASSWORD: your_password
   - JWT_SECRET: random_string_32_chars
   - DATABASE_URL: your_db_connection
   - NEXT_PUBLIC_API_URL: your_vercel_url

5. **Deploy** - Done! 🎉

---

## 🆘 Common Issues

### Q: Port 3000 already in use?
```bash
npm run dev -- -p 3001
```

### Q: npm install fails?
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

### Q: Login not working?
```
Check .env.local for correct credentials
USERNAME and PASSWORD must match exactly
```

### Q: Need more help?
→ Check **[DEVELOPMENT.md](./DEVELOPMENT.md#troubleshooting)**

---

## 📊 What You Have

✅ Complete Next.js 14 full-stack app  
✅ React components with TypeScript  
✅ Node.js backend API routes  
✅ JWT authentication system  
✅ Database schema (Prisma + PostgreSQL ready)  
✅ Environment variable configuration  
✅ Vercel deployment ready  
✅ 7 comprehensive documentation files  
✅ Setup automation scripts  
✅ Production-ready code  

---

## 🎓 File Navigation

### In VS Code ESplorer

```
▼ HaramPackages-NextJS
  ▼ src/
    ▼ app/
      ▼ api/           👈 Backend APIs
      ▼ dashboard/     👈 Main page
      ▼ login/         👈 Login page
    ▼ components/      👈 React components
    ▼ lib/            👈 Utilities
  ▼ prisma/           👈 Database
  📄 package.json      👈 Dependencies
  📄 .env.local        👈 Configuration
  📄 README.md         👈 Documentation
```

---

## 🎯 Development Tips

### Best Practices
1. Keep API logic in `/src/app/api/`
2. Components go in `/src/components/`
3. Utilities in `/src/lib/`
4. Update `.env.local` for your settings
5. Never commit `.env.local` to Git

### Common Tasks
```bash
# Add new page
# Create: src/app/mypage/page.tsx

# Add new API endpoint
# Create: src/app/api/myendpoint/route.ts

# Add new component
# Create: src/components/MyComponent.tsx
# Create: src/components/component.module.css

# Update database schema
# Edit: prisma/schema.prisma
# Run: npx prisma migrate dev
```

---

## 💡 Useful VS Code Extensions

```
Recommended:
- Prisma (Prisma)
- ESLint
- Prettier
- Thunder Client (API testing)
- REST Client (for API.http files)
```

---

## 🌟 Success Metrics

After setup, you should be able to:

- [ ] `npm install` succeeds
- [ ] `npm run dev` starts server
- [ ] Homepage redirects to `/login`
- [ ] Login works with default credentials
- [ ] Dashboard loads after login
- [ ] Logout returns to login page
- [ ] API returns 401 without token
- [ ] API works with valid token

---

## 🎁 Bonus Files Included

- **COMPLETION_SUMMARY.md** - This summary
- **STRUCTURE_VISUAL.md** - Visual file structure
- **PROJECT_STRUCTURE.md** - Detailed file listing
- **FEATURES.md** - Feature overview
- **setup.sh** - Auto setup for Mac/Linux
- **setup.ps1** - Auto setup for Windows

---

## 📞 Getting Help

1. Check the relevant documentation file
2. Review error messages carefully
3. Check browser console (F12)
4. Check terminal output
5. See DEVELOPMENT.md troubleshooting

---

## 🚀 You're Ready!

Everything is set up and ready for development!

### To Get Started Now:

```bash
cd C:\Users\faiqs\Desktop\Projects\Haram-Packages\HaramPackages-NextJS
npm install
npm run dev
```

Then visit: **http://localhost:3000**

---

## 📅 Timeline

```
✅ Project Structure    Created
✅ Dependencies         Configured
✅ API Routes           Implemented
✅ Authentication       Set up
✅ Frontend Components  Built
✅ Database Schema      Designed
✅ Documentation        Written
✅ Deployment Ready     Configured

⏭️  Ready for Development!
    Ready for Deployment!
```

---

**Start developing now!** 🚀

*Questions? Check the documentation files in your project!*

---

**Project Location:** `C:\Users\faiqs\Desktop\Projects\Haram-Packages\HaramPackages-NextJS`  
**Status:** ✅ Production Ready  
**Next:** Run `npm install && npm run dev`
