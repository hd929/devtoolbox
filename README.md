# 🛠️ DevToolbox - 100% Client-Side Developer Utilities

A comprehensive, blazing fast developer toolbox web application designed to run **100% client-side** with zero backend servers required. Built with React 18, TypeScript, Tailwind CSS, and Vite.

---

## ✨ Features & Included Tools

1. **JSON Formatter & Validator**: Indentation (2/4 spaces, tabs), minify, key sorting, validation, character & line counting, JSON file upload and download.
2. **JWT Decoder**: Inspect Header, Payload, and Signature; verify token expiration time with live countdown and human-readable dates; claims guide.
3. **Base64 Encoder / Decoder**: Safe UTF-8 text encode/decode, URL-safe toggle, file to Base64 data URI, and Base64 image preview.
4. **URL Encode / Decode**: Full URI & component encoding, URL structure breakdown (protocol, host, path, fragment), and interactive query parameters editor.
5. **Regex Tester**: Interactive real-time regex matching, flag toggles (`g`, `i`, `m`, `s`), match groups breakdown, replacement tester, and common regex presets.
6. **UUID Generator**: RFC4122 v4 (random) and v1 (time-based) UUID generator, bulk count (1 to 100), formatting options (hyphens, uppercase, braces, quotes).
7. **Hash Generator**: MD5, SHA-1, SHA-256, SHA-512, SHA-224, SHA-384, HMAC keyed hashing with secret key support, and file checksum calculator.
8. **Cron Parser**: Human-friendly plain English cron explainer, next 5 scheduled executions predictor, field breakdown, and popular cron presets.
9. **Timestamp Converter**: Live ticking Unix clock (seconds & milliseconds) with pause/resume, epoch-to-date converter, date-to-epoch picker, local time, UTC, ISO 8601, and relative time.
10. **Color Converter**: Real-time bi-directional conversion between HEX, RGB, HSL, HSV, CMYK, interactive color picker, CSS variable snippets, and tints/shades generator.
11. **SQL Formatter**: Formats and beautifies SQL queries with dialect options (PostgreSQL, MySQL, SQLite, MariaDB, T-SQL, BigQuery), indentation settings, and keyword casing.
12. **Markdown Preview**: Side-by-side split view editor, GitHub Flavored Markdown (GFM) renderer with DOMPurify sanitization, copy HTML, and export `.md`.
13. **Diff Viewer**: Side-by-side and unified text comparison, addition/deletion statistics, and line-level difference highlighting.
14. **Image Compressor**: 100% in-browser image compression using HTML5 Canvas API, quality slider, format conversion (WebP, JPEG, PNG), max-width scaling, savings percentage, and direct download.

---

## 🔒 Security & Privacy Guarantee

- **Zero Backend**: No data or sensitive strings (JWTs, tokens, passwords, private keys, files) ever leave your device.
- **Offline Capable**: Once loaded, all tools function without internet access.

---

## ⚡ Productivity Highlights

- **Command Palette (`Ctrl + K` / `Cmd + K`)**: Instant keyboard search to jump to any tool or action.
- **Favorites & Pinned Tools**: Pin your daily utilities to the top of the sidebar.
- **One-click Copy & Toasts**: Instant copy buttons with feedback notifications.

---

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```
The optimized static website will be compiled into the `dist/` directory.

---

## 🌐 Free Deployment Guide

### Deploy to Cloudflare Pages
1. Push your repository to GitHub or GitLab.
2. In Cloudflare Dashboard, go to **Workers & Pages** -> **Create application** -> **Pages**.
3. Connect your repository.
4. Set Build Settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Click **Save and Deploy**.

### Deploy to GitHub Pages
1. In `vite.config.ts`, `base: './'` is already configured for relative paths.
2. Go to repository **Settings** -> **Pages** -> **Source: GitHub Actions**.
3. Choose the static Vite deployment workflow or push `dist/` to the `gh-pages` branch.
