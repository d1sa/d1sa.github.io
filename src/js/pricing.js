// ==========================================================================
// Pricing Section JavaScript
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
  // Responsive breakpoints for carousel
  const BREAKPOINTS = {
    MOBILE: 576,
    TABLET: 768,
    DESKTOP: 992,
  };

  // Tab functionality
  const tabs = document.querySelectorAll('.pricing-tabs .tab');
  const pricingCards = document.getElementById('pricingCards');

  // Carousel functionality
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentSlide = 0;
  let slidesToShow = 4; // Number of cards visible at once (responsive)
  let totalSlides = 0; // Will be set dynamically based on visible cards
  let maxSlide = 0;

  // Function to show/hide cards based on selected tab
  function switchTab(tabType) {
    // Hide all cards
    const allCards = document.querySelectorAll('.pricing-card');
    allCards.forEach(card => {
      card.style.display = 'none';
    });

    // Show cards for selected tab
    const tabCards = document.querySelectorAll(
      `.pricing-card[data-tab="${tabType}"]`
    );
    tabCards.forEach(card => {
      card.style.display = 'flex';
    });

    // Update total slides count based on visible cards
    totalSlides = tabCards.length;
    maxSlide = Math.max(0, totalSlides - slidesToShow);

    // Reset carousel position
    currentSlide = 0;
    updateCarousel();
  }

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));

      // Add active class to clicked tab
      this.classList.add('active');

      // Get the tab type and switch
      const tabType = this.getAttribute('data-tab');
      switchTab(tabType);
    });
  });

  // Helper function to get gap from CSS
  function getCarouselGap() {
    const firstCard = pricingCards.querySelector(
      '.pricing-card[style*="flex"], .pricing-card:not([style*="none"])'
    );
    if (!firstCard) return 24; // fallback

    const containerStyles = getComputedStyle(pricingCards);
    return parseInt(containerStyles.gap) || 24;
  }

  // Helper function to calculate how many slides actually fit
  function calculateActualSlidesToShow() {
    const firstCard = pricingCards.querySelector(
      '.pricing-card[style*="flex"], .pricing-card:not([style*="none"])'
    );
    if (!firstCard || totalSlides === 0)
      return Math.min(slidesToShow, totalSlides);

    const cardWidth = firstCard.offsetWidth;
    const gap = getCarouselGap();
    const carouselWidth = pricingCards.parentElement.offsetWidth;

    // Calculate how many full cards fit
    let actualSlides = 1;
    let totalWidth = cardWidth;

    while (
      actualSlides < totalSlides &&
      totalWidth + gap + cardWidth <= carouselWidth
    ) {
      totalWidth += gap + cardWidth;
      actualSlides++;
    }

    return Math.min(actualSlides, totalSlides);
  }

  // Carousel navigation
  function updateCarousel() {
    const firstCard = pricingCards.querySelector(
      '.pricing-card[style*="flex"], .pricing-card:not([style*="none"])'
    );
    if (!firstCard) return;

    // Use actual slides that fit instead of configured value
    const actualSlidesToShow = calculateActualSlidesToShow();
    const actualMaxSlide = Math.max(0, totalSlides - actualSlidesToShow);

    const cardWidth = firstCard.offsetWidth;
    const gap = getCarouselGap();

    // Ensure currentSlide doesn't exceed the actual max
    if (currentSlide > actualMaxSlide) {
      currentSlide = actualMaxSlide;
    }

    const translateX = currentSlide * (cardWidth + gap);
    pricingCards.style.transform = `translateX(-${translateX}px)`;

    // Update button states using actual max slide
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide >= actualMaxSlide;
  }

  // Unified carousel navigation function
  function navigateCarousel(direction) {
    const actualSlidesToShow = calculateActualSlidesToShow();
    const actualMaxSlide = Math.max(0, totalSlides - actualSlidesToShow);

    const newSlide = currentSlide + direction;
    if (newSlide >= 0 && newSlide <= actualMaxSlide) {
      currentSlide = newSlide;
      updateCarousel();
    }
  }

  prevBtn.addEventListener('click', () => navigateCarousel(-1));
  nextBtn.addEventListener('click', () => navigateCarousel(1));

  // Touch/swipe functionality for mobile
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  pricingCards.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  });

  pricingCards.addEventListener('touchmove', function (e) {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);

    // Prevent default only if horizontal movement is greater than vertical
    // This allows vertical scrolling while enabling horizontal swiping
    if (diffX > diffY && diffX > 10) {
      e.preventDefault();
    }
  });

  pricingCards.addEventListener('touchend', function (e) {
    if (!isDragging) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      const actualSlidesToShow = calculateActualSlidesToShow();
      const actualMaxSlide = Math.max(0, totalSlides - actualSlidesToShow);

      if (diff > 0 && currentSlide < actualMaxSlide) {
        // Swipe left - next slide
        currentSlide++;
        updateCarousel();
      } else if (diff < 0 && currentSlide > 0) {
        // Swipe right - previous slide
        currentSlide--;
        updateCarousel();
      }
    }

    isDragging = false;
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    const actualSlidesToShow = calculateActualSlidesToShow();
    const actualMaxSlide = Math.max(0, totalSlides - actualSlidesToShow);

    if (e.key === 'ArrowLeft' && currentSlide > 0) {
      currentSlide--;
      updateCarousel();
    } else if (e.key === 'ArrowRight' && currentSlide < actualMaxSlide) {
      currentSlide++;
      updateCarousel();
    }
  });

  // Responsive handling
  function handleResize() {
    const width = window.innerWidth;

    // Calculate slides to show based on screen width
    const slidesConfig = [
      { maxWidth: BREAKPOINTS.MOBILE, slides: 1 },
      { maxWidth: BREAKPOINTS.TABLET, slides: 2 },
      { maxWidth: BREAKPOINTS.DESKTOP, slides: 3 },
      { maxWidth: Infinity, slides: 4 },
    ];

    const newSlidesToShow = slidesConfig.find(
      config => width < config.maxWidth
    ).slides;

    if (newSlidesToShow !== slidesToShow) {
      // Update configured slides to show
      slidesToShow = newSlidesToShow;
      maxSlide = Math.max(0, totalSlides - slidesToShow);

      // Reset carousel position and update
      currentSlide = 0;
      updateCarousel();
    } else {
      // Even if slidesToShow didn't change, we should recalculate on resize
      updateCarousel();
    }
  }

  window.addEventListener('resize', handleResize);

  // Initialize responsive layout
  handleResize();

  // Initialize with default tab (WHS - matches active tab in HTML)
  switchTab('whs');

  // Initialize carousel
  updateCarousel();
});
