/**
 * Apply a value to an input; if selector is a string, use getElementById.
 */
function set(id, value, isCheckbox = false) {
  const el = typeof id === 'string' ? document.getElementById(id) : id;
  if (!el) return;
  if (isCheckbox) {
    el.checked = !!value;
  } else {
    el.value = value;
  }
}

function setDotType(value) {
  const btn = document.querySelector(`.shape-picker[data-target="dots-type"] button[data-value="${value}"]`);
  document.querySelectorAll('.shape-picker[data-target="dots-type"] button').forEach((b) => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

const PRESETS_DATA = [
  {
    name: 'Classic',
    values: {
      'dots-type': 'square',
      'dots-gradient': false,
      'dots-color': '#000000',
      'corners-square-type': 'square',
      'corners-square-gradient': false,
      'corners-square-color': '#000000',
      'corners-dot-type': 'square',
      'corners-dot-gradient': false,
      'corners-dot-color': '#000000',
      'bg-transparent': false,
      'bg-gradient': false,
      'bg-color': '#ffffff',
    },
  },
  {
    name: 'Rounded',
    values: {
      'dots-type': 'rounded',
      'dots-gradient': false,
      'dots-color': '#000000',
      'corners-square-type': 'extra-rounded',
      'corners-square-gradient': false,
      'corners-square-color': '#000000',
      'corners-dot-type': 'dot',
      'corners-dot-gradient': false,
      'corners-dot-color': '#000000',
      'bg-transparent': false,
      'bg-gradient': false,
      'bg-color': '#ffffff',
    },
  },
  {
    name: 'Dots',
    values: {
      'dots-type': 'dots',
      'dots-gradient': false,
      'dots-color': '#1a1a2e',
      'corners-square-type': 'dots',
      'corners-square-gradient': false,
      'corners-square-color': '#1a1a2e',
      'corners-dot-type': 'dots',
      'corners-dot-gradient': false,
      'corners-dot-color': '#1a1a2e',
      'bg-transparent': false,
      'bg-gradient': false,
      'bg-color': '#f5f5f5',
    },
  },
  {
    name: 'Gradient',
    values: {
      'dots-type': 'rounded',
      'dots-gradient': true,
      'dots-grad-type': 'linear',
      'dots-grad-rotation': '135',
      'dots-grad-from': '#667eea',
      'dots-grad-to': '#764ba2',
      'corners-square-type': 'extra-rounded',
      'corners-square-gradient': true,
      'corners-square-grad-type': 'linear',
      'corners-square-grad-rotation': '135',
      'corners-square-grad-from': '#667eea',
      'corners-square-grad-to': '#764ba2',
      'corners-dot-type': 'dot',
      'corners-dot-gradient': true,
      'corners-dot-grad-type': 'linear',
      'corners-dot-grad-rotation': '135',
      'corners-dot-grad-from': '#667eea',
      'corners-dot-grad-to': '#764ba2',
      'bg-transparent': false,
      'bg-gradient': true,
      'bg-grad-type': 'linear',
      'bg-grad-rotation': '0',
      'bg-grad-from': '#fdfbfb',
      'bg-grad-to': '#ebedee',
    },
  },
  {
    name: 'Neon',
    values: {
      'dots-type': 'rounded',
      'dots-gradient': false,
      'dots-color': '#00d4ff',
      'corners-square-type': 'extra-rounded',
      'corners-square-gradient': false,
      'corners-square-color': '#00d4ff',
      'corners-dot-type': 'dot',
      'corners-dot-gradient': false,
      'corners-dot-color': '#ff6bb3',
      'bg-transparent': false,
      'bg-gradient': false,
      'bg-color': '#0f0a1f',
    },
  },
  {
    name: 'Elegant',
    values: {
      'dots-type': 'classy-rounded',
      'dots-gradient': false,
      'dots-color': '#2d1f54',
      'corners-square-type': 'classy-rounded',
      'corners-square-gradient': false,
      'corners-square-color': '#2d1f54',
      'corners-dot-type': 'classy-rounded',
      'corners-dot-gradient': false,
      'corners-dot-color': '#2d1f54',
      'bg-transparent': false,
      'bg-gradient': false,
      'bg-color': '#f8f6ff',
    },
  },
  {
    name: 'Minimal',
    values: {
      'dots-type': 'square',
      'dots-gradient': false,
      'dots-color': '#000000',
      'corners-square-type': 'square',
      'corners-square-gradient': false,
      'corners-square-color': '#000000',
      'corners-dot-type': 'square',
      'corners-dot-gradient': false,
      'corners-dot-color': '#000000',
      'bg-transparent': true,
      'bg-gradient': false,
      'bg-color': '#ffffff',
    },
  },
];

function applyPreset(values) {
  for (const [key, value] of Object.entries(values)) {
    if (key === 'dots-type') {
      setDotType(value);
    } else {
      set(key, value, typeof value === 'boolean');
    }
  }
}

/**
 * Built-in style presets. Each preset is { name, apply }.
 * apply() sets form control values.
 */
export const presets = PRESETS_DATA.map((preset) => ({
  name: preset.name,
  apply: () => applyPreset(preset.values),
}));
