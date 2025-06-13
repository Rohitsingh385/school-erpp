const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  feeHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeeHead',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  wardType: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
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

// Compound index to prevent duplicate fee structures
feeStructureSchema.index({ feeHead: 1, class: 1, wardType: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);