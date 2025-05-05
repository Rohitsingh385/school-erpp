import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function Certificate() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [formData, setFormData] = useState({
    reason: '',
    dateOfLeaving: '',
    remarks: ''
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

  useEffect(() => {
    if (selectedStudent) {
      fetchCertificates();
    }
  }, [selectedStudent]);

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

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/certificate?student=${selectedStudent}`);
      setCertificates(response.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/certificate', {
        ...formData,
        student: selectedStudent
      });

      setFormData({
        reason: '',
        dateOfLeaving: '',
        remarks: ''
      });

      fetchCertificates();
      alert('Transfer certificate generated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Error generating certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/certificate/${certificateId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transfer-certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Transfer Certificate</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                  Class
                </label>
                <select
                  id="class"
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setSelectedStudent('');
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
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
                <label htmlFor="student" className="block text-sm font-medium text-gray-700">
                  Student
                </label>
                <select
                  id="student"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  disabled={!selectedClass}
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.admissionNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedStudent && (
              <>
                <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                      Reason for Leaving
                    </label>
                    <textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="dateOfLeaving" className="block text-sm font-medium text-gray-700">
                      Date of Leaving
                    </label>
                    <input
                      type="date"
                      id="dateOfLeaving"
                      value={formData.dateOfLeaving}
                      onChange={(e) => setFormData({ ...formData, dateOfLeaving: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                      Remarks
                    </label>
                    <textarea
                      id="remarks"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {loading ? 'Generating...' : 'Generate Certificate'}
                  </button>
                </form>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Certificate History</h3>
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {certificates.map((certificate) => (
                        <li key={certificate._id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-primary-600">
                                  Transfer Certificate
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  Date of Leaving: {new Date(certificate.dateOfLeaving).toLocaleDateString()}
                                </p>
                                <p className="mt-2 text-sm text-gray-700">
                                  Reason: {certificate.reason}
                                </p>
                                <p className="mt-1 text-sm text-gray-700">
                                  Remarks: {certificate.remarks}
                                </p>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <button
                                  onClick={() => handleDownload(certificate._id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  Download
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