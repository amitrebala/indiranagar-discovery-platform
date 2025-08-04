# 🚀 Quick Setup Guide - Enhanced Experience Intelligence Platform

## Pre-Deployment Account Setup

**⏱️ Total Time:** 15-20 minutes  
**💰 Cost:** $0 (All free tier services)

### 🔧 **Run the Setup Script**

```bash
./scripts/setup-accounts.sh
```

This interactive script will guide you through everything!

---

## 📋 **Manual Setup Checklist**

### **REQUIRED ACCOUNTS** ⚠️

#### 1. **Supabase** (Database & Storage)
- **URL:** https://supabase.com
- **What you need:**
  - Project URL (e.g., `https://xyz.supabase.co`)
  - Anon Key (public key)
  - Service Role Key (secret key)
- **Setup:** Create project → Go to Settings > API → Copy keys

#### 2. **OpenWeatherMap** (Weather API)  
- **URL:** https://openweathermap.org/api
- **What you need:**
  - API Key
- **Free Tier:** 1,000 calls/day
- **Setup:** Sign up → My API Keys → Copy default key

#### 3. **GitHub Repository** (Version Control)
- **URL:** https://github.com
- **What you need:** GitHub account
- **Setup:** Create repository → Push code
- **Note:** Required for Vercel/Netlify deployments

### **DEPLOYMENT PLATFORM** (Choose One)

#### 4A. **Vercel** (Recommended)
- **URL:** https://vercel.com
- **Requirements:** GitHub repository
- **Setup:** Connect GitHub → Import project → Deploy
- **Pros:** Automatic deployments, built-in analytics, easy setup

#### 4B. **Netlify** (Alternative)
- **URL:** https://netlify.com  
- **Requirements:** GitHub repository
- **Setup:** Connect GitHub → Configure build → Deploy
- **Pros:** Great for static sites, good free tier

#### 4C. **Docker** (Self-hosted)
- **Command:** `./scripts/deploy.sh production docker`
- **Requirements:** Server with Docker
- **Pros:** Full control, no external dependencies

### **OPTIONAL SERVICES** 

#### 5. **Mapbox** (Enhanced Maps)
- **URL:** https://www.mapbox.com
- **What you need:** Access Token
- **Note:** Platform works without this (uses Leaflet)

#### 6. **WeatherAPI.com** (Backup Weather)
- **URL:** https://www.weatherapi.com  
- **Free Tier:** 1M calls/month
- **Note:** Backup if OpenWeatherMap fails

---

## 🎯 **After Running Setup Script**

### 1. **Test Locally**
```bash
cd apps/web
npm run dev
# Open http://localhost:3000
```

### 2. **Run Database Migrations**
- Go to Supabase dashboard
- SQL Editor → Run migration files from `/apps/web/supabase/migrations/`

### 3. **Deploy to Production**
```bash
./scripts/deploy.sh production
```

### 4. **Verify All 5 Epics**
- ✅ Epic 1: Foundation & Core Infrastructure
- ✅ Epic 2: Place Discovery & Journey Experiences  
- ✅ Epic 3: Social Coordination & Community Features
- ✅ Epic 4: Enhanced Discovery & Content Hub
- ✅ Epic 5: UX Excellence & Accessibility

---

## 🆘 **Troubleshooting**

### **Common Issues:**

**"Supabase connection failed"**
- Check your URL format includes `https://`
- Verify API keys are correct
- Ensure database migrations are run

**"Weather API not working"**
- Verify OpenWeatherMap API key
- Check if API key is activated (can take 10 minutes)

**"Build errors"**
- Run `npm install` in `/apps/web`
- Check all environment variables are set

### **Get Help:**
- 📖 Full docs: `/docs/deployment-guide.md`
- 🏗️ Architecture: `/docs/architecture/`
- 🐛 Issues: Check error logs and environment variables

---

## 🎉 **Success Indicators**

✅ **Local Development:**
- App loads at http://localhost:3000
- Map displays correctly
- Weather widget shows data
- All navigation works

✅ **Production Ready:**
- All 5 Epic features validated
- Build completes successfully
- Health check endpoint returns healthy status
- All environment variables configured

**You're ready to deploy the complete Enhanced Experience Intelligence Platform! 🚀**