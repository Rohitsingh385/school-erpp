const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');

// Simple in-memory storage for wards (replace with database model in production)
let wards = [
  { _id: 'w1', name: 'GENERAL', description: 'General category', discount: 0 },
  { _id: 'w2', name: 'STAFF WARD', description: 'Staff children', discount: 50 },
  { _id: 'w3', name: 'RTE', description: 'Right to Education', discount: 100 }
];
let nextId = 4;

// @route   GET api/ward
// @desc    Get all wards
// @access  Public (for development)
router.get('/', async (req, res) => {
  try {
    res.json(wards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ward
// @desc    Create a new ward
// @access  Private/Admin
router.post(
  '/',
  [
    adminAuth,
    [
      body('name', 'Name is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, discount } = req.body;

      // Check if ward already exists
      const existingWard = wards.find(w => w.name === name);
      if (existingWard) {
        return res.status(400).json({ message: 'Ward already exists' });
      }

      const ward = {
        _id: `w${nextId++}`,
        name,
        description,
        discount: discount || 0,
        isActive: true
      };

      wards.push(ward);
      res.status(201).json(ward);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/ward/:id
// @desc    Update ward
// @access  Private/Admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const wardIndex = wards.findIndex(w => w._id === id);
    
    if (wardIndex === -1) {
      return res.status(404).json({ message: 'Ward not found' });
    }
    
    // Update ward fields
    const updatedWard = { ...wards[wardIndex], ...req.body };
    wards[wardIndex] = updatedWard;
    
    res.json(updatedWard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/ward/:id
// @desc    Delete a ward
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const wardIndex = wards.findIndex(w => w._id === id);
    
    if (wardIndex === -1) {
      return res.status(404).json({ message: 'Ward not found' });
    }
    
    wards = wards.filter(w => w._id !== id);
    res.json({ message: 'Ward removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;