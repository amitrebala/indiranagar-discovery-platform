# Development Story: Critical Data Cleanup - Amit's Real Visited Places

## Story ID: DS-CRITICAL-001
## Priority: CRITICAL - IMMEDIATE ACTION REQUIRED
## Estimated Time: 2-3 hours

## Overview
This is a CRITICAL data cleanup task. The production website currently shows 1,086 fake places that Amit has NOT actually visited. This must be corrected immediately to show ONLY the 137 real places Amit has actually been to. Any place not in the provided list must be removed from the entire codebase, database, and UI.

## Problem Statement
- Current state: Site shows 1,086 places (mostly fake/dummy data)
- Required state: Site must show ONLY 137 real places Amit has visited
- Critical: User trust and authenticity at stake

## Success Criteria
1. ✅ ONLY places from Amit's real list appear anywhere on the site
2. ✅ All fake/dummy place data is completely removed
3. ✅ Database contains only the 137 real places
4. ✅ No traces of old data remain in any file
5. ✅ Search, filters, and all features work with real data only

## Implementation Steps

### Step 1: Replace Core Data File
**File:** `/apps/web/data/amit-actual-visited-places.ts`
- DELETE this file completely
- Replace ALL imports from this file to use: `amit-real-visited-places.ts`
- The new file has been created with 137 real places

### Step 2: Update All Import Statements
Search and replace across entire codebase:
```typescript
// OLD - REMOVE ALL OF THESE:
import { amitActualVisitedPlaces } from '../data/amit-actual-visited-places'
import { amitActualVisitedPlaces } from '../../data/amit-actual-visited-places'
import { amitActualVisitedPlaces } from '@/data/amit-actual-visited-places'

// NEW - REPLACE WITH:
import { amitRealVisitedPlaces } from '../data/amit-real-visited-places'
import { amitRealVisitedPlaces } from '../../data/amit-real-visited-places'
import { amitRealVisitedPlaces } from '@/data/amit-real-visited-places'
```

### Step 3: Update Variable References
Replace all variable references:
```typescript
// OLD:
amitActualVisitedPlaces
getPlacesByCategory
getHighlyRatedPlaces
searchPlaces
placeCategories

// NEW:
amitRealVisitedPlaces
getRealPlacesByCategory
getRealHighlyRatedPlaces
searchRealPlaces
realPlaceCategories
```

### Step 4: Clean Database Seed Files

#### File: `/apps/web/scripts/seed-database.ts`
- Remove ALL hardcoded SAMPLE_PLACES
- Import and use only `amitRealVisitedPlaces`
- Remove references to places like "Toit Brewpub", "Phoenix MarketCity", etc.

#### File: `/apps/web/scripts/seed-amit-places.ts`
- Update import to use `amitRealVisitedPlaces`
- Remove ANY featured places not in the real list
- Update companion activities to only reference real places

#### File: `/apps/web/scripts/seed-amit-complete.ts`
- If this file exists, update to use real data only
- Remove any dummy data generation

### Step 5: Update Components

#### Key Components to Update:
1. `/apps/web/components/places/AmitPlaceDetail.tsx`
2. `/apps/web/components/search/AmitSearchButton.tsx`
3. `/apps/web/components/community/HasAmitBeenHereButton.tsx`
4. `/apps/web/components/navigation/Header.tsx`

### Step 6: Clean API Routes
- `/apps/web/app/api/places/route.ts`
- `/apps/web/app/api/places/[id]/route.ts`
- Ensure they reference only real data

### Step 7: Database Migration
Create a new migration to:
1. DELETE all existing places from database
2. Re-seed with ONLY the 137 real places
3. Set `has_amit_visited = true` for all real places

### Step 8: Verify Cleanup
Run these checks:
```bash
# Search for old data file references
grep -r "amit-actual-visited-places" apps/web/
grep -r "amitActualVisitedPlaces" apps/web/

# Search for dummy place names that should NOT exist
grep -r "Toit Brewpub" apps/web/
grep -r "Gallery Sumukha" apps/web/
grep -r "Blue Tokai Coffee Roasters" apps/web/

# Count places in database
npm run seed:database
```

## Data Structure Changes

### Old Structure (DELETE):
- 1,086 places with many fake entries
- Categories included places Amit never visited
- Dummy coordinates and data

### New Structure (KEEP):
- Exactly 137 real places
- Each place has enhanced metadata:
  - Accurate categories
  - Real ratings from Amit
  - Actual notes from visits
  - Must-try dishes noted
  - Vibe descriptions
  - Price ranges
  - Best-for recommendations

## Testing Checklist
- [ ] Home page shows only real places
- [ ] Search returns only real places
- [ ] Category filters show correct counts
- [ ] "Has Amit Been Here" button works correctly
- [ ] Place details show real information
- [ ] No console errors about missing places
- [ ] Database has exactly 137 places

## Critical Files to Update
1. `/apps/web/data/amit-actual-visited-places.ts` → DELETE
2. `/apps/web/scripts/seed-database.ts` → UPDATE
3. `/apps/web/scripts/seed-amit-places.ts` → UPDATE
4. All component imports → UPDATE
5. All API routes → UPDATE

## Rollback Plan
If issues occur:
1. Git revert the changes
2. Re-run old seed scripts
3. Investigate and fix issues
4. Re-attempt cleanup

## IMPORTANT NOTES
- This is NOT a feature addition - it's a critical data correction
- Every place not in Amit's real list must be removed
- No exceptions - if Amit hasn't been there, it doesn't belong
- The site's credibility depends on showing only real visited places

## Acceptance Criteria
The implementation is complete when:
1. Running `grep -r "amit-actual-visited-places"` returns 0 results
2. The site shows exactly 137 places
3. All features work with real data
4. No dummy/fake places appear anywhere
5. User can verify every place shown is from Amit's real list

## Reference: Real Categories
The real places fall into these categories:
- cafe (23 places)
- fine dining (11 places)
- restaurant (16 places)
- asian (18 places)
- italian (7 places)
- indian (22 places)
- mexican (1 place)
- bar (21 places)
- nightlife (5 places)
- quick bites (7 places)
- seafood (1 place)
- specialty (9 places)
- dessert (3 places)

Total: 137 real places Amit has actually visited.