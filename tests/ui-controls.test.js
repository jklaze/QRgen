import { describe, it, test } from 'node:test';
import assert from 'node:assert';

global.document = {
  getElementById: () => null,
  querySelector: () => null,
};

const { generateQRData, getOptions } = await import('../src/ui-controls.js');

describe('generateQRData', () => {
  it('should return text data for text mode', () => {
    const inputs = { text: 'Hello World' };
    const result = generateQRData('text', inputs);
    assert.strictEqual(result, 'Hello World');
  });

  it('should return empty string for text mode with no input', () => {
    const inputs = { text: '' };
    const result = generateQRData('text', inputs);
    assert.strictEqual(result, '');
  });

  it('should return url for url mode', () => {
    const inputs = { url: 'https://example.com' };
    const result = generateQRData('url', inputs);
    assert.strictEqual(result, 'https://example.com');
  });

  it('should return email mailto link for email mode', () => {
    const inputs = { email: 'test@example.com', emailSubject: 'Subject' };
    const result = generateQRData('email', inputs);
    assert.strictEqual(result, 'mailto:test@example.com?subject=Subject');
  });

  it('should return email mailto link without subject', () => {
    const inputs = { email: 'test@example.com', emailSubject: '' };
    const result = generateQRData('email', inputs);
    assert.strictEqual(result, 'mailto:test@example.com');
  });

  it('should handle email encoding', () => {
    const inputs = { email: 'foo+bar@example.com', emailSubject: 'Hello World' };
    const result = generateQRData('email', inputs);
    assert.strictEqual(result, 'mailto:foo%2Bbar@example.com?subject=Hello%20World');
  });

  it('should return tel link for phone mode', () => {
    const inputs = { phone: '+1 234 567 890' };
    const result = generateQRData('phone', inputs);
    assert.strictEqual(result, 'tel:+1234567890');
  });

  it('should return WIFI string for wifi mode', () => {
    const inputs = {
      wifiSsid: 'MyNetwork',
      wifiPassword: 'password123',
      wifiType: 'WPA'
    };
    const result = generateQRData('wifi', inputs);
    assert.strictEqual(result, 'WIFI:T:WPA;S:MyNetwork;P:password123;;;');
  });

  it('should return empty string for wifi mode if ssid is missing', () => {
    const inputs = {
      wifiSsid: '',
      wifiPassword: 'password123',
      wifiType: 'WPA'
    };
    const result = generateQRData('wifi', inputs);
    assert.strictEqual(result, '');
  });

  it('should return vcard string for vcard mode', () => {
    const inputs = {
      vcardName: 'John Doe',
      vcardTel: '+1234567890',
      vcardEmail: 'john@example.com'
    };
    const result = generateQRData('vcard', inputs);
    const expected = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:John Doe',
      'N:John Doe;;;',
      'TEL:+1234567890',
      'EMAIL:john@example.com',
      'END:VCARD'
    ].join('\n');
    assert.strictEqual(result, expected);
  });

  it('should escape vcard values correctly', () => {
    const inputs = {
      vcardName: 'Doe, John; Jr.',
      vcardTel: '',
      vcardEmail: ''
    };
    const result = generateQRData('vcard', inputs);
    const expected = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Doe\\, John\\; Jr.',
      'N:Doe\\, John\\; Jr.;;;',
      'END:VCARD'
    ].join('\n');
    assert.strictEqual(result, expected);
  });

  it('should default to text mode if mode is unknown', () => {
    const inputs = { text: 'Default Text' };
    const result = generateQRData('unknown', inputs);
    assert.strictEqual(result, 'Default Text');
  });
});

