document.addEventListener('DOMContentLoaded', function () {
  let swiperPricing1 = new Swiper('.swiper-section-pricing-1', {
    slidesPerView: 4,
    spaceBetween: 24,
    navigation: {
      nextEl: '.swiper-button-next-1',
      prevEl: '.swiper-button-prev-1',
    },
    breakpoints: {
      390: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
  });

  let swiperPricing2 = new Swiper('.swiper-section-pricing-2', {
    slidesPerView: 4,
    spaceBetween: 24,
    navigation: {
      nextEl: '.swiper-button-next-2',
      prevEl: '.swiper-button-prev-2',
    },
    breakpoints: {
      390: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
  });
  let swiperPricing3 = new Swiper('.swiper-section-pricing-3', {
    slidesPerView: 4,
    spaceBetween: 24,
    navigation: {
      nextEl: '.swiper-button-next-3',
      prevEl: '.swiper-button-prev-3',
    },
    breakpoints: {
      390: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
  });
});
