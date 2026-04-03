import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  NativeModules,
  PixelRatio,
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const buildExtinfoArray = async () => {
  const screen = Dimensions.get('screen');
  const pixelRatio = PixelRatio.get();

  // Native pixel resolution
  const nativeWidth = Math.round(screen.width * pixelRatio);
  const nativeHeight = Math.round(screen.height * pixelRatio);

  // Async device info
  const [carrier, totalDisk, freeDisk, cpuCores] = await Promise.all([
    DeviceInfo.getCarrier().catch(() => 'unknown'),
    DeviceInfo.getTotalDiskCapacity().catch(() => 0),
    DeviceInfo.getFreeDiskStorage().catch(() => 0),
    DeviceInfo.getSystemCpuCount().catch(() => 0),
  ]);

  // Locale in "xx_XX" format
  let locale = 'unknown';
  if (Platform.OS === 'ios') {
    const settings = NativeModules.SettingsManager?.settings;
    const raw =
      settings?.AppleLocale || settings?.AppleLanguages?.[0] || 'unknown';
    locale = raw.replace('-', '_');
  } else {
    const raw = Intl.DateTimeFormat().resolvedOptions().locale || 'unknown';
    locale = raw.replace('-', '_');
  }

  // Timezone
  const timezoneId = Intl.DateTimeFormat().resolvedOptions().timeZone; // Europe/Kyiv
  const timezoneAbbr =
    new Intl.DateTimeFormat('en', {timeZoneName: 'short'})
      .formatToParts(new Date())
      .find(p => p.type === 'timeZoneName')?.value || 'unknown'; // EET

  return [
    'i2', // 0:  version / platform type (manual)
    DeviceInfo.getBundleId(), // 1:  bundle id
    DeviceInfo.getVersion(), // 2:  short version (CFBundleShortVersionString)
    DeviceInfo.getBuildNumber(), // 3:  long version (CFBundleVersion)
    DeviceInfo.getSystemVersion(), // 4:  OS version
    DeviceInfo.getDeviceId(), // 5:  device model (e.g. iPhone14,5)
    locale, // 6:  locale (e.g. uk_UA)
    timezoneAbbr, // 7:  timezone abbreviation (e.g. EET)
    carrier, // 8:  carrier name
    nativeWidth, // 9:  screen width (native px)
    nativeHeight, // 10: screen height (native px)
    pixelRatio, // 11: screen density / scale
    cpuCores, // 12: CPU cores count
    Math.round(totalDisk / 1e9), // 13: total storage GB
    Math.round(freeDisk / 1e9), // 14: free storage GB
    timezoneId, // 15: timezone identifier (e.g. Europe/Kyiv)
  ];
};

