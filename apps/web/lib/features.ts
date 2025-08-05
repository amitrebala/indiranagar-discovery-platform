/**
 * Feature flag system for progressive rollout of new features
 * Enables A/B testing and safe deployment with easy rollback
 */

export const features = {
  dynamicHero: process.env.NEXT_PUBLIC_FEATURE_DYNAMIC_HERO === 'true',
  journeySelector: process.env.NEXT_PUBLIC_FEATURE_JOURNEY_SELECTOR === 'true',
  amitDashboard: process.env.NEXT_PUBLIC_FEATURE_AMIT_DASHBOARD === 'true',
  liveActivity: process.env.NEXT_PUBLIC_FEATURE_LIVE_ACTIVITY === 'true',
}

// Export for debugging in browser console
if (typeof window !== 'undefined') {
  (window as unknown as { __FEATURES__: typeof features }).__FEATURES__ = features
}