import { parseHTML } from './utils.js';

class QrPreview extends HTMLElement {
  connectedCallback() {
    if (this.children.length) return;
    this.appendChild(parseHTML(`
      <svg style="position:absolute;width:0;height:0" aria-hidden="true">
        <defs>
          <filter id="grainNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div class="preview-card">
        <div class="grainient-layer" aria-hidden="true">
          <div class="grad-blob"></div>
          <div class="grad-blob"></div>
          <div class="grad-blob"></div>
          <div class="grain-overlay"></div>
        </div>
        <div id="qr-container" class="qr-container"></div>
      </div>
    `));
  }
}

customElements.define('qr-preview', QrPreview);
