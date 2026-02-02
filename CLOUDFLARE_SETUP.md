# Quick Cloudflare Pages Setup

## Step-by-Step Guide

### 1. Prerequisites
- GitHub repository with XeneDAW code
- Cloudflare account (free tier works)

### 2. Connect Repository to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **Pages** from the left sidebar
3. Click **Create a project**
4. Select **Connect to Git**

### 3. Authorize and Select Repository

1. Click **Connect GitHub** (or GitLab/other)
2. Authorize Cloudflare to access your repositories
3. Select your **XeneDAW** repository
4. Click **Begin setup**

### 4. Configure Build Settings

Fill in the following:

```yaml
Project name: xenedaw (or your preferred name)
Production branch: main
Framework preset: None (or select Vite if available)

Build settings:
  Build command: npm run build
  Build output directory: dist
  Root directory: / (leave empty)

Environment variables:
  (Leave empty for now - none required)
```

### 5. Deploy

1. Click **Save and Deploy**
2. Wait 2-5 minutes for the first build
3. Once complete, you'll get a URL: `https://xenedaw.pages.dev`

### 6. Test Your Deployment

Visit your URL and verify:
- ✅ App loads correctly
- ✅ Theme switcher works
- ✅ Can add tracks
- ✅ Transport controls visible
- ✅ No console errors

### 7. Automatic Deployments

From now on:
- **Every push to `main`** triggers production deployment
- **Every PR/branch** gets a preview deployment
- Preview URLs: `https://[hash].xenedaw.pages.dev`

## Troubleshooting

### Build Failed

**Check the build logs:**
1. Go to Cloudflare Pages Dashboard
2. Click on your project
3. Go to **Deployments** tab
4. Click on the failed deployment
5. View build logs

**Common issues:**
- Missing dependencies: Ensure `package.json` is correct
- Build errors: Run `npm run build` locally first
- Node version: Ensure `.node-version` file is present

### App Not Loading

1. **Check `_redirects` file**: Should be in `public/` folder
2. **Verify build output**: `dist` folder should contain `index.html`
3. **Check console**: Open DevTools → Console for errors

### Audio Issues

If Web Audio API doesn't work:
1. Verify `_headers` file is in `public/` folder
2. Check response headers in DevTools → Network tab
3. Should see:
   ```
   Cross-Origin-Embedder-Policy: require-corp
   Cross-Origin-Opener-Policy: same-origin
   ```

## Custom Domain (Optional)

### Add Your Own Domain

1. Go to Pages → Your Project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `daw.yourdomain.com` or `yourdomain.com`
4. Follow DNS instructions:

   **For subdomain (daw.yourdomain.com):**
   ```
   Type: CNAME
   Name: daw
   Target: xenedaw.pages.dev
   ```

   **For apex domain (yourdomain.com):**
   ```
   Type: CNAME
   Name: @
   Target: xenedaw.pages.dev
   ```

5. Wait 1-5 minutes for DNS propagation
6. SSL certificate auto-provisions

## Environment Variables (Future)

If you need environment variables later:

1. Pages → Project → **Settings** → **Environment variables**
2. Add variables:
   - Production: Only in production
   - Preview: Only in preview deployments
   - All: In both environments

Example:
```
VITE_API_URL=https://api.example.com
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Monitoring

### View Analytics

1. Pages → Project → **Analytics**
2. See:
   - Page views
   - Visitors
   - Top pages
   - Geographic data

### View Deployments

1. Pages → Project → **Deployments**
2. See all deployments:
   - Production (main branch)
   - Previews (branches/PRs)
   - History with rollback option

## Rollback

If something breaks:

1. Pages → Project → **Deployments**
2. Find last working deployment
3. Click **···** menu
4. Select **Rollback to this deployment**
5. Confirm

## Build Cache

Cloudflare caches `node_modules` between builds:
- Faster builds (usually 30s-2min)
- If issues occur, clear cache:
  1. Pages → Project → **Settings**
  2. **Build cache** → **Clear cache**

## Limits (Free Tier)

- ✅ **Bandwidth**: Unlimited
- ✅ **Requests**: Unlimited
- ⚠️ **Builds**: 500/month
- ⚠️ **Concurrent builds**: 1
- ⚠️ **Build time**: 20 minutes max

XeneDAW builds typically take 1-3 minutes, so 500/month is plenty.

## Next Steps

- ✅ Test your live deployment
- ✅ Share the URL with others
- ⚠️ Consider custom domain
- ⚠️ Set up error tracking (Sentry, etc.)
- ⚠️ Add PWA support for offline use

## Support

- **Cloudflare Docs**: https://developers.cloudflare.com/pages
- **Cloudflare Discord**: https://discord.gg/cloudflaredev
- **Community**: https://community.cloudflare.com

---

**Your deployment URL**: `https://xenedaw.pages.dev`

Enjoy your globally-deployed DAW! 🎵🚀
