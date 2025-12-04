# Vercel Branch Strategy & Deployment

## Is it Common to Use `main` for Deployment?

**Yes! Using `main` for production deployment is the standard practice.** Here's why and how it works:

## Standard Branch Strategy

### Most Common Setup

```
main branch → Production (yourdomain.com)
├── Feature branches → Preview deployments (automatic preview URLs)
└── Pull Requests → Preview deployments (automatic, great for testing)
```

### Why `main` for Production?

1. ✅ **Industry Standard**: Most teams use `main`/`master` for production
2. ✅ **Simple Workflow**: Push to `main` = deploy to production
3. ✅ **Vercel Default**: Vercel automatically uses `main` as production branch
4. ✅ **GitHub Integration**: Works seamlessly with GitHub's default branch

## How Vercel Handles Branches

### Automatic Deployments

When you connect Vercel to your Git repository:

1. **`main` branch** → Deploys to **Production** (your custom domain)
2. **Other branches** → Creates **Preview** deployments (unique URLs)
3. **Pull Requests** → Creates **Preview** deployments (linked to PR)

### Example Workflow

```bash
# 1. Create a feature branch
git checkout -b feature/new-search

# 2. Make changes and push
git push origin feature/new-search

# 3. Vercel automatically creates a preview deployment
# → Preview URL: https://spectrums-git-feature-new-search.vercel.app

# 4. Create a Pull Request
# → Vercel adds a comment with preview URL
# → Team can test before merging

# 5. Merge to main
git checkout main
git merge feature/new-search
git push origin main

# 6. Vercel automatically deploys to production
# → Production URL: https://yourdomain.com
```

## Configuring Production Branch

### Default (Recommended)

Vercel uses `main` as production branch by default. No configuration needed!

### Change Production Branch

If you use a different branch (e.g., `master`, `production`):

1. Go to **Settings** → **Git**
2. Under **Production Branch**, select your branch
3. Click **"Save"**

**Note**: Only the production branch deploys to your custom domain. Other branches get preview URLs.

## Branch Strategies

### Strategy 1: Simple (Recommended for Most Projects)

```
main → Production
```

**Pros:**
- Simple and straightforward
- Works great for solo developers or small teams
- Preview deployments for PRs provide testing

**Cons:**
- No staging environment
- Need to be careful with `main` branch

### Strategy 2: Staging + Production

```
main → Production
develop → Staging (staging.yourdomain.com)
```

**Setup:**
1. Create `develop` branch
2. In Vercel: **Settings** → **Git** → Add branch
3. Configure `develop` to deploy to `staging.yourdomain.com`

**Pros:**
- Staging environment for testing
- Can test before production
- Good for larger teams

**Cons:**
- More complex workflow
- Need to manage two environments

### Strategy 3: Release Branches

```
main → Production
release/* → Staging
feature/* → Preview
```

**Pros:**
- More control over releases
- Can test release candidates

**Cons:**
- Most complex
- Usually overkill for most projects

## Preview Deployments

### Automatic Preview URLs

Every branch and PR gets a unique preview URL:

```
https://spectrums-git-feature-name.vercel.app
https://spectrums-git-abc123.vercel.app
```

### Benefits

- ✅ **Test before merging**: See changes in action
- ✅ **Share with team**: Easy to share preview URLs
- ✅ **Automatic**: No configuration needed
- ✅ **Isolated**: Each preview is separate from production

### Disable Preview Deployments

If you don't want automatic previews:

1. Go to **Settings** → **Git**
2. Toggle **"Automatic Preview Deployments"** off

## Environment Variables per Branch

### Production vs Preview

You can set different environment variables for different environments:

1. Go to **Settings** → **Environment Variables**
2. When adding a variable, select:
   - ✅ **Production** (for `main` branch)
   - ✅ **Preview** (for other branches/PRs)
   - ✅ **Development** (for `vercel dev`)

### Example

```bash
# Production only (main branch)
DATABASE_URL → Production ✅, Preview ❌, Development ❌

# All environments
GEMINI_API_KEY → Production ✅, Preview ✅, Development ✅

# Preview/Development only (testing)
TEST_API_KEY → Production ❌, Preview ✅, Development ✅
```

## Best Practices

### ✅ Do

- Use `main` for production (standard practice)
- Enable preview deployments for PRs
- Test in preview before merging to `main`
- Use environment-specific variables when needed
- Keep `main` branch stable and deployable

### ❌ Don't

- Don't push broken code to `main`
- Don't disable preview deployments (they're very useful)
- Don't use production database for preview deployments
- Don't commit secrets (use environment variables)

## Common Questions

### Q: Can I deploy from a different branch?

**A:** Yes! Change the production branch in **Settings** → **Git** → **Production Branch**.

### Q: Do I need to manually deploy?

**A:** No! Vercel automatically deploys when you push to `main`. Manual deployment is optional.

### Q: Can I have multiple production environments?

**A:** Yes! You can configure multiple projects in Vercel, each with different branches/domains.

### Q: What happens if I push broken code to `main`?

**A:** Vercel will try to build. If it fails, the previous deployment stays live. You can rollback in the Deployments tab.

### Q: How do I rollback?

**A:** Go to **Deployments** → Find a previous successful deployment → Click **"..."** → **"Promote to Production"**.

## Summary

**Yes, using `main` for production is standard and recommended!**

- ✅ Vercel uses `main` as production branch by default
- ✅ Automatic deployments when you push to `main`
- ✅ Preview deployments for other branches/PRs
- ✅ Simple, standard workflow that works for most projects

No need to overthink it - the default setup works great! 🚀

