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
