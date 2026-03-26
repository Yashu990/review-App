const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Business = sequelize.define('Business', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ownerName: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ownerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^\d{10}$/ // Ensures exactly 10 digits
    }
  },
  googleReviewLink: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logo: {
    type: DataTypes.TEXT, // Using TEXT for potentially long Base64
    defaultValue: '',
  },
}, {
  timestamps: true, // Includes createdAt/updatedAt
});

module.exports = Business;
