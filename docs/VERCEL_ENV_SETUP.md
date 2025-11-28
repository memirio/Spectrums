# Setting Environment Variables in Vercel

This guide shows you exactly how to add environment variables to your Vercel deployment.

## Method 1: Vercel Dashboard (Easiest)

### Step 1: Navigate to Environment Variables

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **Looma** project
3. Click **Settings** in the top navigation
4. Click **Environment Variables** in the left sidebar

### Step 2: Add Each Variable

For each environment variable, follow these steps:

1. Click **"Add New"** button
2. Enter the **Name** (e.g., `DATABASE_URL`)
3. Enter the **Value** (paste your actual value)
4. Select which environments to apply to:
   - ✅ **Production** (your live site)
   - ✅ **Preview** (pull request previews)
   - ✅ **Development** (local `vercel dev` command)
5. Click **"Save"**

### Step 3: Required Variables

Add these variables (in this order):

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL
Value: postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
Environments: Production, Preview, Development

# Concept Generation (required)
GEMINI_API_KEY
Value: your-google-gemini-api-key
Environments: Production, Preview, Development

# Query Expansion (required)
GROQ_API_KEY
Value: your-groq-api-key
Environments: Production, Preview, Development

# OpenAI API (optional)
OPENAI_API_KEY
Value: your-openai-api-key
Environments: Production, Preview, Development

# Supabase Storage
SUPABASE_URL
Value: https://xxxxx.supabase.co
Environments: Production, Preview, Development

SUPABASE_KEY
Value: your-supabase-anon-key
Environments: Production, Preview, Development

SUPABASE_SERVICE_ROLE_KEY (optional)
Value: your-supabase-service-role-key
Environments: Production, Preview, Development

# Next.js
NODE_ENV
Value: production
Environments: Production only

NEXT_PUBLIC_APP_URL
Value: https://yourdomain.com
Environments: Production, Preview, Development
```

### Step 4: Redeploy

After adding all variables:

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Confirm the redeploy

**Why redeploy?** Environment variables are only injected into new deployments. Your existing deployment won't have access to the new variables until you redeploy.

---

## Method 2: Vercel CLI

### Step 1: Install Vercel CLI (if not already installed)

```bash
npm i -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Link Your Project

```bash
cd /path/to/Looma
vercel link
```

This will:
- Ask you to select your Vercel account
- Ask if you want to link to an existing project (select **Yes**)
- List your projects (select **Looma**)

### Step 4: Add Environment Variables

For each variable, run:

```bash
# Production environment
vercel env add DATABASE_URL production
# When prompted, paste your value and press Enter

vercel env add GEMINI_API_KEY production
vercel env add GROQ_API_KEY production
vercel env add OPENAI_API_KEY production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_APP_URL production

# Preview environment (repeat for each variable)
vercel env add DATABASE_URL preview
vercel env add GEMINI_API_KEY preview
# ... etc

# Development environment (repeat for each variable)
vercel env add DATABASE_URL development
vercel env add GEMINI_API_KEY development
# ... etc
```

**Tip**: You can add the same variable to multiple environments in one command:

```bash
vercel env add DATABASE_URL production preview development
```

### Step 5: Deploy

```bash
vercel --prod
```

---

## Method 3: Using `.env` File (Local Development Only)

For local development with `vercel dev`, create a `.env.local` file:

```bash
# .env.local (DO NOT commit this file!)
DATABASE_URL="postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
GEMINI_API_KEY="your-google-gemini-api-key"
GROQ_API_KEY="your-groq-api-key"
OPENAI_API_KEY="your-openai-api-key"
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

**Important**: 
- `.env.local` is gitignored (won't be committed)
- This only works for local `vercel dev` command
- For production, you **must** add variables via Dashboard or CLI

---

## Verifying Environment Variables

### Check in Dashboard

1. Go to **Settings** → **Environment Variables**
2. You should see all your variables listed
3. Values are hidden (shown as `••••••••`)

### Check in Deployment Logs

1. Go to **Deployments** tab
2. Click on a deployment
3. Click **"Build Logs"**
4. Environment variables are available during build, but values are not shown in logs (for security)

### Test in Your App

Add a temporary API route to verify:

```typescript
// src/app/api/test-env/route.ts (temporary - remove after testing)
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasGroqKey: !!process.env.GROQ_API_KEY,
    // Don't return actual values for security!
  })
}
```

Visit `https://yourdomain.com/api/test-env` to verify variables are loaded.

---

## Troubleshooting

### Variables Not Working?

1. **Did you redeploy?** Variables only apply to new deployments
2. **Check environment selection**: Make sure you selected the right environment (Production/Preview/Development)
3. **Check spelling**: Variable names are case-sensitive
4. **Check for typos**: `DATABASE_URL` not `DATABASE_URI`

### Variables Not Available in Build?

- Make sure variables are added to **Production** environment
- Redeploy after adding variables
- Check build logs for errors

### Variables Visible in Client-Side Code?

- Only variables prefixed with `NEXT_PUBLIC_` are available in the browser
- Never add secrets with `NEXT_PUBLIC_` prefix
- Server-side variables (without prefix) are only available in API routes and server components

---

## Security Best Practices

1. ✅ **Never commit** `.env` files to Git
2. ✅ **Use different keys** for production vs development
3. ✅ **Rotate keys** if they're exposed
4. ✅ **Use Vercel's built-in secrets** (they're encrypted at rest)
5. ✅ **Limit access** - only add variables to environments that need them
6. ❌ **Don't** log environment variable values
7. ❌ **Don't** expose secrets in client-side code

---

## Quick Reference

**Dashboard URL**: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**CLI Command**: `vercel env add VARIABLE_NAME environment`

**Redeploy Command**: `vercel --prod` or use Dashboard → Deployments → Redeploy

