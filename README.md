# Haram Packages - Full-Stack Next.js Application

A complete full-stack Next.js application with authentication, backend API routes, and database integration. Built for easy deployment on Vercel.

## 📋 Features

- ✅ **Full-Stack Architecture**: Next.js 13+ with App Router
- ✅ **Authentication**: JWT-based login with environment variable credentials
- ✅ **Database Ready**: Prisma ORM with PostgreSQL support
- ✅ **API Routes**: Complete REST API backend
- ✅ **React Frontend**: Modern UI components with styling
- ✅ **TypeScript**: Full type safety
- ✅ **Vercel Optimized**: Ready for production deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (for production)

### Installation

1. **Clone and install dependencies**:

```bash
cd HaramPackages-NextJS
npm install
```

2. **Set up environment variables**:

Create a `.env.local` file in the root directory:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/haram_packages"

# Authentication Credentials
LOGIN_USERNAME="admin"
LOGIN_PASSWORD="your_secure_password_here"

# JWT Secret (use a strong random string, min 32 chars)
JWT_SECRET="your_jwt_secret_key_here_min_32_chars_long"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
```

3. **Initialize the database** (optional):

```bash
npm run db:migrate
```

4. **Run development server**:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📚 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/        # Login endpoint
│   │   │   └── verify/       # Token verification
│   │   ├── packages/          # Package management endpoints
│   │   └── users/             # User profile endpoint
│   ├── dashboard/             # Protected dashboard page
│   ├── login/                 # Login page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home/redirect page
│   └── globals.css            # Global styles
├── components/
│   ├── LoginForm.tsx          # Login form component
│   ├── Dashboard.tsx          # Dashboard component
│   ├── login.module.css       # Login styles
│   └── dashboard.module.css   # Dashboard styles
├── lib/
│   └── jwt.ts                 # JWT utilities
├── middleware/
│   └── auth.ts                # Authentication middleware
└── types/
    ├── auth.ts                # Auth types
    └── index.ts               # General types

prisma/
└── schema.prisma              # Database schema

Configuration Files:
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
├── next.config.js             # Next.js configuration
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

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `LOGIN_USERNAME`: Admin username
   - `LOGIN_PASSWORD`: Admin password
   - `JWT_SECRET`: Strong random string (32+ chars)
   - `NEXT_PUBLIC_API_URL`: Your Vercel domain (e.g., `https://yourapp.vercel.app`)

5. Click "Deploy"

### 3. Database Setup

For Vercel production, use:

- **PostgreSQL**: [Vercel PostgreSQL](https://vercel.com/docs/storage/postgres)
- **MongoDB**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

Update your `DATABASE_URL` in Vercel environment variables after setting up.

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
