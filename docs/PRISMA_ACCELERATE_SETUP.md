# Prisma Accelerate Setup Guide

Prisma Accelerate (Data Proxy) is the recommended solution for serverless environments like Vercel. It eliminates binary issues and provides automatic connection pooling.

## Step 1: Sign Up for Prisma Cloud

1. Go to https://console.prisma.io/
2. Sign up or log in (free tier available)
3. Create a new project or select an existing one

## Step 2: Create a Data Proxy Connection

1. In Prisma Cloud dashboard, click **"Data Proxy"** or **"Accelerate"**
2. Click **"Create Connection"** or **"Add Database"**
3. Select **"PostgreSQL"** as your database type
4. Enter your Supabase connection details:
   - **Host**: `db.tsxoosjxjlfejnxbcqff.supabase.co` (your Supabase host)
   - **Port**: `5432`
   - **Database**: `postgres`
   - **Username**: `postgres`
   - **Password**: Your Supabase database password
5. Click **"Create"** or **"Save"**

## Step 3: Get Your Accelerate Connection String

After creating the connection, Prisma will provide you with a connection string that looks like:

```
prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Copy this connection string** - you'll need it for Vercel.

## Step 4: Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Find your `DATABASE_URL` variable
4. Click **"Edit"**
5. Replace the value with your Prisma Accelerate connection string (the `prisma://` one)
6. Make sure it's set for **Production**, **Preview**, and **Development** environments
7. Click **"Save"**

## Step 5: Update Your Code (Optional)

Your code should already work with the `prisma://` connection string. The existing code in `src/lib/prisma.ts` will automatically detect it:

```typescript
// This code already handles prisma:// URLs
if (process.env.DATABASE_URL?.includes('prisma://')) {
  // Uses Prisma Data Proxy automatically
}
```

## Step 6: Redeploy

After updating the `DATABASE_URL` in Vercel:

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger a redeploy

## Benefits of Prisma Accelerate

✅ **No binary issues** - Queries go through Prisma's cloud, no native binaries needed
✅ **Automatic connection pooling** - Optimized for serverless environments
✅ **Better performance** - Reduced cold starts and connection overhead
✅ **Free tier available** - Includes generous free usage
✅ **Works everywhere** - Same connection string works in all environments

## Troubleshooting

### Connection String Not Working?

- Make sure you copied the **entire** connection string (it's long!)
- Verify the connection string starts with `prisma://`
- Check that the API key in the connection string is valid

### Still Getting Binary Errors?

- Make sure you updated `DATABASE_URL` in Vercel (not just locally)
- Redeploy after updating the environment variable
- Check that the connection string starts with `prisma://` (not `postgresql://`)

### Need Help?

- Prisma Accelerate Docs: https://www.prisma.io/docs/accelerate
- Prisma Support: https://www.prisma.io/support

