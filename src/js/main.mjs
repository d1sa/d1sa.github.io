import './header.mjs';
import './forms.mjs';
import './pricing.js';
import './slider.js';
import './glightbox.js';

function initializeApp() {}

document.addEventListener('DOMContentLoaded', initializeApp);

window.addEventListener('error', function (event) {
  console.error('JavaScript error:', event.error);
});

window.addEventListener('unhandledrejection', function (event) {
  console.error('Unhandled promise rejection:', event.reason);
});
