# UI/UX Frontend Specification: V2 New Features
## Indiranagar Discovery Platform Enhancement

---

## 1. INTRODUCTION

This document defines the user experience and interface specifications for NEW features being added to the Indiranagar Discovery Platform. It focuses exclusively on features not yet implemented, building upon the existing design system and interaction patterns.

### 1.1 Scope of New Features
- **Admin Dashboard** - Comprehensive management interface (password-protected)
- **Comment System** - Anonymous-friendly community engagement
- **Rating System** - Simple star ratings without authentication
- **Journey Builder** - Visual tool for creating curated journeys
- **Enhanced Interactions** - Call/directions functionality
- **Companion Activities Engine** - Smart recommendations
- **Weather Features** - Advanced contextual suggestions
- **Sharing Enhancements** - Social media integration

### 1.2 Design Principles
1. **Consistency First** - Match existing design patterns and components
2. **Admin Efficiency** - Powerful tools with minimal clicks for Amit
3. **Community Openness** - No authentication barriers for engagement
4. **Mobile-Responsive** - All new features work on mobile devices
5. **Progressive Enhancement** - Features degrade gracefully

---

## 2. ADMIN DASHBOARD INTERFACE

### 2.1 Admin Access Flow
```
User Journey:
1. Navigate to /admin
2. Enter password (single field, minimal UI)
3. Access granted → Dashboard home
4. Session persists for 24 hours
```

### 2.2 Dashboard Home Layout

```
┌──────────────────────────────────────────────────────┐
│  Admin Dashboard                    [Logout] [Help]   │
├──────────────────────────────────────────────────────┤
│                                                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│  │ Places      │ │ Community   │ │ Analytics   │    │
│  │ 186 total   │ │ 12 pending  │ │ 2.3k today  │    │
│  │ [Manage]    │ │ [Review]    │ │ [View]      │    │
│  └─────────────┘ └─────────────┘ └─────────────┘    │
│                                                        │
│  Quick Actions:                                       │
│  [+ Add Place] [📝 Create Journey] [⚙️ Settings]      │
│                                                        │
│  Recent Activity                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │ • New question about Toit (2 min ago)        │    │
│  │ • Comment on Glen's Bakehouse (1 hr ago)     │    │
│  │ • 5 new ratings today                         │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

### 2.3 Place Management Interface

#### 2.3.1 List View Design
```
┌──────────────────────────────────────────────────────┐
│  Place Management                                      │
├──────────────────────────────────────────────────────┤
│  [+ Add New] [⬆️ Import] [⬇️ Export]  🔍 [Search...]  │
├──────────────────────────────────────────────────────┤
│  Filters: [Category ▼] [Visited ▼] [Has Images ▼]    │
├──────────────────────────────────────────────────────┤
│  □ Select All  [Bulk Actions ▼]                       │
├──────────────────────────────────────────────────────┤
│  □ Glen's Bakehouse  🍰  ⭐4.5  ✓Visited  🖼️5  [Edit] │
│  □ Toit               🍺  ⭐4.8  ✓Visited  🖼️12 [Edit] │
│  □ New Place          📍  ⭐--   ✗Not yet  🖼️0  [Edit] │
└──────────────────────────────────────────────────────┘
```

#### 2.3.2 Add/Edit Place Form
Multi-step wizard with visual progress indicator:

**Step 1: Basic Info**
```
┌──────────────────────────────────────────────────────┐
│  Add New Place - Step 1 of 6                          │
│  [●──────] Basic Info                                 │
├──────────────────────────────────────────────────────┤
│                                                        │
│  Place Name*        [____________________]            │
│  Category*          [Restaurant ▼]                    │
│  Subcategory        [Cafe ▼]                          │
│                                                        │
│  Description                                          │
│  ┌──────────────────────────────────────────────┐    │
│  │ Rich text editor with formatting              │    │
│  │ [B] [I] [U] [Link] [•] [1.]                  │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Amit's Personal Notes (private)                      │
│  [________________________________]                    │
│                                                        │
│  [Cancel]                    [Save Draft] [Next →]    │
└──────────────────────────────────────────────────────┘
```

**Step 2: Location Picker**
```
┌──────────────────────────────────────────────────────┐
│  Add New Place - Step 2 of 6                          │
│  [──●────] Location                                   │
├──────────────────────────────────────────────────────┤
│                                                        │
│  Search Address     [100 Feet Road, Indira... 🔍]    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │                                                │    │
│  │         [Interactive Leaflet Map]              │    │
│  │              📍 (Draggable pin)                │    │
│  │                                                │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Coordinates: 12.9716° N, 77.6411° E                 │
│  Nearby Landmarks: [Near Forum Mall___]              │
│                                                        │
│  [← Back]                    [Save Draft] [Next →]    │
└──────────────────────────────────────────────────────┘
```

### 2.4 Journey Builder Interface

#### 2.4.1 Visual Builder Layout
```
┌──────────────────────────────────────────────────────┐
│  Journey Builder                                       │
├──────────────────────────────────────────────────────┤
│  Journey Name: [Morning Coffee Trail_____]            │
│  Duration: 2.5 hrs  Distance: 3.2 km  Stops: 4       │
├──────────────────────────────────────────────────────┤
│     Map View          │     Journey Timeline          │
│  ┌─────────────────┐  │  ┌─────────────────────────┐ │
│  │                 │  │  │ 9:00  ☕ Third Wave     │ │
│  │   [Map with     │  │  │   ↓ 5 min walk         │ │
│  │    route]       │  │  │ 9:45  🥐 Glen's        │ │
│  │                 │  │  │   ↓ 3 min walk         │ │
│  │                 │  │  │ 10:30 📚 Bookworm      │ │
│  └─────────────────┘  │  │   ↓ 7 min walk         │ │
│                        │  │ 11:15 🌳 Cubbon Park   │ │
│  [+ Add Stop]         │  └─────────────────────────┘ │
│                        │                              │
│  Properties:          │  [Test Journey] [Preview]    │
│  Mood: [Relaxed ▼]    │  [Save Draft]  [Publish]    │
└──────────────────────────────────────────────────────┘
```

### 2.5 Analytics Dashboard

#### 2.5.1 Visual Analytics Layout
```
┌──────────────────────────────────────────────────────┐
│  Analytics Dashboard           [Export] [Date Range]  │
├──────────────────────────────────────────────────────┤
│                                                        │
│  Real-time: 47 active users                          │
│                                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │         Weekly Traffic (Line Chart)              │ │
│  │     📈                                           │ │
│  └─────────────────────────────────────────────────┘ │
│                                                        │
│  Top Places Today        │  Search Insights           │
│  1. Toit (234 views)    │  "coffee" - 45 searches   │
│  2. Glen's (189 views)  │  "brunch" - 32 searches   │
│  3. Forum (156 views)   │  "bars" - 28 searches     │
│                                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │    Geographic Heatmap (Leaflet Integration)      │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## 3. COMMENT SYSTEM INTERFACE