test('getDotsOptions (via getOptions) handles gradient options', (t) => {
  global.document.getElementById = (id) => {
    if (id === 'width') return { value: '300' };
    if (id === 'height') return { value: '300' };

    if (id === 'dots-gradient') return { checked: true };
    if (id === 'dots-grad-type') return { value: 'radial' };
    if (id === 'dots-grad-rotation') return { value: '45' };
    if (id === 'dots-grad-from') return { value: '#111111' };
    if (id === 'dots-grad-to') return { value: '#222222' };

    return { value: '', checked: false };
  };

  global.document.querySelector = (sel) => {
    if (sel === '.shape-picker[data-target="dots-type"] button.active') {
      return { dataset: { value: 'dots-custom-shape' } };
    }
    if (sel === '.mode-tabs [role="tab"][aria-selected="true"]') {
      return { dataset: { mode: 'text' } };
    }
    return null;
  };

  const options = getOptions();
  const dots = options.dotsOptions;

  assert.strictEqual(dots.type, 'dots-custom-shape');
  assert.strictEqual(dots.gradient.type, 'radial');
  assert.strictEqual(dots.gradient.rotation, (45 * Math.PI) / 180);
  assert.deepStrictEqual(dots.gradient.colorStops, [
    { offset: 0, color: '#111111' },
    { offset: 1, color: '#222222' }
  ]);
});

test('getDotsOptions (via getOptions) handles solid color options', (t) => {
  global.document.getElementById = (id) => {
    if (id === 'width') return { value: '300' };
    if (id === 'height') return { value: '300' };

    if (id === 'dots-gradient') return { checked: false };
    if (id === 'dots-color') return { value: '#abcdef' };

    return { value: '', checked: false };
  };

  global.document.querySelector = (sel) => {
    if (sel === '.shape-picker[data-target="dots-type"] button.active') {
      return { dataset: { value: 'square' } };
    }
    if (sel === '.mode-tabs [role="tab"][aria-selected="true"]') {
      return { dataset: { mode: 'text' } };
    }
    return null;
  };

  const options = getOptions();
  const dots = options.dotsOptions;

  assert.strictEqual(dots.type, 'square');
  assert.strictEqual(dots.color, '#abcdef');
  assert.strictEqual(dots.gradient, undefined);
});

test('getCornersSquareOptions (via getOptions) handles gradient options', (t) => {
  global.document.getElementById = (id) => {
    if (id === 'width') return { value: '300' };
    if (id === 'height') return { value: '300' };

    if (id === 'corners-square-gradient') return { checked: true };
    if (id === 'corners-square-type') return { value: 'extra-rounded' };
    if (id === 'corners-square-grad-type') return { value: 'linear' };
    if (id === 'corners-square-grad-rotation') return { value: '90' };
    if (id === 'corners-square-grad-from') return { value: '#333333' };
    if (id === 'corners-square-grad-to') return { value: '#444444' };

    return { value: '', checked: false };
  };

  global.document.querySelector = (sel) => {
    if (sel === '.mode-tabs [role="tab"][aria-selected="true"]') {
      return { dataset: { mode: 'text' } };
    }
    return null;
  };

  const options = getOptions();
  const corners = options.cornersSquareOptions;

  assert.strictEqual(corners.type, 'extra-rounded');
  assert.strictEqual(corners.gradient.type, 'linear');
  assert.strictEqual(corners.gradient.rotation, (90 * Math.PI) / 180);
  assert.deepStrictEqual(corners.gradient.colorStops, [
    { offset: 0, color: '#333333' },
    { offset: 1, color: '#444444' }
  ]);
});

test('getCornersDotOptions (via getOptions) handles solid color options', (t) => {
  global.document.getElementById = (id) => {
    if (id === 'width') return { value: '300' };
    if (id === 'height') return { value: '300' };

    if (id === 'corners-dot-gradient') return { checked: false };
    if (id === 'corners-dot-type') return { value: 'dot' };
    if (id === 'corners-dot-color') return { value: '#555555' };

    return { value: '', checked: false };
  };

  global.document.querySelector = (sel) => {
    if (sel === '.mode-tabs [role="tab"][aria-selected="true"]') {
      return { dataset: { mode: 'text' } };
    }
    return null;
  };

  const options = getOptions();
  const corners = options.cornersDotOptions;

  assert.strictEqual(corners.type, 'dot');
  assert.strictEqual(corners.color, '#555555');
  assert.strictEqual(corners.gradient, undefined);
});
