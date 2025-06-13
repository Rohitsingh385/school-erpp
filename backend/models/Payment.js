const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  fees: [{
    fee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fee'
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  lateFine: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'cheque'],
    required: true
  },
  cardDetails: {
    cardNumber: String,
    bankName: String
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);