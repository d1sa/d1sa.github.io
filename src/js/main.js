// ==========================================================================
// Main JavaScript Entry Point
// ==========================================================================

/**
 * Single entry point for all JavaScript functionality
 * All modules are imported here to maintain clean dependency management
 */

// Core functionality modules
import './header.js'; // Header height compensation and navigation
import './forms.js'; // Complete forms management system (replaces modal-form + utils)
// import './pricing.js'; // Pricing carousel and tabs
import './slider.js'; // Swiper slider

// ==========================================================================
// Global App Initialization
// ==========================================================================

/**
 * Main application initialization
 * Runs after all modules are loaded
 */
function initializeApp() {
  console.log('🚀 App initialized successfully');

  // Performance timing
  const loadTime = performance.now();
  console.log(`⚡ JS modules loaded in ${loadTime.toFixed(2)}ms`);

  // Add any global initialization logic here
  // For example: analytics, global event listeners, etc.

  // Global smooth scroll for anchor links
  initializeSmoothScroll();
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// ==========================================================================
// Global Error Handling
// ==========================================================================

window.addEventListener('error', function (event) {
  console.error('JavaScript error:', event.error);

  // In production, you might want to send this to your error tracking service
  // Example: errorTracker.captureException(event.error);
});

window.addEventListener('unhandledrejection', function (event) {
  console.error('Unhandled promise rejection:', event.reason);
});

// ==========================================================================
// Performance Monitoring (Development)
// ==========================================================================

if (process.env.NODE_ENV !== 'production') {
  console.log('📊 Development mode - performance monitoring enabled');

  // Log performance metrics
  window.addEventListener('load', function () {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('📈 Performance metrics:', {
      'DOM Content Loaded':
        perfData.domContentLoadedEventEnd -
        perfData.domContentLoadedEventStart +
        'ms',
      'Load Complete': perfData.loadEventEnd - perfData.loadEventStart + 'ms',
      'Total Load Time': perfData.loadEventEnd - perfData.fetchStart + 'ms',
    });
  });
}

// ==========================================================================
// Export main app for external access if needed
// ==========================================================================

window.OknaApp = {
  version: '1.0.0',
  initialized: false,
  modules: ['header', 'forms', 'pricing'],
};
