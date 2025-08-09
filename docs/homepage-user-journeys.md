# Homepage User Journey Documentation
## Indiranagar Discovery Platform - User Interaction Guide

---

## 1. HERO SECTION (DynamicHeroSection)

### 1.1 Primary Call-to-Action: "Start Exploring"

**User Journey:**
- **Entry Point:** User lands on homepage and sees prominent hero section
- **Visual Context:** Dynamic gradient background that adapts to time of day and weather
- **User Intent:** Want to discover places in Indiranagar
- **Action:** Click "Start Exploring" button
- **Haptic Feedback:** Magnetic button effect follows cursor movement (desktop)
- **Destination:** Routes to `/map` page
- **Expected Outcome:** Interactive map opens showing all Indiranagar places

**Technical Implementation:**
- Router navigation via Next.js `useRouter`
- Magnetic button animation with transform styles
- Weather-aware and time-aware background gradients

### 1.2 Secondary Action: "View Places"

**User Journey:**
- **User Intent:** Browse place listings without map interaction
- **Action:** Click "View Places" button
- **Visual Feedback:** Glass-morphism hover effect
- **Destination:** Routes to `/places` page
- **Expected Outcome:** Grid/list view of all available places

### 1.3 Weather Widget Interaction

**User Journey:**
- **Passive Information:** Real-time weather display
- **Visual Enhancement:** Glass effect with gradient overlay on hover
- **User Value:** Weather-aware recommendations for activities
- **No Active Interaction:** Display-only component

### 1.4 Live Activity Widget

**User Journey:**
- **Real-time Data:** Shows current activity levels
- **Key Metrics:** 
  - Places currently open
  - Crowd levels
  - Peak hours
- **User Value:** Helps plan visits based on real-time conditions
- **No Direct Action:** Information display only

### 1.5 Bottom Stats Bar

**User Journey:**
- **Information Architecture:** Quick stats about the platform
- **Displayed Metrics:**
  - Places Open Now (dynamic)
  - 166 Curated Experiences
  - 5+ Years Local Expertise
  - 24/7 Live Updates
- **Interaction:** Hover animations on individual stats
- **Purpose:** Build trust and showcase platform value

---

## 2. JOURNEY SELECTOR (JourneySelectorWithRotation)

### 2.1 Journey Card Selection

**User Journey:**
- **Discovery Mode:** Browse curated journey experiences
- **Auto-Rotation:** Cards rotate every 15 seconds
- **User Intent:** Find a themed exploration route
- **Action Steps:**
  1. View journey card with title, description, time estimate
  2. Hover to see enhanced visual feedback (scale, rotation)
  3. Click journey card
- **Haptic Feedback:** Mobile vibration (10ms) on selection
- **Loading State:** Sparkles animation during transition
- **Destination:** Routes to `/map?journey={journey.id}`
- **Expected Outcome:** Map opens with selected journey route highlighted

### 2.2 Carousel Navigation Controls

**User Journey:**
- **Manual Control Options:**
  - Pause/Play auto-rotation
  - Previous/Next navigation arrows
  - Direct page dots navigation
- **User Intent:** Control browsing pace
- **Visual Feedback:** 
  - Button state changes
  - Smooth slide transitions
  - Active page indicator

### 2.3 Journey Information Display

**User Journey:**
- **Information Hierarchy:**
  - Journey icon (Map/Compass/Home)
  - Title and description
  - Estimated time badge
  - Vibe tags (atmosphere descriptors)
- **Progressive Disclosure:** More details revealed on hover
- **Decision Support:** Tags help match journey to mood/preference

---

## 3. AMIT'S DASHBOARD (AmitDashboard)

### 3.1 Today's Pick Section

**User Journey:**
- **Personalized Recommendation:** Daily curated place
- **Information Displayed:**
  - Place image thumbnail
  - Place name and reason for recommendation
  - Alternative if closed
- **Status Indicator:** Live green pulse showing Amit is "Active"
- **User Value:** Expert local recommendation

### 3.2 Weekly Insights

**User Journey:**
- **Trend Discovery:**
  - Yellow box: Current trend insight
  - Blue box: New discovery announcement
  - Red box: Crowd alerts (when applicable)
- **Information Type:** Contextual neighborhood intelligence
- **Update Frequency:** Weekly refresh

### 3.3 Ask Amit Feature

**User Journey:**
- **Initial State:** Collapsed button showing "Ask Amit Anything"
- **Action:** Click to expand question suggestions
- **Response Time:** Shows "< 2 hours" indicator
- **Quick Questions Grid:**
  - "Best coffee for remote work?"
  - "Quiet spots for reading?"
  - "Late night food options?"
  - "Hidden photography spots?"
- **Interaction:** Click predefined question
- **Expected Outcome:** Submit query for personalized response

---

## 4. FEATURED DISCOVERIES (EnhancedFeaturedDiscoveries)

### 4.1 Create Foodie Adventure CTA

**User Journey:**
- **Primary Promotion:** Prominent button below section title
- **Action:** Click "Create Your Foodie Adventure"
- **Visual Cues:** Orange-pink gradient with utensils icon
- **Destination:** Routes to `/foodie-adventure`
- **Expected Outcome:** Custom food crawl generator

### 4.2 Filter System

