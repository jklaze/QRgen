export class LayoutManager {
  constructor(updateCallback) {
    this.updateCallback = updateCallback;
    this.init();
  }

  init() {
    this.setupAccordions();
    this.setupTabs();
    this.setupShapePicker();
    this.setupToggles();
  }

  setupAccordions() {
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
  }

  setupTabs() {
    document.querySelectorAll('.mode-tabs [role="tab"]').forEach((tab) => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.mode;
        this.setMode(mode);
      });
    });
  }

  setMode(mode) {
    document.querySelectorAll('.mode-tabs [role="tab"]').forEach((tab) => {
      tab.setAttribute('aria-selected', tab.dataset.mode === mode ? 'true' : 'false');
    });
    document.querySelectorAll('.data-panel').forEach((panel) => {
      panel.classList.toggle('hidden', panel.dataset.panel !== mode);
    });
    this.triggerUpdate();
  }

  setupShapePicker() {
    const dotsPicker = document.querySelector('.shape-picker[data-target="dots-type"]');
    if (dotsPicker) {
      dotsPicker.querySelector('button[data-value="square"]')?.classList.add('active');
      dotsPicker.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => {
          dotsPicker.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          this.triggerUpdate();
        });
      });
    }
  }

  setupToggles() {
    document.getElementById('dots-gradient')?.addEventListener('change', () => {
      this.toggleDotsGradient();
    });
    document.getElementById('corners-square-gradient')?.addEventListener('change', () => {
      this.toggleCornersSquareGradient();
    });
    document.getElementById('corners-dot-gradient')?.addEventListener('change', () => {
      this.toggleCornersDotGradient();
    });
    document.getElementById('bg-transparent')?.addEventListener('change', () => {
      this.toggleBg();
    });
    document.getElementById('bg-gradient')?.addEventListener('change', () => {
      this.toggleBg();
    });
  }

  toggleDotsGradient() {
    const useGrad = document.getElementById('dots-gradient')?.checked ?? false;
    document.querySelectorAll('.dots-solid').forEach((el) => el.classList.toggle('hidden', useGrad));
    document.querySelectorAll('.dots-gradient').forEach((el) => el.classList.toggle('hidden', !useGrad));
  }

  toggleCornersSquareGradient() {
    const useGrad = document.getElementById('corners-square-gradient')?.checked ?? false;
    document.querySelectorAll('.corners-square-solid').forEach((el) => el.classList.toggle('hidden', useGrad));
    document.querySelectorAll('.corners-square-gradient').forEach((el) => el.classList.toggle('hidden', !useGrad));
  }

  toggleCornersDotGradient() {
    const useGrad = document.getElementById('corners-dot-gradient')?.checked ?? false;
    document.querySelectorAll('.corners-dot-solid').forEach((el) => el.classList.toggle('hidden', useGrad));
    document.querySelectorAll('.corners-dot-gradient').forEach((el) => el.classList.toggle('hidden', !useGrad));
  }

  toggleBg() {
    const transparent = document.getElementById('bg-transparent')?.checked ?? false;
    const useGrad = document.getElementById('bg-gradient')?.checked ?? false;
    document.querySelectorAll('.bg-solid').forEach((el) => el.classList.toggle('hidden', transparent));
    document.querySelectorAll('.bg-gradient-el').forEach((el) => el.classList.toggle('hidden', !useGrad || transparent));

    // Also toggle preview card background
    document.querySelector('.preview-card')?.classList.toggle('transparent-bg', transparent);
  }

  triggerUpdate() {
    if (this.updateCallback) this.updateCallback();
  }

  refreshToggles() {
      this.toggleDotsGradient();
      this.toggleCornersSquareGradient();
      this.toggleCornersDotGradient();
      this.toggleBg();
  }
}
