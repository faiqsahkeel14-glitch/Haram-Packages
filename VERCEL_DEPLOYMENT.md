# Haram Packages - Vercel Deployment Guide

## Prerequisites

Before deploying to Vercel, ensure you have:
- A Vercel account (https://vercel.com)
- GitHub repository with this code
- A PostgreSQL database (can use Vercel PostgreSQL)
- Node.js 18+ installed locally

## Option 1: Deploy Using Vercel Dashboard (Recommended for Beginners)

### Step 1: Prepare Your Repository
1. Push your code to GitHub
2. Ensure `.env.local` is in `.gitignore` (it should be)
3. Don't commit sensitive environment variables

### Step 2: Connect to Vercel
1. Go to https://vercel.com/new
2. Click "Select Repository" and choose your GitHub repo
3. Click "Import"

### Step 3: Configure Environment Variables
In the Vercel dashboard, add the following environment variables:

```
DATABASE_URL=postgresql://user:password@host:port/dbname
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_very_long_secure_random_string_minimum_32_characters
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Once deployed, Vercel will run the build command which includes:
   - `npm run build`
   - `npx prisma generate`
   - `npx prisma db push` (creates tables in your database)

## Option 2: Deploy Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Database Setup

### Option A: Using Vercel Postgres
1. In your Vercel project settings, click "Storage"
2. Create a new Postgres database
3. Copy the `POSTGRES_URL_NON_POOLING` value
4. Set as `DATABASE_URL` in environment variables

### Option B: Using External PostgreSQL
1. Get your PostgreSQL connection string
2. Format: `postgresql://username:password@host:port/database`
3. Set as `DATABASE_URL` in environment variables

## Environment Variables Explained

- **DATABASE_URL**: Connection string for PostgreSQL database
- **ADMIN_USERNAME**: Username for admin login (default: admin)
- **ADMIN_PASSWORD**: Password for admin login (change this in production!)
- **JWT_SECRET**: Secret key for JWT token signing (generate random string)
- **JWT_EXPIRES_IN**: How long tokens are valid (default: 7d)
- **NEXT_PUBLIC_APP_URL**: Your deployed URL (e.g., https://app.example.com)

## Database Initialization

After deploying, Vercel will automatically:
1. Install dependencies
2. Generate Prisma client
3. Run `prisma db push` to create all tables

No manual database setup is needed!

## First Login

Default login credentials:
- **Username**: admin
- **Password**: admin123

⚠️ Change the admin password immediately in environment variables!

## Production Checklist

- [ ] Change `ADMIN_PASSWORD` to a strong password
- [ ] Set `JWT_SECRET` to a long random string (min 32 chars)
- [ ] Verify `DATABASE_URL` is using production database
- [ ] Set `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set `NODE_ENV=production`
- [ ] Test login and all pages work correctly
- [ ] Monitor Vercel logs for errors

## Monitoring & Logs

View logs in Vercel dashboard:
1. Go to your project in Vercel
2. Click "Functions" to see server logs
3. Check deployment history for any errors

## Troubleshooting

### Build Fails
- Check that `package.json` has all dependencies
- Verify `DATABASE_URL` is correct
- Check Prisma schema syntax

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check if database server is running
- Ensure firewall allows connections from Vercel IPs

### Login Not Working
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set
- Check `JWT_SECRET` is at least 32 characters
- Clear browser cache and try again

### Pages Not Loading
- Check Vercel deployment logs
- Verify API routes in "Functions" tab
- Test with curl: `curl -H "Authorization: Bearer YOUR_TOKEN" https://your-app.com/api/customers`

## Updating the Application

To update after changes:
1. Push changes to GitHub
2. Vercel automatically redeploys on push
3. Database migrations run automatically
4. No downtime for code updates

## Performance Tips

1. Database queries are optimized with Prisma
2. API routes use transaction for data integrity
3. Consider adding caching for frequently used data
4. Monitor Vercel Analytics for performance

## Security Best Practices

1. ✅ Change default admin password
2. ✅ Use strong JWT_SECRET
3. ✅ Keep DATABASE_URL secret (use Vercel secrets)
4. ✅ Enable HTTPS (automatic with Vercel)
5. ✅ Regularly rotate passwords
6. ✅ Monitor deployment logs for anomalies

## Support

For Vercel-specific issues: https://vercel.com/docs
For issues with this app, check the main README.md
