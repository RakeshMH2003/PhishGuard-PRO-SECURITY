# PhishGuard Pro — Local Clone

A complete, functional clone of [phishguard-pro-zoll.vercel.app](https://phishguard-pro-zoll.vercel.app/), built with React + Vite.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8 |
| Icons | Lucide React |
| Fonts | DM Sans, Space Grotesk (Google Fonts) |
| Styling | Plain CSS (matching original) |
| API proxy | Vite dev-server proxy |

## Features Implemented

| Feature | Status |
|---------|--------|
| Dashboard hero + feature cards | ✅ |
| Sidebar navigation (desktop and mobile) | ✅ |
| Topbar with breadcrumb | ✅ |
| Responsive layout (desktop / tablet / mobile) | ✅ |
| URL Analysis — form, API call, result panel | ✅ |
| URL Analysis — DNS Report section | ✅ |
| URL Analysis — Threat Intelligence section | ✅ |
| Email Address Analysis — form, reputation report | ✅ |
| Email Content Analysis — form, findings | ✅ |
| Email Analysis tabs | ✅ |
| Password Strength Checker (client-side, no API) | ✅ |
| Password — checklist, recommendations | ✅ |
| Loading spinners | ✅ |
| Error messages | ✅ |
| Empty states | ✅ |
| Status badges (low/medium/high/unknown) | ✅ |
| Risk score progress bar | ✅ |
| Disclaimer / privacy notices | ✅ |
| Mobile sidebar overlay + close | ✅ |
| Favicon (original SVG) | ✅ |

## Quick Start

```bash
cd phishguard-pro
npm install
npm run dev
# Open: http://localhost:5173
```

## Environment Variables

Copy `.env.example` to `.env.local` and adjust:

```
VITE_BACKEND_URL=https://phishguard-pro-zoll.vercel.app
```

By default the Vite dev-server proxies /api requests to the reference deployment.

## API Endpoints Used

| Endpoint | Payload | Purpose |
|----------|---------|---------|
| POST /api/analyze-url | { "url": "https://..." } | URL risk analysis + DNS + threat intel |
| POST /api/analyze-email-address | { "email": "user@example.com" } | Email reputation + domain DNS |
| POST /api/analyze-email | { "email_text": "..." } | Phishing content analysis |

## Deploy to Vercel

1. Push phishguard-pro/ to a GitHub repo.
2. Import into vercel.com, set Root Directory to phishguard-pro.
3. Add VITE_API_URL env var pointing to your backend.
4. Deploy.

## Project Structure

```
phishguard-pro/
  public/
    favicon.svg
  src/
    components/
      DnsReport.jsx
      EmailReputationReport.jsx
      FindingCard.jsx
      ResultPanel.jsx
      ThreatIntelligence.jsx
    pages/
      DashboardPage.jsx
      EmailAnalysisPage.jsx
      PasswordCheckerPage.jsx
      UrlAnalysisPage.jsx
    api.js
    App.jsx
    index.css
    main.jsx
  .env.example
  index.html
  vite.config.js
```
