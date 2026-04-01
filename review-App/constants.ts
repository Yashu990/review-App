/**
 * Global Configuration for Review Boost
 * Update the SERVER_URL here to point to your live backend after deployment.
 */

// Live Deployment URL
export const SERVER_URL = 'http://103.142.175.170:7500'; 

export const API_BASE = `${SERVER_URL}/api`;

// ── PLAY STORE COMPLIANCE ──────────────────────────────────
// Set this to true before building for Play Store (removes Razorpay)
// Set to false for full APK version (website/direct share)
export const IS_PLAY_STORE_BUILD = false; 
