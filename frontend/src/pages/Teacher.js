import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Teacher.css';

export default function Teacher() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    experience: '',
    classes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, []);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/teacher', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTeachers(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch teachers');
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/class');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/teacher', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        qualification: '',
        experience: '',
        classes: []
      });
      fetchTeachers();
    } catch (error) {
      setError('Failed to add teacher');
    }
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/teacher/${teacherId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchTeachers();
        alert('Teacher deleted successfully!');
      } catch (error) {
        console.error('Error deleting teacher:', error);
      }
    }
  };

  const handleClassChange = (classId) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(classId)
        ? prev.classes.filter(id => id !== classId)
        : [...prev.classes, classId]
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="teacher-container">
      <h1>Teachers</h1>
      
      <form onSubmit={handleSubmit} className="teacher-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="qualification">Qualification</label>
          <input
            type="text"
            id="qualification"
            name="qualification"
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience (years)</label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assigned Classes
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {classes.map((cls) => (
              <label key={cls._id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.classes.includes(cls._id)}
                  onChange={() => handleClassChange(cls._id)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {cls.name} - {cls.section}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">Add Teacher</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="teachers-list">
        <h2>Teacher List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Qualification</th>
              <th>Experience</th>
              <th>Classes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id}>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.phone}</td>
                <td>{teacher.subject}</td>
                <td>{teacher.qualification}</td>
                <td>{teacher.experience} years</td>
                <td>{teacher.classes?.map(c => `${c.name}-${c.section}`).join(', ') || 'None'}</td>
                <td>
                  <button
                    onClick={() => handleDelete(teacher._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 