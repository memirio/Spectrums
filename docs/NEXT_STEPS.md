# Next Steps: Deploy to Vercel

Follow these steps in order to deploy Spectrums to your domain.

## Step 1: Connect Your Repository to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign up/Login if you haven't already

2. **Import Your Project**
   - Click **"Add New Project"** button
   - Click **"Import Git Repository"**
   - Connect your GitHub/GitLab/Bitbucket account (if not already connected)
   - Select your **Spectrums** repository

3. **Configure Project**
   - **Framework Preset**: Should auto-detect "Next.js" ✅
   - **Root Directory**: Leave as `./` (default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)
   - **Production Branch**: `main` (default) ✅

4. **Click "Deploy"**
   - Vercel will start building your project
   - This first deployment will likely fail (no environment variables yet)
   - That's okay! We'll add them next.

### Option B: Via Vercel CLI

```bash
# 1. Install Vercel CLI (if not already installed)
npm i -g vercel

# 2. Login
vercel login

# 3. Link your project
cd /path/to/Spectrums
vercel link

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No (first time)
# - Project name? spectrums (or your choice)
# - Directory? ./
# - Override settings? No

# 4. Deploy
vercel --prod
```

---

## Step 2: Add Environment Variables

**Important**: Your first deployment will fail without these. Add them before or right after the first deploy.

### Quick Checklist

Add these variables in **Settings** → **Environment Variables**:

- [ ] `DATABASE_URL` (Supabase PostgreSQL connection string)
- [ ] `GEMINI_API_KEY` (Google Gemini API key)
- [ ] `GROQ_API_KEY` (Groq API key)
- [ ] `OPENAI_API_KEY` (optional, for concept relationships)
- [ ] `SUPABASE_URL` (your Supabase project URL)
- [ ] `SUPABASE_KEY` (Supabase anon key)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (optional, for admin operations)
- [ ] `NEXT_PUBLIC_APP_URL` (your domain, e.g., `https://yourdomain.com`)

**For each variable:**
- Select all environments: ✅ Production, ✅ Preview, ✅ Development
- Click "Save"

**See detailed guide**: `docs/VERCEL_ENV_SETUP.md`

---

## Step 3: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Find the latest deployment (or the failed one)
3. Click **"..."** (three dots menu)
4. Click **"Redeploy"**
5. Wait for build to complete (~2-5 minutes)

**Or via CLI:**
```bash
vercel --prod
```

---

## Step 4: Configure Custom Domain

1. **Go to Domain Settings**
   - **Settings** → **Domains**

2. **Add Your Domain**
   - Click **"Add"** button
   - Enter your domain (e.g., `spectrums.com` or `www.spectrums.com`)
   - Click **"Add"**

3. **Configure DNS**
   - Vercel will show you DNS instructions
   - You need to add a record in your domain's DNS settings:
     - **Type**: CNAME (recommended) or A record
     - **Name**: `@` (or `www` for subdomain)
     - **Value**: Vercel's provided value (e.g., `cname.vercel-dns.com`)
   - **Where to add**: Your domain registrar's DNS settings
     - GoDaddy, Namecheap, Cloudflare, etc.

4. **Wait for DNS Propagation**
   - Usually takes 5-60 minutes
   - Vercel will show "Valid Configuration" when ready
   - SSL certificate is automatically provisioned (~1-2 minutes after DNS)

5. **Test Your Domain**
   - Visit `https://yourdomain.com`
   - Should see your Looma app! 🎉

---

## Step 5: Verify Everything Works

### Checklist

- [ ] **Site loads**: Visit your domain, see the Spectrums homepage
- [ ] **HTTPS works**: Check for padlock icon (SSL certificate)
- [ ] **Search works**: Try searching for "playful" or "3d"
- [ ] **Images load**: Check that images from Supabase Storage display
- [ ] **Database connection**: Try adding a new site (if you have the form)
- [ ] **API endpoints**: Test `/api/search?q=test`

### Common Issues

**Images not loading?**
- Check Supabase Storage bucket is public
- Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct

**Database errors?**
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure using Session Pooler connection string (port 6543)

**Build fails?**
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Check for TypeScript errors locally: `npm run build`

---

## Step 6: Set Up Automatic Deployments (Already Done!)

If you connected via Git, automatic deployments are already set up:

- ✅ **Push to `main`** → Auto-deploys to production
- ✅ **Create PR** → Auto-creates preview deployment
- ✅ **Push to other branches** → Auto-creates preview URL

No additional setup needed!

---

## Step 7: Optional - Set Up Monitoring

### Error Tracking

Consider setting up error monitoring:

- **Sentry**: https://sentry.io (free tier available)
- **LogRocket**: https://logrocket.com
- **Vercel Analytics**: Built-in, enable in dashboard

### Performance Monitoring

- **Vercel Analytics**: Enable in **Settings** → **Analytics**
- **Web Vitals**: Already included in Next.js

---

## Quick Reference

**Dashboard**: https://vercel.com/dashboard

**Environment Variables**: Settings → Environment Variables

**Domains**: Settings → Domains

**Deployments**: Deployments tab → Click "..." → Redeploy

**CLI Deploy**: `vercel --prod`

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Environment Variables Guide**: `docs/VERCEL_ENV_SETUP.md`
- **Branch Strategy Guide**: `docs/VERCEL_BRANCH_STRATEGY.md`
- **Full Deployment Guide**: `docs/DEPLOYMENT.md`

---

## Summary

1. ✅ Connect repository to Vercel (Dashboard or CLI)
2. ✅ Add environment variables
3. ✅ Redeploy
4. ✅ Configure custom domain
5. ✅ Verify everything works
6. ✅ Done! 🚀

Your site will automatically deploy whenever you push to `main`!

