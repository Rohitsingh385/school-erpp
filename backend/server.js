/*
  ✨ Coded with vibes by Rowhit (@rohiteeee)

  🔗 GitHub:   github.com/Rohitsingh385
  💼 LinkedIn: linkedin.com/in/rohiteeee
  📧 Email:    rk301855@gmail.com

  🧃 If you're using this, toss some credit — it's only fair.
  🧠 Built from scratch, not snatched. Respect the grind.
  
*/

const express = require('express');
const cors = require('cors');
const { generateSeedData } = require('./utils/seedData');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize global app data structure
if (!global.appData) {
  console.log('Initializing app data with seed data');
  const seedData = generateSeedData();
  global.appData = {
    classes: seedData.classes,
    teachers: seedData.teachers,
    students: seedData.students,
    feeHeads: seedData.feeHeads,
    classFeeStructure: seedData.classFeeStructure,
    payments: seedData.payments,
    paidMonths: seedData.paidMonths,
    attendanceRecords: []
  };
} else {
  console.log('Using existing app data');
}

// Make sure attendanceRecords exists
if (!global.appData.attendanceRecords) {
  global.appData.attendanceRecords = [];
}

// Routes
app.use('/api/class', require('./routes/class'));
app.use('/api/admission', require('./routes/admission'));
app.use('/api/fee', require('./routes/fee'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/admin', require('./routes/admin')); // Add admin routes
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/enquiry', require('./routes/enquiry'));
app.use('/api/ward', require('./routes/ward'));
app.use('/api/reports', require('./routes/reports')); // Add reports routes

// Default route
app.get('/', (req, res) => {
  res.send('ERP API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Seed data generated: ${global.appData.students.length} students, ${global.appData.classes.length} classes`);
});