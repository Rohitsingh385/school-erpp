/**
 * Seed data for development
 * This file provides mock data for testing the application
 */

const { generateAdmissionNumber } = require('./generateAdmissionNumber');

// Generate classes from Class 1 to 5 with sections
const generateClasses = () => {
  const classes = [];
  const sections = ['A', 'B', 'C'];
  const classNames = ['I', 'II', 'III', 'IV', 'V'];
  
  let id = 1;
  
  classNames.forEach(className => {
    sections.forEach(section => {
      // Vary capacity by class and section
      const capacity = 25 + Math.floor(Math.random() * 10);
      
      classes.push({
        _id: `c${id}`,
        name: className,
        section,
        capacity,
        academicYear: '2023-2024'
      });
      
      id++;
    });
  });
  
  return classes;
};

// Generate teachers
const generateTeachers = () => {
  const teachers = [
    { _id: 't1', name: 'John Smith', subject: 'Mathematics', contact: '9876543210', email: 'john.smith@school.com' },
    { _id: 't2', name: 'Sarah Johnson', subject: 'English', contact: '9876543211', email: 'sarah.johnson@school.com' },
    { _id: 't3', name: 'Michael Brown', subject: 'Science', contact: '9876543212', email: 'michael.brown@school.com' },
    { _id: 't4', name: 'Emily Davis', subject: 'Social Studies', contact: '9876543213', email: 'emily.davis@school.com' },
    { _id: 't5', name: 'Robert Wilson', subject: 'Physical Education', contact: '9876543214', email: 'robert.wilson@school.com' },
    { _id: 't6', name: 'Jennifer Lee', subject: 'Art', contact: '9876543215', email: 'jennifer.lee@school.com' },
    { _id: 't7', name: 'David Miller', subject: 'Music', contact: '9876543216', email: 'david.miller@school.com' },
    { _id: 't8', name: 'Lisa Taylor', subject: 'Computer Science', contact: '9876543217', email: 'lisa.taylor@school.com' }
  ];
  
  return teachers;
};

// Assign teachers to classes
const assignTeachersToClasses = (classes, teachers) => {
  const classesWithTeachers = classes.map((cls, index) => {
    // Assign a teacher to each class (cycling through the teachers)
    const teacherIndex = index % teachers.length;
    const teacher = teachers[teacherIndex];
    
    return {
      ...cls,
      teacher: {
        _id: teacher._id,
        name: teacher.name
      }
    };
  });
  
  return classesWithTeachers;
};

// Generate students
const generateStudents = (classes) => {
  const students = [];
  const firstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez'];
  const genders = ['male', 'female'];
  const wardTypes = ['GENERAL', 'OBC', 'SC', 'ST'];
  
  let id = 1;
  let admissionNumberCounter = 0;
  
  // Generate 10-15 students per class
  classes.forEach(cls => {
    // Generate a random number of students (10-15) for each class
    const numStudents = 10 + Math.floor(Math.random() * 6);
    
    for (let i = 1; i <= numStudents; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const wardType = wardTypes[Math.floor(Math.random() * wardTypes.length)];
      
      // Generate admission date (within last 2 years)
      const today = new Date();
      const admissionDate = new Date(
        today.getFullYear() - Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      );
      
      // Generate date of birth (5-15 years ago)
      const dobYear = today.getFullYear() - (5 + Math.floor(Math.random() * 10));
      const dateOfBirth = new Date(
        dobYear,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      );
      
      // Generate admission number
      admissionNumberCounter++;
      const admissionNumber = generateAdmissionNumber(admissionDate.getFullYear(), admissionNumberCounter);
      
      // Generate roll number
      const rollNumber = i.toString();
      
      students.push({
        _id: `s${id}`,
        name,
        admissionNumber,
        class: cls._id,
        className: cls.name,
        section: cls.section,
        rollNumber,
        gender,
        dateOfBirth: dateOfBirth.toISOString().split('T')[0],
        admissionDate: admissionDate.toISOString().split('T')[0],
        fatherName: `Mr. ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        motherName: `Mrs. ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        parentName: `Mr. ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        parentContact: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
        address: `${Math.floor(100 + Math.random() * 900)} Main St, City`,
        wardType,
        status: 'active'
      });
      
      id++;
    }
  });
  
  return students;
};

// Generate fee heads
const generateFeeHeads = () => {
  return [
    { id: 'fh1', name: 'Tuition Fee', amount: 1000, type: 'monthly', isClassBased: true },
    { id: 'fh2', name: 'Computer Fee', amount: 300, type: 'monthly', isClassBased: true },
    { id: 'fh3', name: 'Library Fee', amount: 200, type: 'monthly', isClassBased: false },
    { id: 'fh4', name: 'Sports Fee', amount: 150, type: 'monthly', isClassBased: false },
    { id: 'fh5', name: 'Development Fee', amount: 500, type: 'yearly', isClassBased: false },
    { id: 'fh6', name: 'Admission Fee', amount: 5000, type: 'one-time', isClassBased: true }
  ];
};

// Generate class-based fee structure
const generateClassFeeStructure = (classes) => {
  const classFeeStructure = {};
  
  classes.forEach(cls => {
    // Base multiplier depends on class level
    const classLevel = parseInt(cls.name.replace('I', '1').replace('V', '5')) || 1;
    const baseMultiplier = 1 + (classLevel * 0.1);
    
    classFeeStructure[cls._id] = {
      'fh1': Math.round(1000 * baseMultiplier), // Tuition fee
      'fh2': Math.round(300 * baseMultiplier),  // Computer fee
      'fh6': Math.round(5000 * baseMultiplier)  // Admission fee
    };
  });
  
  return classFeeStructure;
};

// Generate seed data
const generateSeedData = () => {
  const classes = generateClasses();
  const teachers = generateTeachers();
  const classesWithTeachers = assignTeachersToClasses(classes, teachers);
  const students = generateStudents(classesWithTeachers);
  const feeHeads = generateFeeHeads();
  const classFeeStructure = generateClassFeeStructure(classesWithTeachers);
  
  return {
    classes: classesWithTeachers,
    teachers,
    students,
    feeHeads,
    classFeeStructure,
    payments: [],
    paidMonths: {}
  };
};

module.exports = {
  generateSeedData
};