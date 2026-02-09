import QRCodeStyling from 'qr-code-styling';

export class QRManager {
  constructor(container, options = {}) {
    this.container = container;
    this.instance = null;
    this.init(options);
  }

  init(options) {
    const defaultOptions = {
      width: 300,
      height: 300,
      type: 'svg',
      data: '',
      margin: 0,
      qrOptions: { errorCorrectionLevel: 'Q' },
      dotsOptions: { color: '#000000', type: 'square' },
      backgroundOptions: { color: '#ffffff' },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 0 },
      ...options,
    };
    this.instance = new QRCodeStyling(defaultOptions);
    this.render();
  }

  render() {
    if (this.container && this.instance) {
      this.container.innerHTML = '';
      this.instance.append(this.container);
    }
  }

  update(options) {
    if (this.instance) {
      this.instance.update(options);
    }
  }

  download(name = 'qr', extension = 'png') {
    if (this.instance) {
      this.instance.download({ name, extension });
    }
  }
}
