// ==========================================================================
// Pricing Section JavaScript
// ==========================================================================

// Import check icon with ?url to get URL string
import checkIconSrc from '../img/icon-check-white-blue-circle.svg?url';

document.addEventListener('DOMContentLoaded', function () {
  console.log('checkIconSrc imported:', checkIconSrc);

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
  const totalSlides = document.querySelectorAll('.pricing-card').length;
  let maxSlide = Math.max(0, totalSlides - slidesToShow);

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));

      // Add active class to clicked tab
      this.classList.add('active');

      // Get the tab type
      const tabType = this.getAttribute('data-tab');

      // Update card content based on tab
      updateCardContent(tabType);
    });
  });

  // Helper function to get gap from CSS
  function getCarouselGap() {
    const firstCard = pricingCards.querySelector('.pricing-card');
    if (!firstCard) return 24; // fallback

    const containerStyles = getComputedStyle(pricingCards);
    return parseInt(containerStyles.gap) || 24;
  }

  // Helper function to calculate how many slides actually fit
  function calculateActualSlidesToShow() {
    const firstCard = pricingCards.querySelector('.pricing-card');
    if (!firstCard) return slidesToShow;

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

    console.log('Actual slides calculation:', {
      carouselWidth,
      cardWidth,
      gap,
      calculatedSlides: actualSlides,
      configuredSlides: slidesToShow,
    });

    return Math.min(actualSlides, totalSlides);
  }

  // Carousel navigation
  function updateCarousel() {
    const firstCard = pricingCards.querySelector('.pricing-card');
    if (!firstCard) return;

    // Use actual slides that fit instead of configured value
    const actualSlidesToShow = calculateActualSlidesToShow();
    const actualMaxSlide = Math.max(0, totalSlides - actualSlidesToShow);

    const cardWidth = firstCard.offsetWidth;
    const gap = getCarouselGap();
    const carouselWidth = pricingCards.parentElement.offsetWidth;

    // Ensure currentSlide doesn't exceed the actual max
    if (currentSlide > actualMaxSlide) {
      currentSlide = actualMaxSlide;
    }

    // Debug info
    console.log('Carousel Debug:', {
      totalSlides,
      configuredSlidesToShow: slidesToShow,
      actualSlidesToShow,
      maxSlide,
      actualMaxSlide,
      currentSlide,
      cardWidth,
      gap,
      carouselWidth,
      expectedWidth:
        actualSlidesToShow * cardWidth + (actualSlidesToShow - 1) * gap,
    });

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

  // Pricing data for different profile types
  const contentData = {
    whs: {
      brand: 'WHS',
      profiles: [
        {
          title: 'Одностворчатое окно',
          price: 'от 4 500 ₽',
          profile: 'WHS Profile 60',
          chambers: '3 камеры, 60 мм',
          size: '600 × 1200 мм (0,72 м²)',
          features: [
            'Поворотно-откидная створка',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее стекло',
          ],
        },
        {
          title: 'Двухстворчатое окно',
          price: 'от 7 200 ₽',
          profile: 'WHS Profile 60',
          chambers: '3 камеры, 60 мм',
          size: '1300 × 1400 мм (1,82 м²)',
          features: [
            'Одна поворотно-откидная, одна глухая створка',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее стекло',
          ],
        },
        {
          title: 'Трехстворчатое окно',
          price: 'от 10 800 ₽',
          profile: 'WHS Profile 60',
          chambers: '3 камеры, 60 мм',
          size: '2100 × 1400 мм (2,94 м²)',
          features: [
            'Две поворотно-откидные, одна глухая створка',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее стекло',
          ],
        },
        {
          title: 'Балконный блок',
          price: 'от 12 500 ₽',
          profile: 'WHS Profile 60',
          chambers: '3 камеры, 60 мм',
          size: '2100 × 2100 мм (4,41 м²)',
          features: [
            'Окно + балконная дверь',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее стекло',
          ],
        },
        {
          title: 'Лоджия',
          price: 'от 12 500 ₽',
          profile: 'WHS Profile 60',
          chambers: '3 камеры, 60 мм',
          size: '3000 × 1400 мм (4,2 м²)',
          features: [
            'Панорамное остекление лоджии',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее стекло',
          ],
        },
      ],
    },
    rehau: {
      brand: 'REHAU',
      profiles: [
        {
          title: 'Одностворчатое окно',
          price: 'от 8 000 ₽',
          profile: 'REHAU Blitz',
          chambers: '3 камеры, 60 мм',
          size: '600 × 1200 мм (0,72 м²)',
          features: [
            'Поворотно-откидная створка',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее i-стекло',
          ],
        },
        {
          title: 'Двухстворчатое окно',
          price: 'от 12 700 ₽',
          profile: 'REHAU Blitz',
          chambers: '3 камеры, 60 мм',
          size: '1300 × 1400 мм (1,82 м²)',
          features: [
            'Одна поворотно-откидная, одна глухая створка',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее i-стекло',
          ],
        },
        {
          title: 'Трехстворчатое окно',
          price: 'от 18 800 ₽',
          profile: 'REHAU Blitz',
          chambers: '3 камеры, 60 мм',
          size: '2100 × 1400 мм (2,94 м²)',
          features: [
            'Две поворотно-откидные, одна глухая створка',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее i-стекло',
          ],
        },
        {
          title: 'Балконный блок',
          price: 'от 20 700 ₽',
          profile: 'REHAU Blitz',
          chambers: '3 камеры, 60 мм',
          size: '2100 × 2100 мм (4,41 м²)',
          features: [
            'Окно + балконная дверь',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее i-стекло',
          ],
        },
        {
          title: 'Лоджия',
          price: 'от 20 700 ₽',
          profile: 'REHAU Blitz',
          chambers: '3 камеры, 60 мм',
          size: '3000 × 1400 мм (4,2 м²)',
          features: [
            'Панорамное остекление лоджии',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее i-стекло',
          ],
        },
      ],
    },
    veka: {
      brand: 'VEKA',
      profiles: [
        {
          title: 'Одностворчатое окно',
          price: 'от 6 000 ₽',
          profile: 'VEKA Evroline 58',
          chambers: '3 камеры, 58 мм',
          size: '600 × 1200 мм (0,72 м²)',
          features: [
            'Поворотно-откидная створка',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее стекло',
          ],
        },
        {
          title: 'Двухстворчатое окно',
          price: 'от 9 700 ₽',
          profile: 'VEKA Evroline 58',
          chambers: '3 камеры, 58 мм',
          size: '1300 × 1400 мм (1,82 м²)',
          features: [
            'Одна поворотно-откидная, одна глухая створка',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее стекло',
          ],
        },
        {
          title: 'Трехстворчатое окно',
          price: 'от 13 800 ₽',
          profile: 'VEKA Evroline 58',
          chambers: '3 камеры, 58 мм',
          size: '2100 × 1400 мм (2,94 м²)',
          features: [
            'Две поворотно-откидные, одна глухая створка',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее стекло',
          ],
        },
        {
          title: 'Балконный блок',
          price: 'от 15 700 ₽',
          profile: 'VEKA Evroline 58',
          chambers: '3 камеры, 58 мм',
          size: '2100 × 2100 мм (4,41 м²)',
          features: [
            'Окно + балконная дверь',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее стекло',
          ],
        },
        {
          title: 'Лоджия',
          price: 'от 15 700 ₽',
          profile: 'VEKA Evroline 58',
          chambers: '3 камеры, 58 мм',
          size: '3000 × 1400 мм (4,2 м²)',
          features: [
            'Панорамное остекление лоджии',
            'Двухкамерный стеклопакет 24/32 мм',
            'Энергосберегающее стекло',
          ],
        },
      ],
    },
  };

  // Update card content based on selected tab
  function updateCardContent(tabType) {
    const cards = document.querySelectorAll('.pricing-card');
    const data = contentData[tabType];

    cards.forEach((card, index) => {
      if (data.profiles[index]) {
        const profile = data.profiles[index];

        // Update card title
        const titleElement = card.querySelector('.card-title');
        if (titleElement) {
          titleElement.textContent = profile.title;
        }

        // Update window size
        const sizeElement = card.querySelector('.size-value');
        if (sizeElement) {
          sizeElement.textContent = profile.size;
        }

        // Update price
        const priceElement = card.querySelector('.card-price');
        if (priceElement) {
          priceElement.textContent = profile.price;
        }

        // Update all features
        const featuresList = card.querySelector('.features-list');
        if (featuresList) {
          featuresList.innerHTML = '';

          // Prepare complete features array with profile info
          const allFeatures = [
            profile.features[0], // First feature (створки)
            `<span class="highlight">${profile.profile}:</span> ${profile.chambers}`, // Profile info
            ...profile.features.slice(1), // Remaining features
          ];

          // Generate feature items dynamically
          allFeatures.forEach(featureText => {
            if (featureText) {
              // Only add if feature exists
              const featureItem = document.createElement('div');
              featureItem.className = 'feature-item';
              featureItem.innerHTML = `
                <img src="/img/icon-check-white-blue-circle.svg" alt="check" class="check-icon" width="24" height="24">
                <p class="feature-text">${featureText}</p>
              `;
              featuresList.appendChild(featureItem);
            }
          });
        }
      }
    });
  }

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

  // Initialize carousel
  updateCarousel();

  // Initialize with default tab content (WHS - matches active tab)
  updateCardContent('whs');
});
