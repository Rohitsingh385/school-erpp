import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function Attendance() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user.role === 'admin') {
      fetchClasses();
    } else {
      fetchTeacherClasses();
    }
  }, [user.role]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchAttendance();
    }
  }, [selectedClass, date]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/class');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchTeacherClasses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/teacher/${user._id}/classes`);
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/attendance/class/${selectedClass}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/attendance?classId=${selectedClass}&date=${date}`);
      const attendanceMap = {};
      response.data.forEach(record => {
        attendanceMap[record.student._id] = record.status;
      });
      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
        student: studentId,
        status
      }));

      await axios.post('http://localhost:5000/api/attendance', {
        class: selectedClass,
        date,
        attendance: attendanceData
      });

      alert('Attendance marked successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Error marking attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Attendance</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                    Class
                  </label>
                  <select
                    id="class"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              {selectedClass && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Mark Attendance</h3>
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student._id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">Admission No: {student.admissionNumber}</p>
                        </div>
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`attendance-${student._id}`}
                              value="present"
                              checked={attendance[student._id] === 'present'}
                              onChange={() => handleAttendanceChange(student._id, 'present')}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">Present</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`attendance-${student._id}`}
                              value="absent"
                              checked={attendance[student._id] === 'absent'}
                              onChange={() => handleAttendanceChange(student._id, 'absent')}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">Absent</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading || !selectedClass || students.length === 0}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {loading ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 