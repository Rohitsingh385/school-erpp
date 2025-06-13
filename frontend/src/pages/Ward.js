import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import './Class.css'; // Reusing the Class.css styles

export default function Ward() {
  const [wards, setWards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount: 0
  });

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/ward');
      setWards(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching wards:', error);
      setError('Failed to fetch wards');
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
      await axios.post('http://localhost:5000/api/ward', formData);
      
      setFormData({
        name: '',
        description: '',
        discount: 0
      });
      
      setIsModalOpen(false);
      fetchWards();
    } catch (error) {
      console.error('Error adding ward:', error);
      const errorMsg = error.response?.data?.message || 'Failed to add ward. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (wardId) => {
    if (window.confirm('Are you sure you want to delete this ward?')) {
      try {
        await axios.delete(`http://localhost:5000/api/ward/${wardId}`);
        fetchWards();
      } catch (error) {
        console.error('Error deleting ward:', error);
        setError('Failed to delete ward');
      }
    }
  };

  const filteredWards = wards.filter(ward => 
    ward.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ward.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Ward Management</h1>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search wards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            Add New Ward
          </button>
        </div>
      </div>

      <div className="card">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading wards...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Discount (%)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWards.length > 0 ? (
                  filteredWards.map((ward) => (
                    <tr key={ward._id}>
                      <td>{ward.name}</td>
                      <td>{ward.description}</td>
                      <td>{ward.discount}%</td>
                      <td>
                        <button
                          onClick={() => handleDelete(ward._id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">No wards found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Ward Modal */}
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
                  Add New Ward
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
                      <label>Ward Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Discount Percentage</label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        min="0"
                        max="100"
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
                      {loading ? 'Saving...' : 'Add Ward'}
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