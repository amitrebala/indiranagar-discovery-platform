# 4. JOURNEY ENHANCEMENTS (BUILD ON EXISTING)

## 4.1 Journey Progress Tracking (Anonymous)
**Store in**: localStorage for anonymous users

```typescript
interface LocalJourneyProgress {
  journeyId: string;
  startedAt: Date;
  stopsCompleted: string[];
  notes: { [stopId: string]: string };
  photos: { [stopId: string]: string[] }; // Local URLs
  
  // Persist locally
  save: () => {
    localStorage.setItem(
      `journey_${journeyId}`,
      JSON.stringify(this)
    );
  };
  
  // Resume journey
  resume: () => {
    const saved = localStorage.getItem(`journey_${journeyId}`);
    return JSON.parse(saved);
  };
}
```

---
