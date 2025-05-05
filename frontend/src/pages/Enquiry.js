import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function Enquiry() {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user.role === 'admin') {
      fetchEnquiries();
    }
  }, [user.role]);

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/enquiry');
      setEnquiries(response.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/enquiry', formData);
      setFormData({ name: '', email: '', phone: '', message: '' });
      if (user.role === 'admin') {
        fetchEnquiries();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting enquiry');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/enquiry/${id}`, { status });
      fetchEnquiries();
    } catch (error) {
      console.error('Error updating enquiry status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await axios.delete(`http://localhost:5000/api/enquiry/${id}`);
        fetchEnquiries();
      } catch (error) {
        console.error('Error deleting enquiry:', error);
      }
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Enquiries</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
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
                {loading ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>

          {user.role === 'admin' && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">All Enquiries</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {enquiries.map((enquiry) => (
                    <li key={enquiry._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary-600 truncate">
                              {enquiry.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {enquiry.email} • {enquiry.phone}
                            </p>
                            <p className="mt-2 text-sm text-gray-700">
                              {enquiry.message}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex space-x-2">
                            <select
                              value={enquiry.status}
                              onChange={(e) => handleStatusChange(enquiry._id, e.target.value)}
                              className="rounded-md border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="converted">Converted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <button
                              onClick={() => handleDelete(enquiry._id)}
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
          )}
        </div>
      </div>
    </div>
  );
} 