// ==========================================================================
// Lead Form Functionality
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
  const leadForm = document.getElementById('leadForm');
  const phoneInput = document.getElementById('phoneInput');
  const successMessage = document.getElementById('successMessage');

  // Phone input formatting
  phoneInput.addEventListener('input', function (e) {
    let value = e.target.value;

    // Remove all non-digit characters except +
    value = value.replace(/[^\d+]/g, '');

    // Ensure it starts with +7
    if (!value.startsWith('+7')) {
      value = '+7';
    }

    // Format the phone number
    if (value.length > 2) {
      const phoneNumber = value.slice(2); // Remove +7
      let formatted = '+7';

      if (phoneNumber.length > 0) {
        formatted += ' (' + phoneNumber.slice(0, 3);
      }
      if (phoneNumber.length > 3) {
        formatted += ') ' + phoneNumber.slice(3, 6);
      }
      if (phoneNumber.length > 6) {
        formatted += '-' + phoneNumber.slice(6, 8);
      }
      if (phoneNumber.length > 8) {
        formatted += '-' + phoneNumber.slice(8, 10);
      }

      // Limit to 10 digits after +7
      if (phoneNumber.length <= 10) {
        value = formatted;
      } else {
        value = e.target.value; // Keep previous value if too long
      }
    }

    e.target.value = value;
  });

  // Form submission
  leadForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const phoneValue = phoneInput.value;

    // Basic validation - check for proper phone format
    const phoneDigits = phoneValue.replace(/[^\d]/g, '');
    if (phoneDigits.length < 11 || !phoneValue.startsWith('+7')) {
      phoneInput.style.borderColor = '#ff4444';
      phoneInput.style.background = '#ffebeb';

      // Reset error styling after 3 seconds
      setTimeout(() => {
        phoneInput.style.borderColor = '';
        phoneInput.style.background = '#e8edf4';
      }, 3000);

      alert('Пожалуйста, введите корректный номер телефона (+7 и 10 цифр)');
      return;
    }

    // Simulate form submission
    const submitBtn = leadForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate API call delay
    setTimeout(() => {
      // Hide form and show success message
      leadForm.style.display = 'none';
      successMessage.style.display = 'flex';

      // Reset button state (in case user wants to submit again)
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';

      // Optional: Reset form after showing success
      setTimeout(() => {
        leadForm.reset();
        phoneInput.value = '+7';
      }, 100);
    }, 1500); // 1.5 second delay to simulate network request
  });

  // Initialize phone input with +7
  if (phoneInput.value === '' || phoneInput.value === '+7') {
    phoneInput.value = '+7';
  }
});

// ==========================================================================
// Review Lead Form Functionality
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
  const reviewLeadForm = document.getElementById('reviewLeadForm');
  const reviewNameInput = document.getElementById('reviewNameInput');
  const reviewPhoneInput = document.getElementById('reviewPhoneInput');
  const reviewSuccessMessage = document.getElementById('reviewSuccessMessage');

  // Check if elements exist before adding event listeners
  if (
    !reviewLeadForm ||
    !reviewNameInput ||
    !reviewPhoneInput ||
    !reviewSuccessMessage
  ) {
    return; // Exit if form elements don't exist
  }

  // Phone input formatting for review form
  reviewPhoneInput.addEventListener('input', function (e) {
    let value = e.target.value;

    // Remove all non-digit characters except +
    value = value.replace(/[^\d+]/g, '');

    // Ensure it starts with +7
    if (!value.startsWith('+7')) {
      value = '+7';
    }

    // Format the phone number
    if (value.length > 2) {
      const phoneNumber = value.slice(2); // Remove +7
      let formatted = '+7';

      if (phoneNumber.length > 0) {
        formatted += ' (' + phoneNumber.slice(0, 3);
      }
      if (phoneNumber.length > 3) {
        formatted += ') ' + phoneNumber.slice(3, 6);
      }
      if (phoneNumber.length > 6) {
        formatted += '-' + phoneNumber.slice(6, 8);
      }
      if (phoneNumber.length > 8) {
        formatted += '-' + phoneNumber.slice(8, 10);
      }

      // Limit to 10 digits after +7
      if (phoneNumber.length <= 10) {
        value = formatted;
      } else {
        value = e.target.value; // Keep previous value if too long
      }
    }

    e.target.value = value;
  });

  // Form submission for review form
  reviewLeadForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameValue = reviewNameInput.value.trim();
    const phoneValue = reviewPhoneInput.value;

    // Validation
    let hasErrors = false;

    // Name validation
    if (nameValue.length < 2) {
      reviewNameInput.classList.add('error');
      hasErrors = true;
    } else {
      reviewNameInput.classList.remove('error');
    }

    // Phone validation
    const phoneDigits = phoneValue.replace(/[^\d]/g, '');
    if (phoneDigits.length < 11 || !phoneValue.startsWith('+7')) {
      reviewPhoneInput.classList.add('error');
      hasErrors = true;
    } else {
      reviewPhoneInput.classList.remove('error');
    }

    if (hasErrors) {
      // Reset error styling after 3 seconds
      setTimeout(() => {
        reviewNameInput.classList.remove('error');
        reviewPhoneInput.classList.remove('error');
      }, 3000);

      alert('Пожалуйста, заполните все поля корректно');
      return;
    }

    // Simulate form submission
    const submitBtn = reviewLeadForm.querySelector('.submit-button');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
      // Hide form and show success message
      reviewLeadForm.style.display = 'none';
      reviewSuccessMessage.style.display = 'flex';

      // Reset button state (in case user wants to submit again)
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      // Optional: Reset form after showing success
      setTimeout(() => {
        reviewLeadForm.reset();
        reviewPhoneInput.value = '+7';
      }, 100);
    }, 1500); // 1.5 second delay to simulate network request
  });

  // Initialize phone input with +7
  if (reviewPhoneInput.value === '' || reviewPhoneInput.value === '+7') {
    reviewPhoneInput.value = '+7';
  }
});
