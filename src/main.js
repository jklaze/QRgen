import './components/qr-header.js';
import './components/qr-preview.js';
import './components/qr-sidebar.js';
import { createQR, updateQR, downloadQR } from './qr-manager.js';
import { getOptions } from './ui-controls.js';
import { presets } from './presets.js';
import { processLogoFile } from './file-utils.js';

const DEBOUNCE_MS = 120;
let qrInstance = null;
let logoDataUrl = null;
let updateTimeout = null;

const container = document.getElementById('qr-container');

function scheduleUpdate() {
  if (updateTimeout) clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    updateTimeout = null;
    const options = getOptions({ logoDataUrl });
    if (qrInstance) {
      updateQR(qrInstance, options);
    } else {
      qrInstance = createQR(container, options);
    }
    const transparent = document.getElementById('bg-transparent')?.checked ?? false;
    document.querySelector('.preview-card')?.classList.toggle('transparent-bg', transparent);
  }, DEBOUNCE_MS);
}

function initQR() {
  qrInstance = createQR(container, getOptions({ logoDataUrl }));
}

// --- Data mode tabs ---
function setDataPanel(mode) {
  document.querySelectorAll('.mode-tabs [role="tab"]').forEach((tab) => {
    tab.setAttribute('aria-selected', tab.dataset.mode === mode ? 'true' : 'false');
  });
  document.querySelectorAll('.data-panel').forEach((panel) => {
    panel.classList.toggle('hidden', panel.dataset.panel !== mode);
  });
  scheduleUpdate();
}
document.querySelectorAll('.mode-tabs [role="tab"]').forEach((tab) => {
  tab.addEventListener('click', () => setDataPanel(tab.dataset.mode));
});

// --- Accordion ---
document.querySelectorAll('.accordion').forEach((section) => {
  const header = section.querySelector('.accordion-header');
  const panel = section.querySelector('.accordion-panel');
  if (!header || !panel) return;
  header.addEventListener('click', () => {
    const expanded = header.getAttribute('aria-expanded') !== 'true';
    header.setAttribute('aria-expanded', expanded);
    panel.hidden = !expanded;
    section.dataset.open = expanded;
  });
  section.dataset.open = 'true';
});

// --- Shape picker (dots type) ---
const dotsPicker = document.querySelector('.shape-picker[data-target="dots-type"]');
if (dotsPicker) {
  dotsPicker.querySelector('button[data-value="square"]')?.classList.add('active');
  dotsPicker.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      dotsPicker.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      scheduleUpdate();
    });
  });
}

// --- Gradient toggles ---
function toggleDotsGradient() {
  const useGrad = document.getElementById('dots-gradient')?.checked ?? false;
  document.querySelectorAll('.dots-solid').forEach((el) => el.classList.toggle('hidden', useGrad));
  document.querySelectorAll('.dots-gradient').forEach((el) => el.classList.toggle('hidden', !useGrad));
  scheduleUpdate();
}
function toggleCornersSquareGradient() {
  const useGrad = document.getElementById('corners-square-gradient')?.checked ?? false;
  document.querySelectorAll('.corners-square-solid').forEach((el) => el.classList.toggle('hidden', useGrad));
  document.querySelectorAll('.corners-square-gradient').forEach((el) => el.classList.toggle('hidden', !useGrad));
  scheduleUpdate();
}
function toggleCornersDotGradient() {
  const useGrad = document.getElementById('corners-dot-gradient')?.checked ?? false;
  document.querySelectorAll('.corners-dot-solid').forEach((el) => el.classList.toggle('hidden', useGrad));
  document.querySelectorAll('.corners-dot-gradient').forEach((el) => el.classList.toggle('hidden', !useGrad));
  scheduleUpdate();
}
function toggleBg() {
  const transparent = document.getElementById('bg-transparent')?.checked ?? false;
  const useGrad = document.getElementById('bg-gradient')?.checked ?? false;
  document.querySelectorAll('.bg-solid').forEach((el) => el.classList.toggle('hidden', transparent));
  document.querySelectorAll('.bg-gradient-el').forEach((el) => el.classList.toggle('hidden', !useGrad || transparent));
  scheduleUpdate();
}
document.getElementById('dots-gradient')?.addEventListener('change', toggleDotsGradient);
document.getElementById('corners-square-gradient')?.addEventListener('change', toggleCornersSquareGradient);
document.getElementById('corners-dot-gradient')?.addEventListener('change', toggleCornersDotGradient);
document.getElementById('bg-transparent')?.addEventListener('change', toggleBg);
document.getElementById('bg-gradient')?.addEventListener('change', toggleBg);

// --- Range value labels ---
const rangeLabels = [
  ['width', 'width-value'],
  ['height', 'height-value'],
  ['margin', 'margin-value'],
  ['logo-size', 'logo-size-value', (v) => (Number(v) / 100).toFixed(2)],
  ['logo-margin', 'logo-margin-value'],
];
rangeLabels.forEach(([id, labelId, format = (v) => v]) => {
  const input = document.getElementById(id);
  const label = document.getElementById(labelId);
  if (!input || !label) return;
  const update = () => {
    label.textContent = format(input.value);
    scheduleUpdate();
  };
  input.addEventListener('input', update);
  update();
});

