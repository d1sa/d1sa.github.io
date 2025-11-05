// ==========================================================================
// Toast Notification Component
// ==========================================================================

/**
 * Create toast notification container if it doesn't exist
 */
const createToastContainer = () => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
};

/**
 * Create individual toast element
 * @param {string} message - Error message
 * @param {string} type - Toast type (error, success, info)
 * @param {number} duration - Duration in milliseconds
 * @returns {HTMLElement} - Toast element
 */
const createToast = (message, type = 'error', duration = 12000) => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const getIcon = type => {
    if (type === 'error') {
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1.5C6.15 1.5 1.5 6.15 1.5 12C1.5 17.85 6.15 22.5 12 22.5C17.85 22.5 22.5 17.85 22.5 12C22.5 6.15 17.85 1.5 12 1.5ZM16.05 17.25L12 13.2L7.95 17.25L6.75 16.05L10.8 12L6.75 7.95L7.95 6.75L12 10.8L16.05 6.75L17.25 7.95L13.2 12L17.25 16.05L16.05 17.25Z" fill="white"/>
      </svg>`;
    }
    if (type === 'success') {
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1.5C9.9233 1.5 7.89323 2.11581 6.16652 3.26957C4.4398 4.42332 3.09399 6.0632 2.29927 7.98182C1.50455 9.90045 1.29661 12.0116 1.70176 14.0484C2.1069 16.0852 3.10693 17.9562 4.57538 19.4246C6.04383 20.8931 7.91476 21.8931 9.95156 22.2982C11.9884 22.7034 14.0996 22.4955 16.0182 21.7007C17.9368 20.906 19.5767 19.5602 20.7304 17.8335C21.8842 16.1068 22.5 14.0767 22.5 12C22.5 9.21523 21.3938 6.54451 19.4246 4.57538C17.4555 2.60625 14.7848 1.5 12 1.5ZM10.5 16.1925L6.75 12.4425L7.94251 11.25L10.5 13.8075L16.0575 8.25L17.2545 9.4395L10.5 16.1925Z" fill="white"/>
      </svg>`;
    }
    return 'ℹ️'; // default for info
  };

  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-icon">
        ${getIcon(type)}
      </div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" aria-label="Закрыть уведомление">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <div class="toast-progress"></div>
  `;

  return toast;
};

/**
 * Show toast notification
 * @param {string} message - Message to show
 * @param {string} type - Toast type (error, success, info)
 * @param {number} duration - Duration in milliseconds (default: 12000)
 */
const showToast = (message, type = 'error', duration = 12000) => {
  const container = createToastContainer();
  const toast = createToast(message, type, duration);

  // Add unique ID to toast for debugging and isolation
  const toastId = `toast-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 5)}`;
  toast.dataset.toastId = toastId;

  // Add toast to container
  container.appendChild(toast);

  // Trigger animation after DOM insertion
  setTimeout(() => {
    toast.classList.add('toast-show');

    // Start progress bar animation after toast is visible
    setTimeout(() => {
      const progressBar = toast.querySelector('.toast-progress');
      if (progressBar) {
        progressBar.style.animationDuration = `${duration / 1000}s`;
        progressBar.style.animationName = 'toast-progress';
        progressBar.style.animationPlayState = 'running';
      }
    }, 50);
  }, 10);

  // Setup close button
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    hideToast(toast);
  });

  // Simple timer management - each toast has its own isolated state
  let autoHideTimeout = null;
  let isPaused = false;
  let isDestroyed = false;
  let startTime = Date.now();
  let totalPausedTime = 0; // Общее время, проведенное на паузе
  let pauseStartTime = 0; // Время начала текущей паузы

  // Function to start auto-hide timer
  const startAutoHideTimer = () => {
    if (isDestroyed || isPaused) return;

    const elapsed = Date.now() - startTime - totalPausedTime;
    const remaining = Math.max(0, duration - elapsed);

    if (remaining <= 0) {
      hideToast(toast);
      return;
    }

    // Clear any existing timeout
    if (autoHideTimeout) {
      clearTimeout(autoHideTimeout);
    }

    autoHideTimeout = setTimeout(() => {
      if (!isDestroyed && !isPaused) {
        hideToast(toast);
      }
    }, remaining);
  };

  // Function to pause toast
  const pauseToast = () => {
    if (isPaused || isDestroyed) return;

    isPaused = true;
    pauseStartTime = Date.now();

    // Pause progress bar animation
    const progressBar = toast.querySelector('.toast-progress');
    if (progressBar) {
      progressBar.style.animationPlayState = 'paused';
    }

    // Clear timer
    if (autoHideTimeout) {
      clearTimeout(autoHideTimeout);
      autoHideTimeout = null;
    }
  };

  // Function to resume toast
  const resumeToast = () => {
    if (!isPaused || isDestroyed) return;

    // Add current pause duration to total paused time
    totalPausedTime += Date.now() - pauseStartTime;
    isPaused = false;

    // Resume progress bar animation
    const progressBar = toast.querySelector('.toast-progress');
    if (progressBar) {
      progressBar.style.animationPlayState = 'running';
    }

    // Restart timer for remaining time
    startAutoHideTimer();
  };

  // Setup hover effects - isolated for this specific toast
  let isHovered = false;

  const handleMouseEnter = () => {
    if (isHovered || isDestroyed) return;
    isHovered = true;
    pauseToast();
  };

  const handleMouseLeave = () => {
    if (!isHovered || isDestroyed) return;
    isHovered = false;
    resumeToast();
  };

  // Bind events to this specific toast element
  toast.addEventListener('mouseenter', handleMouseEnter);
  toast.addEventListener('mouseleave', handleMouseLeave);

  // Cleanup function - isolated for this toast instance
  const cleanup = () => {
    isDestroyed = true;
    if (autoHideTimeout) {
      clearTimeout(autoHideTimeout);
      autoHideTimeout = null;
    }
    toast.removeEventListener('mouseenter', handleMouseEnter);
    toast.removeEventListener('mouseleave', handleMouseLeave);
  };

  // Store cleanup function
  toast._cleanup = cleanup;

  // Start initial timer
  startAutoHideTimer();

  return toast;
};

/**
 * Hide toast notification
 * @param {HTMLElement} toast - Toast element to hide
 */
const hideToast = toast => {
  if (!toast || !toast.parentNode) return;

  // Call cleanup function if it exists
  if (typeof toast._cleanup === 'function') {
    toast._cleanup();
  }

  // Clear timeout if exists
  if (toast.dataset.timeoutId) {
    clearTimeout(parseInt(toast.dataset.timeoutId));
  }

  // Add hide animation
  toast.classList.add('toast-hide');

  // Remove from DOM after animation
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300); // Match CSS transition duration
};

// Export functions for use in other modules
export { showToast, hideToast, createToast, createToastContainer };
