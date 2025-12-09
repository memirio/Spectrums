# Setting Up Supabase Storage for Image Uploads

This guide will help you set up Supabase Storage for the image upload functionality.

## Step 1: Get Your Supabase Service Role Key

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Scroll down to **Project API keys**
5. Find **`service_role`** key (⚠️ **Keep this secret!** It has admin privileges)
6. Copy the key - this is your `SUPABASE_SERVICE_ROLE_KEY`

**Important**: The `service_role` key bypasses Row Level Security (RLS) and should only be used server-side. Never expose it in client-side code.

## Step 2: Create or Verify Storage Bucket

1. In your Supabase Dashboard, go to **Storage**
2. Check if a bucket named **`Images`** exists
   - If it exists: You're good to go! The default bucket name is `Images`
   - If it doesn't exist: Create it:
     1. Click **"New bucket"**
     2. Name: `Images`
     3. **Public bucket**: ✅ Check this (images need to be publicly accessible)
     4. Click **"Create bucket"**

## Step 3: Set Up Bucket Policies (Optional but Recommended)

If you want to restrict uploads to authenticated users only:

1. Go to **Storage** → **Policies** for the `Images` bucket
2. Add a policy for **INSERT** operations:
   - Policy name: `Allow authenticated uploads`
   - Allowed operation: `INSERT`
   - Target roles: `authenticated`
   - Policy definition: `true` (or add more specific conditions)

**Note**: Since we're using the `service_role` key server-side, the policies won't apply to our uploads, but they're good for security if you add client-side uploads later.

## Step 4: Add Environment Variables

### For Local Development (.env.local)

Add these to your `.env.local` file:

```bash
# Supabase Storage
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
SUPABASE_STORAGE_BUCKET="Images"
```

**Note**: 
- `SUPABASE_URL` should already be set (check your existing env vars)
- `SUPABASE_STORAGE_BUCKET` defaults to `"Images"` if not set, but it's better to be explicit

### For Vercel Deployment

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add each variable:

   **SUPABASE_SERVICE_ROLE_KEY**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your service role key from Step 1
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

   **SUPABASE_STORAGE_BUCKET** (optional but recommended)
   - Name: `SUPABASE_STORAGE_BUCKET`
   - Value: `Images` (or your bucket name if different)
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

4. **Important**: After adding variables, redeploy your application for them to take effect

## Step 5: Verify Setup

After adding the environment variables, test the upload functionality:

1. Log in to your application
2. Click "Submit" in the menu
3. Upload an image
4. Check that it uploads successfully

If you see errors, check:
- The bucket exists and is public
- The `SUPABASE_SERVICE_ROLE_KEY` is correct
- The environment variables are set in the correct environment (Production/Preview/Development)

## Troubleshooting

### "Missing Supabase credentials" error
- Make sure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Check for typos in variable names (case-sensitive)
- Restart your dev server after adding to `.env.local`

### "Failed to upload to Supabase Storage" error
- Verify the bucket exists and is named correctly
- Check that the bucket is public (if you want public URLs)
- Verify the `SUPABASE_SERVICE_ROLE_KEY` has the correct permissions

### Images not showing after upload
- Check that the bucket is set to **Public**
- Verify the public URL is being returned correctly
- Check browser console for CORS errors

