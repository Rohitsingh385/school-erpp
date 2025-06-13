const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// @route   GET api/class
// @desc    Get all classes
// @access  Public (for development)
router.get('/', async (req, res) => {
  try {
    res.json(global.appData.classes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/class/:id
// @desc    Get class by ID
// @access  Public (for development)
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const classItem = global.appData.classes.find(c => c._id === id);
    
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    res.json(classItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/class
// @desc    Create a new class
// @access  Public (for development)
router.post(
  '/',
  [
    [
      body('name', 'Name is required').not().isEmpty(),
      body('section', 'Section is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, section, teacher, capacity, academicYear } = req.body;

      // Generate new ID
      const nextId = global.appData.classes.length + 1;
      
      const classItem = {
        _id: `c${nextId}`,
        name,
        section,
        teacher,
        capacity,
        academicYear,
        createdAt: new Date()
      };

      global.appData.classes.push(classItem);
      res.status(201).json(classItem);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/class/:id
// @desc    Update class information
// @access  Public (for development)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const classIndex = global.appData.classes.findIndex(c => c._id === id);
    
    if (classIndex === -1) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Update class fields
    const updatedClass = { ...global.appData.classes[classIndex], ...req.body };
    global.appData.classes[classIndex] = updatedClass;
    
    res.json(updatedClass);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/class/:id
// @desc    Delete a class
// @access  Public (for development)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const classIndex = global.appData.classes.findIndex(c => c._id === id);
    
    if (classIndex === -1) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    global.appData.classes = global.appData.classes.filter(c => c._id !== id);
    res.json({ message: 'Class removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;