**User Journey:**
- **Filter Options:**
  - All (shows count)
  - Restaurants (shows count)
  - Cafes (shows count)
  - Bars (shows count)
  - Shopping (shows count)
  - Activities (shows count)
- **Smart Sorting:** Time and weather-aware ordering
  - Morning: Cafes prioritized
  - Evening: Bars/Restaurants prioritized
  - Rainy: Indoor venues prioritized
- **Instant Feedback:** Results update immediately

### 4.3 View Mode Toggle

**User Journey:**
- **Display Options:**
  - Grid View (default): 3-column layout
  - Carousel View: Swipeable cards
- **Visual Feedback:** Active mode highlighted
- **Smooth Transition:** Animated view switching

### 4.4 Discovery Card Interactions

**User Journey:**
- **Card Information:**
  - Place category icon
  - Name and description
  - Rating display
  - Quick tags (WiFi, Coffee, etc.)
  - Weather suitability indicators
  - Visitor metrics (busy/moderate/quiet)
- **Hover Effects:** Scale and shadow enhancement
- **Quick View:** Click to open modal with details
- **Main Action:** Navigate to full place page

### 4.5 Foodie Adventure Integration Card

**User Journey:**
- **Placement:** Within main grid as promotional tile
- **Visual Design:** Gradient background with center-aligned content
- **Call-to-Action:** "Start Adventure" with arrow
- **Animation:** Sparkles icon and hover scale effect
- **Purpose:** Secondary touchpoint for feature discovery

### 4.6 Quick View Modal

**User Journey:**
- **Trigger:** Click on any place card
- **Modal Content:**
  - Expanded place information
  - High-res images
  - Detailed description
  - Action buttons
- **Interactions:**
  - Close modal (X or backdrop click)
  - Navigate to full page
  - Save to favorites
- **Animation:** Smooth fade-in/out

### 4.7 View All Places Link

**User Journey:**
- **Position:** Bottom of section after all cards
- **Action:** Click "View All Places"
- **Destination:** Routes to `/places`
- **Visual Feedback:** Arrow animation on hover
- **Purpose:** Gateway to complete catalog

---

## ERROR STATES & EDGE CASES

### Loading States
- **Skeleton Screens:** Animated placeholders during data fetch
- **Progressive Loading:** Content appears as available
- **Retry Mechanism:** Error recovery with "Try Again" button

### Empty States
- **No Results:** Clear messaging with icon
- **Filter Mismatch:** Suggestion to adjust filters
- **Graceful Degradation:** Core functionality remains

### Responsive Behavior
- **Mobile Adaptations:**
  - Touch-friendly tap targets
  - Swipe gestures for carousels
  - Stacked layouts for narrow screens
  - Haptic feedback for interactions

---

## ACCESSIBILITY FEATURES

### Keyboard Navigation
- All interactive elements keyboard accessible
- Tab order follows visual hierarchy
- Arrow keys for carousel navigation
- Escape key closes modals

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for all controls
- Live regions for dynamic updates
- Alternative text for images

### Visual Accommodations
- High contrast mode support
- Focus indicators clearly visible
- Reduced motion respects user preference
- Text remains readable over dynamic backgrounds

---

## PERFORMANCE CONSIDERATIONS

### Optimization Strategies
- **Lazy Loading:** Images load on demand
- **Code Splitting:** Components load as needed
- **Caching:** Weather and place data cached
- **Debouncing:** Filter changes debounced
- **Virtual Scrolling:** Large lists virtualized

### State Management
- **Zustand Stores:** Centralized state for featured places
- **React Query:** Server state caching
- **Local Storage:** User preferences persisted
- **Session Storage:** Temporary UI states

---

## DEVELOPER IMPLEMENTATION NOTES

### Key Components
- `DynamicHeroSection`: Entry point with CTAs
- `JourneySelectorWithRotation`: Journey discovery carousel
- `AmitDashboard`: Personalized recommendations
- `EnhancedFeaturedDiscoveries`: Place showcase with filters

### Data Flow
1. **Initial Load:** Fetch places from Supabase
2. **Enhancement:** Add weather/time metadata
3. **Filtering:** Apply user selections
4. **Sorting:** Smart sort by context
5. **Display:** Render in selected view mode

### Navigation Patterns
- **Router-based:** Next.js App Router for page transitions
- **Query Parameters:** Journey and filter states in URL
- **Modal Overlays:** Quick views without navigation
- **Smooth Scrolling:** Anchor links for page sections

### Animation Framework
- **Framer Motion:** Complex animations and gestures
- **CSS Transitions:** Simple hover effects
- **Loading States:** Skeleton screens and spinners
- **Micro-interactions:** Button feedback and card hovers

---

## METRICS & ANALYTICS EVENTS

### User Engagement Tracking
- Hero CTA clicks (Start Exploring vs View Places)
- Journey selection and completion rates
- Filter usage patterns
- View mode preferences
- Quick view vs full page navigation
- Foodie Adventure conversion rate
- Ask Amit interaction frequency

### Performance Metrics
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- API response times
- Error rates and recovery success
- Cache hit rates

---

## DOCUMENT METADATA

- **Last Updated:** January 2025
- **Version:** 1.0.0
- **Component Coverage:** Complete homepage interaction documentation
- **Related Files:**
  - `/app/page.tsx` - Homepage implementation
  - `/components/home/` - Homepage component directory
  - `/docs/prd/` - Product requirements documentation