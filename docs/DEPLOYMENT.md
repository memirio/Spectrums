# Deployment Guide

This guide will help you deploy Spectrums to your own domain.

## Prerequisites

Before deploying, make sure you have:
- ✅ A domain name
- ✅ Supabase project set up (for database and image storage)
- ✅ API keys: `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY` (optional)
- ✅ Supabase credentials: `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Required Environment Variables

Your production environment needs these variables:

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Concept Generation (required for auto-tagging)
GEMINI_API_KEY="your-google-gemini-api-key"

# Query Expansion (required for abstract query expansion)
GROQ_API_KEY="your-groq-api-key"

# OpenAI API (optional - for generating concept relationships)
OPENAI_API_KEY="your-openai-api-key"

# Supabase Storage (for images)
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"  # Optional, for admin operations

# Next.js (optional)
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"  # Your domain URL
```

## Deployment Options

### Option 1: Railway (Recommended - Supports Native Binaries)

**Railway is the recommended option** because it supports native binaries (required for `@xenova/transformers`), making it the easiest deployment with zero code changes.

#### Steps:

1. **Sign up/Login to Railway**:
   - Go to https://railway.app
   - Sign up/login with your GitHub account

2. **Create a new project**:
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Select your `Spectrums` repository
   - Railway will auto-detect Next.js

3. **Add environment variables**:
   - In your Railway project dashboard, go to **Variables** tab
   - Click **"New Variable"** and add each required variable:
     - `DATABASE_URL` (your Supabase connection string)
     - `GEMINI_API_KEY`
     - `GROQ_API_KEY`
     - `OPENAI_API_KEY` (optional)
     - `SUPABASE_URL`
     - `SUPABASE_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (optional)
     - `NODE_ENV` = `production`
     - `NEXT_PUBLIC_APP_URL` = `https://your-app-name.up.railway.app` (or your custom domain)

4. **Deploy**:
   - Railway will automatically deploy when you push to your main branch
   - Or click **"Deploy"** in the dashboard
   - Your app will be live at `https://your-app-name.up.railway.app`

5. **Custom Domain (Optional)**:
   - Go to **Settings** → **Networking**
   - Click **"Custom Domain"**
   - Add your domain and follow DNS instructions

**Benefits:**
- ✅ Supports native binaries (`@xenova/transformers` works out of the box)
- ✅ Zero code changes required
- ✅ Free tier available ($5 credit/month)
- ✅ Automatic deployments from GitHub
- ✅ Easy environment variable management

---

### Option 2: Vercel (Limited - No Native Binaries)

**Note**: Vercel doesn't support native binaries, so `@xenova/transformers` won't work. You'll need to use an external embeddings API instead.

Vercel is the easiest option for Next.js applications and provides automatic SSL, CDN, and domain configuration.

#### Steps:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from main branch**:
   ```bash
   vercel --prod
   ```

4. **Add environment variables**:
   
   **Option A: Via Vercel Dashboard (Recommended)**
   - Go to your project dashboard: https://vercel.com/dashboard
   - Select your project → **Settings** → **Environment Variables**
   - Click **"Add New"** for each variable
   - Add all required environment variables listed above:
     - `DATABASE_URL` (select all environments: Production, Preview, Development)
     - `GEMINI_API_KEY` (select all environments)
     - `GROQ_API_KEY` (select all environments)
     - `OPENAI_API_KEY` (optional, select all environments)
     - `SUPABASE_URL` (select all environments)
     - `SUPABASE_KEY` (select all environments)
     - `SUPABASE_SERVICE_ROLE_KEY` (optional, select all environments)
     - `NODE_ENV` = `production` (Production only)
     - `NEXT_PUBLIC_APP_URL` = `https://yourdomain.com` (select all environments)
   - Click **"Save"** after adding each variable
   - **Important**: After adding variables, you need to redeploy for them to take effect
   
   **Option B: Via Vercel CLI**
   ```bash
   # Set environment variables (replace with your actual values)
   vercel env add DATABASE_URL production
   vercel env add GEMINI_API_KEY production
   vercel env add GROQ_API_KEY production
   vercel env add OPENAI_API_KEY production
   vercel env add SUPABASE_URL production
   vercel env add SUPABASE_KEY production
   vercel env add SUPABASE_SERVICE_ROLE_KEY production
   vercel env add NEXT_PUBLIC_APP_URL production
   
   # Also add to preview and development environments
   vercel env add DATABASE_URL preview
   vercel env add DATABASE_URL development
   # ... repeat for other variables
   ```
   
   **Note**: When using the CLI, you'll be prompted to enter the value for each variable. The values are hidden for security.

5. **Configure Production Branch** (if needed):
   - Go to **Settings** → **Git**
   - **Production Branch**: Should be set to `main` (default)
   - You can change this if you use a different branch (e.g., `master`, `production`)
   - **Note**: Only the production branch deploys to your custom domain

6. **Configure custom domain**:
   - Go to **Settings** → **Domains**
   - Click **"Add"** and enter your domain (e.g., `spectrums.com`)
   - Follow DNS instructions to add the required records:
     - **A record** or **CNAME record** pointing to Vercel's servers
   - Vercel will automatically provision SSL certificates (takes ~1-2 minutes)

