// ==========================================================================
// Header Height Compensation
// ==========================================================================

/**
 * Компенсирует высоту фиксированного хедера
 * Добавляет padding-top к body равный высоте .header
 */

document.addEventListener('DOMContentLoaded', function () {
  function updateBodyPadding() {
    const header = document.querySelector('.header');
    if (header) {
      const headerHeight = Math.round(header.offsetHeight);
      if (headerHeight > 0) {
        document.body.style.paddingTop = headerHeight + 'px';
      }
    }
  }

  // Применяем при загрузке
  updateBodyPadding();

  // Debounce для resize
  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateBodyPadding, 100);
  });

  // Обработка изменения ориентации
  window.addEventListener('orientationchange', function () {
    setTimeout(updateBodyPadding, 200);
  });
});

// ==========================================================================
// Mobile Menu Functionality
// ==========================================================================

/**
 * Управление мобильным меню
 */
document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.header');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileMenuToggle || !header) return;

  // Открытие/закрытие мобильного меню
  function toggleMobileMenu() {
    const isOpen = header.classList.contains('mobile-menu-open');

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // Открытие мобильного меню
  function openMobileMenu() {
    header.classList.add('mobile-menu-open');
    document.body.style.overflow = 'hidden';
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    mobileMenuToggle.setAttribute('aria-label', 'Закрыть меню');

    // Фокус на первую ссылку в меню
    const firstNavLink = document.querySelector('.nav-link');
    if (firstNavLink) {
      setTimeout(() => firstNavLink.focus(), 300);
    }
  }

  // Закрытие мобильного меню
  function closeMobileMenu() {
    header.classList.remove('mobile-menu-open');
    document.body.style.overflow = '';
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', 'Открыть меню');

    // Возвращаем фокус на кнопку меню
    mobileMenuToggle.focus();
  }

  // Обработчик клика по кнопке гамбургера
  mobileMenuToggle.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Обработчик клика по оверлею
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', function () {
      closeMobileMenu();
    });
  }

  // Закрытие меню при клике на ссылки навигации
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      // Небольшая задержка для плавности
      setTimeout(() => {
        closeMobileMenu();
      }, 150);
    });
  });

  // Закрытие меню при нажатии Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('mobile-menu-open')) {
      closeMobileMenu();
    }
  });

  // Закрытие меню при изменении размера экрана
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
      // tablet breakpoint
      closeMobileMenu();
    }
  });

  // Обработка фокуса для доступности
  function trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // Применяем trap focus к мобильному меню
  const navWrapper = document.querySelector('.nav-and-actions-wrapper');
  if (navWrapper) {
    trapFocus(navWrapper);
  }
});
