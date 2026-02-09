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

/**
 * Built-in style presets. Each preset is { name, apply }.
 * apply() sets form control values.
 */
export const presets = [
  {
    name: 'Classic',
    apply() {
      setDotType('square');
      set('dots-gradient', false, true);
      set('dots-color', '#000000');
      set('corners-square-type', 'square');
      set('corners-square-gradient', false, true);
      set('corners-square-color', '#000000');
      set('corners-dot-type', 'square');
      set('corners-dot-gradient', false, true);
      set('corners-dot-color', '#000000');
      set('bg-transparent', false, true);
      set('bg-gradient', false, true);
      set('bg-color', '#ffffff');
    },
  },
  {
    name: 'Rounded',
    apply() {
      setDotType('rounded');
      set('dots-gradient', false, true);
      set('dots-color', '#000000');
      set('corners-square-type', 'extra-rounded');
      set('corners-square-gradient', false, true);
      set('corners-square-color', '#000000');
      set('corners-dot-type', 'dot');
      set('corners-dot-gradient', false, true);
      set('corners-dot-color', '#000000');
      set('bg-transparent', false, true);
      set('bg-gradient', false, true);
      set('bg-color', '#ffffff');
    },
  },
  {
    name: 'Dots',
    apply() {
      setDotType('dots');
      set('dots-gradient', false, true);
      set('dots-color', '#1a1a2e');
      set('corners-square-type', 'dots');
      set('corners-square-gradient', false, true);
      set('corners-square-color', '#1a1a2e');
      set('corners-dot-type', 'dots');
      set('corners-dot-gradient', false, true);
      set('corners-dot-color', '#1a1a2e');
      set('bg-transparent', false, true);
      set('bg-gradient', false, true);
      set('bg-color', '#f5f5f5');
    },
  },
  {
    name: 'Gradient',
    apply() {
      setDotType('rounded');
      set('dots-gradient', true, true);
      set('dots-grad-type', 'linear');
      set('dots-grad-rotation', '135');
      set('dots-grad-from', '#667eea');
      set('dots-grad-to', '#764ba2');
      set('corners-square-type', 'extra-rounded');
      set('corners-square-gradient', true, true);
      set('corners-square-grad-type', 'linear');
      set('corners-square-grad-rotation', '135');
      set('corners-square-grad-from', '#667eea');
      set('corners-square-grad-to', '#764ba2');
      set('corners-dot-type', 'dot');
      set('corners-dot-gradient', true, true);
      set('corners-dot-grad-type', 'linear');
      set('corners-dot-grad-rotation', '135');
      set('corners-dot-grad-from', '#667eea');
      set('corners-dot-grad-to', '#764ba2');
      set('bg-transparent', false, true);
      set('bg-gradient', true, true);
      set('bg-grad-type', 'linear');
      set('bg-grad-rotation', '0');
      set('bg-grad-from', '#fdfbfb');
      set('bg-grad-to', '#ebedee');
    },
  },
  {
    name: 'Neon',
    apply() {
      setDotType('rounded');
      set('dots-gradient', false, true);
      set('dots-color', '#00d4ff');
      set('corners-square-type', 'extra-rounded');
      set('corners-square-gradient', false, true);
      set('corners-square-color', '#00d4ff');
      set('corners-dot-type', 'dot');
      set('corners-dot-gradient', false, true);
      set('corners-dot-color', '#ff6bb3');
      set('bg-transparent', false, true);
      set('bg-gradient', false, true);
      set('bg-color', '#0f0a1f');
    },
  },
  {
    name: 'Elegant',
    apply() {
      setDotType('classy-rounded');
      set('dots-gradient', false, true);
      set('dots-color', '#2d1f54');
      set('corners-square-type', 'classy-rounded');
      set('corners-square-gradient', false, true);
      set('corners-square-color', '#2d1f54');
      set('corners-dot-type', 'classy-rounded');
      set('corners-dot-gradient', false, true);
      set('corners-dot-color', '#2d1f54');
      set('bg-transparent', false, true);
      set('bg-gradient', false, true);
      set('bg-color', '#f8f6ff');
    },
  },
  {
    name: 'Minimal',
    apply() {
      setDotType('square');
      set('dots-gradient', false, true);
      set('dots-color', '#000000');
      set('corners-square-type', 'square');
      set('corners-square-gradient', false, true);
      set('corners-square-color', '#000000');
      set('corners-dot-type', 'square');
      set('corners-dot-gradient', false, true);
      set('corners-dot-color', '#000000');
      set('bg-transparent', true, true);
      set('bg-gradient', false, true);
      set('bg-color', '#ffffff');
    },
  },
];
