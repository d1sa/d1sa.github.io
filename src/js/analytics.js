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
export const getSessionInfo = () => {
  const sessionStart = sessionStorage.getItem('sessionStartTime');
  const lastActivity = sessionStorage.getItem('lastActivityTime');

  let timeOnSite = 0;
  if (sessionStart) {
    const startTime = parseInt(sessionStart);
    const currentTime = Date.now();
    if (lastActivity) {
      const lastActivityTime = parseInt(lastActivity);
      const activeTime = Math.floor((lastActivityTime - startTime) / 1000);
      timeOnSite = Math.max(activeTime, 0);
    } else {
      timeOnSite = Math.floor((currentTime - startTime) / 1000);
    }
  }

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
export const initializeAnalytics = () => {
  if (!sessionStorage.getItem('sessionStartTime')) {
    sessionStorage.setItem('sessionStartTime', Date.now().toString());
  }
  sessionStorage.setItem('lastActivityTime', Date.now().toString());

  const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
  localStorage.setItem('visitCount', visitCount.toString());
  localStorage.setItem('lastVisit', Date.now().toString());

  const viewedPages = JSON.parse(sessionStorage.getItem('viewedPages') || '[]');
  const currentPage = window.location.pathname;
  if (!viewedPages.includes(currentPage)) {
    viewedPages.push(currentPage);
    sessionStorage.setItem('viewedPages', JSON.stringify(viewedPages));
  }

  const updateActivity = () => {
    sessionStorage.setItem('lastActivityTime', Date.now().toString());
  };
  const events = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
  ];
  events.forEach(event => {
    document.addEventListener(event, updateActivity, { passive: true });
  });
  window.addEventListener('beforeunload', updateActivity);
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

  res += `\n\n<b>📊 Информация о посетителе:</b>`;
  res += `\n🕐 Время отправки: <b>${new Date().toLocaleString('ru-RU')}</b>`;
  res += `\n💻 Устройство: <b>${
    deviceInfo.isMobile
      ? 'Мобильное'
      : deviceInfo.isTablet
      ? 'Планшет'
      : 'Десктоп'
  }</b>`;
  res += `\n📱 Модель: <b>${deviceInfo.deviceModel}</b>`;
  res += `\n🌐 Браузер: <b>${deviceInfo.browser}</b>`;
  res += `\n💻 ОС: <b>${deviceInfo.osVersion}</b>`;
  res += `\n📱 Разрешение: <b>${deviceInfo.screenResolution}</b>`;
  res += `\n🌍 Язык: <b>${deviceInfo.language}</b>`;
  res += `\n⏱️ Время на сайте: <b>${sessionInfo.timeOnSite}</b>`;
  res += `\n👥 Посещений: <b>${sessionInfo.visitCount}</b>`;
  res += `\n🔗 Источник: <b>${sessionInfo.referrer}</b>`;
  res += `\n🌐 IP: <b>${clientIP}</b>`;
  return res;
};
