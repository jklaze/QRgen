import { getDataFromMode } from '../src/ui-controls.js';
import assert from 'node:assert';
import { test } from 'node:test';

// Mock DOM
global.document = {
  getElementById: (id) => {
    const values = {
      'data-vcard-name': id === 'data-vcard-name' ? mockName : '',
      'data-vcard-tel': '',
      'data-vcard-email': ''
    };
    return { value: values[id] || '' };
  },
  querySelector: (selector) => {
    if (selector.includes('.mode-tabs')) {
      return { dataset: { mode: 'vcard' } };
    }
    return null;
  }
};

let mockName = '';

test('vCard injection via CR', () => {
  mockName = 'Alice\rEMAIL:hacker@example.com';
  const result = getDataFromMode();

  if (result.includes('\r')) {
    assert.fail('Raw Carriage Return found in output');
  }

  // Verify escaping
  // Expect: Alice\nEMAIL\:hacker@example.com
  // Note: JSON.stringify escapes backslashes, so we check the raw string.
  assert.match(result, /FN:Alice\\nEMAIL\\:hacker@example\.com/);
});

test('vCard valid newline handling', () => {
  mockName = 'Line1\nLine2';
  const result = getDataFromMode();
  assert.match(result, /FN:Line1\\nLine2/);
});

test('vCard CRLF handling', () => {
  mockName = 'Line1\r\nLine2';
  const result = getDataFromMode();
  assert.match(result, /FN:Line1\\nLine2/);
});
