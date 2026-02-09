/**
 * Build gradient object for qr-code-styling.
 * @param {string} type - 'linear' | 'radial'
 * @param {number} rotationDegrees
 * @param {string} colorFrom
 * @param {string} colorTo
 */
function buildGradient(type, rotationDegrees, colorFrom, colorTo) {
  const rotation = (rotationDegrees * Math.PI) / 180;
  return {
    type: type === 'radial' ? 'radial' : 'linear',
    rotation,
    colorStops: [
      { offset: 0, color: colorFrom },
      { offset: 1, color: colorTo },
    ],
  };
}

/**
 * Escape special characters for vCard format.
 * @param {string} val
 * @returns {string}
 */
function escapeVCardValue(val) {
  return val
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Get QR data string from current data mode and form fields.
 */
export function getDataFromMode() {
  const mode = document.querySelector('.mode-tabs [role="tab"][aria-selected="true"]')?.dataset.mode || 'text';
  switch (mode) {
    case 'text':
      return (document.getElementById('data-text')?.value || '').trim();
    case 'url':
      return (document.getElementById('data-url')?.value || '').trim();
    case 'email': {
      const email = (document.getElementById('data-email')?.value || '').trim();
      const subject = (document.getElementById('data-email-subject')?.value || '').trim();
      if (!email) return '';
      const url = 'mailto:' + encodeURIComponent(email).replace(/%40/g, '@');
      return subject ? url + '?subject=' + encodeURIComponent(subject) : url;
    }
    case 'phone': {
      const phone = (document.getElementById('data-phone')?.value || '').trim();
      return phone ? 'tel:' + phone.replace(/\s/g, '') : '';
    }
    case 'wifi': {
      const ssid = (document.getElementById('data-wifi-ssid')?.value || '').trim();
      const password = document.getElementById('data-wifi-password')?.value ?? '';
      const type = document.getElementById('data-wifi-type')?.value || 'WPA';
      if (!ssid) return '';
      const T = type ? `T:${type};` : '';
      const P = password ? `P:${password};` : '';
      return `WIFI:${T}S:${ssid};${P};;`;
    }
    case 'vcard': {
      const name = (document.getElementById('data-vcard-name')?.value || '').trim();
      const tel = (document.getElementById('data-vcard-tel')?.value || '').trim();
      const email = (document.getElementById('data-vcard-email')?.value || '').trim();
      if (!name && !tel && !email) return '';
      const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
      if (name) lines.push('FN:' + escapeVCardValue(name), 'N:' + escapeVCardValue(name) + ';;;');
      if (tel) lines.push('TEL:' + escapeVCardValue(tel.replace(/\s/g, '')));
      if (email) lines.push('EMAIL:' + escapeVCardValue(email));
      lines.push('END:VCARD');
      return lines.join('\n');
    }
    default:
      return (document.getElementById('data-text')?.value || '').trim();
  }
}

/**
 * Get dots options from form (dots section).
 */
function getDotsOptions() {
  const gradient = document.getElementById('dots-gradient')?.checked ?? false;
  const type = document.querySelector('.shape-picker[data-target="dots-type"] button.active')?.dataset.value || 'square';
  const base = { type };
  if (gradient) {
    base.gradient = buildGradient(
      document.getElementById('dots-grad-type')?.value || 'linear',
      Number(document.getElementById('dots-grad-rotation')?.value) || 0,
      document.getElementById('dots-grad-from')?.value || '#000000',
      document.getElementById('dots-grad-to')?.value || '#333333'
    );
  } else {
    base.color = document.getElementById('dots-color')?.value || '#000000';
    base.gradient = undefined; // clear so library doesn't keep previous gradient
  }
  return base;
}

/**
 * Get corner square options from form.
 */
function getCornersSquareOptions() {
  const gradient = document.getElementById('corners-square-gradient')?.checked ?? false;
  const type = document.getElementById('corners-square-type')?.value || 'square';
  const base = { type };
  if (gradient) {
    base.gradient = buildGradient(
      document.getElementById('corners-square-grad-type')?.value || 'linear',
      Number(document.getElementById('corners-square-grad-rotation')?.value) || 0,
      document.getElementById('corners-square-grad-from')?.value || '#000000',
      document.getElementById('corners-square-grad-to')?.value || '#333333'
    );
  } else {
    base.color = document.getElementById('corners-square-color')?.value || '#000000';
    base.gradient = undefined;
  }
  return base;
}

/**
 * Get corner dot options from form.
 */
function getCornersDotOptions() {
  const gradient = document.getElementById('corners-dot-gradient')?.checked ?? false;
  const type = document.getElementById('corners-dot-type')?.value || 'square';
  const base = { type };
  if (gradient) {
    base.gradient = buildGradient(
      document.getElementById('corners-dot-grad-type')?.value || 'linear',
      Number(document.getElementById('corners-dot-grad-rotation')?.value) || 0,
      document.getElementById('corners-dot-grad-from')?.value || '#000000',
      document.getElementById('corners-dot-grad-to')?.value || '#333333'
    );
  } else {
    base.color = document.getElementById('corners-dot-color')?.value || '#000000';
    base.gradient = undefined;
  }
  return base;
}

/**
 * Get background options from form.
 */
function getBackgroundOptions() {
  const transparent = document.getElementById('bg-transparent')?.checked ?? false;
  if (transparent) {
    return { color: 'transparent' };
  }
  const gradient = document.getElementById('bg-gradient')?.checked ?? false;
  if (gradient) {
    return {
      gradient: buildGradient(
        document.getElementById('bg-grad-type')?.value || 'linear',
        Number(document.getElementById('bg-grad-rotation')?.value) || 0,
        document.getElementById('bg-grad-from')?.value || '#ffffff',
        document.getElementById('bg-grad-to')?.value || '#f0f0f0'
      ),
    };
  }
  return {
    color: document.getElementById('bg-color')?.value || '#ffffff',
    gradient: undefined,
  };
}

/**
 * Get image/logo options from form. logoDataUrl is passed from main (file read).
 */
function getImageOptions() {
  const sizeRaw = Number(document.getElementById('logo-size')?.value) ?? 40;
  const margin = Number(document.getElementById('logo-margin')?.value) ?? 0;
  const hideBackgroundDots = document.getElementById('logo-hide-dots')?.checked ?? true;
  const imageSize = sizeRaw / 100;
  return { hideBackgroundDots, imageSize, margin };
}

/**
 * Read all form controls and return options for qr-code-styling.
 * @param {{ logoDataUrl?: string | null }} overrides - e.g. logoDataUrl from file input
 * @returns {Object} options for QRCodeStyling
 */
export function getOptions(overrides = {}) {
  const data = getDataFromMode();
  const width = Number(document.getElementById('width')?.value) || 300;
  const height = Number(document.getElementById('height')?.value) || 300;
  const margin = Number(document.getElementById('margin')?.value) ?? 0;
  const shape = document.getElementById('shape')?.value || 'square';
  const ecl = document.querySelector('input[name="ecl"]:checked')?.value || 'Q';

  const options = {
    data: data || 'https://github.com',
    width,
    height,
    margin,
    shape,
    type: 'svg',
    qrOptions: {
      errorCorrectionLevel: ecl,
    },
    dotsOptions: getDotsOptions(),
    cornersSquareOptions: getCornersSquareOptions(),
    cornersDotOptions: getCornersDotOptions(),
    backgroundOptions: getBackgroundOptions(),
    imageOptions: getImageOptions(),
  };

  if (overrides.logoDataUrl) {
    options.image = overrides.logoDataUrl;
  } else {
    options.image = undefined; // clear logo when removed
  }

  return options;
}
