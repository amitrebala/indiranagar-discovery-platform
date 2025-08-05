# 5. CALL & DIRECTIONS FUNCTIONALITY (NEW)

## 5.1 Enhanced Call Button
```typescript
const handleCall = (place: Place) => {
  // Track call intent (anonymous)
  trackEvent('call_clicked', { 
    placeId: place.id,
    sessionId: getSessionId() 
  });
  
  const phone = place.phone;
  
  if (!phone) {
    showToast('No phone number available');
    return;
  }
  
  // Mobile: Direct dial
  if (isMobile()) {
    window.location.href = `tel:${phone}`;
  } else {
    // Desktop: Show modal with number
    showModal({
      title: `Call ${place.name}`,
      content: `
        <div class="text-2xl font-bold">${phone}</div>
        <button onclick="copyToClipboard('${phone}')">
          Copy Number
        </button>
      `
    });
  }
};
```

## 5.2 Smart Directions
```typescript
const handleDirections = async (place: Place) => {
  // Check for current location
  const userLocation = await getCurrentLocation();
  
  if (userLocation) {
    // Calculate distance
    const distance = calculateDistance(userLocation, place.coordinates);
    
    if (distance < 0.5) { // Less than 500m
      // Show walking directions in-app
      showWalkingDirections(userLocation, place);
    } else {
      // Open Google Maps for driving
      openGoogleMaps(userLocation, place);
    }
  } else {
    // No location - just show place on map
    openGoogleMaps(null, place);
  }
};
```

---
