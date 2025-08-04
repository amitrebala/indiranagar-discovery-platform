import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/navigation/Header";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Footer } from "@/components/layout/Footer";
import HasAmitBeenHereButton from "@/components/community/HasAmitBeenHereButton";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Indiranagar Discovery | Personal Place Recommendations",
  description: "Discover hidden gems in Indiranagar with personal recommendations from a local expert. Weather-aware exploration with 100+ curated places.",
  keywords: "Indiranagar, Bangalore, places, recommendations, local expert, weather-aware",
  openGraph: {
    title: "Indiranagar Discovery Platform",
    description: "Personal place recommendations from local expert",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indiranagar Discovery Platform",
    description: "Personal place recommendations from local expert",
  },
  manifest: "/manifest.json",
  themeColor: "#6366f1",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://supabase.co" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .loading-skeleton { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
            .optimize-loading { contain: layout style paint; }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased optimize-loading`}
      >
        <PreferencesProvider>
          {/* Service Worker Registration */}
          <Script
            id="service-worker-registration"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                        
                        // Handle service worker updates
                        registration.addEventListener('updatefound', () => {
                          const newWorker = registration.installing;
                          if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New content is available, notify user
                                if ('Notification' in window && Notification.permission === 'granted') {
                                  new Notification('App Updated', {
                                    body: 'New content is available. Refresh to update.',
                                    icon: '/images/icons/icon-192x192.png'
                                  });
                                }
                              }
                            });
                          }
                        });
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                  });
                }
              `
            }}
          />

          {/* Web Vitals Monitoring */}
          <Script
            id="web-vitals-monitoring"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                // Core Web Vitals monitoring
                function reportWebVital(name, value) {
                  // Send to analytics
                  if (typeof gtag !== 'undefined') {
                    gtag('event', name, {
                      event_category: 'Web Vitals',
                      value: Math.round(name === 'CLS' ? value * 1000 : value),
                      non_interaction: true,
                    });
                  }
                  
                  // Send to custom endpoint
                  if (navigator.sendBeacon) {
                    const body = JSON.stringify({
                      name,
                      value,
                      url: location.href,
                      timestamp: Date.now()
                    });
                    navigator.sendBeacon('/api/analytics/web-vitals', body);
                  }
                }

                // Largest Contentful Paint (LCP)
                new PerformanceObserver((entryList) => {
                  for (const entry of entryList.getEntries()) {
                    reportWebVital('LCP', entry.startTime);
                  }
                }).observe({entryTypes: ['largest-contentful-paint']});

                // First Input Delay (FID)
                new PerformanceObserver((entryList) => {
                  for (const entry of entryList.getEntries()) {
                    reportWebVital('FID', entry.processingStart - entry.startTime);
                  }
                }).observe({entryTypes: ['first-input']});

                // Cumulative Layout Shift (CLS)
                let clsValue = 0;
                let clsEntries = [];
                new PerformanceObserver((entryList) => {
                  for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                      const firstSessionEntry = clsEntries[0];
                      const lastSessionEntry = clsEntries[clsEntries.length - 1];
                      if (!firstSessionEntry || entry.startTime - lastSessionEntry.startTime < 1000) {
                        clsEntries.push(entry);
                        clsValue += entry.value;
                      } else {
                        clsEntries = [entry];
                        clsValue = entry.value;
                      }
                      reportWebVital('CLS', clsValue);
                    }
                  }
                }).observe({entryTypes: ['layout-shift']});

                // Time to First Byte (TTFB)
                new PerformanceObserver((entryList) => {
                  for (const entry of entryList.getEntries()) {
                    reportWebVital('TTFB', entry.responseStart - entry.requestStart);
                  }
                }).observe({entryTypes: ['navigation']});
              `
            }}
          />

          {/* Resource Hints for Critical Resources */}
          <Script
            id="resource-hints"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                // Preload critical images based on current page
                const currentPath = window.location.pathname;
                if (currentPath === '/') {
                  const link = document.createElement('link');
                  link.rel = 'preload';
                  link.as = 'image';
                  link.href = '/images/hero-background.jpg';
                  document.head.appendChild(link);
                } else if (currentPath.startsWith('/places/')) {
                  const link = document.createElement('link');
                  link.rel = 'preload';
                  link.as = 'image';
                  link.href = '/images/placeholder-place.jpg';
                  document.head.appendChild(link);
                }
              `
            }}
          />

          {/* Skip to content link for accessibility */}
          <a 
            href="#main-content" 
            className="skip-to-content sr-only focus:not-sr-only"
          >
            Skip to main content
          </a>

          <Header />
          <MobileNav />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
          <HasAmitBeenHereButton />
        </PreferencesProvider>

        {/* Performance Budget Monitoring */}
        <Script
          id="performance-budget"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              // Monitor bundle size and loading performance
              window.addEventListener('load', function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                  const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                  const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.fetchStart;
                  
                  // Alert if performance budget is exceeded
                  if (loadTime > 3000) { // 3 second budget
                    console.warn('Performance Budget Exceeded:', {
                      loadTime: Math.round(loadTime),
                      domContentLoaded: Math.round(domContentLoaded),
                      budget: 3000
                    });
                  }
                  
                  // Track bundle sizes
                  const jsResources = performance.getEntriesByType('resource')
                    .filter(entry => entry.name.includes('.js'))
                    .reduce((total, entry) => total + (entry.transferSize || 0), 0);
                    
                  if (jsResources > 250000) { // 250KB budget for JS
                    console.warn('JavaScript Bundle Budget Exceeded:', {
                      actualSize: Math.round(jsResources / 1024),
                      budget: 244 // KB
                    });
                  }
                }
              });
            `
          }}
        />
      </body>
    </html>
  );
}
