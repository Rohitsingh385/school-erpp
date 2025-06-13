const mongoose = require('mongoose');

const lateFineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  startDay: {
    type: Number,
    required: true,
    min: 1,
    max: 31
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['fixed', 'percentage', 'per-day'],
    default: 'fixed'
  },
  maxAmount: {
    type: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  academicYear: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LateFine', lateFineSchema);