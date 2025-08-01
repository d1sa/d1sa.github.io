document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.pricing-tabs .tab');
  const carouselContainers = document.querySelectorAll(
    '.pricing-carousel-container'
  );

  function switchTab(tabType) {
    carouselContainers.forEach(container => {
      container.style.display = 'none';
    });

    const targetContainer = document.querySelector(
      `.pricing-carousel-container[data-tab="${tabType}"]`
    );
    if (targetContainer) {
      targetContainer.style.display = 'block';
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));

      this.classList.add('active');

      const tabType = this.getAttribute('data-tab');
      console.log(tabType);
      switchTab(tabType);
    });
  });

  switchTab('whs');
});

function debounce(func, delay) {
  let timeout;

  return function (...args) {
    const context = this;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

document.fonts.addEventListener('loadingdone', function () {
  const profileComparison = document.querySelector('.profile-comparison');
  const titles = profileComparison.querySelectorAll('.card-title');
  const headers = profileComparison.querySelectorAll('.card-header');

  function getMaxHeight() {
    let maxHeight = 0;

    titles.forEach(title => {
      maxHeight = Math.max(maxHeight, title.offsetHeight);
    });

    return maxHeight;
  }

  const maxHeight = getMaxHeight();
  headers.forEach(h => {
    h.style.minHeight = `${maxHeight}px`;
  });

  window.addEventListener('resize', () => {
    const maxHeight = getMaxHeight();
    headers.forEach(h => {
      h.style.minHeight = `${maxHeight}px`;
    });
  });
});
