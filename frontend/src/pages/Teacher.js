import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import './Class.css';

export default function Teacher() {
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    subject: '',
    qualification: '',
    experience: '',
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/teacher');
      setTeachers(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching teachers:', error);
      // Use sample data if API fails
      setTeachers([
        { _id: 't1', name: 'John Smith', email: 'john@example.com', contact: '9876543210', subject: 'Mathematics', qualification: 'M.Sc.', experience: 5 },
        { _id: 't2', name: 'Sarah Johnson', email: 'sarah@example.com', contact: '9876543211', subject: 'Science', qualification: 'M.Sc.', experience: 7 },
        { _id: 't3', name: 'Michael Brown', email: 'michael@example.com', contact: '9876543212', subject: 'English', qualification: 'M.A.', experience: 4 },
        { _id: 't4', name: 'Emily Davis', email: 'emily@example.com', contact: '9876543213', subject: 'Social Studies', qualification: 'M.A.', experience: 6 },
        { _id: 't5', name: 'Robert Wilson', email: 'robert@example.com', contact: '9876543214', subject: 'Computer Science', qualification: 'M.Tech.', experience: 3 }
      ]);
    } finally {
      setLoading(false);
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
      // Convert experience to number
      const teacherData = {
        ...formData,
        experience: Number(formData.experience)
      };
      
      await axios.post('http://localhost:5000/api/teacher', teacherData);
      
      setFormData({
        name: '',
        email: '',
        contact: '',
        subject: '',
        qualification: '',
        experience: '',
      });
      
      setIsModalOpen(false);
      fetchTeachers();
    } catch (error) {
      console.error('Error adding teacher:', error);
      const errorMsg = error.response?.data?.message || 'Failed to add teacher. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await axios.delete(`http://localhost:5000/api/teacher/${teacherId}`);
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
        setError('Failed to delete teacher');
      }
    }
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Teacher Management</h1>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            Add New Teacher
          </button>
        </div>
      </div>

      <div className="card">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading teachers...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Subject</th>
                  <th>Qualification</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <tr key={teacher._id}>
                      <td>{teacher.name}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.contact}</td>
                      <td>{teacher.subject}</td>
                      <td>{teacher.qualification}</td>
                      <td>{teacher.experience} years</td>
                      <td>
                        <button
                          onClick={() => handleDelete(teacher._id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No teachers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
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
                  Add New Teacher
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
                      <label>Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Contact *</label>
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Qualification *</label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Experience (years) *</label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
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
                      {loading ? 'Saving...' : 'Add Teacher'}
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