//// Реєстрація подій
{
  /**
  const injectedJS = `
(function() {
  if (window.__RN_MULTI_STEP_TRACKER_INSTALLED__) {
    true;
  }

  window.__RN_MULTI_STEP_TRACKER_INSTALLED__ = true;
  window.__RN_REGISTRATION_SENT__ = false;
  window.__RN_COLLECTED_EMAIL__ = '';
  window.__RN_COLLECTED_PHONE__ = '';

  function normalize(value) {
    return String(value || '').trim();
  }

  function normalizeEmail(value) {
    return normalize(value).toLowerCase();
  }

  function looksLikeEmail(value) {
    return /.+@.+\\..+/.test(String(value || '').trim());
  }

  function looksLikePhone(value) {
    const cleaned = String(value || '').replace(/[^\\d+]/g, '');
    return cleaned.length >= 7;
  }

  function getAllInputs() {
    return Array.from(document.querySelectorAll('input'));
  }

  function detectEmail() {
    const inputs = getAllInputs();

    for (const input of inputs) {
      const value = normalizeEmail(input.value);
      const type = (input.getAttribute('type') || '').toLowerCase();
      const name = (input.getAttribute('name') || '').toLowerCase();
      const id = (input.getAttribute('id') || '').toLowerCase();
      const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();

      if (
        type === 'email' ||
        name.includes('email') ||
        id.includes('email') ||
        placeholder.includes('email')
      ) {
        if (looksLikeEmail(value)) return value;
      }

      if (looksLikeEmail(value)) {
        return value;
      }
    }

    return '';
  }

  function detectPhone() {
    const inputs = getAllInputs();

    for (const input of inputs) {
      const value = normalize(input.value);
      const type = (input.getAttribute('type') || '').toLowerCase();
      const name = (input.getAttribute('name') || '').toLowerCase();
      const id = (input.getAttribute('id') || '').toLowerCase();
      const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();

      const looksLikePhoneField =
        type === 'tel' ||
        name.includes('phone') ||
        name.includes('contact') ||
        id.includes('phone') ||
        id.includes('contact') ||
        placeholder.includes('phone') ||
        placeholder.includes('contact');

      if (looksLikePhoneField && looksLikePhone(value)) {
        return value;
      }
    }

    // fallback: беремо найбільш схоже поле, але НЕ тільки "+1"
    for (const input of inputs) {
      const value = normalize(input.value);

      if (
        looksLikePhone(value) &&
        value !== '+1' &&
        value !== '1'
      ) {
        return value;
      }
    }

    return '';
  }

  function collectStepData() {
    const email = detectEmail();
    const phone = detectPhone();

    if (email) {
      window.__RN_COLLECTED_EMAIL__ = email;
    }

    if (phone) {
      window.__RN_COLLECTED_PHONE__ = phone;
    }
  }

  function sendRegistration(source) {
    if (window.__RN_REGISTRATION_SENT__) {
      return;
    }

    collectStepData();

    const payload = {
      event: 'registration_form',
      source: source,
      email: window.__RN_COLLECTED_EMAIL__ || '',
      phone: window.__RN_COLLECTED_PHONE__ || '',
      ts: Date.now()
    };

    // не шлемо зовсім пустий payload
    if (!payload.email && !payload.phone) {
      return;
    }

    window.__RN_REGISTRATION_SENT__ = true;

    try {
      window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    } catch (e) {}
  }

  // слідкуємо за будь-яким вводом і кешуємо email/phone
  document.addEventListener('input', function() {
    collectStepData();
  }, true);

  document.addEventListener('change', function() {
    collectStepData();
  }, true);

  // ловимо кліки по кнопках
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (!target) return;

    const button = target.closest('button, input[type="submit"], input[type="button"], div[role="button"]');
    if (!button) return;

    const text = (
      button.innerText ||
      button.value ||
      button.getAttribute('aria-label') ||
      ''
    ).toLowerCase().trim();

    // на першому кроці просто кешуємо email
    if (
      text.includes('sign up') ||
      text.includes('signup') ||
      text.includes('continue') ||
      text.includes('next')
    ) {
      setTimeout(function() {
        collectStepData();
      }, 200);
      return;
    }

    // на другому кроці шлемо фінальні дані
    if (
      text.includes('save') ||
      text.includes('submit') ||
      text.includes('finish') ||
      text.includes('complete')
    ) {
      setTimeout(function() {
        sendRegistration('save_click');
      }, 300);
    }
  }, true);

  // якщо сторінка SPA і DOM міняється — оновлюємо кеш
  const observer = new MutationObserver(function() {
    collectStepData();
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
  });

  // початковий збір
  collectStepData();
})();
true;
`;
 
   
  const injectedJS = `
(function() {
  if (window.__RN_MULTI_STEP_TRACKER_INSTALLED__) {
    true;
  }

  window.__RN_MULTI_STEP_TRACKER_INSTALLED__ = true;
  window.__RN_REGISTRATION_SENT__ = false;
  window.__RN_COLLECTED_EMAIL__ = '';
  window.__RN_COLLECTED_PHONE__ = '';

  function normalize(value) {
    return String(value || '').trim();
  }

  function normalizeEmail(value) {
    return normalize(value).toLowerCase();
  }

  function looksLikeEmail(value) {
    return /.+@.+\\..+/.test(String(value || '').trim());
  }

  function looksLikePhone(value) {
    const cleaned = String(value || '').replace(/[^\\d+]/g, '');
    return cleaned.length >= 7;
  }

  function getAllInputs() {
    return Array.from(document.querySelectorAll('input'));
  }

  function detectEmail() {
    const inputs = getAllInputs();

    for (const input of inputs) {
      const value = normalizeEmail(input.value);
      const type = (input.getAttribute('type') || '').toLowerCase();
      const name = (input.getAttribute('name') || '').toLowerCase();
      const id = (input.getAttribute('id') || '').toLowerCase();
      const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();

      if (
        type === 'email' ||
        name.includes('email') ||
        id.includes('email') ||
        placeholder.includes('email')
      ) {
        if (looksLikeEmail(value)) return value;
      }

      if (looksLikeEmail(value)) {
        return value;
      }
    }

    return '';
  }

  function extractCountryCodeFromText(text) {
    const value = String(text || '').trim();
    const match = value.match(/\\+\\d{1,4}/);
    return match ? match[0] : '';
  }

  function detectCountryCode() {
    const inputs = getAllInputs();

    for (const input of inputs) {
      const value = normalize(input.value);
      const name = (input.getAttribute('name') || '').toLowerCase();
      const id = (input.getAttribute('id') || '').toLowerCase();
      const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();
      const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();

      const looksLikeCodeField =
        name.includes('code') ||
        name.includes('country') ||
        id.includes('code') ||
        id.includes('country') ||
        placeholder.includes('code') ||
        placeholder.includes('country') ||
        ariaLabel.includes('code') ||
        ariaLabel.includes('country');

      if (looksLikeCodeField) {
        const code = extractCountryCodeFromText(value);
        if (code) return code;
      }
    }

    const allElements = Array.from(
      document.querySelectorAll('input, button, div, span')
    );

    for (const el of allElements) {
      const text = normalize(el.innerText || el.textContent || el.value || '');
      const code = extractCountryCodeFromText(text);
      if (code) {
        return code;
      }
    }

    return '';
  }

  function detectLocalPhone() {
    const inputs = getAllInputs();

    for (const input of inputs) {
      const value = normalize(input.value);
      const type = (input.getAttribute('type') || '').toLowerCase();
      const name = (input.getAttribute('name') || '').toLowerCase();
      const id = (input.getAttribute('id') || '').toLowerCase();
      const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();
      const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();

      const looksLikePhoneField =
        type === 'tel' ||
        name.includes('phone') ||
        name.includes('contact') ||
        id.includes('phone') ||
        id.includes('contact') ||
        placeholder.includes('phone') ||
        placeholder.includes('contact') ||
        ariaLabel.includes('phone') ||
        ariaLabel.includes('contact');

      if (looksLikePhoneField) {
        const cleaned = value.replace(/[^\\d]/g, '');
        if (cleaned.length >= 6) {
          return cleaned;
        }
      }
    }

    for (const input of inputs) {
      const value = normalize(input.value);
      const digitsOnly = value.replace(/[^\\d]/g, '');

      if (
        digitsOnly.length >= 6 &&
        value !== '+1' &&
        value !== '+40' &&
        value !== '1' &&
        value !== '40'
      ) {
        return digitsOnly;
      }
    }

    return '';
  }

  function buildFullPhone() {
    const code = detectCountryCode();
    const localPhone = detectLocalPhone();

    if (!localPhone) return '';

    if (!code) return localPhone;

    return code + ' ' + localPhone;
  }

  function collectStepData() {
    const email = detectEmail();
    const phone = buildFullPhone();

    if (email) {
      window.__RN_COLLECTED_EMAIL__ = email;
    }

    if (phone) {
      window.__RN_COLLECTED_PHONE__ = phone;
    }
  }

  function sendRegistration(source) {
    if (window.__RN_REGISTRATION_SENT__) {
      return;
    }

    collectStepData();

    const payload = {
      event: 'registration_form',
      source: source,
      email: window.__RN_COLLECTED_EMAIL__ || '',
      phone: window.__RN_COLLECTED_PHONE__ || '',
      ts: Date.now()
    };

    if (!payload.email && !payload.phone) {
      return;
    }

    window.__RN_REGISTRATION_SENT__ = true;

    try {
      window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    } catch (e) {}
  }

  document.addEventListener('input', function() {
    collectStepData();
  }, true);

  document.addEventListener('change', function() {
    collectStepData();
  }, true);

  document.addEventListener('click', function(e) {
    const target = e.target;
    if (!target) return;

    const button = target.closest('button, input[type="submit"], input[type="button"], div[role="button"]');
    if (!button) return;

    const text = (
      button.innerText ||
      button.value ||
      button.getAttribute('aria-label') ||
      ''
    ).toLowerCase().trim();

    if (
      text.includes('sign up') ||
      text.includes('signup') ||
      text.includes('continue') ||
      text.includes('next')
    ) {
      setTimeout(function() {
        collectStepData();
      }, 200);
      return;
    }

    if (
      text.includes('save') ||
      text.includes('submit') ||
      text.includes('finish') ||
      text.includes('complete')
    ) {
      setTimeout(function() {
        sendRegistration('save_click');
      }, 300);
    }
  }, true);

  const observer = new MutationObserver(function() {
    collectStepData();
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
  });

  collectStepData();
})();
true;
`;

  const lastRegistrationRef = useRef(null);

  const handleMessage = useCallback(event => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.event !== 'registration_form') {
        return;
      }

      const email = String(data.email || '')
        .trim()
        .toLowerCase();

      const phone = String(data.phone || '').trim();
      const normalizedPhone = phone.replace(/[^\d+]/g, '');

      setHashMail(sha256(email));
      setHashTel(sha256(normalizedPhone));

      console.log('Received registration data from WebView:', {
        email,
        phone,
        normalizedPhone,
      });

      Alert.alert(
        'Registration Data Received',
        `Email: ${sha256(email)}, Phone: ${sha256(normalizedPhone)}`,
      );

      const dedupeKey = JSON.stringify({
        event: data.event,
        email,
        phone,
      });

      if (lastRegistrationRef.current === dedupeKey) {
        console.log('Duplicate registration event ignored');
        return;
      }

      lastRegistrationRef.current = dedupeKey;

      console.log('REGISTRATION FROM WEBVIEW:', {
        email,
        phone,
        normalizedPhone,
        source: data.source,
      });

      // далі буде hash + Meta
    } catch (e) {
      console.log('WebView onMessage parse error:', e);
    }
  }, []);  */
}
