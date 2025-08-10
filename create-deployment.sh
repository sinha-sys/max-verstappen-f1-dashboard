#!/bin/bash

# Max Verstappen F1 Dashboard - Cloudflare Deployment Package Creator
echo "🏁 Creating Cloudflare Pages deployment package..."

# Create deployment directory
mkdir -p cloudflare-deployment

# Copy essential files for Cloudflare Pages
cp -r app cloudflare-deployment/
cp -r components cloudflare-deployment/
cp -r data cloudflare-deployment/
cp -r lib cloudflare-deployment/
cp -r public cloudflare-deployment/ 2>/dev/null || echo "No public directory found"

# Copy configuration files
cp package.json cloudflare-deployment/
cp package-lock.json cloudflare-deployment/
cp next.config.js cloudflare-deployment/
cp tailwind.config.ts cloudflare-deployment/
cp tsconfig.json cloudflare-deployment/
cp postcss.config.js cloudflare-deployment/
cp .eslintrc.json cloudflare-deployment/
cp .prettierrc cloudflare-deployment/

# Copy Cloudflare-specific files
cp _headers cloudflare-deployment/
cp _redirects cloudflare-deployment/
cp wrangler.toml cloudflare-deployment/
cp CLOUDFLARE_DEPLOYMENT.md cloudflare-deployment/README.md

# Copy data update script
mkdir -p cloudflare-deployment/scripts
cp scripts/update-data.js cloudflare-deployment/scripts/

# Create a simplified next.config.js for Cloudflare
cat > cloudflare-deployment/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  env: {
    NEXT_PUBLIC_CLOUDFLARE: 'true',
  },
};

module.exports = nextConfig;
EOF

# Create deployment instructions
cat > cloudflare-deployment/DEPLOY.md << 'EOF'
# 🚀 Cloudflare Pages Deployment

## Quick Deploy (Upload Method)

1. **Install dependencies**: `npm install`
2. **Build the project**: `npm run build`
3. **Upload to Cloudflare Pages**: Upload the entire project folder
4. **Build Settings**:
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Node.js version: `18`

## Git Integration Method

1. **Push to GitHub**: Upload this folder to a GitHub repository
2. **Connect to Cloudflare Pages**: Link your GitHub repo
3. **Configure Build**:
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Build output directory: `.next`

## Updating Data

After each race, edit the JSON files in `/data/` and redeploy:

```bash
# Update race result
node scripts/update-data.js --race="Race Name" --position=1 --points=25 --pole=true

# Commit and push (if using Git integration)
git add .
git commit -m "Update after [Race Name]"
git push
```

Your dashboard will be live on Cloudflare's global CDN! 🏁
EOF

# Create a .gitignore for the deployment
cat > cloudflare-deployment/.gitignore << 'EOF'
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF

echo "✅ Deployment package created in ./cloudflare-deployment/"
echo "📦 Ready to upload to Cloudflare Pages!"
echo ""
echo "Next steps:"
echo "1. Upload the 'cloudflare-deployment' folder to Cloudflare Pages"
echo "2. Use build command: npm run build"
echo "3. Use build output: .next"
echo "4. Your Max Verstappen dashboard will be live!"
