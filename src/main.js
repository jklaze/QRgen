import { QRManager } from './core/QRManager.js';
import { LayoutManager } from './ui/LayoutManager.js';
import { FormHandler } from './ui/FormHandler.js';
import { presets } from './config/presets.js';
import { debounce } from './utils/debounce.js';

const DEBOUNCE_MS = 120;
const container = document.getElementById('qr-container');

let qrManager;
let layoutManager;
let formHandler;

const update = () => {
  const options = formHandler.getOptions();
  if (qrManager) {
    qrManager.update(options);
  } else {
    qrManager = new QRManager(container, options);
  }
};

const debouncedUpdate = debounce(update, DEBOUNCE_MS);

function init() {
  formHandler = new FormHandler(debouncedUpdate);
  layoutManager = new LayoutManager(debouncedUpdate);

  // Initial render
  update();

  // Presets
  const presetContainer = document.getElementById('preset-buttons');
  if (presetContainer) {
    presets.forEach((preset) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = preset.name;
      btn.addEventListener('click', () => {
        preset.apply();
        layoutManager.refreshToggles();
        update();
      });
      presetContainer.appendChild(btn);
    });
  }

  // Download
  document.getElementById('download-btn')?.addEventListener('click', () => {
    const name = (document.getElementById('export-filename')?.value || 'qr').trim() || 'qr';
    const extension = document.getElementById('export-format')?.value || 'png';
    qrManager.download(name, extension);
  });
}

init();
