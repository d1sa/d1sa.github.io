// ==========================================================================
// Analytics Module
// ==========================================================================

/**
 * Get client IP address
 * @returns {Promise<string>} - Client IP
 */
export const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'Не определен';
  }
};

/**
 * Get UTM parameters from URL
 * @returns {Object} - UTM parameters
 */
export const getUTMParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {};

  for (let [key, value] of urlParams.entries()) {
    if (key.startsWith('utm_')) {
      utmParams[key] = value;
    }
  }

  return utmParams;
};

/**
 * Get user device information
 * Tries exact brand/model first, then approximate, then unknown.
 * @returns {Object} - Device info
 */
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent || '';

  const isIPadDesktopUA =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  const isAndroid = /Android/i.test(userAgent);
  const isIPhone = /iPhone/i.test(userAgent);
  const isIPad = /iPad/i.test(userAgent) || isIPadDesktopUA;
  const isIOSLike = /iPhone|iPad|iPod/i.test(userAgent) || isIPadDesktopUA;

  const isMobile =
    (isAndroid && /Mobile/i.test(userAgent)) ||
    isIPhone ||
    (!!navigator.userAgentData && navigator.userAgentData.mobile === true);
  const isTablet = isIPad || (isAndroid && !/Mobile/i.test(userAgent));

  const screenMin = Math.min(screen.width, screen.height);
  const screenMax = Math.max(screen.width, screen.height);
  const dpr = Math.round(window.devicePixelRatio || 1);

  const screenKey = `${screenMin}x${screenMax}@${dpr}`;

  function approximateIPhoneModel() {
    const map = {
      '320x568@2': 'iPhone SE / 5/5s/5c (approx.)',
      '375x667@2': 'iPhone 6/6s/7/8/SE 2-3 (approx.)',
      '414x736@3': 'iPhone 6+/6s+/7+/8+ (approx.)',
      '375x812@3': 'iPhone X/XS/11 Pro (approx.)',
      '360x780@3': 'iPhone 12 mini/13 mini (approx.)',
      '390x844@3': 'iPhone 12/13/14/16e (approx.)',
      '393x852@3': 'iPhone 14 Pro/15 Pro/16 (approx.)',
      '402x874@3': 'iPhone 16 Pro (approx.)',
      '428x926@3': 'iPhone 12/13 Pro Max / 14 Plus (approx.)',
      '430x932@3': 'iPhone 14 Pro Max / 15 Pro Max / 16 Plus (approx.)',
      '440x956@3': 'iPhone 16 Pro Max (approx.)',
    };
    return map[screenKey] || 'iPhone (модель не распознана)';
  }

  function guessAndroidBrandFromModel(model) {
    const m = model || '';
    if (/POCO/i.test(m)) return 'POCO';
    if (/Redmi/i.test(m)) return 'Redmi';
    if (/SM-|SAMSUNG|Samsung|GT-|SCH-|SGH-/i.test(m)) return 'Samsung';
    if (/ONEPLUS|LE\d|NE\d/i.test(m)) return 'OnePlus';
    if (/Pixel|Nexus|Google/i.test(m)) return 'Google';
    if (/HUAWEI|Huawei|HONOR|Honor|EVA-|VOG-|LYA-|CLT-|ANE-/i.test(m))
      return /HONOR|Honor/i.test(m) ? 'Honor' : 'Huawei';
    if (/CPH\d|OPPO|P[A-Z]\d{3}/i.test(m)) return 'OPPO';
    if (/Vivo|V\d{3}/i.test(m)) return 'Vivo';
    if (/RMX\d|Realme/i.test(m)) return 'Realme';
    if (/Moto|Motorola|XT\d/i.test(m)) return 'Motorola';
    if (/ASUS|ROG|AI\d/i.test(m)) return 'ASUS';
    if (/Sony|XQ-|H\d{4}/i.test(m)) return 'Sony';
    if (/Xiaomi|Mi\s|MIX\s|M\d{4}/i.test(m)) return 'Xiaomi';
    return null;
  }

  function extractAndroidModelFromUA(ua) {
    try {
      const afterAndroid = ua.split(/Android\s+[\d.]+\s*;\s*/i)[1];
      if (!afterAndroid) return null;
      const untilParen = afterAndroid.split(')')[0];
      const tokens = untilParen.split(/;\s*/);
      const candidate = tokens.find(t => {
        const token = t.trim();
        if (!token) return false;
        if (/^[a-z]{2}-[A-Z]{2}$/.test(token)) return false; // locale
        if (/Build\//i.test(token)) return false;
        if (/Linux|U|wv|AppleWebKit|KHTML|Version|Mobile/i.test(token))
          return false;
        if (/^\d+(?:[._]\d+)*$/.test(token)) return false; // pure version
        return /[A-Za-z]/.test(token) && /[0-9A-Za-z-]/.test(token);
      });
      return candidate ? candidate.trim() : null;
    } catch (e) {
      return null;
    }
  }

  let brand = null;
  let model = null;
  let deviceModel = 'Неизвестное устройство';
  let approximationLevel = 'unknown';

  if (isIPhone) {
    const exactModelMatch = userAgent.match(
      /\(([^;]+);\s*CPU\s+iPhone\s+OS\s+(\d+)_(\d+)/
    );
    brand = 'Apple';
    if (exactModelMatch) {
      const modelInfo = exactModelMatch[1].trim();
      const majorVersion = parseInt(exactModelMatch[2]);
      const minorVersion = parseInt(exactModelMatch[3]);
      // Если указана конкретная модель, используем её
      if (modelInfo.includes('iPhone') && modelInfo !== 'iPhone') {
        model = modelInfo.replace(/^Apple\s+/i, '');
        approximationLevel = 'exact';
      } else {
        // Если точной модели нет, пробуем определить по экрану
        const approx = approximateIPhoneModel();
        if (approx && !/не распознана/i.test(approx)) {
          model = approx;
          approximationLevel = 'approximate';
        } else {
          model = `iPhone (iOS ${majorVersion}.${minorVersion})`;
          approximationLevel = 'approximate';
        }
      }
    } else {
      // Нет iOS версии в UA — определяем по экрану
      const approx = approximateIPhoneModel();
      model = approx;
      approximationLevel = 'approximate';
    }
  } else if (isIPad) {
    brand = 'Apple';
    model = 'iPad';
    approximationLevel = 'approximate';
  } else if (isAndroid) {
    const androidModel = extractAndroidModelFromUA(userAgent);
    if (androidModel) {
      model = androidModel;
      const guessed = guessAndroidBrandFromModel(androidModel);
      brand =
        guessed ||
        /(Samsung|Xiaomi|Huawei|OnePlus|Google|OPPO|Vivo|Realme|Redmi|POCO)/i.exec(
          userAgent
        )?.[1] ||
        null;
      approximationLevel = 'exact';
    } else {
      const match =
        /(Samsung|Xiaomi|Huawei|OnePlus|Google|OPPO|Vivo|Realme|Redmi|POCO)/i.exec(
          userAgent
        );
      if (match) {
        brand = match[1];
        model = `${brand} устройство`;
        approximationLevel = 'approximate';
      }
    }
  } else if (/Windows/i.test(userAgent)) {
    brand = null;
    model = 'Windows PC';
    approximationLevel = 'approximate';
  } else if (/Macintosh/i.test(userAgent) && !isIPadDesktopUA) {
    brand = 'Apple';
    model = 'Mac';
    approximationLevel = 'approximate';
  } else if (/Linux/i.test(userAgent)) {
    brand = null;
    model = 'Linux PC';
    approximationLevel = 'approximate';
  }

  if (brand && model) {
    const modelLower = model.toLowerCase();
    const brandLower = brand.toLowerCase();
    deviceModel = modelLower.includes(brandLower) ? model : `${brand} ${model}`;
  } else if (model) {
    deviceModel = model;
  } else if (isIOSLike) {
    deviceModel = isIPhone ? 'iPhone' : 'iPad';
  } else if (isAndroid) {
    deviceModel = 'Android устройство';
  } else {
    deviceModel = 'Не удалось определить устройство';
  }

  // Browser detection
  let browser = 'Неизвестный браузер';
  if (/YaBrowser|Yowser/i.test(userAgent)) browser = 'Yandex Browser';
  else if (/Edg\//i.test(userAgent)) browser = 'Edge';
  else if (/OPR\//i.test(userAgent)) browser = 'Opera';
  else if (/Chrome/i.test(userAgent) && !/Edg\//i.test(userAgent))
    browser = 'Chrome';
  else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
  else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent))
    browser = 'Safari';

  // OS version string
  let osVersion = 'Неизвестная ОС';
  if (/Windows NT/i.test(userAgent)) {
    const windowsMatch = userAgent.match(/Windows NT (\d+\.\d+)/);
    if (windowsMatch) {
      const version = parseFloat(windowsMatch[1]);
      osVersion =
        version >= 10.0
          ? 'Windows 11/10'
          : version >= 6.3
          ? 'Windows 8.1'
          : version >= 6.2
          ? 'Windows 8'
          : version >= 6.1
          ? 'Windows 7'
          : version >= 6.0
          ? 'Windows Vista'
          : 'Windows (старая версия)';
    } else {
      osVersion = 'Windows';
    }
  } else if (/Macintosh/i.test(userAgent) && !isIPadDesktopUA) {
    const macMatch = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    if (macMatch) {
      const version = macMatch[1].replace('_', '.');
      const versionNum = parseFloat(version);
      osVersion =
        versionNum >= 14.0
          ? 'macOS Sonoma (14+)'
          : versionNum >= 13.0
          ? 'macOS Ventura (13+)'
          : versionNum >= 12.0
          ? 'macOS Monterey (12+)'
          : versionNum >= 11.0
          ? 'macOS Big Sur (11+)'
          : versionNum >= 10.15
          ? 'macOS Catalina (10.15)'
          : versionNum >= 10.14
          ? 'macOS Mojave (10.14)'
          : 'macOS (старая версия)';
    } else {
      osVersion = 'macOS';
    }
  } else if (isIOSLike) {
    const iosMatch = userAgent.match(/OS (\d+)_?(\d+)?/);
    if (iosMatch) {
      const majorVersion = parseInt(iosMatch[1]);
      const minorVersion = iosMatch[2] ? parseInt(iosMatch[2]) : undefined;
      osVersion = `iOS/iPadOS ${majorVersion}${
        typeof minorVersion === 'number' ? `.${minorVersion}` : ''
      }`;
    } else {
      osVersion = isIPadDesktopUA ? 'iPadOS (approx.)' : 'iOS';
    }
  } else if (isAndroid) {
    const androidMatch = userAgent.match(/Android (\d+\.?\d*)/);
    if (androidMatch) {
      const version = parseFloat(androidMatch[1]);
      osVersion =
        version >= 14
          ? 'Android 14+'
          : version >= 13
          ? 'Android 13+'
          : version >= 12
          ? 'Android 12+'
          : version >= 11
          ? 'Android 11+'
          : version >= 10
          ? 'Android 10+'
          : version >= 9
          ? 'Android 9+'
          : 'Android (старая версия)';
    } else {
      osVersion = 'Android';
    }
  } else if (/Linux/i.test(userAgent)) {
    osVersion = 'Linux';
  }

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    deviceModel,
    brand: brand || '—',
    model: model || '—',
    approximation: approximationLevel,
    browser,
    osVersion,
    userAgent:
      userAgent.substring(0, 120) + (userAgent.length > 120 ? '…' : ''),
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};

/**
 * Get session information
 * @returns {Object} - Session info
 */
// ----------------------------------------------------------------------------
// Persistence helpers (handle iOS tab discard / reload)
// ----------------------------------------------------------------------------
const getOrInitTabId = () => {
  try {
    if (!window.name || !window.name.startsWith('tab:')) {
      window.name = `tab:${Math.random().toString(36).slice(2)}-${Date.now()}`;
    }
    return window.name;
  } catch (_) {
    return 'tab:unknown';
  }
};

const getAccActivePersistKey = () => `accActiveMs:${getOrInitTabId()}`;

const readPersistedAccActiveMs = () => {
  try {
    const key = getAccActivePersistKey();
    const value = localStorage.getItem(key);
    if (value != null) return parseInt(value) || 0;
    // Legacy/global fallback
    const legacy = localStorage.getItem('accActiveMsPersist');
    return legacy != null ? parseInt(legacy) || 0 : 0;
  } catch (_) {
    return 0;
  }
};

const writePersistedAccActiveMs = ms => {
  try {
    const normalized = Math.max(0, ms | 0);
    localStorage.setItem(getAccActivePersistKey(), String(normalized));
    // Keep a global backup to survive even if tab id changes
    localStorage.setItem('accActiveMsPersist', String(normalized));
  } catch (_) {}
};

export const getSessionInfo = () => {
  // Read accumulated active time (in ms) and estimate up to idle threshold
  const IDLE_THRESHOLD_MS = 30000; // 30s of inactivity switches to idle
  // Fallback to localStorage backup in case iOS discarded the page (sessionStorage lost)
  const accumulatedActiveMs = parseInt(
    sessionStorage.getItem('accActiveMs') ||
      (typeof readPersistedAccActiveMs === 'function'
        ? String(readPersistedAccActiveMs())
        : '0') ||
      '0'
  );
  const lastEventTs = parseInt(sessionStorage.getItem('lastEventTs') || '0');
  const isIdle = sessionStorage.getItem('isIdle') === '1';

  let activeMs = accumulatedActiveMs;
  if (!isIdle && lastEventTs) {
    // Add recent activity since last event, capped by idle threshold
    const delta = Date.now() - lastEventTs;
    activeMs += Math.max(0, Math.min(delta, IDLE_THRESHOLD_MS));
  }

  const timeOnSite = Math.max(Math.floor(activeMs / 1000), 0);

  const visitCount = parseInt(localStorage.getItem('visitCount') || '1');
  const lastVisit = localStorage.getItem('lastVisit');

  return {
    timeOnSite: `${Math.floor(timeOnSite / 60)}м ${timeOnSite % 60}с`,
    visitCount,
    lastVisit: lastVisit
      ? new Date(parseInt(lastVisit)).toLocaleDateString('ru-RU')
      : 'Первое посещение',
    currentPage: window.location.pathname,
    referrer: document.referrer || 'Прямой переход',
  };
};

/**
 * Initialize session tracking and activity listeners
 */
// ----------------------------------------------------------------------------
// Active time tracking (pure time on site)
// ----------------------------------------------------------------------------
const IDLE_THRESHOLD_MS = 30000; // 30 seconds of inactivity -> idle
let __idleTimerId = null;

const scheduleIdleTimer = () => {
  if (__idleTimerId) clearTimeout(__idleTimerId);
  __idleTimerId = setTimeout(() => {
    try {
      const last = parseInt(sessionStorage.getItem('lastEventTs') || '0');
      if (!last) {
        sessionStorage.setItem('isIdle', '1');
        sessionStorage.setItem('lastEventTs', Date.now().toString());
        // persist current accumulated value
        const acc = parseInt(sessionStorage.getItem('accActiveMs') || '0');
        writePersistedAccActiveMs(acc);
        return;
      }
      const now = Date.now();
      const delta = now - last;
      const addMs = Math.max(0, Math.min(delta, IDLE_THRESHOLD_MS));
      const acc = parseInt(sessionStorage.getItem('accActiveMs') || '0');
      const newAcc = acc + addMs;
      sessionStorage.setItem('accActiveMs', String(newAcc));
      writePersistedAccActiveMs(newAcc);
      sessionStorage.setItem('isIdle', '1');
      sessionStorage.setItem('lastEventTs', String(now));
    } catch (_) {}
  }, IDLE_THRESHOLD_MS);
};

const handleActivity = () => {
  try {
    const now = Date.now();
    const last = parseInt(sessionStorage.getItem('lastEventTs') || String(now));
    const wasIdle = sessionStorage.getItem('isIdle') === '1';

    if (!wasIdle) {
      const delta = now - last;
      if (delta > 0) {
        const acc = parseInt(sessionStorage.getItem('accActiveMs') || '0');
        const addMs = Math.max(0, Math.min(delta, IDLE_THRESHOLD_MS));
        const newAcc = acc + addMs;
        sessionStorage.setItem('accActiveMs', String(newAcc));
        writePersistedAccActiveMs(newAcc);
      }
    } else {
      // Transition from idle to active
      sessionStorage.setItem('isIdle', '0');
    }

    sessionStorage.setItem('lastEventTs', String(now));
  } catch (_) {}

  scheduleIdleTimer();
};

const forceFlushActiveTime = () => {
  try {
    const isIdle = sessionStorage.getItem('isIdle') === '1';
    const last = parseInt(sessionStorage.getItem('lastEventTs') || '0');
    if (!isIdle && last) {
      const now = Date.now();
      const delta = now - last;
      const addMs = Math.max(0, Math.min(delta, IDLE_THRESHOLD_MS));
      const acc = parseInt(sessionStorage.getItem('accActiveMs') || '0');
      const newAcc = acc + addMs;
      sessionStorage.setItem('accActiveMs', String(newAcc));
      writePersistedAccActiveMs(newAcc);
      sessionStorage.setItem('lastEventTs', String(now));
    }
  } catch (_) {}
};

export const initializeAnalytics = () => {
  // Ensure tab id exists early and preload persisted acc time if sessionStorage was wiped
  const persistedAcc = readPersistedAccActiveMs();

  // Core session info
  if (!sessionStorage.getItem('sessionStartTime')) {
    sessionStorage.setItem('sessionStartTime', Date.now().toString());
  }
  if (!sessionStorage.getItem('accActiveMs')) {
    sessionStorage.setItem('accActiveMs', String(persistedAcc));
  }
  sessionStorage.setItem('lastEventTs', Date.now().toString());
  sessionStorage.setItem('isIdle', '0');
  // Persist immediately to align storages
  try {
    writePersistedAccActiveMs(
      parseInt(sessionStorage.getItem('accActiveMs') || '0')
    );
  } catch (_) {}

  // Visit stats
  const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
  localStorage.setItem('visitCount', visitCount.toString());
  localStorage.setItem('lastVisit', Date.now().toString());

  // Unique pages in this session
  const viewedPages = JSON.parse(sessionStorage.getItem('viewedPages') || '[]');
  const currentPage = window.location.pathname;
  if (!viewedPages.includes(currentPage)) {
    viewedPages.push(currentPage);
    sessionStorage.setItem('viewedPages', JSON.stringify(viewedPages));
  }

  // Activity listeners (pure time tracking)
  const activityEvents = [
    'pointerdown',
    'pointerup',
    'mousemove',
    'keydown',
    'scroll',
    'touchstart',
    'click',
    'wheel',
  ];
  activityEvents.forEach(evt => {
    document.addEventListener(evt, handleActivity, { passive: true });
  });

  // Visibility/focus handling
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Go idle immediately and flush up to threshold since last event
      if (__idleTimerId) clearTimeout(__idleTimerId);
      try {
        const last = parseInt(sessionStorage.getItem('lastEventTs') || '0');
        const now = Date.now();
        if (last) {
          const delta = now - last;
          const addMs = Math.max(0, Math.min(delta, IDLE_THRESHOLD_MS));
          const acc = parseInt(sessionStorage.getItem('accActiveMs') || '0');
          const newAcc = acc + addMs;
          sessionStorage.setItem('accActiveMs', String(newAcc));
          writePersistedAccActiveMs(newAcc);
        }
        sessionStorage.setItem('isIdle', '1');
        sessionStorage.setItem('lastEventTs', String(Date.now()));
      } catch (_) {}
    } else {
      handleActivity();
    }
  });

  window.addEventListener('blur', () => {
    if (__idleTimerId) clearTimeout(__idleTimerId);
    try {
      const last = parseInt(sessionStorage.getItem('lastEventTs') || '0');
      const now = Date.now();
      if (last) {
        const delta = now - last;
        const addMs = Math.max(0, Math.min(delta, IDLE_THRESHOLD_MS));
        const acc = parseInt(sessionStorage.getItem('accActiveMs') || '0');
        const newAcc = acc + addMs;
        sessionStorage.setItem('accActiveMs', String(newAcc));
        writePersistedAccActiveMs(newAcc);
      }
      sessionStorage.setItem('isIdle', '1');
      sessionStorage.setItem('lastEventTs', String(Date.now()));
    } catch (_) {}
  });

  window.addEventListener('focus', () => handleActivity());

  // Flush active time when leaving
  window.addEventListener('beforeunload', () => {
    forceFlushActiveTime();
  });

  // iOS Safari often fires pagehide/pageshow and can discard bfcache/state
  window.addEventListener('pagehide', () => {
    try {
      forceFlushActiveTime();
      const acc = parseInt(sessionStorage.getItem('accActiveMs') || '0');
      writePersistedAccActiveMs(acc);
    } catch (_) {}
  });

  window.addEventListener('pageshow', evt => {
    try {
      // If the page was restored from BFCache, keep going; if it was a new load after discard, restore acc time
      if (evt.persisted) {
        // Just resume timers
        handleActivity();
      } else {
        // New context; restore from persistence
        const restored = readPersistedAccActiveMs();
        const current = parseInt(sessionStorage.getItem('accActiveMs') || '0');
        if (restored > current) {
          sessionStorage.setItem('accActiveMs', String(restored));
        }
        handleActivity();
      }
    } catch (_) {}
  });

  // Start idle timer
  scheduleIdleTimer();
};

