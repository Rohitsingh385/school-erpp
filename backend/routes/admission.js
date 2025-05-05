const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET api/admission
// @desc    Get all admissions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // TODO: Implement admission fetching logic
    res.json({ message: 'Get all admissions' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admission
// @desc    Create an admission
// @access  Private/Admin
router.post('/', adminAuth, async (req, res) => {
  try {
    // TODO: Implement admission creation logic
    res.json({ message: 'Create an admission' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;