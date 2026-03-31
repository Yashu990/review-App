require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const Business = require('./models/Business');
const Review = require('./models/Review');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Validation: Warn if key secrets are missing
if (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.includes('YOUR_')) {
  console.warn('⚠️ WARNING: RAZORPAY_KEY_SECRET is not configured correctly in .env');
}
if (!process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY.includes('YOUR_')) {
  console.warn('⚠️ WARNING: GOOGLE_PLACES_API_KEY is not configured correctly in .env');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'missing_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'missing_secret',
});

// Polyfill for fetch if running on Node version < 18
if (typeof fetch === 'undefined') {
  console.warn('⚠️ WARNING: Native fetch not found. If search fails, ensure you are using Node.js 18 or higher.');
}

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// ── Helper: generate unique referral code ─────────────────────────────────────
function generateReferralCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'REF-';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ── DB Sync ───────────────────────────────────────────────────────────────────
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL Connected');
    // alter:true safely adds new columns (referralCode, referralCount) without dropping data
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('Database Synced'))
  .catch(err => console.error('DB Error:', err));

// ── Pages ─────────────────────────────────────────────────────────────────────
app.get('/rate-us', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── API ───────────────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({ status: 'up', message: 'Backend is Live!' });
});

// Get Business by ID
app.get('/api/business/:id', async (req, res) => {
  try {
    const biz = await Business.findByPk(req.params.id);
    if (!biz) return res.status(404).json({ error: 'Business not found' });
    res.json({
      id: biz.id,
      name: biz.name,
      ownerName: biz.ownerName,
      ownerPhone: biz.ownerPhone,
      googleReviewLink: biz.googleReviewLink,
      logo: biz.logo,
      referralCode: biz.referralCode,
      referralCount: biz.referralCount,
      plan: biz.plan,
      privacyTier: biz.privacyTier,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { 
      name, ownerName, ownerPhone, googleReviewLink, 
      email, password, usedReferralCode, 
      businessType, privacyTier, qrStyle 
    } = req.body;

    if (!name || !ownerName || !ownerPhone || !googleReviewLink || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await Business.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existing) return res.status(400).json({ error: 'Email already registered. Please login.' });

    // Generate a unique referral code for new user
    let referralCode;
    let isUnique = false;
    while (!isUnique) {
      referralCode = generateReferralCode();
      const dup = await Business.findOne({ where: { referralCode } });
      if (!dup) isUnique = true;
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newBiz = await Business.create({
      name,
      ownerName,
      ownerPhone,
      googleReviewLink,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      logo: '',
      referralCode,
      referralCount: 0,
      businessType: businessType || 'Both',
      privacyTier: privacyTier || '5-star',
      qrStyle: qrStyle || 'default',
    });

    // If someone used a referral code — reward that referrer
    if (usedReferralCode) {
      const referrer = await Business.findOne({ where: { referralCode: usedReferralCode.trim().toUpperCase() } });
      if (referrer) {
        await referrer.increment('referralCount', { by: 1 });
        console.log(`Referral counted for: ${referrer.email}`);
      }
    }

    res.status(201).json({ business: newBiz });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const biz = await Business.findOne({ where: { email: email.toLowerCase().trim() } });
    
    if (!biz) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, biz.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({ business: biz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Business
app.patch('/api/business/:id', async (req, res) => {
  try {
    const { id, _id, referralCode, referralCount, ...updateData } = req.body; // protect referral fields
    const [rowsUpdated] = await Business.update(updateData, { where: { id: req.params.id } });
    if (rowsUpdated === 0) return res.status(404).json({ error: 'Business not found' });
    const updated = await Business.findByPk(req.params.id);
    res.json({ business: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validate Referral Code (optional: check before register)
app.get('/api/referral/check/:code', async (req, res) => {
  try {
    const biz = await Business.findOne({ where: { referralCode: req.params.code.toUpperCase() } });
    if (!biz) return res.status(404).json({ valid: false, message: 'Invalid referral code' });
    res.json({ valid: true, referredBy: biz.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate Referral Code for existing/new user (Lazy Generation)
app.post('/api/business/:id/generate-referral', async (req, res) => {
  try {
    const biz = await Business.findByPk(req.params.id);
    if (!biz) return res.status(404).json({ error: 'Business not found' });
    
    // If already has one, just return it
    if (biz.referralCode) return res.json({ referralCode: biz.referralCode });

    // Generate unique code
    let referralCode;
    let isUnique = false;
    while (!isUnique) {
      referralCode = generateReferralCode();
      const dup = await Business.findOne({ where: { referralCode } });
      if (!dup) isUnique = true;
    }

    biz.referralCode = referralCode;
    await biz.save();
    
    res.json({ referralCode: biz.referralCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit Review
app.post('/api/reviews', async (req, res) => {
  try {
    const { businessId, id, _id, ...reviewData } = req.body;
    
    // 1. Get the business to check their plan
    const biz = await Business.findByPk(businessId);
    if (!biz) return res.status(404).json({ error: 'Business not found' });

    // 2. Define review limits
    const PLAN_LIMITS = {
      'Free Trial': 5,
      'Basic': 100,
      'Standard': 500,
      'Premium': 5000, // Effectively unlimited
    };

    const currentLimit = PLAN_LIMITS[biz.plan] || 5;

    // 3. Count current captured reviews (1-3 stars)
    const reviewCount = await Review.count({ where: { businessId } });

    if (reviewCount >= currentLimit) {
      return res.status(403).json({ 
        error: 'Plan limit reached!', 
        upgradeRequired: true,
        message: `Your '${biz.plan}' plan allows for only ${currentLimit} captures. Please upgrade to continue receiving private feedback.`
      });
    }

    // 4. Create the review
    const newReview = await Review.create({ ...reviewData, businessId });
    res.status(201).json({ message: 'Feedback Captured', review: newReview });
  } catch (err) {
    console.error('Review Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get Reviews
app.get('/api/reviews/business/:id', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { businessId: req.params.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Razorpay Payment ──────────────────────────────────────────────────────────

// 1. Create Order
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    
    if (!amount) return res.status(400).json({ error: 'Amount is required' });

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error('Razorpay Order Error:', err);
    res.status(500).json({ 
      error: 'Failed to create payment order', 
      details: err.message,
      description: err.error ? err.error.description : null 
    });
  }
});

// 2. Verify Payment
app.post('/api/payments/verify', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      businessId,
      planName
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment Verified! Update the user's plan
      const biz = await Business.findByPk(businessId);
      if (biz) {
        biz.plan = planName;
        await biz.save();
        return res.json({ success: true, message: 'Payment verified and plan updated', business: biz });
      }
      return res.status(404).json({ success: false, error: 'Business not found' });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (err) {
    console.error('Verification Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 7500;
// ── Google Places Business Search ────────────────────────────────────
app.post('/api/business/search-places', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Search query is required' });

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE' || apiKey.includes('YOUR_')) {
      return res.status(500).json({ error: 'Google Places API Key not configured' });
  }

  try {
      console.log(`\n--- NEW SEARCH REQUEST ---`);
      console.log(`Query: "${query}"`);
      
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      if (!apiKey) {
        console.error('ERROR: No Google Places API Key found in .env!');
        return res.status(500).json({ error: 'Config error' });
      }

      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
      const searchRes = await fetch(url);
      const data = await searchRes.json();
      
      console.log(`Google API Status: ${data.status}`);
      if (data.error_message) console.error(`Google API Error Message: ${data.error_message}`);

      if (data.status === 'OK' || data.status === 'ZERO_RESULTS') {
          const results = (data.results || []).map(p => ({
              name: p.name,
              address: p.formatted_address,
              placeId: p.place_id,
              link: `https://search.google.com/local/writereview?placeid=${p.place_id}`
          }));
          console.log(`Success: Found ${results.length} results.`);
          res.json(results);
      } else {
          console.error(`Google Search Failed with status: ${data.status}`);
          res.status(500).json({ error: `Google API Error: ${data.status}` });
      }
  } catch (e) {
      console.error('GOOGLE SEARCH EXCEPTION:', e.name, e.message);
      res.status(500).json({ error: 'Search failed. Check server logs for details.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
