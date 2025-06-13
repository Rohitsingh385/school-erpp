const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');

// Simple in-memory storage for teachers (replace with database model in production)
let teachers = [];
let nextId = 1;

// @route   GET api/teacher
// @desc    Get all teachers
// @access  Public (for development)
router.get('/', async (req, res) => {
  try {
    res.json(teachers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/teacher/:id
// @desc    Get teacher by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const teacher = teachers.find(t => t._id === id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    res.json(teacher);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/teacher
// @desc    Create a new teacher
// @access  Private/Admin
router.post(
  '/',
  [
    adminAuth,
    [
      body('name', 'Name is required').not().isEmpty(),
      body('email', 'Please include a valid email').isEmail(),
      body('contact', 'Contact is required').not().isEmpty(),
      body('subject', 'Subject is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, contact, subject, qualification, experience } = req.body;

      // Check if email already exists
      const existingTeacher = teachers.find(t => t.email === email);
      if (existingTeacher) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const teacher = {
        _id: `t${nextId++}`,
        name,
        email,
        contact,
        subject,
        qualification,
        experience,
        joinDate: new Date(),
        status: 'active'
      };

      teachers.push(teacher);
      res.status(201).json(teacher);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/teacher/:id
// @desc    Update teacher information
// @access  Private/Admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const teacherIndex = teachers.findIndex(t => t._id === id);
    
    if (teacherIndex === -1) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    // Update teacher fields
    const updatedTeacher = { ...teachers[teacherIndex], ...req.body };
    teachers[teacherIndex] = updatedTeacher;
    
    res.json(updatedTeacher);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/teacher/:id
// @desc    Delete a teacher
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const teacherIndex = teachers.findIndex(t => t._id === id);
    
    if (teacherIndex === -1) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    teachers = teachers.filter(t => t._id !== id);
    res.json({ message: 'Teacher removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;