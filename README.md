# QR Generator

Customizable QR code generator with dark UI. All options from [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) are exposed: data modes (URL, text, email, phone, WiFi, vCard), dot/corner shapes, gradients, logo upload, and export (PNG, JPEG, WebP, SVG).

## Run with Docker

```bash
docker compose up --build
```

Open http://localhost:3000

## Run locally

```bash
npm install
npm run dev
```

Build for production: `npm run build`. Output is in `dist/`.
