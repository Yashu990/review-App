require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const Business = require('./models/Business');
const Review = require('./models/Review');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Serve Static Dummy Page
app.use(express.static(path.join(__dirname, 'public')));

// DB Connection & Sync with force: true to reset IDs to Serial for your demo
// NOTE: Use force: false for production!
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL Connected via Sequelize');
    // Set force: false to keep your data across restarts!
    return sequelize.sync({ force: false }); 
  })
  .then(() => console.log('Database Synced'))
  .catch(err => console.error('PostgreSQL Connection/Sync Error:', err));

// --- Pages ---
// Serve landing page at /rate-us
app.get('/rate-us', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve Static Assets (Illustrations, etc.)
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// --- API Endpoints ---

app.get('/api/business/:id', async (req, res) => {
  try {
    const bizId = req.params.id;
    const biz = await Business.findByPk(bizId);
    if (!biz) return res.status(404).json({ error: 'Store not found' });
    res.json({ name: biz.name, googleReviewLink: biz.googleReviewLink, logo: biz.logo, ownerName: biz.ownerName, ownerPhone: biz.ownerPhone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { id, _id, name, ownerName, ownerPhone, googleReviewLink, email, password } = req.body;
    let existing = await Business.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User exists' });
    const newBiz = await Business.create({ name, ownerName, ownerPhone, googleReviewLink, email, password });
    res.status(201).json({ business: newBiz });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const biz = await Business.findOne({ where: { email, password } });
    if (!biz) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ business: biz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/business/:id', async (req, res) => {
  try {
    const bizId = req.params.id;
    const { id, _id, ...updateData } = req.body;
    const [rowsUpdated] = await Business.update(updateData, { where: { id: bizId } });
    if (rowsUpdated === 0) return res.status(404).json({ error: 'Store not found' });
    const updated = await Business.findByPk(bizId);
    res.json({ business: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { id, _id, ...reviewData } = req.body;
    const newReview = await Review.create(reviewData);
    res.status(201).json({ message: 'Feedback Captured' });
  } catch (err) {
    console.error('Review Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews/business/:id', async (req, res) => {
  try {
    const bizId = req.params.id;
    const reviews = await Review.findAll({ 
      where: { businessId: bizId }, 
      order: [['createdAt', 'DESC']] 
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
    res.json({ status: 'up', message: 'Backend is Live!', ip: '192.168.1.21' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend Live and accessible at http://192.168.1.21:${PORT}`);
    console.log(`Health check: http://192.168.1.21:${PORT}/health`);
});
