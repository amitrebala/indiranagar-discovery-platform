# 🚀 Upstash Redis Setup Guide

## Quick Setup (2 minutes)

### 1. Create Upstash Account
Go to: https://console.upstash.com/login

### 2. Create Redis Database
1. Click "Create Database"
2. Name: `indiranagar-events`
3. Region: Choose closest to your users (e.g., `ap-south-1` for India)
4. Type: `Regional` (not Global)
5. Enable: `Eviction` ✓
6. Click "Create"

### 3. Get Credentials
After creation, you'll see:
- **UPSTASH_REDIS_REST_URL**: `https://xxxxx.upstash.io`
- **UPSTASH_REDIS_REST_TOKEN**: `AX...`

### 4. Add to Environment
Add these to your `.env.local`:
```bash
# Upstash Redis (Cloud)
UPSTASH_REDIS_REST_URL=your-url-here
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### 5. For Vercel
Add the same variables in Vercel Dashboard:
- Go to your project settings
- Environment Variables
- Add both variables

## That's it! 
The free tier includes:
- 10,000 commands per day ✓
- 256MB storage ✓
- Persistence ✓
- Perfect for event queue!