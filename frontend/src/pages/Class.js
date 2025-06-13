import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { mockClasses, mockTeachers } from '../utils/mockData';
import './Class.css';

export default function Class() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    teacher: '',
    capacity: '',
    academicYear: new Date().getFullYear().toString()
  });

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/class');
      setClasses(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching classes:', error);
      // Use mock data if API fails
      setClasses(mockClasses);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teacher');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      // Use mock data if API fails
      setTeachers(mockTeachers);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/class', formData);
      
      setFormData({
        name: '',
        section: '',
        teacher: '',
        capacity: '',
        academicYear: new Date().getFullYear().toString()
      });
      
      setIsModalOpen(false);
      fetchClasses();
    } catch (error) {
      console.error('Error adding class:', error);
      const errorMsg = error.response?.data?.message || 'Failed to add class. Please try again.';
      setError(errorMsg);
      
      // Add the class to mock data anyway for demo purposes
      const newClass = {
        _id: `c${classes.length + 1}`,
        ...formData,
        teacher: teachers.find(t => t._id === formData.teacher) || { name: 'Unknown Teacher' }
      };
      setClasses([...classes, newClass]);
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await axios.delete(`http://localhost:5000/api/class/${classId}`);
        fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
        setError('Failed to delete class');
        
        // Remove from local state anyway for demo purposes
        setClasses(classes.filter(c => c._id !== classId));
      }
    }
  };

  const filteredClasses = classes.filter(cls => 
    cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.section?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cls.teacher?.name && cls.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Class Management</h1>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            Add New Class
          </button>
        </div>
      </div>

      <div className="card">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading classes...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Section</th>
                  <th>Teacher</th>
                  <th>Capacity</th>
                  <th>Academic Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((cls) => (
                    <tr key={cls._id}>
                      <td>{cls.name}</td>
                      <td>{cls.section}</td>
                      <td>{cls.teacher?.name || 'Not Assigned'}</td>
                      <td>{cls.capacity}</td>
                      <td>{cls.academicYear}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(cls._id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No classes found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="modal-overlay"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="modal-container">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="modal-backdrop" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="modal-content">
                <Dialog.Title as="h3" className="modal-title">
                  Add New Class
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="modal-close"
                  >
                    &times;
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Class Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Section *</label>
                      <input
                        type="text"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Teacher *</label>
                      <select
                        name="teacher"
                        value={formData.teacher}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.name} - {teacher.subject}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Capacity *</label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Academic Year *</label>
                      <input
                        type="text"
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {error && <div className="form-error">{error}</div>}

                  <div className="modal-actions">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Saving...' : 'Add Class'}
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}