import assert from 'node:assert';
import test from 'node:test';

// Mock global document
global.document = {
  getElementById: () => null,
  querySelector: () => null,
};

// Import the function to test
// Using dynamic import because we need to mock document before importing
const { getOptions } = await import('../src/ui-controls.js');

test('getDotsOptions (via getOptions) handles gradient options', (t) => {
  // Setup mocks specifically for this test
  global.document.getElementById = (id) => {
    // Base options (so getOptions doesn't crash)
    if (id === 'width') return { value: '300' };
    if (id === 'height') return { value: '300' };

    // Dots options
    if (id === 'dots-gradient') return { checked: true };
    if (id === 'dots-grad-type') return { value: 'radial' };
    if (id === 'dots-grad-rotation') return { value: '45' };
    if (id === 'dots-grad-from') return { value: '#111111' };
    if (id === 'dots-grad-to') return { value: '#222222' };

    return { value: '', checked: false };
  };

  global.document.querySelector = (sel) => {
    // Dots type
    if (sel === '.shape-picker[data-target="dots-type"] button.active') {
      return { dataset: { value: 'dots-custom-shape' } };
    }
    // Mode tabs (required by getDataFromMode)
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

    // Dots options
    if (id === 'dots-gradient') return { checked: false };
    if (id === 'dots-color') return { value: '#abcdef' };

    return { value: '', checked: false };
  };

  global.document.querySelector = (sel) => {
    if (sel === '.shape-picker[data-target="dots-type"] button.active') {
      return { dataset: { value: 'square' } }; // default
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

    // Corners Square options
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

    // Corners Dot options
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
