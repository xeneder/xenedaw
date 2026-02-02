# Deployment Guide - XeneDAW

This guide covers deploying XeneDAW to Cloudflare Pages.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI** (optional for CLI deployment):
   ```bash
   npm install -g wrangler
   ```

## Deployment Methods

### Method 1: GitHub Integration (Recommended)

This is the easiest method with automatic deployments on every push.

1. **Connect Repository to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to **Pages** → **Create a project**
   - Select **Connect to Git**
   - Authorize Cloudflare to access your GitHub
   - Select your `XeneDAW` repository

2. **Configure Build Settings**:
   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   ```

3. **Environment Variables** (optional):
   - `NODE_VERSION`: `18` or higher
   - No environment variables needed for now

4. **Deploy**:
   - Click **Save and Deploy**
   - Cloudflare will build and deploy automatically
   - Future commits to main branch will auto-deploy

### Method 2: CLI Deployment (Manual)

**Note:** Wrangler requires Node.js 20+ on your local machine.

1. **Install Wrangler** (if not already):
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Build the Project**:
   ```bash
   npm run build
   ```

4. **Deploy**:
   ```bash
   wrangler pages deploy dist --project-name=xenedaw
   ```

**Recommended:** Use Method 1 (GitHub Integration) instead to avoid local Node version issues.

### Method 3: Direct Upload

1. Build the project locally:
   ```bash
   npm run build
   ```

2. Go to Cloudflare Pages Dashboard
3. Click **Upload assets**
4. Drag and drop the `dist` folder

## Build Configuration

### Cloudflare Pages Settings

```yaml
# Automatic via GitHub
Build command: npm run build
Build output directory: dist
Node version: 20.18.1 or newer

# Branch deployments
Production branch: main
Preview branches: All branches
```

### Headers Configuration

The `public/_headers` file configures important headers for:
- **Security**: X-Frame-Options, X-Content-Type-Options
- **Web Audio API**: COOP/COEP headers for SharedArrayBuffer
- **Performance**: Cache-Control for static assets
- **MIME Types**: Proper content types for audio files

### Redirects Configuration

The `public/_redirects` file ensures:
- SPA routing works correctly (all routes → index.html)
- 404s are handled by the React app

## Post-Deployment

### Verify Deployment

1. **Check Build Status**:
   - Go to Pages Dashboard → Your Project → Deployments
   - Ensure status is "Success"

2. **Test the Application**:
   - Visit your deployment URL: `https://daw.xene.dev`
   - Test basic features:
     - Theme switching
     - Add track
     - Transport controls
   - Check browser console for errors

3. **Check Web Audio API**:
   - Open DevTools Console
   - Verify no COOP/COEP errors
   - AudioContext should initialize properly

### Custom Domain (Optional)

1. Go to Pages → Your Project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (~1-5 minutes)

## Troubleshooting

### Build Fails

**Error: TypeScript compilation errors**
```bash
# Run locally to see detailed errors
npm run build
```

**Error: Out of memory**
- Cloudflare Pages has 1GB memory limit
- XeneDAW should be well under this limit
- If issues occur, optimize bundle size

### Runtime Issues

**Web Audio API not working**
- Check that COOP/COEP headers are set correctly
- Verify in Network tab: Response Headers should show:
  ```
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
  ```

**404 on refresh**
- Ensure `_redirects` file is in `public/` folder
- Verify build output includes `_redirects`

**Static assets not loading**
- Check that assets are in `dist/assets/` after build
- Verify base path in `vite.config.ts` (should be `/`)

### Performance Issues

**Slow initial load**
- Enable Cloudflare's **Rocket Loader** (optional)
- Check bundle size: `npm run build` shows gzipped sizes
- Consider code splitting if bundle > 500KB

**Audio latency**
- Cloudflare's edge network provides low latency
- Audio processing happens client-side (no network latency)
- If issues persist, check AudioContext settings in Tone.js

## Monitoring

### Analytics

Cloudflare Pages includes Web Analytics:
1. Go to Pages → Your Project → **Analytics**
2. View:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Error Tracking (Optional)

Consider adding:
- **Sentry**: For error tracking
- **LogRocket**: For session replay
- **Plausible**: Privacy-friendly analytics

## Rollback

If a deployment breaks production:

1. **Via Dashboard**:
   - Pages → Project → Deployments
   - Find working deployment
   - Click **···** → **Rollback to this deployment**

2. **Via Git**:
   ```bash
   git revert HEAD
   git push origin main
   ```

## Environment-Specific Builds

For different environments (staging, production):

### Branch-Based Deployments

```yaml
# Cloudflare automatically creates preview deploys for:
- Feature branches: xenedaw-[branch-name].pages.dev
- Pull requests: PR previews with unique URLs
- Main branch: Production (xenedaw.pages.dev)
```

### Environment Variables

Currently not needed, but can be added via:
- Cloudflare Dashboard → Pages → Settings → Environment variables

## Performance Optimization

### Current Build Optimization

- **Tree Shaking**: Unused code removed by Vite
- **Code Splitting**: React lazy loading ready
- **Asset Optimization**: Images/fonts optimized
- **Compression**: Brotli/Gzip by Cloudflare

### Future Optimizations

- [ ] Enable PWA with service worker
- [ ] Lazy load Piano Roll component
- [ ] Lazy load audio effects
- [ ] Optimize Tone.js imports (tree-shakeable)

## Security

### Current Headers

```
X-Frame-Options: DENY              # Prevent clickjacking
X-Content-Type-Options: nosniff    # Prevent MIME sniffing
Referrer-Policy: strict-origin-when-cross-origin
Cross-Origin-Embedder-Policy: require-corp  # For Web Audio
Cross-Origin-Opener-Policy: same-origin     # For SharedArrayBuffer
```

### Content Security Policy (Future)

Consider adding CSP headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline';
```

## Costs

**Cloudflare Pages: FREE tier includes:**
- Unlimited bandwidth
- Unlimited requests
- 500 builds per month
- 1 build at a time
- 20,000 files per deployment

**Upgrading ($20/month):**
- 5,000 builds per month
- 5 concurrent builds
- Advanced analytics

## Support

- **Cloudflare Docs**: https://developers.cloudflare.com/pages
- **Cloudflare Community**: https://community.cloudflare.com
- **XeneDAW Issues**: GitHub Issues on your repository

## Deployment Checklist

Before deploying:
- [ ] Run `npm run build` locally to verify
- [ ] Run `npm run lint` to check code quality
- [ ] Test in production mode: `npm run preview`
- [ ] Verify `_headers` and `_redirects` in `public/`
- [ ] Update version in `package.json` if needed
- [ ] Tag release in Git: `git tag v0.1.0`
- [ ] Push to GitHub: `git push origin main --tags`

After deploying:
- [ ] Test production URL
- [ ] Check all major features work
- [ ] Verify theme switching
- [ ] Test on multiple browsers
- [ ] Check mobile responsiveness (if applicable)
- [ ] Monitor for errors in first 24h

---

**Deployment URL**: Will be `https://xenedaw.pages.dev` or your custom domain

For questions or issues, refer to `README.md` or open a GitHub issue.
