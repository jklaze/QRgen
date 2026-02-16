import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { generateQRData } from '../src/ui-controls.js';

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
    // encodeURIComponent('foo+bar@example.com') -> 'foo%2Bbar%40example.com'
    // replace(/%40/g, '@') -> 'foo%2Bbar@example.com'
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
    // escapeVCardValue: replaces comma with \, semicolon with \;
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
