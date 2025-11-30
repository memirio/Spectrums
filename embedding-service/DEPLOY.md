# Deploy Embedding Service to Railway

## Quick Deploy (5 minutes)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign up/login with GitHub

### Step 2: Deploy from GitHub
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select your `Spectrums` repository
4. Railway will auto-detect it's a Node.js project

### Step 3: Configure Service
1. In your Railway project, click on the service
2. Go to **Settings** tab
3. Set **Root Directory** to: `embedding-service`
4. Click **Save**

### Step 4: Add Environment Variables
1. Go to **Variables** tab
2. Click **"New Variable"**
3. Add:
   - **Name**: `EMBEDDING_SERVICE_API_KEY`
   - **Value**: Generate a secure random string (e.g., `openssl rand -hex 32`)
   - Click **Add**

### Step 5: Deploy
1. Railway will automatically start building
2. Wait for deployment to complete (2-3 minutes)
3. Once deployed, Railway will show you a URL like: `https://your-service.up.railway.app`

### Step 6: Test the Service
```bash
# Health check
curl https://your-service.up.railway.app/health

# Test embedding (replace YOUR_API_KEY)
curl -X POST https://your-service.up.railway.app/embed/text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"texts": ["a cat", "a dog"]}'
```

### Step 7: Update Vercel
1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add:
   - **Name**: `EMBEDDING_SERVICE_URL`
   - **Value**: `https://your-service.up.railway.app` (from Step 5)
   - **Environments**: Production, Preview, Development
   
4. Add:
   - **Name**: `EMBEDDING_SERVICE_API_KEY`
   - **Value**: Same key you set in Railway (Step 4)
   - **Environments**: Production, Preview, Development

5. **Redeploy** your Vercel app (or push a new commit)

## Troubleshooting

### Service won't start
- Check Railway logs: Click on your service → **Deployments** → Click latest deployment → **View Logs**
- Make sure `Root Directory` is set to `embedding-service`

### Embeddings fail
- Check that `EMBEDDING_SERVICE_API_KEY` matches in both Railway and Vercel
- Check Railway logs for errors
- Verify the service URL is correct (no trailing slash)

### Slow responses
- First request is slow (model loading), subsequent requests are fast
- Consider keeping the service "warm" with a health check ping every 5 minutes

## Cost Estimate

Railway free tier: $5 credit/month
- This service uses ~512MB RAM
- Estimated cost: ~$2-3/month (well within free tier)

## Next Steps

Once deployed, your Vercel app will automatically use the Railway service for embeddings. No code changes needed!

