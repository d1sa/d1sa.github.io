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

const isDevelopment = process.env.NODE_ENV !== 'production';

const TELEGRAM_CONFIG = {
  t1: '6368637668',
  t2: 'AAGa4ngnyHcZrLVwRCIMB3XFlE1dFzCPv_0',
  chatId: '-1001961313866',
  mode: 'html',
  get token() {
    return `${this.t1}:${this.t2}`;
  },
};

const FORM_SENDED_KEY = 'formSended';
const FORM_SENDED_AT_KEY = 'formSendedAt';
const FORM_SENDED_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Check if form was sent recently (within TTL period)
 */
const isFormSendedFresh = () => {
  try {
    const flag = localStorage.getItem(FORM_SENDED_KEY) === 'true';
    if (!flag) return false;

    const timestamp = parseInt(
      localStorage.getItem(FORM_SENDED_AT_KEY) || '0',
      10
    );
    const now = Date.now();

    if (!Number.isFinite(timestamp) || now - timestamp > FORM_SENDED_TTL_MS) {
      // Clear expired data
      localStorage.removeItem(FORM_SENDED_KEY);
      localStorage.removeItem(FORM_SENDED_AT_KEY);
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Set form as sent with current timestamp
 */
const setFormSended = () => {
  try {
    localStorage.setItem(FORM_SENDED_KEY, 'true');
    localStorage.setItem(FORM_SENDED_AT_KEY, Date.now().toString());
  } catch (_) {}
  isFormSent = true;
};

let isFormSent = isFormSendedFresh();
const showGiftDelay = 20 * 1000;
const showCallbackFormDelay = 15 * 1000;

const CRMName = 'LeadTrackerCRM';

// Form field configurations
const FIELD_CONFIG = {
  tel: 'Телефон',
  name: 'Имя',
  email: 'Email (Необязательно)',
};

// Form types configuration
const FORM_TYPES = {
  modal: 'modalForm',
  onPage: 'onPageForm',
  callback: 'callbackForm',
  giftForm: 'giftForm',
};

// ==========================================================================
// Utilities (integrated from utils.js)
// ==========================================================================

/**
 * Phone input mask
 * 79991234567 → +7 (999) 123-45-67
 */
const formatPhoneInput = e => {
  const val = e.target.value;
  // Очищаем номер от всех символов кроме цифр
  const digits = val.replace(/\D/g, '');

  // Используем регулярное выражение для извлечения кода оператора и номера
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
 * Format phone number
 * +7 (999) 123-45-67 → +79991234567
 * 7 (999) 123-45-67 → +79991234567
 * etc
 */
const formatPhoneForMessage = phone => {
  // Очищаем номер от всех символов кроме цифр
  const digits = phone.replace(/\D/g, '');

  // Используем логику для формата +7
  if (digits.startsWith('7') || digits.startsWith('8')) {
    return '+7' + digits.substring(1);
  } else if (digits.startsWith('9') && digits.length === 10) {
    return '+7' + digits;
  } else if (phone.startsWith('+7')) {
    return phone;
  } else {
    return '+7' + digits;
  }
};

/**
 * Validate phone number
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
 */
const getFieldName = key => {
  return FIELD_CONFIG[key] || key;
};

// ==========================================================================
// Telegram Bot Integration
// ==========================================================================

/**
 * Send message to Telegram bot
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
        setFormSended();
        triggerMetrikaSubmitGoal(formType.type);
      }
    })
    .catch(error => {
      console.error('Telegram API error:', error);
      handleSubmissionError(formType);
    });
};

/**
 * Fallback for development/testing
 */
const sendToTelegramFake = ({ message, formType }) => {
  setFormSended();

  console.group(`📋 ФОРМА ОТПРАВЛЕНА (DEV MODE)`);
  console.log(`📝 Тип формы: ${formType.formLocation}`);
  console.log(`🏷️ Form Type: ${formType.type}`);

  // Добавляем информацию о триггере
  if (formType.type === FORM_TYPES.modal && formType.triggerSource) {
    console.log(`🎯 Источник клика: ${formType.triggerSource}`);
    console.log(`📍 Секция: ${formType.triggerSection}`);
  }

  console.log(`📄 Сообщение для отправки:`);
  console.log(decodeURI(message));
  console.groupEnd();

  // Simulate network delay for realistic testing
  setTimeout(() => {
    console.log(`✅ Форма успешно "отправлена" (имитация)`);
    handleSubmissionSuccess(formType);
  }, 800);
};

/**
 * Smart form sender - automatically chooses real or fake based on environment
 */
const sendForm = ({ message, formType }) => {
  if (isDevelopment) {
    console.log('Dev mode - using fake form sending');
    sendToTelegramFake({ message, formType });
  } else {
    sendToTelegram({ message, formType });
  }
};

// ==========================================================================
// Yandex Metrika integration
// ==========================================================================

const ym = window.ym;
if (!ym) {
  console.log('Yandex Metrika не найдена');
}

/**
 * Trigger Yandex Metrika goals
 */
const triggerMetrikaSubmitGoal = formType => {
  if (isDevelopment || !ym) {
    return;
  }

  const goalMap = {
    [FORM_TYPES.modal]: 'new_lid',
    [FORM_TYPES.callback]: 'new_lid',
    [FORM_TYPES.giftForm]: 'new_lid',
    [FORM_TYPES.onPage]: 'new_lid',
  };

  const goal = goalMap[formType];
  if (goal) {
    ym(75394450, 'reachGoal', goal);
  } else {
    ym(75394450, 'reachGoal', 'new_lid');
  }
};

const triggerMetrikaCloseModal = () => {
  if (isDevelopment || !ym) {
    return;
  }

  ym(75394450, 'reachGoal', 'non-f');
};

const triggerMetrikaOpenGiftForm = () => {
  if (isDevelopment || !ym) {
    return;
  }

  ym(75394450, 'reachGoal', 'cpc_podarok_lid');
};

// ==========================================================================
// Form Processing
// ==========================================================================

/**
 * Validate form data
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
 * Prepare Telegram message from form data
 */
const prepareTelegramMessage = async (formData, formType) => {
  let message = `Заявка с <b>${window.location.hostname}</b>\n\n`;

  for (let [key, value] of formData.entries()) {
    if (key === 'g-recaptcha-response') continue;

    const fieldName = getFieldName(key);
    const trimmedValue = value.trim();

    if (trimmedValue) {
      // Специальная обработка для поля телефона
      if (key === 'tel') {
        const formattedPhone = formatPhoneForMessage(trimmedValue);
        message += `${fieldName}: <b>${formattedPhone}</b>\n`;
      } else {
        message += `${fieldName}: <b>${trimmedValue}</b>\n`;
      }
    }
  }

  message += `\n<i>Форма:</i>\n<b>${
    formType.formLocation ? `${formType.formLocation}` : ''
  }</b>`;

  if (formType.type === FORM_TYPES.modal && formType.triggerSource) {
    message += `\n<i>${formType.buttonType}: "${formType.triggerSource}"</i>`;
    message += `\n<i>Секция: "${formType.triggerSection}"</i>`;
  }

  // const analytics = await collectAnalyticsInfo();
  // message += formatAnalyticsMessage(analytics);

  // message += `\n\n<i>Информация подготовлена <b>${CRMName}</b></i>`;
  return message;
};

/**
 * Handle form submission
 */
const handleFormSubmit = formType => async e => {
  e.preventDefault();

  // reCAPTCHA check for modal forms
  // if (formType.type === FORM_TYPES.modal && typeof grecaptcha !== 'undefined') {
  //   const response = grecaptcha.getResponse();
  //   if (response.length === 0) {
  //     showToast('Пожалуйста, подтвердите, что вы не робот!', 'error', 8000);
  //     return false;
  //   }
  // }

  const form = e.target;
  const formData = new FormData(form);
  const validation = validateFormData(formData);

  if (!validation.isValid) {
    showFormErrors(validation);
    return;
  }

  const message = await prepareTelegramMessage(formData, formType);
  sendForm({ message, formType });
};

/**
 * Show form validation errors as toast notifications
 */
const showFormErrors = validation => {
  // Create a single, comprehensive error message
  let errorMessage = '';

  if (validation.errors.length === 1) {
    errorMessage = validation.errors[0];
  } else {
    const errorList = validation.errors
      .map(
        error =>
          `<div style="margin: 4px 0; padding-left: 8px;">• ${error}</div>`
      )
      .join('');
    errorMessage = `${errorList}`;
  }

  const duration = validation.errors.length > 1 ? 11000 : 6000;
  showToast(errorMessage, 'error', duration);
};

/**
 * Handle successful form submission
 */
const handleSubmissionSuccess = formType => {
  const { form, isModal } = formType;
  showToast(
    'Заявка успешно отправлена! Мы свяжемся с&nbsp;вами в&nbsp;ближайшее время.',
    'success',
    18000
  );

  if (isModal) {
    updateModalSuccessTag(form);

    setTimeout(() => {
      hideModal(form);
      formReset(form);
    }, 1000);
  } else {
    formReset(form);
  }
};

/**
 * Handle form submission error
 */
const handleSubmissionError = formType => {
  const { form, isModal } = formType;
  showToast(
    'Произошла ошибка при отправке заявки. Попробуйте позже или позвоните нам по телефону +7 (4842) 23-00-15',
    'error',
    18000
  );

  if (isModal) {
    setTimeout(() => {
      hideModal(form);
      formReset(form);
    }, 1000);
  } else {
    formReset(form);
  }
};

const formReset = form => {
  const formTag =
    form.nodeName === 'FORM' ? form : form.querySelector('.contact-form');

  if (!formTag) {
    return;
  }

  // Reset form
  formTag.reset();
  const phoneInput = formTag.querySelector('input[type="tel"]');
  if (phoneInput) {
    phoneInput.value = '+7 ';
  }
};

// ==========================================================================
// Modal System
// ==========================================================================

/**
 * Update modal content with success tag if form was sent
 */
const updateModalSuccessTag = modal => {
  isFormSent = isFormSendedFresh();
  const formContent = modal.querySelector('.form-content .form-header');
  const existingTag = modal.querySelector('.form-tag');

  // Remove existing tag if present
  if (existingTag) {
    existingTag.remove();
  }

  // Add success tag if form was sent
  if (isFormSent && formContent) {
    const tagElement = `
      <div class="form-tag form-tag--success-modal">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 5.35L4.75 9.25L11 2.75" stroke="#2BB109" stroke-width="2"></path>
        </svg>
        <span>Заявка отправлена! Мы скоро свяжемся с вами</span>
      </div>
    `;

    formContent.insertAdjacentHTML('afterbegin', tagElement);
  }
};

// ==========================================================================
// Form Registration & Initialization
// ==========================================================================

export function initializeLocalForm(formId, fields, options = {}) {
  const form = document.getElementById(formId);
  if (!form) {
    console.warn(`Form with ID "${formId}" not found`);
    return;
  }

  const formType = {
    type: FORM_TYPES.onPage,
    fields,
    isModal: false,
    options,
    form,
    formLocation: options.formLocation || 'Зарегистрированная форма',
  };

  createLocalForm(formType);
}

const createLocalForm = formType => {
  const { form } = formType;

  const phoneInput = form.querySelector('input[type="tel"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', formatPhoneInput);
  }

  form.addEventListener('submit', handleFormSubmit(formType));
};

/**
 * Initialize modal form system
 */
const initializeModalForm = (type, options = {}) => {
  const formType = {
    type: type,
    isModal: true,
    form: null,
    buttonType: '',
    formLocation: options.formLocation || 'Модальная форма (всплывающая)',
    triggerSource: '', // Источник клика (кнопка)
    triggerSection: '', // Секция, из которой был клик
  };

  createModalForm(formType);
};

/**
 * Create modal form
 */
const createModalForm = formType => {
  const formTemplates = {
    [FORM_TYPES.modal]: `
    <div class='modal-container modal-container--default-form'>
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
            <a href="/policy.pdf" target="_blank" rel="noopener noreferrer">персональных данных</a>
          </p>
        </form>
      </div>
    </div>
    `,
    [FORM_TYPES.callback]: `
      <div class='modal-container modal-container--callback-form'>
        <div class='modal-close modal-close-icon'></div>
        <div class='form-content'>
          <form class='contact-form'>
            <div class='form-header'>
              <h4>Оставьте заявку на консультацию и&nbsp;мы&nbsp;вам перезвоним</h4>
            </div>
            <div class='form-fields'>
              <div class='form-field'>
                <input type='tel' name='tel' minlength=10 value='+7 ' class='input input-solid input--phone' required />
              </div>
            </div>
            <button type="submit" class="btn btn-green btn-fw">
              Да, перезвоните мне
            </button>
            <p class='form-disclaimer'>
              Отправляя данные через форму вы&nbsp;даете <a href="/policy.pdf" target="_blank" rel="noopener noreferrer">согласие на&nbsp;обработку своих персональных данных</a>
            </p>
          </form> 
        </div>
      </div>
    `,
    [FORM_TYPES.giftForm]: `
      <div class='modal-container modal-container--gift-form'>
        <div class='modal-close modal-close-icon'></div>
        <div class='form-content'>
          <form class='contact-form'>
            <div class='form-header'>
              <h4>
                У нас для вас подарок — специальная цена
              </h4>
              <p>
              Оставьте заявку, чтобы&nbsp;получить персональное предложение и&nbsp;бесплатный выезд замерщика!
            </p>
            </div>
            <div class='form-fields'>
              <div class='form-field'>
                <input type='tel' name='tel' minlength=10 value='+7 ' class='input input--phone' required />
              </div>
            </div>
            <button type="submit" class="btn btn-green btn-fw">
              Да, перезвоните мне
            </button>
            <p class='form-disclaimer'>
              Отправляя данные через форму вы&nbsp;даете <a href="/policy.pdf" target="_blank" rel="noopener noreferrer">согласие на&nbsp;обработку своих персональных данных</a>
            </p>
          </form>
        </div>
      </div>`,
  };

  const formModal = document.createElement('div');
  const modalClasses = {
    [FORM_TYPES.modal]: 'modal-form modal-default-form hide',
    [FORM_TYPES.callback]: 'modal-form modal-callback-form hide',
    [FORM_TYPES.giftForm]: 'modal-form modal-gift-form hide',
  };
  formModal.className = modalClasses[formType.type];
  formModal.innerHTML = formTemplates[formType.type];

  updateModalSuccessTag(formModal);
  formType.form = formModal;
  document.body.appendChild(formModal);

  if (formType.type === FORM_TYPES.callback) {
    const iconPhoneCall = new URL(
      '../img/phone-call-white-fill.svg',
      import.meta.url
    );
    const callbackButton = `
      <button class="openCallBackModal btn-callback">
        <img src="${iconPhoneCall}" 
          alt="Заказать консультацию бесплатно" 
          loading="lazy"
          decoding="async" 
        />
      </button>`;

    formModal.insertAdjacentHTML('afterbegin', callbackButton);

    const openCallBackModal = document.querySelector('.openCallBackModal');
    if (openCallBackModal) {
      openCallBackModal.addEventListener('click', e => {
        e.preventDefault();
        toggleModal(formModal);
      });
    }

    if (!isFormSendedFresh()) {
      setTimeout(() => {
        showModal(formModal);
      }, showCallbackFormDelay);
    }
  }

  if (formType.type === FORM_TYPES.giftForm) {
    const giftButton = `
      <button class="openGiftModal btn-gift hide">
        <label>Получи подарок!</label>
      </button>`;
    formModal.insertAdjacentHTML('afterbegin', giftButton);

    const openGiftModal = formModal.querySelector('.openGiftModal');
    if (openGiftModal) {
      openGiftModal.addEventListener('click', e => {
        e.preventDefault();
        toggleModal(formModal);
        triggerMetrikaOpenGiftForm();
      });
    }

    if (!isFormSendedFresh()) {
      setTimeout(() => {
        const button = formModal.querySelector('.btn-gift.hide');
        button.classList.remove('hide');
      }, showGiftDelay);
    }
  }

  if (formType.type === FORM_TYPES.modal) {
    const modalTriggers = document.querySelectorAll(
      '[href="/forma-obratnoj-svyaz"], .modal-trigger'
    );

    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', e => {
        e.preventDefault();
        getTriggerInfo({ trigger, formType });
        showModal(formModal);
      });
    });
  }

  /***** Setup form handlers *****/

  // Submit handler
  const formTag = formModal.querySelector('.contact-form');
  if (formTag) {
    formTag.addEventListener('submit', handleFormSubmit(formType));

    // Setup phone input
    const phoneInput = formTag.querySelector('input[type="tel"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', formatPhoneInput);
    }
  }

  // Close handler
  const closeIcon = formModal.querySelector('.modal-close-icon');
  if (closeIcon) {
    closeIcon.addEventListener('click', e => {
      e.preventDefault();
      hideModal(formModal);
      triggerMetrikaCloseModal();
    });
  }

  // Close on backdrop handler
  window.addEventListener('click', e => {
    if (e.target === formModal) {
      hideModal(formModal);
    }
  });

  return formModal;
};

