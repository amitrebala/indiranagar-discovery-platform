# Story DS-002: "Has Amit Been Here?" Floating Action Button

## Story Overview
**Feature:** Interactive floating button that reveals Amit's visits to places
**Priority:** High
**Epic:** Enhanced Discovery & Personalization
**Target Users:** All platform visitors who want to explore Amit's footprints

## User Journey Scenarios

### Journey 1: First-Time Discovery
1. User lands on any page
2. Notices an intriguing floating button with playful animation
3. Hovers/taps → Button responds with delightful micro-interaction
4. Clicks → Reveals Amit's presence at current location or filters map view
5. User feels connected to Amit's journey and explores more

### Journey 2: Active Explorer
1. User navigates between different places
2. Button dynamically updates its state based on location
3. Visual feedback shows if Amit has been to current place
4. Click filters/highlights all of Amit's visited places on map
5. User can toggle between "All Places" and "Amit's Places"

### Journey 3: Social Sharing
1. User discovers Amit visited their favorite spot
2. Button celebrates with animation
3. User can share this discovery
4. Creates personal connection with the curator

## Design Specifications

### Visual Design

```typescript
// Button States & Styles
interface AmitButtonStyles {
  // Base floating button
  container: {
    position: 'fixed';
    bottom: '24px';
    right: '24px';
    zIndex: 9999; // Above all content
    transform: 'translateY(0)';
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  };
  
  // Button variations based on state
  variants: {
    default: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)';
      width: '64px';
      height: '64px';
      borderRadius: '32px';
    };
    
    hovered: {
      transform: 'scale(1.1) rotate(5deg)';
      boxShadow: '0 15px 50px rgba(102, 126, 234, 0.6)';
    };
    
    amitVisited: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      animation: 'pulse 2s infinite';
    };
    
    expanded: {
      width: '200px';
      height: '64px';
      borderRadius: '32px';
    };
  };
  
  // Icon/Avatar
  avatar: {
    width: '40px';
    height: '40px';
    borderRadius: '50%';
    border: '3px solid white';
    animation: 'float 3s ease-in-out infinite';
  };
}
```

### Animations & Interactions

```typescript
// Creative animations
const animations = {
  // Floating effect when idle
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
  `,
  
  // Pulse when Amit visited current place
  pulse: `
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(245, 87, 108, 0.7); }
      70% { box-shadow: 0 0 0 20px rgba(245, 87, 108, 0); }
      100% { box-shadow: 0 0 0 0 rgba(245, 87, 108, 0); }
    }
  `,
  
  // Celebration animation
  celebrate: `
    @keyframes celebrate {
      0% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.2) rotate(-15deg); }
      50% { transform: scale(0.9) rotate(15deg); }
      75% { transform: scale(1.1) rotate(-5deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
  `,
  
  // Entry animation
  slideInBounce: `
    @keyframes slideInBounce {
      0% { 
        transform: translateX(100px) scale(0.3);
        opacity: 0;
      }
      50% {
        transform: translateX(-10px) scale(1.1);
      }
      70% {
        transform: translateX(5px) scale(0.9);
      }
      100% {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
    }
  `
};
```

### Interaction States

```typescript
interface ButtonInteractionStates {
  // Initial state
  initial: {
    text: "👋";
    tooltip: "Has Amit been here?";
  };
  
  // Hover states
  hover: {
    default: {
      text: "🤔";
      tooltip: "Click to see Amit's adventures!";
    };
    visited: {
      text: "🎉";
      tooltip: "Yes! Amit loves this place!";
    };
  };
  
  // Click behaviors
  onClick: {
    // If on a place page
    onPlacePage: () => {
      if (amitVisited) {
        showCelebration();
        displayAmitStory();
      } else {
        showMessage("Amit hasn't been here yet!");
        suggestNearbyAmitPlaces();
      }
    };
    
    // If on map or listing
    onMapView: () => {
      toggleAmitFilter();
      highlightAmitPlaces();
    };
  };
  
