# 🛡️ PhishGuard Pro — Cybersecurity Investigation Toolkit

> An intelligent, full-stack cybersecurity analysis platform designed to identify phishing threats across **URLs**, **Email addresses**, **Email content**, and **Passwords**.

[![Tech Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20Vite%208%20%7C%20Node%20Express-blue)](#tech-stack)
[![Tests Passed](https://img.shields.io/badge/Tests-34%2F34%20Passed-brightgreen)](#automated-testing)
[![Status](https://img.shields.io/badge/Status-Live%20%26%20Functional-success)](#getting-started)

---

## 📌 What Does This Website Do?

PhishGuard Pro helps security analysts and everyday users investigate suspicious digital threats through 4 core defensive tools:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PHISHGUARD PRO                                │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 🔗 URL Analysis   │ ✉️ Email Analysis  │ 🔑 Password Checker            │
│ • HTTP vs HTTPS   │ • Disposable check│ • 6-point complexity rules     │
│ • Impersonation   │ • Spammer flags   │ • Instant client-side score    │
│ • Suspicious terms│ • Urgency language│ • Recommendations              │
│ • DNS records     │ • Extracted links │ • Zero data sent to server     │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

## 🔍 Core Features Breakdown

### 1. 🔗 URL Analysis (`/url`)
- **Protocol Security:** Flags unencrypted HTTP connections vs secure HTTPS.
- **Brand Impersonation:** Detects when popular brands (`paypal`, `google`, `apple`, `microsoft`, etc.) appear inside deceptive hostnames.
- **Phishing Keyword Detection:** Scans for high-risk words like `login`, `verify`, `account`, `banking`, `security-update`.
- **Hostname Heuristics:** Flags raw IP address URLs and excessive hyphens commonly used to deceive mobile users.
- **DNS Intelligence Report:** Queries IPv4 (`A`), IPv6 (`AAAA`), Mail Exchange (`MX`), and Name Server (`NS`) records using native DNS resolution.
- **Threat Intelligence:** Checks OpenPhish and threat feeds for known blacklisted targets.
- **Risk Score (0–100):** Visual threat meter providing an overall assessment: `Low` 🟢, `Medium` 🟡, or `High` 🔴.

### 2. ✉️ Email Analysis (`/email`)
Provides dual-mode investigation tabs:

* **Tab A: Email Address Investigation**
  - **Syntax Validation:** Verifies RFC email standard compliance.
  - **Disposable / Burner Mail Detection:** Identifies temporary services (*Mailinator*, *10MinuteMail*, *TempMail*, etc.).
  - **Role-Based Mailbox Flags:** Flags generic shared addresses (`admin@`, `support@`, `billing@`).
  - **Domain Safety & Blacklists:** Surfaces community blacklist and reputation status.
  - **MX Verification:** Verifies the domain has active mail exchange infrastructure.

* **Tab B: Email Content & Phishing Text Scanner**
  - **Urgency Language Detection:** Flags coercive pressure words (*"immediate action required"*, *"account suspended within 24 hours"*).
  - **Credential Harvesting Prompts:** Identifies solicitations for passwords, PINs, SSNs, and credit cards.
  - **Embedded Link Extractor:** Pulls all links from the message body and checks for deceptive or unencrypted URLs.
  - **Defensive Guidance:** Offers actionable safety steps based on detected indicators.

### 3. 🔑 Password Strength Checker (`/password`)
- **100% Client-Side Evaluation:** Analyzed in-browser; zero data is transmitted over the network.
- **6-Point Checklist:** Real-time feedback on length (8+ and 12+), uppercase, lowercase, numbers, and special characters.
- **Visual Strength Meter:** Categorizes passwords into `Very Weak`, `Weak`, `Medium`, `Strong`, and `Very Strong`.
- **Targeted Recommendations:** Displays custom tips only for the specific complexity checks that failed.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|:---|:---|
| **Frontend** | React 19, Vite 8, Lucide React Icons |
| **Typography & Theme** | Space Grotesk & DM Sans (Google Fonts), Dark Cyber Theme (`#080d19`) |
| **Backend** | Node.js (v24), Express.js, native `node:dns/promises` |
| **Architecture** | Dual-mode: Vite Dev Proxy (default) or Standalone Express API (`server.js`) |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/RakeshMH2003/PhishGuard-PRO-SECURITY.git
cd PhishGuard-PRO-SECURITY
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the application
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## ⚙️ Backend Options

* **Default Mode (Recommended):** The built-in Vite dev proxy automatically routes `/api/*` calls to the reference backend with zero configuration.
* **Standalone Local Backend:** Run your own local backend:
  ```bash
  npm run server
  ```
  Runs on port `5000` with native Node.js DNS lookups and heuristic threat detection.

---

## 🧪 Automated Testing

Includes a 34-point end-to-end test suite (`run_tests.py`):

```bash
python run_tests.py
```
```
=============================================
Results: 34/34 tests passed  ALL PASS
```

---

## ⚠️ Important Cybersecurity Disclaimer

PhishGuard Pro is a **defensive screening tool**. A low threat score indicates that heuristic indicators were not triggered, but cannot guarantee a URL or sender is 100% benign. Always verify through trusted out-of-band channels before submitting sensitive credentials.
