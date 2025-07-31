document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.pricing-tabs .tab');
  const carouselContainers = document.querySelectorAll(
    '.pricing-carousel-container'
  );

  console.log('tabs');
  console.log(tabs);
  console.log(carouselContainers);

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
