const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Business = sequelize.define('Business', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { type: DataTypes.TEXT, allowNull: false },
  ownerName: { type: DataTypes.TEXT, allowNull: false },
  ownerPhone: { type: DataTypes.STRING, allowNull: false },
  googleReviewLink: { type: DataTypes.TEXT, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  logo: { type: DataTypes.TEXT, defaultValue: '' },

  // ── Referral System ──────────────────────────────────
  referralCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  referralCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  plan: {
    type: DataTypes.STRING,
    defaultValue: 'Free Trial', // Choices: Free Trial, Basic, Standard, Premium
  },
  businessType: { type: DataTypes.STRING, defaultValue: 'Both' }, // In Person, Remotely, Both
  privacyTier: { type: DataTypes.STRING, defaultValue: '5-star' }, // 5-star, 4-5-star
  qrStyle: { type: DataTypes.STRING, defaultValue: 'default' },
  points: { type: DataTypes.INTEGER, defaultValue: 0 },
  credits: { type: DataTypes.INTEGER, defaultValue: 7 },
}, {
  timestamps: true,
});

module.exports = Business;
