# 2. ADMIN DASHBOARD INTERFACE

## 2.1 Admin Access Flow
```
User Journey:
1. Navigate to /admin
2. Enter password (single field, minimal UI)
3. Access granted → Dashboard home
4. Session persists for 24 hours
```

## 2.2 Dashboard Home Layout

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

## 2.3 Place Management Interface

### 2.3.1 List View Design
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

### 2.3.2 Add/Edit Place Form
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

## 2.4 Journey Builder Interface

### 2.4.1 Visual Builder Layout
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

## 2.5 Analytics Dashboard

### 2.5.1 Visual Analytics Layout
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
