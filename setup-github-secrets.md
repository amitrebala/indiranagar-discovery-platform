# GitHub Actions Setup Instructions

## 🔐 Add These Secrets to Your GitHub Repository

1. **Go to your repository**: https://github.com/amitrebala/indiranagar-discovery-platform

2. **Navigate to**: Settings → Secrets and variables → Actions

3. **Click "New repository secret"** and add each of these:

### Secret 1: VERCEL_TOKEN
```
Name: VERCEL_TOKEN
Value: PT2mjz7bPUU3Iot8DP82VJe7
```

### Secret 2: VERCEL_PROJECT_ID
```
Name: VERCEL_PROJECT_ID
Value: prj_z5RaKzjE2JWdKwWTmwigPfAjpw86
```

### Secret 3: VERCEL_TEAM_ID (Optional)
```
Name: VERCEL_TEAM_ID
Value: (leave empty if you don't have a team)
```

## ✅ Once Added:

1. **Automatic Monitoring**: The workflow will run every 10 minutes automatically
2. **Manual Trigger**: You can also trigger it manually from the Actions tab
3. **New Failures Only**: It will skip the existing failure and only fix new ones
4. **/dev Agent**: All fixes will use the /dev agent

## 🎯 How It Works:

1. Every 10 minutes, GitHub Actions will:
   - Check your latest Vercel deployment
   - If it finds a NEW failure (not the existing one)
   - Activate the /dev agent to fix it
   - Commit and push the fixes
   - Monitor until deployment succeeds

## 🚀 Test It:

After adding secrets, you can:
1. Go to Actions tab
2. Select "Vercel Auto-Fix" workflow
3. Click "Run workflow" to test immediately

The workflow will also run automatically every 10 minutes!