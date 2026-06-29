# API Configuration - Quick Start

## Problem
If you're seeing login calls to the **frontend URL** (https://project-nfqnd.vercel.app) instead of your **backend URL** (https://socialsite.runasp.net), this guide will fix it.

## ✅ Solution

### For Local Development

Just run:
```bash
npm run dev
```

The app automatically uses `.env.development` which connects to `https://localhost:5001`.

### For Vercel Production

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add these variables for Production:**

   | Variable | Value |
   |----------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://socialsite.runasp.net` |
   | `NEXT_PUBLIC_SIGNALR_URL` | `https://socialsite.runasp.net` |

   ⚠️ **Important:** Replace with your actual backend URL

3. **Redeploy:**
   ```bash
   git push  # Vercel auto-redeploys and picks up env vars
   ```

4. **Verify:**
   - Open DevTools Console on your deployed site
   - Run: `console.log(process.env.NEXT_PUBLIC_API_URL)`
   - Should show: `https://socialsite.runasp.net` (NOT empty)

## 📂 Environment Files Explained

| File | Usage | Deployed? |
|------|-------|-----------|
| `.env.development` | Local dev (npm run dev) | ❌ No |
| `.env.production` | Default for production | ⚠️ Overridden by Vercel |
| `.env.local` | Local overrides (NEVER committed) | ❌ No |

## 🔧 Troubleshooting

**Q: Login still calls frontend URL**
- A: Vercel needs env vars set in Dashboard (not in files). Redeploy after setting them.

**Q: How do I switch between local and production backend during local dev?**
- A: Edit `.env.local`:
  ```bash
  # Use production
  NEXT_PUBLIC_API_URL=https://socialsite.runasp.net
  
  # Or use local backend
  NEXT_PUBLIC_API_URL=https://localhost:5001
  ```

**Q: Where are API calls defined?**
- A: See `src/lib/api/` - all use the configured `apiClient`

## 📚 Full Documentation

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed setup instructions.

## ✓ Verify Configuration

```bash
npm run verify-api
```

This checks your environment setup and shows what URLs are configured.
