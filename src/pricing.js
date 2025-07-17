// ==========================================================================
// Pricing Section JavaScript
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
  // Tab functionality
  const tabs = document.querySelectorAll('.pricing-tabs .tab');
  const pricingCards = document.getElementById('pricingCards');

  // Carousel functionality
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentSlide = 0;
  const slidesToShow = 4; // Number of cards visible at once
  const totalSlides = document.querySelectorAll('.pricing-card').length;
  const maxSlide = Math.max(0, totalSlides - slidesToShow);

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

  // Carousel navigation
  function updateCarousel() {
    const cardWidth = 264; // Width of each card
    const gap = 24; // Gap between cards
    const translateX = currentSlide * (cardWidth + gap);

    pricingCards.style.transform = `translateX(-${translateX}px)`;

    // Update button states
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide >= maxSlide;
  }

  prevBtn.addEventListener('click', function () {
    if (currentSlide > 0) {
      currentSlide--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', function () {
    if (currentSlide < maxSlide) {
      currentSlide++;
      updateCarousel();
    }
  });

  // Update card content based on selected tab
  function updateCardContent(tabType) {
    const cards = document.querySelectorAll('.pricing-card');

    const contentData = {
      whs: {
        brand: 'WHS',
        profiles: [
          {
            title: 'Одностворчатое окно',
            price: 'от 4 500 ₽',
            profile: 'WHS Profile 60',
            chambers: '3 камеры, 60 мм',
          },
          {
            title: 'Двухстворчатое окно',
            price: 'от 7 200 ₽',
            profile: 'WHS Profile 60',
            chambers: '3 камеры, 60 мм',
          },
          {
            title: 'Трехстворчатое окно',
            price: 'от 10 800 ₽',
            profile: 'WHS Profile 60',
            chambers: '3 камеры, 60 мм',
          },
          {
            title: 'Балконный блок',
            price: 'от 12 500 ₽',
            profile: 'WHS Profile 60',
            chambers: '3 камеры, 60 мм',
          },
          {
            title: 'Лоджия',
            price: 'от 12 500 ₽',
            profile: 'WHS Profile 60',
            chambers: '3 камеры, 60 мм',
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
          },
          {
            title: 'Двухстворчатое окно',
            price: 'от 12 700 ₽',
            profile: 'REHAU Blitz',
            chambers: '3 камеры, 60 мм',
          },
          {
            title: 'Трехстворчатое окно',
            price: 'от 18 800 ₽',
            profile: 'REHAU Blitz',
            chambers: '3 камеры, 60 мм',
          },
          {
            title: 'Балконный блок',
            price: 'от 20 700 ₽',
            profile: 'REHAU Blitz',
            chambers: '3 камеры, 60 мм',
          },
          {
            title: 'Лоджия',
            price: 'от 20 700 ₽',
            profile: 'REHAU Blitz',
            chambers: '3 камеры, 60 мм',
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
          },
          {
            title: 'Двухстворчатое окно',
            price: 'от 9 700 ₽',
            profile: 'VEKA Evroline 58',
            chambers: '3 камеры, 58 м��',
          },
          {
            title: 'Трехстворчатое окно',
            price: 'от 13 800 ₽',
            profile: 'VEKA Evroline 58',
            chambers: '3 камеры, 58 мм',
          },
          {
            title: 'Балконный блок',
            price: 'от 15 700 ₽',
            profile: 'VEKA Evroline 58',
            chambers: '3 камеры, 58 мм',
          },
          {
            title: 'Лоджия',
            price: 'от 15 700 ₽',
            profile: 'VEKA Evroline 58',
            chambers: '3 камеры, 58 мм',
          },
        ],
      },
    };

    const data = contentData[tabType];

    cards.forEach((card, index) => {
      if (data.profiles[index]) {
        const profile = data.profiles[index];

        // Update card title
        const titleElement = card.querySelector('.card-title');
        if (titleElement) {
          titleElement.textContent = profile.title;
        }

        // Update price
        const priceElement = card.querySelector('.card-price');
        if (priceElement) {
          priceElement.textContent = profile.price;
        }

        // Update profile info in feature text
        const profileFeature = card.querySelector(
          '.feature-item:nth-child(2) .feature-text'
        );
        if (profileFeature) {
          profileFeature.innerHTML = `<span class="highlight">${profile.profile}:</span> ${profile.chambers}`;
        }
      }
    });
  }

  // Touch/swipe functionality for mobile
  let startX = 0;
  let isDragging = false;

  pricingCards.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  pricingCards.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    e.preventDefault();
  });

  pricingCards.addEventListener('touchend', function (e) {
    if (!isDragging) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      if (diff > 0 && currentSlide < maxSlide) {
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
    if (e.key === 'ArrowLeft' && currentSlide > 0) {
      currentSlide--;
      updateCarousel();
    } else if (e.key === 'ArrowRight' && currentSlide < maxSlide) {
      currentSlide++;
      updateCarousel();
    }
  });

  // Responsive handling
  function handleResize() {
    const width = window.innerWidth;
    let newSlidesToShow;

    if (width < 576) {
      newSlidesToShow = 1;
    } else if (width < 768) {
      newSlidesToShow = 2;
    } else if (width < 992) {
      newSlidesToShow = 3;
    } else {
      newSlidesToShow = 4;
    }

    if (newSlidesToShow !== slidesToShow) {
      // Reset carousel position when changing responsive layout
      currentSlide = 0;
      updateCarousel();
    }
  }

  window.addEventListener('resize', handleResize);

  // Initialize carousel
  updateCarousel();

  // Initialize with default tab content (VEKA)
  updateCardContent('veka');
});
