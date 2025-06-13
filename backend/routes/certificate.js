const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');

// Simple in-memory storage for certificates (replace with database model in production)
let certificates = [];
let nextId = 1;

// @route   GET api/certificate
// @desc    Get all certificates
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { studentId } = req.query;
    
    if (studentId) {
      const filteredCertificates = certificates.filter(cert => cert.student === studentId);
      return res.json(filteredCertificates);
    }
    
    res.json(certificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/certificate/:id
// @desc    Get certificate by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const certificate = certificates.find(c => c._id === id);
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json(certificate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/certificate
// @desc    Create a new certificate
// @access  Private/Admin
router.post(
  '/',
  [
    adminAuth,
    [
      body('student', 'Student is required').not().isEmpty(),
      body('type', 'Certificate type is required').not().isEmpty(),
      body('issueDate', 'Issue date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { student, type, issueDate, content, remarks } = req.body;

      const certificate = {
        _id: `cert${nextId++}`,
        student,
        type,
        issueDate,
        content,
        remarks,
        issuedBy: req.user.id,
        createdAt: new Date()
      };

      certificates.push(certificate);
      res.status(201).json(certificate);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/certificate/:id
// @desc    Update certificate
// @access  Private/Admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const certificateIndex = certificates.findIndex(c => c._id === id);
    
    if (certificateIndex === -1) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    // Update certificate fields
    const updatedCertificate = { ...certificates[certificateIndex], ...req.body };
    certificates[certificateIndex] = updatedCertificate;
    
    res.json(updatedCertificate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/certificate/:id
// @desc    Delete a certificate
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const certificateIndex = certificates.findIndex(c => c._id === id);
    
    if (certificateIndex === -1) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    certificates = certificates.filter(c => c._id !== id);
    res.json({ message: 'Certificate removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;