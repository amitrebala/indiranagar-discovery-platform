# 🚀 MASTER EXECUTION GUIDE - V2 Phase 1
## Complete Hands-Off Development Instructions

---

## 📋 OVERVIEW

This guide enables completely autonomous development of the V2 Admin Dashboard features. Follow this guide step-by-step to implement all Phase 1 features without needing additional clarification.

**Total Stories:** 7  
**Estimated Time:** 30-40 hours  
**Outcome:** Fully functional admin dashboard with all management features

---

## 🎯 PREREQUISITES

Before starting, ensure you have:

1. **Environment Setup:**
   ```bash
   # Verify Node.js version
   node --version  # Should be 18+
   
   # Install dependencies if not already done
   cd apps/web
   npm install
   
   # Verify Supabase connection
   npm run dev
   # Visit http://localhost:3000 - should see existing site
   ```

2. **Required Environment Variables:**
   Add to `/apps/web/.env.local`:
   ```env
   # Admin Authentication (REQUIRED - Generate these!)
   ADMIN_PASSWORD_HASH=$2a$12$[YourHashHere]
   JWT_SECRET=[32-character-random-string]
   
   # Existing variables should already be present
   NEXT_PUBLIC_SUPABASE_URL=[existing]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[existing]
   # Add your Supabase service role key here
   ```

3. **Generate Password Hash:**
   ```javascript
   // Run this in Node console to generate hash
   const bcrypt = require('bcryptjs');
   const password = 'your-chosen-admin-password';
   const hash = bcrypt.hashSync(password, 12);
   console.log('ADMIN_PASSWORD_HASH=' + hash);
   ```

4. **Database Migrations:**
   ```sql
   -- Run these in Supabase SQL editor
   -- File: /docs/architecture/v2-shards/4-database-schema-extensions.md
   -- Copy and execute the CREATE TABLE statements
   ```

---

## 📚 STORY IMPLEMENTATION ORDER

### ⚠️ CRITICAL: Follow this exact order!

Each story depends on the previous one. Do NOT skip or reorder.

### Phase 1A: Foundation (Days 1-2)

#### Story 1: Admin Authentication System
**File:** `01-admin-authentication-system.md`  
**Time:** 4-6 hours  
**Critical:** MUST be completed first!

```bash
# Validation after completion:
curl http://localhost:3000/admin/dashboard
# Should redirect to /admin/login

# Test login at /admin/login with your password
# Should successfully access /admin/dashboard
```

#### Story 2: Dashboard Home Page  
**File:** `02-dashboard-home-page.md`  
**Time:** 3-4 hours  
**Depends on:** Story 1

```bash
# Validation:
# Visit /admin/dashboard after login
# Should see stats cards and activity feed
```

### Phase 1B: Core Features (Days 3-4)

#### Story 3: Place Management CRUD
**File:** `03-place-management-crud.md`  
**Time:** 6-8 hours  
**Depends on:** Stories 1-2

Key implementation points:
- List view with filters
- Add/Edit form with multi-step wizard
- Bulk operations
- Image upload handling

#### Story 4: Question Manager Enhancement
**File:** `04-question-manager-enhancement.md`  
**Time:** 4-5 hours  
**Depends on:** Stories 1-3

Enhances existing `/app/admin/questions/enhanced/page.tsx`

### Phase 1C: Advanced Features (Days 5-6)

#### Story 5: Journey Builder Interface
**File:** `05-journey-builder.md`  
**Time:** 6-8 hours  
**Depends on:** Stories 1-4

Complex implementation with:
- Visual drag-drop builder
- Map integration
- Timeline editor

#### Story 6: Settings Configuration
**File:** `06-settings-configuration.md`  
**Time:** 3-4 hours  
**Depends on:** Stories 1-2

#### Story 7: Analytics Dashboard
**File:** `07-analytics-dashboard.md`  
**Time:** 4-5 hours  
**Depends on:** Stories 1-2

---

## 🤖 AUTONOMOUS DEVELOPMENT INSTRUCTIONS

### For Each Story:

1. **Load Story Context:**
   ```
   Open the story file from /docs/stories/v2-phase1/
   Load ONLY the specified shard files in "Context Documents"
   Do NOT load entire PRD/Architecture documents
   ```

2. **Implementation Checklist:**
   - [ ] Read acceptance criteria
   - [ ] Install any required dependencies
   - [ ] Create all files as specified
   - [ ] Follow the exact implementation instructions
   - [ ] Run tests as specified
   - [ ] Verify "Definition of Done" items

3. **Error Handling:**
   - If TypeScript errors: Check imports and types
   - If Supabase errors: Verify table exists and columns match
   - If build errors: Run `npm run build` to identify issues
   - If runtime errors: Check browser console and server logs

4. **Commit After Each Story:**
   ```bash
   # After completing each story
   git add .
   git commit -m "feat(admin): implement [story name]
   
   - [List key features implemented]
   - All tests passing
   - Story ID: V2-P1-00X"
   ```

---

## 🧪 VALIDATION CHECKLIST

### After Story 1-2 (Foundation):
- [ ] Can login to admin dashboard
- [ ] Dashboard shows stats and activity
- [ ] Logout works correctly
- [ ] Session persists on refresh

