import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function Admission() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    admissionNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    previousSchool: '',
    documents: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/class');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admission?class=${selectedClass}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'documents') {
          formData.documents.forEach(doc => {
            formDataToSend.append('documents', doc);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      formDataToSend.append('class', selectedClass);

      await axios.post('http://localhost:5000/api/admission', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData({
        name: '',
        admissionNumber: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        previousSchool: '',
        documents: []
      });

      fetchStudents();
      alert('Student admitted successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Error admitting student');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admission/${studentId}`);
        fetchStudents();
        alert('Student deleted successfully!');
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...e.target.files]
    }));
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Student Admission</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} - Section {cls.section}
                  </option>
                ))}
              </select>
            </div>

            {selectedClass && (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Student Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="admissionNumber" className="block text-sm font-medium text-gray-700">
                        Admission Number
                      </label>
                      <input
                        type="text"
                        id="admissionNumber"
                        value={formData.admissionNumber}
                        onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        id="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
                        Parent/Guardian Name
                      </label>
                      <input
                        type="text"
                        id="parentName"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">
                        Parent/Guardian Phone
                      </label>
                      <input
                        type="tel"
                        id="parentPhone"
                        value={formData.parentPhone}
                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700">
                        Parent/Guardian Email
                      </label>
                      <input
                        type="email"
                        id="parentEmail"
                        value={formData.parentEmail}
                        onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="previousSchool" className="block text-sm font-medium text-gray-700">
                        Previous School
                      </label>
                      <input
                        type="text"
                        id="previousSchool"
                        value={formData.previousSchool}
                        onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Documents
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 file:text-primary-700
                        hover:file:bg-primary-100"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Upload birth certificate, previous school records, etc.
                    </p>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {loading ? 'Processing...' : 'Admit Student'}
                  </button>
                </form>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Students in Class</h3>
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {students.map((student) => (
                        <li key={student._id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-primary-600">
                                  {student.name}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  Admission No: {student.admissionNumber}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  Parent: {student.parentName} • {student.parentPhone}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  Previous School: {student.previousSchool || 'N/A'}
                                </p>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <button
                                  onClick={() => handleDelete(student._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 