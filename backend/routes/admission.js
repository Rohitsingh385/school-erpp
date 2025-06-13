const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { generateAdmissionNumber } = require('../utils/generateAdmissionNumber');

// @route   GET api/admission
// @desc    Get all students
// @access  Public (for development)
router.get('/', async (req, res) => {
  try {
    const { class: classId } = req.query;
    
    if (classId) {
      const filteredStudents = global.appData.students.filter(student => student.class === classId);
      return res.json(filteredStudents);
    }
    
    res.json(global.appData.students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admission/:id
// @desc    Get student by ID
// @access  Public (for development)
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const student = global.appData.students.find(s => s._id === id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admission/next-admission-number
// @desc    Get next available admission number
// @access  Public (for development)
router.get('/next-admission-number', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const lastAdmissionNumber = global.appData.students
      .filter(s => s.admissionNumber.includes(`ADM-${currentYear}`))
      .map(s => s.admissionNumber)
      .sort()
      .pop();
    
    let lastSequence = 0;
    if (lastAdmissionNumber) {
      lastSequence = parseInt(lastAdmissionNumber.split('-')[2]);
    }
    
    const nextAdmissionNumber = generateAdmissionNumber(currentYear, lastSequence);
    
    res.json({ admissionNumber: nextAdmissionNumber });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admission/next-roll-number/:classId
// @desc    Get next available roll number for a class
// @access  Public (for development)
router.get('/next-roll-number/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    
    // Get assigned roll numbers for this class
    const assignedRollNumbers = global.appData.students
      .filter(s => s.class === classId)
      .map(s => s.rollNumber);
    
    // Find the next available roll number
    let nextRollNumber = '1';
    for (let i = 1; i <= 100; i++) {
      const rollNumber = i.toString();
      if (!assignedRollNumbers.includes(rollNumber)) {
        nextRollNumber = rollNumber;
        break;
      }
    }
    
    res.json({ rollNumber: nextRollNumber });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admission
// @desc    Admit a new student
// @access  Public (for development)
router.post(
  '/',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('admissionNumber', 'Admission number is required').not().isEmpty(),
    body('class', 'Class is required').not().isEmpty(),
    body('rollNumber', 'Roll number is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        name,
        admissionNumber,
        dateOfBirth,
        gender,
        address,
        parentName,
        parentContact,
        class: classId,
        rollNumber
      } = req.body;

      // Check if admission number already exists
      const existingStudent = global.appData.students.find(s => s.admissionNumber === admissionNumber);
      if (existingStudent) {
        return res.status(400).json({ message: 'Admission number already exists' });
      }

      // Check if roll number is already assigned in this class
      const rollNumberExists = global.appData.students.some(
        s => s.class === classId && s.rollNumber === rollNumber
      );
      
      if (rollNumberExists) {
        return res.status(400).json({ message: 'Roll number already assigned in this class' });
      }

      // Get class details
      const classDetails = global.appData.classes.find(c => c._id === classId);
      if (!classDetails) {
        return res.status(404).json({ message: 'Class not found' });
      }

      // Generate new student ID
      const nextId = global.appData.students.length + 1;
      
      const student = {
        _id: `s${nextId}`,
        name,
        admissionNumber,
        dateOfBirth,
        gender,
        address,
        parentName,
        parentContact,
        class: classId,
        className: classDetails.name,
        section: classDetails.section,
        rollNumber,
        admissionDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };

      global.appData.students.push(student);
      res.status(201).json(student);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/admission/:id
// @desc    Update student information
// @access  Public (for development)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const studentIndex = global.appData.students.findIndex(s => s._id === id);
    
    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const oldStudent = global.appData.students[studentIndex];
    
    // Don't allow changing admission number
    if (req.body.admissionNumber && req.body.admissionNumber !== oldStudent.admissionNumber) {
      return res.status(400).json({ message: 'Admission number cannot be changed' });
    }
    
    // Check if changing class or roll number
    if (req.body.class && req.body.class !== oldStudent.class) {
      // Check if roll number is available in new class
      const rollNumberExists = global.appData.students.some(
        s => s.class === req.body.class && 
            s.rollNumber === (req.body.rollNumber || oldStudent.rollNumber) &&
            s._id !== id
      );
      
      if (rollNumberExists) {
        return res.status(400).json({ message: 'Roll number already assigned in the new class' });
      }
      
      // Update class details
      const classDetails = global.appData.classes.find(c => c._id === req.body.class);
      if (classDetails) {
        req.body.className = classDetails.name;
        req.body.section = classDetails.section;
      }
    }
    
    // Update student fields
    const updatedStudent = { ...oldStudent, ...req.body };
    global.appData.students[studentIndex] = updatedStudent;
    
    res.json(updatedStudent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/admission/:id
// @desc    Delete a student
// @access  Public (for development)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const studentIndex = global.appData.students.findIndex(s => s._id === id);
    
    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    global.appData.students = global.appData.students.filter(s => s._id !== id);
    res.json({ message: 'Student removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;