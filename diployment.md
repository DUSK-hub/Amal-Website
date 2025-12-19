# Amal (أمل) - Deployment Guide

## 🚀 Best Free Hosting Options

### Option 1: Vercel (Recommended)

**Pros:**
- ✅ Fastest deployment (30 seconds)
- ✅ Automatic HTTPS
- ✅ Great performance
- ✅ Easy to update
- ✅ Free custom domain support

**Steps:**

1. **Install Vercel CLI (Optional)**
   ```bash
   npm i -g vercel
   ```

2. **Deploy via GitHub (Easiest)**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Select your repository
   - Click "Deploy"
   - Done! Your app is live at `your-app.vercel.app`

3. **Deploy via CLI**
   ```bash
   cd your-project-folder
   vercel
   ```
   Follow the prompts, and you're live!

---

### Option 2: Netlify

**Pros:**
- ✅ Simple drag-and-drop
- ✅ Automatic HTTPS
- ✅ Good performance
- ✅ Free custom domain

**Steps:**

1. **Drag & Drop Method**
   - Go to [netlify.com](https://netlify.com)
   - Sign up for free
   - Drag your project folder onto the dashboard
   - Done! Your app is live at `your-app.netlify.app`

2. **GitHub Integration**
   - Push code to GitHub
   - Connect Netlify to your repo
   - Auto-deploys on every push

---

### Option 3: GitHub Pages

**Pros:**
- ✅ 100% free
- ✅ Good for simple sites
- ✅ Built into GitHub

**Steps:**

1. Push your code to GitHub
2. Go to **Settings** → **Pages**
3. Select branch (usually `main`)
4. Select folder (usually `/root`)
5. Click "Save"
6. Your app will be live at `username.github.io/repo-name`

**Note:** GitHub Pages doesn't support server-side redirects, but Amal is client-side only, so it works perfectly!

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] ✅ Supabase credentials are added to `app.js`
- [ ] ✅ All files are in the project folder:
  - `index.html`
  - `style.css`
  - `theme-light.css`
  - `theme-dark.css`
  - `theme-midnight.css`
  - `app.js`
- [ ] ✅ Supabase tables are created (see SUPABASE_SETUP.md)
- [ ] ✅ Test locally first (open `index.html` in browser)

---

## 🌐 Custom Domain (Optional)

All three platforms support custom domains for free!

### For Vercel:
1. Go to your project settings
2. Click "Domains"
3. Add your domain (e.g., `amal.app`)
4. Follow DNS instructions

### For Netlify:
1. Go to "Domain settings"
2. Add custom domain
3. Update your DNS records

### For GitHub Pages:
1. Add a `CNAME` file with your domain
2. Update DNS to point to GitHub's servers

---

## 🔄 Continuous Deployment

**Vercel & Netlify automatically redeploy when you push to GitHub!**

**Workflow:**
1. Make changes locally
2. Test in browser
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```
4. Wait 30 seconds
5. Your live site is updated! ✨

---

## 🛠️ Environment Variables (If Needed Later)

If you want to hide your Supabase keys:

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. Use `process.env.SUPABASE_URL` in code (requires build step)

**For now:** Since we're using client-side only, the anon key is safe to expose (it's public by design).

---

## 📊 Monitoring Your App

### Check Traffic (Free Tools):
- **Vercel Analytics** (built-in)
- **Netlify Analytics** (paid, but basic is free)
- **Google Analytics** (add tracking code to `index.html`)

### Monitor Supabase:
- Check **Database** → **Table Editor** for user data
- **Authentication** → **Users** to see signups
- **Database** → **Functions** for any errors

---

## 🚨 Troubleshooting

### Issue: "Supabase not connecting"
- ✅ Check credentials in `app.js`
- ✅ Make sure tables are created
- ✅ Check browser console for errors

### Issue: "Authentication not working"
- ✅ Enable email auth in Supabase
- ✅ Check email templates
- ✅ Verify SMTP settings (for production)

### Issue: "Site not updating after push"
- ✅ Clear browser cache (Ctrl+Shift+R)
- ✅ Check deployment logs in Vercel/Netlify
- ✅ Verify GitHub push was successful

---

## 🎉 Quick Deploy Commands

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod
```

**GitHub Pages:**
```bash
git push origin main
```

---

## 📱 Progressive Web App (PWA) - Future Enhancement

Want users to install Amal on their phones?

1. Add a `manifest.json`
2. Add a service worker
3. Users can "Add to Home Screen"

(We can add this later if needed!)

---

## ✅ You're Done!

Your Islamic habit tracker is now **live** and **accessible worldwide** for free!

**Share your link:**
- `https://your-app.vercel.app`
- `https://your-app.netlify.app`
- `https://username.github.io/amal`

**Next steps:**
- Share with friends and family
- Get feedback
- Add new features
- Spread the word! 🌙✨