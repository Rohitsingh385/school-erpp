const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET api/attendance
// @desc    Get all attendance records
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { classId, date } = req.query;
    const query = {};

    if (classId) query.class = classId;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name admissionNumber')
      .populate('class', 'name section')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/attendance
// @desc    Create an attendance record
// @access  Private/Admin
router.post('/', adminAuth, async (req, res) => {
  try {
    // TODO: Implement attendance creation logic
    res.json({ message: 'Create an attendance record' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get students for a class
router.get('/class/:classId/students', auth, async (req, res) => {
  try {
    const students = await Student.find({ class: req.params.classId, status: 'active' })
      .select('name admissionNumber')
      .sort('name');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 