### 3.1 Comment Component Design
Embedded below place details, journey pages, and blog posts:

```
┌──────────────────────────────────────────────────────┐
│  💬 Comments (12)                                      │
├──────────────────────────────────────────────────────┤
│                                                        │
│  Add your comment:                                    │
│  ┌──────────────────────────────────────────────┐    │
│  │ Type your comment here...                     │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Display name (optional): [Anonymous_____]           │
│  [Post Comment]                                       │
│                                                        │
├──────────────────────────────────────────────────────┤
│                                                        │
│  👤 Coffee Lover • 2 hours ago                       │
│  Great place for morning coffee! The ambiance is     │
│  perfect for working.                                │
│  [👍 5] [Reply]                                      │
│                                                        │
│     └─ 👤 Amit (Owner) • 1 hour ago                 │
│        Absolutely agree! I go there every Tuesday.   │
│        [👍 2]                                         │
│                                                        │
│  👤 Anonymous • 5 hours ago                          │
│  Bit crowded on weekends but worth it.              │
│  [👍 3] [Reply]                                      │
└──────────────────────────────────────────────────────┘
```

### 3.2 Admin Moderation View
```
┌──────────────────────────────────────────────────────┐
│  🛡️ This comment has been flagged (Admin Only)        │
│  [Approve] [Delete] [Ban IP]                         │
└──────────────────────────────────────────────────────┘
```

---

## 4. RATING SYSTEM INTERFACE

### 4.1 Rating Component
Simple, inline star rating widget:

```
┌──────────────────────────────────────────────────────┐
│  Rate this place:  ☆ ☆ ☆ ☆ ☆  (4.5/5 from 127)      │
│                                                        │
│  Your rating: ★ ★ ★ ★ ☆  [Submit]                   │
│                                                        │
│  Distribution:                                        │
│  5★ ████████████████ 65                              │
│  4★ ████████ 32                                      │
│  3★ ████ 18                                          │
│  2★ ██ 8                                             │
│  1★ █ 4                                              │
└──────────────────────────────────────────────────────┘
```

---

## 5. CALL & DIRECTIONS INTERFACE

### 5.1 Action Buttons Design
Enhanced place card actions:

```
┌──────────────────────────────────────────────────────┐
│  Glen's Bakehouse                                     │
│  ⭐ 4.5 • ☕ Cafe • 💰 ₹₹                             │
├──────────────────────────────────────────────────────┤
│                                                        │
│  [📞 Call]  [🗺️ Directions]  [🔗 Share]  [💾 Save]   │
│                                                        │
└──────────────────────────────────────────────────────┘
```