7. **Automatic Deployments**:
   - ✅ **Push to `main`** → Automatically deploys to production
   - ✅ **Create Pull Request** → Automatically creates preview deployment
   - ✅ **Push to other branches** → Creates preview deployment URL
   - You can disable automatic deployments in **Settings** → **Git** if you prefer manual control

8. **Redeploy** (required after adding environment variables):
   - **Automatic**: Just push to `main` branch
   - **Manual**: Go to **Deployments** tab → Click **"..."** on latest deployment → **"Redeploy"**
   - **CLI**: `vercel --prod`
   
   **Important**: Environment variables are only available to new deployments. Existing deployments won't have access to newly added variables until you redeploy.

#### Vercel Configuration

Create a `vercel.json` file in the root (optional, for custom settings):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Pros:**
- ✅ Zero-config deployment for Next.js
- ✅ Automatic SSL certificates
- ✅ Global CDN
- ✅ Preview deployments for PRs
- ✅ Free tier available

**Cons:**
- ⚠️ Serverless functions have execution time limits (10s on free tier, 60s on Pro)
- ⚠️ Cold starts possible (but minimal with Next.js)

---

### Option 2: Railway

Railway is great for full-stack apps with databases and background jobs.

#### Steps:

1. **Sign up** at [railway.app](https://railway.app)

2. **Create new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select the `spectrums` repository
   - Select the `main` branch

3. **Add environment variables**:
   - Go to your project → Variables
   - Add all required environment variables

4. **Configure custom domain**:
   - Go to Settings → Networking
   - Click "Generate Domain" (or add custom domain)
   - For custom domain:
     - Add your domain
     - Follow DNS instructions (CNAME record)
     - Railway will provision SSL automatically

5. **Deploy**:
   - Railway will automatically deploy on push to `main`
   - Or trigger manually: Settings → Deployments → Redeploy

**Pros:**
- ✅ Easy database integration
- ✅ Persistent storage
- ✅ Background jobs support
- ✅ Free tier available ($5 credit/month)

**Cons:**
- ⚠️ Slightly more complex setup than Vercel

---

### Option 3: Netlify

Similar to Vercel, good for static sites and Next.js.

#### Steps:

1. **Sign up** at [netlify.com](https://netlify.com)

2. **Deploy from Git**:
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub
   - Select repository and `main` branch
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **Add environment variables**:
   - Site settings → Environment variables
   - Add all required variables

4. **Configure custom domain**:
   - Site settings → Domain management
   - Add custom domain
   - Follow DNS instructions

**Pros:**
- ✅ Good Next.js support
- ✅ Free tier
- ✅ Automatic SSL

**Cons:**
- ⚠️ Serverless functions have limits

---

### Option 4: Self-Hosted (VPS/Docker)

For full control, deploy on your own server.

#### Steps:

1. **Set up a VPS** (DigitalOcean, AWS EC2, Linode, etc.)
   - Recommended: Ubuntu 22.04 LTS
   - Minimum: 2GB RAM, 2 CPU cores

2. **Install dependencies**:
   ```bash
   # Install Node.js 22
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install Docker (for optional screenshot service)
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

3. **Clone and build**:
   ```bash
   git clone https://github.com/yourusername/spectrums.git
   cd spectrums
   npm install
   npm run build
   ```

4. **Set up environment variables**:
   ```bash
   # Create .env file
   nano .env
   # Add all required environment variables
   ```

5. **Run with PM2** (process manager):
   ```bash
   npm install -g pm2
   pm2 start npm --name "spectrums" -- start
   pm2 save
   pm2 startup  # Set up auto-start on boot
   ```

6. **Set up Nginx reverse proxy**:
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/spectrums
   ```

   Nginx config:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/spectrums /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Set up SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

8. **Configure DNS**:
   - Add **A record** pointing to your server's IP address
   - Or **CNAME** if using a subdomain

**Pros:**
- ✅ Full control
- ✅ No execution time limits
- ✅ Can run background jobs easily

**Cons:**
- ⚠️ Requires server management
- ⚠️ You're responsible for security updates
- ⚠️ More setup required

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] **Database connection**: Check that the app can connect to Supabase
- [ ] **Image loading**: Verify images load from Supabase Storage
- [ ] **Search functionality**: Test search queries work
- [ ] **Concept tagging**: Test adding a new site and verify auto-tagging works
- [ ] **SSL certificate**: Verify HTTPS is working (check for padlock icon)
- [ ] **Domain redirect**: Set up www → non-www (or vice versa) redirect
- [ ] **Error monitoring**: Set up error tracking (Sentry, LogRocket, etc.)

## Troubleshooting

### Images not loading

- Check Supabase Storage bucket is public
- Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
- Check CORS settings in Supabase dashboard

### Database connection errors

- Verify `DATABASE_URL` is correct
- Check if using Session Pooler connection string (port 6543) for serverless
- Verify database is accessible from your deployment platform

### Build errors

- Ensure all environment variables are set
- Check Node.js version (requires 18+)
- Verify `npm install` completes successfully

### Slow performance

- Enable Next.js image optimization (if not using Supabase CDN)
- Consider using Vercel's Edge Network or Cloudflare
- Optimize database queries (add indexes if needed)

## Recommended: Vercel

For Next.js applications, **Vercel is the recommended choice** because:
- Built by the Next.js team
- Zero-config deployment
- Automatic optimizations
- Free tier is generous
- Easy custom domain setup

Would you like help setting up deployment on a specific platform?