### After Story 3-4 (CRUD):
- [ ] Can view all places in table
- [ ] Can add new place with form
- [ ] Can edit existing places
- [ ] Can bulk update places
- [ ] Question manager shows enhancements

### After Story 5-7 (Advanced):
- [ ] Journey builder loads and works
- [ ] Can create/edit journeys visually
- [ ] Settings page saves configuration
- [ ] Analytics shows charts and data

---

## 🚨 TROUBLESHOOTING GUIDE

### Common Issues and Solutions:

1. **"Module not found" errors:**
   ```bash
   npm install [missing-module]
   npm run dev
   ```

2. **Supabase connection errors:**
   - Verify `.env.local` has correct SUPABASE_URL and keys
   - Check Supabase dashboard is accessible
   - Ensure tables are created

3. **TypeScript errors:**
   ```bash
   # Check for type issues
   npm run type-check
   
   # If types are missing
   npm install --save-dev @types/[package-name]
   ```

4. **Build failures:**
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

5. **Authentication not working:**
   - Verify ADMIN_PASSWORD_HASH is set correctly
   - Check JWT_SECRET is set
   - Clear cookies and try again

---

## 📊 PROGRESS TRACKING

Mark off as you complete:

### Phase 1 Checklist:
- [ ] Story 1: Admin Authentication ⏱️ ___h
- [ ] Story 2: Dashboard Home ⏱️ ___h
- [ ] Story 3: Place Management ⏱️ ___h
- [ ] Story 4: Question Manager ⏱️ ___h
- [ ] Story 5: Journey Builder ⏱️ ___h
- [ ] Story 6: Settings ⏱️ ___h
- [ ] Story 7: Analytics ⏱️ ___h

**Total Time:** _____ hours

---

## 🎯 FINAL VALIDATION

### Complete System Test:
1. Login to admin dashboard
2. Navigate through all sections
3. Test CRUD operations on places
4. Create a test journey
5. Check analytics display
6. Modify settings
7. Logout and verify protection

### Performance Check:
```bash
# Build for production
npm run build

# Check bundle size
# Should not increase by more than 200KB

# Run lighthouse
npx lighthouse http://localhost:3000/admin/dashboard
# Should score 90+ on performance
```

---

## 🚀 DEPLOYMENT READINESS

After all stories complete:

1. **Run Full Test Suite:**
   ```bash
   npm run test
   npm run test:e2e
   ```

2. **Final Build Check:**
   ```bash
   npm run build
   npm run start
   # Test production build locally
   ```

3. **Security Audit:**
   ```bash
   npm audit
   # Fix any high/critical vulnerabilities
   ```

4. **Ready for QA:**
   - All stories implemented
   - No TypeScript errors
   - All tests passing
   - Production build successful

---

## 📝 HANDOFF NOTES FOR QA

When development is complete:

### What Was Built:
- Complete admin authentication system
- Full admin dashboard with stats
- Place management CRUD operations
- Enhanced question management
- Visual journey builder
- Settings configuration
- Analytics dashboard

### Test Scenarios to Focus On:
1. Authentication flow and session management
2. CRUD operations on all entities
3. Data validation and error handling
4. Mobile responsiveness
5. Performance with large datasets

### Known Limitations:
- Analytics uses some mock data (will connect to real analytics later)
- Image upload uses Supabase storage (ensure bucket exists)
- Some features pending Phase 2 (comments, ratings)

---

## 💡 DEVELOPER NOTES

### Key Architectural Decisions:
- JWT for stateless auth (24-hour sessions)
- Zustand for client state management
- Server components where possible for performance
- Parallel data fetching for dashboard stats
- Optimistic UI updates for better UX

### Code Quality Standards:
- All components must be TypeScript
- Follow existing Tailwind patterns
- Use existing UI components from `/components/ui`
- Maintain existing code formatting
- Add comments only for complex logic

---

## 📞 EMERGENCY CONTACTS

If completely blocked:

1. **Check Documentation:**
   - `/docs/architecture/v2-shards/` - Technical details
   - `/docs/ux/v2-shards/` - UI specifications
   - `/docs/prd/v2-shards/` - Requirements

2. **Common Patterns:**
   - Authentication: See `/lib/admin/auth.ts`
   - API Routes: See `/app/api/admin/`
   - Components: See `/components/admin/`
   - Stores: See `/stores/`

3. **Fallback Strategy:**
   - Implement with mock data first
   - Get the UI working
   - Connect to real data later
   - Mark TODOs for pending items

---

## ✅ SUCCESS CRITERIA

You have successfully completed Phase 1 when:

1. **All 7 stories are implemented**
2. **No build errors or TypeScript errors**
3. **All manual tests pass**
4. **Admin can perform all CRUD operations**
5. **Dashboard is fully functional**
6. **Code is committed and pushed**

---

**REMEMBER:** Follow stories in order, test after each one, commit frequently!

---

*Execution Guide Version: 1.0*
*Last Updated: Current Date*
*Total Implementation Time: 30-40 hours*
*Author: Scrum Master Agent*