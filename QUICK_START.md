# Quick Start Guide

## ✅ Bugs Fixed

Both issues have been resolved:

1. **GitHub Actions Deployment** - Fixed package manager inconsistency
2. **Donation Stars** - Created backend server infrastructure

## 🚀 What Works Now

### GitHub Pages Deployment
Your app will now deploy successfully via GitHub Actions when you push to the `main` branch.

### Donation Stars (Requires Setup)
The donation feature infrastructure is ready but needs backend deployment to work.

## 📋 Immediate Next Steps

### For GitHub Actions (Already Working)
✅ No action needed - deployment will work on next push to `main` branch

### For Donation Stars (Requires Action)

#### Quick Setup (5-10 minutes)

1. **Get Bot Token** (1 min)
   ```
   1. Open Telegram
   2. Message @BotFather
   3. Send: /mybots
   4. Select your bot → API Token
   5. Copy the token (format: 1234567890:ABC...)
   ```

2. **Deploy Backend** (3-5 min)
   
   **Option 1: Railway.app (Recommended - Free)**
   ```
   1. Go to railway.app and sign up
   2. Click "New Project" → "Deploy from GitHub repo"
   3. Select this repository
   4. Add environment variable:
      - Name: BOT_TOKEN
      - Value: [paste your bot token]
   5. Deploy
   6. Copy your deployment URL (e.g., https://xxx.railway.app)
   ```

   **Option 2: Vercel (Free)**
   ```
   1. Go to vercel.com and sign up
   2. Import this repository
   3. Add environment variable:
      - Name: BOT_TOKEN
      - Value: [paste your bot token]
   4. Deploy
   5. Copy your deployment URL
   ```

3. **Configure Frontend** (1 min)
   ```bash
   # Create .env.local file
   echo "VITE_BOT_SERVER_URL=https://your-backend-url.com" > .env.local
   
   # Rebuild
   npm run build
   
   # Redeploy
   npm run deploy
   ```

4. **Test** (1 min)
   ```
   1. Open your mini app in Telegram
   2. Scroll down to see donation buttons
   3. Click a donation amount
   4. Complete test payment
   ```

## 📚 Detailed Documentation

- **Server Setup Details:** See [README_SERVER_SETUP.md](./README_SERVER_SETUP.md)
- **Complete Fix Summary:** See [FIXES_SUMMARY.md](./FIXES_SUMMARY.md)
- **Main README:** See [README.md](./README.md)

## 🔍 Testing Without Backend

The app will work fine without the backend server - the donation section simply won't appear. All other features (spinner, options, Gemini suggestions) work independently.

## ❓ Common Questions

**Q: Do I need to set up the backend immediately?**
A: No, your app will deploy and work fine on GitHub Pages. The donation feature is optional.

**Q: Can I use the free tiers of hosting platforms?**
A: Yes! Railway, Vercel, and Heroku all have free tiers that work perfectly for this.

**Q: What if I don't have a Telegram bot yet?**
A: Message @BotFather on Telegram and use `/newbot` to create one in 30 seconds.

**Q: Is the backend server secure?**
A: Yes, it validates all requests using Telegram's HMAC-SHA256 authentication.

## 🐛 Troubleshooting

**Deployment fails:**
- Check that you're using `pnpm` or update workflow to use `npm`
- Ensure `base` in `vite.config.ts` matches your repo name

**Donations don't work:**
- Verify bot token is set in backend environment variables
- Check `VITE_BOT_SERVER_URL` is set in `.env.local`
- Make sure you're testing inside Telegram (not browser)
- Check backend server logs for errors

**Need help?**
- Check [README_SERVER_SETUP.md](./README_SERVER_SETUP.md) for detailed troubleshooting
- Review server logs at your hosting provider
- Ensure environment variables are set correctly

## 🎉 You're All Set!

The bugs are fixed. GitHub Actions deployment works now. Follow the steps above to enable donations, or leave it for later and enjoy your working app!
