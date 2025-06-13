/*
  ✨ Coded with vibes by Rowhit (@rohiteeee)

  🔗 GitHub:   github.com/Rohitsingh385
  💼 LinkedIn: linkedin.com/in/rohiteeee
  📧 Email:    rk301855@gmail.com

  🧃 If you're using this, toss some credit — it's only fair.
  🧠 Built from scratch, not snatched. Respect the grind.
  
*/

const express = require('express');
const router = express.Router();
const { generateSeedData } = require('../utils/seedData');

// @route   POST api/admin/reset
// @desc    Reset all data and generate new seed data
// @access  Public (for development)
router.post('/reset', async (req, res) => {
  try {
    // Generate new seed data
    const seedData = generateSeedData();
    
    // Replace all global data
    global.appData = {
      classes: seedData.classes,
      teachers: seedData.teachers,
      students: seedData.students,
      feeHeads: seedData.feeHeads,
      classFeeStructure: seedData.classFeeStructure,
      payments: seedData.payments,
      paidMonths: seedData.paidMonths
    };
    
    res.json({ 
      message: 'Data reset successfully', 
      stats: {
        classes: global.appData.classes.length,
        teachers: global.appData.teachers.length,
        students: global.appData.students.length
      }
    });
  } catch (err) {
    console.error('Error resetting data:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;