// --- All other inputs: any change triggers scheduleUpdate ---
const updateOnChange = [
  'data-text', 'data-url', 'data-email', 'data-email-subject', 'data-phone',
  'data-wifi-ssid', 'data-wifi-password', 'data-wifi-type',
  'data-vcard-name', 'data-vcard-tel', 'data-vcard-email',
  'shape', 'dots-color', 'dots-grad-type', 'dots-grad-rotation', 'dots-grad-from', 'dots-grad-to',
  'corners-square-type', 'corners-square-color', 'corners-square-grad-type', 'corners-square-grad-rotation',
  'corners-square-grad-from', 'corners-square-grad-to',
  'corners-dot-type', 'corners-dot-color', 'corners-dot-grad-type', 'corners-dot-grad-rotation',
  'corners-dot-grad-from', 'corners-dot-grad-to',
  'bg-color', 'bg-grad-type', 'bg-grad-rotation', 'bg-grad-from', 'bg-grad-to',
  'logo-size', 'logo-margin', 'logo-hide-dots',
];
updateOnChange.forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', scheduleUpdate);
});
document.querySelectorAll('input[name="ecl"]').forEach((el) => {
  el.addEventListener('change', scheduleUpdate);
});
document.querySelectorAll('#corners-square-type, #corners-dot-type').forEach((el) => {
  el.addEventListener('change', scheduleUpdate);
});

// --- Logo: file input + drag-and-drop + clear ---
function handleLogoFile(file) {
  if (!file) return;
  processLogoFile(file)
    .then((result) => {
      logoDataUrl = result;
      scheduleUpdate();
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
      const fileInput = document.getElementById('logo-file');
      if (fileInput) fileInput.value = '';
    });
}
document.getElementById('logo-file')?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  handleLogoFile(file);
});
const dropZone = document.getElementById('logo-drop-zone');
if (dropZone) {
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer?.files?.[0];
    handleLogoFile(file);
  });
}
document.getElementById('logo-clear')?.addEventListener('click', () => {
  logoDataUrl = null;
  const fileInput = document.getElementById('logo-file');
  if (fileInput) fileInput.value = '';
  scheduleUpdate();
});

// --- Presets ---
const presetContainer = document.getElementById('preset-buttons');
if (presetContainer) {
  presets.forEach((preset) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = preset.name;
    btn.addEventListener('click', () => {
      preset.apply();
      toggleDotsGradient();
      toggleCornersSquareGradient();
      toggleCornersDotGradient();
      toggleBg();
      scheduleUpdate();
    });
    presetContainer.appendChild(btn);
  });
}

// --- Export modal ---
const exportFloatBtn = document.getElementById('export-float-btn');
const exportModalOverlay = document.getElementById('export-modal-overlay');
const exportModalClose = document.getElementById('export-modal-close');

function openExportModal() {
  if (exportModalOverlay) {
    exportModalOverlay.hidden = false;
    exportModalOverlay.setAttribute('aria-hidden', 'false');
  }
}
function closeExportModal() {
  if (exportModalOverlay) {
    exportModalOverlay.hidden = true;
    exportModalOverlay.setAttribute('aria-hidden', 'true');
  }
}

exportFloatBtn?.addEventListener('click', openExportModal);
exportModalClose?.addEventListener('click', closeExportModal);
exportModalOverlay?.addEventListener('click', (e) => {
  if (e.target === exportModalOverlay) closeExportModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && exportModalOverlay && !exportModalOverlay.hidden) closeExportModal();
});

// --- Download ---
document.getElementById('download-btn')?.addEventListener('click', () => {
  const name = (document.getElementById('export-filename')?.value || 'qr').trim() || 'qr';
  const extension = document.getElementById('export-format')?.value || 'png';
  downloadQR(qrInstance, { name, extension });
  closeExportModal();
});

// --- Smooth delayed follow: lerp translateY so card stays centered in viewport ---
const previewCard = document.querySelector('.preview-card');
const previewArea = document.querySelector('.preview-area');
const LERP_SPEED = 0.08; // lower = more delay (0-1)
let currentY = 0;
let targetY = 0;
let lastAppliedY = null;

function getTargetY() {
  if (!previewCard || !previewArea || window.innerWidth <= 900) return 0;
  const areaRect = previewArea.getBoundingClientRect();
  const cardH = previewCard.offsetHeight;
  const viewH = window.innerHeight;
  // Where should the card's top be to appear centered in the viewport?
  const idealViewportTop = (viewH - cardH) / 2;
  // Translate that into an offset relative to the preview-area's top
  let offset = idealViewportTop - areaRect.top;
  // Clamp so it doesn't float above the area or past its bottom
  offset = Math.max(0, Math.min(offset, areaRect.height - cardH));
  return offset;
}

function animateFollow() {
  targetY = getTargetY();
  const diff = targetY - currentY;
  if (Math.abs(diff) > 0.5) {
    currentY += diff * LERP_SPEED;
  } else {
    currentY = targetY;
  }
  if (previewCard && currentY !== lastAppliedY) {
    previewCard.style.transform = `translateY(${currentY}px)`;
    lastAppliedY = currentY;
  }
  requestAnimationFrame(animateFollow);
}

// Start the loop
requestAnimationFrame(animateFollow);

// --- Initial render ---
initQR();
const transparent = document.getElementById('bg-transparent')?.checked ?? false;
previewCard?.classList.toggle('transparent-bg', transparent);
