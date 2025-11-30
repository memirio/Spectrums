# Railway Build Issue - Manual Fix Required

Railway is detecting the root `package.json` and trying to build the Next.js app instead of the embedding service.

## Solution: Override Build Command in Railway UI

1. **Go to Railway Dashboard** → Your Service → **Settings**

2. **Scroll to "Build & Deploy" section**

3. **Override Build Command:**
   - Find **"Build Command"** field
   - Set it to: `npm install --omit=dev`
   - This will ONLY install dependencies, not run any build scripts

4. **Override Start Command:**
   - Find **"Start Command"** field  
   - Set it to: `node server.js`

5. **Save** and **Redeploy**

## Why This Works

- Railway detects `package.json` and tries to run `npm run build` automatically
- By overriding the build command, we skip the root build script
- The start command runs `server.js` directly from the embedding-service directory

## Alternative: Check Root Directory

Make sure Root Directory is set to:
- `embedding-service` (without leading slash)
- NOT `/embedding-service` (with slash)

## After Fix

You should see in logs:
- ✅ `npm install` (installing express, cors, @xenova/transformers, etc.)
- ✅ `node server.js`
- ✅ `[embedding-service] Server running on port...`
- ❌ NO `prisma generate`
- ❌ NO `next build`

