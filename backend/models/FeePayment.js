const mongoose = require('mongoose');

const feePaymentItemSchema = new mongoose.Schema({
  feeHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeeHead',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  month: {
    type: String
  },
  year: {
    type: String
  }
});

const feePaymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [feePaymentItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  lateFine: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'cheque', 'online'],
    required: true
  },
  transactionId: {
    type: String
  },
  remarks: {
    type: String
  },
  academicYear: {
    type: String,
    required: true
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FeePayment', feePaymentSchema);