### 5.2 Click Behaviors
- **Call Button**: 
  - Desktop: Shows modal with phone number and QR code
  - Mobile: Direct tel: link
- **Directions Button**: 
  - Opens Google Maps with pre-filled destination
  - Tracks click for analytics

---

## 6. COMPANION ACTIVITIES ENGINE

### 6.1 Recommendation Widget
```
┌──────────────────────────────────────────────────────┐
│  🎯 Perfect Companions for Glen's Bakehouse          │
├──────────────────────────────────────────────────────┤
│                                                        │
│  Before (Morning):                                    │
│  • ☕ Third Wave Coffee (2 min walk)                 │
│  • 🏃 Cubbon Park Run (5 min)                        │
│                                                        │
│  After (Afternoon):                                   │
│  • 📚 Bookworm (3 min walk)                          │
│  • 🛍️ Forum Mall (7 min walk)                        │
│                                                        │
│  [Create Journey with These →]                       │
└──────────────────────────────────────────────────────┘
```

---

## 7. RESPONSIVE DESIGN SPECIFICATIONS

### 7.1 Breakpoints
- Mobile: 320px - 768px
- Tablet: 769px - 1024px
- Desktop: 1025px+

### 7.2 Mobile Adaptations

#### Admin Dashboard (Mobile)
```
┌─────────────┐
│ ☰ Admin     │
├─────────────┤
│ Places: 186 │
│ [Manage]    │
├─────────────┤
│ Pending: 12 │
│ [Review]    │
├─────────────┤
│ Quick Acts  │
│ [+ Place]   │
│ [+ Journey] │
└─────────────┘
```

#### Journey Builder (Mobile)
- Vertical stack layout
- Map view and timeline in tabs
- Drag-and-drop via long press

---

## 8. INTERACTION PATTERNS

### 8.1 Loading States
- Skeleton screens for content areas
- Inline spinners for actions
- Progress bars for uploads

### 8.2 Error Handling
```
┌──────────────────────────────────────────────────────┐
│  ⚠️ Unable to save place                              │
│  Please check your connection and try again.         │
│  [Retry] [Cancel]                                    │
└──────────────────────────────────────────────────────┘
```

### 8.3 Success Feedback
```
┌──────────────────────────────────────────────────────┐
│  ✅ Place successfully added!                         │
│  [View Place] [Add Another]                          │
└──────────────────────────────────────────────────────┘
```

---

## 9. ACCESSIBILITY REQUIREMENTS

### 9.1 WCAG AA Compliance
- All interactive elements have keyboard support
- ARIA labels for screen readers
- Color contrast ratio ≥ 4.5:1
- Focus indicators on all inputs

### 9.2 Admin-Specific Accessibility
- Keyboard shortcuts for common actions
- Bulk operation confirmations
- Auto-save drafts every 30 seconds

---

## 10. COMPONENT LIBRARY EXTENSIONS

### 10.1 New Components Needed
```typescript
// Admin Components
- PasswordGate
- AdminNav
- DataTable
- BulkActionBar
- StatsCard

// Comment/Rating
- CommentThread
- StarRating
- FlagButton

// Journey
- JourneyBuilder
- TimelineEditor
- RouteMap
- StopCard

// Analytics
- LineChart
- HeatMap
- MetricCard
- TrendIndicator
```

### 10.2 Design Tokens
```css
/* New Admin Theme Variables */
--admin-primary: #1e40af;
--admin-danger: #dc2626;
--admin-success: #16a34a;
--admin-warning: #f59e0b;

/* Spacing for Admin Density */
--admin-padding-tight: 8px;
--admin-padding-normal: 16px;
--admin-padding-loose: 24px;
```

---

## 11. ANIMATION & MICRO-INTERACTIONS

### 11.1 Admin Dashboard
- Smooth number transitions for stats
- Slide-in panels for forms
- Drag-and-drop visual feedback
- Toast notifications slide up

### 11.2 Comments/Ratings
- Star fill animation on hover
- Comment slide-down on post
- Like button pulse effect
- Smooth scroll to new comment

---

## 12. IMPLEMENTATION PRIORITIES

### Phase 1 (Core Admin)
1. Admin authentication gate
2. Place management CRUD
3. Basic analytics dashboard

### Phase 2 (Community Features)
1. Comment system
2. Rating system
3. Moderation tools

### Phase 3 (Advanced Features)
1. Journey builder
2. Companion engine
3. Advanced analytics

---

## APPENDIX: FIGMA MOCKUP LINKS
*To be added when visual designs are created*

---

## NEXT STEPS
1. Review and approve specifications
2. Create visual mockups for key screens
3. Build component library extensions
4. Begin implementation following phases

---

*Document Version: 1.0*
*Last Updated: Current Date*
*Author: UX Expert Agent*