/**
 * Collect all analytics info in one call
 */
export const collectAnalyticsInfo = async () => {
  const deviceInfo = getDeviceInfo();
  const sessionInfo = getSessionInfo();
  const utmParams = getUTMParams();
  const clientIP = await getClientIP();
  return { deviceInfo, sessionInfo, utmParams, clientIP };
};

/**
 * Format analytics block for Telegram message
 */
export const formatAnalyticsMessage = ({
  deviceInfo,
  sessionInfo,
  utmParams,
  clientIP,
}) => {
  let res = '';
  if (utmParams && Object.keys(utmParams).length > 0) {
    res += `\n\n<b>📈 UTM метки:</b>`;
    Object.entries(utmParams).forEach(([key, value]) => {
      const utmName = key
        .replace('utm_', '')
        .replace(/\b\w/g, l => l.toUpperCase());
      res += `\n${utmName}: <b>${value}</b>`;
    });
  }

  res += `\n\n<i>Информация о посетителе:</i>`;
  res += `\nВремя отправки: ${new Date().toLocaleString('ru-RU')}; `;
  res += `Устройство: ${
    deviceInfo.isMobile
      ? 'Мобильное'
      : deviceInfo.isTablet
      ? 'Планшет'
      : 'Десктоп'
  }; `;
  res += `Модель: ${deviceInfo.deviceModel}; `;
  res += `Браузер: ${deviceInfo.browser}; `;
  res += `ОС: ${deviceInfo.osVersion}; `;
  res += `Разрешение: ${deviceInfo.screenResolution}; `;
  res += `Язык: ${deviceInfo.language}; `;
  res += `⏱️ Время на сайте: <b>${sessionInfo.timeOnSite}</b>; `;
  res += `👥 Посещений: <b>${sessionInfo.visitCount}</b>; `;
  res += `🔗 Источник: <b>${sessionInfo.referrer}</b>; `;
  res += `IP: ${clientIP};`;
  return res;
};
