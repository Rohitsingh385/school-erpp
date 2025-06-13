require('dotenv').config();
const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school-erp')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/*
  ✨ Coded with vibes by Rowhit (@rohiteeee)

  🔗 GitHub:   github.com/Rohitsingh385
  💼 LinkedIn: linkedin.com/in/rohiteeee
  📧 Email:    rk301855@gmail.com

  🧃 If you're using this, toss some credit — it's only fair.
  🧠 Built from scratch, not snatched. Respect the grind.
  
*/

const seedData = async () => {
  try {
    // Check if admin exists, create if not
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const admin = new User({
        name: 'Admin User',
        email: 'admin@school.com',
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      console.log('Admin user created successfully');
    }

    // Create teachers
    const teachers = [
      {
        name: 'John Smith',
        email: 'john.smith@school.com',
        contact: '555-1234',
        subject: 'Mathematics',
        qualification: 'M.Sc. Mathematics',
        experience: 5,
        status: 'active'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@school.com',
        contact: '555-5678',
        subject: 'Science',
        qualification: 'Ph.D. Physics',
        experience: 8,
        status: 'active'
      },
      {
        name: 'Michael Brown',
        email: 'michael.brown@school.com',
        contact: '555-9012',
        subject: 'English',
        qualification: 'M.A. English Literature',
        experience: 6,
        status: 'active'
      }
    ];

    // Insert teachers
    const insertedTeachers = await Teacher.insertMany(teachers);
    console.log(`${insertedTeachers.length} teachers inserted`);

    // Create classes
    const classes = [
      {
        name: 'Grade 1',
        section: 'A',
        teacher: insertedTeachers[0]._id,
        capacity: 30,
        academicYear: '2023-2024',
        status: 'active'
      },
      {
        name: 'Grade 2',
        section: 'A',
        teacher: insertedTeachers[1]._id,
        capacity: 30,
        academicYear: '2023-2024',
        status: 'active'
      },
      {
        name: 'Grade 3',
        section: 'A',
        teacher: insertedTeachers[2]._id,
        capacity: 30,
        academicYear: '2023-2024',
        status: 'active'
      }
    ];

    // Insert classes
    const insertedClasses = await Class.insertMany(classes);
    console.log(`${insertedClasses.length} classes inserted`);

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