  // Easter eggs
  secretInteractions: {
    tripleClick: () => showAmitDanceAnimation();
    longPress: () => revealAmitFavorites();
    konami: () => unlockAmitSecretPlaces();
  };
}
```

### Component Implementation

```tsx
// Main component structure
const HasAmitBeenHereButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const { currentPlace, amitPlaces } = usePlaces();
  const hasAmitVisited = currentPlace && amitPlaces.includes(currentPlace.id);
  
  // Creative particle effects on interaction
  const createParticles = () => {
    // Generate colorful particles that burst from button
  };
  
  // Sound effects (optional but fun!)
  const playSound = (type: 'hover' | 'click' | 'celebrate') => {
    // Subtle sound feedback
  };
  
  return (
    <motion.div
      className="amit-button-container"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20 }}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
      }}
    >
      <motion.button
        className={cn(
          "amit-button",
          hasAmitVisited && "amit-visited",
          isExpanded && "expanded"
        )}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => {
          setIsHovered(true);
          playSound('hover');
        }}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        onDoubleClick={handleSecretInteraction}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="avatar"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <img 
                src="/amit-avatar.png" 
                alt="Amit"
                className="amit-avatar"
              />
              {hasAmitVisited && (
                <motion.span 
                  className="visit-badge"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          ) : (
            <motion.span
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="button-text"
            >
              {hasAmitVisited ? "Amit was here! 🎉" : "Show Amit's places"}
            </motion.span>
          )}
        </AnimatePresence>
        
        {/* Floating emojis on hover */}
        {isHovered && (
          <FloatingEmojis 
            emojis={['🚶', '📸', '✨', '🗺️']}
            trigger={isHovered}
          />
        )}
      </motion.button>
      
      {/* Celebration overlay */}
      {showCelebration && (
        <CelebrationOverlay 
          onComplete={() => setShowCelebration(false)}
        />
      )}
      
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && !isExpanded && (
          <motion.div
            className="amit-tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {getTooltipText()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
```

### Accessibility

```typescript
// Accessibility features
const a11yFeatures = {
  // Keyboard navigation
  keyboard: {
    'Enter': 'Activate button',
    'Space': 'Activate button', 
    'Escape': 'Close expanded state',
    'Tab': 'Focus management'
  },
  
  // Screen reader
  ariaLabels: {
    button: 'Check if Amit has visited this place',
    visited: 'Amit has been here',
    notVisited: 'Amit has not visited this place yet',
    expanded: 'Viewing Amit\'s visited places'
  },
  
  // Reduced motion
  reducedMotion: {
    // Simplified animations for users who prefer reduced motion
    animations: 'fade only',
    particles: 'disabled',
    float: 'static'
  }
};
```

### Mobile Optimization

```typescript
// Mobile-specific behavior
const mobileOptimizations = {
  // Touch gestures
  gestures: {
    tap: 'Primary action',
    longPress: 'Show options',
    swipeUp: 'Expand details',
    swipeDown: 'Minimize'
  },
  
  // Responsive positioning
  positioning: {
    portrait: { bottom: '20px', right: '20px' },
    landscape: { bottom: '16px', right: '16px' }
  },
  
  // Haptic feedback
  haptics: {
    onTap: 'light',
    onVisited: 'success',
    onCelebrate: 'impact'
  }
};
```

## Technical Implementation Notes

### Performance Considerations
- Use CSS transforms for animations (GPU accelerated)
- Lazy load celebration animations
- Debounce hover interactions
- Preload Amit's avatar image
- Use React.memo for optimization

### State Management
```typescript
// Zustand store
interface AmitButtonStore {
  isVisible: boolean;
  isExpanded: boolean;
  filterActive: boolean;
  visitedPlaces: string[];
  currentInteraction: string | null;
  
  // Actions
  toggleFilter: () => void;
  setExpanded: (expanded: boolean) => void;
  celebrate: (placeId: string) => void;
}
```

### Integration Points
1. **With Map Component**: Filter/highlight Amit's places
2. **With Place Pages**: Show visit status and stories
3. **With Analytics**: Track engagement with Amit's content
4. **With Social Features**: Share Amit's recommendations

## Success Metrics
- Click-through rate > 30%
- Average session time increase when using filter
- Social shares of "Amit visited" places
- User delight score (via micro-surveys)

## Creative Easter Eggs
1. **Dance Mode**: Triple-click makes Amit's avatar dance
2. **Secret Places**: Long press reveals hidden gems
3. **Trail Mode**: Draw a line between Amit's visited places
4. **Time Machine**: Show when Amit visited (with old photos)
5. **Amit Says**: Random fun facts about places he's visited

## Development Checklist
- [x] Implement base floating button component
- [x] Add state management for Amit's places
- [x] Create animation library
- [x] Implement interaction handlers
- [x] Add accessibility features
- [x] Create celebration animations
- [ ] Add sound effects (optional)
- [x] Implement mobile gestures
- [ ] Add analytics tracking
- [x] Create documentation
- [ ] Test across devices
- [ ] Performance optimization
- [ ] A/B test variations

## Implementation Status
**Status:** Ready for Review

### Dev Agent Record
- **Agent Model Used:** claude-opus-4-20250514
- **Date Implemented:** 2025-08-05

### File List
- `/apps/web/components/community/HasAmitBeenHereButton.tsx` - Enhanced floating button component
- `/apps/web/components/ui/FloatingEmojis.tsx` - Floating emoji animation component
- `/apps/web/components/ui/CelebrationOverlay.tsx` - Celebration overlay animation
- `/apps/web/stores/amitButtonStore.ts` - Zustand store for button state
- `/apps/web/styles/amit-button.css` - Animation keyframes and styles
- `/apps/web/public/amit-avatar.svg` - Amit avatar placeholder image
- `/apps/web/app/globals.css` - Updated to import amit-button.css

### Change Log
1. Installed framer-motion dependency for smooth animations
2. Created floating emoji and celebration overlay components
3. Enhanced HasAmitBeenHereButton with all specified animations and interactions
4. Added Zustand store for managing button state
5. Implemented easter eggs (triple-click dance, long-press favorites)
6. Added accessibility features (keyboard navigation, ARIA labels, reduced motion)
7. Created responsive positioning and mobile gestures
8. Added haptic feedback integration

This button should feel like a delightful companion throughout the user's journey, adding personality and creating memorable moments of discovery!