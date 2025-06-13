const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');

// Simple in-memory storage for enquiries (replace with database model in production)
let enquiries = [];
let nextId = 1;

// @route   GET api/enquiry
// @desc    Get all enquiries
// @access  Public (for development)
router.get('/', async (req, res) => {
  try {
    res.json(enquiries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/enquiry
// @desc    Create a new enquiry
// @access  Public
router.post(
  '/',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('phone', 'Phone is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('message', 'Message is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, phone, email, message } = req.body;

      const enquiry = {
        id: nextId++,
        name,
        phone,
        email,
        message,
        status: 'new',
        createdAt: new Date()
      };

      enquiries.push(enquiry);
      res.status(201).json(enquiry);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/enquiry/:id
// @desc    Update enquiry status
// @access  Private/Admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const id = parseInt(req.params.id);

    const enquiryIndex = enquiries.findIndex(e => e.id === id);
    if (enquiryIndex === -1) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    enquiries[enquiryIndex].status = status;
    res.json(enquiries[enquiryIndex]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/enquiry/:id
// @desc    Delete an enquiry
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const enquiryIndex = enquiries.findIndex(e => e.id === id);
    
    if (enquiryIndex === -1) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    
    enquiries = enquiries.filter(e => e.id !== id);
    res.json({ message: 'Enquiry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;