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

},{"./header.js":"7clXR","./forms.js":"14dZ8","./pricing.js":"3h78u"}],"7clXR":[function(require,module,exports,__globalThis) {
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

},{}],"14dZ8":[function(require,module,exports,__globalThis) {
// ==========================================================================
// Forms Management System - Main File
// ==========================================================================
// ==========================================================================
// Configuration
// ==========================================================================
// Telegram Bot Configuration
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
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
                alert("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435, \u0447\u0442\u043E \u0432\u044B \u043D\u0435 \u0440\u043E\u0431\u043E\u0442!");
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
            if (!trimmedValue) continue;
            // Validation
            if (key === 'tel') {
                if (!validatePhone(trimmedValue)) {
                    validation.isValid = false;
                    validation.errors.push("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0442\u0435\u043B\u0435\u0444\u043E\u043D");
                }
            }
            if (key === 'name') {
                if (trimmedValue.length < 2) {
                    validation.isValid = false;
                    validation.errors.push("\u0418\u043C\u044F \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043F\u0443\u0441\u0442\u044B\u043C");
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
        sendForm({
            message,
            formType
        });
    };
/**
 * Show form validation errors
 * @param {Object} validation - Validation result
 * @param {Object} formType - Form type
 */ const showFormErrors = (validation, formType)=>{
    const { modal } = formType;
    const mainForm = modal.nodeName === 'FORM' ? modal : modal.querySelector('.contact-form');
    let errorsContainer = mainForm.querySelector('.errorsContainer');
    if (!errorsContainer) {
        errorsContainer = document.createElement('div');
        errorsContainer.className = 'errorsContainer';
        // Insert before form fields
        const formFields = mainForm.querySelector('.form-fields');
        if (formFields) mainForm.insertBefore(errorsContainer, formFields);
        else mainForm.appendChild(errorsContainer);
    }
    errorsContainer.innerHTML = '';
    validation.errors.forEach((error)=>{
        const errorEl = document.createElement('div');
        errorEl.className = 'errorItem';
        errorEl.textContent = error;
        errorsContainer.appendChild(errorEl);
    });
};
/**
 * Handle successful form submission
 * @param {Object} formType - Form type
 */ const handleSubmissionSuccess = (formType)=>{
    const { type, modal } = formType;
    const successTemplates = {
        [FORM_TYPES.modal]: `
      <div class='form-header'>
        <h3>\u{417}\u{430}\u{44F}\u{432}\u{43A}\u{430} \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{43E}\u{442}\u{43F}\u{440}\u{430}\u{432}\u{43B}\u{435}\u{43D}\u{430}</h3>
        <p>\u{411}\u{43B}\u{430}\u{433}\u{43E}\u{434}\u{430}\u{440}\u{438}\u{43C} \u{432}\u{430}\u{441} \u{437}\u{430} \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{443}\u{44E} \u{43E}\u{442}\u{43F}\u{440}\u{430}\u{432}\u{43A}\u{443} \u{437}\u{430}\u{44F}\u{432}\u{43A}\u{438}! \u{41C}\u{44B} \u{441}\u{432}\u{44F}\u{436}\u{435}\u{43C}\u{441}\u{44F} \u{441} \u{432}\u{430}\u{43C}\u{438} \u{432} \u{441}\u{430}\u{43C}\u{43E}\u{435} \u{431}\u{43B}\u{438}\u{436}\u{430}\u{439}\u{448}\u{435}\u{435} \u{432}\u{440}\u{435}\u{43C}\u{44F}.</p>
      </div>
      <button class='btn btn-blue modal-close-button'>\u{417}\u{430}\u{43A}\u{440}\u{44B}\u{442}\u{44C}</button>
    `,
        [FORM_TYPES.registered]: `
      <div class='form-header'>
        <h3>\u{417}\u{430}\u{44F}\u{432}\u{43A}\u{430} \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{43E}\u{442}\u{43F}\u{440}\u{430}\u{432}\u{43B}\u{435}\u{43D}\u{430}</h3>
        <p>\u{41C}\u{44B} \u{441}\u{432}\u{44F}\u{436}\u{435}\u{43C}\u{441}\u{44F} \u{441} \u{432}\u{430}\u{43C}\u{438} \u{432} \u{441}\u{430}\u{43C}\u{43E}\u{435} \u{431}\u{43B}\u{438}\u{436}\u{430}\u{439}\u{448}\u{435}\u{435} \u{432}\u{440}\u{435}\u{43C}\u{44F}.</p>
      </div>
    `,
        default: `
      <div class='form-header'>
        <h3>\u{417}\u{430}\u{44F}\u{432}\u{43A}\u{430} \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{43E}\u{442}\u{43F}\u{440}\u{430}\u{432}\u{43B}\u{435}\u{43D}\u{430}</h3>
        <p>\u{41C}\u{44B} \u{441}\u{432}\u{44F}\u{436}\u{435}\u{43C}\u{441}\u{44F} \u{441} \u{432}\u{430}\u{43C}\u{438} \u{432} \u{441}\u{430}\u{43C}\u{43E}\u{435} \u{431}\u{43B}\u{438}\u{436}\u{430}\u{439}\u{448}\u{435}\u{435} \u{432}\u{440}\u{435}\u{43C}\u{44F}.</p>
      </div>
    `
    };
    const template = successTemplates[type] || successTemplates.default;
    const mainForm = modal.nodeName === 'FORM' ? modal : modal.querySelector('.contact-form');
    mainForm.innerHTML = template;
    // Add close handlers for modal
    if (type === FORM_TYPES.modal) {
        const closeButtons = modal.querySelectorAll('.modal-close-button');
        closeButtons.forEach((button)=>{
            button.addEventListener('click', (e)=>{
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
              <input type='text' name='name' placeholder='\u{412}\u{430}\u{448}\u{435} \u{438}\u{43C}\u{44F}' class='input' required />
            </div>
            <div class='form-field'>
              <input type='tel' name='tel' placeholder='+7' class='input' minlength="10" value='+7 ' required />
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
    closeIcon.addEventListener('click', (e)=>{
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
    console.log("\u2705 Forms system initialized successfully!");
    console.log(`\u{1F4CA} Registered forms: contactForm, leadForm, reviewLeadForm`);
    console.log(`\u{1F3AF} Modal triggers: [href="/forma-obratnoj-svyaz"]`);
}
// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeForms);

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
// ==========================================================================
// Pricing Section JavaScript
// ==========================================================================
// Import check icon with ?url to get URL string
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _iconCheckWhiteBlueCircleSvgUrl = require("../img/icon-check-white-blue-circle.svg?url");
var _iconCheckWhiteBlueCircleSvgUrlDefault = parcelHelpers.interopDefault(_iconCheckWhiteBlueCircleSvgUrl);
document.addEventListener('DOMContentLoaded', function() {
    console.log('checkIconSrc imported:', (0, _iconCheckWhiteBlueCircleSvgUrlDefault.default));
    // Responsive breakpoints for carousel
    const BREAKPOINTS = {
        MOBILE: 576,
        TABLET: 768,
        DESKTOP: 992
    };
    // Tab functionality
    const tabs = document.querySelectorAll('.pricing-tabs .tab');
    const pricingCards = document.getElementById('pricingCards');
    // Carousel functionality
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let slidesToShow = 4; // Number of cards visible at once (responsive)
    const totalSlides = document.querySelectorAll('.pricing-card').length;
    let maxSlide = Math.max(0, totalSlides - slidesToShow);
    // Tab switching
    tabs.forEach((tab)=>{
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach((t)=>t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            // Get the tab type
            const tabType = this.getAttribute('data-tab');
            // Update card content based on tab
            updateCardContent(tabType);
        });
    });
    // Helper function to get gap from CSS
    function getCarouselGap() {
        const firstCard = pricingCards.querySelector('.pricing-card');
        if (!firstCard) return 24; // fallback
        const containerStyles = getComputedStyle(pricingCards);
        return parseInt(containerStyles.gap) || 24;
    }
    // Helper function to calculate how many slides actually fit
    function calculateActualSlidesToShow() {
        const firstCard = pricingCards.querySelector('.pricing-card');
        if (!firstCard) return slidesToShow;
        const cardWidth = firstCard.offsetWidth;
        const gap = getCarouselGap();
        const carouselWidth = pricingCards.parentElement.offsetWidth;
        // Calculate how many full cards fit
        let actualSlides = 1;
        let totalWidth = cardWidth;
        while(actualSlides < totalSlides && totalWidth + gap + cardWidth <= carouselWidth){
            totalWidth += gap + cardWidth;
            actualSlides++;
        }
        console.log('Actual slides calculation:', {
            carouselWidth,
            cardWidth,
            gap,
            calculatedSlides: actualSlides,
            configuredSlides: slidesToShow
        });
        return Math.min(actualSlides, totalSlides);
    }
    // Carousel navigation
    function updateCarousel() {
        const firstCard = pricingCards.querySelector('.pricing-card');
        if (!firstCard) return;
        // Use actual slides that fit instead of configured value
        const actualSlidesToShow = calculateActualSlidesToShow();
        const actualMaxSlide = Math.max(0, totalSlides - actualSlidesToShow);
        const cardWidth = firstCard.offsetWidth;
        const gap = getCarouselGap();
        const carouselWidth = pricingCards.parentElement.offsetWidth;
        // Ensure currentSlide doesn't exceed the actual max
        if (currentSlide > actualMaxSlide) currentSlide = actualMaxSlide;
        // Debug info
        console.log('Carousel Debug:', {
            totalSlides,
            configuredSlidesToShow: slidesToShow,
            actualSlidesToShow,
            maxSlide,
            actualMaxSlide,
            currentSlide,
            cardWidth,
            gap,
            carouselWidth,
            expectedWidth: actualSlidesToShow * cardWidth + (actualSlidesToShow - 1) * gap
        });
        const translateX = currentSlide * (cardWidth + gap);
        pricingCards.style.transform = `translateX(-${translateX}px)`;
        // Update button states using actual max slide
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide >= actualMaxSlide;
    }
    // Unified carousel navigation function
    function navigateCarousel(direction) {
        const actualSlidesToShow = calculateActualSlidesToShow();
        const actualMaxSlide = Math.max(0, totalSlides - actualSlidesToShow);
        const newSlide = currentSlide + direction;
        if (newSlide >= 0 && newSlide <= actualMaxSlide) {
            currentSlide = newSlide;
            updateCarousel();
        }
    }
    prevBtn.addEventListener('click', ()=>navigateCarousel(-1));
    nextBtn.addEventListener('click', ()=>navigateCarousel(1));
    // Pricing data for different profile types
    const contentData = {
        whs: {
            brand: 'WHS',
            profiles: [
                {
                    title: "\u041E\u0434\u043D\u043E\u0441\u0442\u0432\u043E\u0440\u0447\u0430\u0442\u043E\u0435 \u043E\u043A\u043D\u043E",
                    price: "\u043E\u0442 4 500 \u20BD",
                    profile: 'WHS Profile 60',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 60 \u043C\u043C",
                    size: "600 \xd7 1200 \u043C\u043C (0,72 \u043C\xb2)",
                    features: [
                        "\u041F\u043E\u0432\u043E\u0440\u043E\u0442\u043D\u043E-\u043E\u0442\u043A\u0438\u0434\u043D\u0430\u044F \u0441\u0442\u0432\u043E\u0440\u043A\u0430",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 \u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                },
                {
                    title: "\u0414\u0432\u0443\u0445\u0441\u0442\u0432\u043E\u0440\u0447\u0430\u0442\u043E\u0435 \u043E\u043A\u043D\u043E",
                    price: "\u043E\u0442 7 200 \u20BD",
                    profile: 'WHS Profile 60',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 60 \u043C\u043C",
                    size: "1300 \xd7 1400 \u043C\u043C (1,82 \u043C\xb2)",
                    features: [
                        "\u041E\u0434\u043D\u0430 \u043F\u043E\u0432\u043E\u0440\u043E\u0442\u043D\u043E-\u043E\u0442\u043A\u0438\u0434\u043D\u0430\u044F, \u043E\u0434\u043D\u0430 \u0433\u043B\u0443\u0445\u0430\u044F \u0441\u0442\u0432\u043E\u0440\u043A\u0430",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 \u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                },
                {
                    title: "\u0422\u0440\u0435\u0445\u0441\u0442\u0432\u043E\u0440\u0447\u0430\u0442\u043E\u0435 \u043E\u043A\u043D\u043E",
                    price: "\u043E\u0442 10 800 \u20BD",
                    profile: 'WHS Profile 60',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 60 \u043C\u043C",
                    size: "2100 \xd7 1400 \u043C\u043C (2,94 \u043C\xb2)",
                    features: [
                        "\u0414\u0432\u0435 \u043F\u043E\u0432\u043E\u0440\u043E\u0442\u043D\u043E-\u043E\u0442\u043A\u0438\u0434\u043D\u044B\u0435, \u043E\u0434\u043D\u0430 \u0433\u043B\u0443\u0445\u0430\u044F \u0441\u0442\u0432\u043E\u0440\u043A\u0430",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 \u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                },
                {
                    title: "\u0411\u0430\u043B\u043A\u043E\u043D\u043D\u044B\u0439 \u0431\u043B\u043E\u043A",
                    price: "\u043E\u0442 12 500 \u20BD",
                    profile: 'WHS Profile 60',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 60 \u043C\u043C",
                    size: "2100 \xd7 2100 \u043C\u043C (4,41 \u043C\xb2)",
                    features: [
                        "\u041E\u043A\u043D\u043E + \u0431\u0430\u043B\u043A\u043E\u043D\u043D\u0430\u044F \u0434\u0432\u0435\u0440\u044C",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 \u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                },
                {
                    title: "\u041B\u043E\u0434\u0436\u0438\u044F",
                    price: "\u043E\u0442 12 500 \u20BD",
                    profile: 'WHS Profile 60',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 60 \u043C\u043C",
                    size: "3000 \xd7 1400 \u043C\u043C (4,2 \u043C\xb2)",
                    features: [
                        "\u041F\u0430\u043D\u043E\u0440\u0430\u043C\u043D\u043E\u0435 \u043E\u0441\u0442\u0435\u043A\u043B\u0435\u043D\u0438\u0435 \u043B\u043E\u0434\u0436\u0438\u0438",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 \u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                }
            ]
        },
        rehau: {
            brand: 'REHAU',
            profiles: [
                {
                    title: "\u041E\u0434\u043D\u043E\u0441\u0442\u0432\u043E\u0440\u0447\u0430\u0442\u043E\u0435 \u043E\u043A\u043D\u043E",
                    price: "\u043E\u0442 8 000 \u20BD",
                    profile: 'REHAU Blitz',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 60 \u043C\u043C",
                    size: "600 \xd7 1200 \u043C\u043C (0,72 \u043C\xb2)",
                    features: [
                        "\u041F\u043E\u0432\u043E\u0440\u043E\u0442\u043D\u043E-\u043E\u0442\u043A\u0438\u0434\u043D\u0430\u044F \u0441\u0442\u0432\u043E\u0440\u043A\u0430",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 i-\u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                },
                {
                    title: "\u0414\u0432\u0443\u0445\u0441\u0442\u0432\u043E\u0440\u0447\u0430\u0442\u043E\u0435 \u043E\u043A\u043D\u043E",
                    price: "\u043E\u0442 12 700 \u20BD",
                    profile: 'REHAU Blitz',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 60 \u043C\u043C",
                    size: "1300 \xd7 1400 \u043C\u043C (1,82 \u043C\xb2)",
                    features: [
                        "\u041E\u0434\u043D\u0430 \u043F\u043E\u0432\u043E\u0440\u043E\u0442\u043D\u043E-\u043E\u0442\u043A\u0438\u0434\u043D\u0430\u044F, \u043E\u0434\u043D\u0430 \u0433\u043B\u0443\u0445\u0430\u044F \u0441\u0442\u0432\u043E\u0440\u043A\u0430",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 i-\u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                },
                {
                    title: "\u0422\u0440\u0435\u0445\u0441\u0442\u0432\u043E\u0440\u0447\u0430\u0442\u043E\u0435 \u043E\u043A\u043D\u043E",
                    price: "\u043E\u0442 18 800 \u20BD",
                    profile: 'REHAU Blitz',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 60 \u043C\u043C",
                    size: "2100 \xd7 1400 \u043C\u043C (2,94 \u043C\xb2)",
                    features: [
                        "\u0414\u0432\u0435 \u043F\u043E\u0432\u043E\u0440\u043E\u0442\u043D\u043E-\u043E\u0442\u043A\u0438\u0434\u043D\u044B\u0435, \u043E\u0434\u043D\u0430 \u0433\u043B\u0443\u0445\u0430\u044F \u0441\u0442\u0432\u043E\u0440\u043A\u0430",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 i-\u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                },
                {
                    title: "\u0411\u0430\u043B\u043A\u043E\u043D\u043D\u044B\u0439 \u0431\u043B\u043E\u043A",
                    price: "\u043E\u0442 20 700 \u20BD",
                    profile: 'REHAU Blitz',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 60 \u043C\u043C",
                    size: "2100 \xd7 2100 \u043C\u043C (4,41 \u043C\xb2)",
                    features: [
                        "\u041E\u043A\u043D\u043E + \u0431\u0430\u043B\u043A\u043E\u043D\u043D\u0430\u044F \u0434\u0432\u0435\u0440\u044C",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 i-\u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                },
                {
                    title: "\u041B\u043E\u0434\u0436\u0438\u044F",
                    price: "\u043E\u0442 20 700 \u20BD",
                    profile: 'REHAU Blitz',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 60 \u043C\u043C",
                    size: "3000 \xd7 1400 \u043C\u043C (4,2 \u043C\xb2)",
                    features: [
                        "\u041F\u0430\u043D\u043E\u0440\u0430\u043C\u043D\u043E\u0435 \u043E\u0441\u0442\u0435\u043A\u043B\u0435\u043D\u0438\u0435 \u043B\u043E\u0434\u0436\u0438\u0438",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 i-\u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                }
            ]
        },
        veka: {
            brand: 'VEKA',
            profiles: [
                {
                    title: "\u041E\u0434\u043D\u043E\u0441\u0442\u0432\u043E\u0440\u0447\u0430\u0442\u043E\u0435 \u043E\u043A\u043D\u043E",
                    price: "\u043E\u0442 6 000 \u20BD",
                    profile: 'VEKA Evroline 58',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 58 \u043C\u043C",
                    size: "600 \xd7 1200 \u043C\u043C (0,72 \u043C\xb2)",
                    features: [
                        "\u041F\u043E\u0432\u043E\u0440\u043E\u0442\u043D\u043E-\u043E\u0442\u043A\u0438\u0434\u043D\u0430\u044F \u0441\u0442\u0432\u043E\u0440\u043A\u0430",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 \u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                },
                {
                    title: "\u0414\u0432\u0443\u0445\u0441\u0442\u0432\u043E\u0440\u0447\u0430\u0442\u043E\u0435 \u043E\u043A\u043D\u043E",
                    price: "\u043E\u0442 9 700 \u20BD",
                    profile: 'VEKA Evroline 58',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 58 \u043C\u043C",
                    size: "1300 \xd7 1400 \u043C\u043C (1,82 \u043C\xb2)",
                    features: [
                        "\u041E\u0434\u043D\u0430 \u043F\u043E\u0432\u043E\u0440\u043E\u0442\u043D\u043E-\u043E\u0442\u043A\u0438\u0434\u043D\u0430\u044F, \u043E\u0434\u043D\u0430 \u0433\u043B\u0443\u0445\u0430\u044F \u0441\u0442\u0432\u043E\u0440\u043A\u0430",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 \u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                },
                {
                    title: "\u0422\u0440\u0435\u0445\u0441\u0442\u0432\u043E\u0440\u0447\u0430\u0442\u043E\u0435 \u043E\u043A\u043D\u043E",
                    price: "\u043E\u0442 13 800 \u20BD",
                    profile: 'VEKA Evroline 58',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 58 \u043C\u043C",
                    size: "2100 \xd7 1400 \u043C\u043C (2,94 \u043C\xb2)",
                    features: [
                        "\u0414\u0432\u0435 \u043F\u043E\u0432\u043E\u0440\u043E\u0442\u043D\u043E-\u043E\u0442\u043A\u0438\u0434\u043D\u044B\u0435, \u043E\u0434\u043D\u0430 \u0433\u043B\u0443\u0445\u0430\u044F \u0441\u0442\u0432\u043E\u0440\u043A\u0430",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 \u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                },
                {
                    title: "\u0411\u0430\u043B\u043A\u043E\u043D\u043D\u044B\u0439 \u0431\u043B\u043E\u043A",
                    price: "\u043E\u0442 15 700 \u20BD",
                    profile: 'VEKA Evroline 58',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 58 \u043C\u043C",
                    size: "2100 \xd7 2100 \u043C\u043C (4,41 \u043C\xb2)",
                    features: [
                        "\u041E\u043A\u043D\u043E + \u0431\u0430\u043B\u043A\u043E\u043D\u043D\u0430\u044F \u0434\u0432\u0435\u0440\u044C",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 \u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                },
                {
                    title: "\u041B\u043E\u0434\u0436\u0438\u044F",
                    price: "\u043E\u0442 15 700 \u20BD",
                    profile: 'VEKA Evroline 58',
                    chambers: "3 \u043A\u0430\u043C\u0435\u0440\u044B, 58 \u043C\u043C",
                    size: "3000 \xd7 1400 \u043C\u043C (4,2 \u043C\xb2)",
                    features: [
                        "\u041F\u0430\u043D\u043E\u0440\u0430\u043C\u043D\u043E\u0435 \u043E\u0441\u0442\u0435\u043A\u043B\u0435\u043D\u0438\u0435 \u043B\u043E\u0434\u0436\u0438\u0438",
                        "\u0414\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0435\u043A\u043B\u043E\u043F\u0430\u043A\u0435\u0442 24/32 \u043C\u043C",
                        "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u0435 \u0441\u0442\u0435\u043A\u043B\u043E"
                    ]
                }
            ]
        }
    };
    // Update card content based on selected tab
    function updateCardContent(tabType) {
        const cards = document.querySelectorAll('.pricing-card');
        const data = contentData[tabType];
        cards.forEach((card, index)=>{
            if (data.profiles[index]) {
                const profile = data.profiles[index];
                // Update card title
                const titleElement = card.querySelector('.card-title');
                if (titleElement) titleElement.textContent = profile.title;
                // Update window size
                const sizeElement = card.querySelector('.size-value');
                if (sizeElement) sizeElement.textContent = profile.size;
                // Update price
                const priceElement = card.querySelector('.card-price');
                if (priceElement) priceElement.textContent = profile.price;
                // Update all features
                const featuresList = card.querySelector('.features-list');
                if (featuresList) {
                    featuresList.innerHTML = '';
                    // Prepare complete features array with profile info
                    const allFeatures = [
                        profile.features[0],
                        `<span class="highlight">${profile.profile}:</span> ${profile.chambers}`,
                        ...profile.features.slice(1)
                    ];
                    // Generate feature items dynamically
                    allFeatures.forEach((featureText)=>{
                        if (featureText) {
                            // Only add if feature exists
                            const featureItem = document.createElement('div');
                            featureItem.className = 'feature-item';
                            featureItem.innerHTML = `
                <img src="/img/icon-check-white-blue-circle.svg" alt="check" class="check-icon" width="24" height="24">
                <p class="feature-text">${featureText}</p>
              `;
                            featuresList.appendChild(featureItem);
                        }
                    });
                }
            }
        });
    }
    // Touch/swipe functionality for mobile
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    pricingCards.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    });
    pricingCards.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        // Prevent default only if horizontal movement is greater than vertical
        // This allows vertical scrolling while enabling horizontal swiping
        if (diffX > diffY && diffX > 10) e.preventDefault();
    });
    pricingCards.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            // Minimum swipe distance
            const actualSlidesToShow = calculateActualSlidesToShow();
            const actualMaxSlide = Math.max(0, totalSlides - actualSlidesToShow);
            if (diff > 0 && currentSlide < actualMaxSlide) {
                // Swipe left - next slide
                currentSlide++;
                updateCarousel();
            } else if (diff < 0 && currentSlide > 0) {
                // Swipe right - previous slide
                currentSlide--;
                updateCarousel();
            }
        }
        isDragging = false;
    });
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const actualSlidesToShow = calculateActualSlidesToShow();
        const actualMaxSlide = Math.max(0, totalSlides - actualSlidesToShow);
        if (e.key === 'ArrowLeft' && currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        } else if (e.key === 'ArrowRight' && currentSlide < actualMaxSlide) {
            currentSlide++;
            updateCarousel();
        }
    });
    // Responsive handling
    function handleResize() {
        const width = window.innerWidth;
        // Calculate slides to show based on screen width
        const slidesConfig = [
            {
                maxWidth: BREAKPOINTS.MOBILE,
                slides: 1
            },
            {
                maxWidth: BREAKPOINTS.TABLET,
                slides: 2
            },
            {
                maxWidth: BREAKPOINTS.DESKTOP,
                slides: 3
            },
            {
                maxWidth: Infinity,
                slides: 4
            }
        ];
        const newSlidesToShow = slidesConfig.find((config)=>width < config.maxWidth).slides;
        if (newSlidesToShow !== slidesToShow) {
            // Update configured slides to show
            slidesToShow = newSlidesToShow;
            maxSlide = Math.max(0, totalSlides - slidesToShow);
            // Reset carousel position and update
            currentSlide = 0;
            updateCarousel();
        } else // Even if slidesToShow didn't change, we should recalculate on resize
        updateCarousel();
    }
    window.addEventListener('resize', handleResize);
    // Initialize responsive layout
    handleResize();
    // Initialize carousel
    updateCarousel();
    // Initialize with default tab content (WHS - matches active tab)
    updateCardContent('whs');
});

},{"../img/icon-check-white-blue-circle.svg?url":"4DjLG","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"4DjLG":[function() {},{}]},["lhpGb"], "lhpGb", "parcelRequireef94", {})

//# sourceMappingURL=d1sa.github.io.b828852a.js.map
