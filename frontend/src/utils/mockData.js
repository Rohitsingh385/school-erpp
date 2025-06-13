// Mock data for development without backend

// Classes
export const mockClasses = [
  { _id: 'c1', name: 'LKG', section: 'A', capacity: 30, teacher: { name: 'John Smith' }, academicYear: '2023-2024' },
  { _id: 'c2', name: 'UKG', section: 'A', capacity: 30, teacher: { name: 'Sarah Johnson' }, academicYear: '2023-2024' },
  { _id: 'c3', name: 'I', section: 'A', capacity: 35, teacher: { name: 'Michael Brown' }, academicYear: '2023-2024' },
  { _id: 'c4', name: 'II', section: 'A', capacity: 35, teacher: { name: 'Emily Davis' }, academicYear: '2023-2024' },
  { _id: 'c5', name: 'III', section: 'A', capacity: 40, teacher: { name: 'Robert Wilson' }, academicYear: '2023-2024' }
];

// Teachers
export const mockTeachers = [
  { _id: 't1', name: 'John Smith', email: 'john@example.com', contact: '9876543210', subject: 'Mathematics', qualification: 'M.Sc.', experience: 5 },
  { _id: 't2', name: 'Sarah Johnson', email: 'sarah@example.com', contact: '9876543211', subject: 'Science', qualification: 'M.Sc.', experience: 7 },
  { _id: 't3', name: 'Michael Brown', email: 'michael@example.com', contact: '9876543212', subject: 'English', qualification: 'M.A.', experience: 4 },
  { _id: 't4', name: 'Emily Davis', email: 'emily@example.com', contact: '9876543213', subject: 'Social Studies', qualification: 'M.A.', experience: 6 },
  { _id: 't5', name: 'Robert Wilson', email: 'robert@example.com', contact: '9876543214', subject: 'Computer Science', qualification: 'M.Tech.', experience: 3 }
];

// Students
export const mockStudents = [
  { _id: 's1', name: 'John Doe', admissionNumber: 'ADM-2023-001', class: { name: 'LKG', section: 'A' }, parentName: 'Robert Doe', parentContact: '9876543210' },
  { _id: 's2', name: 'Jane Smith', admissionNumber: 'ADM-2023-002', class: { name: 'UKG', section: 'A' }, parentName: 'Michael Smith', parentContact: '9876543211' },
  { _id: 's3', name: 'Robert Johnson', admissionNumber: 'ADM-2023-003', class: { name: 'I', section: 'A' }, parentName: 'David Johnson', parentContact: '9876543212' }
];

// Wards
export const mockWards = [
  { _id: 'w1', name: 'GENERAL', description: 'General category', discount: 0 },
  { _id: 'w2', name: 'STAFF WARD', description: 'Staff children', discount: 50 },
  { _id: 'w3', name: 'RTE', description: 'Right to Education', discount: 100 }
];