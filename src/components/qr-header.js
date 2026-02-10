import { parseHTML } from './utils.js';

class QrHeader extends HTMLElement {
  connectedCallback() {
    if (this.children.length) return;
    this.appendChild(parseHTML(`
      <h1 class="logo">QR Generator</h1>
      <a href="https://github.com/jklaze/QRgen" class="github-badge" target="_blank" rel="noopener noreferrer" aria-label="Star on GitHub">
        <svg class="github-badge-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 5.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
        Star on GitHub
      </a>
    `));
  }
}

customElements.define('qr-header', QrHeader);
