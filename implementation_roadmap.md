# Review Boost - Implementation Roadmap 🚀

This document outlines the technical steps required to address the corrections and new features specified in `degine.md`.

---

## Phase 1: Critical Fixes & Authentication 🔒
**Objective:** Resolve immediate blockers and modernize sign-up.

| Task | Description | Status |
| :--- | :--- | :--- |
| **Google Sign-In** | Integrate Google Sign-In (Client UI + Backend endpoint). | 🟨 Pending Keys |
| **Manual Location Entry** | Added fallback in registration search and manual link pasting. | 🟩 Done |
| **QR Style Variation** | Every QR choice (hearts, beer, etc.) has unique colors/icons. | 🟩 Done |
| **Hyperlink Formating** | Smart Share links now use proper spacing and line breaks. | 🟩 Done |

---

## Phase 2: Feature Expansion & Engagement 📈
**Objective:** Improve user experience and sharing capabilities.

| Task | Description | Status |
| :--- | :--- | :--- |
| **QR Share & Download** | UI for downloading QR as an image added to dashboard. | 🟨 Logic Implementation |
| **Multi-Language Support** | Bilingual (English/Hindi) onboarding and settings toggle. | 🟩 Done |
| **Points Referral System** | Backend now awards **100 Points (₹100)** to both users. | 🟩 Done |
| **"How it Works" Guide** | New 3-step guide added to the onboarding flow. | 🟩 Done |
| **Internal App Feedback** | Added dedicated WhatsApp feedback link in settings. | 🟩 Done |

---

## Phase 3: Dual-Build Strategy (Play Store Compliance) 🏗️
**Objective:** Dynamic compliance based on `IS_PLAY_STORE_BUILD` flag.

| Task | Description | Status |
| :--- | :--- | :--- |
| **Build Toggle Flag** | Added `IS_PLAY_STORE_BUILD` in `constants.ts`. | 🟩 Done |
| **Selective Payments** | Razorpay is hidden; Redirects to WhatsApp if toggle is true. | 🟩 Done |
| **Package Branding** | Updated package name to `com.reviewboost`. | 🟩 Done |

---

## Phase 4: Branding & Contact Info 🏷️
**Objective:** Finalize identity for Helonix.

| Task | Description | Status |
| :--- | :--- | :--- |
| **Official Contact** | Updated phone, email, and website to Helonix details. | 🟩 Done |
| **App Name** | Rebranded all instances from ReviewUP to **Review Boost**. | 🟩 Done |

---

> [!TIP]
> To get a **"Fresh Installation"** experience for testing these new features, use the **Settings > Reset App** button.
