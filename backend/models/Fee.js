const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  feeHeads: [{
    feeHead: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'partial'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Fee', FeeSchema);