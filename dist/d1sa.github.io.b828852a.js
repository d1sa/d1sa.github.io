// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"lhpGb":[function(require,module,exports,__globalThis) {
// ==========================================================================
// Main JavaScript Entry Point
// ==========================================================================
/**
 * Single entry point for all JavaScript functionality
 * All modules are imported here to maintain clean dependency management
 */ // Core functionality modules
var _headerJs = require("./header.js"); // Header height compensation and navigation
var _formsJs = require("./forms.js"); // Complete forms management system (replaces modal-form + utils)
var _pricingJs = require("./pricing.js"); // Pricing carousel and tabs
var _sliderJs = require("./slider.js"); // Swiper slider
// ==========================================================================
// Global App Initialization
// ==========================================================================
/**
 * Main application initialization
 * Runs after all modules are loaded
 */ function initializeApp() {
    console.log("\uD83D\uDE80 App initialized successfully");
    // Performance timing
    const loadTime = performance.now();
    console.log(`\u{26A1} JS modules loaded in ${loadTime.toFixed(2)}ms`);
    // Add any global initialization logic here
    // For example: analytics, global event listeners, etc.
    // Global smooth scroll for anchor links
    initializeSmoothScroll();
}
/**
 * Initialize smooth scrolling for anchor links
 */ function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor)=>{
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}
// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
// ==========================================================================
// Global Error Handling
// ==========================================================================
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
// In production, you might want to send this to your error tracking service
// Example: errorTracker.captureException(event.error);
});
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});
console.log("\uD83D\uDCCA Development mode - performance monitoring enabled");
// Log performance metrics
window.addEventListener('load', function() {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log("\uD83D\uDCC8 Performance metrics:", {
        'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart + 'ms',
        'Load Complete': perfData.loadEventEnd - perfData.loadEventStart + 'ms',
        'Total Load Time': perfData.loadEventEnd - perfData.fetchStart + 'ms'
    });
});
// ==========================================================================
// Export main app for external access if needed
// ==========================================================================
window.OknaApp = {
    version: '1.0.0',
    initialized: false,
    modules: [
        'header',
        'forms',
        'pricing'
    ]
};

},{"./header.js":"7clXR","./forms.js":"14dZ8","./pricing.js":"3h78u","./slider.js":"9eRXX"}],"7clXR":[function(require,module,exports,__globalThis) {
// ==========================================================================
// Header Height Compensation
// ==========================================================================
/**
 * Компенсирует высоту фиксированного хедера
 * Добавляет padding-top к body равный высоте .header
 */ document.addEventListener('DOMContentLoaded', function() {
    function updateBodyPadding() {
        const header = document.querySelector('.header');
        if (header) {
            const headerHeight = Math.round(header.offsetHeight);
            if (headerHeight > 0) document.body.style.paddingTop = headerHeight + 'px';
        }
    }
    // Применяем при загрузке
    updateBodyPadding();
    // Debounce для resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateBodyPadding, 100);
    });
    // Обработка изменения ориентации
    window.addEventListener('orientationchange', function() {
        setTimeout(updateBodyPadding, 200);
    });
});
// ==========================================================================
// Mobile Menu Functionality
// ==========================================================================
/**
 * Управление мобильным меню
 */ document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!mobileMenuToggle || !header) return;
    // Открытие/закрытие мобильного меню
    function toggleMobileMenu() {
        const isOpen = header.classList.contains('mobile-menu-open');
        if (isOpen) closeMobileMenu();
        else openMobileMenu();
    }
    // Открытие мобильного меню
    function openMobileMenu() {
        header.classList.add('mobile-menu-open');
        document.body.style.overflow = 'hidden';
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuToggle.setAttribute('aria-label', "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E");
        // Фокус на первую ссылку в меню
        const firstNavLink = document.querySelector('.nav-link');
        if (firstNavLink) setTimeout(()=>firstNavLink.focus(), 300);
    }
    // Закрытие мобильного меню
    function closeMobileMenu() {
        header.classList.remove('mobile-menu-open');
        document.body.style.overflow = '';
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E");
        // Возвращаем фокус на кнопку меню
        mobileMenuToggle.focus();
    }
    // Обработчик клика по кнопке гамбургера
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    // Обработчик клика по оверлею
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', function() {
        closeMobileMenu();
    });
    // Закрытие меню при клике на ссылки навигации
    navLinks.forEach((link)=>{
        link.addEventListener('click', function() {
            // Небольшая задержка для плавности
            setTimeout(()=>{
                closeMobileMenu();
            }, 150);
        });
    });
    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && header.classList.contains('mobile-menu-open')) closeMobileMenu();
    });
    // Закрытие меню при изменении размера экрана
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) // tablet breakpoint
        closeMobileMenu();
    });
    // Обработка фокуса для доступности
    function trapFocus(container) {
        const focusableElements = container.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select');
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        container.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        });
    }
    // Применяем trap focus к мобильному меню
    const navWrapper = document.querySelector('.nav-and-actions-wrapper');
    if (navWrapper) trapFocus(navWrapper);
});

},{}],"14dZ8":[function(require,module,exports,__globalThis) {
// ==========================================================================
// Forms Management System - Main File
// ==========================================================================
// Import toast functions from separate module
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Re-export toast functions for backward compatibility
parcelHelpers.export(exports, "showToast", ()=>(0, _toastJs.showToast));
parcelHelpers.export(exports, "hideToast", ()=>(0, _toastJs.hideToast));
// ==========================================================================
// Form Registration & Initialization
// ==========================================================================
/**
 * Register a form for processing
 * @param {string} formId - Form ID
 * @param {Array} fields - Expected fields
 * @param {Object} options - Additional options
 */ parcelHelpers.export(exports, "registerForm", ()=>registerForm);
/**
 * Initialize all form systems
 */ parcelHelpers.export(exports, "initializeForms", ()=>initializeForms);
var _toastJs = require("./toast.js");
// ==========================================================================
// Configuration
// ==========================================================================
// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
    token1: '',
    token2: '',
    chatId: '',
    mode: 'html',
    get token () {
        return `${this.token1}:${this.token2}`;
    }
};
// Yandex Metrika integration
const ym = window.ym;
if (!ym) console.log("Yandex Metrika \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430");
// Form field configurations
const FIELD_CONFIG = {
    tel: "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0439 \u0442\u0435\u043B\u0435\u0444\u043E\u043D",
    name: "\u0418\u043C\u044F",
    email: "Email (\u041D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)"
};
// Form types configuration
const FORM_TYPES = {
    modal: 'modalForm',
    registered: 'registeredForm',
    callback: 'callbackForm',
    mainBlue: 'mainBlueForm'
};
// Registered forms storage
const registeredForms = new Map();
// ==========================================================================
// Utilities (integrated from utils.js)
// ==========================================================================
/**
 * Phone number formatting with live input mask
 * @param {Event} e - Input event
 */ const formatPhoneInput = (e)=>{
    const val = e.target.value;
    const digits = val.replace(/\D/g, '');
    const match = digits.match(/(7|8)?(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    let result = '+7 ';
    if (match[2]) {
        result += '(' + match[2];
        if (match[2] && match[3]) result += ')';
    }
    if (match[3]) result += ' ' + match[3];
    if (match[4]) result += ' ' + match[4];
    if (match[5]) result += '-' + match[5];
    e.target.value = result;
};
/**
 * Validate Russian phone number
 * @param {string} phone - Phone number string
 * @returns {boolean} - Is valid
 */ const validatePhone = (phone)=>{
    const regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return regex.test(phone);
};
/**
 * Get field display name
 * @param {string} key - Field key
 * @returns {string} - Display name
 */ const getFieldName = (key)=>{
    return FIELD_CONFIG[key] || key;
};
// ==========================================================================
// Telegram Bot Integration
// ==========================================================================
/**
 * Send message to Telegram bot
 * @param {Object} params - Message parameters
 */ const sendToTelegram = ({ message, formType })=>{
    const { token, chatId, mode } = TELEGRAM_CONFIG;
    const encodedMessage = encodeURI(message);
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&parse_mode=${mode}&text=${encodedMessage}`;
    fetch(url).then((res)=>res.json()).then((res)=>{
        console.log('Telegram API response:', res);
        if (res.ok) {
            handleSubmissionSuccess(formType);
            localStorage.setItem('formSended', true);
            // Yandex Metrika goals
            triggerMetrikaGoal(formType.type);
        }
    }).catch((error)=>{
        console.error('Telegram sending error:', error);
        // Fallback to success for better UX
        handleSubmissionSuccess(formType);
    });
};
/**
 * Fallback for development/testing
 * @param {Object} params - Message parameters
 */ const sendToTelegramFake = ({ message, formType })=>{
    localStorage.setItem('formSended', true);
    console.group(`\u{1F4CB} \u{424}\u{41E}\u{420}\u{41C}\u{410} \u{41E}\u{422}\u{41F}\u{420}\u{410}\u{412}\u{41B}\u{415}\u{41D}\u{410} (DEV MODE)`);
    console.log(`\u{1F4DD} \u{422}\u{438}\u{43F} \u{444}\u{43E}\u{440}\u{43C}\u{44B}: ${formType.textName}`);
    console.log(`\u{1F3F7}\u{FE0F} Form Type: ${formType.type}`);
    console.log(`\u{1F4C4} \u{421}\u{43E}\u{43E}\u{431}\u{449}\u{435}\u{43D}\u{438}\u{435} \u{434}\u{43B}\u{44F} \u{43E}\u{442}\u{43F}\u{440}\u{430}\u{432}\u{43A}\u{438}:`);
    console.log(decodeURI(message));
    console.log(`\u{1F4CA} \u{412}\u{440}\u{435}\u{43C}\u{44F}: ${new Date().toLocaleString()}`);
    console.log(`\u{1F4BE} localStorage.formSended = true`);
    console.groupEnd();
    // Simulate network delay for realistic testing
    setTimeout(()=>{
        console.log(`\u{2705} \u{424}\u{43E}\u{440}\u{43C}\u{430} \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} "\u{43E}\u{442}\u{43F}\u{440}\u{430}\u{432}\u{43B}\u{435}\u{43D}\u{430}" (\u{438}\u{43C}\u{438}\u{442}\u{430}\u{446}\u{438}\u{44F})`);
        handleSubmissionSuccess(formType);
        // Trigger Metrika in dev mode too for testing
        triggerMetrikaGoal(formType.type);
    }, 800);
};
/**
 * Smart form sender - automatically chooses real or fake based on environment
 * @param {Object} params - Message parameters
 */ const sendForm = ({ message, formType })=>{
    const isDevelopment = true;
    if (isDevelopment) {
        console.log("\uD83D\uDE80 Development mode - using fake form sending");
        sendToTelegramFake({
            message,
            formType
        });
    } else {
        console.log("\uD83D\uDCE4 Production mode - sending to Telegram bot");
        sendToTelegram({
            message,
            formType
        });
    }
};
/**
 * Trigger Yandex Metrika goals
 * @param {string} formType - Form type
 */ const triggerMetrikaGoal = (formType)=>{
    if (!ym) return;
    const goalMap = {
        [FORM_TYPES.modal]: 'new_lid',
        [FORM_TYPES.callback]: 'new_lid',
        [FORM_TYPES.mainBlue]: 'new_lid'
    };
    const goal = goalMap[formType];
    if (goal) ym(75394450, 'reachGoal', goal);
};
// ==========================================================================
// Form Processing
// ==========================================================================
/**
 * Handle form submission
 * @param {Object} formType - Form type configuration
 * @returns {Function} - Event handler
 */ const handleFormSubmit = (formType)=>(e)=>{
        e.preventDefault();
        // reCAPTCHA check for modal forms
        if (formType.type === FORM_TYPES.modal && typeof grecaptcha !== 'undefined') {
            const response = grecaptcha.getResponse();
            if (response.length === 0) {
                (0, _toastJs.showToast)("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435, \u0447\u0442\u043E \u0432\u044B \u043D\u0435 \u0440\u043E\u0431\u043E\u0442!", 'error', 8000);
                return false;
            }
        }
        const form = e.target;
        const { textName } = formType;
        // Clear previous errors
        const errorsContainer = form.querySelector('.errorsContainer');
        if (errorsContainer) errorsContainer.remove();
        // Build message
        let message = `<b>\u{41D}\u{43E}\u{432}\u{430}\u{44F} \u{437}\u{430}\u{44F}\u{432}\u{43A}\u{430} \u{441} \u{441}\u{430}\u{439}\u{442}\u{430} oknanaveka40.ru</b>
\u{2013}\u{2013}\u{2013}\u{2013}

`;
        const formData = new FormData(form);
        const validation = {
            isValid: true,
            errors: []
        };
        // Process and validate form data
        for (let [key, value] of formData.entries()){
            if (key === 'g-recaptcha-response') continue;
            const trimmedValue = value.trim();
            // Validation for required fields
            if (key === 'name') {
                if (!trimmedValue || trimmedValue.length < 2) {
                    validation.isValid = false;
                    validation.errors.push("\u0418\u043C\u044F \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043F\u0443\u0441\u0442\u044B\u043C");
                }
            }
            if (key === 'tel') {
                if (!trimmedValue || trimmedValue === '+7' || trimmedValue === '+7 ') {
                    validation.isValid = false;
                    validation.errors.push("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430");
                } else if (!validatePhone(trimmedValue)) {
                    validation.isValid = false;
                    validation.errors.push("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0442\u0435\u043B\u0435\u0444\u043E\u043D");
                }
            }
            // Add to message only if field has value
            if (trimmedValue) message += `<i>${getFieldName(key)}</i>: <b>${trimmedValue}</b>\n`;
        }
        message += `\n\n<i>${textName ? `(${textName})` : ''}</i>`;
        // Handle validation errors
        if (!validation.isValid) {
            showFormErrors(validation, formType);
            return;
        }
        // Send form using smart sender (auto-detects dev/prod mode)
        sendForm({
            message,
            formType
        });
    };
/**
 * Show form validation errors as toast notifications
 * @param {Object} validation - Validation result
 * @param {Object} formType - Form type
 */ const showFormErrors = (validation, formType)=>{
    // Show each error as a separate toast
    validation.errors.forEach((error, index)=>{
        // Stagger toast appearances slightly
        setTimeout(()=>{
            (0, _toastJs.showToast)(error, 'error', 12000);
        }, index * 200);
    });
    // Remove old inline error containers if they exist
    const { modal } = formType;
    const mainForm = modal.nodeName === 'FORM' ? modal : modal.querySelector('.contact-form');
    const errorsContainer = mainForm.querySelector('.errorsContainer');
    if (errorsContainer) errorsContainer.remove();
};
/**
 * Handle successful form submission
 * @param {Object} formType - Form type
 */ const handleSubmissionSuccess = (formType)=>{
    const { type, modal } = formType;
    // Show success toast notification
    (0, _toastJs.showToast)("\u0417\u0430\u044F\u0432\u043A\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0430! \u041C\u044B \u0441\u0432\u044F\u0436\u0435\u043C\u0441\u044F \u0441 \u0432\u0430\u043C\u0438 \u0432 \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0432\u0440\u0435\u043C\u044F.", 'success', 18000);
    // For modal forms, add success tag and close modal
    if (type === FORM_TYPES.modal) {
        // Add success tag immediately
        updateModalSuccessTag(modal);
        setTimeout(()=>{
            hideModal(modal);
            // Reset form after closing modal
            const form = modal.querySelector('.contact-form');
            if (form) {
                form.reset();
                // Reset phone input to default value
                const phoneInput = form.querySelector('input[type="tel"]');
                if (phoneInput) phoneInput.value = '+7 ';
            }
        }, 1000);
    } else {
        // For registered forms, reset the form
        const mainForm = modal.nodeName === 'FORM' ? modal : modal.querySelector('.contact-form');
        if (mainForm) {
            mainForm.reset();
            // Reset phone input to default value
            const phoneInput = mainForm.querySelector('input[type="tel"]');
            if (phoneInput) phoneInput.value = '+7 ';
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
 */ const createModalHTML = (config)=>{
    return `
    <div class='modal-container'>
      <div class='modal-close modal-close-icon'></div>
      <div class='form-content'>
        <form class='contact-form'>  
          <div class='form-header'>
            <h3>\u{41E}\u{441}\u{442}\u{430}\u{432}\u{44C}\u{442}\u{435} \u{437}\u{430}\u{44F}\u{432}\u{43A}\u{443}</h3>
            <p>\u{41C}\u{44B} \u{441}\u{432}\u{44F}\u{436}\u{435}\u{43C}\u{441}\u{44F} \u{441} \u{432}\u{430}\u{43C}\u{438} \u{43A}\u{430}\u{43A} \u{43C}\u{43E}\u{436}\u{43D}\u{43E} \u{440}\u{430}\u{43D}\u{44C}\u{448}\u{435}</p>
          </div>
          <div class='form-fields'>
            <div class='form-field'>
              <input type='text' name='name' placeholder='\u{412}\u{430}\u{448}\u{435} \u{438}\u{43C}\u{44F}' class='input input-solid' />
            </div>
            <div class='form-field'>
              <input type='tel' name='tel' placeholder='+7' class='input input-solid' minlength="10" value='+7 ' />
            </div>
          </div>
          <button type='submit' class='btn btn-orange'>\u{41E}\u{442}\u{43F}\u{440}\u{430}\u{432}\u{438}\u{442}\u{44C}</button>
          <p class='form-disclaimer'>
            \u{41E}\u{442}\u{43F}\u{440}\u{430}\u{432}\u{43B}\u{44F}\u{44F} \u{434}\u{430}\u{43D}\u{43D}\u{44B}\u{435} \u{447}\u{435}\u{440}\u{435}\u{437} \u{444}\u{43E}\u{440}\u{43C}\u{443} \u{432}\u{44B} \u{434}\u{430}\u{435}\u{442}\u{435} \u{441}\u{43E}\u{433}\u{43B}\u{430}\u{441}\u{438}\u{435} \u{43D}\u{430} \u{43E}\u{431}\u{440}\u{430}\u{431}\u{43E}\u{442}\u{43A}\u{443} \u{441}\u{432}\u{43E}\u{438}\u{445} 
            <span>\u{43F}\u{435}\u{440}\u{441}\u{43E}\u{43D}\u{430}\u{43B}\u{44C}\u{43D}\u{44B}\u{445} \u{434}\u{430}\u{43D}\u{43D}\u{44B}\u{445}</span>
          </p>
        </form>
      </div>
    </div>
  `;
};
/**
 * Create success tag HTML
 * @returns {string} - Success tag HTML
 */ const createSuccessTagHTML = ()=>{
    return `
    <div class="form-tag">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M1 5.35L4.75 9.25L11 2.75" stroke="#2BB109" stroke-width="2"></path>
      </svg>
      <span>\u{417}\u{430}\u{44F}\u{432}\u{43A}\u{430} \u{43E}\u{442}\u{43F}\u{440}\u{430}\u{432}\u{43B}\u{435}\u{43D}\u{430}! \u{41C}\u{44B} \u{441}\u{43A}\u{43E}\u{440}\u{43E} \u{441}\u{432}\u{44F}\u{436}\u{435}\u{43C}\u{441}\u{44F} \u{441} \u{432}\u{430}\u{43C}\u{438}</span>
    </div>
  `;
};
/**
 * Create modal element
 * @param {Object} formType - Form type configuration
 * @returns {HTMLElement} - Modal element
 */ const createModal = (formType)=>{
    const modal = document.createElement('div');
    modal.className = `modal-form ${formType.type}`;
    modal.innerHTML = createModalHTML(formType);
    return modal;
};
/**
 * Show modal
 * @param {HTMLElement} modal - Modal element
 */ const showModal = (modal)=>{
    modal.classList.add('show');
};
/**
 * Hide modal
 * @param {HTMLElement} modal - Modal element
 */ const hideModal = (modal)=>{
    modal.classList.remove('show');
};
/**
 * Update modal content with success tag if form was sent
 * @param {HTMLElement} modal - Modal element
 */ const updateModalSuccessTag = (modal)=>{
    const isFormSent = localStorage.getItem('formSended') === 'true';
    const formContent = modal.querySelector('.form-content .form-header');
    const existingTag = modal.querySelector('.form-tag');
    // Remove existing tag if present
    if (existingTag) existingTag.remove();
    // Add success tag if form was sent
    if (isFormSent && formContent) {
        const tagElement = document.createElement('div');
        tagElement.innerHTML = createSuccessTagHTML();
        const tag = tagElement.firstElementChild;
        // Insert tag at the beginning of form-content
        formContent.insertBefore(tag, formContent.firstChild);
    }
};
function registerForm(formId, fields, options = {}) {
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
        textName: options.textName || "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u0430\u044F \u0444\u043E\u0440\u043C\u0430"
    };
    registeredForms.set(formId, config);
    initializeRegisteredForm(config);
}
/**
 * Initialize registered form
 * @param {Object} config - Form configuration
 */ const initializeRegisteredForm = (config)=>{
    const { element: form, textName } = config;
    // Initialize phone inputs
    const phoneInputs = form.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach((input)=>{
        input.addEventListener('input', formatPhoneInput);
        if (!input.value || input.value === '+7') input.value = '+7 ';
    });
    // Create form type for submission
    const formType = {
        type: FORM_TYPES.registered,
        textName: textName,
        modal: form
    };
    // Handle form submission
    form.addEventListener('submit', handleFormSubmit(formType));
};
/**
 * Initialize modal form system
 */ const initializeModalForm = ()=>{
    const formType = {
        type: FORM_TYPES.modal,
        textName: "\u0412\u0441\u043F\u043B\u044B\u0432\u0430\u044E\u0449\u0430\u044F \u0444\u043E\u0440\u043C\u0430"
    };
    const modal = createModal(formType);
    formType.modal = modal;
    // Initial setup for form content
    const form = modal.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit(formType));
        // Setup phone input
        const phoneInput = modal.querySelector('input[type="tel"]');
        if (phoneInput) phoneInput.addEventListener('input', formatPhoneInput);
    }
    // Add to DOM
    document.body.appendChild(modal);
    // Setup initial close handlers
    const closeIcon = modal.querySelector('.modal-close-icon');
    if (closeIcon) closeIcon.addEventListener('click', (e)=>{
        e.preventDefault();
        hideModal(modal);
    });
    // Close on backdrop click
    window.addEventListener('click', (e)=>{
        if (e.target === modal) hideModal(modal);
    });
    // Setup modal triggers
    const modalTriggers = document.querySelectorAll('[href="/forma-obratnoj-svyaz"], .modal-trigger');
    modalTriggers.forEach((trigger)=>{
        trigger.addEventListener('click', (e)=>{
            e.preventDefault();
            updateModalSuccessTag(modal);
            showModal(modal);
        });
    });
};
function initializeForms() {
    const isDevelopment = true;
    console.log("\uD83D\uDE80 Initializing Forms System...");
    console.log(`\u{1F527} Mode: ${isDevelopment ? 'Development (fake sending)' : 'Production (real sending)'}`);
    // Initialize modal system
    initializeModalForm();
    // Auto-register common forms
    registerForm('contactForm', [
        'name',
        'tel'
    ], {
        textName: "\u0424\u043E\u0440\u043C\u0430 Hero \u0441\u0435\u043A\u0446\u0438\u0438"
    });
    registerForm('leadForm', [
        'tel'
    ], {
        textName: "\u041E\u0441\u043D\u043E\u0432\u043D\u0430\u044F \u043B\u0438\u0434-\u0444\u043E\u0440\u043C\u0430"
    });
    registerForm('reviewLeadForm', [
        'name',
        'tel'
    ], {
        textName: "\u0424\u043E\u0440\u043C\u0430 \u043E\u0442\u0437\u044B\u0432\u043E\u0432"
    });
    console.log(`\u{2705} Registered forms`);
}
// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeForms);

},{"./toast.js":"lDdb1","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"lDdb1":[function(require,module,exports,__globalThis) {
// ==========================================================================
// Toast Notification Component
// ==========================================================================
/**
 * Create toast notification container if it doesn't exist
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Export functions for use in other modules
parcelHelpers.export(exports, "showToast", ()=>showToast);
parcelHelpers.export(exports, "hideToast", ()=>hideToast);
parcelHelpers.export(exports, "createToast", ()=>createToast);
parcelHelpers.export(exports, "createToastContainer", ()=>createToastContainer);
const createToastContainer = ()=>{
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
 */ const createToast = (message, type = 'error', duration = 12000)=>{
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const getIcon = (type)=>{
        if (type === 'error') return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1.5C6.15 1.5 1.5 6.15 1.5 12C1.5 17.85 6.15 22.5 12 22.5C17.85 22.5 22.5 17.85 22.5 12C22.5 6.15 17.85 1.5 12 1.5ZM16.05 17.25L12 13.2L7.95 17.25L6.75 16.05L10.8 12L6.75 7.95L7.95 6.75L12 10.8L16.05 6.75L17.25 7.95L13.2 12L17.25 16.05L16.05 17.25Z" fill="white"/>
      </svg>`;
        if (type === 'success') return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1.5C9.9233 1.5 7.89323 2.11581 6.16652 3.26957C4.4398 4.42332 3.09399 6.0632 2.29927 7.98182C1.50455 9.90045 1.29661 12.0116 1.70176 14.0484C2.1069 16.0852 3.10693 17.9562 4.57538 19.4246C6.04383 20.8931 7.91476 21.8931 9.95156 22.2982C11.9884 22.7034 14.0996 22.4955 16.0182 21.7007C17.9368 20.906 19.5767 19.5602 20.7304 17.8335C21.8842 16.1068 22.5 14.0767 22.5 12C22.5 9.21523 21.3938 6.54451 19.4246 4.57538C17.4555 2.60625 14.7848 1.5 12 1.5ZM10.5 16.1925L6.75 12.4425L7.94251 11.25L10.5 13.8075L16.0575 8.25L17.2545 9.4395L10.5 16.1925Z" fill="white"/>
      </svg>`;
        return "\u2139\uFE0F"; // default for info
    };
    toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-icon">
        ${getIcon(type)}
      </div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" aria-label="\u{417}\u{430}\u{43A}\u{440}\u{44B}\u{442}\u{44C} \u{443}\u{432}\u{435}\u{434}\u{43E}\u{43C}\u{43B}\u{435}\u{43D}\u{438}\u{435}">
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
 */ const showToast = (message, type = 'error', duration = 12000)=>{
    const container = createToastContainer();
    const toast = createToast(message, type, duration);
    // Add unique ID to toast for debugging and isolation
    const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    toast.dataset.toastId = toastId;
    // Add toast to container
    container.appendChild(toast);
    // Trigger animation after DOM insertion
    setTimeout(()=>{
        toast.classList.add('toast-show');
        // Start progress bar animation after toast is visible
        setTimeout(()=>{
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
    closeBtn.addEventListener('click', ()=>{
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
    const startAutoHideTimer = ()=>{
        if (isDestroyed || isPaused) return;
        const elapsed = Date.now() - startTime - totalPausedTime;
        const remaining = Math.max(0, duration - elapsed);
        if (remaining <= 0) {
            hideToast(toast);
            return;
        }
        // Clear any existing timeout
        if (autoHideTimeout) clearTimeout(autoHideTimeout);
        autoHideTimeout = setTimeout(()=>{
            if (!isDestroyed && !isPaused) hideToast(toast);
        }, remaining);
    };
    // Function to pause toast
    const pauseToast = ()=>{
        if (isPaused || isDestroyed) return;
        isPaused = true;
        pauseStartTime = Date.now();
        // Pause progress bar animation
        const progressBar = toast.querySelector('.toast-progress');
        if (progressBar) progressBar.style.animationPlayState = 'paused';
        // Clear timer
        if (autoHideTimeout) {
            clearTimeout(autoHideTimeout);
            autoHideTimeout = null;
        }
    };
    // Function to resume toast
    const resumeToast = ()=>{
        if (!isPaused || isDestroyed) return;
        // Add current pause duration to total paused time
        totalPausedTime += Date.now() - pauseStartTime;
        isPaused = false;
        // Resume progress bar animation
        const progressBar = toast.querySelector('.toast-progress');
        if (progressBar) progressBar.style.animationPlayState = 'running';
        // Restart timer for remaining time
        startAutoHideTimer();
    };
    // Setup hover effects - isolated for this specific toast
    let isHovered = false;
    const handleMouseEnter = ()=>{
        if (isHovered || isDestroyed) return;
        isHovered = true;
        pauseToast();
    };
    const handleMouseLeave = ()=>{
        if (!isHovered || isDestroyed) return;
        isHovered = false;
        resumeToast();
    };
    // Bind events to this specific toast element
    toast.addEventListener('mouseenter', handleMouseEnter);
    toast.addEventListener('mouseleave', handleMouseLeave);
    // Cleanup function - isolated for this toast instance
    const cleanup = ()=>{
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
 */ const hideToast = (toast)=>{
    if (!toast || !toast.parentNode) return;
    // Call cleanup function if it exists
    if (typeof toast._cleanup === 'function') toast._cleanup();
    // Clear timeout if exists
    if (toast.dataset.timeoutId) clearTimeout(parseInt(toast.dataset.timeoutId));
    // Add hide animation
    toast.classList.add('toast-hide');
    // Remove from DOM after animation
    setTimeout(()=>{
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300); // Match CSS transition duration
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jnFvT":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"3h78u":[function(require,module,exports,__globalThis) {
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.pricing-tabs .tab');
    const carouselContainers = document.querySelectorAll('.pricing-carousel-container');
    function switchTab(tabType) {
        carouselContainers.forEach((container)=>{
            container.style.display = 'none';
        });
        const targetContainer = document.querySelector(`.pricing-carousel-container[data-tab="${tabType}"]`);
        if (targetContainer) targetContainer.style.display = 'block';
    }
    tabs.forEach((tab)=>{
        tab.addEventListener('click', function() {
            tabs.forEach((t)=>t.classList.remove('active'));
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
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(()=>{
            func.apply(context, args);
        }, delay);
    };
}
document.fonts.addEventListener('loadingdone', function() {
    const profileComparison = document.querySelector('.profile-comparison');
    const titles = profileComparison.querySelectorAll('.card-title');
    const headers = profileComparison.querySelectorAll('.card-header');
    function getMaxHeight() {
        let maxHeight = 0;
        titles.forEach((title)=>{
            maxHeight = Math.max(maxHeight, title.offsetHeight);
        });
        return maxHeight;
    }
    const maxHeight = getMaxHeight();
    headers.forEach((h)=>{
        h.style.minHeight = `${maxHeight}px`;
    });
    window.addEventListener('resize', ()=>{
        const maxHeight = getMaxHeight();
        headers.forEach((h)=>{
            h.style.minHeight = `${maxHeight}px`;
        });
    });
});

},{}],"9eRXX":[function(require,module,exports,__globalThis) {
document.addEventListener('DOMContentLoaded', function() {
    let swiperPricing1 = new Swiper('.swiper-section-pricing-1', {
        slidesPerView: 1,
        spaceBetween: 24,
        navigation: {
            nextEl: '.swiper-button-next-1',
            prevEl: '.swiper-button-prev-1'
        },
        pagination: {
            el: '.swiper-pagination-1',
            clickable: true
        },
        breakpoints: {
            390: {
                slidesPerView: 2,
                spaceBetween: 16
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 24
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 24
            }
        }
    });
    let swiperPricing2 = new Swiper('.swiper-section-pricing-2', {
        slidesPerView: 1,
        spaceBetween: 24,
        navigation: {
            nextEl: '.swiper-button-next-2',
            prevEl: '.swiper-button-prev-2'
        },
        pagination: {
            el: '.swiper-pagination-2',
            clickable: true
        },
        breakpoints: {
            390: {
                slidesPerView: 2,
                spaceBetween: 16
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 24
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 24
            }
        }
    });
    let swiperPricing3 = new Swiper('.swiper-section-pricing-3', {
        slidesPerView: 1,
        spaceBetween: 24,
        navigation: {
            nextEl: '.swiper-button-next-3',
            prevEl: '.swiper-button-prev-3'
        },
        pagination: {
            el: '.swiper-pagination-3',
            clickable: true
        },
        breakpoints: {
            390: {
                slidesPerView: 2,
                spaceBetween: 16
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 24
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 24
            }
        }
    });
    let swiperComparison1 = new Swiper('.swiper-section-comparison-1', {
        slidesPerView: 1,
        spaceBetween: 24,
        navigation: {
            nextEl: '.swiper-button-next-comparison-1',
            prevEl: '.swiper-button-prev-comparison-1'
        },
        pagination: {
            el: '.swiper-pagination-comparison-1',
            clickable: true
        },
        breakpoints: {
            390: {
                slidesPerView: 2,
                spaceBetween: 16
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 24
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 24
            }
        }
    });
});

},{}]},["lhpGb"], "lhpGb", "parcelRequireef94", {})

//# sourceMappingURL=d1sa.github.io.b828852a.js.map
