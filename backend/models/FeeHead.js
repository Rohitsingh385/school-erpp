const mongoose = require('mongoose');

const feeHeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  frequency: {
    type: String,
    enum: ['monthly', 'yearly', 'one-time'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FeeHead', feeHeadSchema);