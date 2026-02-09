export class FormHandler {
  constructor(updateCallback) {
    this.updateCallback = updateCallback;
    this.logoDataUrl = null;
    this.init();
  }

  init() {
    this.setupInputs();
    this.setupFileHandling();
  }

  setupInputs() {
    const updateOnChange = [
      'data-text', 'data-url', 'data-email', 'data-email-subject', 'data-phone',
      'data-wifi-ssid', 'data-wifi-password', 'data-wifi-type',
      'data-vcard-name', 'data-vcard-tel', 'data-vcard-email',
      'shape', 'dots-color', 'dots-grad-type', 'dots-grad-rotation', 'dots-grad-from', 'dots-grad-to', 'dots-gradient',
      'corners-square-type', 'corners-square-color', 'corners-square-grad-type', 'corners-square-grad-rotation',
      'corners-square-grad-from', 'corners-square-grad-to', 'corners-square-gradient',
      'corners-dot-type', 'corners-dot-color', 'corners-dot-grad-type', 'corners-dot-grad-rotation',
      'corners-dot-grad-from', 'corners-dot-grad-to', 'corners-dot-gradient',
      'bg-color', 'bg-grad-type', 'bg-grad-rotation', 'bg-grad-from', 'bg-grad-to', 'bg-transparent', 'bg-gradient',
      'logo-size', 'logo-margin', 'logo-hide-dots',
    ];

    updateOnChange.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.triggerUpdate());
    });

    document.querySelectorAll('input[name="ecl"]').forEach((el) => {
      el.addEventListener('change', () => this.triggerUpdate());
    });

    document.querySelectorAll('#corners-square-type, #corners-dot-type').forEach((el) => {
      el.addEventListener('change', () => this.triggerUpdate());
    });

    // Range labels
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
          this.triggerUpdate();
        };
        input.addEventListener('input', update);
        update();
    });
  }

  setupFileHandling() {
    document.getElementById('logo-file')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      this.handleLogoFile(file);
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
        this.handleLogoFile(file);
      });
    }

    document.getElementById('logo-clear')?.addEventListener('click', () => {
      this.logoDataUrl = null;
      const fileInput = document.getElementById('logo-file');
      if (fileInput) fileInput.value = '';
      this.triggerUpdate();
    });
  }

  handleLogoFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.logoDataUrl = e.target?.result ?? null;
      this.triggerUpdate();
    };
    reader.readAsDataURL(file);
  }

  triggerUpdate() {
    if (this.updateCallback) this.updateCallback();
  }

  buildGradient(type, rotationDegrees, colorFrom, colorTo) {
    const rotation = (rotationDegrees * Math.PI) / 180;
    return {
      type: type === 'radial' ? 'radial' : 'linear',
      rotation,
      colorStops: [
        { offset: 0, color: colorFrom },
        { offset: 1, color: colorTo },
      ],
    };
  }

  getDataFromMode() {
    const mode = document.querySelector('.mode-tabs [role="tab"][aria-selected="true"]')?.dataset.mode || 'text';
    switch (mode) {
      case 'text':
        return (document.getElementById('data-text')?.value || '').trim();
      case 'url':
        return (document.getElementById('data-url')?.value || '').trim();
      case 'email': {
        const email = (document.getElementById('data-email')?.value || '').trim();
        const subject = (document.getElementById('data-email-subject')?.value || '').trim();
        if (!email) return '';
        const url = 'mailto:' + encodeURIComponent(email).replace(/%40/g, '@');
        return subject ? url + '?subject=' + encodeURIComponent(subject) : url;
      }
      case 'phone': {
        const phone = (document.getElementById('data-phone')?.value || '').trim();
        return phone ? 'tel:' + phone.replace(/\s/g, '') : '';
      }
      case 'wifi': {
        const ssid = (document.getElementById('data-wifi-ssid')?.value || '').trim();
        const password = document.getElementById('data-wifi-password')?.value ?? '';
        const type = document.getElementById('data-wifi-type')?.value || 'WPA';
        if (!ssid) return '';
        const T = type ? `T:${type};` : '';
        const P = password ? `P:${password};` : '';
        return `WIFI:${T}S:${ssid};${P};;`;
      }
      case 'vcard': {
        const name = (document.getElementById('data-vcard-name')?.value || '').trim();
        const tel = (document.getElementById('data-vcard-tel')?.value || '').trim();
        const email = (document.getElementById('data-vcard-email')?.value || '').trim();
        if (!name && !tel && !email) return '';
        const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
        if (name) lines.push('FN:' + name, 'N:' + name + ';;;');
        if (tel) lines.push('TEL:' + tel.replace(/\s/g, ''));
        if (email) lines.push('EMAIL:' + email);
        lines.push('END:VCARD');
        return lines.join('\n');
      }
      default:
        return (document.getElementById('data-text')?.value || '').trim();
    }
  }

  getDotsOptions() {
    const gradient = document.getElementById('dots-gradient')?.checked ?? false;
    const type = document.querySelector('.shape-picker[data-target="dots-type"] button.active')?.dataset.value || 'square';
    const base = { type };
    if (gradient) {
      base.gradient = this.buildGradient(
        document.getElementById('dots-grad-type')?.value || 'linear',
        Number(document.getElementById('dots-grad-rotation')?.value) || 0,
        document.getElementById('dots-grad-from')?.value || '#000000',
        document.getElementById('dots-grad-to')?.value || '#333333'
      );
    } else {
      base.color = document.getElementById('dots-color')?.value || '#000000';
      base.gradient = undefined;
    }
    return base;
  }

  getCornersSquareOptions() {
    const gradient = document.getElementById('corners-square-gradient')?.checked ?? false;
    const type = document.getElementById('corners-square-type')?.value || 'square';
    const base = { type };
    if (gradient) {
      base.gradient = this.buildGradient(
        document.getElementById('corners-square-grad-type')?.value || 'linear',
        Number(document.getElementById('corners-square-grad-rotation')?.value) || 0,
        document.getElementById('corners-square-grad-from')?.value || '#000000',
        document.getElementById('corners-square-grad-to')?.value || '#333333'
      );
    } else {
      base.color = document.getElementById('corners-square-color')?.value || '#000000';
      base.gradient = undefined;
    }
    return base;
  }

  getCornersDotOptions() {
    const gradient = document.getElementById('corners-dot-gradient')?.checked ?? false;
    const type = document.getElementById('corners-dot-type')?.value || 'square';
    const base = { type };
    if (gradient) {
      base.gradient = this.buildGradient(
        document.getElementById('corners-dot-grad-type')?.value || 'linear',
        Number(document.getElementById('corners-dot-grad-rotation')?.value) || 0,
        document.getElementById('corners-dot-grad-from')?.value || '#000000',
        document.getElementById('corners-dot-grad-to')?.value || '#333333'
      );
    } else {
      base.color = document.getElementById('corners-dot-color')?.value || '#000000';
      base.gradient = undefined;
    }
    return base;
  }

  getBackgroundOptions() {
    const transparent = document.getElementById('bg-transparent')?.checked ?? false;
    if (transparent) {
      return { color: 'transparent' };
    }
    const gradient = document.getElementById('bg-gradient')?.checked ?? false;
    if (gradient) {
      return {
        gradient: this.buildGradient(
          document.getElementById('bg-grad-type')?.value || 'linear',
          Number(document.getElementById('bg-grad-rotation')?.value) || 0,
          document.getElementById('bg-grad-from')?.value || '#ffffff',
          document.getElementById('bg-grad-to')?.value || '#f0f0f0'
        ),
      };
    }
    return {
      color: document.getElementById('bg-color')?.value || '#ffffff',
      gradient: undefined,
    };
  }

  getImageOptions() {
    const sizeRaw = Number(document.getElementById('logo-size')?.value) ?? 40;
    const margin = Number(document.getElementById('logo-margin')?.value) ?? 0;
    const hideBackgroundDots = document.getElementById('logo-hide-dots')?.checked ?? true;
    const imageSize = sizeRaw / 100;
    return { hideBackgroundDots, imageSize, margin };
  }

  getOptions() {
    const data = this.getDataFromMode();
    const width = Number(document.getElementById('width')?.value) || 300;
    const height = Number(document.getElementById('height')?.value) || 300;
    const margin = Number(document.getElementById('margin')?.value) ?? 0;
    const shape = document.getElementById('shape')?.value || 'square';
    const ecl = document.querySelector('input[name="ecl"]:checked')?.value || 'Q';

    const options = {
      data: data || 'https://github.com',
      width,
      height,
      margin,
      shape,
      type: 'svg',
      qrOptions: {
        errorCorrectionLevel: ecl,
      },
      dotsOptions: this.getDotsOptions(),
      cornersSquareOptions: this.getCornersSquareOptions(),
      cornersDotOptions: this.getCornersDotOptions(),
      backgroundOptions: this.getBackgroundOptions(),
      imageOptions: this.getImageOptions(),
    };

    if (this.logoDataUrl) {
      options.image = this.logoDataUrl;
    } else {
      options.image = undefined;
    }

    return options;
  }
}
