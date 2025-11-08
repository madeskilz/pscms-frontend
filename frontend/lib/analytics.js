/**
 * Performance monitoring utilities for production
 */

export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === 'production') {
    // Log to console in development
    console.log(metric);

    // Send to analytics in production
    const { id, name, value, label } = metric;
    
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, {
        event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js Metric',
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        event_label: id,
        non_interaction: true,
      });
    }

    // Example: Send to custom analytics endpoint
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: name,
          value,
          id,
          label,
          timestamp: Date.now(),
        }),
      }).catch(console.error);
    }
  }
}

/**
 * Log performance marks for custom measurements
 */
export function markPerformance(name) {
  if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
    window.performance.mark(name);
  }
}

/**
 * Measure performance between two marks
 */
export function measurePerformance(name, startMark, endMark) {
  if (typeof window !== 'undefined' && window.performance && window.performance.measure) {
    try {
      window.performance.measure(name, startMark, endMark);
      const measure = window.performance.getEntriesByName(name)[0];
      console.log(`${name}: ${measure.duration}ms`);
      return measure.duration;
    } catch (error) {
      console.error('Performance measurement error:', error);
    }
  }
}
