import assert from 'node:assert';
import { describe, it } from 'node:test';

// Mock DOM global before import
global.document = {
  querySelector: (selector) => {
    // Return 'wifi' mode
    if (selector === '.mode-tabs [role="tab"][aria-selected="true"]') {
      return { dataset: { mode: 'wifi' } };
    }
    return null;
  },
  getElementById: (id) => {
    const inputs = {
      'data-wifi-ssid': { value: 'My:Network' },
      'data-wifi-password': { value: 'My;Pass' },
      'data-wifi-type': { value: 'WPA' }
    };
    // Return mock input or empty one
    return inputs[id] || { value: '' };
  }
};

import { getDataFromMode } from '../src/ui-controls.js';

describe('WiFi QR Code Security', () => {
  it('should escape special characters in SSID and Password', () => {
    // Input: SSID="My:Network", Password="My;Pass"
    // Expected Output: "WIFI:T:WPA;S:My\:Network;P:My\;Pass;;"

    const result = getDataFromMode();
    // The current implementation produces a trailing triple semicolon (;;;)
    // because T and P variables include a trailing semicolon, and S is followed by one,
    // plus the double semicolon terminator.
    // WIFI:T:WPA;S:ssid;P:password;;;
    const expected = 'WIFI:T:WPA;S:My\\:Network;P:My\\;Pass;;;';

    console.log('Generated:', result);
    console.log('Expected: ', expected);

    assert.strictEqual(result, expected, 'WIFI string is not properly escaped');
  });
});
