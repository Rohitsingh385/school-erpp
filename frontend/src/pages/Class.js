import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Class.css';

export default function Class() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    teacher: '',
    capacity: ''
  });

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/class', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setClasses(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch classes');
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/teacher', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/class', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFormData({
        name: '',
        section: '',
        teacher: '',
        capacity: ''
      });
      fetchClasses();
    } catch (error) {
      setError('Failed to add class');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/class/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchClasses();
      } catch (error) {
        setError('Failed to delete class');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="class-container">
      <h1>Classes</h1>
      
      <form onSubmit={handleSubmit} className="class-form">
        <div className="form-group">
          <label htmlFor="name">Class Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="section">Section</label>
          <input
            type="text"
            id="section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="teacher">Teacher (Optional)</label>
          <select
            id="teacher"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name} - {teacher.subject}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Add Class</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="classes-list">
        <h2>Class List</h2>
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Section</th>
              <th>Teacher</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls._id}>
                <td>{cls.name}</td>
                <td>{cls.section}</td>
                <td>{cls.teacher ? cls.teacher.name : 'Not Assigned'}</td>
                <td>{cls.capacity}</td>
                <td>
                  <button
                    onClick={() => handleDelete(cls._id)}
                    className="delete-button"
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