const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// In-memory storage for attendance records
let attendanceRecords = [];

// Export the attendance records for other modules to use
const getAttendanceRecords = () => attendanceRecords;
router.getAttendanceRecords = getAttendanceRecords;

// @route   GET api/attendance/class/:classId/students
// @desc    Get students for a class
// @access  Public (for development)
router.get('/class/:classId/students', async (req, res) => {
  try {
    const { classId } = req.params;
    
    // Get students for this class
    const students = global.appData.students.filter(s => 
      s.class === classId && s.status === 'active'
    );
    
    if (!students.length) {
      return res.status(404).json({ message: 'No students found in this class' });
    }
    
    // Return only necessary fields
    const studentData = students.map(s => ({
      _id: s._id,
      name: s.name,
      admissionNumber: s.admissionNumber,
      rollNumber: s.rollNumber
    }));
    
    res.json(studentData);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/attendance
// @desc    Get attendance records with filtering options
// @access  Public (for development)
router.get('/', async (req, res) => {
  try {
    const { classId, studentId, date, startDate, endDate } = req.query;
    
    // Filter attendance records
    let filteredRecords = [...attendanceRecords];
    
    if (classId) {
      filteredRecords = filteredRecords.filter(record => record.classId === classId);
    }
    
    if (studentId) {
      filteredRecords = filteredRecords.filter(record => record.studentId === studentId);
    }
    
    if (date) {
      // For a specific date
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filteredRecords = filteredRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= targetDate && recordDate < nextDay;
      });
    } else if (startDate && endDate) {
      // For a date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      filteredRecords = filteredRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= start && recordDate <= end;
      });
    }
    
    // Check if future date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date) {
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      
      if (checkDate > today) {
        return res.status(400).json({ message: 'Cannot access attendance for future dates' });
      }
    }
    
    // Populate student and class details
    const populatedRecords = filteredRecords.map(record => {
      const student = global.appData.students.find(s => s._id === record.studentId);
      const classDetails = global.appData.classes.find(c => c._id === record.classId);
      
      return {
        ...record,
        student: student ? {
          name: student.name,
          admissionNumber: student.admissionNumber,
          rollNumber: student.rollNumber
        } : null,
        class: classDetails ? {
          name: classDetails.name,
          section: classDetails.section
        } : null
      };
    });
    
    // Log the records for debugging
    console.log(`Returning ${populatedRecords.length} attendance records for date: ${date}, class: ${classId}`);
    
    res.json(populatedRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/attendance
// @desc    Create an attendance record
// @access  Public (for development)
router.post('/', [
  [
    body('studentId', 'Student is required').not().isEmpty(),
    body('classId', 'Class is required').not().isEmpty(),
    body('date', 'Date is required').not().isEmpty(),
    body('status', 'Status must be valid').isIn(['present', 'absent', 'late', 'halfday', 'leave'])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { studentId, classId, date, status, remarks } = req.body;

    // Check if student exists
    const student = global.appData.students.find(s => s._id === studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if class exists
    const classDetails = global.appData.classes.find(c => c._id === classId);
    if (!classDetails) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if attendance record already exists for this student on this date
    const existingRecord = attendanceRecords.find(
      record => record.studentId === studentId && record.date === date
    );

    if (existingRecord) {
      // Update existing attendance
      existingRecord.status = status;
      existingRecord.remarks = remarks;
      
      return res.json(existingRecord);
    }

    // Create new attendance record
    const attendanceRecord = {
      id: `att${attendanceRecords.length + 1}`,
      studentId,
      classId,
      date,
      status,
      remarks,
      createdAt: new Date().toISOString()
    };

    attendanceRecords.push(attendanceRecord);
    res.status(201).json(attendanceRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/attendance/bulk
// @desc    Create multiple attendance records
// @access  Public (for development)
router.post('/bulk', async (req, res) => {
  try {
    const { classId, date, records } = req.body;

    if (!classId || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Check if class exists
    const classExists = global.appData.classes.find(c => c._id === classId);
    if (!classExists) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const results = {
      created: 0,
      updated: 0,
      failed: 0
    };
    
    // Process each attendance record
    for (const record of records) {
      try {
        const { studentId, status, remarks } = record;
        
        if (!studentId || !status) {
          results.failed++;
          continue;
        }

        // Check if student exists
        const studentExists = global.appData.students.find(s => s._id === studentId);
        if (!studentExists) {
          results.failed++;
          continue;
        }

        // Check if attendance already exists for this student on this date
        const existingRecordIndex = attendanceRecords.findIndex(
          r => r.studentId === studentId && r.date === date
        );

        if (existingRecordIndex !== -1) {
          // Update existing attendance
          attendanceRecords[existingRecordIndex].status = status;
          attendanceRecords[existingRecordIndex].remarks = remarks || attendanceRecords[existingRecordIndex].remarks;
          
          results.updated++;
        } else {
          // Create new attendance
          const attendanceRecord = {
            id: `att${attendanceRecords.length + 1}`,
            studentId,
            classId,
            date,
            status,
            remarks: remarks || '',
            createdAt: new Date().toISOString()
          };
          
          attendanceRecords.push(attendanceRecord);
          results.created++;
        }
      } catch (error) {
        console.error('Error processing attendance record:', error);
        results.failed++;
      }
    }
    
    // Make sure the attendance records are available in global app data
    if (!global.appData.attendanceRecords) {
      global.appData.attendanceRecords = [...attendanceRecords];
    } else {
      // Update global app data with the new/updated records
      for (const record of attendanceRecords) {
        const existingIndex = global.appData.attendanceRecords.findIndex(
          r => r.studentId === record.studentId && r.date === record.date
        );
        
        if (existingIndex !== -1) {
          global.appData.attendanceRecords[existingIndex] = record;
        } else {
          global.appData.attendanceRecords.push(record);
        }
      }
    }
    
    // Log the attendance records for debugging
    console.log(`Processed attendance for class ${classId} on ${date}:`);
    console.log(`Created: ${results.created}, Updated: ${results.updated}, Failed: ${results.failed}`);
    console.log(`Total attendance records: ${attendanceRecords.length}`);
    console.log(`Global attendance records: ${global.appData.attendanceRecords ? global.appData.attendanceRecords.length : 0}`);
    
    res.json({
      success: true,
      message: 'Attendance processed successfully',
      results
    });
  } catch (err) {
    console.error('Error in bulk attendance:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/attendance/report
// @desc    Get attendance report
// @access  Public (for development)
router.get('/report', async (req, res) => {
  try {
    const { classId, month, year } = req.query;
    
    if (!classId || !month || !year) {
      return res.status(400).json({ message: 'Class, month and year are required' });
    }
    
    // Get start and end date for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    // Get all students in the class
    const students = global.appData.students.filter(s => 
      s.class === classId && s.status === 'active'
    );
    
    if (!students.length) {
      return res.status(404).json({ message: 'No students found in this class' });
    }
    
    // Get attendance for the month
    const monthAttendance = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return record.classId === classId && 
             recordDate >= startDate && 
             recordDate <= endDate;
    });
    
    // Calculate attendance statistics for each student
    const report = students.map(student => {
      const studentAttendance = monthAttendance.filter(a => 
        a.studentId === student._id
      );
      
      const totalDays = endDate.getDate();
      const presentCount = studentAttendance.filter(a => a.status === 'present').length;
      const absentCount = studentAttendance.filter(a => a.status === 'absent').length;
      const lateCount = studentAttendance.filter(a => a.status === 'late').length;
      const halfdayCount = studentAttendance.filter(a => a.status === 'halfday').length;
      const leaveCount = studentAttendance.filter(a => a.status === 'leave').length;
      
      const attendancePercentage = (presentCount / totalDays) * 100;
      
      return {
        student: {
          _id: student._id,
          name: student.name,
          admissionNumber: student.admissionNumber,
          rollNumber: student.rollNumber
        },
        attendance: {
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          halfday: halfdayCount,
          leave: leaveCount,
          total: totalDays,
          percentage: attendancePercentage.toFixed(2)
        }
      };
    });
    
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;