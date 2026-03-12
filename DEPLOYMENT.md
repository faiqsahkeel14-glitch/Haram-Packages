# Vercel Deployment Guide

## Overview

This Next.js application is fully configured for automatic deployment on Vercel. Follow this guide to deploy your application.

## Prerequisites

- GitHub account with your repository
- Vercel account (free at [vercel.com](https://vercel.com))
- PostgreSQL database (or use Vercel Postgres)

## Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Full-stack Next.js app"
git remote add origin https://github.com/yourusername/repository-name.git
git branch -M main
git push -u origin main
```

## Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Select **"Import Git Repository"**
4. Select your GitHub repository
5. Click **"Import"**

## Step 3: Configure Environment Variables

In the Vercel dashboard, go to **Settings** → **Environment Variables** and add:

### Required Variables:

```
LOGIN_USERNAME = admin
LOGIN_PASSWORD = your_secure_password_here
JWT_SECRET = your_secure_jwt_secret_min_32_chars
DATABASE_URL = your_postgresql_connection_string
NEXT_PUBLIC_API_URL = https://your-project.vercel.app
NODE_ENV = production
```

### Get your DATABASE_URL:

#### Option A: Use Vercel Postgres

1. In Vercel dashboard, click **Storage**
2. Click **Create New** → **Postgres**
3. Accept terms and create database
4. Copy the `POSTGRES_URL` (auto-added as `DATABASE_URL`)

#### Option B: Use External Database

Use your PostgreSQL provider's connection string:
- Heroku PostgreSQL
- Railway.app
- Render
- PlanetScale
- AWS RDS

## Step 4: Deploy

### Automatic Deployment

After setting environment variables:
1. Click **Deploy** in Vercel
2. Wait for build completion (2-3 minutes)
3. Your app will be live at `https://your-project.vercel.app`

### Manual Deployment

```bash
npm install -g vercel
vercel
```

## Step 5: Set Up Database Schema

After first deployment, set up your database:

```bash
npx prisma migrate deploy
# or
npx prisma db push
```

## Step 6: Test Your Deployment

1. Visit `https://your-project.vercel.app`
2. You'll be redirected to login page
3. Use credentials from environment variables:
   - **Username**: Value of `LOGIN_USERNAME`
   - **Password**: Value of `LOGIN_PASSWORD`
4. After login, dashboard will load

## Troubleshooting

### Build Failed

Check logs in Vercel dashboard **Deployments** → **Building logs**

Common issues:
- Missing environment variables → Add them in Settings → Environment Variables
- Database connection → Verify DATABASE_URL is correct
- Node version → Vercel uses Node 18.x by default

### Login Not Working

- Check `LOGIN_USERNAME` and `LOGIN_PASSWORD` match exactly
- Ensure credentials are UTF-8 encoded (no special characters)
- Clear browser cache and try again

### Database Connection Error

- Verify DATABASE_URL format: `postgresql://user:password@host:port/database`
- Check database allows connections from Vercel IP: `76.76.19.0/24`
- Ensure database user has proper permissions

### Pages Not Loading

- Check if `NEXT_PUBLIC_API_URL` matches your Vercel domain
- Clear browser cache
- Check network tab in DevTools for API errors

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Database is PostgreSQL or compatible
- [ ] JWT_SECRET is a strong random string (32+ chars)
- [ ] LOGIN_PASSWORD is changed from default
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] Database backups are configured
- [ ] Custom domain is set up (optional)

## Custom Domain

1. Go to Vercel **Settings** → **Domains**
2. Add your domain
3. Update DNS records according to Vercel instructions
4. Wait for DNS propagation (up to 48 hours)

## Monitoring & Analytics

- **Real-time logs**: Vercel **Deployments** → **Runtime Logs**
- **Performance**: Vercel **Analytics** tab
- **Error tracking**: Check application logs

## Updates & Redeployment

```bash
# Make changes locally
git add .
git commit -m "Update: description"
git push origin main

# Automatic deployment triggers on Vercel
# Check status in Deployments tab
```

## Rollback

To revert to a previous deployment:

1. Go to **Deployments**
2. Find the previous working deployment
3. Click the **...** menu
4. Select **Promote to Production**

## Security Best Practices

1. **Never** commit `.env.local` or secrets
2. Use **Vercel's environment variables** for secrets
3. Rotate `JWT_SECRET` periodically
4. Use strong, unique passwords
5. Enable 2FA on Vercel account
6. Restrict database access by IP

## Scaling

For high traffic:
- Vercel automatically scales serverless functions
- Consider upgrading database for better performance
- Enable caching headers in `next.config.js`
- Use CDN for static assets (automatic with Vercel)

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: Create issue in your repository

---

**Your app is now live!** 🚀
