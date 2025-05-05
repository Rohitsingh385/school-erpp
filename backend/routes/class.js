const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET api/class
// @desc    Get all classes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // TODO: Implement class fetching logic
    res.json({ message: 'Get all classes' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/class
// @desc    Create a class
// @access  Private/Admin
router.post('/', adminAuth, async (req, res) => {
  try {
    // TODO: Implement class creation logic
    res.json({ message: 'Create a class' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 