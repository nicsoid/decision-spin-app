# Server Setup for Donation Stars

## Overview

The Telegram Stars donation feature requires a backend server to create payment invoices. This server is separate from the GitHub Pages deployment.

## Files Created

- `server.js` - Express server that handles invoice creation
- `.env.example` - Example environment variables for the server
- `.env.local.example` - Example environment variables for the frontend

## Setup Instructions

### 1. Get Your Bot Token

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Create a new bot with `/newbot` or use an existing bot
3. Copy the bot token (format: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Deploy the Backend Server

The server needs to be deployed to a hosting platform. Here are some options:

#### Option A: Railway (Recommended - Free Tier Available)
1. Create account at [railway.app](https://railway.app)
2. Create a new project
3. Deploy from GitHub (connect your repository)
4. Add environment variable: `BOT_TOKEN=your_bot_token_here`
5. Railway will auto-detect and run `node server.js`
6. Copy your deployment URL (e.g., `https://your-app.railway.app`)

#### Option B: Heroku
1. Create account at [heroku.com](https://heroku.com)
2. Install Heroku CLI
3. Run:
   ```bash
   heroku create your-app-name
   heroku config:set BOT_TOKEN=your_bot_token_here
   git push heroku main
   ```
4. Copy your app URL (e.g., `https://your-app-name.herokuapp.com`)

#### Option C: Vercel (Serverless)
1. Create account at [vercel.com](https://vercel.com)
2. Import your repository
3. Add environment variable: `BOT_TOKEN=your_bot_token_here`
4. Deploy
5. Copy your deployment URL

#### Option D: Self-hosted VPS
1. Copy `server.js` to your VPS
2. Install Node.js (v18+)
3. Install dependencies: `npm install express cors dotenv`
4. Create `.env` file with `BOT_TOKEN=your_bot_token_here`
5. Run: `node server.js`
6. Set up reverse proxy (nginx/Apache) with SSL

### 3. Configure the Frontend

1. Copy `.env.local.example` to `.env.local`
2. Set `VITE_BOT_SERVER_URL` to your backend server URL:
   ```
   VITE_BOT_SERVER_URL=https://your-backend-server.com
   ```
3. Rebuild and redeploy your frontend
4. If you use the provided GitHub Pages workflow, add a repository secret named `VITE_BOT_SERVER_URL` so the build step can inject your server URL (Settings → Secrets and variables → Actions)

### 4. Test the Integration

1. Open your mini app in Telegram
2. Try making a donation
3. Check server logs for any errors

## Server Endpoints

- `POST /create-invoice` - Creates a Telegram Stars invoice
  - Request body: `{ amount: number, initData: string }`
  - Response: `{ invoiceUrl: string }`
- `GET /health` - Health check endpoint
  - Response: `{ status: "ok", timestamp: string }`

## Security Notes

- The server validates Telegram `initData` using HMAC-SHA256
- Never expose your bot token in the frontend code
- Use HTTPS for production deployments
- Consider adding rate limiting for production use

## Troubleshooting

### "Missing initData" error
- Make sure you're testing inside Telegram, not a regular browser
- Check that the mini app is properly configured in BotFather

### "Invalid Telegram data" error
- Verify your `BOT_TOKEN` is correct
- Check server logs for validation details

### CORS errors
- Ensure your backend allows requests from your GitHub Pages domain
- The server includes CORS configuration by default

## Development

To run the server locally:

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your BOT_TOKEN

# Run server
npm run server

# Or with auto-reload
npm run server:dev
```

The server will run on `http://localhost:3000` by default.

## Production Checklist

- [ ] Bot token is set in server environment variables
- [ ] Backend server is deployed and accessible
- [ ] Frontend `.env.local` has correct `VITE_BOT_SERVER_URL`
- [ ] HTTPS is enabled on backend server
- [ ] Test donation flow end-to-end
- [ ] Monitor server logs for errors
