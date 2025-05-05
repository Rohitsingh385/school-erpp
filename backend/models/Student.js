const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  admissionNumber: {
    type: String,
    required: true,
    unique: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  parentName: {
    type: String,
    required: true
  },
  parentContact: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'transferred'],
    default: 'active'
  }
});

module.exports = mongoose.model('Student', studentSchema); 