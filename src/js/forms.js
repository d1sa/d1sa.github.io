// ==========================================================================
// Forms Management System - Main File
// ==========================================================================

// Import toast functions from separate module
import { showToast, hideToast } from './toast.js';
import {
  initializeAnalytics,
  collectAnalyticsInfo,
  formatAnalyticsMessage,
  getDeviceInfo as getDeviceInfoFromAnalytics,
  getSessionInfo as getSessionInfoFromAnalytics,
  getUTMParams as getUTMParamsFromAnalytics,
  getClientIP as getClientIPFromAnalytics,
} from './analytics.js';

// ==========================================================================
// Configuration
// ==========================================================================

// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
  token1: '6163313249', // тг бот токен ч1
  token2: 'AAHN-2jghEg0TpvcxXTo_gFRn1Xhv8Xm7n4', // тг бот токен ч2
  chatId: '-4878025736', // тг чат id
  mode: 'html',
  get token() {
    return `${this.token1}:${this.token2}`;
  },
};

const CRMName = 'LeadTrackerCRM';

// Yandex Metrika integration
const ym = window.ym;
if (!ym) {
  console.log('Yandex Metrika не найдена');
}

// Form field configurations
const FIELD_CONFIG = {
  tel: 'Телефон',
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
  // Очищаем номер от всех символов кроме цифр
  const digits = phone.replace(/\D/g, '');

  // Проверяем базовый формат российского номера
  const regex =
    /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

  if (!regex.test(phone)) {
    return false;
  }

  // Извлекаем код оператора (первые 3 цифры после 7 или 8)
  let operatorCode;
  if (digits.startsWith('7') || digits.startsWith('8')) {
    operatorCode = digits.substring(1, 4);
  } else if (digits.startsWith('9')) {
    operatorCode = digits.substring(0, 3);
  } else {
    return false;
  }

  // Проверяем, что код оператора начинается с 9
  if (!operatorCode.startsWith('9')) {
    return false;
  }

  return true;
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

  console.log(`📄 Сообщение для отправки:`);
  console.log(encodedMessage);

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
  console.log(`📝 Тип формы: ${formType.formLocation}`);
  console.log(`🏷️ Form Type: ${formType.type}`);

  // Добавляем информацию о триггере для модальных форм
  if (formType.type === FORM_TYPES.modal && formType.triggerSource) {
    console.log(`🎯 Источник клика: ${formType.triggerSource}`);
    console.log(`📍 Секция: ${formType.triggerSection}`);
  }

  console.log(`📄 Сообщение для отправки:`);
  console.log(decodeURI(message));
  console.log(`📊 Время: ${new Date().toLocaleString()}`);
  console.log(`💾 localStorage.formSended = true`);
  console.groupEnd();

  document.querySelector('.partners-section p').innerHTML = decodeURI(message);

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
 * Validate form data
 * @param {FormData} formData - Form data to validate
 * @returns {Object} - Validation result {isValid, errors}
 */
const validateFormData = formData => {
  const validation = { isValid: true, errors: [] };

  for (let [key, value] of formData.entries()) {
    if (key === 'g-recaptcha-response') continue;

    const trimmedValue = value.trim();

    // Validation for required fields
    if (key === 'name') {
      if (!trimmedValue || trimmedValue.length < 2) {
        validation.isValid = false;
        validation.errors.push('Пожалуйста, укажите ваше имя');
      }
    }

    if (key === 'tel') {
      if (!trimmedValue || trimmedValue === '+7' || trimmedValue === '+7 ') {
        validation.isValid = false;
        validation.errors.push('Укажите номер телефона для связи');
      } else if (!validatePhone(trimmedValue)) {
        validation.isValid = false;
        validation.errors.push('Проверьте правильность номера телефона');
      }
    }
  }

  return validation;
};

/**
 * Build Telegram message from form data
 * @param {FormData} formData - Form data
 * @param {Object} formType - Form type configuration
 * @returns {Promise<string>} - Formatted message
 */
const buildTelegramMessage = async (formData, formType) => {
  let message = `<b>📋 Заявка с ${window.location.hostname}</b>\n`;

  // Add form fields
  for (let [key, value] of formData.entries()) {
    if (key === 'g-recaptcha-response') continue;

    const trimmedValue = value.trim();
    if (trimmedValue) {
      message += `${getFieldName(key)}: <b>${trimmedValue}</b>\n`;
    }
  }

  // Add technical information for modal forms
  message += `\n🏷️ Форма:\n<b>${
    formType.formLocation ? `${formType.formLocation}` : ''
  }</b>`;
  if (formType.type === FORM_TYPES.modal && formType.triggerSource) {
    message += `\n<i>${formType.buttonType}: "${formType.triggerSource}"</i>`;
    message += `\n<i>Секция: "${formType.triggerSection}"</i>`;
  }

  // Add analytics information (from analytics module)
  const analytics = await collectAnalyticsInfo();
  message += formatAnalyticsMessage(analytics);

  message += `\n\n<i>Информация подготовлена <b>${CRMName}</b></i>`;

  return message;
};

/**
 * Handle form submission
 * @param {Object} formType - Form type configuration
 * @returns {Function} - Event handler
 */
const handleFormSubmit = formType => async e => {
  e.preventDefault();

  // reCAPTCHA check for modal forms
  if (formType.type === FORM_TYPES.modal && typeof grecaptcha !== 'undefined') {
    const response = grecaptcha.getResponse();
    if (response.length === 0) {
      showToast('Пожалуйста, подтвердите, что вы не робот!', 'error', 8000);
      return false;
    }
  }

  const form = e.target;

  // Clear previous errors
  const errorsContainer = form.querySelector('.errorsContainer');
  if (errorsContainer) {
    errorsContainer.remove();
  }

  // Get and validate form data
  const formData = new FormData(form);
  const validation = validateFormData(formData);

  // Handle validation errors
  if (!validation.isValid) {
    showFormErrors(validation, formType);
    return;
  }

  // Build and send message
  const message = await buildTelegramMessage(formData, formType);
  sendForm({ message, formType });
};

/**
 * Show form validation errors as toast notifications
 * @param {Object} validation - Validation result
 * @param {Object} formType - Form type
 */
const showFormErrors = (validation, formType) => {
  // Create a single, comprehensive error message
  let errorMessage = '';

  if (validation.errors.length === 1) {
    // Single error - show as is
    errorMessage = validation.errors[0];
  } else {
    // Multiple errors - create a well-formatted HTML message
    const errorList = validation.errors
      .map(
        error =>
          `<div style="margin: 4px 0; padding-left: 8px;">• ${error}</div>`
      )
      .join('');
    errorMessage = `${errorList}`;
  }

  // Show single toast with all errors (longer duration for multiple errors)
  const duration = validation.errors.length > 1 ? 11000 : 6000;
  showToast(errorMessage, 'error', duration);

  // Remove old inline error containers if they exist
  const { modal } = formType;
  const mainForm =
    modal.nodeName === 'FORM' ? modal : modal.querySelector('.contact-form');
  const errorsContainer = mainForm.querySelector('.errorsContainer');
  if (errorsContainer) {
    errorsContainer.remove();
  }
};

/**
 * Handle successful form submission
 * @param {Object} formType - Form type
 */
const handleSubmissionSuccess = formType => {
  const { type, modal } = formType;

  // Show success toast notification
  showToast(
    'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
    'success',
    18000
  );

  // For modal forms, add success tag and close modal
  if (type === FORM_TYPES.modal) {
    // Add success tag immediately
    updateModalSuccessTag(modal);

    setTimeout(() => {
      hideModal(modal);
      // Reset form after closing modal
      const form = modal.querySelector('.contact-form');
      if (form) {
        form.reset();
        // Reset phone input to default value
        const phoneInput = form.querySelector('input[type="tel"]');
        if (phoneInput) {
          phoneInput.value = '+7 ';
        }
      }
    }, 1000);
  } else {
    // For registered forms, reset the form
    const mainForm =
      modal.nodeName === 'FORM' ? modal : modal.querySelector('.contact-form');
    if (mainForm) {
      mainForm.reset();
      // Reset phone input to default value
      const phoneInput = mainForm.querySelector('input[type="tel"]');
      if (phoneInput) {
        phoneInput.value = '+7 ';
      }
    }
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
              <input type='text' name='name' placeholder='Ваше имя' class='input input-solid' />
            </div>
            <div class='form-field'>
              <input type='tel' name='tel' placeholder='+7' class='input input-solid' minlength="10" value='+7 ' />
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
 * Create success tag HTML
 * @returns {string} - Success tag HTML
 */
const createSuccessTagHTML = () => {
  return `
    <div class="form-tag">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M1 5.35L4.75 9.25L11 2.75" stroke="#2BB109" stroke-width="2"></path>
      </svg>
      <span>Заявка отправлена! Мы скоро свяжемся с вами</span>
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

/**
 * Update modal content with success tag if form was sent
 * @param {HTMLElement} modal - Modal element
 */
const updateModalSuccessTag = modal => {
  const isFormSent = localStorage.getItem('formSended') === 'true';
  const formContent = modal.querySelector('.form-content .form-header');
  const existingTag = modal.querySelector('.form-tag');

  // Remove existing tag if present
  if (existingTag) {
    existingTag.remove();
  }

  // Add success tag if form was sent
  if (isFormSent && formContent) {
    const tagElement = document.createElement('div');
    tagElement.innerHTML = createSuccessTagHTML();
    const tag = tagElement.firstElementChild;

    // Insert tag at the beginning of form-content
    formContent.insertBefore(tag, formContent.firstChild);
  }
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
    formLocation: options.formLocation || 'Зарегистрированная форма',
  };

  registeredForms.set(formId, config);
  initializeRegisteredForm(config);
}

/**
 * Initialize registered form
 * @param {Object} config - Form configuration
 */
const initializeRegisteredForm = config => {
  const { element: form, formLocation } = config;

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
    formLocation: formLocation,
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
    formLocation: 'Модальная форма (всплывающая)',
    triggerSource: '', // Источник клика (кнопка)
    triggerSection: '', // Секция, из которой был клик
  };

  const modal = createModal(formType);
  formType.modal = modal;

  // Initial setup for form content
  const form = modal.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit(formType));

    // Setup phone input
    const phoneInput = modal.querySelector('input[type="tel"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', formatPhoneInput);
    }
  }

  // Add to DOM
  document.body.appendChild(modal);

  // Setup initial close handlers
  const closeIcon = modal.querySelector('.modal-close-icon');
  if (closeIcon) {
    closeIcon.addEventListener('click', e => {
      e.preventDefault();
      hideModal(modal);
    });
  }

  // Close on backdrop click
  window.addEventListener('click', e => {
    if (e.target === modal) {
      hideModal(modal);
    }
  });

  // Setup modal triggers with source tracking
  const modalTriggers = document.querySelectorAll(
    '[href="/forma-obratnoj-svyaz"], .modal-trigger'
  );
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();

      // Определяем источник клика
      const buttonText =
        trigger.textContent?.trim() ||
        trigger.querySelector('.btn-main-text')?.textContent?.trim() ||
        'Кнопка';
      const buttonType = trigger.className?.includes('btn-green')
        ? 'Зеленая кнопка'
        : trigger.className?.includes('btn-light-blue')
        ? 'Голубая кнопка'
        : trigger.className?.includes('btn-primary')
        ? 'Основная кнопка'
        : 'Кнопка';

      // Определяем секцию или шапку
      const section = findParentSection(trigger);
      const headerContainer = trigger.closest('.header');
      const sectionTitle = section
        ? getSectionTitle(section)
        : headerContainer
        ? 'Шапка сайта'
        : 'Неизвестная секция';

      // Обновляем информацию о триггере
      formType.buttonType = `${buttonType}`;
      formType.triggerSource = `${buttonText}`;
      formType.triggerSection = sectionTitle;
      formType.formLocation = `Модальная форма`;

      updateModalSuccessTag(modal);
      showModal(modal);
    });
  });
};

/**
 * Find parent section of an element
 * @param {HTMLElement} element - Element to find section for
 * @returns {HTMLElement|null} - Parent section element
 */
const findParentSection = element => {
  let current = element;
  while (current && current !== document.body) {
    if (
      current.tagName === 'SECTION' ||
      current.classList.contains('section')
    ) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
};

/**
 * Get section title for tracking
 * @param {HTMLElement} section - Section element
 * @returns {string} - Section title
 */
const getSectionTitle = section => {
  if (!section) return '—';

  // Попытка найти заголовок секции
  const titleElement = section.querySelector('.section-title, h2, h3');
  if (titleElement) {
    return titleElement.textContent?.trim() || 'Секция, заголовок не найден';
  }

  // Определение по классу секции
  const sectionClass = section.className;
  if (sectionClass.includes('hero-section')) return 'Hero секция';
  if (sectionClass.includes('pricing-section')) return 'Секция цен';
  if (sectionClass.includes('glazing-balconies-section'))
    return 'Остекление балконов';
  if (sectionClass.includes('balcony-loggias-section'))
    return 'Балконы и лоджии';
  if (sectionClass.includes('reviews-section')) return 'Отзывы и работы';
  if (sectionClass.includes('lead-form-section')) return 'Форма заявки';
  if (sectionClass.includes('contacts-section')) return 'Контакты';
  if (sectionClass.includes('header')) return 'Шапка сайта';

  return 'Неизвестная секция';
};

// ==========================================================================
// Analytics helpers moved to `src/js/analytics.js`
// ==========================================================================

// ==========================================================================
// Forms System Initialization
// ==========================================================================

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

  // Initialize analytics (session tracking, activity listeners)
  initializeAnalytics();

  // Initialize modal system
  initializeModalForm();

  // Auto-register common forms with accurate location names
  registerForm('contactForm', ['name', 'tel'], {
    formLocation: 'Главная форма (Hero секция)',
  });

  registerForm('leadForm', ['tel'], {
    formLocation:
      'Форма сбора лидов (секция "Не знаете какие окна подойдут именно вам")',
  });

  registerForm('reviewLeadForm', ['name', 'tel'], {
    formLocation:
      'Форма отзывов (секция "Оставьте заявку и получите точную смету на пластиковые окна...")',
  });

  console.log(`✅ Registered forms`);
  console.log(`📊 Analytics initialized`);
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeForms);

// Re-export toast functions for backward compatibility
export { showToast, hideToast } from './toast.js';
