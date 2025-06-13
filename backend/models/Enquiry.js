/*
  ✨ Coded with vibes by Rowhit (@rohiteeee)

  🔗 GitHub:   github.com/Rohitsingh385
  💼 LinkedIn: linkedin.com/in/rohiteeee
  📧 Email:    rk301855@gmail.com

  🧃 If you're using this, toss some credit — it's only fair.
  🧠 Built from scratch, not snatched. Respect the grind.
  
*/

const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  response: {
    type: String
  }
});

module.exports = mongoose.model('Enquiry', enquirySchema); 