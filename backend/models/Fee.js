const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['tuition', 'transport', 'library', 'other'],
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer'],
    required: function() {
      return this.status === 'paid';
    }
  },
  receiptNumber: {
    type: String,
    required: function() {
      return this.status === 'paid';
    }
  }
});

module.exports = mongoose.model('Fee', feeSchema); 