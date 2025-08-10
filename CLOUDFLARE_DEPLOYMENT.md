# 🚀 Cloudflare Pages Deployment Guide

## 📦 Pre-built Package

This codebase is optimized for Cloudflare Pages deployment with static export.

## 🔧 Deployment Steps

### Option 1: Direct Upload (Recommended)
1. Build the project: `npm run build:cloudflare`
2. Upload the `out/` folder to Cloudflare Pages
3. Your dashboard will be live!

### Option 2: Git Integration
1. Push this code to a GitHub repository
2. Connect your repo to Cloudflare Pages
3. Use these build settings:
   - **Build command**: `npm run build:cloudflare`
   - **Build output directory**: `out`
   - **Node.js version**: `18`

## 📊 Updating Data on Cloudflare

Since this is a static site, you have a few options to update race data:

### Method 1: Manual Update & Redeploy
1. Update the JSON files in `/data/`
2. Run `npm run build:cloudflare`
3. Upload the new `out/` folder to Cloudflare

### Method 2: GitHub Actions (Automated)
Set up GitHub Actions to automatically rebuild when data changes:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
    paths: ['data/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:cloudflare
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy out --project-name=max-verstappen-dashboard
```

### Method 3: Cloudflare Functions (Advanced)
Create serverless functions to update data dynamically while keeping the main site static.

## ⚡ Performance Optimizations

This build includes:
- ✅ Static export for maximum speed
- ✅ Optimized caching headers
- ✅ Compressed assets
- ✅ Mobile-optimized bundle size
- ✅ Image optimization disabled (not needed for this app)

## 🌐 Custom Domain

1. In Cloudflare Pages dashboard, go to "Custom domains"
2. Add your domain (e.g., `max-stats.yoursite.com`)
3. Update DNS records as instructed
4. SSL is automatically configured

## 📈 Analytics

Enable Cloudflare Web Analytics:
1. Go to Cloudflare Dashboard > Analytics & Logs > Web Analytics
2. Add your site
3. Copy the beacon script to `/pages/_document.tsx` if needed

## 🔄 Data Update Workflow for Production

1. **After each race**:
   - Update `/data/max.json` and `/data/seasons.json`
   - Commit and push to GitHub (if using Git integration)
   - Or manually rebuild and upload

2. **Using the update script**:
   ```bash
   # Update data
   node scripts/update-data.js --race="Hungarian GP" --position=1 --points=25 --pole=true
   
   # Build for Cloudflare
   npm run build:cloudflare
   
   # Upload the out/ folder to Cloudflare Pages
   ```

## 🚨 Important Notes

- The site is fully static - no server-side rendering
- Data updates require a rebuild and redeploy
- API routes are converted to static JSON files
- Charts and interactivity work perfectly on Cloudflare Pages
- Mobile optimization is maintained

## 🆘 Troubleshooting

**Build Errors**: Check Node.js version is 18+
**Missing Data**: Ensure JSON files are valid
**Broken Links**: Verify trailing slashes in URLs
**Cache Issues**: Clear Cloudflare cache in the dashboard

Your Max Verstappen Dashboard will be blazing fast on Cloudflare's global CDN! 🏁