const getTriggerInfo = ({ trigger, formType }) => {
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

  // Define section or header
  const section = findParentSection(trigger);
  const headerContainer = trigger.closest('.header');
  const sectionTitle = section
    ? getSectionTitle(section)
    : headerContainer
    ? 'Шапка сайта'
    : 'Неизвестная секция';

  // Update trigger info
  formType.buttonType = `${buttonType}`;
  formType.triggerSource = `${buttonText}`;
  formType.triggerSection = sectionTitle;
  formType.formLocation = `Модальная форма`;
};

const showModal = modal => {
  modal.classList.remove('hide');
  modal.classList.add('show');
};

const hideModal = modal => {
  modal.classList.remove('show');
  modal.classList.add('hide');
};

const toggleModal = modal => {
  modal.classList.toggle('show');
  modal.classList.toggle('hide');
};

/**
 * Find parent section of an element
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
// Forms System Initialization
// ==========================================================================

export function initializeForms() {
  console.log('🚀 Initializing Forms System...');
  console.log(
    `🔧 Mode: ${
      isDevelopment ? 'Development (fake sending)' : 'Production (real sending)'
    }`
  );

  // initializeAnalytics();

  initializeModalForm(FORM_TYPES.modal, {
    formLocation: 'Модальная форма (всплывающая)',
  });

  initializeModalForm(FORM_TYPES.callback, {
    formLocation: 'Форма callback',
  });

  initializeModalForm(FORM_TYPES.giftForm, {
    formLocation: 'Форма "подарок"',
  });

  initializeLocalForm('contactForm', ['name', 'tel'], {
    formLocation: 'Главная форма (Hero секция)',
  });

  initializeLocalForm('leadForm', ['tel'], {
    formLocation:
      'Форма сбора лидов (секция "Не знаете какие окна подойдут именно вам")',
  });

  initializeLocalForm('reviewLeadForm', ['name', 'tel'], {
    formLocation:
      'Форма отзывов (секция "Оставьте заявку и получите точную смету на пластиковые окна...")',
  });
}

document.addEventListener('DOMContentLoaded', initializeForms);

// Re-export toast functions for backward compatibility
export { showToast, hideToast } from './toast.js';
