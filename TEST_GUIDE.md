# Review Boost - Comprehensive Testing Guide

This guide outlines how to verify that the **7-Day Trial**, **Google Login**, and **Admin Portal** are working correctly.

---

## 🧪 Test Case 1: The 7-Day Free Trial (Happy Path)

### Goal: Verify the app tracks 7 days and displays the correct banner.
1.  **Register**: Sign up as a new business.
2.  **Dashboard**: You should see a banner saying **"7 Days Left"**.
3.  **QR Code**: Open the QR Codes screen. You should be able to download/share the QR.
4.  **Admin Portal**: Open `localhost:7500/admin`, log in, and find your business. It should show your plan as "Free Trial".

---

## 🔒 Test Case 2: Trial Expiration (The "Lock" Test)

### Goal: Verify the app locks functions after 7 days.
1.  **Preparation**: We need to "trick" the app into thinking 8 days have passed.
2.  **The Trick**: I have created a script `simulate_expiry.js` in the backend folder.
3.  **Action**: Run `node simulate_expiry.js [Your-Email]`.
4.  **Verification**:
    - Open the Mobile App.
    - The Dashboard should now say **"Trial Expired ⚠️"**.
    - The QR Code should have a **Lock Icon 🔒** overlay.
    - Sharing/Downloading should be disabled.

---

## 🔑 Test Case 3: Google Sign-In

### Goal: Verify login via Google works with the correct Client ID.
1.  **Action**: Click "Sign in with Google" on the login screen.
2.  **Result**: 
    - If it's your first time, you should be redirected to the **Registration Wizard** with your email pre-filled.
    - If you are already registered, you should be taken straight to the **Dashboard**.
3.  **Troubleshooting**: If it fails, check the backend terminal for the `[Google Auth]` debug log I added.

---

## 💳 Test Case 4: Admin Upgrade Flow

### Goal: Verify you can unlock a user from the web portal.
1.  **Action**: Go to `localhost:7500/admin` and log in.
2.  **Find User**: Search for your test business email.
3.  **Upgrade**: Click **"Upgrade"**. Change the plan to `Basic` and set credits to `100`.
4.  **Verification**: Open your Mobile App. The **Lock 🔒** should be gone, and your plan should show as "Basic".

---

## 🚀 How to execute automation tests?
I have created a script to verify your backend API routes:
`node test_api.js`
