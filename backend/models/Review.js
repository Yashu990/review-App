const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Business = require('./Business');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  businessId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Business,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT, // Using TEXT for potentially long comments
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Relationships
Business.hasMany(Review, { foreignKey: 'businessId' });
Review.belongsTo(Business, { foreignKey: 'businessId' });

module.exports = Review;
