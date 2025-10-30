# Deploying to Vercel (Free Tier)

This guide shows you how to deploy the Cloudinary React Native example app to Vercel's free tier.

## 🚀 Quick Deployment Steps

### 1. Push to GitHub (if not already done)

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Deploy to Vercel

**Option A: Deploy via Vercel Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure the project:
   - **Root Directory:** `example`
   - **Build Command:** `npx expo export --platform web`
   - **Output Directory:** `dist`
6. Click "Deploy"
7. Done! Your app will be live at `https://your-project.vercel.app`

**Option B: Deploy via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from the example directory
cd example
vercel

# Follow the prompts - defaults should work fine
```

### 3. Access Your App

After deployment completes, Vercel will provide you with a URL like:
- Production: `https://your-project.vercel.app`
- Preview URLs for each PR/commit

Share this URL with anyone - they can access it from anywhere!

---

## 📝 Configuration

The `vercel.json` file in the example directory already contains the correct configuration:

```json
{
  "buildCommand": "npm install && npx expo export --platform web",
  "outputDirectory": "dist",
  "devCommand": "npx expo start --web",
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This handles:
- Building the Expo web app
- Routing (all routes go to index.html for SPA behavior)
- Clean URLs

---

## 🧪 Test Locally Before Deploying

```bash
# Navigate to example directory
cd example

# Build the web version
npx expo export --platform web

# Serve it locally to test
npx serve dist -p 3000
```

Then visit `http://localhost:3000` to test before deploying.

---

## 🎯 Vercel Free Tier Benefits

✅ **Unlimited bandwidth**  
✅ **Automatic HTTPS**  
✅ **Global CDN (Edge Network)**  
✅ **Automatic deployments** from Git  
✅ **Preview URLs** for each PR  
✅ **Custom domains** (free)  
✅ **100GB bandwidth/month**  
✅ **No credit card required**

---

## 🔧 Advanced Configuration

### Custom Domain

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS instructions
5. Done! Your app will be at `https://yourdomain.com`

### Environment Variables

If your app needs environment variables:

1. Go to "Settings" → "Environment Variables"
2. Add your variables (e.g., `CLOUDINARY_CLOUD_NAME`)
3. Redeploy

### Automatic Deployments

Vercel automatically:
- Deploys **production** when you push to `main` branch
- Creates **preview** deployments for every PR/branch

---

## 🐛 Troubleshooting

### Build Fails

**Issue:** "Module not found" errors  
**Solution:** Make sure the parent package is built first. You might need to adjust the build command:

```json
{
  "buildCommand": "cd .. && npm install && npm run build && cd example && npm install && npx expo export --platform web"
}
```

### Blank Screen After Deploy

**Issue:** App loads but shows blank screen  
**Solution:** Check browser console for errors. Usually routing-related - the `vercel.json` rewrites should handle this.

### Large Bundle Size Warning

**Issue:** Vercel warns about bundle size  
**Solution:** This is normal for React Native Web apps. The free tier can handle it.

---

## 📱 Testing on Mobile

Once deployed, you can test on any device:
1. Open the Vercel URL on your phone's browser
2. The app should work just like a native app
3. You can even add it to your home screen (PWA-style)

---

## 🔄 Updating Your Deployment

Just push to your Git repository:

```bash
git add .
git commit -m "Update app"
git push
```

Vercel will automatically rebuild and deploy! 🎉

---

## 📊 Monitoring

Vercel provides:
- Real-time deployment logs
- Analytics (views, performance)
- Error tracking
- Performance insights

Access these in your Vercel dashboard.

---

## 💡 Tips

1. **Use branches for testing:** Push to a feature branch to get a preview URL before merging to main
2. **Add protection:** Enable "Vercel Authentication" in settings to password-protect your app
3. **Speed up builds:** Add a `.vercelignore` file to exclude unnecessary files
4. **Check logs:** If something goes wrong, check the deployment logs in the Vercel dashboard

---

## 🆘 Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- Check deployment logs in Vercel dashboard
