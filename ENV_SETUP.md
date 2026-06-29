# Environment Configuration Guide

## Overview
This project needs backend API URLs configured for both development and production environments.

## File Structure

- `.env.development` - Used locally during development
- `.env.production` - Used when building for production (Vercel)
- `.env.local` - Local overrides (NOT committed to git, ignored by Vercel)

## Local Development

Just run:
```bash
npm run dev
```

This uses `.env.development` automatically in development mode with `https://localhost:5001`.

## Vercel Production Deployment

**Important:** Environment variables set in `.env.local` or `.env.production` are NOT automatically sent to Vercel.

### Step 1: Set Environment Variables in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project `project-nfqnd`
3. Go to **Settings** → **Environment Variables**
4. Add these variables for **Production**:

| Key | Value | Scope |
|-----|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://socialsite.runasp.net` | Production |
| `NEXT_PUBLIC_SIGNALR_URL` | `https://socialsite.runasp.net` | Production |

> Replace `https://socialsite.runasp.net` with your actual backend production URL

### Step 2: Redeploy
After setting variables in Vercel, redeploy your project:
```bash
git push  # This triggers Vercel rebuild with new env vars
```

## How It Works

### Client-side API Calls
```typescript
// All API calls use this baseURL from environment variables
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
})
```

### Next.js API Rewrites
```javascript
// next.config.js rewrites /api/* to backend URL
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: `${apiUrl}/api/:path*`,
    }
  ]
}
```

## Troubleshooting

### "Login is calling frontend URL instead of backend"

This means `NEXT_PUBLIC_API_URL` is not set or empty in production.

**Check:**
1. ✅ Vercel dashboard has environment variables set
2. ✅ You redeployed after setting variables (rebuild required)
3. ✅ Correct backend URL is configured

### How to Debug

In your browser DevTools Console after login attempt:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
// Should show: https://socialsite.runasp.net
// NOT empty string or undefined
```

If it's empty, environment variables weren't applied. Redeploy with variables set in Vercel.

## Variable Reference

- **`NEXT_PUBLIC_API_URL`**: Backend API base URL
  - Development: `https://localhost:5001`
  - Production: `https://socialsite.runasp.net`

- **`NEXT_PUBLIC_SIGNALR_URL`**: SignalR hub connection URL (same as API URL usually)
  - Development: `https://localhost:5001`
  - Production: `https://socialsite.runasp.net`

## Next Steps

1. Commit `.env.development` and `.env.production` to git
2. Ensure `.env.local` is in `.gitignore` (already is)
3. Set environment variables in Vercel dashboard
4. Redeploy project
5. Test login - should now use backend URL
