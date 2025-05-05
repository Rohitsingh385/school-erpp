const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Enquiry = require('../models/Enquiry');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET api/enquiry
// @desc    Get all enquiries
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // TODO: Implement enquiry fetching logic
    res.json({ message: 'Get all enquiries' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/enquiry
// @desc    Create an enquiry
// @access  Public
router.post('/', async (req, res) => {
  try {
    // TODO: Implement enquiry creation logic
    res.json({ message: 'Create an enquiry' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all enquiries (admin only)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new enquiry (public)
router.post('/',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('phone').notEmpty().trim(),
    body('subject').notEmpty().trim(),
    body('message').notEmpty().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const enquiry = new Enquiry(req.body);
      await enquiry.save();
      res.status(201).json(enquiry);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update enquiry status (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { status, response } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    enquiry.status = status;
    enquiry.response = response;
    enquiry.handledBy = req.user._id;
    enquiry.updatedAt = Date.now();

    await enquiry.save();
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete enquiry (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.json({ message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 