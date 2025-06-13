import React, { useState } from 'react';
import axios from 'axios';
import './Admin.css';

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState(null);

  const handleResetData = async () => {
    if (!window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/admin/reset');
      setSuccess('Data reset successfully!');
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error resetting data:', err);
      setError('Failed to reset data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="admin-card">
        <h2>Data Management</h2>
        <div className="admin-actions">
          <button 
            className="btn-danger"
            onClick={handleResetData}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Reset All Data'}
          </button>
        </div>
        
        {stats && (
          <div className="stats-container">
            <h3>New Data Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Classes</span>
                <span className="stat-value">{stats.classes}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Teachers</span>
                <span className="stat-value">{stats.teachers}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Students</span>
                <span className="stat-value">{stats.students}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}