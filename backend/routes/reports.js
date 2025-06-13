const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Daily Collection Report
router.get('/daily-collection', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    
    // Filter payments by date
    const dailyPayments = global.appData.payments.filter(payment => {
      return payment.paymentDate === date;
    });
    
    res.json(dailyPayments);
  } catch (err) {
    console.error('Error fetching daily collection:', err);
    res.status(500).send('Server Error');
  }
});

// Monthly Collection Report
router.get('/monthly-collection', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    // Filter payments by date range
    const monthlyPayments = global.appData.payments.filter(payment => {
      const paymentDate = new Date(payment.paymentDate);
      return paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);
    });
    
    res.json(monthlyPayments);
  } catch (err) {
    console.error('Error fetching monthly collection:', err);
    res.status(500).send('Server Error');
  }
});

// Student Strength Report
router.get('/student-strength', async (req, res) => {
  try {
    const classStrength = [];
    
    // Group students by class and count
    global.appData.classes.forEach(cls => {
      const students = global.appData.students.filter(student => student.class === cls._id);
      
      const boys = students.filter(student => student.gender === 'male').length;
      const girls = students.filter(student => student.gender === 'female').length;
      
      classStrength.push({
        id: cls._id,
        className: cls.name,
        section: cls.section,
        boys,
        girls,
        totalStudents: boys + girls
      });
    });
    
    res.json(classStrength);
  } catch (err) {
    console.error('Error fetching student strength:', err);
    res.status(500).send('Server Error');
  }
});

// Attendance Report
router.get('/attendance', async (req, res) => {
  try {
    const { classId, date } = req.query;
    
    if (!classId || !date) {
      return res.status(400).json({ message: 'Class ID and date are required' });
    }
    
    // Get all attendance records from the global app data or the imported module
    const attendanceRecords = global.appData.attendanceRecords || 
                             (require('../routes/attendance').getAttendanceRecords) || [];
    
    console.log(`Total attendance records available: ${attendanceRecords.length}`);
    
    // Filter attendance records for the specific class and date
    const classAttendance = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      const queryDate = new Date(date).toISOString().split('T')[0];
      return record.classId === classId && recordDate === queryDate;
    });
    
    console.log(`Found ${classAttendance.length} attendance records for class ${classId} on ${date}`);
    
    // Get students in the class
    const classStudents = global.appData.students.filter(student => 
      student.class === classId
    );
    
    console.log(`Found ${classStudents.length} students in class ${classId}`);
    
    // Map attendance data with student details
    const attendanceData = classStudents.map(student => {
      // Find attendance record for this student
      const record = classAttendance.find(r => r.studentId === student._id);
      
      return {
        id: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        status: record ? record.status : 'absent',
        remark: record ? record.remarks : ''
      };
    });
    
    console.log(`Returning ${attendanceData.length} attendance records for reporting`);
    
    res.json(attendanceData);
  } catch (err) {
    console.error('Error fetching attendance data:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;