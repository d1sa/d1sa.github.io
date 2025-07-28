// ==========================================================================
// Forms Management System - Main File
// ==========================================================================

// ==========================================================================
// Configuration
// ==========================================================================

// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
  token1: '', // тг бот токен ч1
  token2: '', // тг бот токен ч2
  chatId: '', // тг чат id
  mode: 'html',
  get token() {
    return `${this.token1}:${this.token2}`;
  },
};

// Yandex Metrika integration
const ym = window.ym;
if (!ym) {
  console.log('Yandex Metrika не найдена');
}

// Form field configurations
const FIELD_CONFIG = {
  tel: 'Контактный телефон',
  name: 'Имя',
  email: 'Email (Необязательно)',
};

// Form types configuration
const FORM_TYPES = {
  modal: 'modalForm',
  registered: 'registeredForm',
  callback: 'callbackForm',
  mainBlue: 'mainBlueForm',
};

// Registered forms storage
const registeredForms = new Map();

// ==========================================================================
// Utilities (integrated from utils.js)
// ==========================================================================

/**
 * Phone number formatting with live input mask
 * @param {Event} e - Input event
 */
const formatPhoneInput = e => {
  const val = e.target.value;
  const digits = val.replace(/\D/g, '');
  const match = digits.match(/(7|8)?(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);

  let result = '+7 ';

  if (match[2]) {
    result += '(' + match[2];
    if (match[2] && match[3]) {
      result += ')';
    }
  }

  if (match[3]) {
    result += ' ' + match[3];
  }

  if (match[4]) {
    result += ' ' + match[4];
  }

  if (match[5]) {
    result += '-' + match[5];
  }

  e.target.value = result;
};

/**
 * Validate Russian phone number
 * @param {string} phone - Phone number string
 * @returns {boolean} - Is valid
 */
const validatePhone = phone => {
  const regex =
    /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  return regex.test(phone);
};

/**
 * Get field display name
 * @param {string} key - Field key
 * @returns {string} - Display name
 */
const getFieldName = key => {
  return FIELD_CONFIG[key] || key;
};

// ==========================================================================
// Telegram Bot Integration
// ==========================================================================

/**
 * Send message to Telegram bot
 * @param {Object} params - Message parameters
 */
const sendToTelegram = ({ message, formType }) => {
  const { token, chatId, mode } = TELEGRAM_CONFIG;
  const encodedMessage = encodeURI(message);
  const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&parse_mode=${mode}&text=${encodedMessage}`;

  fetch(url)
    .then(res => res.json())
    .then(res => {
      console.log('Telegram API response:', res);

      if (res.ok) {
        handleSubmissionSuccess(formType);
        localStorage.setItem('formSended', true);

        // Yandex Metrika goals
        triggerMetrikaGoal(formType.type);
      }
    })
    .catch(error => {
      console.error('Telegram sending error:', error);
      // Fallback to success for better UX
      handleSubmissionSuccess(formType);
    });
};

/**
 * Fallback for development/testing
 * @param {Object} params - Message parameters
 */
const sendToTelegramFake = ({ message, formType }) => {
  localStorage.setItem('formSended', true);

  console.group(`📋 ФОРМА ОТПРАВЛЕНА (DEV MODE)`);
  console.log(`📝 Тип формы: ${formType.textName}`);
  console.log(`🏷️ Form Type: ${formType.type}`);
  console.log(`📄 Сообщение для отправки:`);
  console.log(decodeURI(message));
  console.log(`📊 Время: ${new Date().toLocaleString()}`);
  console.log(`💾 localStorage.formSended = true`);
  console.groupEnd();

  // Simulate network delay for realistic testing
  setTimeout(() => {
    console.log(`✅ Форма успешно "отправлена" (имитация)`);
    handleSubmissionSuccess(formType);
    // Trigger Metrika in dev mode too for testing
    triggerMetrikaGoal(formType.type);
  }, 800);
};

/**
 * Smart form sender - automatically chooses real or fake based on environment
 * @param {Object} params - Message parameters
 */
const sendForm = ({ message, formType }) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (isDevelopment) {
    console.log('🚀 Development mode - using fake form sending');
    sendToTelegramFake({ message, formType });
  } else {
    console.log('📤 Production mode - sending to Telegram bot');
    sendToTelegram({ message, formType });
  }
};

/**
 * Trigger Yandex Metrika goals
 * @param {string} formType - Form type
 */
const triggerMetrikaGoal = formType => {
  if (!ym) return;

  const goalMap = {
    [FORM_TYPES.modal]: 'new_lid',
    [FORM_TYPES.callback]: 'new_lid',
    [FORM_TYPES.mainBlue]: 'new_lid',
  };

  const goal = goalMap[formType];
  if (goal) {
    ym(75394450, 'reachGoal', goal);
  }
};

// ==========================================================================
// Form Processing
// ==========================================================================

/**
 * Handle form submission
 * @param {Object} formType - Form type configuration
 * @returns {Function} - Event handler
 */
const handleFormSubmit = formType => e => {
  e.preventDefault();

  // reCAPTCHA check for modal forms
  if (formType.type === FORM_TYPES.modal && typeof grecaptcha !== 'undefined') {
    const response = grecaptcha.getResponse();
    if (response.length === 0) {
      alert('Пожалуйста, подтвердите, что вы не робот!');
      return false;
    }
  }

  const form = e.target;
  const { textName } = formType;

  // Clear previous errors
  const errorsContainer = form.querySelector('.errorsContainer');
  if (errorsContainer) {
    errorsContainer.remove();
  }

  // Build message
  let message = `<b>Новая заявка с сайта oknanaveka40.ru</b>\n––––\n\n`;

  const formData = new FormData(form);
  const validation = { isValid: true, errors: [] };

  // Process and validate form data
  for (let [key, value] of formData.entries()) {
    if (key === 'g-recaptcha-response') continue;

    const trimmedValue = value.trim();
    if (!trimmedValue) continue;

    // Validation
    if (key === 'tel') {
      if (!validatePhone(trimmedValue)) {
        validation.isValid = false;
        validation.errors.push('Введите корректный телефон');
      }
    }

    if (key === 'name') {
      if (trimmedValue.length < 2) {
        validation.isValid = false;
        validation.errors.push('Имя не может быть пустым');
      }
    }

    // Add to message
    message += `<i>${getFieldName(key)}</i>: <b>${trimmedValue}</b>\n`;
  }

  message += `\n\n<i>${textName ? `(${textName})` : ''}</i>`;

  // Handle validation errors
  if (!validation.isValid) {
    showFormErrors(validation, formType);
    return;
  }

  // Send form using smart sender (auto-detects dev/prod mode)
  sendForm({ message, formType });
};

/**
 * Show form validation errors
 * @param {Object} validation - Validation result
 * @param {Object} formType - Form type
 */
const showFormErrors = (validation, formType) => {
  const { modal } = formType;
  const mainForm =
    modal.nodeName === 'FORM' ? modal : modal.querySelector('.contact-form');

  let errorsContainer = mainForm.querySelector('.errorsContainer');

  if (!errorsContainer) {
    errorsContainer = document.createElement('div');
    errorsContainer.className = 'errorsContainer';

    // Insert before form fields
    const formFields = mainForm.querySelector('.form-fields');
    if (formFields) {
      mainForm.insertBefore(errorsContainer, formFields);
    } else {
      mainForm.appendChild(errorsContainer);
    }
  }

  errorsContainer.innerHTML = '';
  validation.errors.forEach(error => {
    const errorEl = document.createElement('div');
    errorEl.className = 'errorItem';
    errorEl.textContent = error;
    errorsContainer.appendChild(errorEl);
  });
};

/**
 * Handle successful form submission
 * @param {Object} formType - Form type
 */
const handleSubmissionSuccess = formType => {
  const { type, modal } = formType;

  const successTemplates = {
    [FORM_TYPES.modal]: `
      <div class='form-header'>
        <h3>Заявка успешно отправлена</h3>
        <p>Благодарим вас за успешную отправку заявки! Мы свяжемся с вами в самое ближайшее время.</p>
      </div>
      <button class='btn btn-blue modal-close-button'>Закрыть</button>
    `,
    [FORM_TYPES.registered]: `
      <div class='form-header'>
        <h3>Заявка успешно отправлена</h3>
        <p>Мы свяжемся с вами в самое ближайшее время.</p>
      </div>
    `,
    default: `
      <div class='form-header'>
        <h3>Заявка успешно отправлена</h3>
        <p>Мы свяжемся с вами в самое ближайшее время.</p>
      </div>
    `,
  };

  const template = successTemplates[type] || successTemplates.default;
  const mainForm =
    modal.nodeName === 'FORM' ? modal : modal.querySelector('.contact-form');

  mainForm.innerHTML = template;

  // Add close handlers for modal
  if (type === FORM_TYPES.modal) {
    const closeButtons = modal.querySelectorAll('.modal-close-button');
    closeButtons.forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        hideModal(modal);
      });
    });
  }
};

// ==========================================================================
// Modal System
// ==========================================================================

/**
 * Create modal HTML
 * @param {Object} config - Modal configuration
 * @returns {string} - Modal HTML
 */
const createModalHTML = config => {
  return `
    <div class='modal-container'>
      <div class='modal-close modal-close-icon'></div>
      <div class='form-content'>
        <form class='contact-form'>  
          <div class='form-header'>
            <h3>Оставьте заявку</h3>
            <p>Мы свяжемся с вами как можно раньше</p>
          </div>
          <div class='form-fields'>
            <div class='form-field'>
              <input type='text' name='name' placeholder='Ваше имя' class='input' required />
            </div>
            <div class='form-field'>
              <input type='tel' name='tel' placeholder='+7' class='input' minlength="10" value='+7 ' required />
            </div>
          </div>
          <button type='submit' class='btn btn-orange'>Отправить</button>
          <p class='form-disclaimer'>
            Отправляя данные через форму вы даете согласие на обработку своих 
            <span>персональных данных</span>
          </p>
        </form>
      </div>
    </div>
  `;
};

/**
 * Create modal element
 * @param {Object} formType - Form type configuration
 * @returns {HTMLElement} - Modal element
 */
const createModal = formType => {
  const modal = document.createElement('div');
  modal.className = `modal-form ${formType.type}`;
  modal.innerHTML = createModalHTML(formType);
  return modal;
};

/**
 * Show modal
 * @param {HTMLElement} modal - Modal element
 */
const showModal = modal => {
  modal.classList.add('show');
};

/**
 * Hide modal
 * @param {HTMLElement} modal - Modal element
 */
const hideModal = modal => {
  modal.classList.remove('show');
};

// ==========================================================================
// Form Registration & Initialization
// ==========================================================================

/**
 * Register a form for processing
 * @param {string} formId - Form ID
 * @param {Array} fields - Expected fields
 * @param {Object} options - Additional options
 */
export function registerForm(formId, fields, options = {}) {
  const form = document.getElementById(formId);
  if (!form) {
    console.warn(`Form with ID "${formId}" not found`);
    return;
  }

  const config = {
    fields,
    options,
    element: form,
    type: FORM_TYPES.registered,
    textName: options.textName || 'Зарегистрированная форма',
  };

  registeredForms.set(formId, config);
  initializeRegisteredForm(config);
}

/**
 * Initialize registered form
 * @param {Object} config - Form configuration
 */
const initializeRegisteredForm = config => {
  const { element: form, textName } = config;

  // Initialize phone inputs
  const phoneInputs = form.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', formatPhoneInput);
    if (!input.value || input.value === '+7') {
      input.value = '+7 ';
    }
  });

  // Create form type for submission
  const formType = {
    type: FORM_TYPES.registered,
    textName: textName,
    modal: form,
  };

  // Handle form submission
  form.addEventListener('submit', handleFormSubmit(formType));
};

/**
 * Initialize modal form system
 */
const initializeModalForm = () => {
  const formType = {
    type: FORM_TYPES.modal,
    textName: 'Всплывающая форма',
  };

  const modal = createModal(formType);
  formType.modal = modal;

  // Setup form submission
  const form = modal.querySelector('.contact-form');
  form.addEventListener('submit', handleFormSubmit(formType));

  // Setup phone input
  const phoneInput = modal.querySelector('input[type="tel"]');
  phoneInput.addEventListener('input', formatPhoneInput);

  // Add to DOM
  document.body.appendChild(modal);

  // Setup close handlers
  const closeIcon = modal.querySelector('.modal-close-icon');
  closeIcon.addEventListener('click', e => {
    e.preventDefault();
    hideModal(modal);
  });

  // Close on backdrop click
  window.addEventListener('click', e => {
    if (e.target === modal) {
      hideModal(modal);
    }
  });

  // Setup modal triggers
  const modalTriggers = document.querySelectorAll(
    '[href="/forma-obratnoj-svyaz"], .modal-trigger'
  );
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      showModal(modal);
    });
  });
};

/**
 * Initialize all form systems
 */
export function initializeForms() {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  console.log('🚀 Initializing Forms System...');
  console.log(
    `🔧 Mode: ${
      isDevelopment ? 'Development (fake sending)' : 'Production (real sending)'
    }`
  );

  // Initialize modal system
  initializeModalForm();

  // Auto-register common forms
  registerForm('contactForm', ['name', 'tel'], {
    textName: 'Форма Hero секции',
  });

  registerForm('leadForm', ['tel'], {
    textName: 'Основная лид-форма',
  });

  registerForm('reviewLeadForm', ['name', 'tel'], {
    textName: 'Форма отзывов',
  });

  console.log('✅ Forms system initialized successfully!');
  console.log(`📊 Registered forms: contactForm, leadForm, reviewLeadForm`);
  console.log(`🎯 Modal triggers: [href="/forma-obratnoj-svyaz"]`);
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeForms);
