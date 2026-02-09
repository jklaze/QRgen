import QRCodeStyling from 'qr-code-styling';

/**
 * Create a QR code instance and append it to the container.
 * @param {HTMLElement} container
 * @param {Object} options - qr-code-styling options (data, width, height, dotsOptions, etc.)
 * @returns {import('qr-code-styling').default}
 */
export function createQR(container, options) {
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
  const qr = new QRCodeStyling(defaultOptions);
  container.innerHTML = '';
  qr.append(container);
  return qr;
}

/**
 * Update an existing QR code instance with new options.
 * @param {import('qr-code-styling').default} qrInstance
 * @param {Object} options
 */
export function updateQR(qrInstance, options) {
  if (qrInstance) {
    qrInstance.update(options);
  }
}

/**
 * Download the QR code in the given format.
 * @param {import('qr-code-styling').default} qrInstance
 * @param {{ name?: string, extension?: 'png'|'jpeg'|'webp'|'svg' }} downloadOptions
 */
export function downloadQR(qrInstance, downloadOptions = {}) {
  if (!qrInstance) return;
  const { name = 'qr', extension = 'png' } = downloadOptions;
  qrInstance.download({ name, extension });
}
