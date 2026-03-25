const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Serve Static Dummy Page
app.use(express.static(path.join(__dirname, 'public')));

// DB Connection
const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/review_boost_db';
mongoose.connect(DB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('DB Connection Error:', err));

// --- API Endpoints ---

// Get Business info for Dummy Page (to get real google link and store name)
app.get('/api/business/:id', async (req, res) => {
  try {
    const Business = require('./models/Business');
    const biz = await Business.findById(req.params.id);
    if (!biz) return res.status(404).json({ error: 'Store not found' });
    res.json({ name: biz.name, googleReviewLink: biz.googleReviewLink });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register Business
app.post('/api/register', async (req, res) => {
  try {
    const Business = require('./models/Business');
    const { name, ownerName, ownerPhone, googleReviewLink, email, password } = req.body;
    let existing = await Business.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User exists' });
    const newBiz = new Business({ name, ownerName, ownerPhone, googleReviewLink, email, password });
    await newBiz.save();
    res.status(201).json({ business: newBiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const Business = require('./models/Business');
    const { email, password } = req.body;
    const biz = await Business.findOne({ email, password });
    if (!biz) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ business: biz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Business Details
app.patch('/api/business/:id', async (req, res) => {
  try {
    const Business = require('./models/Business');
    const { id, _id, ...updateData } = req.body; // Protect internal IDs from being updated
    const updated = await Business.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: 'Store not found' });
    res.json({ business: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Capture Review
app.post('/api/reviews', async (req, res) => {
  try {
    const Review = require('./models/Review');
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json({ message: 'Feedback Captured' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Reviews
app.get('/api/reviews/business/:id', async (req, res) => {
  try {
    const Review = require('./models/Review');
    const reviews = await Review.find({ businessId: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend Live on http://localhost:${PORT}`));
