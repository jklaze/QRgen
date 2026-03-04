
import test from 'node:test';
import assert from 'node:assert';
import { processLogoFile } from '../src/file-utils.js';

// Mock FileReader and File classes
global.FileReader = class {
  constructor() {
    this.onload = null;
    this.onerror = null;
  }
  readAsDataURL(file) {
    if (file.shouldFail) {
      if (this.onerror) this.onerror(new Error('Mock error'));
    } else {
      if (this.onload) {
        this.onload({ target: { result: 'data:image/png;base64,mockdata' } });
      }
    }
  }
};

global.File = class {
  constructor(bits, name, options) {
    this.name = name;
    this.type = options?.type || '';
    this.size = bits.length; // Simplified size
  }
};

test('processLogoFile resolves with data URL for valid small image', async () => {
  const file = {
    name: 'test.png',
    type: 'image/png',
    size: 1024, // 1KB
  };
  const result = await processLogoFile(file);
  assert.strictEqual(result, 'data:image/png;base64,mockdata');
});

test('processLogoFile rejects file larger than default limit (2MB)', async () => {
  const file = {
    name: 'large.png',
    type: 'image/png',
    size: 2 * 1024 * 1024 + 1, // 2MB + 1 byte
  };

  await assert.rejects(
    () => processLogoFile(file),
    (err) => {
      assert.match(err.message, /File is too large/);
      return true;
    }
  );
});

test('processLogoFile rejects non-image file', async () => {
  const file = {
    name: 'test.txt',
    type: 'text/plain',
    size: 1024,
  };

  await assert.rejects(
    () => processLogoFile(file),
    (err) => {
      assert.match(err.message, /Invalid file type/);
      return true;
    }
  );
});

test('processLogoFile allows custom max size', async () => {
  const file = {
    name: 'medium.png',
    type: 'image/png',
    size: 500,
  };
  // limit to 400 bytes
  await assert.rejects(
    () => processLogoFile(file, 400),
    (err) => {
      assert.match(err.message, /File is too large/);
      return true;
    }
  );
});

test('processLogoFile handles read errors', async () => {
  const file = {
    name: 'test.png',
    type: 'image/png',
    size: 1024,
    shouldFail: true,
  };

  await assert.rejects(
    () => processLogoFile(file),
    (err) => {
      assert.strictEqual(err.message, 'Error reading file.');
      return true;
    }
  );
});
